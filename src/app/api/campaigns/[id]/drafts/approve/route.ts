import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthContext, AuthError } from "@/lib/session";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await getAuthContext();
    const resolvedParams = await params;
    const campaignId = resolvedParams.id;

    // Verify campaign belongs to user
    const campaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        workspace: { members: { some: { userId } } }
      }
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    const body = await req.json();
    const { action, draftId, subject, body: bodyText } = body;
    // action: 'APPROVE_ALL', 'APPROVE_ONE', 'REJECT_ONE', 'EDIT_ONE'

    if (action === "APPROVE_ALL") {
      await prisma.emailDraft.updateMany({
        where: { campaignId, status: "DRAFT" },
        data: { status: "APPROVED" }
      });
      return NextResponse.json({ success: true, message: "All drafts approved" });
    }

    if (!draftId) {
      return NextResponse.json({ error: "draftId is required" }, { status: 400 });
    }

    if (action === "EDIT_ONE") {
      await prisma.emailDraft.update({
        where: { id: draftId, campaignId },
        data: {
          subject: subject || undefined,
          body: bodyText || undefined,
        }
      });
      return NextResponse.json({ success: true, message: "Draft updated" });
    }

    const status = action === "APPROVE_ONE" ? "APPROVED" : "REJECTED";

    await prisma.emailDraft.update({
      where: { id: draftId, campaignId },
      data: { status }
    });

    return NextResponse.json({ success: true, message: `Draft ${status.toLowerCase()}` });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Draft approval error:", error);
    return NextResponse.json(
      { error: "Failed to update draft" },
      { status: 500 }
    );
  }
}
