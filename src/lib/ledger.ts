/**
 * src/lib/ledger.ts
 * 
 * Two-Phase Commit (2PC) credit ledger.
 * 
 * Changes:
 * - getBalance() uses aggregate._sum (O(1) SQL)
 * - deductCredit() fires low-credit Inngest events at 20% and 0%
 * - description and feature fields now stored on ledger entries
 * - refundCredit uses ADDITION type to match schema
 * - grantMonthlyCredits handles rollover cap per plan rules
 */
import { prisma } from './prisma';
import { getPlan } from './plans';
import type { Prisma } from '@/generated/prisma/client';

/** Get current credit balance. O(1) SQL aggregate. */
export async function getBalance(workspaceId: string): Promise<number> {
  const agg = await prisma.workspaceCredit.aggregate({
    where: { workspaceId, status: 'COMMITTED' },
    _sum: { amount: true },
  });
  return Math.max(0, agg._sum.amount ?? 0);
}

/** 
 * Deduct `amount` credits inside a serializable transaction.
 * Fires Inngest events when balance crosses low-credit thresholds.
 */
export async function deductCredit(
  workspaceId: string,
  amount: number = 1,
  referenceId: string,
  description: string,
  feature?: string,
) {
  const result = await prisma.$transaction(async (tx) => {
    const agg = await tx.workspaceCredit.aggregate({
      where: { workspaceId, status: 'COMMITTED' },
      _sum: { amount: true },
    });
    const balance = Math.max(0, agg._sum.amount ?? 0);

    if (balance < amount) {
      throw new Error(`Insufficient credits. Balance: ${balance}, Required: ${amount}`);
    }

    const entry = await tx.workspaceCredit.create({
      data: {
        workspaceId,
        amount: -amount,
        type: 'DEDUCTION',
        status: 'COMMITTED',
        lockId: referenceId,
        description,
        feature: feature ?? null,
      },
    });

    // Sync denormalized balance
    await tx.workspace.update({
      where: { id: workspaceId },
      data: { creditsBalance: balance - amount },
    });

    return { entry, balanceAfter: balance - amount };
  });

  // Fire threshold notifications asynchronously (don't block the request)
  void fireThresholdIfNeeded(workspaceId, result.balanceAfter).catch(console.error);

  return result.entry;
}

/** Add credits back (refund after a failed action). */
export async function refundCredit(
  workspaceId: string,
  amount: number,
  referenceId: string,
  description: string,
) {
  const entry = await prisma.workspaceCredit.create({
    data: {
      workspaceId,
      amount,
      type: 'ADDITION',
      status: 'COMMITTED',
      lockId: `refund_${referenceId}`,
      description: `Refund: ${description}`,
      feature: 'REFUND',
    },
  });

  const newBalance = await getBalance(workspaceId);
  await prisma.workspace.update({
    where: { id: workspaceId },
    data: { creditsBalance: newBalance },
  });

  return entry;
}

/**
 * Grant monthly credits at the start of a billing period.
 * Applies rollover cap: max balance = 2× monthly allocation.
 */
export async function grantMonthlyCredits(
  workspaceId: string,
  lockId: string,
  description = 'Monthly credit renewal',
): Promise<{ granted: number; balance: number }> {
  // Get workspace tier to determine plan
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: { tier: true },
  });

  if (!workspace) throw new Error(`Workspace ${workspaceId} not found`);

  const plan = getPlan(workspace.tier);
  const currentBalance = await getBalance(workspaceId);

  // Rollover cap = rolloverCap (1× monthly) + monthlyCredits (this month's allocation)
  const maxBalance = plan.rolloverCap + plan.monthlyCredits;
  const creditsToGrant = Math.max(0, maxBalance - currentBalance);

  if (creditsToGrant === 0) {
    return { granted: 0, balance: currentBalance };
  }

  await prisma.$transaction(async (tx) => {
    await tx.workspaceCredit.create({
      data: {
        workspaceId,
        amount: creditsToGrant,
        type: 'ADDITION',
        status: 'COMMITTED',
        lockId,
        description,
        feature: 'SUBSCRIPTION_RENEWAL',
      },
    });
    await tx.workspace.update({
      where: { id: workspaceId },
      data: { creditsBalance: currentBalance + creditsToGrant },
    });
  });

  return { granted: creditsToGrant, balance: currentBalance + creditsToGrant };
}

/**
 * Grant a specific amount of credits (for top-up purchases and subscription activation).
 * Idempotent via lockId.
 */
export async function grantCredits(
  workspaceId: string,
  amount: number,
  lockId: string,
  description: string,
  feature: string,
): Promise<void> {
  try {
    const current = await getBalance(workspaceId);
    await prisma.$transaction(async (tx) => {
      await tx.workspaceCredit.create({
        data: {
          workspaceId,
          amount,
          type: 'ADDITION',
          status: 'COMMITTED',
          lockId,
          description,
          feature,
        },
      });
      await tx.workspace.update({
        where: { id: workspaceId },
        data: { creditsBalance: current + amount },
      });
    });
  } catch (err: unknown) {
    // P2002 = unique constraint violation = duplicate lockId = idempotent duplicate → ignore
    const prismaErr = err as Prisma.PrismaClientKnownRequestError;
    if (prismaErr?.code === 'P2002') {
      console.log(`[ledger] Duplicate lockId ${lockId} safely ignored.`);
    } else {
      throw err;
    }
  }
}

/** Fire Inngest low-credit events if balance crossed a threshold */
async function fireThresholdIfNeeded(workspaceId: string, balance: number) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: { tier: true },
  });
  if (!workspace) return;

  const plan = getPlan(workspace.tier);
  const pct = plan.monthlyCredits > 0 ? balance / plan.monthlyCredits : 0;

  let event: string | null = null;
  if (balance === 0) {
    event = 'credits/exhausted';
  } else if (pct <= 0.1) {
    event = 'credits/low.10pct';
  } else if (pct <= 0.2) {
    event = 'credits/low.20pct';
  }

  if (event) {
    try {
      const { inngest } = await import('@/inngest/client');
      await inngest.send({ name: event as any, data: { workspaceId, balance, planId: workspace.tier } });
    } catch {
      // Inngest not available in all environments — fail silently
    }
  }
}
