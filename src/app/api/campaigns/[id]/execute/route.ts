import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthContext, AuthError } from "@/lib/session";

export async function POST(
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

    // Mark campaign as RUNNING
    const updated = await prisma.campaign.update({
      where: { id: campaign.id },
      data: { status: "RUNNING" }
    });

    if (campaign.status !== "RUNNING") {
      const { inngest } = await import('@/inngest/client');
      await inngest.send({
        name: 'campaign.process',
        data: { campaignId: updated.id }
      });
    }

    // Check if there are leads enrolled
    const enrolledCount = await prisma.campaignLead.count({
      where: {
        campaignId: campaign.id,
        status: "ENROLLED"
      }
    });

    if (enrolledCount === 0) {
      return NextResponse.json({ message: "No enrolled leads found to process." });
    }

    // Return success to the client immediately. The client will trigger the queue polling.
    return NextResponse.json({
      success: true,
      message: `Campaign started. ${enrolledCount} leads queued for processing.`,
      enrolledCount
    });

  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Campaign execution error:", error);
    return NextResponse.json(
      { error: "Failed to execute campaign" },
      { status: 500 }
    );
  }
}
