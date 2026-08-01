import { prisma } from "@/lib/prisma";
import { StatusPill } from "@/components/ui/StatusPill";
import { RunPipelineButton } from "@/components/campaigns/RunPipelineButton";
import { DraftManager } from "@/components/campaigns/DraftManager";
import { GlassCard } from "@/components/ui/GlassCard";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Mail, CheckCircle2, Clock } from "lucide-react";

export default async function CampaignDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      _count: { select: { campaignLeads: true, emailDrafts: true } },
    },
  });

  if (!campaign) {
    notFound();
  }

  const drafts = await prisma.emailDraft.findMany({
    where: { campaignId: id },
    include: { lead: true },
    orderBy: [
      { lead: { score: "asc" } }, // Lowest score (worst sites) first
      { createdAt: "desc" },
    ],
  });

  const rules = campaign.scheduleRules as any;
  const enrolledCount = await prisma.campaignLead.count({
    where: { campaignId: id, status: "ENROLLED" },
  });
  const sentCount = await prisma.campaignLead.count({
    where: { campaignId: id, status: "SENT" },
  });
  const approvedDrafts = drafts.filter((d) => d.status === "APPROVED").length;
  const pendingDrafts = drafts.filter((d) => d.status === "DRAFT").length;

  let statusStyle = "neutral";
  if (campaign.status === "RUNNING") statusStyle = "success";
  else if (campaign.status === "PAUSED") statusStyle = "warning";
  else if (campaign.status === "COMPLETED") statusStyle = "info";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Breadcrumb */}
      <Link
        href="/dashboard/campaigns"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-brand-slate)] hover:text-[var(--color-brand-ink)] font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> All Campaigns
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-outfit font-bold text-[var(--color-brand-ink)]">
            {campaign.name}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <StatusPill status={statusStyle as any}>{campaign.status}</StatusPill>
            {rules?.goal && (
              <span className="text-sm text-[var(--color-brand-slate)]">
                Goal: <strong className="text-[var(--color-brand-ink)]">{rules.goal}</strong>
              </span>
            )}
            {rules?.language && rules.language !== "English" && (
              <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded-full border border-blue-100">
                {rules.language}
              </span>
            )}
          </div>
        </div>
        <RunPipelineButton campaignId={campaign.id} status={campaign.status} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--color-brand-pastel)] flex items-center justify-center text-[var(--color-brand-teal)]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--color-brand-ink)]">
                {campaign._count.campaignLeads}
              </div>
              <div className="text-xs text-[var(--color-brand-slate)] font-medium">Total Leads</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--color-brand-ink)]">{enrolledCount}</div>
              <div className="text-xs text-[var(--color-brand-slate)] font-medium">Queued</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--color-brand-ink)]">{approvedDrafts}</div>
              <div className="text-xs text-[var(--color-brand-slate)] font-medium">
                Approved / {pendingDrafts} Pending
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--color-brand-ink)]">{sentCount}</div>
              <div className="text-xs text-[var(--color-brand-slate)] font-medium">Emails Sent</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Draft Manager */}
      <DraftManager campaignId={campaign.id} initialDrafts={drafts} />
    </div>
  );
}
