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
    <section className="relative isolate pt-28 lg:pt-36 pb-16 lg:pb-24">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-foreground/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-foreground/5 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <svg
          className="absolute inset-0 h-full w-full stroke-border/30 [mask-image:radial-gradient(100%_100%_at_top_center,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="hero-grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path d="M60 0H0V60" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 flex justify-center">
            <div className="relative inline-flex items-center gap-2 rounded-full bg-foreground/5 px-4 py-2 text-sm font-medium ring-1 ring-inset ring-foreground/10 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-foreground" />
              <span>AI-Powered Financial Intelligence</span>
              <span className="ml-1 rounded-full bg-foreground px-2 py-0.5 text-xs font-semibold text-background">
                New
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl text-balance">
            <span className="block">Finance operations</span>
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/80 to-foreground">
              simplified with AI
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto text-pretty">
            SmartFlow ERP empowers SMEs to manage invoices, track payments, recover debts, and gain AI-powered insights to make smarter business decisions.
          </p>

          {/* Feature highlights */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                <feature.icon className="h-4 w-4 text-foreground" />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild className="gap-2 h-12 px-8 text-base shadow-lg shadow-foreground/10">
              <Link href="/register">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="gap-2 h-12 px-8 text-base">
              <Link href="#demo">
                <Play className="h-4 w-4" />
                Watch Demo
              </Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <span>No credit card required</span>
            <span className="text-border">|</span>
            <span>14-day free trial</span>
            <span className="text-border">|</span>
            <span>Cancel anytime</span>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-2xl mx-auto">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center rounded-2xl bg-foreground/5 border border-border/50 p-6 backdrop-blur-sm"
            >
              <span className="text-3xl font-bold tracking-tight">{stat.value}</span>
              <span className="mt-1 text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Dashboard Preview */}
        <div className="mt-20 flow-root">
          <div className="relative -m-2 rounded-2xl bg-foreground/5 p-2 ring-1 ring-inset ring-border/50 lg:-m-4 lg:rounded-3xl lg:p-4">
            <div className="rounded-xl bg-background shadow-2xl ring-1 ring-border overflow-hidden">
              {/* Browser chrome */}
              <div className="bg-muted/50 px-4 py-3 flex items-center gap-3 border-b border-border">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-2 rounded-lg bg-background px-4 py-1.5 text-xs text-muted-foreground border border-border">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    app.smartflow.io/dashboard
                  </div>
                </div>
              </div>
              
              {/* Dashboard content */}
              <div className="p-6 bg-muted/20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Stats Cards */}
                  <div className="bg-background rounded-xl p-5 border border-border shadow-sm">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Revenue</p>
                    <p className="text-2xl font-bold mt-2">$124,500</p>
                    <p className="text-xs text-green-600 mt-1 font-medium">+12.5% from last month</p>
                  </div>
                  <div className="bg-background rounded-xl p-5 border border-border shadow-sm">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Outstanding</p>
                    <p className="text-2xl font-bold mt-2">$23,450</p>
                    <p className="text-xs text-muted-foreground mt-1">15 invoices pending</p>
                  </div>
                  <div className="bg-background rounded-xl p-5 border border-border shadow-sm">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Paid This Month</p>
                    <p className="text-2xl font-bold mt-2">$89,320</p>
                    <p className="text-xs text-green-600 mt-1 font-medium">+8.2% collection rate</p>
                  </div>
                  <div className="bg-background rounded-xl p-5 border border-border shadow-sm">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">AI Insights</p>
                    <p className="text-2xl font-bold mt-2">8 Actions</p>
                    <p className="text-xs text-foreground mt-1 font-medium">3 high priority</p>
                  </div>
                </div>
                
                {/* Chart placeholder */}
                <div className="mt-4 bg-background rounded-xl p-6 border border-border h-52 flex items-center justify-center shadow-sm">
                  <div className="flex flex-col items-center gap-3 w-full max-w-md">
                    <div className="flex items-end gap-1.5 h-28 w-full justify-center">
                      {[35, 55, 40, 70, 50, 85, 65, 80, 55, 90, 70, 82].map((h, i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-6 rounded-t-md transition-all",
                            i === 11 ? "bg-foreground" : "bg-foreground/20"
                          )}
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">Monthly Revenue Trend (2024)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-16 flex flex-col items-center gap-6">
          <p className="text-sm text-muted-foreground">Trusted by forward-thinking businesses</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {["TechCorp", "Finova", "GlobalTrade", "NextGen", "SwiftPay"].map((name) => (
              <div key={name} className="text-xl font-bold tracking-tight text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
