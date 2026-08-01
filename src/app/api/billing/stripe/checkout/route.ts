/**
 * POST /api/billing/stripe/checkout
 * 
 * Creates a Stripe Checkout Session for subscription or credit top-up.
 * Uses Stripe SDK v22 (API version 2026-06-24.dahlia).
 * 
 * Body:
 *   { planId: "BASIC"|"PRO"|"AGENCY", interval: "monthly"|"annual" }
 *   OR
 *   { topupPackageId: "topup_100"|"topup_500"|"topup_1000"|"topup_3000" }
 */
import { NextResponse, NextRequest } from 'next/server';
import Stripe from 'stripe';
import { getAuthContext, AuthError } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { PLANS, CREDIT_TOPUP_PACKAGES, type PlanId } from '@/lib/plans';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');
// Note: stripe@22 uses the bundled API version (2026-06-24.dahlia) by default — no apiVersion cast needed.

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function POST(req: NextRequest) {
  try {
    const { userId, workspaceId } = await getAuthContext();
    const body = await req.json();
    const { planId, interval = 'monthly', topupPackageId } = body;

    // ── Resolve or create Stripe Customer ────────────────────────────────────
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: { members: { include: { user: true }, take: 1 } },
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    let stripeCustomerId = workspace.stripeId;

    if (!stripeCustomerId) {
      const ownerEmail = workspace.members[0]?.user?.email ?? '';
      const customer = await stripe.customers.create({
        email: ownerEmail,
        name: workspace.name,
        metadata: { workspaceId },
      });
      stripeCustomerId = customer.id;
      await prisma.workspace.update({
        where: { id: workspaceId },
        data: { stripeId: stripeCustomerId },
      });
    }

    // ── Credit Top-Up (one-time payment) ─────────────────────────────────────
    if (topupPackageId) {
      const pkg = CREDIT_TOPUP_PACKAGES.find((p) => p.id === topupPackageId);
      if (!pkg) {
        return NextResponse.json({ error: 'Invalid top-up package' }, { status: 400 });
      }

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        customer: stripeCustomerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `${pkg.label} Credit Top-Up`,
                description: `Adds ${pkg.credits} credits to your Crawlia workspace instantly.`,
              },
              unit_amount: Math.round(pkg.priceUsd * 100),
            },
            quantity: 1,
          },
        ],
        metadata: {
          workspaceId,
          userId,
          type: 'TOPUP',
          topupPackageId,
          credits: String(pkg.credits),
        },
        success_url: `${APP_URL}/dashboard/settings/billing?topup=success&credits=${pkg.credits}`,
        cancel_url: `${APP_URL}/dashboard/settings/billing?topup=canceled`,
      });

      return NextResponse.json({ url: session.url });
    }

    // ── Subscription Checkout ─────────────────────────────────────────────────
    if (!planId || planId === 'FREE') {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    const plan = PLANS[planId as PlanId];
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 400 });
    }

    // Determine the Stripe Price ID to use
    const priceId = interval === 'annual' ? plan.stripePriceIdAnnual : plan.stripePriceIdMonthly;

    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];

    if (priceId) {
      // Production: use pre-configured recurring Stripe Price
      lineItems = [{ price: priceId, quantity: 1 }];
    } else {
      // Development fallback: create inline price (no Price ID configured in .env)
      const pricePerMonth = interval === 'annual' ? plan.annualPrice : plan.monthlyPrice;
      lineItems = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Crawlia ${plan.displayName} Plan`,
              description: `${plan.monthlyCredits} credits/month · ${plan.displayName} features`,
              metadata: { planId: plan.id },
            },
            unit_amount: Math.round(pricePerMonth * 100),
            recurring: {
              interval: interval === 'annual' ? 'year' : 'month',
            },
          },
          quantity: 1,
        },
      ];
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: lineItems,
      subscription_data: {
        metadata: {
          workspaceId,
          userId,
          planId: plan.id,
          interval,
        },
      },
      metadata: {
        workspaceId,
        userId,
        planId: plan.id,
        interval,
        type: 'SUBSCRIPTION',
      },
      allow_promotion_codes: true,
      success_url: `${APP_URL}/dashboard/settings/billing?subscription=success&plan=${plan.id}`,
      cancel_url: `${APP_URL}/dashboard/settings/billing?subscription=canceled`,
    });

    // Create a pending subscription record (activated on webhook)
    const now = new Date();
    const freePlan = await prisma.plan.findUnique({ where: { name: 'FREE' } });
    const selectedPlan = await prisma.plan.findUnique({ where: { name: plan.id } });

    if (selectedPlan) {
      await prisma.subscription.upsert({
        where: { workspaceId },
        create: {
          workspaceId,
          planId: selectedPlan.id,
          status: 'INCOMPLETE',
          interval,
          currentPeriodStart: now,
          currentPeriodEnd: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
          stripeCustomerId,
        },
        update: {
          status: 'INCOMPLETE',
          stripeCustomerId,
        },
      });
    }

    return NextResponse.json({ url: session.url });

  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('[Stripe Checkout Error]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
