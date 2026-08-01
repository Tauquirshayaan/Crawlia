import { PlatformPageTemplate } from "@/components/landing/PlatformPageTemplate";

export const metadata = {
  title: "Mail Verifier | Crawlia",
  description: "Validate every address before you send to protect your domain reputation.",
};

export default function MailVerifierPage() {
  return (
    <PlatformPageTemplate
      badge="Mail Verifier"
      title="Validate every address before you send."
      subtitle="Don't ruin your domain reputation. Verify emails for syntax, MX records, and catch-alls before you hit send."
      bulletPoints={[
        "Catch-all and syntax checks",
        "Keep bounce rate below 1%",
        "Protect your sender domains",
        "Bulk CSV list cleaning"
      ]}
      heroImage="/images/mockups/dashboard_analyze_page_1785438168573.png"
      topFeatures={[
        {
          title: "Syntax & MX Check",
          description: "Verify the format of the email and confirm the domain actually has active mail servers configured."
        },
        {
          title: "Catch-all detection",
          description: "Know when a domain accepts all emails so you can decide if the risk of a soft-bounce is worth it."
        },
        {
          title: "Disposable emails",
          description: "Detect and instantly block temporary or trash email addresses that ruin deliverability scores."
        }
      ]}
      midSectionTitle="Every kind of bad address gets caught."
      midSectionSubtitle="We use the exact same real-time validation technology that enterprise data providers use to keep their lists pristine."
      detailedFeatures={[
        { title: "Syntax check", description: "Catches obvious typos like missing @ symbols, spaces, or invalid characters before they bounce." },
        { title: "Domain validation", description: "Ensures the domain name is actually registered, active, and hasn't expired." },
        { title: "MX Record check", description: "Confirms the domain is actively configured to receive mail traffic." },
        { title: "Catch-all test", description: "Identifies servers configured to accept any email address prefix." },
        { title: "Role-based checking", description: "Flags generic addresses like info@, support@, or admin@ that have low reply rates." },
        { title: "Greylisting detection", description: "Detects mail servers that temporarily reject mail as an anti-spam measure." }
      ]}
      howItWorksSteps={[
        { title: "Upload your list", description: "Drop a CSV file containing your scraped leads or import them directly from your CRM." },
        { title: "Syntax check", description: "We instantly clean up bad formatting, trailing spaces, and obvious typos." },
        { title: "Domain verification", description: "We check the DNS records of every single domain to ensure they are online." },
        { title: "SMTP handshake", description: "We ping the receiving mail server to verify the specific mailbox actually exists." },
        { title: "Filter the results", description: "You get a clean list categorized by Safe to Send, Catch-all, and Invalid." },
        { title: "Start sending", description: "Push the cleaned list directly into your Crawlia email sequences." }
      ]}
    />
  );
}
