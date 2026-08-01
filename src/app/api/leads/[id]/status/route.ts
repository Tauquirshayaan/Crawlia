import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthContext, AuthError } from "@/lib/session";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await getAuthContext();
    
    // Await params per Next.js 15
    const resolvedParams = await params;
    const leadId = resolvedParams.id;

    const { status } = await req.json();
    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    // Security: verify the lead belongs to a workspace the user is in
    const lead = await prisma.lead.findFirst({
      where: {
        id: leadId,
        workspace: { members: { some: { userId } } }
      }
    });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const updatedLead = await prisma.lead.update({
      where: { id: leadId },
      data: { status }
    });

    return NextResponse.json(updatedLead);
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Failed to update lead status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
