"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { GlassCard } from "@/components/ui/GlassCard";
import { useState } from "react";
import { ChevronDown, Filter } from "lucide-react";

interface ActivityChartProps {
  emailData: { date: string; sent: number; opened: number; clicked: number }[];
}

export function ActivityChart({ emailData }: ActivityChartProps) {
  const [timeRange, setTimeRange] = useState("Last 7 Days");

  return (
    <GlassCard className="p-6 h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-brand-ink)]">Send Performance</h2>
          <p className="text-sm text-[var(--color-brand-slate)]">Emails sent, opened, and clicked over time</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-[var(--color-brand-slate)] bg-white/50 border border-[var(--color-brand-border)] rounded-lg hover:bg-white transition-colors">
            <Filter className="w-4 h-4" />
            All Campaigns
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-[var(--color-brand-slate)] bg-white/50 border border-[var(--color-brand-border)] rounded-lg hover:bg-white transition-colors">
            {timeRange}
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 w-full h-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={emailData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-brand-slate)" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="var(--color-brand-slate)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorOpened" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-brand-teal)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-brand-teal)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorClicked" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-brand-emerald)" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="var(--color-brand-emerald)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-brand-border)" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-brand-slate)" }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--color-brand-slate)" }} />
            <Tooltip 
              contentStyle={{ borderRadius: "12px", border: "1px solid var(--color-brand-border)", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              itemStyle={{ fontWeight: "bold" }}
            />
            <Area type="monotone" dataKey="sent" name="Sent" stroke="var(--color-brand-slate)" strokeWidth={2} fillOpacity={1} fill="url(#colorSent)" />
            <Area type="monotone" dataKey="opened" name="Opened" stroke="var(--color-brand-teal)" strokeWidth={3} fillOpacity={1} fill="url(#colorOpened)" />
            <Area type="monotone" dataKey="clicked" name="Clicked" stroke="var(--color-brand-emerald)" strokeWidth={3} fillOpacity={1} fill="url(#colorClicked)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
