# Adding Leads: CSV & Google Sheets

Every campaign starts with a lead list — a set of prospects with their website URL and email address. Swokei accepts CSV files and live Google Sheet connections, and includes optional fields to boost email personalization.

![Campaign detail page showing the lead table](images/campaign-detail-loaded.png)

## What information you need

Every lead requires at minimum:

- Website — the prospect's website URL (can be https://example.com, example.com, or just example.com — Swokei normalizes them)
- Email — the recipient's email address in standard format (name@domain.com)
Beyond these two required fields, you can include optional fields that Swokei uses to personalize emails and store context:

## Uploading a CSV file

During campaign creation, you'll see an upload area on the Leads step. Click it or drag your CSV file onto it. Swokei then displays a column mapping screen where you match your CSV's columns to Swokei fields. At minimum, map Website and Email. You can leave optional fields blank if they're not in your CSV. After confirming the mapping, Swokei shows a preview of the first few rows — confirm and continue to the next step.

### CSV formatting guidelines

- Use comma-separated values with UTF-8 encoding (standard CSV format)
- Include a header row in the first row — column names don't need to match Swokei field names exactly; you'll map them manually
- Websites can include or omit https:// — Swokei normalizes them automatically
- Email addresses should be correctly formatted
- Maximum file size is 10 MB. For very large lead lists (several thousand), split them into batches of 500–1000 leads each
## Connecting a Google Sheet

If your leads are in Google Sheets, click "Connect Google Sheet" during campaign creation. Swokei will ask for authorization to access your Google Drive (read-only), then ask you to paste the URL of your spreadsheet. Select which sheet tab you want to use if your file has multiple tabs, then map columns the same way as you would with a CSV file.

## How many leads can you add?

There's no hard limit on leads per campaign, but here are practical factors to consider:

- Each lead in Smart Outreach costs 1 credit — verify you have enough credits before launching (you can see your credit balance at the top of the app)
- Larger campaigns take longer to process. Analysis and email generation happen in parallel, but processing 500+ leads can take an hour or more depending on server load
- For best email deliverability, Swokei automatically spreads sending across multiple days based on your mailbox's daily sending limit, so don't worry about overwhelming your sender reputation
## Adding leads to a running campaign

After a campaign has launched, you can add more leads from the campaign detail page. Click the "Add leads" button, then upload a new CSV or connect another sheet. These new leads go through the same analysis → email generation → send queue as the original batch. Credits are charged for the new leads when you confirm.

## Don't have a lead list yet?

Swokei includes a built-in lead finder. Go to Prospects in the sidebar, select a city and industry, and Swokei will automatically discover local businesses in that category. You can browse the results, select the ones you want, and add them directly to a campaign. This is a fast way to build a targeted list without needing to source leads externally.

ON THIS PAGE

