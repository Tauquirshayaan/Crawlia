import Link from "next/link";
import { Zap } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="bg-white py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-16">
        <div className="max-w-sm">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#39b54a] flex items-center justify-center text-white shadow-sm">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <span className="font-outfit font-extrabold text-2xl text-[var(--color-brand-ink)]">Crawlia</span>
          </div>
          <p className="text-[var(--color-brand-slate)] leading-relaxed">
            The premier AI client acquisition engine for web design and development agencies. Automate your growth.
          </p>
        </div>
        <div className="flex gap-16 md:gap-24">
          <div>
            <h4 className="font-outfit font-bold text-lg mb-6 text-[var(--color-brand-ink)]">Platform</h4>
            <ul className="space-y-4 text-[var(--color-brand-slate)] font-medium">
              <li><Link href="/platform/website-analysis" className="hover:text-[var(--color-brand-teal)] transition-colors">Website Analysis</Link></li>
              <li><Link href="/platform/website-scoring" className="hover:text-[var(--color-brand-teal)] transition-colors">Website Scoring</Link></li>
              <li><Link href="/platform/personalized-writing" className="hover:text-[var(--color-brand-teal)] transition-colors">Personalized Writing</Link></li>
              <li><Link href="/platform/email-sending" className="hover:text-[var(--color-brand-teal)] transition-colors">Email Sending</Link></li>
              <li><Link href="/platform/fallback-handling" className="hover:text-[var(--color-brand-teal)] transition-colors">Fallback Handling</Link></li>
              <li><Link href="/platform/mail-verifier" className="hover:text-[var(--color-brand-teal)] transition-colors">Mail Verifier</Link></li>
              <li><Link href="/platform/team-workspace" className="hover:text-[var(--color-brand-teal)] transition-colors">Team Workspace</Link></li>
              <li><Link href="/platform/crm" className="hover:text-[var(--color-brand-teal)] transition-colors">CRM</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-outfit font-bold text-lg mb-6 text-[var(--color-brand-ink)]">Resources</h4>
            <ul className="space-y-4 text-[var(--color-brand-slate)] font-medium">
              <li><Link href="/help-center" className="hover:text-[var(--color-brand-teal)] transition-colors">Help Center</Link></li>
              <li><Link href="/blog" className="hover:text-[var(--color-brand-teal)] transition-colors">Blog</Link></li>
              <li><Link href="/dashboard/documentation" className="hover:text-[var(--color-brand-teal)] transition-colors">API Docs</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
