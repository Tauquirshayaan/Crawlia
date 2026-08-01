import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { processCampaign, runCampaignSends } from "@/inngest/functions";
import { runImapSync } from "@/inngest/imap";

// Create an API that serves the background functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    processCampaign,
    runCampaignSends,
    runImapSync
  ],
});
