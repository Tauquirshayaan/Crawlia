"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components/ui/Button";
import { Plus, Search, ChevronDown, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type CampaignData = {
  id: string;
  name: string;
  status: string;
  createdAt: Date;
  stats: {
    sent: number;
    openRate: number;
    replyRate: number;
  };
};

const fetcher = (url: string) => fetch(url).then(r => r.json()).then(data => data.map((c: any) => ({
  id: c.id,
  name: c.name,
  status: c.status,
  createdAt: new Date(c.createdAt),
  stats: {
    sent: c.campaignLeads?.length || 0,
    openRate: 0,
    replyRate: 0,
  }
})));

export function CampaignsTable({ initialCampaigns }: { initialCampaigns: CampaignData[] }) {
  const router = useRouter();
  
  const { data: campaignsData } = useSWR<CampaignData[]>('/api/campaigns', fetcher, {
    fallbackData: initialCampaigns,
    refreshInterval: 5000, // Poll every 5s
  });
  
  const campaigns = campaignsData || initialCampaigns;
  const [activeTab, setActiveTab] = useState<"all" | "running" | "created" | "draft" | "paused" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCampaigns = campaigns.filter(c => {
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeTab === "all") return true;
    if (activeTab === "running") return c.status === "RUNNING";
    if (activeTab === "created") return c.status === "CREATED";
    if (activeTab === "draft") return c.status === "DRAFT";
    if (activeTab === "paused") return c.status === "PAUSED";
    if (activeTab === "completed") return c.status === "COMPLETED";
    return true;
  });

  const getCount = (status?: string) => {
    if (!status) return campaigns.length;
    return campaigns.filter(c => c.status === status).length;
  };

  const statCards = [
    { title: "Total campaigns", count: campaigns.length, subtitle: "All campaigns" },
    { title: "Running campaigns", count: getCount("RUNNING"), subtitle: "Sending now" },
    { title: "Drafts", count: getCount("DRAFT"), subtitle: "Not started" },
    { title: "Completed", count: getCount("COMPLETED"), subtitle: "Finished sending" },
  ];

  const tabs = [
    { id: "all", label: "All" },
    { id: "running", label: "Running" },
    { id: "created", label: "Created" },
    { id: "draft", label: "Draft" },
    { id: "paused", label: "Paused" },
    { id: "completed", label: "Completed" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm relative">
            <h3 className="text-sm font-medium text-gray-500 mb-2">{stat.title}</h3>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stat.count}</div>
            <p className="text-xs text-gray-400">{stat.subtitle}</p>
            <Info className="absolute top-4 right-4 w-4 h-4 text-gray-300" />
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search campaigns"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-6 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <button className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-sm whitespace-nowrap">
            Newest first <ChevronDown className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1.5 whitespace-nowrap transition-colors ${
                  activeTab === tab.id 
                    ? "bg-gray-100 text-gray-900" 
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {tab.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-white text-gray-600" : "text-gray-400"}`}>
                  {tab.id === "all" ? campaigns.length : getCount(tab.id.toUpperCase())}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden min-h-[400px] flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 w-12"><input type="checkbox" className="rounded border-gray-300 text-green-500 focus:ring-green-500" /></th>
                <th className="px-6 py-4">NAME</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4">TYPE</th>
                <th className="px-6 py-4">LEADS</th>
                <th className="px-6 py-4">CREATED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      <p className="text-base font-bold text-gray-900 mb-1">No campaigns yet</p>
                      <p className="text-sm text-gray-500 mb-6">Create your first campaign to get started</p>
                      <Link href="/dashboard/campaigns/new">
                        <Button variant="primary" className="bg-[#66ca7a] hover:bg-[#5bb86d] text-white shadow-sm border-none font-semibold px-6 rounded-lg">
                          <Plus className="w-4 h-4 mr-2" />
                          New campaign
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/campaigns/${campaign.id}`)}>
                    <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" className="rounded border-gray-300 text-green-500 focus:ring-green-500" />
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{campaign.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        campaign.status === "RUNNING" ? "bg-green-100 text-green-700" :
                        campaign.status === "PAUSED" ? "bg-yellow-100 text-yellow-700" :
                        campaign.status === "COMPLETED" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {campaign.status.charAt(0) + campaign.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">Email</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{campaign.stats.sent}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(campaign.createdAt))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
