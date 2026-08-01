/**
 * src/lib/usage.ts
 * 
 * Usage tracking — records every credit-consuming action with a full audit trail.
 * Called AFTER a successful operation, never before.
 */
import { prisma } from './prisma';
import { getBalance } from './ledger';

export type UsageFeature =
  | 'WEBSITE_ANALYSIS'
  | 'EMAIL_DRAFT'
  | 'CAMPAIGN_CREATE'
  | 'LEAD_IMPORT';

interface TrackUsageOptions {
  workspaceId: string;
  feature: UsageFeature;
  creditsUsed: number;
  resourceId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Record a usage event after a successful credit-consuming operation.
 * Also keeps the denormalized Workspace.creditsBalance in sync.
 */
export async function trackUsage(opts: TrackUsageOptions): Promise<void> {
  const { workspaceId, feature, creditsUsed, resourceId, metadata } = opts;

  if (creditsUsed === 0) return; // nothing to track

  const balanceAfter = await getBalance(workspaceId);

  await prisma.$transaction([
    prisma.usageRecord.create({
      data: {
        workspaceId,
        feature,
        resourceId: resourceId ?? null,
        creditsUsed,
        balanceAfter,
        status: 'SUCCESS',
        metadata: metadata ? metadata as unknown as import('@/generated/prisma/client').Prisma.InputJsonValue : undefined,
      },
    }),
    // Keep denormalized balance in sync
    prisma.workspace.update({
      where: { id: workspaceId },
      data: { creditsBalance: balanceAfter },
    }),
  ]);
}

/**
 * Get paginated usage records for a workspace (for billing UI credit history).
 */
export async function getUsageHistory(workspaceId: string, take = 50) {
  return prisma.usageRecord.findMany({
    where: { workspaceId },
    orderBy: { createdAt: 'desc' },
    take,
  });
}
