"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { 
  Plus, Upload, MoreHorizontal, ExternalLink, 
  LayoutGrid, List, MessageSquare, Users, 
  ThumbsUp, Ban, Send, UserCheck, AlertTriangle
} from "lucide-react";
import { StatusPill } from "@/components/ui/StatusPill";
import Link from "next/link";

export type LeadData = {
  id: string;
  name: string | null;
  email: string | null;
  websiteUrl: string;
  status: string;
  score: number;
};

export function LeadsClient({ initialLeads }: { initialLeads: LeadData[] }) {
  const [view, setView] = useState<"board" | "list">("board");
  const [leads, setLeads] = useState<LeadData[]>(initialLeads);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  
  // Align columns with Prisma schema: NEW, QUALIFIED, CONTACTED, REPLIED, BOUNCED
  const columns = [
    { id: "NEW", label: "New Leads", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: "QUALIFIED", label: "Qualified", icon: UserCheck, color: "text-[var(--color-brand-teal)]", bg: "bg-[var(--color-brand-pastel)]" },
    { id: "CONTACTED", label: "Contacted", icon: Send, color: "text-amber-500", bg: "bg-amber-500/10" },
    { id: "REPLIED", label: "Replied", icon: ThumbsUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { id: "BOUNCED", label: "Bounced", icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggedLeadId(leadId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (!draggedLeadId) return;

    // Optimistic UI update
    setLeads(prev => prev.map(lead => 
      lead.id === draggedLeadId ? { ...lead, status: newStatus } : lead
    ));

    try {
      await fetch(`/api/leads/${draggedLeadId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
    } catch (err) {
      console.error("Failed to save lead status:", err);
    }
    
    setDraggedLeadId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-outfit font-bold text-[var(--color-brand-ink)]">Leads CRM</h1>
          <p className="text-[var(--color-brand-slate)] mt-1">Manage, import, and track your prospects.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-white/50 border border-[var(--color-brand-border)] rounded-lg p-1 mr-2">
            <button 
              onClick={() => setView("board")}
              className={`p-1.5 rounded-md transition-colors ${view === "board" ? "bg-white shadow-sm text-[var(--color-brand-teal)]" : "text-[var(--color-brand-slate)] hover:text-[var(--color-brand-ink)]"}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setView("list")}
              className={`p-1.5 rounded-md transition-colors ${view === "list" ? "bg-white shadow-sm text-[var(--color-brand-teal)]" : "text-[var(--color-brand-slate)] hover:text-[var(--color-brand-ink)]"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Link href="/dashboard/leads/find">
            <Button variant="outline" className="bg-white">
              <SearchIcon className="w-4 h-4 mr-2" />
              Find Leads
            </Button>
          </Link>
          <Button variant="secondary" className="bg-white">
            <Upload className="w-4 h-4" />
            CSV
          </Button>
          <Button variant="primary" className="shadow-[var(--shadow-soft-teal)]">
            <Plus className="w-4 h-4" />
            Add Lead
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative">
        {leads.length === 0 ? (
           <div className="h-full flex flex-col items-center justify-center text-[var(--color-brand-slate)] bg-white/50 rounded-2xl border border-[var(--color-brand-border)] border-dashed animate-in fade-in zoom-in-95 duration-500 p-8">
             <div className="w-16 h-16 bg-[var(--color-brand-pastel)] rounded-full flex items-center justify-center text-[var(--color-brand-teal)] mb-4">
               <Users className="w-8 h-8" />
             </div>
             <p className="text-xl font-bold text-[var(--color-brand-ink)] font-outfit">No leads found</p>
             <p className="text-sm mt-2 mb-6 max-w-sm mx-auto text-center">Import a CSV of your prospects or use our built-in Lead Finder to discover local businesses.</p>
             <div className="flex gap-4">
               <Link href="/dashboard/leads/find">
                 <Button variant="outline" className="bg-white">Find Local Leads</Button>
               </Link>
               <Button variant="primary" className="shadow-[var(--shadow-soft-teal)]">
                 Import CSV
               </Button>
             </div>
           </div>
        ) : view === "list" ? (
          <GlassCard className="h-full overflow-hidden flex flex-col">
            <div className="flex-1 overflow-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-[var(--color-brand-slate)] uppercase bg-[var(--color-brand-pastel)]/30 border-b border-[var(--color-brand-border)] sticky top-0 backdrop-blur-md">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Company / Website</th>
                    <th className="px-6 py-4 font-semibold">Contact Email</th>
                    <th className="px-6 py-4 font-semibold">AI Score</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-brand-border)]">
                  {leads.map((lead) => {
                    const displayUrl = lead.websiteUrl.replace(/^https?:\/\//, '');
                    return (
                      <tr key={lead.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[var(--color-brand-ink)]">{lead.name || 'Unknown Company'}</span>
                            <a href={lead.websiteUrl} target="_blank" rel="noreferrer" className="text-[var(--color-brand-slate)] hover:text-[var(--color-brand-teal)]">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                          <div className="text-xs text-[var(--color-brand-slate)] mt-0.5">{displayUrl}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-[var(--color-brand-ink)]">{lead.email || '—'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-brand-pastel)] text-[var(--color-brand-teal)] font-bold text-xs border border-[var(--color-brand-emerald)]/20">
                            {lead.score}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusPill status={lead.status === "NEW" ? "neutral" : lead.status === "QUALIFIED" || lead.status === "REPLIED" ? "success" : lead.status === "CONTACTED" ? "warning" : "error"}>
                            {columns.find(c => c.id === lead.status)?.label || lead.status}
                          </StatusPill>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-[var(--color-brand-slate)] hover:text-[var(--color-brand-ink)] rounded-lg hover:bg-black/5 transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GlassCard>
        ) : (
          <div className="h-full flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
            {columns.map(col => {
              const colLeads = leads.filter(l => l.status === col.id);
              return (
                <div key={col.id} className="flex-shrink-0 w-[300px] flex flex-col max-h-full snap-start">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded flex items-center justify-center ${col.bg} ${col.color}`}>
                        <col.icon className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="font-semibold text-sm text-[var(--color-brand-ink)]">{col.label}</h3>
                    </div>
                    <span className="text-xs font-medium text-[var(--color-brand-slate)] bg-black/5 px-2 py-0.5 rounded-full">
                      {colLeads.length}
                    </span>
                  </div>
                  
                  <div 
                    className={`flex-1 rounded-2xl p-3 overflow-y-auto space-y-3 border transition-colors ${
                      draggedLeadId ? 'bg-black/[0.02] border-slate-200 border-dashed' : 'bg-black/5 border-black/[0.03]'
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, col.id)}
                  >
                    {colLeads.map(lead => (
                      <div 
                        key={lead.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        className={`bg-white rounded-xl p-4 shadow-sm border border-[var(--color-brand-border)] hover:border-[var(--color-brand-teal)]/50 hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${
                          draggedLeadId === lead.id ? 'opacity-50 scale-95' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <Link href={`/dashboard/leads/${lead.id}`} className="font-semibold text-sm text-[var(--color-brand-ink)] leading-tight hover:text-[var(--color-brand-teal)] truncate pr-2">
                            {lead.name || 'Unknown Company'}
                          </Link>
                          <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[var(--color-brand-pastel)] text-[var(--color-brand-teal)] font-bold text-[10px] shrink-0">
                            {lead.score}
                          </div>
                        </div>
                        <div className="text-xs text-[var(--color-brand-slate)] mb-3 truncate">{lead.email || lead.websiteUrl.replace(/^https?:\/\//, '')}</div>
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
                          <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-[var(--color-brand-slate)] hover:bg-slate-50 transition-colors">
                            <MessageSquare className="w-3.5 h-3.5" /> Mail
                          </button>
                          <a href={lead.websiteUrl} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium text-[var(--color-brand-slate)] hover:bg-slate-50 transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" /> Site
                          </a>
                        </div>
                      </div>
                    ))}
                    
                    {colLeads.length === 0 && (
                      <div className="h-24 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400 font-medium">
                        Drop leads here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
