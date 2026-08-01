"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Bug, Sparkles, Zap, MessageCircle, UploadCloud } from "lucide-react";

export default function FeedbackPage() {
  const [issueType, setIssueType] = useState("bug");
  const [description, setDescription] = useState("");

  const issueTypes = [
    { id: "bug", label: "Bug report", desc: "Something is broken or not working", icon: Bug },
    { id: "improvement", label: "Improvement", desc: "Something works but could be better", icon: Zap },
    { id: "feature", label: "Feature request", desc: "Something you need that doesn't exist", icon: Sparkles },
    { id: "other", label: "Other", desc: "Anything else on your mind", icon: MessageCircle },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6">
        <h1 className="text-3xl font-outfit font-bold text-[var(--color-brand-ink)]">Feedback</h1>
        <p className="text-[var(--color-brand-slate)] mt-1">Share your feedback</p>
      </div>

      <div className="max-w-3xl mx-auto">
        
        {/* Banner */}
        <div className="p-4 border border-green-200 bg-green-50/50 rounded-2xl flex items-center gap-4 mb-8">
          <div className="w-10 h-10 rounded-xl bg-green-500 text-white flex items-center justify-center font-bold">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h3 className="font-bold text-[var(--color-brand-ink)]">Earn credits for good reports</h3>
            <p className="text-sm text-[var(--color-brand-slate)]">If your report is valid and we fix it, you'll receive bonus credits automatically.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-[var(--color-brand-border)] mb-8">
          <div className="pb-3 text-sm font-bold text-green-600 border-b-2 border-green-500">Submit feedback</div>
          <div className="pb-3 text-sm font-medium text-[var(--color-brand-slate)] hover:text-[var(--color-brand-ink)] cursor-pointer">My submissions</div>
        </div>

        {/* Form */}
        <div className="space-y-8">
          
          <section>
            <h3 className="font-bold text-[var(--color-brand-ink)] mb-4">What type of issue is this?</h3>
            <div className="grid grid-cols-2 gap-4">
              {issueTypes.map(type => (
                <div 
                  key={type.id}
                  onClick={() => setIssueType(type.id)}
                  className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    issueType === type.id 
                      ? "border-green-500 bg-green-50/30 ring-1 ring-green-500" 
                      : "border-[var(--color-brand-border)] bg-white hover:border-slate-300"
                  }`}
                >
                  <div className={`mt-0.5 ${issueType === type.id ? "text-green-600" : "text-slate-400"}`}>
                    <type.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className={`font-bold ${issueType === type.id ? "text-[var(--color-brand-ink)]" : "text-[var(--color-brand-ink)]"}`}>{type.label}</div>
                    <div className="text-xs text-[var(--color-brand-slate)] mt-0.5">{type.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-2">
              <h3 className="font-bold text-[var(--color-brand-ink)]">Describe the issue</h3>
              <p className="text-xs text-[var(--color-brand-slate)]">Be specific - what happened, what you expected, and how to reproduce it.</p>
            </div>
            <textarea 
              placeholder="Walk us through the issue in detail..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full h-32 p-4 rounded-xl border border-[var(--color-brand-border)] focus:outline-none focus:border-green-500 resize-y bg-white"
            ></textarea>
            <div className="text-right text-xs font-medium text-[var(--color-brand-slate)] mt-2">
              {description.length} chars - {Math.max(0, 20 - description.length)} more needed
            </div>
          </section>

          <section>
            <h3 className="font-bold text-[var(--color-brand-ink)] mb-2 flex items-center gap-2">Screenshot <span className="text-xs font-normal text-slate-400">optional</span></h3>
            <div className="w-full border-2 border-dashed border-[var(--color-brand-border)] rounded-2xl p-8 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-green-500 transition-colors mb-4">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="font-bold text-[var(--color-brand-ink)] text-sm mb-1">Click to upload <span className="font-normal text-slate-500">or drag & drop</span></div>
              <div className="text-xs text-[var(--color-brand-slate)]">PNG, JPG, GIF - max 5MB</div>
            </div>
          </section>

          <Button variant="primary" className="bg-green-500 hover:bg-green-600 px-8 h-12 font-bold w-full md:w-auto" disabled={description.length < 20}>
            Submit feedback
          </Button>
          
        </div>

      </div>
    </div>
  );
}
