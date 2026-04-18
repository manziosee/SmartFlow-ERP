"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import { Eye, EyeOff, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { useAuth, UserRole } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Mock Role Logic based on input
    let role: UserRole = "MANAGER";
    let name = "Manager User";
    
    if (formData.email.includes("admin")) {
      role = "ADMIN";
      name = "System Administrator";
    } else if (formData.email.includes("recovery")) {
      role = "RECOVERY_AGENT";
      name = "Recovery Specialist";
    } else if (formData.email.includes("accountant")) {
      role = "ACCOUNTANT";
      name = "Senior Accountant";
    } else if (formData.email.includes("client")) {
      role = "CLIENT";
      name = "External Client";
    }

    login("mock-jwt-token", {
      id: "user-123",
      email: formData.email,
      name: name,
      role: role,
    });

    setIsLoading(false);
    
    // Redirect based on role
    if (role === "RECOVERY_AGENT") {
      router.push("/dashboard/recovery");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 mesh-gradient relative overflow-hidden">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-[10%] left-[15%] w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[15%] w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-[480px] animate-in fade-in zoom-in-95 duration-1000">
        <div className="glass rounded-[3rem] p-8 md:p-12 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] border-white/20">
          <div className="flex flex-col items-center text-center">
            <Link href="/" className="mb-10 hover:opacity-80 transition-opacity">
              <Logo size="md" />
            </Link>
            <h1 className="text-3xl font-black tracking-tighter text-gradient leading-none">
              Welcome back
            </h1>
            <p className="mt-3 text-sm font-medium text-muted-foreground">
              Enter your credentials to access your workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-12 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest ml-1 opacity-70">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@company.com"
                className="h-14 rounded-2xl bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all px-5"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest opacity-70">
                  Password
                </Label>
                <Link href="/forgot-password" title="Forgot password?" className="text-xs font-bold text-primary hover:underline underline-offset-4">
                  Reset
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="h-14 rounded-2xl bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all px-5 pr-12"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-1">
              <div className="relative flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-5 w-5 rounded-lg border-border/50 bg-background/50 text-primary cursor-pointer focus:ring-primary/20"
                />
              </div>
              <label htmlFor="remember" className="text-sm font-medium text-muted-foreground cursor-pointer select-none">
                Stay signed in
              </label>
            </div>

            <Button type="submit" className="w-full h-16 rounded-2xl text-lg font-black shadow-2xl shadow-primary/20 active:scale-[0.98] transition-all" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-10">
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-border/50"></div>
              <span className="flex-shrink mx-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">
                Or Continue With
              </span>
              <div className="flex-grow border-t border-border/50"></div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <Button variant="outline" className="h-14 rounded-2xl font-bold bg-background/30 border-border/50 hover:bg-muted/50 transition-all">
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="h-14 rounded-2xl font-bold bg-background/30 border-border/50 hover:bg-muted/50 transition-all">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Button>
            </div>
          </div>

          <div className="mt-12 text-center pb-2">
            <p className="text-sm font-medium text-muted-foreground">
              New to SmartFlow?{" "}
              <Link href="/register" className="font-black text-primary hover:underline underline-offset-4 tracking-tight">
                Create a Free Account
              </Link>
            </p>
          </div>
          <div className="mt-8 pt-8 border-t border-border/50">
            <p className="text-sm font-bold text-center text-muted-foreground mb-6 uppercase tracking-widest">
              Quick Access Demo Accounts
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { name: "System Admin", role: "ADMIN", email: "admin@smartflow.com", color: "text-red-600 bg-red-50/50" },
                { name: "Global Manager", role: "MANAGER", email: "manager@smartflow.com", color: "text-blue-600 bg-blue-50/50" },
                { name: "Sr Accountant", role: "ACCOUNTANT", email: "accountant@smartflow.com", color: "text-emerald-600 bg-emerald-50/50" },
                { name: "Recovery Agent", role: "RECOVERY_AGENT", email: "recovery@smartflow.com", color: "text-amber-600 bg-amber-50/50" },
                { name: "External Client", role: "CLIENT", email: "client@smartflow.com", color: "text-slate-600 bg-slate-50/50" },
              ].map((demo) => (
                <button
                  key={demo.role}
                  onClick={() => {
                    setFormData({ email: demo.email, password: "password123" });
                    // Optionally auto-submit
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-xl border border-transparent hover:border-border transition-all group",
                    demo.color
                  )}
                >
                  <span className="text-[10px] font-black uppercase mb-1">{demo.role.replace('_', ' ')}</span>
                  <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{demo.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
