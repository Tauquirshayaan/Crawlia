/**
 * POST /api/billing/cancel
 * 
 * Cancels a subscription at period end (not immediately).
 * Sends the cancel request to Stripe; actual downgrade happens via webhook.
 */
import { NextResponse, NextRequest } from 'next/server';
import Stripe from 'stripe';
import { getAuthContext, AuthError } from '@/lib/session';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');

export async function POST(req: NextRequest) {
  try {
    const { workspaceId } = await getAuthContext();

    const sub = await prisma.subscription.findUnique({
      where: { workspaceId },
      select: { stripeSubscriptionId: true, status: true },
    });

    if (!sub || !sub.stripeSubscriptionId) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 400 });
    }

    if (sub.status === 'CANCELED') {
      return NextResponse.json({ error: 'Subscription is already canceled' }, { status: 400 });
    }

    // Cancel at period end (Stripe docs: cancel_at_period_end = true)
    await stripe.subscriptions.update(sub.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    // Optimistically update DB — webhook will confirm
    await prisma.subscription.update({
      where: { workspaceId },
      data: { cancelAtPeriodEnd: true },
    });

    return NextResponse.json({ success: true, cancelAtPeriodEnd: true });

  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('[Cancel Subscription]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

/**
 * DELETE /api/billing/cancel
 * 
 * Reactivates a subscription that was set to cancel at period end.
 */
export async function DELETE() {
  try {
    const { workspaceId } = await getAuthContext();

    const sub = await prisma.subscription.findUnique({
      where: { workspaceId },
      select: { stripeSubscriptionId: true, cancelAtPeriodEnd: true },
    });

    if (!sub?.stripeSubscriptionId || !sub.cancelAtPeriodEnd) {
      return NextResponse.json({ error: 'Subscription is not pending cancellation' }, { status: 400 });
    }

    await stripe.subscriptions.update(sub.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });

    await prisma.subscription.update({
      where: { workspaceId },
      data: { cancelAtPeriodEnd: false },
    });

    return NextResponse.json({ success: true, cancelAtPeriodEnd: false });

  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('[Reactivate Subscription]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
