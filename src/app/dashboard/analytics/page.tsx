import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { AnalyticsClient } from "@/components/analytics/AnalyticsClient";
import { getAuthContext } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function AnalyticsPage() {
  let userId: string;
  try {
    const ctx = await getAuthContext();
    userId = ctx.userId;
  } catch {
    redirect("/login");
  }

  // Fetch campaigns to get names
  const campaigns = await prisma.campaign.findMany({
    where: { workspace: { members: { some: { userId } } } },
    select: { id: true, name: true }
  });

  // Fetch all sends
  const sends = await prisma.send.findMany({
    where: { draft: { campaign: { workspace: { members: { some: { userId } } } } } },
    select: { id: true, draftId: true, status: true, createdAt: true, draft: { select: { campaignId: true } } }
  });

  // Fetch all replies
  const replies = await prisma.reply.findMany({
    where: { lead: { workspace: { members: { some: { userId } } } } },
    select: { id: true, intent: true, createdAt: true }
  });

  return (
    <AnalyticsClient 
      campaigns={campaigns}
      sends={sends}
      replies={replies}
    />
  );
}
