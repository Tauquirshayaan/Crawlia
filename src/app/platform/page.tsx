import { MarketingNavbar } from "@/components/layout/MarketingNavbar";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { Zap, Bot, Mail, ChartBar, Layers, Eye, Smartphone, Cpu, CheckCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Platform Features | The Smartest Agency Outreach Tool | Crawlia",
  description: "Discover how Crawlia's Playwright engine and Gemini AI combine to extract SEO metadata, analyze Core Web Vitals, and write hyper-personalized cold emails at scale. The ultimate Swokei alternative.",
  keywords: "Crawlia features, Playwright website scraping, Gemini AI outreach, cold email personalization platform, web agency SDR software",
};

export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-[var(--color-brand-canvas)] text-[var(--color-brand-ink)] font-sans selection:bg-[var(--color-brand-teal)] selection:text-white flex flex-col">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Platform Features - Crawlia",
            "description": metadata.description,
            "mainEntity": {
              "@type": "SoftwareApplication",
              "name": "Crawlia Agency SDR",
              "applicationCategory": "BusinessApplication",
              "featureList": [
                "Playwright Headless Browsing",
                "Core Web Vitals Analysis",
                "Gemini Multimodal AI Vision",
                "Omni-Channel Inbox",
                "Automated Follow-ups"
              ]
            }
          })
        }}
      />

      <MarketingNavbar />
      
      <main className="pt-32 pb-20 max-w-7xl mx-auto px-6 flex-grow">
        <div className="text-center mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-brand-pastel)] text-[var(--color-brand-teal)] text-sm font-bold mb-8">
            <Cpu className="w-4 h-4" />
            Under the Hood
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold font-outfit mb-6 tracking-tight">
            The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand-emerald)] to-[var(--color-brand-teal)]">Agency OS</span>
          </h1>
          <p className="text-xl text-[var(--color-brand-slate)] max-w-3xl mx-auto font-medium leading-relaxed">
            While generic outreach tools rely on basic HTTP scraping, Crawlia spins up real browsers to render Javascript, evaluate Core Web Vitals, and let AI "see" the exact UI flaws on a prospect's website.
          </p>
        </div>

        {/* Feature Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          
          {/* Bento 1 - Full Width */}
          <div className="md:col-span-3 bg-white rounded-3xl p-10 border border-[var(--color-brand-border)] shadow-sm flex flex-col md:flex-row items-center gap-12 group overflow-hidden">
             <div className="flex-1 z-10">
               <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-sm">
                 <Bot className="w-6 h-6" />
               </div>
               <h3 className="text-3xl font-bold font-outfit mb-4">Gemini Multimodal AI Vision</h3>
               <p className="text-lg text-[var(--color-brand-slate)] leading-relaxed">
                 We don't just read the code; we look at the website. Crawlia takes viewport screenshots and feeds them to Google's Gemini Vision models to critique layout, visual hierarchy, and color contrast. The result? Outreach that sounds like a real designer wrote it.
               </p>
             </div>
             <div className="flex-1 w-full relative h-full flex items-center justify-center">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-50 rounded-2xl border border-blue-100/50 shadow-inner group-hover:scale-105 transition-transform duration-700"></div>
               <Eye className="w-32 h-32 text-blue-500/20 absolute" />
             </div>
          </div>

          {/* Bento 2 */}
          <div className="md:col-span-2 bg-[var(--color-brand-ink)] text-white rounded-3xl p-10 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[60px] group-hover:bg-emerald-500/20 transition-colors"></div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <Zap className="w-10 h-10 text-[var(--color-brand-emerald)] mb-6" />
                <h3 className="text-3xl font-bold font-outfit mb-3">Headless Web Scraping</h3>
                <p className="text-slate-300 text-lg max-w-md">
                  Our Playwright engine renders full JavaScript. We extract hidden OpenGraph tags, JSON-LD schema, and evaluate Core Web Vitals to build a technical audit of every lead.
                </p>
              </div>
              <ul className="grid grid-cols-2 gap-3 mt-6">
                {['React/Vue Apps', 'Schema.org', 'LCP & CLS', 'Mobile Emulation'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                    <CheckCircle className="w-4 h-4 text-[var(--color-brand-emerald)]" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bento 3 */}
          <div className="bg-white rounded-3xl p-10 border border-[var(--color-brand-border)] shadow-sm flex flex-col justify-between hover:border-[var(--color-brand-teal)] transition-colors">
             <div>
               <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-6">
                 <Smartphone className="w-6 h-6" />
               </div>
               <h3 className="text-2xl font-bold font-outfit mb-3">Mobile UX Checks</h3>
               <p className="text-[var(--color-brand-slate)]">
                 Over 60% of traffic is mobile. Crawlia emulates mobile devices to flag unoptimized touch targets and overflow issues.
               </p>
             </div>
          </div>

          {/* Bento 4 */}
          <div className="bg-[var(--color-brand-pastel)] border border-[var(--color-brand-teal)]/20 rounded-3xl p-10 flex flex-col justify-between">
             <div>
               <Mail className="w-12 h-12 text-[var(--color-brand-teal)] mb-6" />
               <h3 className="text-2xl font-bold font-outfit mb-3 text-[var(--color-brand-teal)]">Smart Deliverability</h3>
               <p className="text-[var(--color-brand-ink)]/80">
                 Integrated bounce checking, spintax, and variable sending intervals to ensure your emails actually hit the Primary Inbox.
               </p>
             </div>
          </div>

          {/* Bento 5 */}
          <div className="md:col-span-2 bg-white rounded-3xl p-10 border border-[var(--color-brand-border)] shadow-sm flex flex-col justify-between group">
             <div>
               <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                 <Layers className="w-6 h-6" />
               </div>
               <h3 className="text-3xl font-bold font-outfit mb-3">Unified Omni-Channel Inbox</h3>
               <p className="text-lg text-[var(--color-brand-slate)] max-w-xl">
                 Connect unlimited Google Workspace and Outlook mailboxes. Crawlia aggregates every reply into a single dashboard and uses AI to tag intent automatically (Interested, OOO, Unsubscribe).
               </p>
             </div>
          </div>

        </div>

        {/* CTA Footer */}
        <div className="mt-32 bg-white border border-[var(--color-brand-border)] rounded-3xl p-16 text-center shadow-sm">
          <h2 className="text-4xl font-outfit font-bold mb-6">Stop guessing. Start converting.</h2>
          <p className="text-xl text-[var(--color-brand-slate)] max-w-2xl mx-auto mb-10">
            Out-perform competitors using basic outreach tools by leveraging real data and true AI vision.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Link href="/signup">
               <button className="px-8 py-4 bg-[var(--color-brand-ink)] text-white rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform">
                 Get Started Now
               </button>
             </Link>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
