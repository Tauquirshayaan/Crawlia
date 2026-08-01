import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { classifyReplyIntent } from '@/lib/llm';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Standardized payload expectation (can be mapped from Resend Inbound Webhooks)
    const { from, to, subject, text, html } = body;

    if (!from || (!text && !html)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Attempt to match the sender's email to a Lead in the system
    // Extract email if in "Name <email@domain.com>" format
    const emailMatch = from.match(/<([^>]+)>/);
    const senderEmail = emailMatch ? emailMatch[1] : from;

    const lead = await prisma.lead.findFirst({
      where: { email: senderEmail },
      orderBy: { createdAt: "desc" },
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    // Classify the intent
    const { intent, confidence } = await classifyReplyIntent(text || html || "");

    // Store the reply
    await prisma.reply.create({
      data: {
        leadId: lead.id,
        intent,
        confidence,
        rawContent: text || html || "",
      },
    });

    // Update the Lead status
    await prisma.lead.update({
      where: { id: lead.id },
      data: { status: "REPLIED" },
    });

    // If intent is UNSUBSCRIBE, we should probably mark the lead as BOUNCED or a new EXCLUDED state.
    // For now, let's keep it simple.

    return NextResponse.json({ success: true, intent, confidence });
  } catch (error) {
    console.error("Inbound Webhook Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
