# Staying Out of the Spam Folder

Deliverability determines campaign success. Emails that land in spam produce zero replies. This guide covers every factor you control to keep your outreach in the inbox: email authentication, sending practices, list quality, email content, and when to seek help if things go wrong.

![Mailbox warmup tab showing sender reputation health](images/mailbox-drawer-warmup.png)

## Step 1: Warm up your mailbox first

This is the single most important step. Before sending any cold outreach, run warmup on your mailbox for at least 2–3 weeks. A fresh or long-dormant address that suddenly sends 50+ cold emails per day will be flagged immediately as suspicious. Warmup gradually builds sender reputation by starting with small volume and ramping up over 5 weeks. See the Email warmup guide for full details.

## Step 2: Set up email authentication (SPF, DKIM, DMARC)

Email authentication proves to inbox providers that your emails are legitimate. Without it, Gmail, Outlook, and other major providers will filter your emails to spam or reject them outright.

### SPF (Sender Policy Framework)

An SPF record in your domain's DNS tells the world which mail servers are allowed to send email from your domain. If you send from Google Workspace or Microsoft 365, your provider configures this automatically. For custom SMTP setups, you need to add an SPF record manually to your DNS.

Example SPF record: v=spf1 include:_spf.google.com ~all

### DKIM (DomainKeys Identified Mail)

DKIM adds a cryptographic signature to your emails proving they haven't been tampered with in transit. Gmail and Microsoft 365 set this up automatically when you connect via OAuth. For SMTP connections, check your email hosting provider's DNS settings—they usually have a DKIM configuration section.

### DMARC (Domain-based Message Authentication, Reporting, and Conformance)

DMARC ties SPF and DKIM together and tells inbox providers what to do when a message fails authentication. A basic DMARC record:

v=DMARC1; p=none; rua=mailto:admin@yourdomain.com

Start with p=none to monitor without rejecting mail. Once you've confirmed SPF and DKIM are working correctly, tighten it to p=quarantine or p=reject.

## Step 3: Send from a personal, named email address

Always send from a personal address like ahmed@youragency.com, not a role address like info@youragency.com, noreply@youragency.com, or contact@youragency.com. Inbox providers assign significantly more trust to personal named addresses. A role address will have a harder time reaching inboxes even if everything else is configured correctly.

## Step 4: Ramp campaign volume gradually

Even a fully warmed address shouldn't jump from zero to 500 emails per day overnight. Gradually increase campaign volume week by week to signal natural account growth to inbox providers:

- Week 1: 10–20 emails per day
- Week 2: 30–50 emails per day
- Week 3+: gradually increase to your daily sending limit
This gradual ramp, combined with warmup, gives you the best chance of sustained inbox placement.

## Step 5: Keep your lead list clean

High bounce rates (emails sent to invalid addresses) signal to inbox providers that you have a poor list quality, which damages your sender reputation. Before launching campaigns:

- Remove obviously invalid or test addresses (test@, example@)
- Remove addresses from domains that no longer exist or are obviously typos
- For large lists, consider running them through an email validation service like ZeroBounce or NeverBounce
Swokei automatically stops sending to addresses that hard-bounce, but the reputation damage occurs during the bouncing attempt. A list with 5–10% invalid addresses will harm your sender reputation significantly.

## Step 6: Write email content that doesn't trigger spam filters

Email content affects spam filter scores. Avoid these common red flags:

- All-caps text or excessive exclamation points ("FREE!!! LIMITED TIME!!! GUARANTEED!!!")
- Spam trigger words like "guaranteed," "no risk," "act now," "100% free," "click here"
- Too many links (0–1 per email is ideal for cold outreach)
- Large images or heavily styled HTML templates
- Sender name that doesn't match the sending domain (e.g., "John Smith" from "noreply@generic-company.com")
Swokei generates plain-text-style emails that read like personal messages from a real person. This format is intentional—it significantly improves deliverability compared to styled HTML newsletters.

## Step 7: Respect unsubscribes and opt-outs

Swokei automatically pauses follow-up sequences when someone replies to you. If someone explicitly asks to be removed from your list, mark their reply as "Unsubscribed" and Swokei will stop all sequences to that address. Continuing to email someone who has opted out is a compliance violation and a major deliverability killer—providers flag and penalize senders who ignore unsubscribe requests.

## Step 8: Distribute volume across multiple mailboxes for scale

If you're running high-volume outreach, spread sending across 2–3 different mailboxes (ideally on different domains). This reduces the risk that any single address gets rate-limited or temporarily filtered. If one mailbox hits a sending cap, your others can continue, and you maintain overall campaign momentum.

## Detecting spam placement issues

Several signals indicate your emails may be landing in spam:

- Sudden drop in open rates: This is the clearest sign. If your open rate was 15% and suddenly drops to 2%, spam placement is likely.
- Spike in bounces: A sudden increase in bounce-back errors suggests filtering.
- Increase in "Unsubscribed" classifications: When many recipients mark emails as spam instead of replying, it shows up here.
- Direct feedback: A recipient tells you an email went to their spam folder.
## Troubleshooting: I think my emails are in spam

If you suspect spam placement:

- Stop that campaign immediately. Don't continue sending to the affected list.
- Run a test at mail-tester.com to check your SPF, DKIM, DMARC, and content score.
- Review the campaign's Analysis history for bounce patterns or error messages.
- Check your mailbox's warmup status in the Mailboxes section—is it still actively warming up or has it regressed?
- Clean your lead list for invalid addresses and re-validate if necessary.
- Let the mailbox rest for 1–2 weeks, then restart with very low campaign volume (5–10 emails per day) while warmup continues.
## Unsubscribe links and compliance

Swokei automatically includes an unsubscribe mechanism in all outbound emails as required by CAN-SPAM, GDPR, and similar regulations. When a recipient clicks unsubscribe, their address is added to a workspace-wide suppression list and no further emails are sent from any campaign to that address. This is non-negotiable for compliance and for maintaining your sender reputation.

ON THIS PAGE

