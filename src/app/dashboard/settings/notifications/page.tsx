import { Volume2 } from "lucide-react";

export default function NotificationsSettingsPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
      
      <section>
        <div className="mb-6">
          <h2 className="font-bold text-[var(--color-brand-ink)]">Reply notifications</h2>
          <p className="text-sm text-[var(--color-brand-slate)]">Get notified whenever a contact replies to your profile.</p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-bold text-[var(--color-brand-ink)]">All replies</div>
              <div className="text-sm text-[var(--color-brand-slate)]">Get notified whenever anyone replies, regardless of outcome.</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <div className="font-bold text-[var(--color-brand-ink)]">Interested replies</div>
              <div className="text-sm text-[var(--color-brand-slate)]">Only notify me when a reply is categorized as Interested.</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <div className="font-bold text-[var(--color-brand-ink)]">Not interested replies</div>
              <div className="text-sm text-[var(--color-brand-slate)]">Notify me when a reply is categorized as Not interested.</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
        </div>
      </section>

      <div className="h-px bg-[var(--color-brand-border)]"></div>

      <section>
        <div className="mb-6">
          <h2 className="font-bold text-[var(--color-brand-ink)]">Campaign notifications</h2>
          <p className="text-sm text-[var(--color-brand-slate)]">Stay updated on batch and campaign progress.</p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-bold text-[var(--color-brand-ink)]">Batch completed</div>
              <div className="text-sm text-[var(--color-brand-slate)]">Notify me when a batch analysis or send job finishes.</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <div className="font-bold text-[var(--color-brand-ink)]">Campaign completed</div>
              <div className="text-sm text-[var(--color-brand-slate)]">Notify me when a campaign has finished sending.</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
        </div>
      </section>

      <div className="h-px bg-[var(--color-brand-border)]"></div>

      <section>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
              <Volume2 className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <div className="font-bold text-[var(--color-brand-ink)]">Notification sound</div>
              <div className="text-sm text-[var(--color-brand-slate)]">Play a soft chime when a new notification arrives.</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer mt-2">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>
      </section>

    </div>
  );
}
