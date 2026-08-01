import Link from "next/link";
import { Home, Users, Megaphone, Mail, Settings, Zap, CalendarDays, Clock, Gift, Book, MessageSquare, PlayCircle, HelpCircle, Sparkles, BarChart3 } from "lucide-react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { UserProfileDropdown } from "./UserProfileDropdown";
import { prisma } from "@/lib/prisma";

const primaryNavItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Leads", href: "/dashboard/leads", icon: Users },
  { name: "Lead Finder", href: "/dashboard/leads/find", icon: Zap },
  { name: "Analyze Website", href: "/dashboard/analyze", icon: Sparkles },
  { name: "Mailboxes", href: "/dashboard/inboxes", icon: Mail },
  { name: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
  { name: "History", href: "/dashboard/history", icon: Clock },
];

const footerNavItems = [
  { name: "Tutorials", href: "/dashboard/tutorials", icon: PlayCircle },
  { name: "Documentation", href: "/dashboard/documentation", icon: Book },
  { name: "Feedback", href: "/dashboard/feedback", icon: MessageSquare },
  { name: "Chat support", href: "/dashboard/support", icon: HelpCircle },
  { name: "Affiliates dashboard", href: "/dashboard/affiliates", icon: Gift },
];

export async function Sidebar() {
  const session = await getServerSession(authOptions);
  const userInitial = session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U";
  const userEmail = session?.user?.email || "user@crawlia.com";
  
  let isAdmin = false;
  if (session?.user && (session.user as any).id) {
    const member = await prisma.workspaceMember.findFirst({
      where: { userId: (session.user as any).id }
    });
    isAdmin = member?.role === 'ADMIN' || member?.role === 'OWNER';
  }

  return (
    <aside className="w-64 h-screen fixed top-0 left-0 bg-white/80 backdrop-blur-xl border-r border-[var(--color-brand-border)] flex flex-col pt-6 z-20">
      <Link href="/dashboard" className="px-6 mb-8 flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
        <div className="w-8 h-8 rounded-lg bg-[#66ca7a] flex items-center justify-center text-white shadow-sm">
          <Zap className="w-5 h-5 fill-current" />
        </div>
        <span className="font-outfit font-bold text-xl tracking-tight text-[var(--color-brand-ink)]">Swokei</span>
      </Link>

      <div className="flex-1 px-4 flex flex-col gap-8 overflow-y-auto pb-24">
        <nav className="flex flex-col gap-1">
          {primaryNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--color-brand-slate)] hover:text-[var(--color-brand-teal)] hover:bg-[var(--color-brand-pastel)] transition-colors"
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>
        
        <div className="flex flex-col gap-1 mt-auto">
          <div className="px-3 pb-2 text-xs font-bold text-[var(--color-brand-slate)] uppercase tracking-wider">Workspace</div>
          {isAdmin && (
            <Link
              href="/dashboard/settings/workspace"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--color-brand-slate)] hover:text-[var(--color-brand-teal)] hover:bg-[var(--color-brand-pastel)] transition-colors"
            >
              <Settings className="w-5 h-5" />
              Workspace Settings
            </Link>
          )}
          {footerNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--color-brand-slate)] hover:text-[var(--color-brand-teal)] hover:bg-[var(--color-brand-pastel)] transition-colors"
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 bg-white/90 border-t border-[var(--color-brand-border)]">
        <UserProfileDropdown 
          userInitial={userInitial} 
          userEmail={userEmail} 
          userName={session?.user?.name || "User"} 
        />
      </div>
    </aside>
  );
}
