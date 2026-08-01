/**
 * POST /api/webhooks/stripe
 * 
 * Stripe webhook handler — authoritative payment source.
 * All state changes are driven from here, never from browser redirects.
 * 
 * Implements full idempotency via WebhookEvent table.
 * Uses Stripe SDK v22 (API version 2026-06-24.dahlia).
 * 
 * Handled events:
 *   checkout.session.completed     → activate subscription OR grant top-up credits
 *   customer.subscription.updated  → sync plan/status changes
 *   customer.subscription.deleted  → downgrade to FREE
 *   invoice.payment_succeeded      → renew monthly credits
 *   invoice.payment_failed         → mark subscription PAST_DUE, alert user
 *   invoice.upcoming               → fire renewal warning notification
 *   customer.deleted               → clear stripeId from workspace
 */
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { grantCredits, grantMonthlyCredits } from '@/lib/ledger';
import { getPlan } from '@/lib/plans';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') ?? '';

  let event: Stripe.Event;

  if (!webhookSecret || webhookSecret === 'whsec_mock') {
    // Dev mode: parse directly without signature verification
    try {
      event = JSON.parse(body) as Stripe.Event;
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
  } else {
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown';
      console.error(`[Stripe Webhook] Signature verification failed: ${msg}`);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  }

  // ── Idempotency check ──────────────────────────────────────────────────────
  try {
    await prisma.webhookEvent.create({
      data: {
        provider: 'stripe',
        eventId: event.id,
        eventType: event.type,
      },
    });
  } catch {
    // P2002 unique violation = already processed → safe to return 200
    console.log(`[Stripe Webhook] Duplicate event ${event.id} (${event.type}) safely ignored.`);
    return NextResponse.json({ received: true });
  }

  // ── Event Routing ──────────────────────────────────────────────────────────
  try {
    switch (event.type) {

      // ── New payment completed (subscription activation OR top-up) ──────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const meta = session.metadata ?? {};
        const workspaceId = meta.workspaceId;
        if (!workspaceId) break;

        if (meta.type === 'TOPUP') {
          // Credit top-up: grant credits immediately
          const credits = parseInt(meta.credits || '0', 10);
          if (credits > 0) {
            await grantCredits(
              workspaceId,
              credits,
              `stripe_topup_${event.id}`,
              `Credit top-up: ${credits} credits purchased`,
              'TOPUP',
            );
            await recordTopUp(workspaceId, credits, session.amount_total ?? 0, event.id);
          }
        } else if (meta.type === 'SUBSCRIPTION' && session.subscription) {
          // Subscription: retrieve full subscription object to get period dates
          const stripeSub = await stripe.subscriptions.retrieve(session.subscription as string);
          await activateSubscription(workspaceId, meta.planId, meta.interval || 'monthly', stripeSub, event.id);
        }
        break;
      }

      // ── Subscription updated (upgrade/downgrade/status change) ─────────────
      case 'customer.subscription.updated': {
        const stripeSub = event.data.object as Stripe.Subscription;
        const workspaceId = stripeSub.metadata?.workspaceId;
        if (!workspaceId) break;

        const planId = stripeSub.metadata?.planId;
        const status = stripeStatusToLocal(stripeSub.status);

        const sub = await prisma.subscription.findUnique({ where: { workspaceId }, include: { plan: true } });

        await prisma.$transaction(async (tx) => {
          const updatedSub = await tx.subscription.update({
            where: { workspaceId },
            data: {
              status,
              stripeSubscriptionId: stripeSub.id,
              currentPeriodStart: new Date((stripeSub as any).current_period_start * 1000),
              currentPeriodEnd: new Date((stripeSub as any).current_period_end * 1000),
              cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
            },
          });

          // Log history
          await tx.subscriptionHistory.create({
            data: {
              subscriptionId: updatedSub.id,
              event: 'UPDATED',
              previousStatus: sub?.status,
              newStatus: status,
              metadata: { stripeEventId: event.id, planId },
            },
          });

          // Sync workspace tier if plan changed
          if (planId && planId !== sub?.plan?.name) {
            const dbPlan = await tx.plan.findUnique({ where: { name: planId } });
            if (dbPlan) {
              await tx.subscription.update({
                where: { workspaceId },
                data: { planId: dbPlan.id },
              });
              await tx.workspace.update({
                where: { id: workspaceId },
                data: { tier: planId },
              });
            }
          }
        });
        break;
      }

      // ── Subscription deleted/cancelled ────────────────────────────────────
      case 'customer.subscription.deleted': {
        const stripeSub = event.data.object as Stripe.Subscription;
        const workspaceId = stripeSub.metadata?.workspaceId;
        if (!workspaceId) break;

        const freePlan = await prisma.plan.findUnique({ where: { name: 'FREE' } });

        await prisma.$transaction(async (tx) => {
          if (freePlan) {
            await tx.subscription.update({
              where: { workspaceId },
              data: {
                status: 'CANCELED',
                cancelAtPeriodEnd: false,
                planId: freePlan.id,
              },
            });
          }
          await tx.workspace.update({
            where: { id: workspaceId },
            data: { tier: 'FREE' },
          });
          await tx.subscriptionHistory.create({
            data: {
              subscriptionId: (await tx.subscription.findUnique({ where: { workspaceId } }))!.id,
              event: 'CANCELED',
              newStatus: 'CANCELED',
              metadata: { stripeEventId: event.id },
            },
          });
        });
        break;
      }

      // ── Invoice payment succeeded (monthly renewal) ────────────────────────
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const workspaceId = (invoice as any).subscription_details?.metadata?.workspaceId
          ?? invoice.metadata?.workspaceId;
        if (!workspaceId) break;

        // Only process for recurring billing_reason (not first payment)
        if ((invoice as any).billing_reason === 'subscription_cycle') {
          const { granted, balance } = await grantMonthlyCredits(
            workspaceId,
            `stripe_renewal_${event.id}`,
            'Monthly subscription renewal credits',
          );

          console.log(`[Stripe] Granted ${granted} credits to ${workspaceId} on renewal. Balance: ${balance}`);
        }

        // Mirror invoice in DB
        await prisma.invoice.upsert({
          where: { stripeInvoiceId: invoice.id },
          create: {
            subscriptionId: (await prisma.subscription.findUnique({ where: { workspaceId } }))!.id,
            workspaceId,
            stripeInvoiceId: invoice.id,
            amount: (invoice.amount_paid ?? 0) / 100,
            currency: invoice.currency,
            status: 'paid',
            pdfUrl: invoice.invoice_pdf ?? null,
            hostedUrl: (invoice as any).hosted_invoice_url ?? null,
            periodStart: new Date(((invoice as any).period_start || Date.now() / 1000) * 1000),
            periodEnd: new Date(((invoice as any).period_end || Date.now() / 1000) * 1000),
          },
          update: { status: 'paid', pdfUrl: invoice.invoice_pdf ?? null },
        });
        break;
      }

      // ── Invoice payment failed ─────────────────────────────────────────────
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const workspaceId = (invoice as any).subscription_details?.metadata?.workspaceId;
        if (!workspaceId) break;

        const sub = await prisma.subscription.findUnique({ where: { workspaceId } });
        if (sub) {
          await prisma.$transaction([
            prisma.subscription.update({
              where: { workspaceId },
              data: { status: 'PAST_DUE' },
            }),
            prisma.subscriptionHistory.create({
              data: {
                subscriptionId: sub.id,
                event: 'PAYMENT_FAILED',
                previousStatus: sub.status,
                newStatus: 'PAST_DUE',
                metadata: { stripeEventId: event.id, invoiceId: invoice.id },
              },
            }),
          ]);
        }

        // Notify via Inngest
        await sendInngestEvent('billing/payment.failed', { workspaceId, invoiceId: invoice.id });
        break;
      }

      // ── Invoice upcoming (renewal reminder) ───────────────────────────────
      case 'invoice.upcoming': {
        const invoice = event.data.object as Stripe.Invoice;
        const workspaceId = (invoice as any).subscription_details?.metadata?.workspaceId;
        if (!workspaceId) break;

        await sendInngestEvent('billing/renewal.upcoming', {
          workspaceId,
          renewalDate: new Date(((invoice as any).period_end || Date.now() / 1000) * 1000).toISOString(),
          amount: (invoice.amount_due ?? 0) / 100,
        });
        break;
      }

      // ── Customer deleted ──────────────────────────────────────────────────
      case 'customer.deleted': {
        const customer = event.data.object as Stripe.Customer;
        await prisma.workspace.updateMany({
          where: { stripeId: customer.id },
          data: { stripeId: null },
        });
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error(`[Stripe Webhook] Error processing ${event.type}:`, msg);
    return NextResponse.json({ error: 'Processing error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function stripeStatusToLocal(status: string): string {
  const map: Record<string, string> = {
    active: 'ACTIVE',
    past_due: 'PAST_DUE',
    canceled: 'CANCELED',
    trialing: 'TRIALING',
    incomplete: 'INCOMPLETE',
    incomplete_expired: 'CANCELED',
    paused: 'PAUSED',
  };
  return map[status] ?? 'ACTIVE';
}

async function activateSubscription(
  workspaceId: string,
  planId: string,
  interval: string,
  stripeSub: Stripe.Subscription,
  eventId: string,
) {
  const plan = getPlan(planId);
  const dbPlan = await prisma.plan.findUnique({ where: { name: planId } });

  if (!dbPlan) {
    console.error(`[Stripe] Plan "${planId}" not found in DB. Ensure plans are seeded.`);
    return;
  }

  const now = new Date();
  const periodEnd = new Date(((stripeSub as any).current_period_end || Date.now() / 1000) * 1000);

  await prisma.$transaction(async (tx) => {
    const sub = await tx.subscription.upsert({
      where: { workspaceId },
      create: {
        workspaceId,
        planId: dbPlan.id,
        status: 'ACTIVE',
        interval,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        stripeSubscriptionId: stripeSub.id,
      },
      update: {
        planId: dbPlan.id,
        status: 'ACTIVE',
        interval,
        currentPeriodStart: now,
        currentPeriodEnd: periodEnd,
        stripeSubscriptionId: stripeSub.id,
      },
    });

    // Upgrade workspace tier
    await tx.workspace.update({
      where: { id: workspaceId },
      data: { tier: planId },
    });

    // Log history
    await tx.subscriptionHistory.create({
      data: {
        subscriptionId: sub.id,
        event: 'CREATED',
        newPlanId: dbPlan.id,
        newStatus: 'ACTIVE',
        metadata: { stripeEventId: eventId },
      },
    });
  });

  // Grant initial monthly credits
  await grantCredits(
    workspaceId,
    plan.monthlyCredits,
    `stripe_initial_${eventId}`,
    `Initial credits for ${plan.displayName} plan`,
    'SUBSCRIPTION_ACTIVATION',
  );
}

async function recordTopUp(workspaceId: string, credits: number, amountCents: number, eventId: string) {
  await prisma.creditTopUp.upsert({
    where: { providerPaymentId: `stripe_${eventId}` },
    create: {
      workspaceId,
      credits,
      amountUsd: amountCents / 100,
      provider: 'stripe',
      providerPaymentId: `stripe_${eventId}`,
      status: 'COMPLETED',
    },
    update: { status: 'COMPLETED' },
  });
}

async function sendInngestEvent(name: string, data: Record<string, unknown>) {
  try {
    const { inngest } = await import('@/inngest/client');
    await inngest.send({ name: name as any, data });
  } catch {
    // Inngest not required for core billing to work
  }
}
