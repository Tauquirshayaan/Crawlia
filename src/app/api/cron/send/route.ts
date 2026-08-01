import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { draftEmail } from '@/lib/llm';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import {
  sendViaMailbox,
  buildUnsubscribeUrl,
  buildEmailHtml,
  randomJitterMs,
  type MailboxCredentials,
} from '@/lib/mailer';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function toMailboxCredentials(mailbox: {
  email: string;
  smtpHost: string | null;
  smtpPort: number | null;
  smtpUser: string | null;
  smtpPass: string | null;
}): MailboxCredentials {
  return {
    email: mailbox.email,
    smtpHost: mailbox.smtpHost,
    smtpPort: mailbox.smtpPort,
    smtpUser: mailbox.smtpUser,
    smtpPass: mailbox.smtpPass,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/cron/send
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  // Auth: allow cron secret OR valid user session
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const results: Array<Record<string, unknown>> = [];

  try {
    // =========================================================================
    // 1. Initial emails — APPROVED drafts that haven't been sent yet
    //    Sends from the campaign's assigned mailbox (the user's own SMTP account).
    // =========================================================================
    const pendingDrafts = await prisma.emailDraft.findMany({
      where: { status: 'APPROVED' },
      take: 20,
      include: {
        campaign: { include: { mailbox: true } },
        lead: true,
      },
    });

    for (const draft of pendingDrafts) {
      try {
        if (!draft.lead.email) throw new Error('Lead has no email address');

        const mailbox = draft.campaign.mailbox;
        if (!mailbox) throw new Error(`Campaign ${draft.campaignId} has no mailbox assigned`);

        const unsubscribeUrl = buildUnsubscribeUrl(draft.lead.email);
        const html = buildEmailHtml(draft.body, unsubscribeUrl);

        const { messageId } = await sendViaMailbox(toMailboxCredentials(mailbox), {
          to: draft.lead.email,
          subject: draft.subject,
          text: `${draft.body}\n\nTo unsubscribe, visit: ${unsubscribeUrl}`,
          html,
          unsubscribeUrl,
        });

        await prisma.$transaction([
          prisma.emailDraft.update({ where: { id: draft.id }, data: { status: 'SENT' } }),
          prisma.send.create({
            data: {
              draftId: draft.id,
              mailboxId: mailbox.id,
              messageId,
              status: 'SENT',
              sentAt: new Date(),
            },
          }),
          prisma.campaignLead.upsert({
            where: { campaignId_leadId: { campaignId: draft.campaignId, leadId: draft.leadId } },
            create: { campaignId: draft.campaignId, leadId: draft.leadId, status: 'SENT', step: 1 },
            update: { status: 'SENT', step: 1 },
          }),
          prisma.lead.update({ where: { id: draft.leadId }, data: { status: 'CONTACTED' } }),
          // Track how many emails the mailbox has sent today
          prisma.mailbox.update({
            where: { id: mailbox.id },
            data: { sentToday: { increment: 1 } },
          }),
        ]);

        results.push({ id: draft.id, type: 'initial', status: 'success', messageId });

        // Jitter between sends to avoid machine-timed traffic signatures
        await randomJitterMs(500, 3000);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        await prisma.emailDraft.update({ where: { id: draft.id }, data: { status: 'FAILED' } });
        results.push({ id: draft.id, type: 'initial', status: 'failed', error: message });
      }
    }

    // =========================================================================
    // 2. Follow-up emails — step=1 SENT leads with no reply, 3+ days ago
    // =========================================================================
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

    const readyForFollowUp = await prisma.campaignLead.findMany({
      where: {
        status: 'SENT',
        step: 1,
        updatedAt: { lte: threeDaysAgo },
        lead: {
          replies: { none: {} },
          status: { not: 'BOUNCED' },
        },
      },
      take: 20,
      include: {
        campaign: { include: { mailbox: true } },
        lead: true,
      },
    });

    for (const cl of readyForFollowUp) {
      try {
        if (!cl.lead.email) continue;

        const mailbox = cl.campaign.mailbox;
        if (!mailbox) {
          console.warn(`[send/cron] Campaign ${cl.campaignId} has no mailbox — skipping follow-up`);
          continue;
        }

        const rules = (cl.campaign.scheduleRules as Record<string, unknown>) ?? {};
        const goal = (rules.goal as string) || 'Follow up on our previous outreach';
        const language = (rules.language as string) || 'English';

        const followUpPrompt = `Campaign goal: ${goal}. Write in: ${language}. This is a follow-up email. The lead has not replied to the first email sent 3 days ago. Keep it very short (under 80 words), friendly, and add no new selling — just a gentle bump.`;

        const stubAnalysis = {
          url: cl.lead.websiteUrl,
          seo: {
            title: cl.lead.name || '',
            description: '',
            h1: [] as string[],
            h2: [] as string[],
            structuredDataTypes: [] as string[],
            hasOpenGraph: false,
            hasCanonical: false,
            hasViewportMeta: false,
            altTextCoverage: 0,
            robotsTxtReachable: false,
            sitemapReachable: false,
          },
          performance: { loadTimeMs: 0, totalPageWeightBytes: 0 },
          techStack: { detected: [] as string[] },
          content: { text: '', links: 0, images: 0, imagesWithoutAlt: 0 },
        };

        const { subject, body } = await draftEmail(followUpPrompt, stubAnalysis, [], {
          name: cl.lead.name,
          company: cl.lead.company,
          segment: cl.lead.segment,
        });

        const unsubscribeUrl = buildUnsubscribeUrl(cl.lead.email);
        const html = buildEmailHtml(body, unsubscribeUrl);

        const { messageId } = await sendViaMailbox(toMailboxCredentials(mailbox), {
          to: cl.lead.email,
          subject,
          text: `${body}\n\nTo unsubscribe, visit: ${unsubscribeUrl}`,
          html,
          unsubscribeUrl,
        });

        await prisma.$transaction([
          prisma.campaignLead.update({
            where: { id: cl.id },
            data: { step: 2, status: 'SENT', updatedAt: new Date() },
          }),
          prisma.send.create({
            data: {
              draftId: (await prisma.emailDraft.findFirst({
                where: { campaignId: cl.campaignId, leadId: cl.leadId, status: 'SENT' },
                orderBy: { createdAt: 'desc' },
              }))?.id || 'unknown',
              mailboxId: mailbox.id,
              messageId,
              status: 'SENT',
              sentAt: new Date(),
            },
          }),
          prisma.mailbox.update({
            where: { id: mailbox.id },
            data: { sentToday: { increment: 1 } },
          }),
        ]);

        results.push({ leadId: cl.leadId, type: 'followup', status: 'success', messageId });

        await randomJitterMs(500, 3000);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error(`[send/cron] Follow-up failed for lead ${cl.leadId}:`, message);
        results.push({ leadId: cl.leadId, type: 'followup', status: 'failed', error: message });
      }
    }

    return NextResponse.json({ processed: results.length, results });
  } catch (err) {
    console.error('[send/cron] Fatal error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
