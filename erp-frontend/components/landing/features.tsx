"use client";

import {
  FileText,
  Users,
  TrendingUp,
  Shield,
  Zap,
  BarChart3,
  Bot,
  Lock,
  Layers,
  ArrowRight,
  Database,
  Cpu,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    name: "AI-Powered Insights",
    description: "Predict cashflow gaps and identify credit risks before they happen with our 'Mini CFO' engine.",
    icon: Bot,
    className: "md:col-span-2 md:row-span-2 bg-primary/5 border-primary/20",
    visual: (
      <div className="mt-8 relative h-56 w-full rounded-3xl border border-primary/10 bg-background/50 overflow-hidden p-6 shadow-inner">
        <div className="flex items-end gap-3 h-full pb-4">
          {[40, 70, 45, 90, 65, 80, 50, 85, 30, 95].map((h, i) => (
            <div 
              key={i} 
              className="flex-1 bg-gradient-to-t from-primary/40 to-primary/10 rounded-full transition-all duration-1000 animate-in fade-in slide-in-from-bottom" 
              style={{ height: `${h}%`, animationDelay: `${i * 100}ms` }} 
            />
          ))}
        </div>
        <div className="absolute top-6 left-6 flex items-center gap-2">
           <div className="bg-primary text-primary-foreground text-[10px] font-black px-3 py-1 rounded-full animate-bounce shadow-lg shadow-primary/20">
             ANOMALY DETECTED
           </div>
           <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Credit Risk: High</div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
      </div>
    )
  },
  {
    name: "Hyper Automation",
    description: "Set and forget. From recurring billing to automated debt chasing workflows.",
    icon: Zap,
    className: "md:col-span-1 md:row-span-1",
  },
  {
    name: "Cloud Secure",
    description: "Bank-grade encryption for every transaction. ISO 27001 compliant infrastructure.",
    icon: Lock,
    className: "md:col-span-1 md:row-span-1 bg-primary/5 border-primary/10",
  },
  {
    name: "Debt Recovery",
    description: "Recover 30% more overdue payments with tone-adaptive automated reminders.",
    icon: Shield,
    className: "md:col-span-2 md:row-span-1",
    visual: (
      <div className="mt-6 flex flex-wrap gap-3">
        {['FRIENDLY', 'FIRM', 'URGENT', 'LEGAL'].map((tone, i) => (
          <div key={tone} className={cn(
            "text-[9px] font-black px-4 py-1.5 rounded-full border shadow-sm transition-all hover:scale-105",
            i === 0 && "bg-emerald-50 text-emerald-600 border-emerald-100",
            i === 1 && "bg-amber-50 text-amber-600 border-amber-100",
            i === 2 && "bg-red-50 text-red-600 border-red-100",
            i === 3 && "bg-slate-900 text-white border-slate-800",
          )}>
            {tone}
          </div>
        ))}
      </div>
    )
  },
  {
    name: "Live Analytics",
    description: "Your business performance, updated in real-time. No more month-end surprises.",
    icon: BarChart3,
    className: "md:col-span-1 md:row-span-1 bg-primary/5 border-primary/20",
  },
  {
    name: "Client Hubs",
    description: "Branded self-service portals for your clients to manage invoices and payments.",
    icon: Layers,
    className: "md:col-span-1 md:row-span-1",
  }
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-32 relative overflow-hidden bg-[#fafafa]">
      {/* Background Decorative Patterns */}
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gradient-to-br from-primary/5 to-transparent blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-primary/5 to-transparent blur-3xl opacity-50" />
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mb-24 text-center md:text-left flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-primary mb-6 ml-1">
              The Enterprise Engine
            </h2>
            <p className="text-5xl font-black tracking-tighter sm:text-7xl leading-[0.9]">
              Everything you need,<br />
              <span className="text-muted-foreground/30">none of the bloat.</span>
            </p>
          </div>
          <div className="hidden md:block pb-2">
             <div className="p-4 rounded-2xl bg-white border shadow-sm flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-foreground flex items-center justify-center">
                   <TrendingUp className="h-5 w-5 text-background" />
                </div>
                <div>
                   <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">System Up-time</p>
                   <p className="text-xl font-black tabular-nums tracking-tighter">99.99%</p>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[minmax(200px,auto)]">
          {features.map((feature, i) => (
            <div
              key={i}
              className={cn(
                "group relative bg-white rounded-[2.5rem] p-10 flex flex-col transition-all duration-500 border border-black/[0.03] shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1",
                feature.className
              )}
            >
              <div className="relative z-10">
                <div className="h-14 w-14 rounded-2xl bg-foreground flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl shadow-black/10">
                  <feature.icon className="h-7 w-7 text-background" />
                </div>
                
                <h3 className="text-3xl font-black tracking-tighter mb-4 text-foreground">
                  {feature.name}
                </h3>
                <p className="text-muted-foreground font-semibold leading-relaxed text-sm lg:text-base">
                  {feature.description}
                </p>

                {feature.visual && (
                   <div className="mt-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 opacity-90">
                      {feature.visual}
                   </div>
                )}
              </div>
              
              {/* Corner Accent */}
              <div className="absolute top-6 right-6 opacity-5 group-hover:opacity-20 transition-opacity">
                 <feature.icon className="h-12 w-12" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-black/[0.05]">
           {[
             { label: "Active Transactions", value: "8.4M+", icon: Globe },
             { label: "AI Decisions / Sec", value: "1,240", icon: Cpu },
             { label: "Data Redundancy", value: "3x Tier", icon: Database },
             { label: "Network Bandwidth", value: "Tbps", icon: Zap },
           ].map((stat, i) => (
             <div key={i} className="space-y-2 flex flex-col items-center md:items-start">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                   <stat.icon className="h-3 w-3" />
                   {stat.label}
                </div>
                <div className="text-3xl font-black tracking-tighter">{stat.value}</div>
             </div>
           ))}
        </div>

        <div className="mt-20 flex justify-center">
           <button className="h-16 px-10 rounded-full bg-foreground text-background font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-3">
              Explore Enterprise Architecture
              <ArrowRight className="h-5 w-5" />
           </button>
        </div>
      </div>
    </section>
  );
}
