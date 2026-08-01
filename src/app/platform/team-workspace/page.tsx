import { PlatformPageTemplate } from "@/components/landing/PlatformPageTemplate";

export const metadata = {
  title: "Team Workspace | Crawlia",
  description: "Invite teammates, share campaigns, and sync inboxes across your agency.",
};

export default function TeamWorkspacePage() {
  return (
    <PlatformPageTemplate
      badge="Team Workspace"
      title="Invite teammates. Share campaigns. Sync inboxes."
      subtitle="Your Crawlia account is an entire workspace. Share campaigns, inboxes, and leads with the people who need it."
      bulletPoints={[
        "Collaborate on campaigns and templates",
        "Shared inboxes for your entire team",
        "Permission management and roles"
      ]}
      heroImage="/images/mockups/dashboard_home_page_1785438111657.png"
      topFeatures={[
        {
          title: "Shared campaigns",
          description: "Work together on sequences. Let your best copywriters write the emails while your SDRs launch the campaigns."
        },
        {
          title: "Workspace permissions",
          description: "Control exactly who can see what. Give managers full admin access and restrict SDRs to only their own leads."
        },
        {
          title: "Assigned leads",
          description: "Prevent your team from stepping on each other's toes by assigning specific accounts to specific sales reps."
        }
      ]}
      midSectionTitle="Built for the way agencies actually work."
      midSectionSubtitle="Most tools charge you per seat, so you share passwords. We let you invite unlimited team members for free."
      detailedFeatures={[
        { title: "Unlimited seats", description: "Invite your whole team without worrying about per-user pricing holding you back." },
        { title: "Team inboxes", description: "Allow multiple SDRs to monitor the same unified inbox so replies are handled immediately." },
        { title: "Shared templates", description: "Create a library of your best performing email copy that anyone on the team can use." },
        { title: "Activity logging", description: "See an audit trail of exactly who launched which campaign or replied to which lead." },
        { title: "Client workspaces", description: "Create isolated workspaces for different clients so their data and leads never mix." },
        { title: "Multi-domain support", description: "Manage multiple brands and sending domains from a single account without logging in and out." }
      ]}
      howItWorksSteps={[
        { title: "Create a workspace", description: "Set up your company workspace and customize your agency branding." },
        { title: "Invite your team", description: "Send email invitations to your colleagues with specific roles like Admin or Member." },
        { title: "Connect shared mailboxes", description: "Link Google Workspace accounts that multiple team members need access to." },
        { title: "Build campaigns together", description: "Collaborate on sequences, share lead lists, and review each other's email copy." },
        { title: "Monitor performance", description: "Managers get a bird's eye view of how the entire team is performing across all campaigns." },
        { title: "Close more deals", description: "With everyone aligned and working together, your agency books more meetings." }
      ]}
    />
  );
}
