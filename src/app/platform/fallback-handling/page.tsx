import { PlatformPageTemplate } from "@/components/landing/PlatformPageTemplate";

export const metadata = {
  title: "Fallback Handling | Crawlia",
  description: "Broken sites won't break your campaign. Instantly pivot to backup strategies.",
};

export default function FallbackHandlingPage() {
  return (
    <PlatformPageTemplate
      badge="Fallback Handling"
      title="Broken sites won't break your campaign."
      subtitle="When a lead has no website, or the site is down, Crawlia instantly pivots to a backup strategy so you never miss an opportunity."
      bulletPoints={[
        "Playwright site failure detection",
        "Dynamic fallback variables and copy",
        "Automatic Google Places enrichment"
      ]}
      heroImage="/images/mockups/dashboard_leads_page_1785438100855.png"
      topFeatures={[
        {
          title: "No site, no problem",
          description: "If a domain is dead, Crawlia will automatically switch to your fallback template and still send the email."
        },
        {
          title: "Universal variables",
          description: "Fallback variables ensure you don't send emails with weird blank spaces like 'I saw your website at [blank]'."
        },
        {
          title: "Virtual site evaluation",
          description: "If the site is down, Crawlia can use Google Places API to try and find alternative contact info or a new domain."
        }
      ]}
      midSectionTitle="Every kind of broken site has a rule for it."
      midSectionSubtitle="We've seen it all. DNS errors, parked domains, redirect loops. Here is how Crawlia handles edge cases automatically."
      detailedFeatures={[
        { title: "DNS resolution errors", description: "If the domain doesn't exist, we immediately pivot to the backup email copy before the AI tries to audit it." },
        { title: "Redirect loops", description: "If a site gets stuck in a redirect loop, we pause the audit and flag the lead for manual review." },
        { title: "Parked domains", description: "We detect default GoDaddy or Namecheap parked pages and instantly categorize the lead as having no website." },
        { title: "Paywalls and captchas", description: "When we hit a Cloudflare captcha or a hard paywall, we gracefully exit and use the fallback strategy." },
        { title: "Password protection", description: "If a site asks for HTTP auth, we record it as a closed site and skip the deep AI audit." },
        { title: "Social media redirects", description: "If a domain redirects to a Facebook page, we audit the Facebook page's public information instead." }
      ]}
      howItWorksSteps={[
        { title: "Crawlia visits the site", description: "The Playwright engine attempts to load the domain provided in your lead list." },
        { title: "A critical error is detected", description: "Whether it's a 404, a timeout, or a parked page, Crawlia logs the failure reason." },
        { title: "The AI skips the audit", description: "To save processing time and money, the Gemini vision audit is instantly cancelled." },
        { title: "Fallback copy is activated", description: "Crawlia swaps in your generic backup pitch instead of the highly personalized website pitch." },
        { title: "The email is sent", description: "Your prospect still receives a great cold email, it just doesn't mention their broken website." },
        { title: "You get notified", description: "The lead is tagged in your CRM as having a broken site so you can offer to build them a new one!" }
      ]}
    />
  );
}
