"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Search, Map, ShieldCheck, Play, SplitSquareHorizontal, RefreshCw, Inbox, BarChart, Activity, CheckCircle2, Globe, FileText, Languages, Settings2, Users, Rocket, Mail, CopyPlus, Clock } from "lucide-react";

type Step = {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  image: string;
};

const smartCampaignSteps: Step[] = [
  {
    id: "smart-1",
    title: "Add your list of prospects & websites",
    icon: <Globe className="w-5 h-5 text-[#39b54a]" />,
    description: "You don't need to hunt for leads yourself. Use our AI Lead Gen to find prospects by simply picking a location on the map and setting your industry.",
    image: "/images/mockups/dashboard_lead_finder_page_1785438156197.png"
  },
  {
    id: "smart-2",
    title: "Filter & Refine Leads",
    icon: <Search className="w-5 h-5 text-[#39b54a]" />,
    description: "Narrow down your target audience. Specify the exact city and industry to get high-quality prospects.",
    image: "/images/mockups/dashboard_leads_page_1785438100855.png"
  },
  {
    id: "smart-3",
    title: "Pick a language",
    icon: <Languages className="w-5 h-5 text-[#39b54a]" />,
    description: "Choose the language for your outreach. Crawlia's AI will write hyper-personalized emails entirely in this language.",
    image: "/images/mockups/dashboard_analyze_page_1785438168573.png"
  },
  {
    id: "smart-4",
    title: "Set rules",
    icon: <Settings2 className="w-5 h-5 text-[#39b54a]" />,
    description: "Control how Crawlia handles tricky leads. Set minimum website scores and define fallback actions.",
    image: "/images/mockups/campaign_flow_1785441276865.png"
  },
  {
    id: "smart-5",
    title: "Review",
    icon: <CheckCircle2 className="w-5 h-5 text-[#39b54a]" />,
    description: "Check your scanned leads. See exactly who will receive your emails and verify contact details before launching.",
    image: "/images/mockups/dashboard_leads_page_1785438100855.png"
  },
  {
    id: "smart-6",
    title: "Campaign Launched",
    icon: <Rocket className="w-5 h-5 text-[#39b54a]" />,
    description: "Sit back and relax. Your smart campaign is now running, automatically analyzing websites and sending emails.",
    image: "/images/mockups/hero_dashboard_1785441257803.png"
  },
  {
    id: "smart-7",
    title: "AI Drafts Email per prospect",
    icon: <Mail className="w-5 h-5 text-[#39b54a]" />,
    description: "Our AI visits each prospect's website, reads the content, and drafts a unique, highly personalized email.",
    image: "/images/mockups/dashboard_showcase_1785441268007.png"
  },
  {
    id: "smart-8",
    title: "Deliveries & Engagement Tracking",
    icon: <BarChart className="w-5 h-5 text-[#39b54a]" />,
    description: "Monitor your success in real-time. Track opens, clicks, and replies to optimize your strategy.",
    image: "/images/mockups/dashboard_analytics_page_1785438141952.png"
  },
  {
    id: "smart-9",
    title: "Inbox & CRM",
    icon: <Inbox className="w-5 h-5 text-[#39b54a]" />,
    description: "Manage all replies in one unified inbox and move warm leads through your CRM pipeline.",
    image: "/images/mockups/dashboard_mailboxes_page_1785438181322.png"
  }
];

const standardCampaignSteps: Step[] = [
  {
    id: "standard-1",
    title: "Add your list of prospects & websites",
    icon: <FileText className="w-5 h-5 text-[#39b54a]" />,
    description: "Already have a list? Easily import your prospects via CSV, paste them directly, or connect your Google Sheets.",
    image: "/images/mockups/dashboard_leads_page_1785438100855.png"
  },
  {
    id: "standard-2",
    title: "Pick a language",
    icon: <Languages className="w-5 h-5 text-[#39b54a]" />,
    description: "Select the language for your email templates. This helps our system optimize deliverability.",
    image: "/images/mockups/dashboard_analyze_page_1785438168573.png"
  },
  {
    id: "standard-3",
    title: "Set rules",
    icon: <Settings2 className="w-5 h-5 text-[#39b54a]" />,
    description: "Define your campaign parameters. Set rules for handling missing data or duplicate emails.",
    image: "/images/mockups/campaign_flow_1785441276865.png"
  },
  {
    id: "standard-4",
    title: "Add your Mailbox",
    icon: <Inbox className="w-5 h-5 text-[#39b54a]" />,
    description: "Connect your sending accounts. Use multiple mailboxes to rotate sending and protect your domain reputation.",
    image: "/images/mockups/dashboard_mailboxes_page_1785438181322.png"
  },
  {
    id: "standard-5",
    title: "Create your Template or generate with AI",
    icon: <CopyPlus className="w-5 h-5 text-[#39b54a]" />,
    description: "Write your email copy or let our AI assist you. Use dynamic variables to personalize at scale.",
    image: "/images/mockups/dashboard_showcase_1785441268007.png"
  },
  {
    id: "standard-6",
    title: "Add Follow-ups",
    icon: <Play className="w-5 h-5 text-[#39b54a]" />,
    description: "Build multi-step sequences. Set delays between emails to maximize your response rates.",
    image: "/images/mockups/campaign_flow_1785441276865.png"
  },
  {
    id: "standard-7",
    title: "Set your Schedule",
    icon: <Clock className="w-5 h-5 text-[#39b54a]" />,
    description: "Choose exactly when your emails go out. Set timezones and sending windows to reach prospects at the right time.",
    image: "/images/mockups/hero_dashboard_1785441257803.png"
  },
  {
    id: "standard-8",
    title: "Campaign Launched",
    icon: <Rocket className="w-5 h-5 text-[#39b54a]" />,
    description: "Your standard campaign is live. Emails are being sent according to your schedule and rules.",
    image: "/images/mockups/hero_dashboard_1785441257803.png"
  },
  {
    id: "standard-9",
    title: "Get detailed analytics",
    icon: <BarChart className="w-5 h-5 text-[#39b54a]" />,
    description: "Track the performance of your templates. See which subject lines and copy convert best.",
    image: "/images/mockups/dashboard_analytics_page_1785438141952.png"
  }
];

export function HowItWorksContent() {
  const [activeTab, setActiveTab] = useState<"smart" | "standard">("smart");
  
  const currentSteps = activeTab === "smart" ? smartCampaignSteps : standardCampaignSteps;
  const [activeSection, setActiveSection] = useState<string>(currentSteps[0].id);
  
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Update active section when tab changes
  useEffect(() => {
    setActiveSection(currentSteps[0].id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0.2 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      sectionRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [activeTab]); // Re-bind observer when steps change

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120; // Accounts for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-32">
      {/* Tab Switcher */}
      <div className="flex justify-center mb-24">
        <div className="bg-slate-100 p-1.5 rounded-full flex gap-1">
          <button
            onClick={() => setActiveTab("smart")}
            className={`px-8 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "smart"
                ? "bg-[#39b54a] text-white shadow-md shadow-green-500/20"
                : "text-[var(--color-brand-slate)] hover:text-[var(--color-brand-ink)]"
            }`}
          >
            Smart Campaign
          </button>
          <button
            onClick={() => setActiveTab("standard")}
            className={`px-8 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === "standard"
                ? "bg-white text-[var(--color-brand-ink)] shadow-md"
                : "text-[var(--color-brand-slate)] hover:text-[var(--color-brand-ink)]"
            }`}
          >
            Standard Campaign
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-16 relative">
        {/* Left Sidebar Timeline */}
        <div className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-32">
            <h3 className="font-outfit font-bold text-[var(--color-brand-ink)] mb-8 uppercase tracking-wider text-xs flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[var(--color-brand-emerald)] flex items-center justify-center text-white">
                <Play className="w-3.5 h-3.5" />
              </span>
              Workflow Steps
            </h3>
            
            <div className="relative pl-3">
              {/* Vertical connecting line */}
              <div className="absolute left-3 top-2 bottom-6 w-0.5 bg-slate-200 z-0"></div>
              
              <ul className="space-y-6 relative z-10">
                {currentSteps.map((step) => {
                  const isActive = activeSection === step.id;
                  
                  return (
                    <li key={step.id} className="relative">
                      <button
                        onClick={() => scrollToSection(step.id)}
                        className="flex items-start gap-4 text-left w-full group"
                      >
                        {/* Dot */}
                        <div className={`mt-1 w-3 h-3 rounded-full border-2 bg-white transition-colors shrink-0 z-10 ${
                          isActive 
                            ? "border-[#39b54a] bg-[#39b54a]" 
                            : "border-slate-300 group-hover:border-[#39b54a]"
                        }`} />
                        
                        {/* Text */}
                        <div className="flex-1">
                          <span className={`block text-sm font-bold transition-colors ${
                            isActive 
                              ? "text-[var(--color-brand-ink)]" 
                              : "text-[var(--color-brand-slate)] group-hover:text-[var(--color-brand-ink)]"
                          }`}>
                            {step.title}
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 space-y-32">
          {currentSteps.map((step, index) => (
            <section
              key={step.id}
              id={step.id}
              ref={(el) => { sectionRefs.current[index] = el; }}
              className="scroll-mt-32"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center shadow-sm text-[var(--color-brand-teal)] border border-green-200/50">
                  {step.icon}
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-outfit font-bold text-[var(--color-brand-ink)] mb-4">
                {step.title}
              </h2>
              <p className="text-lg text-[var(--color-brand-slate)] leading-relaxed mb-10 max-w-2xl font-medium">
                {step.description}
              </p>
              <div className="bg-[#eaf5e3] rounded-[32px] p-8 md:p-12 relative overflow-hidden group">
                 {/* Subtle decorative glow */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-[#39b54a]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                 <img 
                   src={step.image} 
                   alt={step.title} 
                   className="w-full h-auto rounded-xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-white/80 relative z-10 transition-transform duration-700 group-hover:scale-[1.02]"
                 />
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
