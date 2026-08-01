import { StandaloneAnalyzerClient } from "@/components/dashboard/analyze/StandaloneAnalyzerClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analyze Website - Crawlia",
};

export default function AnalyzePage() {
  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Standalone Analyzer</h2>
      </div>
      
      <div className="max-w-4xl mx-auto mt-10">
        <StandaloneAnalyzerClient />
      </div>
    </div>
  );
}
