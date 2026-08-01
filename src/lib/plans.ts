/**
 * src/lib/plans.ts
 * 
 * Single source of truth for all plan definitions.
 * Readable by both server (API routes, webhooks) and client (billing UI).
 * 
 * BUSINESS RULES (from docs):
 * - 1 credit = 1 website analysis + AI email generation (only for SMART campaigns)
 * - Sending, follow-ups, reply tracking = FREE (no credit cost)
 * - Credits roll over up to 1x monthly allocation (rolloverCap = monthlyCredits)
 * - FREE plan: 20 credits/month, no team invites, no mailboxes
 */

export type PlanId = "FREE" | "BASIC" | "PRO" | "AGENCY";

export interface PlanConfig {
  id: PlanId;
  displayName: string;
  description: string;
  monthlyCredits: number;
  rolloverCap: number;       // max credits that carry over = 1× monthly
  maxCampaigns: number;      // -1 = unlimited
  maxMailboxes: number;
  maxTeamMembers: number;    // -1 = unlimited
  canInviteMembers: boolean;
  monthlyPrice: number;      // USD/month billed monthly
  annualPrice: number;       // USD/month billed annually (~20% off)
  // Stripe Price IDs — set via env vars (populated at runtime in billing routes)
  stripePriceIdMonthly?: string;
  stripePriceIdAnnual?: string;
  features: string[];
  popular?: boolean;
  theme?: "light" | "dark";
}

export const PLANS: Record<PlanId, PlanConfig> = {
  FREE: {
    id: "FREE",
    displayName: "Free",
    description: "Test and validate Crawlia with a small credit allocation.",
    monthlyCredits: 20,
    rolloverCap: 20,
    maxCampaigns: 1,
    maxMailboxes: 0,
    maxTeamMembers: 1,
    canInviteMembers: false,
    monthlyPrice: 0,
    annualPrice: 0,
    features: [
      "20 credits / month",
      "1 campaign",
      "Reply tracking",
      "CRM pipeline",
      "Dashboard analytics",
    ],
    theme: "light",
  },
  BASIC: {
    id: "BASIC",
    displayName: "Basic",
    description: "Perfect for individuals starting with automated outreach.",
    monthlyCredits: 600,
    rolloverCap: 600,
    maxCampaigns: 5,
    maxMailboxes: 1,
    maxTeamMembers: 1,
    canInviteMembers: false,
    monthlyPrice: 49,
    annualPrice: 39, // ~20% off
    stripePriceIdMonthly: process.env.STRIPE_PRICE_BASIC_MONTHLY,
    stripePriceIdAnnual: process.env.STRIPE_PRICE_BASIC_ANNUAL,
    features: [
      "600 credits / month (rollover up to 1,200)",
      "5 campaigns",
      "1 Gmail/Outlook mailbox",
      "Unlimited SMTP mailboxes",
      "Tracking: opens, clicks & replies",
      "Standard outreach unlimited",
    ],
    theme: "light",
  },
  PRO: {
    id: "PRO",
    displayName: "Pro",
    description: "For growing teams needing higher volume and more mailboxes.",
    monthlyCredits: 1100,
    rolloverCap: 1100,
    maxCampaigns: 20,
    maxMailboxes: 2,
    maxTeamMembers: -1, // unlimited
    canInviteMembers: true,
    monthlyPrice: 99,
    annualPrice: 79,
    stripePriceIdMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    stripePriceIdAnnual: process.env.STRIPE_PRICE_PRO_ANNUAL,
    features: [
      "1,100 credits / month (rollover up to 2,200)",
      "20 campaigns",
      "2 Gmail/Outlook mailboxes",
      "Unlimited team members",
      "Automatically reply sorting",
      "Drafts & scheduled send",
      "Google Sheets integration",
      "Priority support",
    ],
    popular: true,
    theme: "light",
  },
  AGENCY: {
    id: "AGENCY",
    displayName: "Agency",
    description: "Scale your agency with massive limits and premium features.",
    monthlyCredits: 3000,
    rolloverCap: 3000,
    maxCampaigns: -1, // unlimited
    maxMailboxes: 10,
    maxTeamMembers: -1, // unlimited
    canInviteMembers: true,
    monthlyPrice: 249,
    annualPrice: 199,
    stripePriceIdMonthly: process.env.STRIPE_PRICE_AGENCY_MONTHLY,
    stripePriceIdAnnual: process.env.STRIPE_PRICE_AGENCY_ANNUAL,
    features: [
      "3,000 credits / month (rollover up to 6,000)",
      "Unlimited campaigns",
      "10 Gmail/Outlook mailboxes",
      "Unlimited team members",
      "Fallback handling for unavailable sites",
      "Multiple languages",
      "Dedicated Account Manager",
      "White-label reports",
    ],
    theme: "dark",
  },
};

/** Credit cost per feature action */
export const CREDIT_COSTS = {
  WEBSITE_ANALYSIS: 1,  // website scrape + AI email draft together = 1 credit
  EMAIL_DRAFT: 0,       // drafts from existing analysis = free
  CAMPAIGN_CREATE: 0,   // creating a campaign = free
  LEAD_IMPORT: 0,       // importing leads = free
  REPLY_CLASSIFY: 0,    // classifying replies = free
} as const;

export type CreditFeature = keyof typeof CREDIT_COSTS;

/** Credit thresholds for low-balance warnings (as % of plan monthly credits) */
export const LOW_CREDIT_THRESHOLDS = [0.2, 0.1, 0] as const; // 20%, 10%, 0%

/** Get plan config by tier string (case-insensitive) */
export function getPlan(tier: string): PlanConfig {
  const key = tier.toUpperCase() as PlanId;
  return PLANS[key] ?? PLANS.FREE;
}

/** Credit bundle top-up packages (one-time purchases, no subscription) */
export const CREDIT_TOPUP_PACKAGES = [
  { id: "topup_100",  credits: 100,  priceUsd: 5,   label: "100 credits",   stripePriceId: process.env.STRIPE_PRICE_TOPUP_100 },
  { id: "topup_500",  credits: 500,  priceUsd: 20,  label: "500 credits",   stripePriceId: process.env.STRIPE_PRICE_TOPUP_500 },
  { id: "topup_1000", credits: 1000, priceUsd: 35,  label: "1,000 credits", stripePriceId: process.env.STRIPE_PRICE_TOPUP_1000 },
  { id: "topup_3000", credits: 3000, priceUsd: 90,  label: "3,000 credits", stripePriceId: process.env.STRIPE_PRICE_TOPUP_3000 },
] as const;
