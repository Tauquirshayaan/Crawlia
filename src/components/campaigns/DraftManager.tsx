"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import { Check, X, Edit3, Sparkles, Loader2, Send, Save, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

type ToastType = { message: string; type: "success" | "error" } | null;

export function DraftManager({
  campaignId,
  initialDrafts,
}: {
  campaignId: string;
  initialDrafts: any[];
}) {
  const [drafts, setDrafts] = useState(initialDrafts);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ subject: string; body: string }>({
    subject: "",
    body: "",
  });
  const [toast, setToast] = useState<ToastType>(null);
  const router = useRouter();

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const startEdit = (draft: any) => {
    setEditingId(draft.id);
    setEditValues({ subject: draft.subject, body: draft.body });
  };

  const saveEdit = async (draftId: string) => {
    setIsProcessing(draftId);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/drafts/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "EDIT_ONE", draftId, ...editValues }),
      });
      if (res.ok) {
        setDrafts((prev) =>
          prev.map((d) =>
            d.id === draftId ? { ...d, subject: editValues.subject, body: editValues.body } : d
          )
        );
        setEditingId(null);
        showToast("Draft saved successfully");
      } else {
        showToast("Failed to save draft", "error");
      }
    } finally {
      setIsProcessing(null);
    }
  };

  const handleApprove = async (draftId: string) => {
    setIsProcessing(draftId);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/drafts/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVE_ONE", draftId }),
      });
      if (res.ok) {
        setDrafts((prev) =>
          prev.map((d) => (d.id === draftId ? { ...d, status: "APPROVED" } : d))
        );
        showToast("Draft approved");
      }
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = async (draftId: string) => {
    setIsProcessing(draftId);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/drafts/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REJECT_ONE", draftId }),
      });
      if (res.ok) {
        setDrafts((prev) =>
          prev.map((d) => (d.id === draftId ? { ...d, status: "REJECTED" } : d))
        );
        showToast("Draft rejected");
      }
    } finally {
      setIsProcessing(null);
    }
  };

  const handleApproveAll = async () => {
    setIsProcessing("ALL");
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/drafts/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVE_ALL" }),
      });
      if (res.ok) {
        setDrafts((prev) =>
          prev.map((d) => (d.status === "DRAFT" ? { ...d, status: "APPROVED" } : d))
        );
        showToast("All drafts approved");
      }
    } finally {
      setIsProcessing(null);
    }
  };

  const handleSendApproved = async () => {
    setIsSending(true);
    try {
      const res = await fetch(`/api/cron/send`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        showToast(`Successfully dispatched ${data.processed ?? 0} emails`);
        router.refresh();
      } else {
        showToast("Error sending emails: " + (data.error || "Unknown error"), "error");
      }
    } catch (err: any) {
      showToast("Failed to send: " + err.message, "error");
    } finally {
      setIsSending(false);
    }
  };

  if (drafts.length === 0) {
    return (
      <div className="text-center py-20 bg-white/50 rounded-2xl border border-dashed border-[var(--color-brand-border)]">
        <div className="w-16 h-16 bg-[var(--color-brand-pastel)] rounded-full flex items-center justify-center text-[var(--color-brand-teal)] mx-auto mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-[var(--color-brand-ink)]">No Drafts Yet</h3>
        <p className="text-[var(--color-brand-slate)] mt-2 mb-6">
          Click <strong>Generate Drafts</strong> above to run the AI pipeline for all enrolled
          leads.
        </p>
      </div>
    );
  }

  const hasUnapproved = drafts.some((d) => d.status === "DRAFT");
  const hasApproved = drafts.some((d) => d.status === "APPROVED");

  return (
    <>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold animate-in slide-in-from-bottom-4 ${
            toast.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <X className="w-4 h-4 shrink-0" />
          )}
          {toast.message}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-[var(--color-brand-slate)]">
          <span className="font-bold text-[var(--color-brand-ink)]">{drafts.length}</span> drafts
          generated &nbsp;·&nbsp;
          <span className="font-bold text-green-600">
            {drafts.filter((d) => d.status === "APPROVED").length}
          </span>{" "}
          approved
        </p>
        <div className="flex gap-3">
          {hasUnapproved && (
            <Button
              variant="secondary"
              onClick={handleApproveAll}
              disabled={isProcessing !== null}
            >
              {isProcessing === "ALL" ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Approve All
            </Button>
          )}
          {hasApproved && (
            <Button variant="primary" onClick={handleSendApproved} disabled={isSending}>
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Dispatching...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" /> Send Approved
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Draft Cards */}
      <div className="grid grid-cols-1 gap-6">
        {drafts.map((draft: any) => {
          const isEditing = editingId === draft.id;
          const isBusy = isProcessing === draft.id;

          return (
            <GlassCard key={draft.id} className="p-6">
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4 pb-4 border-b border-[var(--color-brand-border)]">
                <div className="flex-1 min-w-0 mr-4">
                  <div className="text-xs font-semibold text-[var(--color-brand-slate)] uppercase tracking-wide mb-1">
                    To: {draft.lead?.name || draft.lead?.email || "Unknown lead"}
                    {draft.lead?.email && draft.lead?.name && (
                      <span className="normal-case font-normal ml-1 text-slate-400">
                        &lt;{draft.lead.email}&gt;
                      </span>
                    )}
                  </div>
                  {isEditing ? (
                    <input
                      value={editValues.subject}
                      onChange={(e) =>
                        setEditValues((v) => ({ ...v, subject: e.target.value }))
                      }
                      className="w-full font-bold text-[var(--color-brand-ink)] text-lg border border-[var(--color-brand-border)] rounded-lg px-3 py-1.5 focus:outline-none focus:border-green-500"
                    />
                  ) : (
                    <h3 className="font-bold text-[var(--color-brand-ink)] text-lg truncate">
                      {draft.subject}
                    </h3>
                  )}
                </div>
                <StatusPill
                  status={
                    draft.status === "APPROVED" || draft.status === "SENT"
                      ? "success"
                      : draft.status === "FAILED" || draft.status === "REJECTED"
                      ? "error"
                      : "neutral"
                  }
                >
                  {draft.status}
                </StatusPill>
              </div>

              {/* Body */}
              {isEditing ? (
                <textarea
                  value={editValues.body}
                  onChange={(e) => setEditValues((v) => ({ ...v, body: e.target.value }))}
                  rows={10}
                  className="w-full font-mono text-sm leading-relaxed text-[var(--color-brand-ink)] border border-[var(--color-brand-border)] rounded-xl p-4 focus:outline-none focus:border-green-500 resize-none"
                />
              ) : (
                <div className="bg-white/50 rounded-xl p-4 font-mono text-sm leading-relaxed text-[var(--color-brand-ink)] whitespace-pre-wrap">
                  {draft.body}
                </div>
              )}

              {/* Footer Actions */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 text-xs text-[var(--color-brand-teal)] font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Generated · {draft.lead?.websiteUrl || ""}
                </div>

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditingId(null)}
                        disabled={isBusy}
                      >
                        <X className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                        onClick={() => saveEdit(draft.id)}
                        disabled={isBusy}
                      >
                        {isBusy ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-1" />
                        ) : (
                          <Save className="w-4 h-4 mr-1" />
                        )}
                        Save
                      </Button>
                    </>
                  ) : (
                    <>
                      {draft.status !== "SENT" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="px-3"
                          onClick={() => startEdit(draft)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      )}

                      {draft.status !== "SENT" && draft.status !== "REJECTED" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleReject(draft.id)}
                          disabled={isBusy}
                        >
                          {isBusy ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-1" />
                          ) : (
                            <X className="w-4 h-4 mr-1" />
                          )}
                          Reject
                        </Button>
                      )}

                      {draft.status !== "APPROVED" &&
                        draft.status !== "SENT" &&
                        draft.status !== "REJECTED" && (
                          <Button
                            variant="secondary"
                            size="sm"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                            onClick={() => handleApprove(draft.id)}
                            disabled={isBusy}
                          >
                            {isBusy ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-1" />
                            ) : (
                              <Check className="w-4 h-4 mr-1" />
                            )}
                            Approve
                          </Button>
                        )}
                    </>
                  )}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </>
  );
}
