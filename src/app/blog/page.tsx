import { MarketingNavbar } from "@/components/layout/MarketingNavbar";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Web Agency Growth & Cold Email Blog | Crawlia",
  description: "Expert strategies on cold email deliverability, selling web design services, technical SEO audits, and AI outreach automation.",
  keywords: "web agency blog, cold email tips, sell web design, SEO audit guide, AI outreach strategies",
};

export default function BlogPage() {
  const posts = [
    {
      title: "Why Swokei's Basic Scraper Misses 80% of Core Web Vitals",
      excerpt: "A deep dive into why relying on HTTP scraping for agency outreach is dead, and why Playwright headless rendering is the future.",
      category: "Technical",
      date: "Aug 12, 2026",
      readTime: "6 min read"
    },
    {
      title: "The Perfect Cold Email Structure for Web Designers in 2026",
      excerpt: "Stop sending 'We build fast websites'. Start sending 'I noticed your JSON-LD schema is missing, causing a 30% drop in local maps.'",
      category: "Sales",
      date: "Aug 05, 2026",
      readTime: "4 min read"
    },
    {
      title: "How to Avoid Gmail's New Spam Filters (Q3 Update)",
      excerpt: "Google and Yahoo have tightened their bulk sender guidelines. Here is exactly how to keep your domains healthy using Crawlia's bounce protection.",
      category: "Deliverability",
      date: "Jul 28, 2026",
      readTime: "8 min read"
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-brand-canvas)] text-[var(--color-brand-ink)] font-sans selection:bg-[var(--color-brand-teal)] selection:text-white flex flex-col">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Crawlia Agency Growth Blog",
            "description": metadata.description,
            "url": "https://crawlia.com/blog",
            "blogPost": posts.map(post => ({
              "@type": "BlogPosting",
              "headline": post.title,
              "abstract": post.excerpt,
              "datePublished": new Date(post.date).toISOString()
            }))
          })
        }}
      />

      <MarketingNavbar />
      
      <main className="pt-32 pb-20 max-w-7xl mx-auto px-6 flex-grow">
        <div className="text-center mb-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-brand-pastel)] text-[var(--color-brand-teal)] text-sm font-bold mb-8">
            <BookOpen className="w-4 h-4" />
            Agency Growth Hub
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold font-outfit mb-6 tracking-tight">
            Read by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand-emerald)] to-[var(--color-brand-teal)]">top 1%</span> agencies.
          </h1>
          <p className="text-xl text-[var(--color-brand-slate)] max-w-2xl mx-auto font-medium">
            Actionable strategies on client acquisition, cold email deliverability, and closing high-ticket web design retainers.
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <div className="bg-[var(--color-brand-ink)] rounded-3xl p-1 md:p-1 overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-shadow relative">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0"></div>
            <div className="bg-gradient-to-br from-[var(--color-brand-emerald)] to-[var(--color-brand-teal)] md:h-[400px] rounded-[22px] p-10 flex flex-col justify-end relative z-10 overflow-hidden">
               <div className="absolute top-0 right-0 w-full h-full bg-black/10 transition-opacity group-hover:opacity-0"></div>
               <div className="relative z-20">
                 <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-sm font-bold rounded-full mb-4">
                   Featured • AI Outreach
                 </div>
                 <h2 className="text-4xl md:text-5xl font-outfit font-bold text-white mb-4 max-w-3xl">
                   How we used Gemini Multimodal Vision to book 15 web design meetings in a week.
                 </h2>
                 <div className="flex items-center gap-4 text-white/80 font-medium">
                   <span>By Shayaan</span>
                   <span>•</span>
                   <span>Aug 15, 2026</span>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 border border-[var(--color-brand-border)] shadow-sm hover:border-[var(--color-brand-teal)]/30 transition-colors cursor-pointer group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[var(--color-brand-teal)] font-bold text-sm bg-[var(--color-brand-pastel)] px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-[var(--color-brand-slate)] text-sm font-medium">{post.readTime}</span>
                </div>
                <h3 className="text-2xl font-bold font-outfit mb-4 group-hover:text-[var(--color-brand-teal)] transition-colors">
                  {post.title}
                </h3>
                <p className="text-[var(--color-brand-slate)] leading-relaxed mb-6">
                  {post.excerpt}
                </p>
              </div>
              <div className="flex items-center justify-between border-t border-[var(--color-brand-border)] pt-6">
                <span className="text-sm text-[var(--color-brand-slate)] font-medium">{post.date}</span>
                <div className="w-8 h-8 rounded-full bg-[var(--color-brand-canvas)] flex items-center justify-center group-hover:bg-[var(--color-brand-teal)] group-hover:text-white transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-24 bg-[var(--color-brand-pastel)] rounded-3xl p-16 text-center border border-[var(--color-brand-teal)]/20 shadow-sm relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/40 rounded-full blur-[60px]"></div>
          <div className="relative z-10">
            <h3 className="text-3xl font-outfit font-bold mb-4">Never miss an outreach strategy.</h3>
            <p className="text-lg text-[var(--color-brand-slate)] mb-8 max-w-xl mx-auto">
              Join 5,000+ web agency founders getting our weekly teardowns on what's working in cold email right now.
            </p>
            <div className="flex flex-col sm:flex-row justify-center max-w-md mx-auto gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 px-6 py-4 rounded-full border border-slate-300 focus:outline-none focus:border-[var(--color-brand-teal)] focus:ring-2 focus:ring-[var(--color-brand-teal)]/20 shadow-sm"
              />
              <button className="px-8 py-4 bg-[var(--color-brand-ink)] text-white rounded-full font-bold shadow-md hover:scale-105 transition-transform">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
