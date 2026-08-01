# Mailbox Connection Errors

Find your error message below and follow the numbered steps to fix it. If you're not seeing a specific error message and the mailbox just shows a red badge, jump to the general reconnection steps.

![Mailboxes list showing connection status badges](images/mailboxes-list.png)

## Gmail errors

### "Authentication failed" or "Invalid credentials"

The OAuth token has expired or been revoked. To fix it:

- In the sidebar, click "Mailboxes".
- Click on the Gmail mailbox showing the error.
- In the settings drawer, click the red "Re-authorize" button.
- A Google pop-up opens. Select your Google account and click "Allow".
- The pop-up closes and the mailbox badge turns green. Your campaigns resume automatically.
### "This app isn't verified" — Google warning screen

This is Google's standard warning for third-party apps that request Gmail send permissions. It's safe to proceed:

- On the Google warning screen, click "Advanced" (small link at the bottom-left of the page).
- Click "Go to Swokei (unsafe)". Despite the label, this is safe.
- The normal permissions screen appears. Click "Allow".
### "Access blocked: your organization doesn't allow access"

Your Google Workspace admin has restricted third-party app access:

- Option A — Ask your admin: Your Google Workspace admin can whitelist Swokei in the Admin Console under Security → API Controls → App Access Control. Once approved, click "Re-authorize" to reconnect.
- Option B — Use SMTP instead: In the "Connect a mailbox" modal, choose "Domain authentication" and connect using a Gmail App Password. No admin approval needed. See Connecting via SMTP.
### Gmail SMTP: "Authentication failed" when using your normal password

Gmail SMTP requires an App Password — not your regular login password. To generate one:

- Go to myaccount.google.com → Security → 2-Step Verification. (2-Step Verification must be enabled first.)
- Scroll to the bottom and click "App passwords".
- Type "Swokei" in the app name field and click "Create".
- Google shows a 16-character password. Copy it — you can't see it again after closing.
- Back in Swokei, open the mailbox settings drawer and click "Re-authorize". Enter the 16-character App Password in the password field (not your Gmail login password) and click "Connect".
## Outlook errors

### "Need admin approval"

- Option A — Ask your IT admin: Your admin can approve Swokei in the Azure Active Directory admin center under Enterprise Applications. Once approved, click "Re-authorize" in the Swokei mailbox drawer.
- Option B — Use SMTP: Go to "Add mailbox" → "Domain authentication" and connect using an Outlook App Password. See Connecting via SMTP for the exact steps.
### "AADSTS50076" or "conditional access policy" error

Your organization's Microsoft 365 conditional access policies are blocking OAuth from unmanaged devices. Use SMTP instead:

- In the sidebar, click "Mailboxes".
- Click on the affected mailbox, scroll to the bottom of the settings drawer, and click "Delete mailbox". Confirm.
- Click "Add mailbox", choose "Domain authentication", and connect using your Outlook address and an App Password from account.microsoft.com.
## SMTP errors

### "Connection refused" or connection times out

- Click on the mailbox in the Mailboxes list to open its settings drawer.
- Click "Re-authorize" and then "Advanced settings".
- Try switching the port — if you're on 465, change to 587, or vice versa.
- Make sure the SSL toggle matches: SSL on for port 465, SSL off for port 587.
- Click "Connect" to test the new settings.
### "535 Authentication failed" with SMTP

- Check if your provider requires an App Password — Gmail, Outlook with 2FA, iCloud, and Yahoo all do. Your normal login password won't work for SMTP on these providers.
- Generate an App Password from your email provider's account security settings.
- In Swokei, open the mailbox settings drawer, click "Re-authorize", and enter the App Password in the password field.
- Click "Connect" to test.
### Emails sending fine but replies not appearing in Swokei

Reply detection via SMTP requires IMAP to be enabled on your account:

- Gmail: Open Gmail in a browser → click the gear icon → See all settings → Forwarding and POP/IMAP tab → Enable IMAP → Save Changes.
- Outlook.com: Go to Outlook Settings → Mail → Sync email → make sure IMAP is set to enabled.
- Wait 2–3 minutes, then check Replies in Swokei.
## General steps when you see a red badge but no specific error

- In the sidebar, click "Mailboxes".
- Click on the mailbox with the red or yellow warning badge.
- Read the error message shown at the top of the settings drawer — it usually describes what went wrong.
- Click the red "Re-authorize" button.
- Complete the authorization flow: Google/Microsoft pop-up for OAuth providers, or re-enter your password for SMTP.
- The badge turns green. Any campaigns that were affected will resume sending automatically.
## Understanding "Connected" status

Your mailbox might show a green "Connected" badge even when emails are still failing to send. A "Connected" badge means the OAuth or SMTP credentials are valid and Swokei can authenticate — it doesn't guarantee every send will succeed. Common reasons sends still fail despite a connected status include hitting your mailbox provider's daily sending limit (check their documentation for your daily cap), the recipient's email server rejecting the message (invalid address, their domain has a strict policy), or your account being flagged by the provider for suspicious activity. When investigating failed sends, check Analysis history for specific error messages — those errors are usually clearer than the mailbox connection status alone.

## How to reconnect a mailbox

Open the Mailboxes page, click on the affected mailbox to open its settings drawer, and look for a "Re-authorize" or "Reconnect" button. For Gmail and Outlook OAuth, this opens the authorization flow again — complete it and the connection is restored. For SMTP, update the credentials (password or App Password) in the SMTP fields. After reconnecting, running campaigns will automatically resume sending from that mailbox.

ON THIS PAGE

