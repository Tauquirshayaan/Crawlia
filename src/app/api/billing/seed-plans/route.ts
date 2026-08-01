/**
 * POST /api/billing/seed-plans
 * 
 * Seeds the Plan table with current plan definitions from plans.ts.
 * Safe to call multiple times (upsert). Run once after DB setup.
 * Should be called in your deployment/seed script.
 */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PLANS } from '@/lib/plans';

export async function POST(req: Request) {
  // Protect with CRON_SECRET so only CI/deploy scripts can call this in production
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && req.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const results = [];

  for (const [key, plan] of Object.entries(PLANS)) {
    const record = await prisma.plan.upsert({
      where: { name: key },
      create: {
        name: key,
        displayName: plan.displayName,
        monthlyCredits: plan.monthlyCredits,
        rolloverCap: plan.rolloverCap,
        maxCampaigns: plan.maxCampaigns,
        maxMailboxes: plan.maxMailboxes,
        maxTeamMembers: plan.maxTeamMembers === -1 ? 9999 : plan.maxTeamMembers,
        canInviteMembers: plan.canInviteMembers,
        monthlyPrice: plan.monthlyPrice,
        annualPrice: plan.annualPrice,
        stripePriceIdMonthly: plan.stripePriceIdMonthly ?? null,
        stripePriceIdAnnual: plan.stripePriceIdAnnual ?? null,
      },
      update: {
        displayName: plan.displayName,
        monthlyCredits: plan.monthlyCredits,
        rolloverCap: plan.rolloverCap,
        maxCampaigns: plan.maxCampaigns,
        maxMailboxes: plan.maxMailboxes,
        maxTeamMembers: plan.maxTeamMembers === -1 ? 9999 : plan.maxTeamMembers,
        canInviteMembers: plan.canInviteMembers,
        monthlyPrice: plan.monthlyPrice,
        annualPrice: plan.annualPrice,
        stripePriceIdMonthly: plan.stripePriceIdMonthly ?? null,
        stripePriceIdAnnual: plan.stripePriceIdAnnual ?? null,
      },
    });
    results.push(record.name);
  }

  return NextResponse.json({ seeded: results });
}

export async function GET() {
  const plans = await prisma.plan.findMany({ orderBy: { monthlyPrice: 'asc' } });
  return NextResponse.json({ plans });
}
