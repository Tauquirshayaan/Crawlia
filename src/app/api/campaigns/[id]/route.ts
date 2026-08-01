import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthContext, AuthError } from '@/lib/session';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { workspaceId } = await getAuthContext();

    const campaign = await prisma.campaign.findFirst({
      where: { id, workspaceId },
      include: {
        mailbox: true,
        campaignLeads: {
          include: { lead: true }
        },
        emailDrafts: {
          include: { sends: true }
        }
      }
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    return NextResponse.json(campaign);
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error(`GET /api/campaigns/[id] error:`, err);
    return NextResponse.json({ error: 'Failed to fetch campaign' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { workspaceId } = await getAuthContext();
    const body = await req.json();

    const campaign = await prisma.campaign.findFirst({
      where: { id, workspaceId },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

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
      status
    } = body;

    const scheduleRules = {
      mode,
      qualityThreshold,
      unreachable,
      noWebsite,
      fallbackText,
      templateBody,
      personalization: { includeName, includeLastName, includeCompany, includeLocation },
    };

    const updated = await prisma.campaign.update({
      where: { id },
      data: {
        name,
        status: status || campaign.status,
        mailboxId: mailboxId || campaign.mailboxId,
        type: mode === 'smart' ? 'SMART' : 'GENERAL',
        language: language || 'English',
        goal: goal || null,
        subject: templateSubject || null,
        rules: scheduleRules,
        scheduleRules, // Keeping this for backward compatibility for now
      },
    });

    if (updated.status === 'RUNNING' && campaign.status !== 'RUNNING') {
      const { inngest } = await import('@/inngest/client');
      await inngest.send({
        name: 'campaign.process',
        data: { campaignId: updated.id }
      });
    }

    return NextResponse.json({ success: true, campaign: updated });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error(`PUT /api/campaigns error:`, err);
    return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { workspaceId } = await getAuthContext();

    const campaign = await prisma.campaign.findFirst({
      where: { id, workspaceId },
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Delete associated enrolled leads first
    await prisma.campaignLead.deleteMany({
      where: { campaignId: id }
    });
    
    // Delete drafts
    await prisma.emailDraft.deleteMany({
      where: { campaignId: id }
    });

    await prisma.campaign.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error(`DELETE /api/campaigns error:`, err);
    return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 });
  }
}
