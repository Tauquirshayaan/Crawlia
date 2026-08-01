"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Sparkles, Loader2, PlayCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

type Stage = "idle" | "starting" | "processing" | "done" | "error";

export function RunPipelineButton({
  campaignId,
  status,
}: {
  campaignId: string;
  status: string;
}) {
  const [stage, setStage] = useState<Stage>("idle");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleRun = async () => {
    setStage("starting");
    setMessage("Starting AI pipeline...");

    try {
      const res = await fetch(`/api/campaigns/${campaignId}/execute`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Execution failed");

      if (data.enrolledCount === 0) {
        setStage("done");
        setMessage("No enrolled leads. Add leads to this campaign first.");
        return;
      }

      setStage("done");
      setMessage(`AI Pipeline dispatched for ${data.enrolledCount} leads! They will appear below when ready.`);
      router.refresh();
    } catch (err: any) {
      setStage("error");
      setMessage(err.message || "Something went wrong.");
    }
  };

  const isRunning = stage === "starting" || stage === "processing";

  return (
    <div className="flex flex-col items-end gap-2">
      <Button
        variant="ai"
        onClick={handleRun}
        disabled={isRunning || status === "COMPLETED"}
      >
        {isRunning ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            {stage === "starting" ? "Starting..." : `Processing...`}
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Drafts
          </>
        )}
      </Button>

      {message && (
        <div
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border max-w-xs text-right ${
            stage === "done"
              ? "bg-green-50 text-green-700 border-green-200"
              : stage === "error"
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-slate-50 text-slate-600 border-slate-200"
          }`}
        >
          {stage === "done" && <CheckCircle2 className="w-3 h-3 shrink-0" />}
          {stage === "error" && <AlertCircle className="w-3 h-3 shrink-0" />}
          {isRunning && <Loader2 className="w-3 h-3 animate-spin shrink-0" />}
          {message}
        </div>
      )}
    </div>
  );
}
