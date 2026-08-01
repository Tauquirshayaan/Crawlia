# Running Your First Campaign

Learn how to set up and launch your first Smart Outreach campaign — from uploading leads to watching replies come in. This walkthrough takes you from start to finish, including how to handle edge cases and monitor your results.

![Choosing campaign type when creating a new campaign](images/campaign-create-mode-select.png)

## What you'll need before starting

Have these ready to go:

- At least one connected mailbox showing a green "Connected" badge (Gmail, Outlook, or SMTP)
- At least 1 credit in your account (new accounts receive 20 free credits)
- A CSV file or Google Sheet with at minimum a website URL column and an email address column
## Creating your campaign

In the left sidebar, click "Campaigns" to open the campaigns list. In the top-right corner, click the green "+ New campaign" button. You'll see two campaign types:

- Smart Outreach — Swokei visits each prospect's website, analyzes it, and writes a personalized cold email based on what it finds. This is the core Swokei workflow and costs 1 credit per successfully analyzed lead.
- General Outreach — you write the email template, Swokei handles sending and tracking. No website analysis, no credits used.
Select "Smart Outreach" and click "Continue" to begin.

## Adding your leads

The wizard opens the Leads step with three options: CSV, Google Sheets, or Lead Library. Choose one:

### Uploading a CSV

Click the upload area or drag your CSV file onto it. Swokei reads the file and displays a column mapping screen. Match your CSV columns to Swokei fields — at a minimum, map Website and Email. You can also map First Name, Company Name, and other fields if your CSV includes them. Click "Continue" when done.

### Using Google Sheets

Click "Connect Google Sheets". Authorize Google access when prompted, then paste your spreadsheet URL. Select the sheet tab you want to use, then map your columns the same way as you would with CSV.

### Using Lead Library (automatic lead discovery)

Enter a city and industry — Swokei automatically discovers local businesses in that category. Browse and select the leads you want, then click "Continue". All fields are pre-mapped for you.

After selecting your leads, you'll see a review screen showing the total count and flagging any rows with missing email addresses or websites. Fix any issues or click "Continue" to proceed.

## Choosing your language and setting rules

Next, the wizard asks what language your emails should be written in. Click your preferred language (English, Norwegian, Swedish, Danish, German, French, Spanish, and more) — the wizard advances automatically.

You'll then move to the Rules step, which controls how Swokei handles edge cases. Work through each setting:

### Minimum website score

Swokei scores each website from 1–10 based on design quality. Use the − and + buttons to set a threshold. Then decide: should leads with sites above that score be "Excluded" (skipped) or should you "Write anyway" (contact them regardless)? This is useful if you want to focus on businesses with poorly designed websites — they're more likely to need your help.

### Unreachable websites

Some websites in your list may be offline or blocked. Choose what to do: "Exclude lead" (keep in the list but skip), "Delete" (remove permanently), or "Fallback email" (send a pre-written generic email instead of an AI-personalized one). Note: unreachable sites don't charge a credit.

### Leads with no website

If a lead has no website URL, decide whether to "Exclude lead" or send a "Fallback email".

### Email goal and personalization

Choose your primary call to action. Swokei uses this to shape the email closer:

- "Offer a free mockup" — AI ends by offering a free concept or design preview
- "Book a discovery call" — AI ends by suggesting a quick introductory call
- "Just start a conversation" — softer close focused on opening dialogue
Below that, you can optionally add your name, company, and location — these details will be referenced in the emails Swokei generates. Fill in what you'd like included or skip it. Scroll to the bottom and click "Continue".

## Naming your campaign and setting the subject line

The Review step has three fields in sequence:

- Campaign name — an internal label (leads won't see this). Press Enter or click the arrow to move on.
- Email subject line — the subject all emails in this campaign will use. You can add dynamic variables like {first_name} or {company_name} by clicking the "Variables" button. Press Enter to proceed.
- Overview — an optional summary of your campaign settings. Review for accuracy and adjust if needed.
## Sending your campaign

After review, you'll see a "Send from" dropdown. Select the connected mailbox you want to send from, then click the green "Launch campaign" button.

## Monitoring progress and replies

After launching, you're taken to the campaign detail page. Watch each lead's status update in real time as Swokei analyzes websites and generates emails:

- Analyzing — visiting and analyzing the website
- Generating — writing the personalized email
- Ready — email generated and queued to send
- Sent — email successfully delivered
- Failed — something went wrong (hover the status to see details)
- Skipped — website couldn't be analyzed (no credit charged)
Processing 10–20 leads usually takes a few minutes. Larger batches (50+ leads) can take 20–30 minutes as analysis and generation run in parallel.

Once emails are sent, replies start landing in your Inbox. Go to the Inbox section in the left sidebar — you'll see all inbound replies, automatically classified as Interested, Not Interested, Auto-reply, and more. Interested replies are highlighted at the top. Click any reply to read it in full, add CRM notes, or book a meeting from the side panel.

ON THIS PAGE

