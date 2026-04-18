"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff, Loader2, ArrowRight, Check, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const passwordRequirements = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Contains uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Contains lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "Contains a number", test: (p: string) => /\d/.test(p) },
];

const benefits = [
  {
    title: "14-day free trial",
    description: "Full access to all features, no credit card required",
  },
  {
    title: "Free migration assistance",
    description: "Our team will help you import your existing data",
  },
  {
    title: "Cancel anytime",
    description: "No long-term contracts or hidden fees",
  },
  {
    title: "24/7 support",
    description: "Get help whenever you need it from our expert team",
  },
];

const industries = [
  "Consulting & Professional Services",
  "Technology & Software",
  "E-commerce & Retail",
  "Healthcare & Medical",
  "Manufacturing",
  "Construction",
  "Marketing & Advertising",
  "Financial Services",
  "Real Estate",
  "Other",
];

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    industry: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    router.push("/dashboard");
  };

  const allPasswordRequirementsMet = passwordRequirements.every((req) =>
    req.test(formData.password)
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 mesh-gradient relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[5%] right-[10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[20%] left-[5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="w-full max-w-[540px] animate-in fade-in zoom-in-95 duration-1000">
        <div className="glass rounded-[3rem] p-8 md:p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border-white/20">
          <div className="flex flex-col items-center text-center">
            <Link href="/" className="mb-8 hover:opacity-80 transition-opacity">
              <Logo size="md" />
            </Link>
            
            {/* Progress indicator */}
            <div className="flex items-center gap-3 mb-8">
              <div className={cn("h-1.5 w-12 rounded-full transition-all duration-500", step === 1 ? "bg-primary" : "bg-primary/20")} />
              <div className={cn("h-1.5 w-12 rounded-full transition-all duration-500", step === 2 ? "bg-primary" : "bg-primary/20")} />
            </div>

            <h1 className="text-3xl font-black tracking-tighter text-gradient leading-none">
              {step === 1 ? "Start your journey" : "Secure your account"}
            </h1>
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              {step === 1 ? "Join 500+ businesses using SmartFlow." : "Create a strong password for your workspace."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            {step === 1 ? (
              <div className="space-y-4 animate-in slide-in-from-left-4 duration-500">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest ml-1 opacity-70">Full Name</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="h-14 rounded-2xl bg-background/50 border-border/50 px-5 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest ml-1 opacity-70">Work Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@company.com"
                    className="h-14 rounded-2xl bg-background/50 border-border/50 px-5 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-xs font-black uppercase tracking-widest ml-1 opacity-70">Company</Label>
                    <Input
                      id="company"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Acme Inc."
                      className="h-14 rounded-2xl bg-background/50 border-border/50 px-5 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-xs font-black uppercase tracking-widest ml-1 opacity-70">Industry</Label>
                    <Select value={formData.industry} onValueChange={(v) => setFormData({ ...formData, industry: v })}>
                      <SelectTrigger className="h-14 rounded-2xl bg-background/50 border-border/50 px-5">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        {industries.map((ind) => (
                           <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest ml-1 opacity-70">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="h-14 rounded-2xl bg-background/50 border-border/50 px-5 pr-12 transition-all"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  {formData.password && (
                    <div className="grid grid-cols-2 gap-3 p-4 bg-muted/20 rounded-2xl border border-border/50 mt-4">
                      {passwordRequirements.map((req, i) => (
                        <div key={i} className={cn("flex items-center gap-2 text-[10px] font-black uppercase tracking-wider transition-colors", req.test(formData.password) ? "text-primary" : "text-muted-foreground/50")}>
                          <div className={cn("h-1.5 w-1.5 rounded-full", req.test(formData.password) ? "bg-primary" : "bg-muted")} />
                          {req.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-start gap-3 ml-1">
                  <input type="checkbox" id="terms" required className="mt-1 h-5 w-5 rounded-lg border-border/50 bg-background/50 text-primary focus:ring-primary/20" />
                  <label htmlFor="terms" className="text-xs font-medium text-muted-foreground leading-relaxed">
                    I agree to the <Link href="#" className="font-bold text-foreground">Terms</Link> and <Link href="#" className="font-bold text-foreground">Privacy Policy</Link>.
                  </label>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {step === 2 && (
                <Button type="button" variant="outline" className="h-16 rounded-2xl px-8 font-bold order-2 sm:order-1" onClick={() => setStep(1)}>
                  Back
                </Button>
              )}
              <Button type="submit" className="flex-1 h-16 rounded-2xl text-lg font-black shadow-2xl shadow-primary/20 order-1 sm:order-2 active:scale-[0.98] transition-all" disabled={isLoading || (step === 2 && !allPasswordRequirementsMet)}>
                {isLoading ? (
                  <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Processing...</>
                ) : (
                  <>
                    {step === 1 ? "Continue" : "Create Account"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Already a member?{" "}
              <Link href="/login" className="font-black text-primary hover:underline underline-offset-4 tracking-tight">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
