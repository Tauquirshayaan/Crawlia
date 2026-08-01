"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, Globe, CheckCircle2, ArrowRight, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function AnalyzerModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  useEffect(() => {
    const handleOpenAnalyzer = (e: CustomEvent) => {
      setIsOpen(true);
      if (e.detail?.url) {
        setUrl(e.detail.url);
        // We don't auto-scan on open, we let them press enter again or click analyze to confirm
      }
    };
    
    window.addEventListener('openAnalyzer', handleOpenAnalyzer as EventListener);
    return () => window.removeEventListener('openAnalyzer', handleOpenAnalyzer as EventListener);
  }, []);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsScanning(true);
    setScanResult(null);
    setScanError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze website");
      }
      
      setScanResult(data);
    } catch (err: any) {
      setScanError(err.message);
    } finally {
      setIsScanning(false);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setUrl("");
      setIsScanning(false);
      setScanResult(null);
      setScanError(null);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={closeModal}
      />
      
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={closeModal}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[var(--color-brand-pastel)] rounded-full flex items-center justify-center text-[var(--color-brand-teal)] mx-auto mb-4 relative">
              <Globe className="w-8 h-8" />
              {isScanning && (
                <div className="absolute inset-0 border-2 border-[var(--color-brand-teal)] rounded-full animate-ping opacity-20"></div>
              )}
            </div>
            <h2 className="text-2xl font-outfit font-bold text-[var(--color-brand-ink)]">Analyze a Website</h2>
            <p className="text-[var(--color-brand-slate)] mt-2">Enter any URL to get an instant AI audit of their design and copy.</p>
          </div>

          <form onSubmit={handleScan} className="relative max-w-lg mx-auto">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              {isScanning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            </div>
            <input 
              type="url" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com" 
              required
              disabled={isScanning}
              className="w-full pl-12 pr-32 py-4 bg-slate-50 border-2 border-[var(--color-brand-border)] rounded-2xl text-base focus:outline-none focus:ring-4 focus:ring-[var(--color-brand-teal)]/20 focus:border-[var(--color-brand-teal)] transition-all disabled:opacity-50"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Button 
                type="submit" 
                variant="primary" 
                disabled={!url.trim() || isScanning}
                className="shadow-[var(--shadow-soft-teal)]"
              >
                {isScanning ? "Scanning..." : "Analyze"}
              </Button>
            </div>
          </form>

          {scanError && (
            <div className="mt-6 max-w-lg mx-auto p-4 bg-rose-50 border border-rose-200 rounded-xl flex gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
              <p className="text-sm text-rose-700">{scanError}</p>
            </div>
          )}

          {scanResult && (
            <div className="mt-8 max-w-lg mx-auto bg-slate-50 rounded-2xl p-6 border border-[var(--color-brand-border)] animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--color-brand-border)]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="font-semibold text-[var(--color-brand-ink)]">Analysis Complete</span>
                </div>
                <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-[var(--color-brand-pastel)] text-[var(--color-brand-teal)] font-bold text-sm">
                  {Math.round(scanResult.performance.loadTimeMs / 1000)}s Load
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-sm font-semibold text-[var(--color-brand-ink)] mb-2">Pain Points</h4>
                  <ul className="space-y-2">
                    {scanResult.critique?.painPoints?.map((pt: string, i: number) => (
                      <li key={i} className="text-sm text-[var(--color-brand-slate)] flex gap-2">
                        <span className="text-rose-500 font-bold">•</span> {pt}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-[var(--color-brand-ink)] mb-2">AI Suggested Hook</h4>
                  <div className="bg-white p-3 rounded-lg border border-[var(--color-brand-border)] text-sm text-[var(--color-brand-ink)] italic shadow-sm">
                    "{scanResult.critique?.suggestedHook}"
                  </div>
                </div>
              </div>

              <Button variant="primary" className="w-full flex justify-between items-center shadow-[var(--shadow-soft-teal)]" onClick={closeModal}>
                Create Campaign with this Lead
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
