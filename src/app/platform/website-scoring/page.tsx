import { PlatformPageTemplate } from "@/components/landing/PlatformPageTemplate";

export const metadata = {
  title: "Website Scoring | Crawlia",
  description: "A 1-100 score assigned to every lead in your list. Focus on bad websites, skip the good ones.",
};

export default function WebsiteScoringPage() {
  return (
    <PlatformPageTemplate
      badge="Website Scoring"
      title="A number that tells you where the opportunity is."
      subtitle="A 1-100 score assigned to every lead in your list. Focus your time on the leads with terrible websites, and skip the ones that are already perfect."
      bulletPoints={[
        "Core Web Vitals performance score",
        "UX and Accessibility scoring",
        "Missing SEO metadata detection",
        "Filter and sort by opportunity"
      ]}
      heroImage="/images/mockups/dashboard_showcase_1785441268007.png"
      topFeatures={[
        {
          title: "Filter out the good sites",
          description: "Save time and money on outreach by instantly dropping leads with a website score above 80."
        },
        {
          title: "Emphasize the bad",
          description: "Identify exactly which metrics a lead is failing at so you can tailor your pitch to their specific problems."
        },
        {
          title: "Export audit reports",
          description: "One-click export the full Lighthouse audit data to attach to your emails or send to your sales team."
        }
      ]}
      midSectionTitle="What goes into the score, and what you do with it."
      midSectionSubtitle="The score isn't a magic number, it's a calculated metric based on real Google Lighthouse audits and Core Web Vitals."
      detailedFeatures={[
        { title: "Performance metrics", description: "Calculates real-world page load speed, time to interactive, and cumulative layout shifts." },
        { title: "Mobile UI checks", description: "Detects buttons that are too small to tap or content that overflows on mobile devices." },
        { title: "Missing metadata", description: "Checks for missing title tags, descriptions, OpenGraph tags, and Schema.org JSON-LD markup." },
        { title: "Accessibility score", description: "Evaluates color contrast, missing image alt text, and aria labels for ADA compliance." },
        { title: "SSL & Security", description: "Flags sites without HTTPS or with expired SSL certificates that trigger browser warnings." },
        { title: "Javascript errors", description: "Detects console errors and broken scripts that are actively harming the user experience." }
      ]}
      howItWorksSteps={[
        { title: "Spin up a real browser", description: "We don't just scrape HTML. We load the page exactly like a user would using Playwright." },
        { title: "Evaluate Web Vitals", description: "We measure LCP, CLS, and FID using Google's exact performance metrics and thresholds." },
        { title: "Run accessibility audit", description: "We check for contrast issues and missing tags to ensure the site is usable for everyone." },
        { title: "Calculate the score", description: "All technical metrics are aggregated into a single 1-100 score based on severity." },
        { title: "Filter your list", description: "Instantly sort your lead list in the CRM to show only the businesses with a score below 50." },
        { title: "AI writes the pitch", description: "Our Gemini AI uses the specific failing metrics to write a highly targeted cold email." }
      ]}
    />
  );
}
