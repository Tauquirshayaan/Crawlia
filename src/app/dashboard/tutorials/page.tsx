import { PlayCircle, Clock, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Tutorials - Crawlia",
};

export default function TutorialsPage() {
  const tutorials = [
    {
      title: "Getting Started with the Analyzer",
      description: "Learn how to extract hidden SEO and performance data to craft the perfect cold email hook.",
      duration: "5 min",
      thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
      category: "Basics"
    },
    {
      title: "Setting up your Unified Inbox",
      description: "Connect Gmail and Outlook to automatically track and classify inbound replies.",
      duration: "8 min",
      thumbnail: "https://images.unsplash.com/photo-1579389083046-d3bd182d80d4?w=800&q=80",
      category: "Setup"
    },
    {
      title: "Mastering the AI Copywriter",
      description: "How to tune Gemini prompts to write agency-grade copy that converts at 40%.",
      duration: "12 min",
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
      category: "Advanced"
    },
    {
      title: "Local Business Lead Gen Workflow",
      description: "Find thousands of plumbers and roofers in your local area in one click.",
      duration: "6 min",
      thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
      category: "Growth"
    },
    {
      title: "Understanding Schema and OpenGraph",
      description: "Use advanced technical SEO audits to prove domain expertise to your prospects.",
      duration: "15 min",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      category: "SEO"
    },
    {
      title: "Building Follow-Up Sequences",
      description: "Automate your follow-ups to maximize response rates without being spammy.",
      duration: "10 min",
      thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
      category: "Automation"
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-outfit text-[var(--color-brand-ink)]">
            Video Tutorials
          </h1>
          <p className="text-[var(--color-brand-slate)] mt-1">
            Master the Crawlia platform and scale your agency outreach.
          </p>
        </div>
        <Button variant="primary">
          <Sparkles className="w-4 h-4 mr-2" />
          Request a Tutorial
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials.map((tutorial, index) => (
          <div 
            key={index}
            className="group bg-white rounded-2xl border border-[var(--color-brand-border)] overflow-hidden hover:shadow-xl hover:shadow-[var(--color-brand-emerald)]/10 transition-all duration-300 cursor-pointer"
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={tutorial.thumbnail} 
                alt={tutorial.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <PlayCircle className="w-12 h-12 text-white" />
              </div>
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-[var(--color-brand-ink)]">
                {tutorial.category}
              </div>
            </div>
            
            <div className="p-5">
              <h3 className="font-bold text-[var(--color-brand-ink)] mb-2 group-hover:text-[var(--color-brand-emerald)] transition-colors">
                {tutorial.title}
              </h3>
              <p className="text-sm text-[var(--color-brand-slate)] line-clamp-2 mb-4">
                {tutorial.description}
              </p>
              
              <div className="flex items-center justify-between text-xs font-medium text-[var(--color-brand-muted)]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {tutorial.duration}
                </div>
                <div className="flex items-center gap-1.5 group-hover:text-[var(--color-brand-teal)] transition-colors">
                  <BookOpen className="w-3.5 h-3.5" />
                  Watch now
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
