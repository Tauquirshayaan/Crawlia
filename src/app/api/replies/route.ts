import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthContext, AuthError } from "@/lib/session";

export async function GET(req: NextRequest) {
  try {
    const { workspaceId } = await getAuthContext();

    const replies = await prisma.reply.findMany({
      where: { 
        lead: {
          workspaceId: workspaceId
        }
      },
      include: {
        lead: true
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(replies);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("GET /api/replies error:", error);
    return NextResponse.json({ error: "Failed to fetch replies" }, { status: 500 });
  }
}
