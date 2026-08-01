/**
 * GET /api/billing/status
 * 
 * Returns current billing status for the authenticated workspace.
 * Used by the billing UI to show subscription state, credits, history.
 */
import { NextResponse } from 'next/server';
import { getAuthContext, AuthError } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { getBalance } from '@/lib/ledger';
import { getPlan } from '@/lib/plans';

export async function GET() {
  try {
    const { workspaceId } = await getAuthContext();

    const [workspace, balance, subscription, recentUsage, recentInvoices, recentTopUps] = await Promise.all([
      prisma.workspace.findUnique({
        where: { id: workspaceId },
        select: { id: true, tier: true, name: true, stripeId: true },
      }),
      getBalance(workspaceId),
      prisma.subscription.findUnique({
        where: { workspaceId },
        include: { plan: true },
      }),
      prisma.usageRecord.findMany({
        where: { workspaceId },
        orderBy: { createdAt: 'desc' },
        take: 25,
      }),
      prisma.invoice.findMany({
        where: { workspaceId },
        orderBy: { createdAt: 'desc' },
        take: 12,
      }),
      prisma.creditTopUp.findMany({
        where: { workspaceId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    const plan = getPlan(workspace.tier);

    return NextResponse.json({
      workspace: {
        id: workspace.id,
        name: workspace.name,
        tier: workspace.tier,
      },
      plan: {
        id: plan.id,
        displayName: plan.displayName,
        monthlyCredits: plan.monthlyCredits,
        rolloverCap: plan.rolloverCap,
        maxCampaigns: plan.maxCampaigns,
        maxMailboxes: plan.maxMailboxes,
        maxTeamMembers: plan.maxTeamMembers,
        canInviteMembers: plan.canInviteMembers,
        monthlyPrice: plan.monthlyPrice,
        annualPrice: plan.annualPrice,
        features: plan.features,
      },
      credits: {
        balance,
        allocated: plan.monthlyCredits,
        rolloverCap: plan.rolloverCap,
        maxBalance: plan.rolloverCap + plan.monthlyCredits,
        usedPercent: plan.monthlyCredits > 0 ? Math.round((1 - balance / plan.monthlyCredits) * 100) : 0,
      },
      subscription: subscription
        ? {
            status: subscription.status,
            interval: subscription.interval,
            currentPeriodStart: subscription.currentPeriodStart,
            currentPeriodEnd: subscription.currentPeriodEnd,
            cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
            planDisplayName: subscription.plan.displayName,
          }
        : null,
      usageHistory: recentUsage,
      invoices: recentInvoices,
      topUps: recentTopUps,
    });

  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('[Billing Status]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
