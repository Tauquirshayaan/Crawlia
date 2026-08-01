import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthContext, AuthError } from "@/lib/session";

export async function PUT(req: NextRequest) {
  try {
    const { userId, userEmail, workspaceId } = await getAuthContext();

    const body = await req.json();
    const { firstName, lastName, accountType, businessName, companySize, location } = body;

    // Update User
    await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim(),
      }
    });

    // Update Workspace
    await prisma.workspace.update({
      where: { id: workspaceId },
      data: {
        name: businessName || "My Workspace",
        companySize: companySize === "Select size" ? null : companySize,
        location,
        // note: accountType could map to tier but we won't change tier just based on profile dropdown to avoid breaking billing
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("PUT /api/settings/profile error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
