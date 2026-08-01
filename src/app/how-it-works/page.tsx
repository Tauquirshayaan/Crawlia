import { MarketingNavbar } from "@/components/layout/MarketingNavbar";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { HowItWorksContent } from "@/components/landing/HowItWorksContent";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "How It Works | Automated Web Agency Client Acquisition | Crawlia",
  description: "Learn how Crawlia automates your agency's outreach from finding B2B leads to unified inbox management.",
  keywords: "how Crawlia works, automated SEO audits, AI cold email personalization, web design client acquisition",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white text-[var(--color-brand-ink)] font-sans selection:bg-[#39b54a] selection:text-white flex flex-col">
      <MarketingNavbar />
      
      <main className="flex-grow pt-40">
        {/* Header Section */}
        <div className="text-center mb-16 max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-extrabold font-outfit mb-6 tracking-tight leading-[1.1]">
            How Crawlia works
          </h1>
          <p className="text-xl text-[var(--color-brand-slate)] mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
            Automated process to generate leads
          </p>
          <Link href="/demo">
            <Button className="rounded-full bg-[#39b54a] hover:bg-[#2d963c] text-white font-bold h-14 px-10 text-lg shadow-xl shadow-green-500/20 border-0">
              Book a demo
            </Button>
          </Link>
        </div>

        {/* Client Component handling Scrollspy and Tabs */}
        <HowItWorksContent />

        {/* Bottom CTA */}
        <section className="bg-[#0b1c13] text-white py-32 text-center relative overflow-hidden mt-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#39b54a]/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="max-w-4xl mx-auto px-6 relative z-10">
            <h2 className="text-5xl md:text-6xl font-outfit font-bold mb-8 leading-tight">
              Ready to grow your agency?
            </h2>
            <p className="text-xl text-white/70 font-medium mb-12 max-w-2xl mx-auto">
              Join 5,000+ other agencies landing high-paying web design clients every day.
            </p>
            <Link href="/signup">
              <Button className="rounded-full bg-[#39b54a] hover:bg-[#2d963c] text-white font-bold h-16 px-12 text-lg shadow-xl shadow-green-500/20 border-0">
                Start for free <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
