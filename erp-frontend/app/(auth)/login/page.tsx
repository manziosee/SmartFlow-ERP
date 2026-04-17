'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    setTimeout(() => {
      setIsLoading(false);
      // Hardcoded login check
      if (email === 'admin@smartflow.com') {
        window.location.href = '/dashboard';
      } else {
        setError('Invalid credentials. Hint: use admin@smartflow.com');
      }
    }, 1200);
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-left">
        <h2 className="text-3xl font-bold text-white tracking-tight">Welcome back</h2>
        <p className="text-slate-400 mt-2 text-sm">
          Log in to your account with our mock credentials
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl flex items-center gap-3 text-sm animate-in zoom-in-95 duration-200">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-300 font-medium">Email Address</Label>
          <Input 
            id="email" 
            name="email"
            placeholder="admin@smartflow.com" 
            defaultValue="admin@smartflow.com"
            type="email" 
            autoCapitalize="none" 
            autoComplete="email" 
            autoCorrect="off" 
            className="bg-slate-900 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 rounded-xl h-12 shadow-sm transition-all"
            required 
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-slate-300 font-medium">Password</Label>
            <Link href="#" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors">
              Forgot password?
            </Link>
          </div>
          <Input 
            id="password" 
            name="password"
            type="password"
            defaultValue="admin123"
            className="bg-slate-900 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 rounded-xl h-12 shadow-sm transition-all"
            required
          />
        </div>

        <Button 
          type="submit" 
          disabled={isLoading} 
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] rounded-xl h-12 mt-4"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Authenticating...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>Sign In Securely</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-slate-950 px-2 text-slate-500">New to SmartFlow?</span>
        </div>
      </div>

      <div className="text-center font-medium">
        <Link href="/register" className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors">
          Create a free account
        </Link>
      </div>
    </div>
  );
}
