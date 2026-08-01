"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Search, Zap } from "lucide-react";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { AskCrawlia } from "./AskCrawlia";
import { AnalyzerModal } from "./AnalyzerModal";

import { CreditsDropdown } from "./CreditsDropdown";

export function Header() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");

  const pathname = usePathname();

  let title = "Dashboard";
  let subtitle = "Welcome back";

  if (pathname.includes("/dashboard/campaigns")) {
    title = "Campaigns";
    subtitle = "Manage your email campaigns";
  } else if (pathname.includes("/dashboard/leads")) {
    title = "Leads";
    subtitle = "Manage your leads database";
  }

  return (
    <>
      <header className="h-20 bg-white border-b border-[var(--color-brand-border)] flex items-center justify-between px-8 sticky top-0 z-30 shrink-0">
        <div className="flex-1">
          <h1 className="text-xl font-bold text-[var(--color-brand-ink)]">{title}</h1>
          <p className="text-sm text-[var(--color-brand-slate)]">{subtitle}</p>
        </div>

        <div className="flex items-center gap-4">
          <CreditsDropdown />
          
          <button className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-200 text-green-700 font-semibold text-sm hover:bg-green-50 transition-colors">
            Ask Swok
          </button>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[var(--color-brand-border)] bg-gray-50 text-sm font-medium text-gray-700 cursor-pointer">
            <div className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "B"}
            </div>
            <span className="truncate max-w-[120px]">{session?.user?.email || "user@swokei.com"}</span>
          </div>

          <div className="w-9 h-9 rounded-full border border-[var(--color-brand-border)] flex items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
          </div>
        </div>
      </header>

      {/* Global Modals */}
      <AnalyzerModal />
    </>
  );
}
