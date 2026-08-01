import { MarketingNavbar } from "@/components/layout/MarketingNavbar";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { Search, Mail, Settings, Book, Play, ShieldAlert, LifeBuoy } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Support & Knowledge Base | Crawlia",
  description: "Get help with Crawlia. Read tutorials on connecting mailboxes, optimizing AI prompts, and running successful cold email campaigns.",
  keywords: "Crawlia support, help center, cold email tutorials, AI outreach guide, Playwright scraper help",
};

export default function HelpCenterPage() {
  const categories = [
    { icon: Play, title: "Getting Started", desc: "Setting up your first campaign and connecting mailboxes." },
    { icon: Book, title: "AI Prompt Optimization", desc: "How to tune Gemini Vision for better email personalization." },
    { icon: Mail, title: "Deliverability Hub", desc: "SPF, DKIM, DMARC, and keeping your domains out of spam." },
    { icon: Settings, title: "Account & Billing", desc: "Managing team seats, AI credits, and subscription plans." },
    { icon: ShieldAlert, title: "Troubleshooting", desc: "Fixing broken scrapes, disconnected inboxes, and errors." },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-brand-canvas)] text-[var(--color-brand-ink)] font-sans selection:bg-[var(--color-brand-teal)] selection:text-white flex flex-col">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Crawlia Help Center",
            "description": metadata.description,
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": categories.map((cat, i) => ({
                "@type": "ListItem",
                "position": i + 1,
                "name": cat.title,
                "description": cat.desc
              }))
            }
          })
        }}
      />

      <MarketingNavbar />
      
      <main className="pt-32 pb-20 max-w-7xl mx-auto px-6 flex-grow">
        {/* Search Header */}
        <div className="bg-[var(--color-brand-ink)] rounded-3xl p-16 text-center mb-16 relative overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-brand-emerald)]/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold font-outfit text-white mb-6">
              How can we help you grow?
            </h1>
            
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search for guides, errors, or deliverability tips..." 
                className="w-full pl-16 pr-6 py-5 rounded-full text-lg border-2 border-transparent focus:border-[var(--color-brand-emerald)] focus:outline-none focus:ring-4 focus:ring-[var(--color-brand-emerald)]/20 shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {categories.map((cat, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-[var(--color-brand-border)] shadow-sm hover:border-[var(--color-brand-teal)]/40 hover:shadow-md transition-all cursor-pointer group">
              <div className="w-12 h-12 bg-[var(--color-brand-pastel)] text-[var(--color-brand-teal)] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <cat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-outfit mb-3">{cat.title}</h3>
              <p className="text-[var(--color-brand-slate)] leading-relaxed">{cat.desc}</p>
            </div>
          ))}
        </div>

        {/* Support Banner */}
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[var(--color-brand-emerald)] to-[var(--color-brand-teal)] text-white rounded-3xl p-12 text-center shadow-lg relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
           <div className="relative z-10">
             <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6">
               <LifeBuoy className="w-8 h-8 text-white" />
             </div>
             <h2 className="text-3xl font-bold font-outfit mb-4">Still can't find what you're looking for?</h2>
             <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
               Our dedicated agency support team is ready to help you optimize your campaigns and fix technical issues.
             </p>
             <Link href="/signup">
               <button className="px-8 py-4 bg-white text-[var(--color-brand-ink)] rounded-full font-bold shadow-md hover:scale-105 transition-transform">
                 Open a Support Ticket
               </button>
             </Link>
           </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
