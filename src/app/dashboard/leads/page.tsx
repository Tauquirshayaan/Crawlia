import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { LeadsClient, LeadData } from "@/components/leads/LeadsClient";

export default async function LeadsPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id || "1";

  // Fetch real leads from the database
  const rawLeads = await prisma.lead.findMany({
    where: { workspace: { members: { some: { userId } } } },
    orderBy: { createdAt: "desc" },
  });

  // Map to the LeadData format expected by the client
  const leads: LeadData[] = rawLeads.map((lead) => ({
    id: lead.id,
    name: lead.name,
    email: lead.email,
    websiteUrl: lead.websiteUrl,
    status: lead.status,
    score: lead.score,
  }));

  return <LeadsClient initialLeads={leads} />;
}
