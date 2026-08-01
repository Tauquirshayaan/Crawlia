import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthContext, AuthError } from '@/lib/session';
import { checkEntitlement, EntitlementError, entitlementErrorResponse } from '@/lib/entitlements';

export async function GET(_req: NextRequest) {
  try {
    const { workspaceId } = await getAuthContext();

    const campaigns = await prisma.campaign.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { campaignLeads: true, emailDrafts: true } },
      },
    });

    return NextResponse.json(campaigns);
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error('GET /api/campaigns error:', err);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { workspaceId } = await getAuthContext();
    const body = await req.json();

    const {
      name,
      mode,
      language,
      goal,
      qualityThreshold,
      unreachable,
      noWebsite,
      fallbackText,
      includeName,
      includeLastName,
      includeCompany,
      includeLocation,
      mailboxId,
      templateSubject,
      templateBody,
      leads,
    } = body;

    if (!name) {
      return NextResponse.json({ error: 'Campaign name is required' }, { status: 400 });
    }

    // ── Entitlement guard ─────────────────────────────────────────────────────
    try {
      await checkEntitlement(workspaceId, 'CREATE_CAMPAIGN');
    } catch (err) {
      if (err instanceof EntitlementError) return entitlementErrorResponse(err);
      throw err;
    }

    const scheduleRules = {
      mode,
      qualityThreshold,
      unreachable,
      noWebsite,
      fallbackText,
      templateBody,
      personalization: { includeName, includeLastName, includeCompany, includeLocation },
    };

    const campaign = await prisma.campaign.create({
      data: {
        workspaceId,
        name,
        status: body.status || 'DRAFT',
        mailboxId: mailboxId || null,
        type: mode === 'smart' ? 'SMART' : 'GENERAL',
        language: language || 'English',
        goal: goal || null,
        subject: templateSubject || null,
        rules: scheduleRules,
        scheduleRules, // Keeping this for backward compatibility for now
      },
    });

    if (Array.isArray(leads) && leads.length > 0) {
      // ── Deduplication: upsert each lead by (workspaceId, dedupeKey) ──────────
      // dedupeKey = normalized root domain (strips protocol, www, path, trailing slash)
      // This prevents double-importing and double-charging for the same website.
      const normalizeDedupeKey = (url: string, email?: string): string => {
        try {
          const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
          const host = parsed.hostname.replace(/^www\./, '');
          return host.toLowerCase();
        } catch {
          return email?.toLowerCase() ?? url.toLowerCase();
        }
      };

      const upsertedLeadIds: string[] = [];

      for (const l of leads as Array<{
        email?: string;
        name?: string;
        websiteUrl?: string;
        website?: string;
        company?: string;
        segment?: string;
      }>) {
        const websiteUrl = l.websiteUrl || l.website || '';
        const dedupeKey = normalizeDedupeKey(websiteUrl, l.email);

        const lead = await prisma.lead.upsert({
          where: { workspaceId_dedupeKey: { workspaceId, dedupeKey } },
          create: {
            workspaceId,
            email: l.email || null,
            name: l.name || null,
            company: l.company || null,
            websiteUrl: websiteUrl || 'unknown',
            segment: l.segment || null,
            dedupeKey,
            status: 'NEW',
            score: 0,
          },
          update: {
            // On re-import: update contact info but DO NOT reset status/score
            email: l.email || undefined,
            name: l.name || undefined,
            company: l.company || undefined,
            segment: l.segment || undefined,
          },
          select: { id: true },
        });

        upsertedLeadIds.push(lead.id);
      }

      await prisma.campaignLead.createMany({
        data: upsertedLeadIds.map((leadId) => ({
          campaignId: campaign.id,
          leadId,
          status: 'ENROLLED',
          step: 1,
        })),
        skipDuplicates: true,
      });
    }

    if (campaign.status === 'RUNNING') {
      const { inngest } = await import('@/inngest/client');
      await inngest.send({
        name: 'campaign.process',
        data: { campaignId: campaign.id }
      });
    }

    return NextResponse.json({ success: true, campaignId: campaign.id, campaign });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error('POST /api/campaigns error:', err);
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}
