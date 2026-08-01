/**
 * POST /api/billing/razorpay/checkout
 * 
 * Creates a Razorpay Order for credit top-up (India market).
 * Razorpay is used primarily for one-time credit purchases in INR.
 * 
 * Body: { topupPackageId: "topup_100"|"topup_500"|"topup_1000"|"topup_3000" }
 */
import { NextResponse, NextRequest } from 'next/server';
import Razorpay from 'razorpay';
import { getAuthContext, AuthError } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { CREDIT_TOPUP_PACKAGES } from '@/lib/plans';

// INR exchange rate for pricing (approximate, set via env for production)
const USD_TO_INR = parseFloat(process.env.USD_TO_INR_RATE || '83');

export async function POST(req: NextRequest) {
  try {
    const { userId, workspaceId } = await getAuthContext();
    const body = await req.json();
    const { topupPackageId, planId } = body;

    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_key_secret',
    });

    if (topupPackageId) {
      // ── Credit Top-Up ─────────────────────────────────────────────────────
      const pkg = CREDIT_TOPUP_PACKAGES.find((p) => p.id === topupPackageId);
      if (!pkg) {
        return NextResponse.json({ error: 'Invalid top-up package' }, { status: 400 });
      }

      const amountInr = Math.round(pkg.priceUsd * USD_TO_INR * 100); // paise

      const order = await rzp.orders.create({
        amount: amountInr,
        currency: 'INR',
        receipt: `topup_${workspaceId}_${Date.now()}`,
        notes: {
          workspaceId,
          userId,
          type: 'TOPUP',
          topupPackageId,
          credits: String(pkg.credits),
          amountUsd: String(pkg.priceUsd),
        },
      });

      // Ensure workspace has razorpayId
      const workspace = await prisma.workspace.findUnique({ where: { id: workspaceId } });
      if (workspace && !workspace.razorpayId) {
        // Razorpay does not expose a customer API in the same way — we store orderId as reference
      }

      return NextResponse.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock',
        credits: pkg.credits,
        description: `${pkg.label} Credit Top-Up`,
      });
    }

    return NextResponse.json({ error: 'No valid action specified' }, { status: 400 });

  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('[Razorpay Checkout Error]', error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}
