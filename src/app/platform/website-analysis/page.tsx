import { PlatformPageTemplate } from "@/components/landing/PlatformPageTemplate";

export const metadata = {
  title: "Website Analysis | Crawlia",
  description: "Analyze thousands of websites, one by one with a real headless browser.",
};

export default function WebsiteAnalysisPage() {
  return (
    <PlatformPageTemplate
      badge="Website Analysis"
      title="Analyze thousands of websites, one by one."
      subtitle="Crawlia's Playwright engine acts like a real human. It opens the site, scrolls, clicks, and takes a screenshot before evaluating speed, performance, and conversion points."
      bulletPoints={[
        "Headless browser rendering (Javascript)",
        "Captures high-res viewport screenshots",
        "Extracts Schema and OpenGraph data",
        "Emulates mobile and desktop devices"
      ]}
      heroImage="/images/mockups/dashboard_showcase_1785441268007.png"
      topFeatures={[
        {
          title: "Real browser environment",
          description: "We don't just fetch HTML. We run a full Chromium browser to ensure modern React/Vue apps render correctly."
        },
        {
          title: "Viewport screenshots",
          description: "We take a full HD screenshot of the hero section exactly as it appears to a real user visiting the site."
        },
        {
          title: "Core Web Vitals checks",
          description: "We measure real-world loading performance, interactivity, and visual stability (LCP, FID, CLS)."
        }
      ]}
      midSectionTitle="Everything Crawlia looks at when it audits a website."
      midSectionSubtitle="We collect more data points than any other tool on the market, giving you infinite angles to personalize your cold email outreach."
      detailedFeatures={[
        { title: "Page speed", description: "How fast does the site visually load for a user on a 4G connection? We measure this precisely." },
        { title: "Mobile responsiveness", description: "Is the site responsive? Does it have a viewport meta tag? Are touch targets large enough?" },
        { title: "Schema.org data", description: "Does the site use structured data to help search engines understand their business? We extract it all." },
        { title: "OpenGraph tags", description: "When the site is shared on Facebook or Twitter, does it have a nice preview image and description?" },
        { title: "Text to HTML ratio", description: "Is the site just a massive block of images with no readable text for SEO? We flag this." },
        { title: "Broken links", description: "We scan the homepage for obvious 404 links or broken images that hurt credibility." }
      ]}
      howItWorksSteps={[
        { title: "You upload a list of URLs", description: "Drop in a CSV of website domains you want to analyze and pitch." },
        { title: "Crawlia boots up a browser", description: "For every single lead, we spin up a fresh, isolated Chromium session to prevent blocking." },
        { title: "We navigate to the site", description: "The browser loads the page, waits for network idle, and ensures all animations finish playing." },
        { title: "We extract the data", description: "We pull the DOM, evaluate performance APIs, and snap a picture of the viewport." },
        { title: "The data is saved to the CRM", description: "All the technical metrics and the screenshot are saved directly to the lead's profile." },
        { title: "Ready for AI", description: "The data is now prepped and ready to be fed into the Gemini AI model to write the email." }
      ]}
    />
  );
}
