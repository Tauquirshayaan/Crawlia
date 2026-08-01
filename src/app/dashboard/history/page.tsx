import { prisma } from "@/lib/prisma";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const analyses = await prisma.analysis.findMany({
    include: {
      lead: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100, // Limit for MVP
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-outfit font-bold text-[var(--color-brand-ink)]">Analysis History</h1>
          <p className="text-[var(--color-brand-slate)] mt-1">A chronological log of all website audits performed in this workspace.</p>
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        {analyses.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--color-brand-pastel)] flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-[var(--color-brand-teal)]" />
            </div>
            <h3 className="text-lg font-bold text-[var(--color-brand-ink)] mb-2">No history yet</h3>
            <p className="text-[var(--color-brand-slate)] max-w-sm">When you analyze websites, they will appear here in the history log.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-[var(--color-brand-ink)]">
            <thead className="bg-white/50 border-b border-[var(--color-brand-border)]">
              <tr>
                <th className="px-6 py-4 font-semibold">URL</th>
                <th className="px-6 py-4 font-semibold">Lead Name</th>
                <th className="px-6 py-4 font-semibold">Score</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-brand-border)]">
              {analyses.map((analysis) => (
                <tr key={analysis.id} className="hover:bg-white/50 transition-colors group">
                  <td className="px-6 py-4 truncate max-w-[200px]">
                    <a href={analysis.lead.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand-teal)] hover:underline">
                      {analysis.lead.websiteUrl}
                    </a>
                  </td>
                  <td className="px-6 py-4 font-medium">{analysis.lead.name || "Unknown"}</td>
                  <td className="px-6 py-4">
                    {analysis.score > 0 ? (
                      <span className="font-bold">{analysis.score}/10</span>
                    ) : (
                      <span className="text-[var(--color-brand-slate)]">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <StatusPill status={analysis.status as any} />
                  </td>
                  <td className="px-6 py-4 text-[var(--color-brand-slate)]">
                    {new Date(analysis.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassCard>
    </div>
  );
}
