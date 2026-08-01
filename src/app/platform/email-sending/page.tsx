import { PlatformPageTemplate } from "@/components/landing/PlatformPageTemplate";

export const metadata = {
  title: "Email Sending | Crawlia",
  description: "Connect your mailboxes and send personalized cold emails at scale with optimal deliverability.",
};

export default function EmailSendingPage() {
  return (
    <PlatformPageTemplate
      badge="Email Sending"
      title="Your domain. Your reputation. Your replies."
      subtitle="Connect Google Workspace or Office 365 and send emails using your own dedicated sender accounts and SMTPs."
      bulletPoints={[
        "Send from G Suite or Office 365",
        "Automated inbox warmup included",
        "Smart sending limits and pacing",
        "Spintax and personalization"
      ]}
      heroImage="/images/mockups/dashboard_mailboxes_page_1785438181322.png"
      topFeatures={[
        {
          title: "Unlimited accounts",
          description: "Connect as many mailboxes as you want. Scale your sending volume infinitely without paying per seat."
        },
        {
          title: "Deliverability monitor",
          description: "Keep track of your domain health, DKIM/SPF records, and spam scores in real-time."
        },
        {
          title: "Custom tracking",
          description: "Use your own custom tracking domains for opens and clicks to improve deliverability and brand trust."
        }
      ]}
      midSectionTitle="Every send control, in plain sight."
      midSectionSubtitle="Control exactly how and when your campaigns go out. Optimize for deliverability without needing an IT degree."
      detailedFeatures={[
        { title: "Daily sending limits", description: "Cap the maximum number of emails sent per mailbox per day to stay under spam radar." },
        { title: "Custom SMTP", description: "Plug in your own SendGrid, Amazon SES, or Mailgun credentials if you prefer to send via API." },
        { title: "Timezone sending", description: "Deliver emails based on the prospect's local timezone so they receive it during their work hours." },
        { title: "Spintax support", description: "Automatically spin words and phrases to ensure every single email sent is mathematically unique." },
        { title: "Warmup pool", description: "Automatically send and reply to emails within our trusted network to build a bulletproof sender reputation." },
        { title: "Bounce rate monitoring", description: "Automatically pause your campaigns if bounce rates cross a dangerous threshold." }
      ]}
      howItWorksSteps={[
        { title: "Connect your accounts", description: "Link your Google Workspace or Microsoft Outlook mailboxes securely using 1-click OAuth." },
        { title: "Warm up your inboxes", description: "Enable automated AI warmup to slowly build trust with Google and Microsoft servers." },
        { title: "Set your sending limits", description: "Define exactly how many emails each mailbox should send per day to look like a human." },
        { title: "Launch your campaign", description: "Schedule your sequences, assign mailboxes to rotate, and let Crawlia handle the pacing." },
        { title: "Monitor deliverability", description: "Keep an eye on bounce rates, open rates, and spam scores from the analytics dashboard." },
        { title: "Watch replies roll in", description: "Manage all responses across all your sender accounts from one unified inbox." }
      ]}
    />
  );
}
