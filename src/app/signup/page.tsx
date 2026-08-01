"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Zap, Loader2, Quote, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isMockLoading, setIsMockLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleCredentialsSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsMockLoading(true);
    // In a real app this would POST to /api/register then signIn
    // For demo/testing, our custom Credentials provider auto-provisions
    signIn("credentials", { email, password, callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen w-full flex bg-[var(--color-brand-canvas)]">
      {/* LEFT COLUMN: BRAND & TESTIMONIAL (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-[linear-gradient(135deg,var(--color-brand-ink)_0%,#0f172a_100%)] flex-col justify-between p-12 text-white relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-[var(--color-brand-teal)]/10 blur-[120px]" />
          <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full bg-[var(--color-brand-emerald)]/10 blur-[100px]" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 group w-fit">
            <div className="w-10 h-10 rounded-xl bg-[linear-gradient(135deg,var(--color-brand-emerald)_0%,var(--color-brand-teal)_100%)] flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-[var(--shadow-glow-teal)]">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="text-2xl font-outfit font-bold tracking-tight text-white">
              Crawlia
            </span>
          </Link>
        </div>

        {/* Testimonial / Value Prop */}
        <div className="relative z-10 max-w-xl">
          <Quote className="w-10 h-10 text-[var(--color-brand-teal)]/40 mb-6" />
          <h2 className="text-3xl md:text-4xl font-outfit font-medium leading-tight mb-8">
            "Crawlia fundamentally changed how we prospect. We replaced three different expensive tools and still saw our reply rates double within a month."
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden shrink-0">
              <img src="https://i.pravatar.cc/150?u=crawlia" alt="Sarah Jenkins" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-semibold text-white">Sarah Jenkins</p>
              <p className="text-slate-400 text-sm">VP of Growth, TechNova</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: SIGNUP FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="max-w-md w-full space-y-8">
          
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="lg:hidden flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-[linear-gradient(135deg,var(--color-brand-emerald)_0%,var(--color-brand-teal)_100%)] flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="text-2xl font-outfit font-bold tracking-tight text-[var(--color-brand-ink)]">
              Crawlia
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-outfit font-bold text-[var(--color-brand-ink)] tracking-tight">
              Start your free trial
            </h1>
            <p className="text-[var(--color-brand-slate)]">
              Join thousands of teams scaling their outreach. No credit card required.
            </p>
          </div>

          <div className="space-y-5 pt-4">
            <Button 
              variant="outline" 
              className="w-full h-14 font-semibold text-[var(--color-brand-ink)] relative flex items-center justify-center text-base hover:bg-slate-50 transition-colors border-slate-200"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isMockLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5 absolute left-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Sign up with Google
                </>
              )}
            </Button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-xs text-slate-400 uppercase tracking-wider font-semibold">Or</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <form onSubmit={handleCredentialsSignUp} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 block">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)] focus:border-transparent transition-all placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 block">Work Email</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)] focus:border-transparent transition-all placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 block">Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-teal)] focus:border-transparent transition-all placeholder:text-slate-400"
                />
              </div>

              <Button 
                type="submit"
                variant="primary" 
                className="w-full h-14 bg-[var(--color-brand-teal)] hover:bg-[var(--color-brand-emerald)] text-white text-base font-semibold transition-all mt-2"
                disabled={isGoogleLoading || isMockLoading}
              >
                {isMockLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Create my account"
                )}
              </Button>
            </form>
            
            <div className="text-center pt-2">
              <p className="text-slate-600">
                Already have an account? <Link href="/login" className="font-semibold text-[var(--color-brand-teal)] hover:text-[var(--color-brand-emerald)] transition-colors">Sign in</Link>
              </p>
            </div>
          </div>

          <div className="pt-8">
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-sm text-slate-500 leading-relaxed space-y-3">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <ShieldCheck className="w-5 h-5 text-[var(--color-brand-teal)]" />
                Secure Authentication
              </div>
              <p>
                By signing up, you agree to our <Link href="#" className="text-slate-700 hover:text-[var(--color-brand-teal)] underline underline-offset-2 transition-colors">Terms of Service</Link> and <Link href="#" className="text-slate-700 hover:text-[var(--color-brand-teal)] underline underline-offset-2 transition-colors">Privacy Policy</Link>.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
