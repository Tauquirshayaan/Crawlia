/**
 * POST /api/webhooks/razorpay
 * 
 * Razorpay webhook handler — authoritative source for Razorpay payments.
 * Handles credit top-up payments (Razorpay is used for INR/India market).
 * 
 * Handled events:
 *   payment.captured  → grant credits for top-up
 *   payment.failed    → log failure, update CreditTopUp status
 *   refund.processed  → handle refund, deduct credits
 */
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { grantCredits, deductCredit } from '@/lib/ledger';

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('x-razorpay-signature') ?? '';

  // ── Signature verification ────────────────────────────────────────────────
  if (webhookSecret) {
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.error('[Razorpay Webhook] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  }

  let event: any;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const eventId = event.id || `rzp_${Date.now()}`;

  // ── Idempotency check ─────────────────────────────────────────────────────
  try {
    await prisma.webhookEvent.create({
      data: {
        provider: 'razorpay',
        eventId,
        eventType: event.event,
      },
    });
  } catch {
    console.log(`[Razorpay Webhook] Duplicate event ${eventId} safely ignored.`);
    return NextResponse.json({ received: true });
  }

  // ── Event Routing ─────────────────────────────────────────────────────────
  try {
    switch (event.event) {

      case 'payment.captured': {
        const payment = event.payload.payment?.entity;
        if (!payment) break;

        const notes = payment.notes ?? {};
        const workspaceId = notes.workspaceId;
        const credits = parseInt(notes.credits || '0', 10);
        const amountUsd = parseFloat(notes.amountUsd || '0');
        const topupPackageId = notes.topupPackageId;

        if (!workspaceId || credits <= 0) break;

        // Grant credits (idempotent)
        await grantCredits(
          workspaceId,
          credits,
          `rzp_payment_${payment.id}`,
          `Credit top-up via Razorpay: ${credits} credits`,
          'TOPUP',
        );

        // Record top-up
        await prisma.creditTopUp.upsert({
          where: { providerPaymentId: payment.id },
          create: {
            workspaceId,
            credits,
            amountUsd,
            provider: 'razorpay',
            providerPaymentId: payment.id,
            status: 'COMPLETED',
          },
          update: { status: 'COMPLETED' },
        });

        // Sync razorpayId if not set
        await prisma.workspace.updateMany({
          where: { id: workspaceId, razorpayId: null },
          data: { razorpayId: payment.customer_id || payment.id },
        });

        console.log(`[Razorpay] Granted ${credits} credits to workspace ${workspaceId}`);
        break;
      }

      case 'payment.failed': {
        const payment = event.payload.payment?.entity;
        if (!payment) break;

        const workspaceId = payment.notes?.workspaceId;
        if (workspaceId) {
          await prisma.creditTopUp.updateMany({
            where: { providerPaymentId: payment.id },
            data: { status: 'FAILED' },
          });
        }
        break;
      }

      case 'refund.processed': {
        const refund = event.payload.refund?.entity;
        if (!refund) break;

        // Find the original top-up
        const topup = await prisma.creditTopUp.findUnique({
          where: { providerPaymentId: refund.payment_id },
        });

        if (topup && topup.status === 'COMPLETED') {
          // Deduct the credited amount back (payment was refunded)
          try {
            await deductCredit(
              topup.workspaceId,
              topup.credits,
              `rzp_refund_${refund.id}`,
              `Credits reversed: Razorpay refund for payment ${refund.payment_id}`,
              'REFUND',
            );
          } catch {
            // If balance is already lower than credits to deduct, log but don't block
            console.warn(`[Razorpay] Could not deduct ${topup.credits} credits on refund — insufficient balance`);
          }

          await prisma.creditTopUp.update({
            where: { id: topup.id },
            data: { status: 'REFUNDED' },
          });
        }
        break;
      }

      default:
        console.log(`[Razorpay Webhook] Unhandled event: ${event.event}`);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown';
    console.error(`[Razorpay Webhook] Error processing ${event.event}:`, msg);
    return NextResponse.json({ error: 'Processing error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
