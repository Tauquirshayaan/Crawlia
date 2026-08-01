import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { CampaignsTable, CampaignData } from "@/components/campaigns/CampaignsTable";

export default async function CampaignsPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id || "1";

  // Fetch real campaigns from the DB
  const rawCampaigns = await prisma.campaign.findMany({
    where: { workspace: { members: { some: { userId } } } },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { campaignLeads: true, emailDrafts: true } },
      campaignLeads: {
        where: { status: 'SENT' },
        select: { id: true }
      }
    }
  }).catch(() => []);

  const campaigns: CampaignData[] = rawCampaigns.map((c) => ({
    id: c.id,
    name: c.name,
    status: c.status,
    createdAt: c.createdAt,
    stats: {
      sent: c.campaignLeads?.length || 0,
      openRate: 0, 
      replyRate: 0, 
    },
  }));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-end">
        <Link href="/dashboard/campaigns/new">
          <Button variant="primary" className="bg-[#66ca7a] hover:bg-[#5bb86d] text-white shadow-sm border-none font-semibold px-6 rounded-lg">
            <Plus className="w-4 h-4 mr-2" />
            New campaign
          </Button>
        </Link>
      </div>

      <CampaignsTable initialCampaigns={campaigns} />
    </div>
  );
}
