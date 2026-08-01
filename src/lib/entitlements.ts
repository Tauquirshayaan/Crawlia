/**
 * src/lib/entitlements.ts
 * 
 * Entitlement guard — every protected feature must call checkEntitlement()
 * before processing. This is the single enforcement point for:
 *   - Plan limits (campaigns, mailboxes, team members)
 *   - Credit balance
 *   - Subscription status
 */
import { NextResponse } from 'next/server';
import { prisma } from './prisma';
import { getPlan } from './plans';
import { getBalance } from './ledger';

export class EntitlementError extends Error {
  readonly status: number;
  readonly code: string;
  constructor(message: string, code: string, status = 402) {
    super(message);
    this.name = 'EntitlementError';
    this.code = code;
    this.status = status;
  }
}

export type EntitlementFeature =
  | 'WEBSITE_ANALYSIS'
  | 'CREATE_CAMPAIGN'
  | 'ADD_MAILBOX'
  | 'INVITE_MEMBER'
  | 'BULK_IMPORT';

interface EntitlementResult {
  allowed: boolean;
  balance: number;
  planId: string;
}

/**
 * Check whether a workspace is entitled to perform a feature.
 * Throws EntitlementError if any check fails.
 * 
 * @param workspaceId - The workspace to check
 * @param feature - The feature being requested
 * @param creditsRequired - How many credits this action requires (default: 0 = no credit check)
 */
export async function checkEntitlement(
  workspaceId: string,
  feature: EntitlementFeature,
  creditsRequired = 0,
): Promise<EntitlementResult> {
  // Load workspace with subscription
  const workspace = await prisma.workspace.findUnique({
    where: { id: workspaceId },
    select: {
      tier: true,
      subscription: {
        select: { status: true, planId: true, plan: { select: { name: true } } }
      }
    }
  });

  if (!workspace) {
    throw new EntitlementError('Workspace not found', 'WORKSPACE_NOT_FOUND', 404);
  }

  const planId = workspace.tier as string;
  const plan = getPlan(planId);
  const subStatus = workspace.subscription?.status ?? 'ACTIVE';

  // Subscription status checks (FREE plan bypasses these — no subscription needed)
  if (planId !== 'FREE' && subStatus === 'PAST_DUE') {
    throw new EntitlementError(
      'Your subscription payment failed. Please update your payment method.',
      'SUBSCRIPTION_PAST_DUE',
      402,
    );
  }
  if (planId !== 'FREE' && subStatus === 'CANCELED') {
    throw new EntitlementError(
      'Your subscription has been canceled. Please resubscribe to continue.',
      'SUBSCRIPTION_CANCELED',
      402,
    );
  }

  // Feature-specific plan limit checks
  switch (feature) {
    case 'CREATE_CAMPAIGN': {
      if (plan.maxCampaigns !== -1) {
        const count = await prisma.campaign.count({ where: { workspaceId } });
        if (count >= plan.maxCampaigns) {
          throw new EntitlementError(
            `Your ${plan.displayName} plan allows up to ${plan.maxCampaigns} campaign${plan.maxCampaigns !== 1 ? 's' : ''}. Upgrade to create more.`,
            'CAMPAIGN_LIMIT_REACHED',
            402,
          );
        }
      }
      break;
    }
    case 'ADD_MAILBOX': {
      // FREE plan has 0 mailboxes allowed
      if (plan.maxMailboxes === 0) {
        throw new EntitlementError(
          `Your ${plan.displayName} plan does not include Gmail/Outlook mailboxes. Upgrade to Basic or higher.`,
          'MAILBOX_NOT_AVAILABLE',
          402,
        );
      }
      if (plan.maxMailboxes !== -1) {
        const count = await prisma.mailbox.count({
          where: { workspaceId, provider: { in: ['google', 'outlook'] } }
        });
        if (count >= plan.maxMailboxes) {
          throw new EntitlementError(
            `Your ${plan.displayName} plan allows up to ${plan.maxMailboxes} Gmail/Outlook mailbox${plan.maxMailboxes !== 1 ? 'es' : ''}. Upgrade to add more.`,
            'MAILBOX_LIMIT_REACHED',
            402,
          );
        }
      }
      break;
    }
    case 'INVITE_MEMBER': {
      if (!plan.canInviteMembers) {
        throw new EntitlementError(
          `Team collaboration requires the Pro plan or higher.`,
          'TEAM_INVITE_NOT_AVAILABLE',
          402,
        );
      }
      if (plan.maxTeamMembers !== -1) {
        const count = await prisma.workspaceMember.count({ where: { workspaceId } });
        if (count >= plan.maxTeamMembers) {
          throw new EntitlementError(
            `Your plan allows up to ${plan.maxTeamMembers} team members.`,
            'TEAM_MEMBER_LIMIT_REACHED',
            402,
          );
        }
      }
      break;
    }
    case 'WEBSITE_ANALYSIS':
    case 'BULK_IMPORT': {
      // Credit check is handled below via creditsRequired parameter
      break;
    }
  }

  // Credit balance check (applies to any feature with a credit cost)
  if (creditsRequired > 0) {
    const balance = await getBalance(workspaceId);
    if (balance < creditsRequired) {
      throw new EntitlementError(
        `Insufficient credits. You have ${balance} credit${balance !== 1 ? 's' : ''} but this action requires ${creditsRequired}. Top up or upgrade your plan.`,
        'INSUFFICIENT_CREDITS',
        402,
      );
    }
    return { allowed: true, balance, planId };
  }

  const balance = await getBalance(workspaceId);
  return { allowed: true, balance, planId };
}

/**
 * Helper: Convert an EntitlementError into a JSON 402 NextResponse.
 * Use in route handlers to avoid try/catch boilerplate.
 */
export function entitlementErrorResponse(err: EntitlementError) {
  return NextResponse.json(
    {
      error: err.message,
      code: err.code,
      upgradeRequired: true,
    },
    { status: err.status },
  );
}
