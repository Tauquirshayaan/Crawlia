import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthContext, AuthError } from '@/lib/session';
import { checkEntitlement, EntitlementError, entitlementErrorResponse } from '@/lib/entitlements';

export async function GET(_req: NextRequest) {
  try {
    const { workspaceId } = await getAuthContext();

    const mailboxes = await prisma.mailbox.findMany({
      where: { workspaceId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(mailboxes);
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error('GET /api/mailboxes error:', err);
    return NextResponse.json({ error: 'Failed to fetch mailboxes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { workspaceId } = await getAuthContext();
    const body = await req.json();
    const { 
      email, provider, 
      smtpHost, smtpPort, smtpUser, smtpPass,
      imapHost, imapPort, imapUser, imapPass
    } = body;

    if (!email || !provider) {
      return NextResponse.json({ error: 'Email and provider are required' }, { status: 400 });
    }

    // ── Entitlement guard (only Gmail/Outlook count toward plan limit) ────────
    if (['google', 'outlook'].includes(provider)) {
      try {
        await checkEntitlement(workspaceId, 'ADD_MAILBOX');
      } catch (err) {
        if (err instanceof EntitlementError) return entitlementErrorResponse(err);
        throw err;
      }
    }

    const newMailbox = await prisma.mailbox.create({
      data: {
        workspaceId,
        email,
        provider,
        smtpHost,
        smtpPort,
        smtpUser,
        smtpPass,
        imapHost,
        imapPort,
        imapUser,
        imapPass,
        status: 'CONNECTED',
        health: 100,
        dailyLimit: 50,
        sentToday: 0,
      },
    });

    return NextResponse.json(newMailbox);
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error('POST /api/mailboxes error:', err);
    return NextResponse.json({ error: 'Failed to create mailbox' }, { status: 500 });
  }
}
