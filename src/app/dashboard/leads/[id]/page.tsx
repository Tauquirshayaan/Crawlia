import { GlassCard } from "@/components/ui/GlassCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { 
  Building2, 
  MapPin, 
  Globe, 
  Mail, 
  Smartphone, 
  Search, 
  Zap, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  MoreVertical,
  Activity
} from "lucide-react";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
    include: {
      analyses: { orderBy: { createdAt: 'desc' }, take: 1 },
      emailDrafts: { include: { sends: true } },
      replies: { orderBy: { createdAt: 'desc' } },
      campaignLeads: { include: { campaign: true } }
    }
  });

  if (!lead) {
    return notFound();
  }

  const latestAnalysis = lead.analyses[0] || null;
  const findings = latestAnalysis?.findingsJson ? (latestAnalysis.findingsJson as any) : [];
  
  // Build dynamic activity feed
  const activity = [
    { id: lead.id, type: "imported", title: "Lead Created", desc: "Added to CRM", date: lead.createdAt.toLocaleDateString(), icon: Building2 }
  ];

  if (latestAnalysis) {
    activity.push({ id: latestAnalysis.id, type: "analyzed", title: "Website Analyzed", desc: `Score: ${latestAnalysis.score}/10`, date: latestAnalysis.createdAt.toLocaleDateString(), icon: Activity });
  }

  lead.emailDrafts.forEach(draft => {
    activity.push({ id: draft.id, type: "drafted", title: "Email Drafted", desc: "AI generated initial outreach", date: draft.createdAt.toLocaleDateString(), icon: Sparkles });
    draft.sends.forEach(send => {
      activity.push({ id: send.id, type: "sent", title: "Email Sent", desc: "Outreach sequence started", date: send.createdAt.toLocaleDateString(), icon: Mail });
      if (send.status === "DELIVERED") {
        activity.push({ id: send.id + '_open', type: "opened", title: "Email Opened", desc: "Recipient viewed the email", date: send.updatedAt.toLocaleDateString(), icon: CheckCircle2 });
      }
    });
  });

  lead.replies.forEach(reply => {
    activity.push({ id: reply.id, type: "reply", title: "Received Reply", desc: `AI intent: ${reply.intent}`, date: reply.createdAt.toLocaleDateString(), icon: Smartphone });
  });

  activity.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div className="flex gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-brand-pastel)] border border-[var(--color-brand-border)] flex items-center justify-center text-2xl font-bold text-[var(--color-brand-teal)] shadow-sm">
            {(lead.name || "U").charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-outfit font-bold text-[var(--color-brand-ink)]">{lead.name || "Unknown"}</h1>
              <StatusPill status="success">{lead.status}</StatusPill>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-[var(--color-brand-slate)]">
              <div className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {lead.company || "Unknown"}</div>
              <div className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> <a href={`https://${lead.websiteUrl}`} target="_blank" rel="noreferrer" className="hover:text-[var(--color-brand-teal)] hover:underline flex items-center gap-1">{lead.websiteUrl} <ExternalLink className="w-3 h-3" /></a></div>
              <div className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {lead.email || "No email"}</div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Mail className="w-4 h-4 mr-2" /> Email
          </Button>
          <Button variant="secondary" size="sm" className="px-2">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Analysis & Drafts */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Analysis Scores */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[var(--color-brand-ink)] font-outfit">Website Analysis</h2>
              <div className="flex items-center gap-2 bg-[var(--color-brand-pastel)] px-3 py-1.5 rounded-full text-sm font-bold text-[var(--color-brand-teal)]">
                <Activity className="w-4 h-4" />
                Score: {latestAnalysis?.score || 0}/10
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-white/50 p-4 rounded-xl border border-[var(--color-brand-border)]">
                <div className="flex items-center gap-2 text-sm text-[var(--color-brand-slate)] mb-2 font-medium">
                  <Search className="w-4 h-4" /> SEO
                </div>
                <div className="text-2xl font-bold text-[var(--color-brand-ink)]">
                  {latestAnalysis?.subScores ? (latestAnalysis.subScores as any).seo || 0 : 0}
                </div>
              </div>
              <div className="bg-white/50 p-4 rounded-xl border border-[var(--color-brand-border)]">
                <div className="flex items-center gap-2 text-sm text-[var(--color-brand-slate)] mb-2 font-medium">
                  <Zap className="w-4 h-4" /> Performance
                </div>
                <div className="text-2xl font-bold text-[var(--color-brand-ink)]">
                  {latestAnalysis?.subScores ? (latestAnalysis.subScores as any).performance || 0 : 0}
                </div>
              </div>
              <div className="bg-white/50 p-4 rounded-xl border border-[var(--color-brand-border)]">
                <div className="flex items-center gap-2 text-sm text-[var(--color-brand-slate)] mb-2 font-medium">
                  <Smartphone className="w-4 h-4" /> Design / UX
                </div>
                <div className="text-2xl font-bold text-[var(--color-brand-ink)]">
                  {latestAnalysis?.subScores ? (latestAnalysis.subScores as any).design || 0 : 0}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[var(--color-brand-ink)] uppercase tracking-wider mb-4">Key Findings</h3>
              {findings.map((finding: any, idx: number) => (
                <div key={idx} className="flex gap-4 p-4 rounded-xl border border-[var(--color-brand-border)] bg-white/40 hover:bg-white/80 transition-colors">
                  <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                    finding.severity === 'high' ? 'bg-red-500' : 'bg-orange-400'
                  }`} />
                  <div>
                    <h4 className="font-semibold text-sm text-[var(--color-brand-ink)]">{finding.title}</h4>
                    <p className="text-sm text-[var(--color-brand-slate)] mt-1 leading-relaxed">{finding.description}</p>
                  </div>
                </div>
              ))}
              {findings.length === 0 && <div className="text-sm text-slate-500">No findings available.</div>}
            </div>
          </GlassCard>

          {/* AI Drafts */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[var(--color-brand-ink)] font-outfit px-1">Email Drafts</h2>
            {lead.emailDrafts.map(draft => (
              <GlassCard key={draft.id} className="p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-brand-teal)]"></div>
                <div className="flex justify-between items-start mb-4 pb-4 border-b border-[var(--color-brand-border)]">
                  <div>
                    <h3 className="font-bold text-[var(--color-brand-ink)] text-lg">{draft.subject}</h3>
                    <div className="flex items-center gap-2 mt-2 text-xs font-semibold text-[var(--color-brand-teal)]">
                      <Sparkles className="w-3.5 h-3.5" /> AI Generated
                    </div>
                  </div>
                  <StatusPill status={draft.status === "SENT" ? "success" : "warning"}>{draft.status}</StatusPill>
                </div>
                <div className="bg-white/50 rounded-xl p-4 font-mono text-sm leading-relaxed text-[var(--color-brand-ink)] whitespace-pre-wrap">
                  {draft.body}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Right Column: Activity Timeline */}
        <div className="lg:col-span-1">
          <GlassCard className="p-6 sticky top-24">
            <h2 className="text-lg font-bold text-[var(--color-brand-ink)] font-outfit mb-6">Activity Timeline</h2>
            
            <div className="relative border-l border-[var(--color-brand-border)] ml-3 space-y-6">
              {activity.map((event, idx) => (
                <div key={event.id} className="relative pl-6">
                  <div className={`absolute -left-3 top-0.5 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-sm ${
                    idx === activity.length - 1 ? 'bg-white' : 'bg-[var(--color-brand-pastel)] text-[var(--color-brand-teal)]'
                  }`}>
                    <event.icon className={`w-3 h-3 ${idx === activity.length - 1 ? 'text-[var(--color-brand-slate)]' : ''}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--color-brand-ink)]">{event.title}</h4>
                    <p className="text-xs text-[var(--color-brand-slate)] mt-0.5">{event.desc}</p>
                    <div className="flex items-center gap-1 text-xs text-[var(--color-brand-slate)] mt-2 font-medium">
                      <Clock className="w-3 h-3" /> {event.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}
