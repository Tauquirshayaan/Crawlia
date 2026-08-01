import { inngest } from "./client";
import { prisma } from "@/lib/prisma";
import { preCheck, analyzeWebsite } from "@/lib/analyzer";
import { generateMessagingAngles, draftEmail } from "@/lib/llm";
import {
  sendViaMailbox,
  buildUnsubscribeUrl,
  buildEmailHtml,
  randomJitterMs,
  type MailboxCredentials,
} from "@/lib/mailer";

export const processCampaign = inngest.createFunction(
  { id: "process-campaign", triggers: [{ event: "campaign.process" }] },
  async ({ event, step }) => {
    const { campaignId } = event.data as any; // Temporary fix for typed event

    // 1. Fetch Campaign and Leads
    const campaign = await step.run("fetch-campaign", async () => {
      return await prisma.campaign.findUnique({
        where: { id: campaignId },
        include: {
          campaignLeads: {
            where: { status: "ENROLLED" },
            include: { lead: true }
          }
        }
      });
    });

    if (!campaign || campaign.campaignLeads.length === 0) {
      return { status: "No enrolled leads or campaign not found" };
    }

    const rules = campaign.rules as any || {};

    // 2. Process each lead one by one (this could be parallelized in a real production system using step.sendEvent)
    for (const campaignLead of campaign.campaignLeads) {
      const lead = campaignLead.lead;

      await step.run(`process-lead-${lead.id}`, async () => {
        try {
          // Update status to drafting
          await prisma.campaignLead.update({
            where: { id: campaignLead.id },
            data: { status: "DRAFTING" }
          });

          // Smart mode vs General Mode
          let subject = campaign.subject || "Quick question";
          let body = "";

          if (campaign.type === "SMART") {
            // Stage 1: Pre-check before spending any compute
            const check = await preCheck(lead.websiteUrl);

            if (!check.passed) {
              if (rules.unreachable === "Exclude from campaign") {
                await prisma.campaignLead.update({ where: { id: campaignLead.id }, data: { status: "EXCLUDED", preCheckStatus: check.reason, preCheckReason: check.detail } });
                return;
              } else if (rules.unreachable === "Delete lead") {
                await prisma.campaignLead.delete({ where: { id: campaignLead.id } });
                return;
              } else {
                body = rules.fallbackText || "Hi, I noticed your website was unreachable. Let me know if you need help fixing it.";
              }
            } else {
              // Stage 2 + 3: Full Playwright analysis
              const analysisResult = await analyzeWebsite(lead.websiteUrl);

              if (analysisResult.preCheckFailed) {
                // Parked/bot-wall detected at render time
                await prisma.campaignLead.update({ where: { id: campaignLead.id }, data: { status: "EXCLUDED", preCheckStatus: analysisResult.preCheckFailed } });
                return;
              }

              if (analysisResult.error) {
                if (rules.unreachable === "Exclude from campaign") {
                  await prisma.campaignLead.update({ where: { id: campaignLead.id }, data: { status: "EXCLUDED" } });
                  return;
                }
                body = rules.fallbackText || "Hi, I was looking at your website and wanted to connect.";
              } else {
                // Step A: Messaging angles
                const angles = await generateMessagingAngles(analysisResult);

                // Step B: Draft email
                const campaignPrompt = [
                  `Campaign goal: ${rules.goal || "Start a conversation"}.`,
                  `Write in: ${campaign.language || "English"}.`,
                ].join(" ");

                const drafted = await draftEmail(campaignPrompt, analysisResult, angles, {
                  name: lead.name,
                  company: lead.company,
                  segment: lead.segment,
                });
                subject = drafted.subject;
                body = drafted.body;
              }
            }
          } else {
            // General mode — use template
            body = rules.templateBody || "";
          }

          // Personalization token replacement
          body = body.replace(/{{company_name}}/g, lead.company || "your company");
          body = body.replace(/{{firstName}}/g, lead.name ? lead.name.split(" ")[0] : "there");
          body = body.replace(/{{website}}/g, lead.websiteUrl);
          subject = subject.replace(/{{company_name}}/g, lead.company || "your company");
          subject = subject.replace(/{{firstName}}/g, lead.name ? lead.name.split(" ")[0] : "there");

          // Save draft
          await prisma.emailDraft.create({
            data: {
              campaignId: campaign.id,
              leadId: lead.id,
              subject,
              body,
              status: "DRAFT",
            },
          });

          // Update status to SCHEDULED
          await prisma.campaignLead.update({
            where: { id: campaignLead.id },
            data: { status: "SCHEDULED" },
          });

        } catch (error) {
          console.error(`Failed to process lead ${lead.id}`, error);
        }
      });
    }

    return { status: "Completed processing leads" };
  }
);

// Cron job to send emails every 5 minutes
export const runCampaignSends = inngest.createFunction(
  { id: "run-campaign-sends", triggers: [{ cron: "*/5 * * * *" }] },
  async ({ step }) => {
    
    // 1. Fetch campaigns that are RUNNING and have a mailbox attached
    const campaigns = await step.run("fetch-running-campaigns", async () => {
      return await prisma.campaign.findMany({
        where: { status: "RUNNING", mailboxId: { not: null } },
        include: { mailbox: true }
      });
    });

    if (campaigns.length === 0) return { status: "No running campaigns" };

    let totalSent = 0;

    // 2. Process each campaign
    for (const campaign of campaigns) {
      if (!campaign.mailbox || campaign.mailbox.status !== "CONNECTED") continue;
      
      const mailbox = campaign.mailbox;
      
      // Check daily limit (in a real app, this should reset at midnight via another cron)
      if (mailbox.sentToday >= mailbox.dailyLimit) continue;
      
      // Fetch some drafts to send (limit to available capacity or small batch)
      const availableCapacity = mailbox.dailyLimit - mailbox.sentToday;
      const batchSize = Math.min(availableCapacity, 10); // send max 10 per 5 min per campaign to avoid bursting

      const drafts = await step.run(`fetch-drafts-${campaign.id}`, async () => {
        return await prisma.emailDraft.findMany({
          where: { campaignId: campaign.id, status: "APPROVED" },
          take: batchSize,
          include: { lead: true }
        });
      });

      if (drafts.length === 0) {
        // If no drafts left, maybe complete the campaign?
        // We can check if all leads are processed.
        const pendingLeads = await step.run(`check-pending-${campaign.id}`, async () => {
          return await prisma.campaignLead.count({
            where: { campaignId: campaign.id, status: { in: ["ENROLLED", "DRAFTING", "SCHEDULED"] } }
          });
        });

        if (pendingLeads === 0) {
          await step.run(`complete-campaign-${campaign.id}`, async () => {
            await prisma.campaign.update({ where: { id: campaign.id }, data: { status: "COMPLETED" } });
          });
        }
        continue;
      }

      // 3. Send emails via user's own mailbox (never via platform Resend key)
      await step.run(`send-emails-${campaign.id}`, async () => {
        const creds: MailboxCredentials = {
          email: mailbox.email,
          smtpHost: mailbox.smtpHost,
          smtpPort: mailbox.smtpPort,
          smtpUser: mailbox.smtpUser,
          smtpPass: mailbox.smtpPass,
        };

        let successCount = 0;

        for (const draft of drafts) {
          if (!draft.lead.email) continue;

          try {
            const unsubscribeUrl = buildUnsubscribeUrl(draft.lead.email);
            const html = buildEmailHtml(draft.body, unsubscribeUrl);

            const { messageId } = await sendViaMailbox(creds, {
              to: draft.lead.email,
              subject: draft.subject,
              text: `${draft.body}\n\nTo unsubscribe, visit: ${unsubscribeUrl}`,
              html,
              unsubscribeUrl,
            });

            await prisma.send.create({
              data: {
                draftId: draft.id,
                mailboxId: mailbox.id,
                messageId,
                status: "SENT",
                sentAt: new Date(),
              }
            });

            await prisma.emailDraft.update({
              where: { id: draft.id },
              data: { status: "SENT" }
            });

            const campaignLead = await prisma.campaignLead.findUnique({
              where: { campaignId_leadId: { campaignId: campaign.id, leadId: draft.leadId } }
            });

            if (campaignLead) {
              await prisma.campaignLead.update({
                where: { id: campaignLead.id },
                data: { status: "SENT" }
              });
            }

            successCount++;

            // Random jitter between sends to avoid machine-timed traffic patterns
            await randomJitterMs(500, 3000);
          } catch (error) {
            console.error(`Failed to send email draft ${draft.id}`, error);
            await prisma.send.create({
              data: {
                draftId: draft.id,
                mailboxId: mailbox.id,
                status: "FAILED",
              }
            });
          }
        }

        // Update mailbox sent count
        if (successCount > 0) {
          await prisma.mailbox.update({
            where: { id: mailbox.id },
            data: { sentToday: { increment: successCount } }
          });
        }
        
        totalSent += successCount;
      });
    }

    return { status: `Processed sending cycle. Sent: ${totalSent}` };
  }
);
