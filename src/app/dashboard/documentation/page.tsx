import { getCategories } from "@/lib/docs";
import Link from "next/link";
import { Search, Rocket, CreditCard, Mail, Globe, Send, Wrench, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Documentation | Crawlia",
  description: "Browse guides, tutorials, and troubleshooting for Crawlia.",
};

const iconMap: Record<string, React.ReactNode> = {
  'rocket': <Rocket className="w-6 h-6 text-[#39b54a]" />,
  'credit-card': <CreditCard className="w-6 h-6 text-[#39b54a]" />,
  'mail': <Mail className="w-6 h-6 text-[#39b54a]" />,
  'globe': <Globe className="w-6 h-6 text-[#39b54a]" />,
  'send': <Send className="w-6 h-6 text-[#39b54a]" />,
  'wrench': <Wrench className="w-6 h-6 text-[#39b54a]" />,
};

export default function DocumentationPage() {
  const categories = getCategories();

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-outfit font-bold text-[var(--color-brand-ink)] mb-4 tracking-tight">
          How can we help you?
        </h1>
        <p className="text-lg text-[var(--color-brand-slate)] mb-10">
          Browse guides, tutorials and troubleshooting for Crawlia.
        </p>

        <div className="max-w-2xl mx-auto relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-20">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="w-full h-14 pl-12 pr-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#39b54a]/20 focus:border-[#39b54a] transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)] placeholder:text-slate-400 text-lg relative z-10"
            placeholder="Search all articles..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.slug} className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all group flex flex-col h-full relative overflow-hidden">
            <div className="w-12 h-12 bg-[#39b54a]/10 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-105">
              {iconMap[cat.icon] || <Rocket className="w-6 h-6 text-[#39b54a]" />}
            </div>
            
            <h2 className="text-xl font-bold text-[var(--color-brand-ink)] font-outfit mb-3 group-hover:text-[#39b54a] transition-colors">
              {cat.title}
            </h2>
            
            <p className="text-sm text-slate-500 mb-8 leading-relaxed flex-grow">
              {cat.description}
            </p>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
              <span className="text-sm font-bold text-[#39b54a] transition-colors flex items-center group/link">
                Browse <ChevronRight className="w-4 h-4 ml-0.5" />
              </span>
              
              <span className="text-xs font-medium text-slate-400">
                {cat.articleCount} articles
              </span>
            </div>
            
            {/* Make the whole card clickable for better UX */}
            <Link href={`/dashboard/documentation/${cat.slug}`} className="absolute inset-0 z-10">
              <span className="sr-only">Browse {cat.title}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
