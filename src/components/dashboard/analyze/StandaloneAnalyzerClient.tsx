"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { Loader2, Search, Target, Layout, Zap, Smartphone, ExternalLink, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export function StandaloneAnalyzerClient() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState("");
  const [result, setResult] = useState<any>(null);
  const router = useRouter();

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsAnalyzing(true);
    setResult(null);
    setProgress("Initializing headless browser...");

    try {
      // Simulate stages for UI effect since it takes a while
      const stages = [
        "Resolving DNS and checking TLS...",
        "Rendering DOM and executing JavaScript...",
        "Extracting SEO signals and Core Web Vitals...",
        "AI evaluating design and visual hierarchy...",
        "Finalizing composite score..."
      ];
      
      let stageIndex = 0;
      const interval = setInterval(() => {
        if (stageIndex < stages.length) {
          setProgress(stages[stageIndex]);
          stageIndex++;
        }
      }, 2000);

      const res = await fetch("/api/analyze/standalone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      clearInterval(interval);
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");

      setResult(data);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsAnalyzing(false);
      setProgress("");
    }
  };

  return (
    <div className="space-y-8">
      <GlassCard className="p-8 text-center space-y-4">
        <div className="mx-auto w-12 h-12 bg-brand-emerald/10 text-brand-emerald rounded-full flex items-center justify-center mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold font-outfit text-brand-ink">Instant Website Audit</h3>
        <p className="text-brand-slate max-w-lg mx-auto">
          Enter any URL to run our full 5-stage pipeline. We will render the page, extract SEO signals, and use AI to critique the design in real-time.
        </p>

        <form onSubmit={handleAnalyze} className="flex gap-3 max-w-xl mx-auto mt-6">
          <input 
            placeholder="https://example.com" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isAnalyzing}
            className="flex-1 px-4 py-2 rounded-lg border border-[var(--color-brand-border)] bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)] text-sm"
            type="url"
            required
          />
          <Button type="submit" disabled={isAnalyzing} variant="primary" className="gap-2">
            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Analyze
          </Button>
        </form>

        {isAnalyzing && (
          <div className="mt-8 space-y-3 max-w-sm mx-auto">
            <div className="h-2 w-full bg-brand-canvas rounded-full overflow-hidden">
              <div className="h-full bg-brand-emerald w-full animate-pulse rounded-full"></div>
            </div>
            <p className="text-sm font-medium text-brand-teal animate-pulse">{progress}</p>
          </div>
        )}
      </GlassCard>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
          <GlassCard className="p-6 md:col-span-1 flex flex-col items-center justify-center text-center space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-slate">Composite Score</h4>
            <div className="text-7xl font-bold font-outfit text-brand-ink">
              {result.score}
            </div>
            <div className="w-full flex gap-2">
               <Button className="flex-1 gap-2" variant="primary">
                 Save as Lead
               </Button>
            </div>
          </GlassCard>

          <GlassCard className="p-6 md:col-span-2">
             <h4 className="font-semibold font-outfit text-lg mb-4 flex items-center gap-2">
               <Target className="w-5 h-5 text-brand-teal" />
               AI Findings & Evidence
             </h4>
             <div className="space-y-4">
               {result.findings?.map((finding: any, i: number) => (
                 <div key={i} className="p-4 rounded-xl border border-brand-border bg-brand-canvas/50">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-semibold text-brand-ink">{finding.title}</span>
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full font-medium">
                        {finding.severity}
                      </span>
                    </div>
                    <p className="text-sm text-brand-slate mb-2"><strong>Evidence:</strong> {finding.evidence}</p>
                    <p className="text-sm text-brand-teal bg-brand-emerald/10 p-2 rounded-lg italic">
                      <strong>Outreach Hook:</strong> "{finding.outreach_hook}"
                    </p>
                 </div>
               ))}
             </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
