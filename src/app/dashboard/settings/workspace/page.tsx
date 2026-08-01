import { Button } from "@/components/ui/Button";
import { Building2 } from "lucide-react";

export default function WorkspaceSettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
      
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 mx-auto mb-6">
          <Building2 className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-outfit font-bold text-[var(--color-brand-ink)] mb-4">Create your organisation</h1>
        <p className="text-[var(--color-brand-slate)] leading-relaxed text-sm">
          An organisation brings your whole team together under one company identity. Each person keeps their own personal account — with their own name, mailboxes and settings — while sharing campaigns and outreach as a unified team.
        </p>
      </div>

      <div className="bg-white">
        <h2 className="text-xs font-bold text-[var(--color-brand-slate)] uppercase tracking-wider mb-4 border-b border-[var(--color-brand-border)] pb-2">
          Organisation details
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-[var(--color-brand-ink)] uppercase tracking-wider mb-2">Company name *</label>
            <input 
              type="text" 
              placeholder="e.g. Acme Inc." 
              className="w-full px-4 py-3 border border-[var(--color-brand-border)] rounded-xl focus:outline-none focus:border-green-500 bg-white" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--color-brand-ink)] uppercase tracking-wider mb-2">Workspace name *</label>
            <input 
              type="text" 
              placeholder="e.g. Acme Inc.'s Workspace" 
              className="w-full px-4 py-3 border border-[var(--color-brand-border)] rounded-xl focus:outline-none focus:border-green-500 bg-white" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[var(--color-brand-ink)] uppercase tracking-wider mb-2">Website (optional)</label>
            <input 
              type="text" 
              placeholder="https://company.com" 
              className="w-full px-4 py-3 border border-[var(--color-brand-border)] rounded-xl focus:outline-none focus:border-green-500 bg-white" 
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Button variant="primary" className="bg-green-500 hover:bg-green-600 px-8">
            Next 
          </Button>
        </div>
      </div>
      
    </div>
  );
}
