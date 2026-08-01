# Connecting an Outlook Account

Swokei connects to personal Outlook accounts (@outlook.com, @hotmail.com, @live.com) and business Microsoft 365 accounts using Microsoft OAuth—a secure method that never requires you to share your password with Swokei. Once connected, you can send campaigns through that mailbox immediately.

## Which Outlook accounts work with Swokei

Swokei supports two types of Microsoft accounts via OAuth:

- Personal Microsoft accounts — @outlook.com, @hotmail.com, @live.com, @msn.com
- Microsoft 365 Business / Enterprise — your work email hosted on Exchange Online (e.g., yourname@yourcompany.com)
If your organization runs Exchange on its own servers rather than in Microsoft's cloud, OAuth won't work. In that case, use the SMTP/IMAP connection method instead, which is covered in Connecting via SMTP.

## Connecting your Outlook account to Swokei

- In the Swokei sidebar, click "Mailboxes".
- Click the green "Add mailbox" button to open the "Connect a mailbox" modal.
- Click "Connect Outlook". A Microsoft login pop-up window opens.
- Enter your Microsoft email address, click "Next", then enter your password and click "Sign in".
- If your account has two-step verification enabled, complete the verification step via your authenticator app or SMS when prompted.
- A permissions screen appears showing what Swokei is requesting access to. Click "Accept" to proceed.
- The pop-up closes and you're returned to Swokei. Your mailbox appears in the Mailboxes list within a few seconds, marked with a green "Connected" badge.
![Connect a mailbox modal](images/mailboxes-connect-modal.png)

## Personalizing your mailbox settings

After connecting, click on your new mailbox in the Mailboxes list to open its settings drawer. In the "General" tab, you can customize how your emails appear to recipients:

- Update the "Display name" field to your preferred name, then click "Save". This is what recipients see in their inbox.
- Choose a signature option from the "Signature" dropdown: use your existing Outlook signature, create a custom one, or send without a signature. Click "Save" to apply your choice.
## Microsoft 365 organizations and admin approval

Many Microsoft 365 Business and Enterprise tenants are configured to require IT administrator approval before users can connect third-party apps like Swokei. During the OAuth login flow, you might see a screen stating "Need admin approval" or "Your organization's policies prevent you from completing this action." This means your IT admin hasn't yet approved Swokei for your organization.

### Getting IT approval

Ask your IT admin to approve Swokei in the Microsoft Azure Active Directory admin center under Enterprise Applications. They'll search for "Swokei" and grant tenant-wide admin consent. Once done, you can reconnect immediately without any further action.

### Bypassing admin approval with SMTP

If waiting for IT approval isn't practical, you can connect using SMTP with an App Password instead. This method bypasses OAuth entirely and doesn't require admin approval. From the "Add mailbox" modal, click "Domain authentication" and follow the SMTP instructions for Outlook. Full steps are in Connecting via SMTP.

## Handling conditional access and advanced security policies

Some Microsoft 365 organizations enforce Conditional Access policies that prevent OAuth connections from devices outside the corporate network or from unmanaged personal computers. If you encounter error codes like AADSTS50076, AADSTS50158, or messages mentioning "conditional access policy," this is what's happening.

The SMTP connection method (described above) often works in these situations because it uses a different authentication path that isn't subject to the same conditional access rules. Try that approach if OAuth is blocked by your organization's security policies.

## Daily sending volume limits

Microsoft enforces daily sending limits based on your account type:

- Personal Outlook.com accounts: approximately 300 recipients per day. This limit is set by Microsoft and cannot be increased.
- Microsoft 365 Business Basic, Standard, or Premium: up to 10,000 recipients per day (though always warm up your sending gradually before approaching high volumes).
If you're running serious cold outreach campaigns, a Microsoft 365 Business account will significantly outperform a personal Outlook.com account. Combined with proper email warmup, you can scale your volume much higher.

## Token expiration and reconnection

Microsoft OAuth tokens can expire if you change your account password, your IT admin revokes app access, or your mailbox remains inactive for an extended period. When this happens, the mailbox in Swokei shows a red or yellow warning badge.

To restore the connection, click on the affected mailbox in the Mailboxes list. In the settings drawer, you'll see an error message and a red "Re-authorize" button. Click it, complete the Microsoft login pop-up, and your connection is restored within seconds.

## Troubleshooting connection issues

### The Microsoft login pop-up doesn't appear

Your browser is likely blocking pop-ups. Look for a blocked pop-up notification in your browser's address bar, click it, and allow pop-ups from app.swokei.com. Then try adding the mailbox again.

### You connected the wrong Microsoft account

In the Mailboxes list, click the incorrectly connected mailbox. Scroll to the bottom of the settings drawer and click "Delete mailbox". Confirm the deletion, then click "Add mailbox" again. When the Microsoft pop-up opens, click "Sign in with a different account", or sign out of Microsoft at microsoft.com first, then reconnect.

### Connection appeared to succeed but mailbox shows "Error" a few minutes later

This occasionally happens with Microsoft 365 accounts where conditional access rules take effect after the initial authorization succeeds. Try reconnecting while on the corporate network or from a managed device. If that's not an option, use the SMTP connection method instead.

ON THIS PAGE

