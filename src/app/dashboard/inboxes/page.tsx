"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Mail, Settings, Plus, Activity, AlertCircle, CheckCircle2, Shield, Inbox, Globe, MailWarning } from "lucide-react";
import { StatusPill } from "@/components/ui/StatusPill";

export default function InboxesPage() {
  const [activeTab, setActiveTab] = useState<"mailboxes" | "unified">("mailboxes");
  const [mailboxes, setMailboxes] = useState<any[]>([]);
  const [replies, setReplies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // SMTP Modal State
  const [showSmtpModal, setShowSmtpModal] = useState(false);
  const [smtpForm, setSmtpForm] = useState({
    email: '',
    smtpHost: '',
    smtpPort: '465',
    smtpUser: '',
    smtpPass: ''
  });

  const fetchMailboxes = async () => {
    try {
      const [mailboxesRes, repliesRes] = await Promise.all([
        fetch("/api/mailboxes"),
        fetch("/api/replies")
      ]);
      const data = await mailboxesRes.json();
      const repliesData = await repliesRes.json();

      if (Array.isArray(data)) setMailboxes(data);
      if (Array.isArray(repliesData)) setReplies(repliesData);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMailboxes();
  }, []);

  const handleConnect = async (provider: string) => {
    if (provider === "smtp") {
      setShowSmtpModal(true);
      return;
    }
    
    // For others (Google/Outlook OAuth placeholder)
    const email = prompt(`Enter ${provider} email to connect:`);
    if (!email) return;

    try {
      const res = await fetch("/api/mailboxes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, provider })
      });
      if (res.ok) {
        fetchMailboxes();
      } else {
        alert("Failed to connect mailbox");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSmtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/mailboxes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: smtpForm.email,
          provider: 'smtp',
          smtpHost: smtpForm.smtpHost,
          smtpPort: parseInt(smtpForm.smtpPort, 10),
          smtpUser: smtpForm.smtpUser,
          smtpPass: smtpForm.smtpPass
        })
      });
      if (res.ok) {
        setShowSmtpModal(false);
        setSmtpForm({ email: '', smtpHost: '', smtpPort: '465', smtpUser: '', smtpPass: '' });
        fetchMailboxes();
      } else {
        alert("Failed to connect SMTP mailbox");
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-outfit font-bold text-[var(--color-brand-ink)]">Email Workspace</h1>
          <p className="text-[var(--color-brand-slate)] mt-1">Manage sender accounts and unified inbox replies.</p>
        </div>

        <div className="flex gap-3">
          <div className="flex bg-white/50 border border-[var(--color-brand-border)] rounded-lg p-1 mr-2">
            <button 
              onClick={() => setActiveTab("mailboxes")}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors ${activeTab === "mailboxes" ? "bg-white shadow-sm text-[var(--color-brand-teal)]" : "text-[var(--color-brand-slate)] hover:text-[var(--color-brand-ink)]"}`}
            >
              Connected Accounts
            </button>
            <button 
              onClick={() => setActiveTab("unified")}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-colors flex items-center gap-2 ${activeTab === "unified" ? "bg-white shadow-sm text-[var(--color-brand-teal)]" : "text-[var(--color-brand-slate)] hover:text-[var(--color-brand-ink)]"}`}
            >
              Unified Inbox
              <span className="bg-[var(--color-brand-teal)] text-white text-[10px] px-1.5 py-0.5 rounded-full">3</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pb-6">
        {activeTab === "mailboxes" && (
          <div className="space-y-6">
            {/* Summary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassCard className="p-6 border-t-4 border-t-[var(--color-brand-emerald)]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-brand-slate)] uppercase tracking-wider mb-1">Total Capacity</p>
                    <h3 className="text-3xl font-bold text-[var(--color-brand-ink)]">65 <span className="text-lg text-[var(--color-brand-slate)] font-normal">emails/day</span></h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[var(--color-brand-pastel)] flex items-center justify-center text-[var(--color-brand-teal)]">
                    <Activity className="w-5 h-5" />
                  </div>
                </div>
              </GlassCard>
              <GlassCard className="p-6 border-t-4 border-t-blue-500">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-brand-slate)] uppercase tracking-wider mb-1">Active Accounts</p>
                    <h3 className="text-3xl font-bold text-[var(--color-brand-ink)]">2 <span className="text-lg text-[var(--color-brand-slate)] font-normal">/ 3</span></h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Globe className="w-5 h-5" />
                  </div>
                </div>
              </GlassCard>
              <GlassCard className="p-6 border-t-4 border-t-amber-500">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-brand-slate)] uppercase tracking-wider mb-1">Sender Health</p>
                    <h3 className="text-3xl font-bold text-[var(--color-brand-ink)]">99%</h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <Shield className="w-5 h-5" />
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[var(--color-brand-ink)]">Connected Mailboxes</h2>
              <div className="flex gap-3">
                <Button variant="outline" className="bg-white hover:bg-slate-50 border-gray-200" onClick={() => handleConnect("smtp")}>
                  <Mail className="w-4 h-4 mr-2" />
                  Connect SMTP
                </Button>
                <Button variant="outline" className="bg-white hover:bg-slate-50 border-gray-200" onClick={() => alert("Google OAuth requires developer setup. Use SMTP for now!")}>
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-4 h-4 mr-2" />
                  Google Workspace
                </Button>
              </div>
            </div>

            {/* Mailboxes Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mailboxes.map((box) => (
                <GlassCard key={box.id} className={`p-6 transition-all ${box.status === "disconnected" ? "opacity-75 grayscale-[0.5]" : ""}`}>
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
                        {box.provider === "google" ? (
                          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="w-6 h-6" />
                        ) : box.provider === "outlook" ? (
                          <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" className="w-6 h-6" />
                        ) : (
                          <Mail className="w-6 h-6 text-slate-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-[var(--color-brand-ink)]">{box.email}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {box.status === "CONNECTED" && <StatusPill status="success"><CheckCircle2 className="w-3 h-3 mr-1"/> Connected</StatusPill>}
                          {box.status === "ERROR" && <StatusPill status="error"><AlertCircle className="w-3 h-3 mr-1"/> Error</StatusPill>}
                        </div>
                      </div>
                    </div>
                    <button className="text-[var(--color-brand-slate)] hover:text-[var(--color-brand-ink)] p-2 rounded-lg hover:bg-black/5 transition-colors">
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm font-medium mb-1">
                        <span className="text-[var(--color-brand-slate)]">Sending Limit</span>
                        <span className="text-[var(--color-brand-ink)]">{box.sentToday} / {box.dailyLimit} today</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${box.status === "ERROR" ? "bg-slate-300" : "bg-[var(--color-brand-teal)]"}`} 
                          style={{ width: box.dailyLimit > 0 ? `${(box.sentToday / box.dailyLimit) * 100}%` : '0%' }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm font-medium mb-1">
                        <span className="text-[var(--color-brand-slate)]">Sender Health</span>
                        <span className="text-[var(--color-brand-ink)]">{box.health}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${box.status === "ERROR" ? "bg-slate-300" : box.health > 80 ? "bg-emerald-500" : "bg-amber-500"}`} 
                          style={{ width: `${box.health}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {activeTab === "unified" && (
          <GlassCard className="p-0 overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-[var(--color-brand-border)] bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Inbox className="w-5 h-5 text-[var(--color-brand-teal)]" />
                <h2 className="font-semibold text-[var(--color-brand-ink)]">AI Classified Replies</h2>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200 cursor-pointer">Interested (2)</span>
                <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full border border-red-200 cursor-pointer">Not Interested (1)</span>
              </div>
            </div>

            <div className="divide-y divide-[var(--color-brand-border)] overflow-y-auto">
              {replies.length === 0 ? (
                <div className="p-8 text-center text-[var(--color-brand-slate)]">No replies yet. Send some campaigns!</div>
              ) : replies.map(reply => (
                <div key={reply.id} className="p-4 hover:bg-[var(--color-brand-pastel)]/30 transition-colors cursor-pointer group flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-brand-pastel)] text-[var(--color-brand-teal)] flex items-center justify-center font-bold shrink-0">
                    {reply.lead.name ? reply.lead.name.charAt(0) : reply.lead.email.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-[var(--color-brand-ink)] truncate">{reply.lead.name || "Unknown"} <span className="font-normal text-[var(--color-brand-slate)] text-sm">&lt;{reply.lead.email}&gt;</span></h3>
                      <span className="text-xs font-medium text-[var(--color-brand-slate)] shrink-0">{new Date(reply.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${reply.intent === "POSITIVE" ? "bg-green-100 text-green-700" : reply.intent === "NEGATIVE" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"}`}>
                        {reply.intent || "UNKNOWN"}
                      </span>
                      <p className="text-sm font-semibold text-[var(--color-brand-ink)] truncate">Re: Outreach Campaign</p>
                    </div>
                    <p className="text-sm text-[var(--color-brand-slate)] truncate">{reply.rawContent.substring(0, 100)}...</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
      {/* SMTP Connection Modal */}
      {showSmtpModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-[var(--color-brand-ink)]">Connect via SMTP</h3>
              <button onClick={() => setShowSmtpModal(false)} className="text-slate-400 hover:text-slate-600">×</button>
            </div>
            
            <form onSubmit={handleSmtpSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--color-brand-slate)] mb-1">Email Address</label>
                <input 
                  type="email" required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)]" 
                  value={smtpForm.email} onChange={e => setSmtpForm({...smtpForm, email: e.target.value})}
                  placeholder="name@company.com"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-[var(--color-brand-slate)] mb-1">SMTP Host</label>
                  <input 
                    type="text" required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)]" 
                    value={smtpForm.smtpHost} onChange={e => setSmtpForm({...smtpForm, smtpHost: e.target.value})}
                    placeholder="smtp.gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--color-brand-slate)] mb-1">Port</label>
                  <input 
                    type="number" required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)]" 
                    value={smtpForm.smtpPort} onChange={e => setSmtpForm({...smtpForm, smtpPort: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--color-brand-slate)] mb-1">SMTP Username</label>
                <input 
                  type="text" required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)]" 
                  value={smtpForm.smtpUser} onChange={e => setSmtpForm({...smtpForm, smtpUser: e.target.value})}
                  placeholder="Username (usually email)"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--color-brand-slate)] mb-1">App Password</label>
                <input 
                  type="password" required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)]" 
                  value={smtpForm.smtpPass} onChange={e => setSmtpForm({...smtpForm, smtpPass: e.target.value})}
                  placeholder="••••••••••••"
                />
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => setShowSmtpModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary">Connect Account</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
