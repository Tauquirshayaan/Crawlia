/**
 * src/lib/mailer.ts
 *
 * Shared nodemailer transport helper.
 * Used by both the Inngest runCampaignSends function and the cron/send route
 * so there is exactly ONE sending path — always through the user's own mailbox,
 * never through the platform's Resend account.
 *
 * Architecture note: the PRD (§8.7) requires emails to be sent from the user's
 * connected mailbox. Sending via a central Resend key would mean all emails
 * appear to come from the platform's domain, destroying deliverability and
 * breaking the core user-trust proposition.
 */

import nodemailer from 'nodemailer';

export interface MailboxCredentials {
  email: string;
  smtpHost: string | null;
  smtpPort: number | null;
  smtpUser: string | null;
  smtpPass: string | null;
}

export interface SendMailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
  /** One-click unsubscribe URL — added as a List-Unsubscribe header (CAN-SPAM / GDPR requirement) */
  unsubscribeUrl?: string;
}

export interface SendMailResult {
  messageId: string;
}

// ─── Unsubscribe URL helper ───────────────────────────────────────────────────

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export function buildUnsubscribeUrl(email: string): string {
  return `${APP_URL}/api/leads/unsubscribe?email=${encodeURIComponent(email)}`;
}

// ─── HTML builder ─────────────────────────────────────────────────────────────

export function buildEmailHtml(body: string, unsubscribeUrl: string): string {
  const escaped = body
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br/>');

  return `<p style="font-family:sans-serif;line-height:1.6;color:#1a1a1a;max-width:600px">${escaped}</p>
<br/><br/>
<p style="font-size:11px;color:#888;max-width:600px">
  To stop receiving these emails,&nbsp;
  <a href="${unsubscribeUrl}" style="color:#888">click here to unsubscribe</a>.
</p>`;
}

// ─── Core send function ───────────────────────────────────────────────────────

/**
 * Send one email via the user's connected SMTP mailbox.
 * Falls back to a console mock when smtpHost is not configured (dev/test mode).
 */
export async function sendViaMailbox(
  mailbox: MailboxCredentials,
  opts: SendMailOptions,
): Promise<SendMailResult> {
  // Mock mode — no SMTP credentials configured
  if (!mailbox.smtpHost || !mailbox.smtpUser || !mailbox.smtpPass) {
    const messageId = `mock_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    console.log(
      `[mailer:mock] From: ${mailbox.email} | To: ${opts.to} | Subject: ${opts.subject} | messageId: ${messageId}`,
    );
    return { messageId };
  }

  const transporter = nodemailer.createTransport({
    host: mailbox.smtpHost,
    port: mailbox.smtpPort ?? 587,
    secure: mailbox.smtpPort === 465,
    auth: {
      user: mailbox.smtpUser,
      pass: mailbox.smtpPass,
    },
    // Reasonable timeouts — don't let a slow SMTP server block the queue
    connectionTimeout: 10_000,
    greetingTimeout: 5_000,
    socketTimeout: 15_000,
  });

  const headers: Record<string, string> = {};
  if (opts.unsubscribeUrl) {
    // RFC 8058 one-click unsubscribe
    headers['List-Unsubscribe'] = `<${opts.unsubscribeUrl}>`;
    headers['List-Unsubscribe-Post'] = 'List-Unsubscribe=One-Click';
  }

  const info = await transporter.sendMail({
    from: `"${mailbox.email}" <${mailbox.email}>`,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
    headers,
  });

  return { messageId: info.messageId as string };
}

// ─── Random jitter helper (avoid machine-timed send bursts) ──────────────────

export function randomJitterMs(minMs = 500, maxMs = 4000): Promise<void> {
  const delay = minMs + Math.random() * (maxMs - minMs);
  return new Promise((resolve) => setTimeout(resolve, delay));
}
