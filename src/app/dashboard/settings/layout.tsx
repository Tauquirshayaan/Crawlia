"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { 
  User, Building2, CreditCard, Bell, Settings as SettingsIcon, 
  ChevronLeft, Zap
} from "lucide-react";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Profile", href: "/dashboard/settings/profile", icon: User },
    { name: "Workspace", href: "/dashboard/settings/workspace", icon: Building2 },
    { name: "Billing & plan", href: "/dashboard/settings/billing", icon: CreditCard },
    { name: "Notifications", href: "/dashboard/settings/notifications", icon: Bell },
    { name: "System Settings", href: "/dashboard/settings/system", icon: SettingsIcon },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-white flex">
      {/* Settings Sidebar */}
      <aside className="w-64 bg-slate-50 border-r border-[var(--color-brand-border)] flex flex-col pt-6 shrink-0 h-full">
        <Link href="/dashboard" className="px-6 text-sm text-[var(--color-brand-slate)] hover:text-[var(--color-brand-ink)] flex items-center gap-2 mb-6 font-medium">
          <ChevronLeft className="w-4 h-4" /> Back
        </Link>

        <div className="px-6 text-xs font-bold text-[var(--color-brand-slate)] uppercase tracking-wider mb-4">
          Account
        </div>

        <nav className="flex-1 flex flex-col gap-1 px-3 relative z-10">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all relative ${
                  isActive 
                    ? "text-[var(--color-brand-ink)]" 
                    : "text-[var(--color-brand-slate)] hover:bg-black/5 hover:text-[var(--color-brand-ink)]"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-green-500 rounded-r-full"></div>
                )}
                <item.icon className={`w-5 h-5 ${isActive ? "text-green-500" : ""}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full bg-white relative">
        {/* Settings Header */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-[var(--color-brand-border)] shrink-0">
          <div>
            <h1 className="text-xl font-bold text-[var(--color-brand-ink)]">Account</h1>
            <p className="text-xs text-[var(--color-brand-slate)]">Manage your account settings</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="rounded-full font-bold">
              Ask Swok
            </Button>
            <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs">
              0
            </div>
            <div className="w-8 h-8 rounded-full bg-[linear-gradient(135deg,var(--color-brand-emerald)_0%,var(--color-brand-teal)_100%)] text-white flex items-center justify-center font-bold text-xs cursor-pointer">
              B
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto w-full">
          <div className="max-w-7xl mx-auto py-10 px-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
