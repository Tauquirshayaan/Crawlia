import Link from "next/link";
import Image from "next/image";
import { Zap, Check, ArrowRight, Star, AlertTriangle, LineChart, Mail, Users, Filter, CheckCircle2, Bot, Play, Layout, Plus, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MarketingNavbar } from "@/components/layout/MarketingNavbar";
import { MarketingFooter } from "@/components/layout/MarketingFooter";
import { FaqAccordion } from "@/components/landing/FaqAccordion";

export default function Homepage() {
  const faqQuestions = [
    { question: "Does Crawlia connect with Gmail & Outlook?", answer: "Yes! We natively support Google Workspace, Outlook, and any custom IMAP/SMTP provider. Connect unlimited accounts." },
    { question: "Can I bring my own leads?", answer: "Absolutely. You can upload CSVs of URLs or domains, and Crawlia will analyze them and enrich their contact information." },
    { question: "How does the AI analyze websites?", answer: "We run a full Playwright headless browser to load the site exactly as a user sees it, capturing screenshots, HTML, and Core Web Vitals to pass to our multimodal AI." },
    { question: "Is there a limit on emails sent?", answer: "Limits depend on your connected email accounts to preserve deliverability. We provide smart spacing and limit daily volume per inbox to protect your domain reputation." },
    { question: "Do you offer white-label reporting?", answer: "Yes, our Agency and Enterprise plans include fully white-labeled domains and reporting dashboards you can share directly with clients." }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-[#0b1c13] selection:bg-[#39b54a] selection:text-white overflow-x-hidden">
      <MarketingNavbar />
      
      {/* 1. Hero Section (Light Green) */}
      <section className="bg-[#eaf5e3] pt-40 pb-20 relative">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 z-10 relative">
            <h1 className="text-5xl md:text-7xl font-outfit font-extrabold leading-[1.05] tracking-tight">
              Analyze websites. Turn flaws into personalized outreach.
            </h1>
            <p className="text-lg text-[#0b1c13]/70 max-w-lg leading-relaxed font-medium">
              Stop sending generic cold emails. Find out exactly what's wrong with your prospects' website and pitch them exactly how to fix it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/signup">
                <Button className="rounded-full bg-[#39b54a] hover:bg-[#2d963c] text-white font-bold h-14 px-8 text-lg w-full sm:w-auto shadow-xl shadow-green-500/20 border-0">
                  Start for free
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" className="rounded-full bg-white text-[#0b1c13] font-bold h-14 px-8 text-lg w-full sm:w-auto hover:bg-slate-50 border-white shadow-sm">
                  Book a demo
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-4 pt-8">
              <div className="flex -space-x-3">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#eaf5e3] bg-slate-300 overflow-hidden flex items-center justify-center text-xs font-bold text-slate-500">
                    <img src={`https://i.pravatar.cc/100?img=${i}`} alt="Avatar" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <div className="flex gap-1 text-[#39b54a]">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <span className="text-xs font-bold mt-1">Loved by 5,000+ agencies</span>
              </div>
            </div>
          </div>

          {/* Hero UI Mockups (Image) */}
          <div className="relative w-full hidden lg:flex items-center justify-center pt-10">
            <img src="/images/mockups/hero_dashboard_1785441257803.png" alt="Hero Dashboard Mockup" className="w-full max-w-lg object-contain drop-shadow-2xl rounded-2xl" />
          </div>
        </div>
      </section>

      {/* 2. Stats Banner (Dark Green) */}
      <section className="bg-[#0b1c13] text-white py-12 relative z-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-4 text-center">
          {[
            { value: "12M+", label: "Emails Sent" },
            { value: "5,000+", label: "Happy Users" },
            { value: "12X", label: "Average ROI" },
            { value: "3x", label: "More Replies" },
            { value: "13", label: "Agency Partners" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col gap-1 px-4">
              <div className="text-3xl font-outfit font-extrabold text-[#39b54a]">{stat.value}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-white/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Dashboard Showcase (Light Green) */}
      <section className="bg-[#eaf5e3] pt-32 pb-40 text-center relative">
        <div className="max-w-4xl mx-auto px-6 mb-16">
          <div className="text-[#39b54a] font-bold text-sm tracking-widest uppercase mb-4">The Platform</div>
          <h2 className="text-4xl md:text-6xl font-outfit font-bold tracking-tight mb-6 text-[#0b1c13]">
            From 10,000 URLs <br/> to inbox-ready emails.
          </h2>
          <p className="text-lg text-[#0b1c13]/70 font-medium max-w-2xl mx-auto">
            Upload a list of websites. We scrape, analyze, and write the emails for you in seconds.
          </p>
        </div>
        
        {/* Giant Dashboard Mockup (Image) */}
        <div className="max-w-6xl mx-auto px-6">
          <img src="/images/mockups/dashboard_showcase_1785441268007.png" alt="Dashboard Showcase" className="w-full h-auto rounded-3xl shadow-2xl border border-white/50" />
        </div>
      </section>

      {/* 4. Zig-Zag Features */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-40">
          
          {/* Feature 1 */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-[#39b54a] mb-6">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-4xl font-outfit font-bold mb-4">Upload leads or let Crawlia find them for you</h3>
              <p className="text-[#0b1c13]/70 text-lg mb-8 font-medium">
                Import your own list of URLs or use our built-in Google Maps scraper to find local businesses in any niche. We'll automatically enrich them with emails, phone numbers, and social profiles.
              </p>
            </div>
            <div className="bg-[#eaf5e3] rounded-3xl p-10 flex items-center justify-center relative">
               <div className="bg-white rounded-xl shadow-xl w-full p-4 border border-green-100/50">
                 <div className="flex gap-4 mb-4 pb-4 border-b border-slate-100">
                   <div className="flex-1 h-8 bg-slate-100 rounded-md"></div>
                   <div className="w-24 h-8 bg-[#39b54a] rounded-md"></div>
                 </div>
                 <div className="space-y-3">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="flex justify-between items-center">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                         <div className="w-24 h-3 bg-slate-200 rounded"></div>
                       </div>
                       <div className="w-32 h-3 bg-slate-100 rounded hidden sm:block"></div>
                       <div className="w-16 h-6 bg-green-50 rounded-full flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-green-400"></div></div>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 bg-[#eaf5e3] rounded-3xl p-10 flex items-center justify-center">
               <div className="bg-white rounded-xl shadow-xl w-full p-6 border border-green-100/50">
                 <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600"><AlertTriangle className="w-5 h-5"/></div>
                   <div className="font-bold">Website Analysis</div>
                 </div>
                 <div className="p-4 bg-red-50 text-red-800 rounded-lg text-sm font-medium mb-3 border border-red-100">Mobile menu is not clickable on iOS Safari.</div>
                 <div className="p-4 bg-amber-50 text-amber-800 rounded-lg text-sm font-medium mb-3 border border-amber-100">Missing H1 tags on homepage.</div>
                 <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm font-medium border border-blue-100">Core Web Vitals score is 45/100 (Slow loading).</div>
               </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-[#39b54a] mb-6">
                <Layout className="w-6 h-6" />
              </div>
              <h3 className="text-4xl font-outfit font-bold mb-4">See what's wrong with every site in seconds</h3>
              <p className="text-[#0b1c13]/70 text-lg mb-8 font-medium">
                Our AI renders every website just like a real user. We capture screenshots, analyze visual hierarchy, extract SEO metadata, and find exactly what needs fixing.
              </p>
            </div>
          </div>

          {/* Feature 3 (Campaign Flow - Replaced with Image) */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-[#39b54a] mb-6">
                <Play className="w-6 h-6" />
              </div>
              <h3 className="text-4xl font-outfit font-bold mb-4">Create campaigns, follow ups and let it run automatically</h3>
              <p className="text-[#0b1c13]/70 text-lg mb-8 font-medium">
                Set up multi-step sequences. If they don't reply, Crawlia automatically follows up with another value-driven observation about their website.
              </p>
            </div>
            <div className="bg-[#eaf5e3] rounded-3xl p-10 flex items-center justify-center">
               <img src="/images/mockups/campaign_flow_1785441276865.png" alt="Campaign Workflow" className="w-full rounded-xl shadow-2xl" />
            </div>
          </div>
          
          {/* Feature 4 */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 bg-[#eaf5e3] rounded-3xl p-10 flex items-center justify-center relative">
               <div className="bg-white rounded-xl shadow-xl w-full p-6 border border-green-100/50">
                 <div className="flex items-center gap-4 border-b border-slate-100 pb-4 mb-4">
                   <div className="w-12 h-12 bg-[#39b54a] text-white rounded-full flex items-center justify-center font-bold">MS</div>
                   <div>
                     <div className="font-bold text-sm">Michael Scott</div>
                     <div className="text-xs text-slate-400">Dunder Mifflin</div>
                   </div>
                   <div className="ml-auto px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">Interested</div>
                 </div>
                 <p className="text-sm text-slate-600 font-medium leading-relaxed">"This is exactly what we need right now. I hated our mobile site anyway. Are you free for a quick chat tomorrow?"</p>
               </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-[#39b54a] mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-4xl font-outfit font-bold mb-4">Warm leads, sorted the moment they reply</h3>
              <p className="text-[#0b1c13]/70 text-lg mb-8 font-medium">
                Our AI reads every reply and categorizes them automatically. Spend time talking to people who want to buy, instead of filtering out "unsubscribe" messages.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. Agency Section (Dark Green) */}
      <section className="bg-[#0b1c13] text-white py-32 relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#39b54a]/20 blur-[120px] rounded-full pointer-events-none -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <h2 className="text-5xl md:text-6xl font-outfit font-bold leading-[1.1] mb-8">
              Crawlia is a powerful email automation tool built specific for <span className="text-[#39b54a]">web agencies</span>
            </h2>
            <Link href="/signup">
              <Button variant="outline" className="rounded-full bg-transparent border-white/30 text-white hover:bg-white hover:text-[#0b1c13] px-8 h-12 font-bold transition-colors">
                Start for free <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="bg-white/5 rounded-3xl p-4 border border-white/10 shadow-2xl backdrop-blur-sm">
             <div className="h-72 bg-slate-900 rounded-2xl border border-white/5 relative flex items-center justify-center overflow-hidden">
                {/* Simulated map/analytics */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-[#39b54a] rounded-full shadow-[0_0_20px_#39b54a]"></div>
                <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-[#39b54a] rounded-full shadow-[0_0_20px_#39b54a]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-[#39b54a] rounded-full shadow-[0_0_20px_#39b54a]"></div>
                <div className="absolute top-1/3 left-1/2 w-4 h-4 bg-[#39b54a] rounded-full shadow-[0_0_30px_#39b54a] animate-pulse"></div>
                <LineChart className="w-24 h-24 text-white/10 absolute opacity-50" />
             </div>
          </div>
        </div>
      </section>

      {/* 6. Bad vs Good Email */}
      <section className="py-32 bg-white text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-outfit font-bold mb-16 max-w-3xl mx-auto leading-tight">
            Stop sending generic emails, start sending something that <span className="text-[#39b54a]">actually matters to them.</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 text-left max-w-5xl mx-auto mb-16">
            {/* Bad Email */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-10 relative">
              <div className="absolute top-6 right-6 bg-slate-200 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase">Generic</div>
              <h3 className="font-bold mb-6 text-xl">Bad email</h3>
              <div className="space-y-4 text-slate-500 font-medium leading-relaxed">
                <p>Hi there,</p>
                <p className="bg-red-50 text-red-700 p-2 rounded line-through">We are a leading web design agency with 10 years of experience.</p>
                <p>Would you be interested in redesigning your website? We can make it look much better.</p>
                <p className="pt-4">Best, <br/> Generic Agency</p>
              </div>
            </div>
            
            {/* Good Email */}
            <div className="bg-[#eaf5e3] border border-green-200 rounded-3xl p-10 relative shadow-lg">
              <div className="absolute top-6 right-6 bg-[#39b54a] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase shadow-md">Crawlia's Personalized Email</div>
              <h3 className="font-bold mb-6 text-xl">Crawlia email</h3>
              <div className="space-y-4 text-slate-700 font-medium leading-relaxed">
                <p>Hi David,</p>
                <p>I was browsing your site on my iPhone and noticed <span className="bg-green-100 text-green-800 p-1 rounded font-bold border border-green-200">your mobile menu overlaps with the logo</span>, making it impossible to click "Book Service".</p>
                <p>Since 60% of your traffic is mobile, fixing this single issue could immediately boost your conversions.</p>
                <p className="pt-4">Best, <br/> Your Agency</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-[#eaf5e3] border border-green-200 px-8 py-4 rounded-full text-[#39b54a] font-bold text-2xl flex items-center gap-3">
              74% <span className="text-sm font-semibold text-[#0b1c13]/60 uppercase tracking-wider">Open rate</span>
            </div>
            <div className="bg-[#eaf5e3] border border-green-200 px-8 py-4 rounded-full text-[#39b54a] font-bold text-2xl flex items-center gap-3">
              12% <span className="text-sm font-semibold text-[#0b1c13]/60 uppercase tracking-wider">Reply rate</span>
            </div>
            <div className="bg-[#eaf5e3] border border-green-200 px-8 py-4 rounded-full text-[#39b54a] font-bold text-2xl flex items-center gap-3">
              0.05% <span className="text-sm font-semibold text-[#0b1c13]/60 uppercase tracking-wider">Spam rate</span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. 2x2 Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-outfit font-bold mb-6">
              Everything you need to find, verify and <span className="text-[#39b54a] block md:inline">send better cold emails.</span>
            </h2>
            <p className="text-lg text-[#0b1c13]/60 font-medium">Built for web agencies, by web agency.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#eaf5e3] p-10 rounded-[32px] h-[340px] flex flex-col justify-end relative overflow-hidden group">
               <div className="absolute top-10 left-10 right-10 h-36 bg-white rounded-2xl shadow-lg p-6 flex gap-3 justify-center items-start transform transition-transform group-hover:-translate-y-2 border border-slate-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 shadow-inner">IN</div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-600 shadow-inner">US</div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center font-bold text-red-600 shadow-inner">UK</div>
               </div>
               <h3 className="font-bold text-2xl mb-3">Email finder</h3>
               <p className="text-[#0b1c13]/70 font-medium text-base">Find verified B2B emails for local businesses anywhere in the world.</p>
            </div>
            
            <div className="bg-[#eaf5e3] p-10 rounded-[32px] h-[340px] flex flex-col justify-end relative overflow-hidden group">
               <div className="absolute top-10 left-10 right-10 h-36 bg-white rounded-2xl shadow-lg p-6 transform transition-transform group-hover:-translate-y-2 border border-slate-100 flex flex-col gap-4">
                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                    <span className="font-bold text-sm">david@example.com</span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-[10px] font-bold uppercase">Valid</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg">
                    <span className="font-bold text-sm">info@fake.com</span>
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-[10px] font-bold uppercase">Catch-all</span>
                  </div>
               </div>
               <h3 className="font-bold text-2xl mb-3">Smart verification</h3>
               <p className="text-[#0b1c13]/70 font-medium text-base">Never bounce again. Our 3-step verification keeps your sender reputation flawless.</p>
            </div>
            
            <div className="bg-[#eaf5e3] p-10 rounded-[32px] h-[340px] flex flex-col justify-end relative overflow-hidden group">
               <div className="absolute top-10 left-10 right-10 h-36 bg-white rounded-2xl shadow-lg p-6 transform transition-transform group-hover:-translate-y-2 flex flex-col justify-center border border-slate-100">
                  <div className="bg-slate-50 rounded-lg p-4 text-sm font-mono text-slate-600 border border-slate-100 font-medium">{"{{Hello|Hi|Hey}} {{firstName}},"}</div>
               </div>
               <h3 className="font-bold text-2xl mb-3">Spintax & Variables</h3>
               <p className="text-[#0b1c13]/70 font-medium text-base">Automatically rotate greetings and inject custom AI variables to bypass spam filters.</p>
            </div>
            
            <div className="bg-[#eaf5e3] p-10 rounded-[32px] h-[340px] flex flex-col justify-end relative overflow-hidden group">
               <div className="absolute top-10 left-10 right-10 h-36 bg-white rounded-2xl shadow-lg p-4 transform transition-transform group-hover:-translate-y-2 flex gap-4 border border-slate-100">
                  <div className="w-1/3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 p-2">
                    <div className="h-2 w-full bg-slate-200 rounded"></div>
                    <div className="h-2 w-3/4 bg-slate-200 rounded"></div>
                  </div>
                  <div className="w-2/3 bg-slate-50 rounded-xl border border-slate-100"></div>
               </div>
               <h3 className="font-bold text-2xl mb-3">Unified Inbox</h3>
               <p className="text-[#0b1c13]/70 font-medium text-base">Manage replies across all your sender accounts from a single beautiful dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Case Study (Dark - with Portrait Image) */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-outfit font-bold mb-10">Case studies</h2>
          <div className="bg-[#0b1c13] rounded-[40px] p-12 md:p-16 text-white flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
             {/* Subtle gradient effect */}
             <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[#39b54a]/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2"></div>
             
             <div className="max-w-xl relative z-10 flex-1">
               <div className="flex text-[#39b54a] mb-6 gap-1">
                 {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 fill-current" />)}
               </div>
               <h3 className="text-3xl md:text-4xl font-bold mb-10 font-outfit leading-tight text-white/90">
                 "We used to spend 15 hours a week analyzing websites and writing emails. Crawlia does it in 5 minutes. It's like having a senior SDR and UI Designer working 24/7."
               </h3>
               <div className="flex gap-12">
                 <div>
                   <div className="text-5xl font-extrabold text-[#39b54a] mb-2 font-outfit">57%</div>
                   <div className="text-xs font-bold uppercase tracking-widest text-white/50">Reply rate</div>
                 </div>
                 <div>
                   <div className="text-5xl font-extrabold text-[#39b54a] mb-2 font-outfit">3.4x</div>
                   <div className="text-xs font-bold uppercase tracking-widest text-white/50">More meetings</div>
                 </div>
               </div>
             </div>
             
             <div className="w-64 h-80 relative z-10 rounded-2xl overflow-hidden shrink-0 shadow-2xl border border-white/10">
               <img src="/images/mockups/case_study_portrait_1785441286091.png" alt="Founder Portrait" className="object-cover w-full h-full" />
               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 pt-12">
                 <div className="font-bold text-lg">Alex J.</div>
                 <div className="text-sm text-[#39b54a] font-medium">Founder, Digital Wave</div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ */}
      <section className="py-32 bg-white">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-12 gap-16">
          <div className="md:col-span-5">
            <h2 className="text-5xl font-outfit font-bold sticky top-32 leading-tight">Frequently asked questions</h2>
          </div>
          <div className="md:col-span-7">
            <FaqAccordion questions={faqQuestions} />
          </div>
        </div>
      </section>

      {/* 10. Bottom CTA */}
      <section className="bg-[#eaf5e3] py-40 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-white/40 rounded-full blur-[100px] -z-0"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-5xl md:text-6xl font-outfit font-bold mb-8 text-[#0b1c13] leading-tight">
            Crawlia is a powerful email automation tool built specific for <span className="text-[#39b54a]">web agencies.</span>
          </h2>
          <p className="text-xl text-[#0b1c13]/70 font-medium mb-12 max-w-2xl mx-auto">Start landing more web design clients on autopilot today.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button className="rounded-full bg-[#0b1c13] hover:bg-black text-white font-bold h-16 px-12 text-lg shadow-2xl shadow-black/10">
                Start for free
              </Button>
            </Link>
            <div className="text-sm font-semibold text-[#0b1c13]/50 sm:ml-4 flex items-center gap-2 mt-4 sm:mt-0 justify-center">
              <CheckCircle2 className="w-4 h-4 text-[#39b54a]" /> No credit card required
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
