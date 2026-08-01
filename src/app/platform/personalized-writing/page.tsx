import { PlatformPageTemplate } from "@/components/landing/PlatformPageTemplate";

export const metadata = {
  title: "Personalized Writing | Crawlia",
  description: "AI that writes emails based on real visual details from your prospect's website.",
};

export default function PersonalizedWritingPage() {
  return (
    <PlatformPageTemplate
      badge="Personalized Writing"
      title="Specific references, not {{first_name}} templates."
      subtitle="Crawlia's AI writes emails that mention real visual details, like 'I noticed the hero image on mobile is cut off.' It never sounds like a robot."
      bulletPoints={[
        "AI finds real flaws on the lead's website",
        "Mentions specific design and UX issues",
        "Generates natural, conversational copy"
      ]}
      heroImage="/images/mockups/hero_dashboard_1785441257803.png"
      topFeatures={[
        {
          title: "Multimodal AI technology",
          description: "We use Gemini Vision to look at the screenshots of the page. It understands visual context, not just HTML code."
        },
        {
          title: "Large context windows",
          description: "We feed the entire DOM and visual hierarchy into the AI so it has maximum context to write the pitch."
        },
        {
          title: "Completely custom",
          description: "Every single email is generated from scratch based on that specific lead's unique website data."
        }
      ]}
      midSectionTitle="All the controls you have over what Crawlia writes."
      midSectionSubtitle="You aren't flying blind. You write the skeleton, and the AI fills in the personalized observations."
      detailedFeatures={[
        { title: "Tone control", description: "Instruct the AI to sound professional, casual, humorous, or strictly business based on your agency's brand." },
        { title: "Custom variables", description: "Define exactly what kind of observations you want the AI to look for (e.g. only focus on mobile responsiveness)." },
        { title: "Output length limits", description: "Set strict limits on how many words the AI can generate so your emails don't turn into unreadable novels." },
        { title: "Personalization strictness", description: "Tell the AI to only generate a line if it's 100% confident it found a real, actionable issue on the site." },
        { title: "Spintax integration", description: "Combine AI generated lines with traditional spintax to create millions of unique variations." },
        { title: "Manual review mode", description: "Force all AI generated emails to sit in a draft state so a human can approve them before sending." }
      ]}
      howItWorksSteps={[
        { title: "You write a base template", description: "Create the skeleton of your email: 'Hi {{first_name}}, I run a local web agency. {{ai_observation}}'" },
        { title: "The AI audits the site", description: "Crawlia analyzes the lead's website and finds a glaring issue, like a broken checkout button." },
        { title: "The AI generates the insert", description: "It writes: 'I noticed the checkout button on your mobile site is completely broken.'" },
        { title: "The email is assembled", description: "Crawlia merges the AI text into your template and prepares it for sending." },
        { title: "Manual review (optional)", description: "You can log in and review the generated email to ensure it sounds perfect before hitting approve." },
        { title: "The email is sent", description: "Your prospect receives an email that proves you actually took the time to look at their business." }
      ]}
    />
  );
}
