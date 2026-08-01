import Link from "next/link";
import { Zap, ChevronDown, ScanSearch, Gauge, PenLine, Send, GitBranch, ShieldCheck, Users, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function MarketingNavbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-[#39b54a] flex items-center justify-center text-white">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <span className="font-outfit font-bold text-xl tracking-tight text-[#0b1c13]">Crawlia</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#0b1c13]/70">
            <div className="relative group py-4 -my-4">
              <button className="flex items-center gap-1 hover:text-[#0b1c13] transition-colors outline-none">
                Platform <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-0 w-[700px] bg-white border border-slate-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 p-6 z-50">
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  {/* Website Analysis */}
                  <Link href="/platform/website-analysis" className="flex items-start gap-4 hover:bg-slate-50 p-3 -m-3 rounded-xl transition-colors group/item">
                    <div className="w-10 h-10 rounded-lg bg-green-50 text-[#39b54a] flex items-center justify-center shrink-0 group-hover/item:bg-[#39b54a] group-hover/item:text-white transition-colors">
                      <ScanSearch className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[#0b1c13] font-bold text-sm mb-1">Website analysis</div>
                      <div className="text-slate-500 font-medium text-xs leading-relaxed">Crawlia reads the real site before it writes.</div>
                    </div>
                  </Link>

                  {/* Website Scoring */}
                  <Link href="/platform/website-scoring" className="flex items-start gap-4 hover:bg-slate-50 p-3 -m-3 rounded-xl transition-colors group/item">
                    <div className="w-10 h-10 rounded-lg bg-green-50 text-[#39b54a] flex items-center justify-center shrink-0 group-hover/item:bg-[#39b54a] group-hover/item:text-white transition-colors">
                      <Gauge className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[#0b1c13] font-bold text-sm mb-1">Website scoring</div>
                      <div className="text-slate-500 font-medium text-xs leading-relaxed">Every lead scored, weak sites skipped.</div>
                    </div>
                  </Link>

                  {/* Personalized Writing */}
                  <Link href="/platform/personalized-writing" className="flex items-start gap-4 hover:bg-slate-50 p-3 -m-3 rounded-xl transition-colors group/item">
                    <div className="w-10 h-10 rounded-lg bg-green-50 text-[#39b54a] flex items-center justify-center shrink-0 group-hover/item:bg-[#39b54a] group-hover/item:text-white transition-colors">
                      <PenLine className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[#0b1c13] font-bold text-sm mb-1">Personalized writing</div>
                      <div className="text-slate-500 font-medium text-xs leading-relaxed">One email per lead, about their site.</div>
                    </div>
                  </Link>

                  {/* Email Sending */}
                  <Link href="/platform/email-sending" className="flex items-start gap-4 hover:bg-slate-50 p-3 -m-3 rounded-xl transition-colors group/item">
                    <div className="w-10 h-10 rounded-lg bg-green-50 text-[#39b54a] flex items-center justify-center shrink-0 group-hover/item:bg-[#39b54a] group-hover/item:text-white transition-colors">
                      <Send className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[#0b1c13] font-bold text-sm mb-1">Email sending</div>
                      <div className="text-slate-500 font-medium text-xs leading-relaxed">Your mailbox, paced to stay in the inbox.</div>
                    </div>
                  </Link>

                  {/* Fallback Handling */}
                  <Link href="/platform/fallback-handling" className="flex items-start gap-4 hover:bg-slate-50 p-3 -m-3 rounded-xl transition-colors group/item">
                    <div className="w-10 h-10 rounded-lg bg-green-50 text-[#39b54a] flex items-center justify-center shrink-0 group-hover/item:bg-[#39b54a] group-hover/item:text-white transition-colors">
                      <GitBranch className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[#0b1c13] font-bold text-sm mb-1">Fallback handling</div>
                      <div className="text-slate-500 font-medium text-xs leading-relaxed">No site, dead site — still handled.</div>
                    </div>
                  </Link>

                  {/* Mail Verifier */}
                  <Link href="/platform/mail-verifier" className="flex items-start gap-4 hover:bg-slate-50 p-3 -m-3 rounded-xl transition-colors group/item">
                    <div className="w-10 h-10 rounded-lg bg-green-50 text-[#39b54a] flex items-center justify-center shrink-0 group-hover/item:bg-[#39b54a] group-hover/item:text-white transition-colors">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[#0b1c13] font-bold text-sm mb-1">Mail verifier</div>
                      <div className="text-slate-500 font-medium text-xs leading-relaxed">Validate every address before you send.</div>
                    </div>
                  </Link>

                  {/* Team Workspace */}
                  <Link href="/platform/team-workspace" className="flex items-start gap-4 hover:bg-slate-50 p-3 -m-3 rounded-xl transition-colors group/item">
                    <div className="w-10 h-10 rounded-lg bg-green-50 text-[#39b54a] flex items-center justify-center shrink-0 group-hover/item:bg-[#39b54a] group-hover/item:text-white transition-colors">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[#0b1c13] font-bold text-sm mb-1">Team workspace</div>
                      <div className="text-slate-500 font-medium text-xs leading-relaxed">Share leads, campaigns and inboxes.</div>
                    </div>
                  </Link>

                  {/* CRM */}
                  <Link href="/platform/crm" className="flex items-start gap-4 hover:bg-slate-50 p-3 -m-3 rounded-xl transition-colors group/item">
                    <div className="w-10 h-10 rounded-lg bg-green-50 text-[#39b54a] flex items-center justify-center shrink-0 group-hover/item:bg-[#39b54a] group-hover/item:text-white transition-colors">
                      <LayoutList className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[#0b1c13] font-bold text-sm mb-1">CRM</div>
                      <div className="text-slate-500 font-medium text-xs leading-relaxed">Cold lead to closed deal, in one place.</div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/how-it-works" className="hover:text-[#0b1c13] transition-colors">How it works</Link>
            <Link href="/pricing" className="hover:text-[#0b1c13] transition-colors">Pricing</Link>
            <Link href="/blog" className="hover:text-[#0b1c13] transition-colors">Blog</Link>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-bold text-[#0b1c13] hover:opacity-70 transition-opacity hidden md:inline-block">
            Log in
          </Link>
          <Link href="/signup">
            <Button variant="primary" className="rounded-full bg-[#39b54a] hover:bg-[#2d963c] text-white font-bold px-6 shadow-sm border-0">
              Start for free
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
