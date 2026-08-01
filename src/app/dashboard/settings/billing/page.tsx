'use client';

import { useState, useEffect } from 'react';
import { PLANS, CREDIT_TOPUP_PACKAGES, type PlanId } from '@/lib/plans';
import { Check, Shield, Battery, Send, Users, Activity, Crown, Zap, AlertCircle } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface BillingStatus {
  workspace: { id: string; name: string; tier: string };
  plan: {
    id: string; displayName: string; monthlyCredits: number;
    rolloverCap: number; monthlyPrice: number; annualPrice: number;
    maxCampaigns: number; maxMailboxes: number; maxTeamMembers: number;
    features: string[];
  };
  credits: {
    balance: number; allocated: number; rolloverCap: number;
    maxBalance: number; usedPercent: number;
  };
  subscription: {
    status: string; interval: string;
    currentPeriodStart: string; currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean; planDisplayName: string;
  } | null;
  usageHistory: Array<{ id: string; feature: string; creditsUsed: number; createdAt: string; resourceId?: string }>;
  invoices: Array<{ id: string; amount: number; currency: string; status: string; createdAt: string; pdfUrl?: string }>;
  topUps: Array<{ id: string; credits: number; amountUsd: number; status: string; createdAt: string }>;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BillingPage() {
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'annual' | 'credits'>('monthly');
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const res = await fetch('/api/billing/status');
      if (!res.ok) throw new Error('Failed to load billing data');
      const data = await res.json();
      setStatus(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSubscribe(planId: PlanId) {
    if (!status) return;
    setCheckoutLoading(planId);
    try {
      const res = await fetch('/api/billing/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, interval: billingInterval === 'credits' ? 'monthly' : billingInterval }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Failed to create checkout session');
      }
    } finally {
      setCheckoutLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-400 text-sm font-semibold">Loading billing information...</div>
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className="text-red-500 text-center p-8">
        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
        <p>{error || "Failed to load"}</p>
        <button onClick={load} className="mt-4 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg text-sm font-semibold">Try Again</button>
      </div>
    );
  }

  const currentTier = status.workspace.tier as PlanId;

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-20 animate-in fade-in duration-500">
      
      {/* ── Current Plan ── */}
      <section>
        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">Current Plan</h2>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-6">
          <div className="w-12 h-12 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center">
            <Crown className="w-6 h-6 text-gray-400" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-lg font-bold text-gray-900">{status.plan.displayName}</h3>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                {status.plan.displayName}
              </span>
            </div>
            <p className="text-sm text-gray-500 font-medium">
              {status.plan.monthlyCredits.toLocaleString()} credits / month - {currentTier === 'FREE' ? 'free forever' : `Renews ${new Date(status.subscription?.currentPeriodEnd || '').toLocaleDateString()}`}
            </p>
          </div>
        </div>
      </section>

      {/* ── Plans & Pricing ── */}
      <section className="text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Unlock everything <span className="text-[#66ca7a]">Swokei</span> has to offer
        </h2>
        
        {/* Toggle */}
        <div className="flex flex-col items-center mb-10">
          <div className="inline-flex items-center p-1 bg-gray-100 rounded-full border border-gray-200 shadow-inner">
            {(['annual', 'monthly', 'credits'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setBillingInterval(tab)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                  billingInterval === tab 
                    ? 'bg-gray-900 text-white shadow-md' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <p className="text-[#66ca7a] text-xs font-bold mt-3">Save 15% with annual</p>
        </div>

        {/* Benefits Row */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-12 text-xs font-semibold text-gray-500">
          <div className="flex items-center gap-1.5"><Activity className="w-4 h-4 text-[#66ca7a]" /> Unused credits roll over each month</div>
          <div className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-[#66ca7a]" /> Rollover capped at your plan's monthly limit</div>
          <div className="flex items-center gap-1.5"><Battery className="w-4 h-4 text-[#66ca7a]" /> Gifted & purchased credits never expire</div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {(['FREE', 'BASIC', 'PRO', 'AGENCY'] as PlanId[]).map((pid) => {
            const plan = PLANS[pid];
            const isPopular = plan.popular;
            const price = billingInterval === 'annual' ? plan.annualPrice : plan.monthlyPrice;
            
            return (
              <div key={pid} className={`bg-white rounded-3xl p-6 relative flex flex-col transition-transform hover:-translate-y-1 ${
                isPopular 
                  ? 'border-2 border-[#66ca7a] shadow-lg shadow-green-100/50' 
                  : 'border border-gray-100 shadow-sm'
              }`}>
                {isPopular && (
                  <div className="absolute -top-3 right-6 bg-[#e6f5ea] text-[#2c7a3c] text-[10px] font-bold px-3 py-1 rounded-full border border-[#bbf0c8]">
                    MOST POPULAR
                  </div>
                )}
                
                <div className="w-10 h-10 rounded-full bg-[#e6f5ea] flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 text-[#66ca7a]" />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900">{plan.displayName}</h3>
                <div className="mt-2 mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">${price}</span>
                  <span className="text-sm font-medium text-gray-500">/monthly</span>
                  <p className="text-[10px] font-medium text-gray-400 mt-1 uppercase tracking-wide">
                    {price === 0 ? 'No card needed' : 'Billed monthly'}
                  </p>
                </div>

                <button
                  onClick={() => { if (pid !== currentTier && pid !== 'FREE') handleSubscribe(pid); }}
                  disabled={checkoutLoading === pid}
                  className={`w-full py-3 rounded-xl text-sm font-bold transition-all mb-8 ${
                    pid === currentTier 
                      ? 'bg-gray-100 text-gray-500 cursor-default' 
                      : isPopular || pid !== 'FREE'
                        ? 'bg-[#66ca7a] hover:bg-[#5bb86d] text-white shadow-sm'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  {checkoutLoading === pid ? '...' : pid === currentTier ? 'Your plan' : 'Get started'}
                </button>

                <ul className="space-y-4 flex-1">
                  <li className="flex items-start gap-3 text-sm font-semibold text-gray-700">
                    <Check className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    {plan.monthlyCredits.toLocaleString()} credits / month
                  </li>
                  <li className="flex items-start gap-3 text-sm font-semibold text-gray-700">
                    <Check className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    {plan.maxMailboxes === 0 ? 'No mailboxes' : plan.maxMailboxes === -1 ? 'Unlimited mailboxes' : `${plan.maxMailboxes} mailboxes`}
                  </li>
                  <li className="flex items-start gap-3 text-sm font-semibold text-gray-700">
                    <Check className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    {plan.maxCampaigns === -1 ? 'Unlimited campaigns' : `${plan.maxCampaigns} campaign${plan.maxCampaigns > 1 ? 's' : ''}`}
                  </li>
                  <li className="flex items-start gap-3 text-sm font-semibold text-gray-700">
                    <Check className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    Seats: {plan.maxTeamMembers === 1 ? 'Just you' : plan.maxTeamMembers === -1 ? 'Unlimited' : `You +${plan.maxTeamMembers - 1}`}
                  </li>
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Billing & Payments ── */}
      <section>
        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">Billing & Payments</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Billing Settings */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col h-full">
            <h3 className="text-sm font-bold text-gray-900 mb-6">Billing settings</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-10 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center">
                <div className="w-6 h-4 bg-gray-200 rounded-sm"></div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">No payment method</p>
                <p className="text-xs font-medium text-gray-400">Add a card when you upgrade</p>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col h-full">
            <h3 className="text-sm font-bold text-gray-900 mb-6">Payment history</h3>
            <div className="flex-1 flex items-center justify-center text-sm font-semibold text-gray-400">
              No payments yet.
            </div>
          </div>

          {/* Invoices */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col min-h-[200px]">
            <h3 className="text-sm font-bold text-gray-900 mb-6">Invoices</h3>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-8 h-8 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center mb-3">
                <Send className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-sm font-bold text-gray-600">No invoices yet.</p>
              <p className="text-xs font-medium text-gray-400">Invoices appear here after your first payment.</p>
            </div>
          </div>

          {/* Credit History */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col h-full">
            <h3 className="text-sm font-bold text-gray-900 mb-6">Credit history</h3>
            <div className="flex-1 flex items-center justify-center text-sm font-semibold text-gray-400">
              No credit activity yet.
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
