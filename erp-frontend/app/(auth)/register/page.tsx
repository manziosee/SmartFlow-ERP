'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      window.location.href = '/dashboard';
    }, 1500);
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-left">
        <h2 className="text-3xl font-bold text-white tracking-tight">Create an account</h2>
        <p className="text-slate-400 mt-2 text-sm">
          Get started with your free 14-day trial (Mock Data filled)
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
             <Label htmlFor="firstName" className="text-slate-300 font-medium">First Name</Label>
             <Input 
               id="firstName" 
               defaultValue="Alex"
               className="bg-slate-900 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 rounded-xl h-12 shadow-sm transition-all"
               required 
             />
          </div>
          <div className="space-y-2">
             <Label htmlFor="lastName" className="text-slate-300 font-medium">Last Name</Label>
             <Input 
               id="lastName" 
               defaultValue="Mercer"
               className="bg-slate-900 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 rounded-xl h-12 shadow-sm transition-all"
               required 
             />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="company" className="text-slate-300 font-medium">Company Name</Label>
          <Input 
            id="company" 
            defaultValue="Apex Technologies Inc."
            className="bg-slate-900 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 rounded-xl h-12 shadow-sm transition-all"
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-300 font-medium">Work Email</Label>
          <Input 
            id="email" 
            type="email" 
            defaultValue="alex.mercer@apex.com"
            autoCapitalize="none" 
            autoComplete="email" 
            autoCorrect="off" 
            className="bg-slate-900 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-cyan-500 focus-visible:border-cyan-500 rounded-xl h-12 shadow-sm transition-all"
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-300 font-medium">Password</Label>
          <Input 
            id="password" 
            type="password"
            defaultValue="SecurePassword123!"
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
               <span>Setting up workspace...</span>
             </div>
          ) : (
             <div className="flex items-center gap-2">
               <span>Start Free Trial</span>
               <ArrowRight className="w-4 h-4" />
             </div>
          )}
        </Button>
      </form>

      <div className="text-center text-sm font-medium">
        <span className="text-slate-500">Already have an account? </span>
        <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors ml-1">
          Sign In
        </Link>
      </div>
    </div>
  );
}
