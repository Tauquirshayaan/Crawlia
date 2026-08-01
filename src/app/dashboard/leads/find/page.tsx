"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Search, MapPin, Building2, Check, Download, Globe, Target, Map, Activity, Crosshair } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LeadFinderPage() {
  const router = useRouter();
  const [query, setQuery] = useState("Web Design");
  const [industry, setIndustry] = useState("Software");
  const [country, setCountry] = useState("United States");
  const [city, setCity] = useState("New York");
  
  const [isSearching, setIsSearching] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  
  const [results, setResults] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSearching) {
      setScanStep(1);
      interval = setInterval(() => {
        setScanStep(prev => (prev < 4 ? prev + 1 : prev));
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isSearching]);

  const handleSearch = async () => {
    setIsSearching(true);
    setResults([]);
    try {
      const res = await fetch(`/api/leads/search?query=${encodeURIComponent(query)}&industry=${encodeURIComponent(industry)}&location=${encodeURIComponent(city + ", " + country)}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results);
      }
    } catch (e) {
      console.error(e);
    }
    setIsSearching(false);
    setScanStep(0);
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === results.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(results.map(r => r.id)));
    }
  };

  const handleImport = async () => {
    if (selectedIds.size === 0) return;
    setIsImporting(true);
    
    const leadsToImport = results.filter(r => selectedIds.has(r.id));
    
    try {
      const res = await fetch("/api/leads/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads: leadsToImport }),
      });
      
      if (res.ok) {
        router.push("/dashboard/leads");
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
    setIsImporting(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-outfit font-bold text-[var(--color-brand-ink)]">Lead Generation Map</h1>
          <p className="text-[var(--color-brand-slate)] mt-1">Discover high-quality B2B prospects using Smart Outreach.</p>
        </div>
        {selectedIds.size > 0 && (
          <Button variant="primary" onClick={handleImport} disabled={isImporting}>
            {isImporting ? "Importing..." : `Import ${selectedIds.size} Leads to CRM`}
            <Download className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        
        {/* Left Column: Filters */}
        <GlassCard className="col-span-1 p-6 flex flex-col h-full overflow-y-auto">
          <h2 className="font-semibold text-lg mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-[var(--color-brand-teal)]" />
            Target Audience
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[var(--color-brand-slate)] uppercase tracking-wider mb-2">
                Country
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 absolute left-3 top-3 text-[var(--color-brand-slate)]" />
                <select 
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white/50 border border-[var(--color-brand-border)] rounded-xl text-[var(--color-brand-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-emerald)] appearance-none"
                >
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                  <option>Australia</option>
                  <option>India</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-brand-slate)] uppercase tracking-wider mb-2">
                City / Area
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-[var(--color-brand-slate)]" />
                <input 
                  type="text" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white/50 border border-[var(--color-brand-border)] rounded-xl text-[var(--color-brand-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-emerald)]"
                  placeholder="e.g. New York"
                />
              </div>
            </div>

            <div className="border-t border-[var(--color-brand-border)] my-2"></div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-brand-slate)] uppercase tracking-wider mb-2">
                Industry
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3 top-3 text-[var(--color-brand-slate)]" />
                <select 
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white/50 border border-[var(--color-brand-border)] rounded-xl text-[var(--color-brand-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-emerald)] appearance-none"
                >
                  <option>Software</option>
                  <option>Real Estate</option>
                  <option>Healthcare</option>
                  <option>Marketing</option>
                  <option>Finance</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-brand-slate)] uppercase tracking-wider mb-2">
                Keywords or Job Title
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[var(--color-brand-slate)]" />
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white/50 border border-[var(--color-brand-border)] rounded-xl text-[var(--color-brand-ink)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-emerald)]"
                  placeholder="e.g. CTO, Marketing Director"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button variant="primary" onClick={handleSearch} disabled={isSearching} className="w-full h-12 shadow-[var(--shadow-soft-teal)]">
                {isSearching ? (
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 animate-spin" /> Scanning Area...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Map className="w-4 h-4" /> Start Lead Generation Map
                  </span>
                )}
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Right Column: Visualization / Results */}
        <div className="col-span-1 lg:col-span-2 h-full flex flex-col relative rounded-2xl overflow-hidden border border-[var(--color-brand-border)] bg-[var(--color-brand-canvas)] shadow-inner">
          {/* Map Background Layer (Decorative) */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
            <svg width="200%" height="200%" xmlns="http://www.w3.org/2000/svg" className="opacity-10">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            <div className="absolute w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,var(--color-brand-emerald)_0%,transparent_70%)] blur-[100px] opacity-[0.15]"></div>
          </div>

          <div className="relative z-10 flex-1 flex flex-col p-6">
            {!isSearching && results.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-[var(--color-brand-teal)] mb-6 shadow-xl shadow-[var(--color-brand-emerald)]/10 border border-[var(--color-brand-border)]">
                  <Crosshair className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-[var(--color-brand-ink)] mb-3">Ready to Scan</h3>
                <p className="text-[var(--color-brand-slate)]">Configure your target audience on the left and start the scan to discover high-quality leads in {city}.</p>
              </div>
            )}

            {isSearching && (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative mb-12">
                  <div className="w-32 h-32 rounded-full border-2 border-[var(--color-brand-teal)]/30 border-dashed animate-[spin_4s_linear_infinite] flex items-center justify-center"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-[linear-gradient(135deg,var(--color-brand-emerald)_0%,var(--color-brand-teal)_100%)] flex items-center justify-center text-white shadow-[0_0_40px_rgba(20,184,166,0.6)] animate-pulse">
                      <Search className="w-10 h-10" />
                    </div>
                  </div>
                  {/* Radar Blips */}
                  <div className="absolute top-0 right-[-30px] w-4 h-4 bg-[var(--color-brand-emerald)] rounded-full animate-ping"></div>
                  <div className="absolute bottom-4 left-[-40px] w-3 h-3 bg-[var(--color-brand-teal)] rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute top-[-40px] left-10 w-5 h-5 bg-emerald-400 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
                </div>
                
                <div className="space-y-5 w-72">
                  <div className={`flex items-center gap-4 transition-opacity duration-500 ${scanStep >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                    <Check className={`w-6 h-6 ${scanStep >= 2 ? 'text-[var(--color-brand-teal)]' : 'text-slate-300'}`} />
                    <span className="text-base font-medium">Scanning Google Maps...</span>
                  </div>
                  <div className={`flex items-center gap-4 transition-opacity duration-500 ${scanStep >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                    <Check className={`w-6 h-6 ${scanStep >= 3 ? 'text-[var(--color-brand-teal)]' : 'text-slate-300'}`} />
                    <span className="text-base font-medium">Reading {industry} websites...</span>
                  </div>
                  <div className={`flex items-center gap-4 transition-opacity duration-500 ${scanStep >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                    <Check className={`w-6 h-6 ${scanStep >= 4 ? 'text-[var(--color-brand-teal)]' : 'text-slate-300'}`} />
                    <span className="text-base font-medium">Extracting decision makers...</span>
                  </div>
                </div>
              </div>
            )}

            {!isSearching && results.length > 0 && (
              <div className="flex-1 flex flex-col bg-white/90 backdrop-blur-xl rounded-xl border border-[var(--color-brand-border)] shadow-[var(--shadow-elevated-teal)] overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="px-6 py-4 border-b border-[var(--color-brand-border)] bg-slate-50/50 flex justify-between items-center">
                  <span className="font-semibold text-base text-[var(--color-brand-ink)]">Found {results.length} Prospects</span>
                  <div className="flex items-center gap-2 text-sm text-[var(--color-brand-slate)] bg-white px-3 py-1 rounded-full border border-[var(--color-brand-border)]">
                    <MapPin className="w-3.5 h-3.5" />
                    {city}, {country}
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-[var(--color-brand-slate)] uppercase sticky top-0 bg-white shadow-sm z-10">
                      <tr>
                        <th className="px-6 py-4 w-12 bg-white">
                          <input 
                            type="checkbox" 
                            checked={selectedIds.size === results.length}
                            onChange={toggleSelectAll}
                            className="rounded border-[var(--color-brand-border)] text-[var(--color-brand-teal)] focus:ring-[var(--color-brand-emerald)] w-4 h-4 cursor-pointer"
                          />
                        </th>
                        <th className="px-6 py-4 font-semibold bg-white">Company</th>
                        <th className="px-6 py-4 font-semibold bg-white">Contact</th>
                        <th className="px-6 py-4 font-semibold bg-white">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-brand-border)]">
                      {results.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => toggleSelect(lead.id)}>
                          <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={selectedIds.has(lead.id)}
                              onChange={() => toggleSelect(lead.id)}
                              className="rounded border-[var(--color-brand-border)] text-[var(--color-brand-teal)] focus:ring-[var(--color-brand-emerald)] w-4 h-4 cursor-pointer"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-[var(--color-brand-ink)] mb-0.5">{lead.name}</div>
                            <div className="text-xs text-[var(--color-brand-teal)] hover:underline" onClick={(e) => e.stopPropagation()}>
                              <a href={lead.websiteUrl} target="_blank" rel="noreferrer">{lead.websiteUrl.replace('https://', '')}</a>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium text-[var(--color-brand-ink)] mb-0.5">{lead.contactName}</div>
                            <div className="text-xs text-[var(--color-brand-slate)]">{lead.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[var(--color-brand-pastel)] text-[var(--color-brand-teal)] mb-1">
                              {lead.industry}
                            </div>
                            <div className="text-xs text-[var(--color-brand-slate)] truncate max-w-[150px]">{lead.location}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
