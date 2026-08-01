import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthContext, AuthError } from "@/lib/session";

export async function GET() {
  try {
    const { userId } = await getAuthContext();

    const [activeCampaigns, emailsSent, pendingDrafts, leads, sends] = await Promise.all([
      prisma.campaign.count({
        where: { workspace: { members: { some: { userId } } }, status: "RUNNING" },
      }),
      prisma.send.count({
        where: { draft: { campaign: { workspace: { members: { some: { userId } } } } }, status: "SENT" },
      }),
      prisma.emailDraft.count({
        where: { campaign: { workspace: { members: { some: { userId } } } }, status: "DRAFT" },
      }),
      prisma.lead.findMany({
        where: { workspace: { members: { some: { userId } } } },
        select: { score: true, name: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.send.findMany({
        where: { draft: { campaign: { workspace: { members: { some: { userId } } } } } },
        select: { createdAt: true },
        orderBy: { createdAt: "asc" }
      })
    ]);

    return NextResponse.json({
      activeCampaigns,
      emailsSent,
      pendingDrafts,
      leads,
      sends
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
