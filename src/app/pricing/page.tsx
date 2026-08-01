import { MarketingNavbar } from "@/components/layout/MarketingNavbar";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { Check } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Pricing | Pay Per AI Analysis, Not Per Seat | Crawlia",
  description: "Transparent, credit-based pricing for web agencies of all sizes. Scale your cold email outreach without paying exorbitant monthly fees.",
  keywords: "Crawlia pricing, cold email pricing, AI outreach costs, web agency tools pricing, Swokei alternative cost",
};

export default function PricingPage() {
  const faqs = [
    {
      q: "How does the credit system work compared to Swokei?",
      a: "Unlike Swokei which charges flat high monthly fees, Crawlia charges 1 credit per AI Website Analysis. Sending emails and managing replies is completely free. You only pay for the heavy AI computing power."
    },
    {
      q: "Can I connect multiple mailboxes?",
      a: "Yes! Even on our Starter plan, you can connect unlimited Gmail or Outlook accounts. We don't charge 'per seat' or 'per inbox'."
    },
    {
      q: "What happens if a website is broken or offline?",
      a: "Our Playwright engine detects broken, parked, or offline domains before running the Gemini AI analysis. You are never charged a credit for failed analyses."
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
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
              }
            }))
          })
        }}
      />

      <MarketingNavbar />
      
      <main className="pt-32 pb-20 max-w-7xl mx-auto px-6 flex-grow">
        <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-5xl md:text-7xl font-extrabold font-outfit mb-6 tracking-tight">
            Scale without the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand-emerald)] to-[var(--color-brand-teal)]">punishing fees.</span>
          </h1>
          <p className="text-xl text-[var(--color-brand-slate)] max-w-2xl mx-auto font-medium">
            Pay only for the AI processing power you actually use. Unlimited inboxes. Unlimited team members.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-1000">
          {/* Starter */}
          <div className="bg-white p-10 rounded-3xl border border-[var(--color-brand-border)] shadow-sm flex flex-col hover:border-[var(--color-brand-teal)]/30 transition-colors">
            <h3 className="text-2xl font-bold font-outfit mb-2">Freelancer</h3>
            <p className="text-[var(--color-brand-slate)] mb-6">Perfect for solo designers starting outreach.</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold font-outfit">$29</span>
              <span className="text-[var(--color-brand-slate)] font-medium">/month</span>
            </div>
            <Link href="/signup" className="w-full">
              <button className="w-full py-4 rounded-full bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] text-[var(--color-brand-ink)] font-bold mb-8 hover:bg-slate-100 transition-colors">
                Start Free Trial
              </button>
            </Link>
            <ul className="space-y-4 flex-1">
              <li className="flex items-center gap-3 text-[var(--color-brand-slate)] font-medium"><Check className="w-5 h-5 text-[var(--color-brand-emerald)]" /> 500 AI Analyses / mo</li>
              <li className="flex items-center gap-3 text-[var(--color-brand-slate)] font-medium"><Check className="w-5 h-5 text-[var(--color-brand-emerald)]" /> Unlimited Mailboxes</li>
              <li className="flex items-center gap-3 text-[var(--color-brand-slate)] font-medium"><Check className="w-5 h-5 text-[var(--color-brand-emerald)]" /> Playwright Headless Scraping</li>
            </ul>
          </div>

          {/* Growth - Highlighted */}
          <div className="bg-[var(--color-brand-ink)] text-white p-10 rounded-3xl shadow-xl flex flex-col relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[var(--color-brand-emerald)] to-[var(--color-brand-teal)] text-white px-4 py-1 rounded-full text-sm font-bold shadow-sm">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold font-outfit mb-2">Agency Growth</h3>
            <p className="text-slate-300 mb-6">For scaling agencies booking multiple calls a week.</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold font-outfit">$79</span>
              <span className="text-slate-400 font-medium">/month</span>
            </div>
            <Link href="/signup" className="w-full">
              <button className="w-full py-4 rounded-full bg-[var(--color-brand-emerald)] text-white font-bold mb-8 hover:scale-105 transition-transform shadow-lg shadow-emerald-500/20">
                Start Free Trial
              </button>
            </Link>
            <ul className="space-y-4 flex-1">
              <li className="flex items-center gap-3 text-slate-200 font-medium"><Check className="w-5 h-5 text-[var(--color-brand-emerald)]" /> 2,000 AI Analyses / mo</li>
              <li className="flex items-center gap-3 text-slate-200 font-medium"><Check className="w-5 h-5 text-[var(--color-brand-emerald)]" /> Gemini Vision Multi-modal</li>
              <li className="flex items-center gap-3 text-slate-200 font-medium"><Check className="w-5 h-5 text-[var(--color-brand-emerald)]" /> Automated Follow-ups</li>
              <li className="flex items-center gap-3 text-slate-200 font-medium"><Check className="w-5 h-5 text-[var(--color-brand-emerald)]" /> Omni-Channel Inbox</li>
            </ul>
          </div>

          {/* Enterprise */}
          <div className="bg-white p-10 rounded-3xl border border-[var(--color-brand-border)] shadow-sm flex flex-col hover:border-[var(--color-brand-teal)]/30 transition-colors">
            <h3 className="text-2xl font-bold font-outfit mb-2">Enterprise SDR</h3>
            <p className="text-[var(--color-brand-slate)] mb-6">High volume outreach for established teams.</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold font-outfit">$199</span>
              <span className="text-[var(--color-brand-slate)] font-medium">/month</span>
            </div>
            <Link href="/signup" className="w-full">
              <button className="w-full py-4 rounded-full bg-[var(--color-brand-canvas)] border border-[var(--color-brand-border)] text-[var(--color-brand-ink)] font-bold mb-8 hover:bg-slate-100 transition-colors">
                Start Free Trial
              </button>
            </Link>
            <ul className="space-y-4 flex-1">
              <li className="flex items-center gap-3 text-[var(--color-brand-slate)] font-medium"><Check className="w-5 h-5 text-[var(--color-brand-emerald)]" /> 10,000 AI Analyses / mo</li>
              <li className="flex items-center gap-3 text-[var(--color-brand-slate)] font-medium"><Check className="w-5 h-5 text-[var(--color-brand-emerald)]" /> Custom Spintax Dictionary</li>
              <li className="flex items-center gap-3 text-[var(--color-brand-slate)] font-medium"><Check className="w-5 h-5 text-[var(--color-brand-emerald)]" /> Dedicated IP Proxies</li>
            </ul>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-32 max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-outfit font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-[var(--color-brand-border)] shadow-sm">
                <h3 className="text-xl font-bold font-outfit mb-3">{faq.q}</h3>
                <p className="text-lg text-[var(--color-brand-slate)] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
