import { MarketingNavbar } from "@/components/layout/MarketingNavbar";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export interface PlatformPageProps {
  badge: string;
  title: string;
  subtitle: string;
  bulletPoints: string[];
  heroImage: string;
  topFeatures: { title: string; description: string }[];
  midSectionTitle: string;
  midSectionSubtitle: string;
  detailedFeatures: { title: string; description: string }[];
  howItWorksSteps: { title: string; description: string }[];
}

export function PlatformPageTemplate(props: PlatformPageProps) {
  return (
    <div className="min-h-screen bg-white text-[var(--color-brand-ink)] font-sans selection:bg-[#39b54a] selection:text-white flex flex-col overflow-x-hidden">
      <MarketingNavbar />
      
      <main className="flex-grow pt-40 pb-20">
        
        {/* 1. Hero Section */}
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 text-[#39b54a] text-xs font-bold mb-6 border border-green-100 uppercase tracking-widest">
            {props.badge}
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-outfit mb-6 tracking-tight leading-[1.05] max-w-4xl">
            {props.title}
          </h1>
          <p className="text-xl text-[var(--color-brand-slate)] mb-10 max-w-2xl font-medium leading-relaxed">
            {props.subtitle}
          </p>
          
          <ul className="space-y-3 mb-10">
            {props.bulletPoints.map((point, i) => (
              <li key={i} className="flex items-center gap-3 text-lg font-semibold">
                <CheckCircle2 className="w-6 h-6 text-[#39b54a]" />
                {point}
              </li>
            ))}
          </ul>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/signup">
              <Button className="rounded-full bg-[#39b54a] hover:bg-[#2d963c] text-white font-bold h-14 px-10 text-lg shadow-xl shadow-green-500/20 border-0">
                Start for free
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" className="rounded-full bg-white text-[var(--color-brand-ink)] font-bold h-14 px-10 text-lg border-slate-200 shadow-sm hover:bg-slate-50">
                Book a demo
              </Button>
            </Link>
          </div>
        </div>

        {/* 2. Hero Image */}
        <div className="max-w-[1400px] mx-auto px-6 mb-32">
           <div className="bg-[#eaf5e3] rounded-[40px] p-8 md:p-16 flex items-center justify-center relative overflow-hidden">
              <img src={props.heroImage} alt="Dashboard Mockup" className="w-full max-w-6xl h-auto rounded-xl shadow-2xl relative z-10 border border-white/50 transform group-hover:scale-[1.02] transition-transform duration-700" />
           </div>
        </div>

        {/* 3. Top Features (3 Columns) */}
        <div className="max-w-7xl mx-auto px-6 mb-32">
          <div className="grid md:grid-cols-3 gap-12">
            {props.topFeatures.map((feature, i) => (
              <div key={i} className="relative">
                {/* Green accent line */}
                <div className="w-full h-1 bg-gradient-to-r from-[#39b54a] to-transparent rounded-full mb-6 opacity-30"></div>
                <h3 className="text-xl font-bold font-outfit mb-3">{feature.title}</h3>
                <p className="text-[var(--color-brand-slate)] font-medium leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Detailed Features Grid */}
        <div className="max-w-7xl mx-auto px-6 mb-32">
          <h2 className="text-4xl md:text-5xl font-extrabold font-outfit mb-4">{props.midSectionTitle}</h2>
          <p className="text-xl text-[var(--color-brand-slate)] mb-16 font-medium max-w-3xl">{props.midSectionSubtitle}</p>
          
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
            {props.detailedFeatures.map((feature, i) => (
              <div key={i} className="border-t-2 border-[#39b54a]/20 pt-6">
                <h3 className="text-xl font-bold font-outfit mb-3">{feature.title}</h3>
                <p className="text-[var(--color-brand-slate)] font-medium leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. How It Works Steps */}
        <div className="max-w-7xl mx-auto px-6 mb-32">
          <h2 className="text-4xl md:text-5xl font-extrabold font-outfit mb-16">How it works</h2>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
            {props.howItWorksSteps.map((step, i) => (
              <div key={i} className="flex gap-6">
                <div className="w-10 h-10 shrink-0 bg-[#39b54a] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md mt-1">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold font-outfit mb-3">{step.title}</h3>
                  <p className="text-[var(--color-brand-slate)] font-medium leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Try it yourself CTA */}
        <div className="max-w-7xl mx-auto px-6 mb-40">
          <h2 className="text-4xl font-extrabold font-outfit mb-4">Try it on your own list.</h2>
          <p className="text-xl text-[var(--color-brand-slate)] mb-8 font-medium">30 seconds to set up. No credit card.</p>
          <Link href="/signup">
            <Button className="rounded-full bg-[#39b54a] hover:bg-[#2d963c] text-white font-bold h-12 px-8 shadow-md border-0">
              Start for free
            </Button>
          </Link>
        </div>

        {/* 7. Testimonials */}
        <div className="max-w-7xl mx-auto px-6 mb-40">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-xs font-bold mb-6 border border-slate-200 uppercase tracking-widest">
            Testimonials
          </div>
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold font-outfit max-w-md leading-tight">
              Agencies that let Crawlia do the outreach
            </h2>
            <div className="hidden md:flex gap-4">
               <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50">&larr;</div>
               <div className="w-10 h-10 rounded-full bg-[#39b54a] flex items-center justify-center text-white cursor-pointer shadow-md">&rarr;</div>
            </div>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x">
            {/* Testimonial 1 */}
            <div className="bg-white border border-slate-200 rounded-[32px] p-10 min-w-[400px] snap-center shadow-sm">
               <div className="text-[#39b54a] text-6xl font-serif leading-none mb-6">"</div>
               <p className="text-xl font-bold mb-10 leading-relaxed">
                 Crawlia writes a better first line than my whole team. We booked three redesigns in the first week and haven't looked back.
               </p>
               <div className="flex items-center gap-4">
                 <img src="https://i.pravatar.cc/150?img=11" alt="Chris B" className="w-12 h-12 rounded-full border-2 border-green-100" />
                 <div>
                   <div className="font-bold">Chris Bergner</div>
                   <div className="text-sm text-[#39b54a] font-medium">Founder</div>
                 </div>
               </div>
            </div>
            {/* Testimonial 2 */}
            <div className="bg-white border border-slate-200 rounded-[32px] p-10 min-w-[400px] snap-center shadow-sm">
               <div className="text-[#39b54a] text-6xl font-serif leading-none mb-6">"</div>
               <p className="text-xl font-bold mb-10 leading-relaxed">
                 It reads the actual site and names real problems, so prospects reply because the email clearly isn't a template blast.
               </p>
               <div className="flex items-center gap-4">
                 <img src="https://i.pravatar.cc/150?img=12" alt="Sanjay K" className="w-12 h-12 rounded-full border-2 border-green-100" />
                 <div>
                   <div className="font-bold">Sanjay Kumar</div>
                   <div className="text-sm text-[#39b54a] font-medium">Director</div>
                 </div>
               </div>
            </div>
            {/* Testimonial 3 */}
            <div className="bg-white border border-slate-200 rounded-[32px] p-10 min-w-[400px] snap-center shadow-sm">
               <div className="text-[#39b54a] text-6xl font-serif leading-none mb-6">"</div>
               <p className="text-xl font-bold mb-10 leading-relaxed">
                 I stopped using my old SDR tool completely. Crawlia is just lightyears ahead when it comes to personalization.
               </p>
               <div className="flex items-center gap-4">
                 <img src="https://i.pravatar.cc/150?img=15" alt="Emma S" className="w-12 h-12 rounded-full border-2 border-green-100" />
                 <div>
                   <div className="font-bold">Emma Smith</div>
                   <div className="text-sm text-[#39b54a] font-medium">CEO</div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* 8. Bottom CTA */}
        <section className="bg-[#eaf5e3] rounded-t-[60px] pt-32 pb-20 mt-20">
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-5xl font-outfit font-bold mb-10 leading-tight">
              Ready to take control of your outreach?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
              <Link href="/signup">
                <Button className="rounded-full bg-[#39b54a] hover:bg-[#2d963c] text-white font-bold h-14 px-10 text-lg shadow-xl shadow-green-500/20 border-0">
                  Start for free
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" className="rounded-full bg-white text-[var(--color-brand-ink)] font-bold h-14 px-10 text-lg border-white shadow-sm hover:bg-slate-50">
                  Book a demo
                </Button>
              </Link>
            </div>
            
            {/* Mocked footer layout within CTA area like reference image */}
            <div className="bg-white rounded-3xl p-12 text-left shadow-xl border border-white/50">
              <div className="flex flex-wrap gap-16 justify-between mb-16">
                 <div>
                   <div className="font-outfit font-extrabold text-2xl text-[var(--color-brand-ink)] mb-6 flex items-center gap-2">
                     <span className="w-6 h-6 rounded bg-[#39b54a] text-white flex items-center justify-center text-xs">C</span> Crawlia
                   </div>
                   <div className="text-xs font-semibold text-slate-400">© 2026 Crawlia Inc. All rights reserved.</div>
                 </div>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                   <div>
                     <div className="font-bold text-sm mb-4">Platform</div>
                     <ul className="space-y-3 text-sm text-slate-500 font-medium">
                       <li><Link href="/platform/website-analysis">Website Analysis</Link></li>
                       <li><Link href="/platform/website-scoring">Website Scoring</Link></li>
                       <li><Link href="/platform/personalized-writing">Personalized Writing</Link></li>
                       <li><Link href="/platform/email-sending">Email Sending</Link></li>
                       <li><Link href="/platform/fallback-handling">Fallback Handling</Link></li>
                       <li><Link href="/platform/mail-verifier">Mail Verifier</Link></li>
                       <li><Link href="/platform/team-workspace">Team Workspace</Link></li>
                       <li><Link href="/platform/crm">CRM</Link></li>
                     </ul>
                   </div>
                   <div>
                     <div className="font-bold text-sm mb-4">Resources</div>
                     <ul className="space-y-3 text-sm text-slate-500 font-medium">
                       <li><Link href="/blog">Blog</Link></li>
                       <li><Link href="/help-center">Help Center</Link></li>
                     </ul>
                   </div>
                   <div>
                     <div className="font-bold text-sm mb-4">Compare</div>
                     <ul className="space-y-3 text-sm text-slate-500 font-medium">
                       <li><Link href="/compare/apollo">vs Apollo</Link></li>
                       <li><Link href="/compare/instantly">vs Instantly</Link></li>
                     </ul>
                   </div>
                   <div>
                     <div className="font-bold text-sm mb-4">Legal</div>
                     <ul className="space-y-3 text-sm text-slate-500 font-medium">
                       <li>Privacy Policy</li>
                       <li>Terms of Service</li>
                     </ul>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
