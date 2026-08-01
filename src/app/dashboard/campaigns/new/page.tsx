"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Papa from "papaparse";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { 
  Sparkles, ArrowRight, ArrowLeft, Users, Languages, 
  Settings2, FileText, Send, Zap, Globe, CheckCircle2, Activity, ChevronLeft, Map, Search, Crosshair, MapPin
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function NewCampaignContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const campaignId = searchParams.get("id");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "New Campaign",
    mode: "smart",
    leadsType: "lead_gen",
    language: "English",
    templateSubject: "A quick thought about {{company_name}}",
    templateBody: "Hi {{firstName}},\n\nI was just looking at {{website}} and noticed a few things you could improve to get more customers.\n\nWould you be open to a quick chat next week to discuss this?\n\nBest,\n{{sender_name}}\n{{company_name}}",
    mailboxId: "",
    includeName: true,
    includeLastName: false,
    includeCompany: true,
    includeLocation: false,
    qualityThreshold: 7,
    unreachable: "Use fallback",
    fallbackText: "Hi {{firstName}},\n\nI tried to visit {{company_name}} website and saw that it was unavailable. Are you guys having problems with it right now?\n\nI'm an experienced web developer and can help get it back online stress-free. We all know how important a website is for a business.\n\nCould we help {{company_name}} with that?\n\nBest regards,",
    noWebsite: "Exclude from campaign",
    goal: "Offer a free mockup",
  });

  const [scanState, setScanState] = useState("idle"); // idle, scanning, filtering, reading, verifying, names, collecting, done
  const [scannedLeads, setScannedLeads] = useState<any[]>([]);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mailboxes, setMailboxes] = useState<any[]>([]);

  // CSV parsing state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [columnMapping, setColumnMapping] = useState({
    email: '',
    website: '',
    name: '',
    company: '',
    segment: ''
  });
  const [showMapping, setShowMapping] = useState(false);
  const [pastedText, setPastedText] = useState("");

  useEffect(() => {
    // Fetch mailboxes
    fetch(`/api/mailboxes`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMailboxes(data);
          if (data.length > 0 && !formData.mailboxId) {
            setFormData(prev => ({...prev, mailboxId: data[0].id}));
          }
        }
      })
      .catch(console.error);

    if (campaignId) {
      // Fetch existing campaign draft
      fetch(`/api/campaigns`)
        .then(res => res.json())
        .then(data => {
          const campaign = data.find((c: any) => c.id === campaignId);
          if (campaign) {
            setFormData({
              ...formData,
              name: campaign.name || "New Campaign",
              mode: campaign.scheduleRules?.mode || "smart",
              language: campaign.scheduleRules?.language || "English",
              goal: campaign.scheduleRules?.goal || "Offer a free mockup",
              qualityThreshold: campaign.scheduleRules?.qualityThreshold || 7,
              unreachable: campaign.scheduleRules?.unreachable || "Use fallback",
              noWebsite: campaign.scheduleRules?.noWebsite || "Exclude from campaign",
              fallbackText: campaign.scheduleRules?.fallbackText || formData.fallbackText,
              includeName: campaign.scheduleRules?.personalization?.includeName ?? true,
              includeLastName: campaign.scheduleRules?.personalization?.includeLastName ?? false,
              includeCompany: campaign.scheduleRules?.personalization?.includeCompany ?? true,
              includeLocation: campaign.scheduleRules?.personalization?.includeLocation ?? false,
            });
          }
        });
    }
  }, [campaignId]);

  const handleCreateCampaign = async () => {
    // Segment validation check
    const segments = new Set(scannedLeads.map(l => l.segment).filter(s => s && s.trim() !== ""));
    if (segments.size > 1) {
      const confirmProceed = window.confirm(
        `Warning: You have leads from ${segments.size} different segments in this campaign (${Array.from(segments).join(", ")}).\\n\\nMixing segments can dilute personalization since different industries respond to different messaging angles.\\n\\nDo you want to proceed anyway?`
      );
      if (!confirmProceed) return;
    }

    setIsCreating(true);
    try {
      const url = campaignId ? `/api/campaigns/${campaignId}` : "/api/campaigns";
      const method = campaignId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          status: "RUNNING",
          leads: scannedLeads.map((l) => ({
            email: l.email,
            websiteUrl: l.website,
            name: l.name !== "-" ? l.name : null,
            company: l.company,
            segment: l.segment || null,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(`Failed to create campaign: ${err.error || "Unknown error"}`);
        return;
      }

      const data = await res.json();
      router.push(`/dashboard/campaigns`);
    } catch (e) {
      console.error(e);
      alert("Something went wrong creating the campaign. Please try again.");
    } finally {
      setIsCreating(false);
      setShowCreditsModal(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const url = campaignId ? `/api/campaigns/${campaignId}` : "/api/campaigns";
      const method = campaignId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          status: "DRAFT",
          leads: scannedLeads.map((l) => ({
            email: l.email,
            websiteUrl: l.website,
            name: l.name !== "-" ? l.name : null,
            company: l.company,
            segment: l.segment || null,
          })),
        }),
      });

      if (res.ok) {
        router.push(`/dashboard/campaigns`);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to save draft");
    } finally {
      setIsSaving(false);
    }
  };

  const nextStep = () => setStep(step < 4 ? step + 1 : step);
  const prevStep = () => setStep(step > 1 ? step - 1 : step);
  
  const handleScan = () => {
    setScanState("filters");
  };

  const startScan = () => {
    setScanState("scanning");
    setTimeout(() => setScanState("filtering"), 2000);
    setTimeout(() => setScanState("reading"), 4000);
    setTimeout(() => setScanState("verifying"), 6000);
    setTimeout(() => {
      setScannedLeads([
        { id: 1, email: "info@arivex.com", website: "https://arivex.com", name: "-", company: "Arivex Digital", segment: "Digital Agency" },
        { id: 2, email: "business@creativeweb.in", website: "https://creativeweb.in", name: "Sarah", company: "Creative Web", segment: "Digital Agency" },
        { id: 3, email: "hello@epicweb.com", website: "https://epicweb.com", name: "-", company: "Epic Web Solutions", segment: "Web Development" },
        { id: 4, email: "sales@zinovo.com", website: "https://zinovo.com", name: "Mike", company: "Zinovo Private", segment: "B2B SaaS" },
        { id: 5, email: "contact@nexus.com", website: "https://nexus.com", name: "Alex", company: "Nexus", segment: "Digital Agency" },
      ]);
      setScanState("names");
    }, 8000);
    setTimeout(() => {
      setScannedLeads(prev => [
        ...prev,
        ...Array.from({length: 20}).map((_, i) => ({
          id: i + 6, email: `info${i}@agency.com`, website: `https://agency${i}.com`, name: "-", company: `Agency ${i}`, segment: "Digital Agency"
        }))
      ]);
      setScanState("collecting");
    }, 10000);
    setTimeout(() => {
      setScannedLeads(prev => [
        ...prev,
        ...Array.from({length: 187}).map((_, i) => ({
          id: i + 26, email: `contact${i}@business.com`, website: `https://business${i}.com`, name: "-", company: `Business ${i}`, segment: "Digital Agency"
        }))
      ]);
      setScanState("done");
    }, 12000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length > 0) {
          const headers = Object.keys(results.data[0] as object);
          setCsvHeaders(headers);
          setCsvData(results.data);
          // Auto-map if possible
          setColumnMapping({
            email: headers.find(h => h.toLowerCase().includes('email')) || '',
            website: headers.find(h => h.toLowerCase().includes('website') || h.toLowerCase().includes('url')) || '',
            name: headers.find(h => h.toLowerCase().includes('name') && !h.toLowerCase().includes('company')) || '',
            company: headers.find(h => h.toLowerCase().includes('company') || h.toLowerCase().includes('org')) || '',
            segment: headers.find(h => h.toLowerCase().includes('segment') || h.toLowerCase().includes('industry') || h.toLowerCase().includes('vertical')) || ''
          });
          setShowMapping(true);
        }
      }
    });
  };

  const handlePasteParse = () => {
    if (!pastedText.trim()) return;
    Papa.parse(pastedText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length > 0) {
          const headers = Object.keys(results.data[0] as object);
          setCsvHeaders(headers);
          setCsvData(results.data);
          setColumnMapping({
            email: headers.find(h => h.toLowerCase().includes('email')) || '',
            website: headers.find(h => h.toLowerCase().includes('website') || h.toLowerCase().includes('url')) || '',
            name: headers.find(h => h.toLowerCase().includes('name') && !h.toLowerCase().includes('company')) || '',
            company: headers.find(h => h.toLowerCase().includes('company') || h.toLowerCase().includes('org')) || '',
            segment: headers.find(h => h.toLowerCase().includes('segment') || h.toLowerCase().includes('industry') || h.toLowerCase().includes('vertical')) || ''
          });
          setShowMapping(true);
        } else {
          alert("Could not parse columns. Make sure your data has a header row.");
        }
      }
    });
  };

  const confirmMapping = () => {
    const mappedLeads = csvData.map((row, index) => ({
      id: `csv-${index}`,
      email: row[columnMapping.email] || '',
      website: row[columnMapping.website] || '',
      name: row[columnMapping.name] || '-',
      company: row[columnMapping.company] || '-',
      segment: row[columnMapping.segment] || ''
    })).filter(lead => lead.email && lead.website);

    if (mappedLeads.length === 0) {
      alert("No valid leads found (needs email and website). Check mapping.");
      return;
    }

    setScannedLeads(mappedLeads);
    setShowMapping(false);
    setScanState("done");
    setFormData({...formData, leadsType: "lead_gen"}); // transition to the results view
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex">
      {/* Campaign Wizard Sidebar */}
      <aside className="w-64 bg-white border-r border-[var(--color-brand-border)] flex flex-col pt-6 shrink-0 h-full">
        <div className="px-6 mb-8 flex items-center gap-2 text-[var(--color-brand-ink)]">
          <div className="w-6 h-6 rounded-md bg-[linear-gradient(135deg,var(--color-brand-emerald)_0%,var(--color-brand-teal)_100%)] flex items-center justify-center text-white">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <span className="font-outfit font-bold text-lg tracking-tight">Crawlia</span>
        </div>

        <Link href="/dashboard/campaigns" className="px-6 text-sm text-[var(--color-brand-slate)] hover:text-[var(--color-brand-ink)] flex items-center gap-2 mb-6 font-medium">
          <ChevronLeft className="w-4 h-4" /> All campaigns
        </Link>

        <div className="px-6 text-xs font-bold text-[var(--color-brand-slate)] uppercase tracking-wider mb-4">
          New Campaign
        </div>

        <nav className="flex-1 flex flex-col relative px-2">
          {/* Vertical line connecting steps */}
          <div className="absolute left-[33px] top-6 bottom-16 w-0.5 bg-[var(--color-brand-border)] z-0"></div>

          {[
            { num: 1, label: "Leads", sub: "Who you're reaching out to" },
            { num: 2, label: "Write", sub: "Format and personalization" },
            { num: 3, label: "Rules", sub: "Score & fallback settings" },
            { num: 4, label: "Review", sub: "Final check & launch" }
          ].map((s) => {
            const isActive = step === s.num;
            const isPast = step > s.num;
            return (
              <div 
                key={s.num} 
                className={`relative z-10 flex items-start gap-4 px-4 py-4 rounded-xl transition-all cursor-pointer ${
                  isActive ? "bg-black/5" : "hover:bg-black/5"
                }`}
                onClick={() => (isPast || isActive) && setStep(s.num)}
              >
                <div className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isActive 
                    ? "bg-white border-2 border-[var(--color-brand-teal)] text-[var(--color-brand-teal)]" 
                    : isPast
                      ? "bg-[var(--color-brand-teal)] border-2 border-[var(--color-brand-teal)] text-white"
                      : "bg-white border-2 border-[var(--color-brand-border)] text-[var(--color-brand-slate)]"
                }`}>
                  {isPast ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                </div>
                <div>
                  <div className={`text-sm font-bold ${isActive || isPast ? "text-[var(--color-brand-ink)]" : "text-[var(--color-brand-slate)]"}`}>
                    {s.label}
                  </div>
                  {s.sub && (
                    <div className="text-xs text-[var(--color-brand-slate)] mt-0.5 leading-tight">{s.sub}</div>
                  )}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="p-6 border-t border-[var(--color-brand-border)] flex items-center gap-3 mt-auto">
          <div className="w-8 h-8 rounded-full bg-[linear-gradient(135deg,var(--color-brand-emerald)_0%,var(--color-brand-teal)_100%)] text-white flex items-center justify-center font-bold text-xs">
            B
          </div>
          <div className="text-xs font-medium truncate flex-1 text-[var(--color-brand-slate)]">bonej2613@gmail.com</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full bg-white relative">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-end px-8 border-b border-[var(--color-brand-border)] shrink-0 gap-4">
          <Button variant="secondary" size="sm" onClick={handleSaveDraft} disabled={isSaving || (!formData.name && !formData.mode)}>
            {isSaving ? "Saving..." : "Save & Exit"}
          </Button>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="rounded-full">
              Ask Swok
            </Button>
            <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs">
              0
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto py-12 px-8">
            
            {/* Step 1: Leads */}
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-outfit font-bold text-[var(--color-brand-ink)]">How do you want to add your leads?</h1>
                  <p className="text-[var(--color-brand-slate)] mt-2">Choose a source to get started</p>
                </div>

                <div className="flex justify-center gap-2 mb-8">
                  {["Single", "Bulk", "Lead gen"].map(type => (
                    <button 
                      key={type}
                      onClick={() => setFormData({...formData, leadsType: type.toLowerCase().replace(" ", "_")})}
                      className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                        formData.leadsType === type.toLowerCase().replace(" ", "_") || (formData.leadsType.match(/^(file|paste|sheets|library)$/) && type === "Bulk")
                          ? "bg-white shadow-sm border border-[var(--color-brand-border)] text-[var(--color-brand-ink)] relative"
                          : "text-[var(--color-brand-slate)] hover:bg-black/5 border border-transparent"
                      }`}
                    >
                      {type === "Lead gen" && <Crosshair className="w-4 h-4 text-green-600" />}
                      {type}
                      {type === "Lead gen" && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-green-100 text-green-700 text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                          Recommended
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {(formData.leadsType === "bulk" || formData.leadsType.match(/^(file|paste|sheets|library)$/)) && (
                  <div className="flex justify-center gap-2 mb-8">
                    {["File", "Paste", "Sheets", "Library"].map(type => (
                      <button 
                        key={type}
                        onClick={() => setFormData({...formData, leadsType: type.toLowerCase()})}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          (formData.leadsType === "bulk" && type === "File") || formData.leadsType === type.toLowerCase()
                            ? "bg-slate-100 text-[var(--color-brand-ink)]"
                            : "text-[var(--color-brand-slate)] hover:bg-slate-50"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}

                {formData.leadsType === "lead_gen" && (
                  <div className="bg-white border border-[var(--color-brand-border)] rounded-3xl p-8 text-center relative overflow-hidden min-h-[400px]">
                    {scanState === "idle" && (
                      <div className="animate-in fade-in zoom-in-95">
                        <div className="mb-6 font-medium text-[var(--color-brand-slate)]">Choose a country to target first, click it on the map.</div>
                        {/* Simulated SVG Map Area */}
                        <div className="w-full h-[300px] bg-green-50 rounded-2xl flex items-center justify-center border border-green-100 relative overflow-hidden cursor-crosshair hover:bg-green-100 transition-colors" onClick={handleScan}>
                          <Map className="w-32 h-32 text-green-200" />
                          <div className="absolute inset-0 flex flex-wrap gap-2 p-8 opacity-20 pointer-events-none">
                            {/* Decorative dots to look like a map grid */}
                            {Array.from({length: 200}).map((_, i) => (
                              <div key={i} className="w-1.5 h-1.5 rounded-full bg-green-600"></div>
                            ))}
                          </div>
                          <div className="absolute bg-white px-4 py-2 rounded-full font-bold shadow-md flex items-center gap-2 hover:scale-105 transition-transform pointer-events-auto">
                            <MapPin className="w-4 h-4 text-green-600" /> India
                          </div>
                        </div>
                      </div>
                    )}

                    {scanState === "filters" && (
                      <div className="animate-in fade-in zoom-in-95 text-left max-w-md mx-auto py-8">
                        <h3 className="text-xl font-bold mb-6 text-center">Search filters</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-bold text-[var(--color-brand-ink)] mb-2">Choose a city in India</label>
                            <select className="w-full px-4 py-3 border border-[var(--color-brand-border)] rounded-xl focus:outline-none focus:border-[var(--color-brand-teal)]">
                              <option>New Delhi</option>
                              <option>Mumbai</option>
                              <option>Bangalore</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-[var(--color-brand-ink)] mb-2">What industry are you targeting</label>
                            <input type="text" placeholder="e.g. Web Design" className="w-full px-4 py-3 border border-[var(--color-brand-border)] rounded-xl focus:outline-none focus:border-[var(--color-brand-teal)]" />
                          </div>
                          <Button variant="primary" className="w-full bg-green-500 hover:bg-green-600 py-3 text-lg mt-4" onClick={startScan}>
                            Find leads
                          </Button>
                        </div>
                      </div>
                    )}

                    {scanState !== "idle" && scanState !== "filters" && scanState !== "done" && (
                      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-12">
                        <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-green-500 animate-spin mb-6"></div>
                        <h3 className="text-xl font-bold mb-2">
                          {scanState === "scanning" && "Scanning local businesses..."}
                          {scanState === "filtering" && "Filtering by industry..."}
                          {scanState === "reading" && "Reading their websites..."}
                          {scanState === "verifying" && "Verifying contact details..."}
                          {scanState === "names" && "Acquiring contact names..."}
                          {scanState === "collecting" && "Collecting email addresses..."}
                        </h3>
                        <p className="text-sm text-[var(--color-brand-slate)]">Scanning the map - this usually takes 1 to 2 minutes... 0:0{['scanning','filtering','reading','verifying','names','collecting'].indexOf(scanState)+2}</p>
                        <Button variant="secondary" className="mt-8 text-red-500 hover:text-red-600" onClick={() => setScanState("idle")}>
                          Stop
                        </Button>
                      </div>
                    )}

                    {scanState === "done" && (
                      <div className="animate-in slide-in-from-bottom-4 text-left">
                        <div className="flex justify-between items-center mb-6">
                          <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Paused with 212 leads kept. Want more?
                          </div>
                          <Button variant="secondary" size="sm" onClick={() => setScanState("idle")}>
                            <Search className="w-4 h-4 mr-2" /> Scan for more leads
                          </Button>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-6">
                          <div className="text-center p-4">
                            <div className="text-3xl font-bold text-[var(--color-brand-ink)]">{scannedLeads.length}</div>
                            <div className="text-xs text-[var(--color-brand-slate)] uppercase tracking-wider">Total leads</div>
                          </div>
                          <div className="text-center p-4">
                            <div className="text-3xl font-bold text-[var(--color-brand-ink)]">0</div>
                            <div className="text-xs text-[var(--color-brand-slate)] uppercase tracking-wider">No email</div>
                          </div>
                          <div className="text-center p-4">
                            <div className="text-3xl font-bold text-[var(--color-brand-ink)]">0</div>
                            <div className="text-xs text-[var(--color-brand-slate)] uppercase tracking-wider">No website</div>
                          </div>
                          <div className="text-center p-4">
                            <div className="text-3xl font-bold text-[var(--color-brand-ink)]">{scannedLeads.length}</div>
                            <div className="text-xs text-[var(--color-brand-slate)] uppercase tracking-wider">Email checks</div>
                          </div>
                        </div>

                        <div className="border border-[var(--color-brand-border)] rounded-xl overflow-hidden h-[300px] overflow-y-auto mb-6">
                          <table className="w-full text-sm">
                            <thead className="bg-slate-50 sticky top-0 border-b border-[var(--color-brand-border)]">
                              <tr>
                                <th className="p-3 text-left font-semibold text-[var(--color-brand-slate)] w-8"><input type="checkbox" defaultChecked /></th>
                                <th className="p-3 text-left font-semibold text-[var(--color-brand-slate)]">Email</th>
                                <th className="p-3 text-left font-semibold text-[var(--color-brand-slate)]">Website</th>
                                <th className="p-3 text-left font-semibold text-[var(--color-brand-slate)]">Name</th>
                                <th className="p-3 text-left font-semibold text-[var(--color-brand-slate)]">Company</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--color-brand-border)]">
                              {scannedLeads.map(lead => (
                                <tr key={lead.id} className="hover:bg-slate-50">
                                  <td className="p-3"><input type="checkbox" defaultChecked /></td>
                                  <td className="p-3">{lead.email}</td>
                                  <td className="p-3 text-[var(--color-brand-teal)] truncate max-w-[200px]">{lead.website}</td>
                                  <td className="p-3">{lead.name}</td>
                                  <td className="p-3 font-medium">{lead.company}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="flex gap-4">
                          <Button variant="primary" className="bg-green-500 hover:bg-green-600" onClick={() => setShowCreditsModal(true)}>
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Verify emails <span className="opacity-70 ml-2 font-normal">1 credit per email</span>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {formData.leadsType === "single" && (
                  <div className="bg-white border border-[var(--color-brand-border)] rounded-3xl p-8 text-center relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center animate-in fade-in">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                      <Globe className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Drop in a website</h3>
                    <p className="text-sm text-[var(--color-brand-slate)] mb-8">We'll find the lead for you</p>
                    <div className="max-w-md w-full relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input type="text" placeholder="Paste a web address..." className="w-full pl-12 pr-12 py-4 border border-[var(--color-brand-border)] rounded-2xl focus:outline-none focus:border-[var(--color-brand-teal)] focus:ring-1 focus:ring-[var(--color-brand-teal)] shadow-sm" />
                      <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white hover:bg-green-600 transition-colors">
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}

                {(formData.leadsType === "file" || formData.leadsType === "bulk") && (
                  <div className="bg-white border border-[var(--color-brand-border)] rounded-3xl p-8 text-center relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center border-dashed animate-in fade-in">
                    {!showMapping ? (
                      <>
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                          <FileText className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Upload or drag a file</h3>
                        <p className="text-sm text-[var(--color-brand-slate)] mb-8">CSV, Excel, ODS, TSV</p>
                        <input 
                          type="file" 
                          accept=".csv" 
                          className="hidden" 
                          ref={fileInputRef} 
                          onChange={handleFileUpload} 
                        />
                        <Button 
                          variant="secondary" 
                          className="px-8 font-bold border-[var(--color-brand-border)]"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          Browse files
                        </Button>
                      </>
                    ) : (
                      <div className="w-full max-w-xl mx-auto text-left">
                        <h3 className="text-xl font-bold mb-4">Map your columns</h3>
                        <p className="text-sm text-[var(--color-brand-slate)] mb-6">Match your CSV columns to Crawlia's fields.</p>
                        <div className="space-y-4 mb-8">
                          {["email", "website", "name", "company", "segment"].map((field) => (
                            <div key={field} className="flex items-center justify-between">
                              <label className="font-semibold text-sm capitalize w-1/3">{field} <span className="text-red-500">{field === 'email' || field === 'website' ? '*' : ''}</span></label>
                              <select 
                                value={(columnMapping as any)[field]}
                                onChange={(e) => setColumnMapping({...columnMapping, [field]: e.target.value})}
                                className="w-2/3 px-3 py-2 border border-[var(--color-brand-border)] rounded-lg text-sm bg-slate-50"
                              >
                                <option value="">-- Ignore --</option>
                                {csvHeaders.map(h => (
                                  <option key={h} value={h}>{h}</option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button variant="secondary" onClick={() => setShowMapping(false)}>Cancel</Button>
                          <Button variant="primary" className="bg-green-500 hover:bg-green-600" onClick={confirmMapping}>Import {csvData.length} leads</Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {formData.leadsType === "paste" && (
                  <div className="bg-white border border-[var(--color-brand-border)] rounded-3xl p-8 relative overflow-hidden min-h-[400px] flex flex-col animate-in fade-in">
                    {!showMapping ? (
                      <>
                        <textarea 
                          placeholder="Paste rows with a header row from Google Sheets, Excel, or CSV..." 
                          className="w-full flex-1 p-6 border-none focus:outline-none resize-none text-sm bg-slate-50 rounded-2xl font-mono"
                          value={pastedText}
                          onChange={(e) => setPastedText(e.target.value)}
                        ></textarea>
                        <div className="mt-6 flex justify-end">
                          <Button variant="primary" className="bg-green-500 hover:bg-green-600 px-8" onClick={handlePasteParse}>Parse leads</Button>
                        </div>
                      </>
                    ) : (
                      <div className="w-full max-w-xl mx-auto text-left flex-1 flex flex-col justify-center">
                        <h3 className="text-xl font-bold mb-4">Map your columns</h3>
                        <p className="text-sm text-[var(--color-brand-slate)] mb-6">Match your pasted columns to Crawlia's fields.</p>
                        <div className="space-y-4 mb-8">
                          {["email", "website", "name", "company", "segment"].map((field) => (
                            <div key={field} className="flex items-center justify-between">
                              <label className="font-semibold text-sm capitalize w-1/3">{field} <span className="text-red-500">{field === 'email' || field === 'website' ? '*' : ''}</span></label>
                              <select 
                                value={(columnMapping as any)[field]}
                                onChange={(e) => setColumnMapping({...columnMapping, [field]: e.target.value})}
                                className="w-2/3 px-3 py-2 border border-[var(--color-brand-border)] rounded-lg text-sm bg-slate-50"
                              >
                                <option value="">-- Ignore --</option>
                                {csvHeaders.map(h => (
                                  <option key={h} value={h}>{h}</option>
                                ))}
                              </select>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-end gap-3">
                          <Button variant="secondary" onClick={() => setShowMapping(false)}>Cancel</Button>
                          <Button variant="primary" className="bg-green-500 hover:bg-green-600" onClick={confirmMapping}>Import {csvData.length} leads</Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {formData.leadsType === "sheets" && (
                  <div className="bg-white border border-[var(--color-brand-border)] rounded-3xl p-8 text-center relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center animate-in fade-in">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-green-500 animate-spin mb-6"></div>
                    <h3 className="text-xl font-bold mb-2">Loading spreadsheets...</h3>
                  </div>
                )}

                {formData.leadsType === "library" && (
                  <div className="bg-white border border-[var(--color-brand-border)] rounded-3xl p-8 text-center relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center animate-in fade-in">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                      <Users className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Lead Library</h3>
                    <p className="text-sm text-[var(--color-brand-slate)] mb-8">Select leads from your saved lists</p>
                    <Button variant="primary" className="bg-green-500 hover:bg-green-600 px-8">Open Library</Button>
                  </div>
                )}
              </div>
            )}

            {/* Credit Modal Overlay */}
            {showCreditsModal && (
              <div className="fixed inset-0 z-[60] bg-slate-900/50 flex items-center justify-center backdrop-blur-sm">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
                    <Zap className="w-6 h-6 fill-current" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Not enough credits</h2>
                  <p className="text-[var(--color-brand-slate)] mb-6">
                    This action requires <strong className="text-[var(--color-brand-ink)]">212 credits</strong>. You currently have <strong className="text-red-500">0 credits</strong>.
                  </p>
                  
                  <div className="bg-slate-50 border border-[var(--color-brand-border)] rounded-2xl p-4 flex justify-between text-center mb-8">
                    <div>
                      <div className="text-xs text-[var(--color-brand-slate)] uppercase tracking-wider font-bold mb-1">Required</div>
                      <div className="font-bold text-lg">212 credits</div>
                    </div>
                    <div className="w-px bg-[var(--color-brand-border)]"></div>
                    <div>
                      <div className="text-xs text-[var(--color-brand-slate)] uppercase tracking-wider font-bold mb-1">You have</div>
                      <div className="font-bold text-lg text-red-500">0 credits</div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="secondary" className="flex-1" onClick={() => setShowCreditsModal(false)}>
                      Cancel
                    </Button>
                    <Button variant="primary" className="flex-1 bg-green-500 hover:bg-green-600" onClick={handleCreateCampaign} disabled={isCreating}>
                      {isCreating ? "Creating..." : "Create anyway"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Write */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 max-w-3xl mx-auto">
                <div className="mb-10 text-center">
                  <h1 className="text-3xl font-outfit font-bold text-[var(--color-brand-ink)]">Write your email</h1>
                  <p className="text-[var(--color-brand-slate)] mt-2">Format and personalize your outreach</p>
                </div>

                <div className="flex bg-slate-100 rounded-xl p-1 mb-8 max-w-sm mx-auto">
                  <button 
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${formData.mode === "smart" ? "bg-white shadow-sm text-green-600" : "text-[var(--color-brand-slate)] hover:text-[var(--color-brand-ink)]"}`}
                    onClick={() => setFormData({...formData, mode: "smart"})}
                  >
                    <Zap className="w-4 h-4" /> Smart
                  </button>
                  <button 
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${formData.mode === "general" ? "bg-white shadow-sm text-slate-800" : "text-[var(--color-brand-slate)] hover:text-[var(--color-brand-ink)]"}`}
                    onClick={() => setFormData({...formData, mode: "general"})}
                  >
                    <FileText className="w-4 h-4" /> Standard
                  </button>
                </div>

                {formData.mode === "smart" ? (
                  <div className="animate-in fade-in zoom-in-95 duration-300 space-y-12">
                    <section>
                      <h2 className="text-xl font-bold mb-6">Language</h2>
                      <div className="flex flex-wrap gap-3">
                        {["English", "Norwegian", "Swedish", "Danish", "German", "French", "Spanish", "Dutch", "Finnish", "Portuguese", "Italian", "Polish", "Slovak"].map(lang => (
                          <button
                            key={lang}
                            onClick={() => setFormData({...formData, language: lang})}
                            className={`px-5 py-2.5 rounded-full font-semibold transition-all border text-sm ${
                              formData.language === lang
                                ? "bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500"
                                : "bg-white border-[var(--color-brand-border)] text-[var(--color-brand-ink)] hover:border-slate-300"
                            }`}
                          >
                            {lang}
                          </button>
                        ))}
                      </div>
                    </section>
                    
                    <div className="h-px bg-[var(--color-brand-border)]"></div>

                    <section>
                      <h2 className="text-xl font-bold mb-6">Campaign goal</h2>
                      <div className="space-y-3">
                        {["Offer a free mockup", "Book a discovery call", "Just start a conversation"].map(goal => (
                          <div 
                            key={goal}
                            onClick={() => setFormData({...formData, goal: goal})}
                            className={`p-4 rounded-xl border font-bold cursor-pointer transition-colors ${
                              formData.goal === goal 
                                ? "border-green-500 bg-green-50/50 ring-1 ring-green-500 text-[var(--color-brand-ink)]" 
                                : "border-[var(--color-brand-border)] bg-white hover:border-slate-300 text-[var(--color-brand-ink)]"
                            }`}
                          >
                            {goal}
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                ) : (
                  <div className="animate-in fade-in zoom-in-95 duration-300 space-y-8">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-bold text-[var(--color-brand-ink)]">Subject line</label>
                        <button className="text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-md">Variable ▾</button>
                      </div>
                      <input 
                        type="text" 
                        value={formData.templateSubject}
                        onChange={(e) => setFormData({...formData, templateSubject: e.target.value})}
                        className="w-full px-4 py-3 border border-[var(--color-brand-border)] rounded-xl focus:outline-none focus:border-slate-400 bg-white"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-bold text-[var(--color-brand-ink)]">Email body</label>
                        <button className="text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-md">Variable ▾</button>
                      </div>
                      <textarea 
                        value={formData.templateBody}
                        onChange={(e) => setFormData({...formData, templateBody: e.target.value})}
                        className="w-full text-sm px-4 py-3 border border-[var(--color-brand-border)] rounded-xl focus:outline-none focus:border-slate-400 bg-white h-48 resize-none leading-relaxed"
                      ></textarea>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Rules */}
            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 max-w-3xl mx-auto">
                <div className="mb-10">
                  <h1 className="text-3xl font-outfit font-bold text-[var(--color-brand-ink)]">Set your campaign rules</h1>
                  <p className="text-[var(--color-brand-slate)] mt-2">Control how Crawlia handles tricky leads — low scores, broken sites, and duplicates.</p>
                </div>

                <div className="space-y-12">
                  {/* Min website score */}
                  <section>
                    <div className="text-[10px] font-bold text-[var(--color-brand-slate)] uppercase tracking-wider mb-2">01</div>
                    <h2 className="text-xl font-bold mb-2">What's the minimum website score?</h2>
                    <p className="text-[var(--color-brand-slate)] text-sm mb-6">Websites are scored 1-10 on design quality. Set the threshold, then choose what happens to leads that score above it.</p>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-2xl font-bold">{formData.qualityThreshold}</div>
                      <div className="text-[var(--color-brand-slate)] text-sm font-semibold">out of 10</div>
                    </div>
                    <input 
                      type="range" min="1" max="10" 
                      value={formData.qualityThreshold}
                      onChange={(e) => setFormData({...formData, qualityThreshold: parseInt(e.target.value)})}
                      className="w-full accent-green-500 mb-8"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <button className="p-4 rounded-xl border border-green-500 bg-green-50/50 text-left cursor-pointer ring-1 ring-green-500">
                        <div className="font-bold text-[var(--color-brand-ink)]">Exclude lead</div>
                        <div className="text-xs text-[var(--color-brand-slate)]">Skip and don't write</div>
                      </button>
                      <button className="p-4 rounded-xl border border-[var(--color-brand-border)] bg-white text-left cursor-pointer hover:border-slate-300">
                        <div className="font-bold text-[var(--color-brand-ink)]">Write anyway</div>
                        <div className="text-xs text-[var(--color-brand-slate)]">Ignore the threshold</div>
                      </button>
                    </div>
                  </section>

                  <div className="h-px bg-[var(--color-brand-border)]"></div>

                  {/* Unreachable websites */}
                  <section>
                    <div className="text-[10px] font-bold text-[var(--color-brand-slate)] uppercase tracking-wider mb-2">02</div>
                    <h2 className="text-xl font-bold mb-2">Unreachable websites</h2>
                    <p className="text-[var(--color-brand-slate)] text-sm mb-6">Define rules for leads with unreachable websites</p>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <button 
                        onClick={() => setFormData({...formData, unreachable: "Exclude from campaign"})}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-colors ${formData.unreachable === "Exclude from campaign" ? "border-green-500 bg-green-50/50 ring-1 ring-green-500" : "border-[var(--color-brand-border)] bg-white hover:border-slate-300"}`}
                      >
                        <div className="font-bold text-[var(--color-brand-ink)]">Exclude from campaign</div>
                        <div className="text-xs text-[var(--color-brand-slate)]">Keep in list</div>
                      </button>
                      <button 
                        onClick={() => setFormData({...formData, unreachable: "Delete lead"})}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-colors ${formData.unreachable === "Delete lead" ? "border-green-500 bg-green-50/50 ring-1 ring-green-500" : "border-[var(--color-brand-border)] bg-white hover:border-slate-300"}`}
                      >
                        <div className="font-bold text-[var(--color-brand-ink)]">Delete lead</div>
                        <div className="text-xs text-[var(--color-brand-slate)]">Remove permanently</div>
                      </button>
                      <button 
                        onClick={() => setFormData({...formData, unreachable: "Use fallback"})}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-colors ${formData.unreachable === "Use fallback" ? "border-green-500 bg-green-50/50 ring-1 ring-green-500" : "border-[var(--color-brand-border)] bg-white hover:border-slate-300"}`}
                      >
                        <div className="font-bold text-[var(--color-brand-ink)]">Use fallback</div>
                        <div className="text-xs text-[var(--color-brand-slate)]">Send preset</div>
                      </button>
                    </div>

                    {formData.unreachable === "Use fallback" && (
                      <div className="bg-white border border-[var(--color-brand-border)] rounded-xl p-4 mt-4 shadow-sm relative animate-in fade-in">
                        <div className="text-xs text-[var(--color-brand-slate)] mb-2 font-medium">The website is unreachable or down</div>
                        <textarea 
                          value={formData.fallbackText}
                          onChange={e => setFormData({...formData, fallbackText: e.target.value})}
                          className="w-full h-40 focus:outline-none resize-none text-sm text-[var(--color-brand-ink)]"
                        ></textarea>
                        <div className="flex items-center justify-between border-t border-[var(--color-brand-border)] pt-3 mt-2">
                          <div className="flex gap-2 text-[var(--color-brand-slate)]">
                            <span className="font-bold text-sm bg-slate-100 px-2 rounded cursor-pointer hover:bg-slate-200">Variables ▾</span>
                          </div>
                          <Button variant="primary" size="sm" className="bg-green-500 hover:bg-green-600">Apply</Button>
                        </div>
                      </div>
                    )}
                  </section>

                  <div className="h-px bg-[var(--color-brand-border)]"></div>

                  {/* Leads without website */}
                  <section>
                    <div className="text-[10px] font-bold text-[var(--color-brand-slate)] uppercase tracking-wider mb-2">03</div>
                    <h2 className="text-xl font-bold mb-2">Leads without website</h2>
                    <p className="text-[var(--color-brand-slate)] text-sm mb-6">Define rules for leads without a website</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setFormData({...formData, noWebsite: "Exclude from campaign"})}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-colors ${formData.noWebsite === "Exclude from campaign" ? "border-green-500 bg-green-50/50 ring-1 ring-green-500" : "border-[var(--color-brand-border)] bg-white hover:border-slate-300"}`}
                      >
                        <div className="font-bold text-[var(--color-brand-ink)]">Exclude from campaign</div>
                        <div className="text-xs text-[var(--color-brand-slate)]">Keep in list</div>
                      </button>
                      <button 
                        onClick={() => setFormData({...formData, noWebsite: "Use fallback"})}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-colors ${formData.noWebsite === "Use fallback" ? "border-green-500 bg-green-50/50 ring-1 ring-green-500" : "border-[var(--color-brand-border)] bg-white hover:border-slate-300"}`}
                      >
                        <div className="font-bold text-[var(--color-brand-ink)]">Use fallback</div>
                        <div className="text-xs text-[var(--color-brand-slate)]">Send preset</div>
                      </button>
                    </div>
                  </section>

                  <div className="h-px bg-[var(--color-brand-border)]"></div>

                  {/* Personalise */}
                  <section>
                    <div className="text-[10px] font-bold text-[var(--color-brand-slate)] uppercase tracking-wider mb-2">04</div>
                    <h2 className="text-xl font-bold mb-2">Personalise your emails even more</h2>
                    <p className="text-[var(--color-brand-slate)] text-sm mb-6">Including your name, agency name, and location helps increase replies and makes emails feel personally written - not mass produced.</p>
                    
                    <div className="space-y-6">
                      <div className="border-b border-[var(--color-brand-border)] pb-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-[var(--color-brand-ink)]">Include your name?</div>
                            <div className="text-sm text-[var(--color-brand-slate)]">The sender's first name used in the email</div>
                          </div>
                          <div className="flex bg-slate-100 rounded-lg p-1">
                            <button 
                              className={`px-4 py-1.5 rounded-md text-sm font-bold ${formData.includeName ? "bg-white shadow-sm text-[var(--color-brand-ink)]" : "text-[var(--color-brand-slate)]"}`}
                              onClick={() => setFormData({...formData, includeName: true})}
                            >Yes</button>
                            <button 
                              className={`px-4 py-1.5 rounded-md text-sm font-bold ${!formData.includeName ? "bg-white shadow-sm text-[var(--color-brand-ink)]" : "text-[var(--color-brand-slate)]"}`}
                              onClick={() => setFormData({...formData, includeName: false})}
                            >No</button>
                          </div>
                        </div>
                        {formData.includeName && (
                          <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                            <select className="w-full px-4 py-3 border border-[var(--color-brand-border)] rounded-xl focus:outline-none focus:border-green-500 bg-white text-sm font-medium">
                              <option>From mailbox (e.g. John if john@agency.com)</option>
                              <option>From Crawlia account</option>
                            </select>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between border-b border-[var(--color-brand-border)] pb-6">
                        <div>
                          <div className="font-bold text-[var(--color-brand-ink)]">Include your last name?</div>
                          <div className="text-sm text-[var(--color-brand-slate)]">Adds more personality and credibility</div>
                        </div>
                        <div className="flex bg-slate-100 rounded-lg p-1">
                          <button 
                            className={`px-4 py-1.5 rounded-md text-sm font-bold ${formData.includeLastName ? "bg-white shadow-sm text-[var(--color-brand-ink)]" : "text-[var(--color-brand-slate)]"}`}
                            onClick={() => setFormData({...formData, includeLastName: true})}
                          >Yes</button>
                          <button 
                            className={`px-4 py-1.5 rounded-md text-sm font-bold ${!formData.includeLastName ? "bg-white shadow-sm text-[var(--color-brand-ink)]" : "text-[var(--color-brand-slate)]"}`}
                            onClick={() => setFormData({...formData, includeLastName: false})}
                          >No</button>
                        </div>
                      </div>

                      <div className="border-b border-[var(--color-brand-border)] pb-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-[var(--color-brand-ink)]">Include company name?</div>
                            <div className="text-sm text-[var(--color-brand-slate)]">Set in your Crawlia profile</div>
                          </div>
                          <div className="flex bg-slate-100 rounded-lg p-1">
                            <button 
                              className={`px-4 py-1.5 rounded-md text-sm font-bold ${formData.includeCompany ? "bg-white shadow-sm text-[var(--color-brand-ink)]" : "text-[var(--color-brand-slate)]"}`}
                              onClick={() => setFormData({...formData, includeCompany: true})}
                            >Yes</button>
                            <button 
                              className={`px-4 py-1.5 rounded-md text-sm font-bold ${!formData.includeCompany ? "bg-white shadow-sm text-[var(--color-brand-ink)]" : "text-[var(--color-brand-slate)]"}`}
                              onClick={() => setFormData({...formData, includeCompany: false})}
                            >No</button>
                          </div>
                        </div>
                        {formData.includeCompany && (
                          <div className="mt-4 p-4 border border-[var(--color-brand-border)] rounded-xl bg-slate-50 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                            <div>
                              <div className="text-xs text-[var(--color-brand-slate)] font-bold uppercase tracking-wider mb-1">Company</div>
                              <div className="font-medium">Acme Design Studio</div>
                            </div>
                            <Button variant="outline" size="sm" className="bg-white">Edit profile</Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="pb-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-[var(--color-brand-ink)]">Include your location?</div>
                            <div className="text-sm text-[var(--color-brand-slate)]">Set in your Crawlia profile</div>
                          </div>
                          <div className="flex bg-slate-100 rounded-lg p-1">
                            <button 
                              className={`px-4 py-1.5 rounded-md text-sm font-bold ${formData.includeLocation ? "bg-white shadow-sm text-[var(--color-brand-ink)]" : "text-[var(--color-brand-slate)]"}`}
                              onClick={() => setFormData({...formData, includeLocation: true})}
                            >Yes</button>
                            <button 
                              className={`px-4 py-1.5 rounded-md text-sm font-bold ${!formData.includeLocation ? "bg-white shadow-sm text-[var(--color-brand-ink)]" : "text-[var(--color-brand-slate)]"}`}
                              onClick={() => setFormData({...formData, includeLocation: false})}
                            >No</button>
                          </div>
                        </div>
                        {formData.includeLocation && (
                          <div className="mt-4 p-4 border border-[var(--color-brand-border)] rounded-xl bg-slate-50 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                            <div>
                              <div className="text-xs text-[var(--color-brand-slate)] font-bold uppercase tracking-wider mb-1">Location</div>
                              <div className="font-medium">London, UK</div>
                            </div>
                            <Button variant="outline" size="sm" className="bg-white">Edit profile</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 max-w-2xl mx-auto">
                <div className="mb-10">
                  <h1 className="text-3xl font-outfit font-bold text-[var(--color-brand-ink)]">Review campaign</h1>
                  <p className="text-[var(--color-brand-slate)] mt-2">Review your campaign before sending</p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-[var(--color-brand-ink)] mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div> Campaign name
                    </label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full text-xl font-bold px-4 py-3 border border-[var(--color-brand-border)] rounded-xl focus:outline-none focus:border-green-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-[var(--color-brand-ink)] mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div> Select Mailbox
                    </label>
                    <select
                      value={formData.mailboxId}
                      onChange={e => setFormData({...formData, mailboxId: e.target.value})}
                      className="w-full text-lg px-4 py-3 border border-[var(--color-brand-border)] rounded-xl focus:outline-none focus:border-green-500 bg-white"
                    >
                      {mailboxes.length === 0 ? (
                        <option value="">No mailboxes found</option>
                      ) : (
                        mailboxes.map(mb => (
                          <option key={mb.id} value={mb.id}>{mb.name} ({mb.email})</option>
                        ))
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-[var(--color-brand-ink)] mb-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div> Overview <span className="text-xs font-normal text-slate-400">optional</span>
                    </label>
                    
                    <div className="bg-white border border-[var(--color-brand-border)] rounded-2xl overflow-hidden divide-y divide-[var(--color-brand-border)]">
                      <div className="flex p-4">
                        <div className="w-1/3 text-sm font-semibold text-[var(--color-brand-slate)]">Mode</div>
                        <div className="w-2/3 text-sm font-medium">{formData.mode === "smart" ? "Smart AI Outreach ⚡" : "General Outreach 📝"}</div>
                      </div>
                      <div className="flex p-4">
                        <div className="w-1/3 text-sm font-semibold text-[var(--color-brand-slate)]">Leads</div>
                        <div className="w-2/3 text-sm text-[var(--color-brand-slate)] line-clamp-3 leading-relaxed">
                          {scannedLeads.length} leads selected
                        </div>
                      </div>
                      {formData.mode === "smart" && (
                        <>
                          <div className="flex p-4">
                            <div className="w-1/3 text-sm font-semibold text-[var(--color-brand-slate)]">Language</div>
                            <div className="w-2/3 text-sm font-medium">{formData.language}</div>
                          </div>
                          <div className="flex p-4">
                            <div className="w-1/3 text-sm font-semibold text-[var(--color-brand-slate)]">Goal</div>
                            <div className="w-2/3 text-sm font-medium">{formData.goal}</div>
                          </div>
                        </>
                      )}
                      <div className="flex p-4">
                        <div className="w-1/3 text-sm font-semibold text-[var(--color-brand-slate)]">Personalization</div>
                        <div className="w-2/3 text-sm font-medium">Sender name (Mailbox), Company name</div>
                      </div>
                      <div className="flex p-4">
                        <div className="w-1/3 text-sm font-semibold text-[var(--color-brand-slate)]">Min. score to send</div>
                        <div className="w-2/3 text-sm font-medium">{formData.qualityThreshold}/10</div>
                      </div>
                      <div className="flex p-4">
                        <div className="w-1/3 text-sm font-semibold text-[var(--color-brand-slate)]">No website</div>
                        <div className="w-2/3 text-sm font-medium">{formData.noWebsite}</div>
                      </div>
                      <div className="flex p-4">
                        <div className="w-1/3 text-sm font-semibold text-[var(--color-brand-slate)]">Unreachable</div>
                        <div className="w-2/3 text-sm font-medium">{formData.unreachable}</div>
                      </div>
                    </div>
                  </div>

                  <Button 
                    variant="primary" 
                    className="w-full bg-green-500 hover:bg-green-600 h-14 text-lg shadow-lg" 
                    onClick={handleCreateCampaign}
                    disabled={isCreating || !formData.name}
                  >
                    {isCreating ? (
                      <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" /> Creating campaign...</>
                    ) : (
                      <><Sparkles className="w-5 h-5 mr-2" /> Create campaign</>
                    )}
                  </Button>
                  
                  <p className="text-center text-xs text-slate-500 mt-4 leading-relaxed">
                    Creating a campaign won't send any emails yet - it analyzes {scannedLeads.length || 212} sites<br/>and uses <strong className="text-green-600">{scannedLeads.length || 212} credits</strong>. You can review and edit everything<br/>before sending.
                  </p>
                </div>
              </div>
            )}
            <div className="mt-12 flex items-center justify-between border-t border-[var(--color-brand-border)] pt-6">
              <Button variant="secondary" onClick={prevStep} disabled={step === 1}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
              {step !== 1 && scanState !== "scanning" && (
                <Button variant="primary" onClick={nextStep}>
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default function NewCampaignPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-green-500 animate-spin"></div></div>}>
      <NewCampaignContent />
    </Suspense>
  );
}
