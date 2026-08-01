# What Happens When a Campaign Completes

A campaign moves to Completed status when every lead has either been sent their full sequence, replied, unsubscribed, or failed. Understanding what completion means helps you know what stops, what keeps working, and what to do next with your leads.

![Completed campaign showing final stats and lead statuses](images/campaign-detail-loaded.png)

## When a campaign reaches Completed status

Swokei marks a campaign as Completed when all of these conditions are met:

- Every lead has received the initial email (or was skipped due to website analysis failure)
- Every lead has either received all their follow-up emails, replied (which stops the sequence), or unsubscribed
- There are no leads still in Analyzing, Generating, or Ready status
This typically takes several weeks because emails are spread out over time. The initial email goes out first, then follow-up emails go out at their scheduled delays. A campaign with a 3-step follow-up sequence (Days 0, 4, 10, and 15) won't complete until the last lead's final follow-up has either sent or been stopped by a reply.

## What stops when a campaign completes

Automated sending ends. No more emails are sent from this campaign after it completes. Any follow-up steps that haven't fired yet are cancelled.

## What continues after a campaign completes

Reply detection keeps running. Even after a campaign completes, Swokei continues monitoring your mailbox for replies. If a lead replies weeks later, that reply appears in your Inbox and gets classified normally. Completion only stops the automated sending schedule — not reply monitoring.

All campaign data is preserved. Every lead, generated email, send timestamp, open and click event, and CRM note you added remains in your account. You can review the campaign at any time to see what emails were sent, when they were opened, and what the reply patterns looked like. This historical data is valuable for understanding what worked and what didn't.

## The three groups of leads at campaign completion

When a campaign finishes, your leads fall into three categories:

- Replied — leads who responded. These appear in your Inbox with classifications like Interested, Not Interested, Question, or Auto-reply. You can view their replies and manage any follow-up conversation from the CRM.
- No response — leads who received all emails but never replied. Most of these are genuinely not interested right now, but some may have just not been ready at the time of your campaign.
- Skipped or failed — leads who didn't receive emails because their website couldn't be analyzed (Smart Outreach) or their email bounced.
## Re-targeting leads who didn't reply

Many sales teams find that re-targeting no-response leads 3–6 months later with a fresh campaign and a different angle produces converts. Here's how:

- Open the completed campaign and view the lead table.
- Filter to show only leads with Sent status and no reply (these are your no-response leads).
- Export them as a CSV using the "Download CSV" option.
- Create a new campaign and upload the exported CSV.
- Use a different email goal, different subject line, or new angle. For example, if the first campaign highlighted design issues, try SEO or mobile performance the second time.
## Should you delete completed campaigns?

There's no need to delete campaigns once they're done. They sit in your Campaigns list with a Completed badge and take up no resources. Completed campaigns are actually valuable to keep because you can reference past performance, see what subject lines and email templates worked well, and understand reply patterns.

Only delete a campaign if you're absolutely certain you'll never need its data again. Deletion removes all lead records, send history, and analytics permanently.

## Restarting or reusing a completed campaign

You can't restart a completed campaign, but you can use it as a reference. The simplest approach is to create a new campaign and re-upload the same lead list. You can also look at the subject line, email goals, and follow-up sequence settings from the completed campaign and use them as a template for the new one.

## Adding leads to a completed campaign

Once a campaign reaches Completed status, you cannot add new leads to it. If you want to continue outreach, create a new campaign instead. This is better anyway because a fresh campaign gives you separate tracking and analytics, and you can test different email angles or timing with your new batch.

## Notifications when a campaign completes

Swokei sends an in-app notification when a campaign reaches Completed status — you'll see it in the notification bell in the top navigation. To receive this alert, make sure "Campaign completed" is enabled in Account → Notifications.

ON THIS PAGE

