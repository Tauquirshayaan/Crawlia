"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

export function SettingsProfileClient({ user, workspace }: { user: any, workspace: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    accountType: workspace.tier === "FREE" ? "Individual" : "Company", // Or another field
    businessName: workspace.name || "",
    companySize: workspace.companySize || "Select size",
    location: workspace.location || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Profile saved successfully");
        router.refresh();
      } else {
        alert("Failed to save profile");
      }
    } catch (e) {
      console.error(e);
      alert("Error saving profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Profile Settings */}
      <div>
        <h2 className="text-lg font-bold text-[var(--color-brand-ink)] mb-1">Profile settings</h2>
        <p className="text-sm text-green-700 bg-green-50 px-3 py-1.5 rounded-md mb-6 font-medium inline-block flex items-center gap-2">
          💡 Fill this out to get warmer outreach. The AI uses these values to naturally introduce you, your company, and context in every email it writes.
        </p>

        <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-bold text-[var(--color-brand-ink)] mb-2">First name</label>
            <input name="firstName" value={formData.firstName} onChange={handleChange} type="text" className="w-full px-4 py-3 border border-[var(--color-brand-border)] rounded-xl focus:outline-none focus:border-green-500 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-bold text-[var(--color-brand-ink)] mb-2">Last name</label>
            <input name="lastName" value={formData.lastName} onChange={handleChange} type="text" className="w-full px-4 py-3 border border-[var(--color-brand-border)] rounded-xl focus:outline-none focus:border-green-500 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-bold text-[var(--color-brand-ink)] mb-2">Email address</label>
            <input type="email" value={user.email} disabled className="w-full px-4 py-3 border border-[var(--color-brand-border)] rounded-xl bg-slate-50 text-slate-500" />
            <p className="text-xs text-slate-500 mt-2">Contact support to change your email.</p>
          </div>
          <div>
            <label className="block text-sm font-bold text-[var(--color-brand-ink)] mb-2">Role</label>
            <input type="text" value={workspace.role} disabled className="w-full px-4 py-3 border border-[var(--color-brand-border)] rounded-xl bg-slate-50 text-slate-500" />
          </div>
          <div>
            <label className="block text-sm font-bold text-[var(--color-brand-ink)] mb-2">Membership</label>
            <input type="text" value={workspace.tier} disabled className="w-full px-4 py-3 border border-[var(--color-brand-border)] rounded-xl bg-slate-50 text-slate-500" />
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-[var(--color-brand-ink)] mb-1">Personal information</h2>

        <div className="mb-6 mt-4">
          <label className="block text-sm font-bold text-[var(--color-brand-ink)] mb-2">Account type</label>
          <div className="flex bg-slate-100 rounded-lg p-1 inline-flex">
            <button 
              className={`px-4 py-1.5 rounded-md text-sm font-bold shadow-sm ${formData.accountType === "Individual" ? "bg-white text-[var(--color-brand-ink)]" : "text-[var(--color-brand-slate)] hover:text-[var(--color-brand-ink)]"}`}
              onClick={() => setFormData(prev => ({...prev, accountType: "Individual"}))}
            >
              Individual
            </button>
            <button 
              className={`px-4 py-1.5 rounded-md text-sm font-bold shadow-sm ${formData.accountType === "Company" ? "bg-white text-[var(--color-brand-ink)]" : "text-[var(--color-brand-slate)] hover:text-[var(--color-brand-ink)]"}`}
              onClick={() => setFormData(prev => ({...prev, accountType: "Company"}))}
            >
              Company
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
            <label className="block text-sm font-bold text-[var(--color-brand-ink)] mb-2">Business / Studio name</label>
            <input name="businessName" value={formData.businessName} onChange={handleChange} type="text" placeholder="e.g. Acme Design Studio" className="w-full px-4 py-3 border border-[var(--color-brand-border)] rounded-xl focus:outline-none focus:border-green-500 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-bold text-[var(--color-brand-ink)] mb-2">Company size</label>
            <select name="companySize" value={formData.companySize} onChange={handleChange} className="w-full px-4 py-3 border border-[var(--color-brand-border)] rounded-xl focus:outline-none focus:border-green-500 bg-white text-slate-500">
              <option>Select size</option>
              <option>1-10</option>
              <option>11-50</option>
              <option>51-200</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-[var(--color-brand-ink)] mb-2">Location</label>
            <input name="location" value={formData.location} onChange={handleChange} type="text" placeholder="City, Country" className="w-full px-4 py-3 border border-[var(--color-brand-border)] rounded-xl focus:outline-none focus:border-green-500 bg-white" />
          </div>
        </div>
        <div className="flex justify-end border-b border-[var(--color-brand-border)] pb-8 mb-8 mt-6">
          <Button variant="primary" className="bg-green-500 hover:bg-green-600 px-8" onClick={handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </>
  );
}
