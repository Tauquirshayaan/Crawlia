import { Button } from "@/components/ui/Button";
import { Shield, Key, MonitorSmartphone, AlertTriangle } from "lucide-react";

export default function SystemSettingsPage() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
      
      {/* Security */}
      <section className="space-y-6">
        <div className="flex items-start justify-between pb-6 border-b border-[var(--color-brand-border)]">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-1">
              <Shield className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-[var(--color-brand-ink)]">Two-factor authentication</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 px-2 py-0.5 rounded">Not configured</span>
              </div>
              <p className="text-sm text-[var(--color-brand-slate)]">Add an extra layer of protection with an authenticator app.</p>
            </div>
          </div>
          <Button variant="primary" className="bg-green-500 hover:bg-green-600 px-6">Set up</Button>
        </div>

        <div className="flex items-start justify-between pb-6 border-b border-[var(--color-brand-border)]">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-1">
              <Key className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-[var(--color-brand-ink)]">Password</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded">Managed by auth provider</span>
              </div>
              <p className="text-sm text-[var(--color-brand-slate)]">Your password is managed by your authentication provider. Update it there.</p>
            </div>
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 w-full">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-1">
              <MonitorSmartphone className="w-5 h-5 text-slate-600" />
            </div>
            <div className="w-full">
              <h3 className="font-bold text-[var(--color-brand-ink)] mb-1">Active sessions</h3>
              <p className="text-sm text-[var(--color-brand-slate)] mb-4">Devices currently signed into your account.</p>
              
              <div className="bg-slate-50 rounded-xl border border-[var(--color-brand-border)] p-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white border border-[var(--color-brand-border)] flex items-center justify-center shrink-0 shadow-sm">
                  <MonitorSmartphone className="w-5 h-5 text-[var(--color-brand-teal)]" />
                </div>
                <div>
                  <div className="font-bold text-sm text-[var(--color-brand-ink)]">Chrome - Mac device</div>
                  <div className="text-xs text-[var(--color-brand-slate)] mt-0.5">Seattle, United States · <span className="text-green-600 font-medium">Last active just now</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Language */}
      <section>
        <h3 className="font-bold text-[var(--color-brand-ink)] mb-4">System language</h3>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-[var(--color-brand-slate)] uppercase tracking-wider mb-2">Interface language</label>
            <select className="w-full px-4 py-3 border border-[var(--color-brand-border)] rounded-xl focus:outline-none focus:border-green-500 bg-white">
              <option>English</option>
              <option>Norwegian</option>
              <option>Swedish</option>
            </select>
          </div>
          <Button variant="primary" className="bg-green-500 hover:bg-green-600">Save changes</Button>
        </div>
      </section>

      {/* Danger Zone */}
      <section>
        <div className="border border-red-200 bg-red-50/30 rounded-2xl p-6">
          <h3 className="font-bold text-red-600 flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5" /> DANGER ZONE
          </h3>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="font-bold text-[var(--color-brand-ink)] mb-1">Delete your account</div>
              <p className="text-sm text-[var(--color-brand-slate)] max-w-lg">
                Permanently delete your account and all associated data — campaigns, leads, mailboxes and analysis history. You'll have 30 days to change your mind before everything is erased.
              </p>
            </div>
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 shrink-0">
              Delete account
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
