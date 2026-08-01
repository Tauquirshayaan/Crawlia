/**
 * GET /api/seed
 * 
 * Development-only seed endpoint. Creates workspace + users + FREE subscription.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { grantCredits } from "@/lib/ledger";

export async function GET() {
  try {
    const password = "Tauquir@1";
    const passwordHash = await bcrypt.hash(password, 10);

    // 1. Ensure plans are seeded
    const freePlan = await prisma.plan.upsert({
      where: { name: "FREE" },
      create: {
        name: "FREE", displayName: "Free",
        monthlyCredits: 20, rolloverCap: 20,
        maxCampaigns: 1, maxMailboxes: 0, maxTeamMembers: 1,
        canInviteMembers: false, monthlyPrice: 0, annualPrice: 0,
      },
      update: {}
    });
    const proPlan = await prisma.plan.upsert({
      where: { name: "PRO" },
      create: {
        name: "PRO", displayName: "Pro",
        monthlyCredits: 1100, rolloverCap: 1100,
        maxCampaigns: 20, maxMailboxes: 2, maxTeamMembers: 9999,
        canInviteMembers: true, monthlyPrice: 99, annualPrice: 79,
      },
      update: {}
    });

    // 2. Create or get workspace
    let workspace = await prisma.workspace.findFirst({
      where: { name: "Main Workspace" }
    });

    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: {
          name: "Main Workspace",
          tier: "PRO"
        }
      });
    }

    // 3. Ensure PRO subscription for main workspace
    const now = new Date();
    const nextMonth = new Date(now);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    await prisma.subscription.upsert({
      where: { workspaceId: workspace.id },
      create: {
        workspaceId: workspace.id,
        planId: proPlan.id,
        status: "ACTIVE",
        interval: "monthly",
        currentPeriodStart: now,
        currentPeriodEnd: nextMonth,
      },
      update: { status: "ACTIVE", planId: proPlan.id }
    });

    // 4. Grant initial PRO credits if balance is 0
    const { getBalance } = await import("@/lib/ledger");
    const balance = await getBalance(workspace.id);
    if (balance === 0) {
      await grantCredits(
        workspace.id, 1100,
        `seed_initial_${workspace.id}`,
        "Initial PRO plan credits (dev seed)",
        "SUBSCRIPTION_ACTIVATION"
      );
    }

    // 5. Upsert Shayaan
    const shayaan = await prisma.user.upsert({
      where: { email: "Shayaan499@gmail.com" },
      update: { passwordHash, name: "Shayaan" },
      create: { email: "Shayaan499@gmail.com", name: "Shayaan", passwordHash }
    });

    await prisma.workspaceMember.upsert({
      where: { userId_workspaceId: { userId: shayaan.id, workspaceId: workspace.id } },
      update: { role: "OWNER" },
      create: { userId: shayaan.id, workspaceId: workspace.id, role: "OWNER" }
    });

    // 6. Upsert bonej
    const bonej = await prisma.user.upsert({
      where: { email: "bonej2613@gmail.com" },
      update: { passwordHash, name: "Bonej" },
      create: { email: "bonej2613@gmail.com", name: "Bonej", passwordHash }
    });

    await prisma.workspaceMember.upsert({
      where: { userId_workspaceId: { userId: bonej.id, workspaceId: workspace.id } },
      update: { role: "MEMBER" },
      create: { userId: bonej.id, workspaceId: workspace.id, role: "MEMBER" }
    });

    const finalBalance = await getBalance(workspace.id);

    return NextResponse.json({
      success: true,
      message: "Workspace, users, subscription, and credits seeded!",
      workspace: { id: workspace.id, tier: workspace.tier },
      creditBalance: finalBalance
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
