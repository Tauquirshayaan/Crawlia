import { inngest } from "./client";
import { prisma } from "@/lib/prisma";
import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import { classifyReplyIntent } from "@/lib/llm";

export const runImapSync = inngest.createFunction(
  { id: "run-imap-sync", triggers: [{ cron: "*/15 * * * *" }] }, // Run every 15 minutes
  async ({ step }) => {
    // 1. Fetch all connected mailboxes that have IMAP details
    const mailboxes = await step.run("fetch-mailboxes", async () => {
      return prisma.mailbox.findMany({
        where: {
          status: "CONNECTED",
          imapHost: { not: null },
          imapUser: { not: null },
          imapPass: { not: null }
        },
        select: {
          id: true,
          email: true,
          imapHost: true,
          imapPort: true,
          imapUser: true,
          imapPass: true,
          workspaceId: true
        }
      });
    });

    for (const mailbox of mailboxes) {
      await step.run(`sync-mailbox-${mailbox.id}`, async () => {
        const client = new ImapFlow({
          host: mailbox.imapHost!,
          port: mailbox.imapPort || 993,
          secure: true,
          auth: {
            user: mailbox.imapUser!,
            pass: mailbox.imapPass!
          },
          logger: false
        });

        try {
          await client.connect();
          let lock = await client.getMailboxLock('INBOX');
          try {
            // Search for unseen messages
            const messages = await client.search({ seen: false });
            
            if (messages && Array.isArray(messages)) {
              for (const seq of messages) {
                const msg = await client.fetchOne(seq, { source: true, uid: true });
                if (msg && msg.source) {
                  const parsed = await simpleParser(msg.source);
                  
                  // Extract threading info (In-Reply-To)
                  const inReplyTo = parsed.inReplyTo;
                  
                  // If it's a reply to one of our sends
                  if (inReplyTo) {
                    // Find the Send record
                    const sendRecord = await prisma.send.findFirst({
                      where: { messageId: inReplyTo },
                      include: { draft: true }
                    });

                    if (sendRecord) {
                      const leadId = sendRecord.draft.leadId;
                      
                      // Classify reply using the shared Gemini-based classifier
                      const rawContent = parsed.text || "";
                      let category = "INFO_REQUEST";
                      let confidence = 0.5;

                      try {
                        const classification = await classifyReplyIntent(rawContent);
                        category = classification.intent;
                        confidence = classification.confidence;
                      } catch (e) {
                        console.error("Failed to categorize reply", e);
                      }

                      // Save Reply
                      await prisma.reply.create({
                        data: {
                          leadId,
                          intent: category,
                          confidence,
                          rawContent
                        }
                      });

                      // Update Lead Status
                      await prisma.lead.update({
                        where: { id: leadId },
                        data: { status: "REPLIED" }
                      });
                    }
                  }
                }
                
                // Mark as seen so we don't process it again
                await client.messageFlagsAdd(seq, ['\\Seen']);
              }
            }
          } finally {
            lock.release();
          }
        } catch (e) {
          console.error(`IMAP sync failed for ${mailbox.email}`, e);
        } finally {
          await client.logout();
        }
      });
    }

    return { synced: mailboxes.length };
  }
);
