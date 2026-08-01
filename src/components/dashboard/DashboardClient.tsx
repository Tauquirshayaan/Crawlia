"use client";

import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Zap, CheckCircle, Clock, PlayCircle, BarChart3, Mailbox, Search, ArrowUpRight, Inbox, Mail, MessageSquare, AlertCircle } from "lucide-react";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { Button } from "@/components/ui/Button";

interface DashboardData {
  activeCampaigns: number;
  emailsSent: number;
  pendingDrafts: number;
  leads: any[];
  sends: any[];
  
  // Mocked for V1
  userName: string;
  planName: string;
  connectedMailboxes: number;
  interestedReplies: number;
  sitesAnalyzed: number;
  openRate: number;
  replyRate: number;
  uniqueClicks: number;
  bounced: number;
  recentReplies: any[];
  mailboxHealth: any;
}

export function DashboardClient({ initialData }: { initialData: DashboardData }) {
  // Use initialData directly since we are moving away from SWR for now in the static layout build
  const data = initialData;

  // Aggregate Data for Recharts
  const today = new Date();
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  const emailData = last7Days.map(dateStr => {
    const sentOnDate = data.sends.filter(s => new Date(s.createdAt).toISOString().startsWith(dateStr)).length;
    // Derive opened/clicked based on sent to simulate real tracking events
    const opened = Math.floor(sentOnDate * 0.45);
    const clicked = Math.floor(opened * 0.2);
    
    const dateObj = new Date(dateStr);
    const niceDate = dateObj.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
    return { 
      date: niceDate, 
      sent: sentOnDate, 
      opened: opened, 
      clicked: clicked 
    };
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto p-8">
      {/* 1. Greeting Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-bold text-[var(--color-brand-ink)]">Good morning, {data.userName} 👋</h1>
          <p className="text-[var(--color-brand-slate)] mt-1 flex items-center gap-2">
            <span><strong className="text-[var(--color-brand-ink)]">{data.connectedMailboxes}</strong> Connected Mailboxes</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span><strong className="text-[var(--color-brand-ink)]">{data.activeCampaigns}</strong> Active Campaigns</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-xs font-bold text-slate-500 uppercase tracking-wider">
            {data.planName}
          </div>
          <Link href="/dashboard/campaigns/new">
            <Button className="rounded-full shadow-sm">
              New Campaign
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Four KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5 flex flex-col justify-between hover:border-[var(--color-brand-teal)] transition-colors cursor-pointer group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--color-brand-slate)]">Emails Sent</h3>
            <div className="w-8 h-8 rounded-full bg-[var(--color-brand-pastel)] flex items-center justify-center text-[var(--color-brand-teal)] group-hover:scale-110 transition-transform">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[var(--color-brand-ink)]">{data.emailsSent}</div>
            <div className="text-xs text-[var(--color-brand-slate)] mt-1 flex items-center gap-1">
              <span className="text-[var(--color-brand-slate)] font-medium">Total outbound volume</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col justify-between hover:border-[var(--color-brand-teal)] transition-colors cursor-pointer group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--color-brand-slate)]">Interested Replies</h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#D1EAE2] text-[#2C5E57] uppercase tracking-wider">
              High Intent
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold text-emerald-600">{data.interestedReplies}</div>
            <div className="text-xs text-[var(--color-brand-slate)] mt-1 flex items-center gap-1">
              <span className="text-[var(--color-brand-slate)] font-medium">Total positive intents</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col justify-between hover:border-[var(--color-brand-teal)] transition-colors cursor-pointer group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--color-brand-slate)]">Running Campaigns</h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span> Active
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold text-[var(--color-brand-ink)]">{data.activeCampaigns}</div>
            <div className="text-xs text-[var(--color-brand-slate)] mt-1 flex items-center gap-1">
              <span className="text-[var(--color-brand-slate)] font-medium">Currently active pipelines</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5 flex flex-col justify-between hover:border-[var(--color-brand-teal)] transition-colors cursor-pointer group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[var(--color-brand-slate)]">Sites Analyzed</h3>
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
              <Search className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[var(--color-brand-ink)]">{data.sitesAnalyzed}</div>
            <div className="text-xs text-[var(--color-brand-slate)] mt-1 flex items-center gap-1">
              Total across workspace
            </div>
          </div>
        </GlassCard>
      </div>

      {/* 3. Welcome / Analyze CTA (for all users for now, can conditionally render later) */}
      <div className="bg-[linear-gradient(135deg,var(--color-brand-emerald)_0%,var(--color-brand-teal)_100%)] rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap className="w-5 h-5 fill-current" /> Standalone Analysis</h2>
          <p className="text-emerald-50 max-w-lg text-sm">Want to quickly check a prospect's website before building a campaign? Run a standalone audit right now.</p>
        </div>
        <div className="relative z-10 w-full md:w-auto">
          <Button variant="outline" className="w-full md:w-auto bg-white/10 border-white/20 text-white hover:bg-white hover:text-[var(--color-brand-teal)] border-0 h-11 px-6 rounded-full font-bold shadow-sm">
            <Search className="w-4 h-4 mr-2" /> Analyze a website
          </Button>
        </div>
      </div>

      {/* 4. Chart and Split Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityChart emailData={emailData} />
        </div>
        
        {/* Split Panel: Rates */}
        <div className="flex flex-col gap-4">
          <GlassCard className="p-5 flex-1 flex flex-col justify-center">
            <div className="flex justify-between items-end mb-2">
              <div className="text-sm font-semibold text-[var(--color-brand-slate)]">Reply Rate</div>
              <div className="text-2xl font-bold text-[var(--color-brand-ink)]">{data.replyRate}%</div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-[var(--color-brand-teal)] h-2 rounded-full" style={{ width: `${data.replyRate}%` }}></div>
            </div>
          </GlassCard>

          <GlassCard className="p-5 flex-1 flex flex-col justify-center">
            <div className="flex justify-between items-end mb-2">
              <div className="text-sm font-semibold text-[var(--color-brand-slate)]">Open Rate</div>
              <div className="text-2xl font-bold text-[var(--color-brand-ink)]">{data.openRate}%</div>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-[var(--color-brand-emerald)] h-2 rounded-full" style={{ width: `${data.openRate}%` }}></div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-2 gap-4 flex-1">
            <GlassCard className="p-4 flex flex-col justify-center text-center">
              <div className="text-2xl font-bold text-[var(--color-brand-ink)]">{data.uniqueClicks}</div>
              <div className="text-xs font-semibold text-[var(--color-brand-slate)] mt-1">Unique Clicks</div>
            </GlassCard>
            <GlassCard className="p-4 flex flex-col justify-center text-center border-red-100 bg-red-50/30">
              <div className="text-2xl font-bold text-red-600">{data.bounced}</div>
              <div className="text-xs font-semibold text-red-500 mt-1 flex items-center justify-center gap-1">
                <AlertCircle className="w-3 h-3" /> Bounced
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* 5. Split Panel: Recent Replies & Mailbox Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Replies */}
        <GlassCard className="p-6 h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[var(--color-brand-ink)]">Recent Replies</h2>
            <Link href="/dashboard/inboxes" className="text-sm font-semibold text-[var(--color-brand-teal)] hover:underline">
              View all
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {data.recentReplies.map((reply, i) => (
              <div key={i} className="p-4 rounded-xl border border-[var(--color-brand-border)] bg-white/50 hover:bg-white transition-colors cursor-pointer group flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[var(--color-brand-slate)] shrink-0 group-hover:bg-[var(--color-brand-pastel)] group-hover:text-[var(--color-brand-teal)] transition-colors">
                  {reply.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-semibold text-[var(--color-brand-ink)] truncate text-sm">{reply.name} <span className="text-[var(--color-brand-slate)] font-normal ml-1">from {reply.company}</span></div>
                    <div className="text-xs text-[var(--color-brand-slate)] shrink-0">{reply.time}</div>
                  </div>
                  <p className="text-sm text-[var(--color-brand-slate)] line-clamp-1 mb-2">{reply.text}</p>
                  <div className="flex gap-2">
                    {reply.intent === "interested" && <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#D1EAE2] text-[#2C5E57] uppercase">Interested</span>}
                    {reply.intent === "unsubscribe" && <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-500 uppercase">Unsubscribe</span>}
                    {reply.intent === "ooo" && <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-700 uppercase">Out of Office</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Mailbox Health */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-[var(--color-brand-ink)]">Mailbox Health</h2>
          
          <GlassCard className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <Mailbox className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-[var(--color-brand-ink)]">{data.mailboxHealth.total} Connected Mailboxes</div>
                <div className="text-xs text-[var(--color-brand-slate)] mt-0.5">All accounts healthy</div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-full font-semibold">Manage</Button>
          </GlassCard>

          <GlassCard className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-brand-pastel)] flex items-center justify-center text-[var(--color-brand-teal)]">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="font-bold text-[var(--color-brand-ink)]">Email Warmup</div>
                <div className="text-xs text-[var(--color-brand-teal)] font-medium mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-teal)] animate-pulse"></span> Active on 2 mailboxes
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-full font-semibold">Settings</Button>
          </GlassCard>

          <GlassCard className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-[var(--color-brand-ink)]">Email Verification</div>
                <div className="text-xs text-[var(--color-brand-slate)] mt-0.5">{data.mailboxHealth.verifiedEmails} emails verified</div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-full font-semibold">Verify List</Button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
