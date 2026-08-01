import { GlassCard } from "@/components/ui/GlassCard";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { SettingsProfileClient } from "@/components/dashboard/settings/SettingsProfileClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ProfileSettingsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      workspaces: {
        include: { workspace: true }
      }
    }
  });

  if (!user || user.workspaces.length === 0) {
    return <div>Workspace not found</div>;
  }

  const workspaceMember = user.workspaces[0];
  const workspace = workspaceMember.workspace;
  
  // Quick fetch of credits and limit (mocked for now, or we can fetch true values)
  const maxEmails = 1000;
  const creditsLeft = 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
      
      {/* Top Banner Card */}
      <GlassCard className="p-6 flex items-center justify-between border-green-100 bg-green-50/30">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-2xl font-bold">
            B
          </div>
          <div>
            <div className="text-xl font-bold text-[var(--color-brand-ink)]">{user.email}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-[var(--color-brand-slate)] capitalize">{workspaceMember.role.toLowerCase()}</span>
              <span className="text-xs font-medium text-[var(--color-brand-ink)]">{workspace.tier}</span>
              <span className="text-xs text-[var(--color-brand-slate)]">{user.email}</span>
              <span className="text-xs text-[var(--color-brand-slate)]">Individual</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-8 text-center pr-4">
          <div>
            <div className="text-xl font-bold text-[var(--color-brand-ink)]">{maxEmails}</div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--color-brand-slate)] font-bold">Max emails/m</div>
          </div>
          <div>
            <div className="text-xl font-bold text-[var(--color-brand-ink)]">{creditsLeft}</div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--color-brand-slate)] font-bold">Credits left</div>
          </div>
        </div>
      </GlassCard>

      <SettingsProfileClient 
        user={user} 
        workspace={{...workspace, role: workspaceMember.role}} 
      />

      {/* Bottom Navigation Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Link href="/dashboard/settings/workspace" className="p-4 border border-[var(--color-brand-border)] rounded-xl hover:border-green-500 flex items-center justify-between group bg-white">
          <span className="font-bold text-[var(--color-brand-ink)]">Workspace</span>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-green-500 transition-colors" />
        </Link>
        <Link href="/dashboard/support" className="p-4 border border-[var(--color-brand-border)] rounded-xl hover:border-green-500 flex items-center justify-between group bg-white">
          <span className="font-bold text-[var(--color-brand-ink)]">Help</span>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-green-500 transition-colors" />
        </Link>
        <Link href="/dashboard/inboxes" className="p-4 border border-[var(--color-brand-border)] rounded-xl hover:border-green-500 flex items-center justify-between group bg-white">
          <span className="font-bold text-[var(--color-brand-ink)]">Mailboxes</span>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-green-500 transition-colors" />
        </Link>
      </div>
      
    </div>
  );
}
