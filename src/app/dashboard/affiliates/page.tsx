import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import { 
  Gift, 
  Copy, 
  Users, 
  CreditCard, 
  TrendingUp, 
  ExternalLink 
} from "lucide-react";

export default function AffiliatesPage() {
  const referrals = [
    { id: 1, name: "Nexus Digital", email: "hello@nexus.agency", status: "CONVERTED", date: "Jul 28, 2026", credits: "+500" },
    { id: 2, name: "Sarah Connor", email: "sarah.c@sky.net", status: "PENDING", date: "Jul 27, 2026", credits: "-" },
    { id: 3, name: "Acme Web Studio", email: "team@acmeweb.com", status: "CONVERTED", date: "Jul 25, 2026", credits: "+500" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-outfit font-bold text-[var(--color-brand-ink)]">Partner Program</h1>
        <p className="text-[var(--color-brand-slate)] mt-1">Refer other agencies and earn 500 bonus credits for every paid conversion.</p>
      </div>

      {/* Hero / Link Section */}
      <div className="bg-[linear-gradient(135deg,var(--color-brand-emerald)_0%,var(--color-brand-teal)_100%)] rounded-3xl p-1 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="bg-white/10 backdrop-blur-md rounded-[22px] p-8 md:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-2">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-outfit font-bold">Invite friends, get free credits</h2>
            <p className="text-white/80 max-w-md mx-auto md:mx-0 leading-relaxed">
              For every friend who signs up and upgrades to a paid plan, you both receive 500 bonus analysis credits added to your account instantly.
            </p>
          </div>

          <div className="w-full md:w-auto bg-white p-6 rounded-2xl shadow-[var(--shadow-card)] text-center md:text-left">
            <label className="block text-xs font-bold text-[var(--color-brand-slate)] uppercase tracking-wider mb-2">Your unique referral link</label>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                readOnly 
                value="https://crawlia.com/ref/jd-824f9"
                className="w-full md:w-64 px-4 py-2.5 bg-slate-50 border border-[var(--color-brand-border)] rounded-xl text-sm font-mono text-[var(--color-brand-ink)] focus:outline-none"
              />
              <Button variant="primary" className="shrink-0 px-4">
                <Copy className="w-4 h-4 mr-2" /> Copy
              </Button>
            </div>
            <div className="flex justify-center md:justify-start gap-4 mt-4">
              <button className="text-sm font-semibold text-[var(--color-brand-teal)] hover:underline flex items-center gap-1"><ExternalLink className="w-3.5 h-3.5"/> Share on Twitter</button>
              <button className="text-sm font-semibold text-[var(--color-brand-teal)] hover:underline flex items-center gap-1"><ExternalLink className="w-3.5 h-3.5"/> Share on LinkedIn</button>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-brand-slate)]">Total Referrals</p>
              <h3 className="text-2xl font-bold text-[var(--color-brand-ink)] font-outfit">12</h3>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-brand-slate)]">Paid Conversions</p>
              <h3 className="text-2xl font-bold text-[var(--color-brand-ink)] font-outfit">2</h3>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--color-brand-slate)]">Credits Earned</p>
              <h3 className="text-2xl font-bold text-[var(--color-brand-ink)] font-outfit">1,000</h3>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* History Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="p-6 border-b border-[var(--color-brand-border)] flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--color-brand-ink)] font-outfit">Referral History</h2>
        </div>
        
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/40 border-b border-[var(--color-brand-border)]">
                <th className="py-3 px-6 text-xs font-bold text-[var(--color-brand-slate)] uppercase tracking-wider">User / Agency</th>
                <th className="py-3 px-6 text-xs font-bold text-[var(--color-brand-slate)] uppercase tracking-wider">Date Joined</th>
                <th className="py-3 px-6 text-xs font-bold text-[var(--color-brand-slate)] uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 text-xs font-bold text-[var(--color-brand-slate)] uppercase tracking-wider text-right">Reward</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-brand-border)] bg-white/20">
              {referrals.map((ref) => (
                <tr key={ref.id} className="hover:bg-white/60 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-[var(--color-brand-ink)] text-sm">{ref.name}</div>
                    <div className="text-xs text-[var(--color-brand-slate)]">{ref.email}</div>
                  </td>
                  <td className="py-4 px-6 text-sm text-[var(--color-brand-slate)]">
                    {ref.date}
                  </td>
                  <td className="py-4 px-6">
                    <StatusPill status={ref.status === "CONVERTED" ? "success" : "neutral"}>
                      {ref.status}
                    </StatusPill>
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-[var(--color-brand-teal)] text-sm">
                    {ref.credits}
                  </td>
                </tr>
              ))}
              {referrals.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-[var(--color-brand-slate)]">
                    <div className="flex flex-col items-center justify-center">
                      <Gift className="w-8 h-8 text-[var(--color-brand-slate)]/50 mb-3" />
                      <p className="font-medium">No referrals yet</p>
                      <p className="text-sm">Share your link to get started.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
