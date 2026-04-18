"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, CheckCircle2, Zap, Shield, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { value: "500+", label: "Businesses" },
  { value: "$2M+", label: "Processed" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9/5", label: "Rating" },
];

const features = [
  { icon: Zap, text: "Automated invoicing" },
  { icon: Shield, text: "AI debt recovery" },
  { icon: BarChart3, text: "Real-time analytics" },
];

export function HeroSection() {
  return (
    <section className="relative isolate pt-32 lg:pt-48 pb-24 lg:pb-40 overflow-hidden mesh-gradient">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="inline-flex items-center gap-2 rounded-2xl glass px-4 py-2 text-sm font-semibold shadow-2xl shadow-primary/5">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-secondary-foreground/80">AI-Powered Financial Intelligence</span>
              <span className="ml-1 rounded-lg bg-primary px-2 py-0.5 text-[10px] font-black uppercase text-primary-foreground tracking-widest">
                v2.0
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl xl:text-9xl text-gradient text-balance leading-[0.9] sm:leading-[0.85]">
            Smarter ERP<br />
            <span className="italic font-serif opacity-80">for modern teams.</span>
          </h1>

          {/* Subheadline */}
          <p className="mt-10 text-xl md:text-2xl leading-relaxed text-muted-foreground max-w-2xl mx-auto text-pretty font-medium opacity-80">
            SmartFlow is the financial OS for SMEs. Automated invoicing, AI debt recovery, and real-time cashflow intelligence—all in one place.
          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
            <Button size="lg" asChild className="w-full sm:w-auto h-16 px-10 text-lg font-bold rounded-2xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              <Link href="/register">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto h-16 px-10 text-lg font-bold rounded-2xl glass hover:bg-muted/50 transition-all">
              <Link href="/login">
                Sign In
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm font-semibold text-muted-foreground/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <span>14-day free trial</span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview Stage */}
        <div className="mt-32 relative perspective-1000 px-4 md:px-0">
          <div className="relative mx-auto max-w-[1000px] transform-gpu transition-all duration-700 hover:rotate-x-0 rotate-x-6 rotate-y-[-2deg] scale-110 md:scale-100">
            {/* Ambient Shadow */}
            <div className="absolute -inset-4 bg-primary/20 blur-[100px] -z-10 opacity-30" />
            
            <div className="glass rounded-[2rem] p-2 md:p-4 shadow-[0_0_100px_rgba(0,0,0,0.1)] border-white/20">
              <div className="rounded-[1.5rem] bg-card/90 shadow-2xl overflow-hidden border border-border/50">
                {/* Browser chrome */}
                <div className="bg-muted/30 px-6 py-4 flex items-center justify-between border-b border-border/50">
                  <div className="flex gap-2.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-red-400/50" />
                    <div className="w-3.5 h-3.5 rounded-full bg-amber-400/50" />
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-400/50" />
                  </div>
                  <div className="hidden sm:flex items-center gap-2 rounded-xl bg-background/50 px-6 py-2 text-xs font-bold text-muted-foreground/60 border border-border/30 backdrop-blur-md">
                    app.smartflow.io/dashboard
                  </div>
                  <div className="w-20" /> {/* Spacer */}
                </div>
                
                {/* Dashboard content */}
                <div className="p-8 md:p-12 bg-muted/10 grayscale-[0.2] hover:grayscale-0 transition-all duration-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Stats Cards Preview */}
                    {[
                      { label: "Total Revenue", val: "$124.5k", change: "+12%" },
                      { label: "Outstanding", val: "$23.4k", change: "15 pending" },
                      { label: "AI Prediction", val: "+8.2%", change: "High confidence" },
                      { label: "Active Clients", val: "48", change: "+3 this week" }
                    ].map((s, i) => (
                      <div key={i} className="bg-background/80 rounded-2xl p-6 border border-border/50 shadow-lg glow">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{s.label}</p>
                        <p className="text-3xl font-black mt-3 leading-none tracking-tighter">{s.val}</p>
                        <p className="text-[11px] text-primary mt-2 font-bold">{s.change}</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Chart placeholder */}
                  <div className="mt-8 bg-background/80 rounded-[2.5rem] p-10 border border-border/50 shadow-2xl h-80 flex items-center justify-center overflow-hidden">
                    <div className="flex items-end gap-3 h-48 w-full justify-between max-w-2xl px-4">
                      {[40, 65, 50, 85, 60, 95, 75, 90, 65, 100, 80, 92].map((h, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-full rounded-t-2xl transition-all duration-1000",
                            i === 9 ? "bg-primary shadow-[0_0_30px_rgba(var(--primary),0.3)]" : "bg-primary/20"
                          )}
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats / Proof */}
        <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-y border-border/50 py-16 px-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <span className="text-4xl md:text-5xl font-black tracking-tighter text-gradient">{stat.value}</span>
              <span className="mt-2 text-xs font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
