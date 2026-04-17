import { ReactNode } from 'react';
import Link from 'next/link';
import { Zap, Quote, Star } from 'lucide-react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 flex selection:bg-cyan-500/30 font-sans">
      
      {/* Left Pane - Premium Branded Section */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border-r border-white/10 text-white p-12 flex-col justify-between overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoLTZ2LTZoNnptMC0xMHY2aC02di02aDZ6bS0xMCA2djZoLTZ2LTZoNnptMC0xMHY2aC02di02aDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30 pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-400 p-2.5 rounded-xl shadow-lg shadow-cyan-500/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold tracking-tight text-white">SmartFlow</span>
          </Link>
        </div>

        <div className="relative z-10 max-w-lg mt-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Star className="w-3.5 h-3.5 fill-cyan-400" /> Premium ERP
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight mb-6">
            Stop Chasing <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Late Payments.</span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            SmartFlow is the AI-powered financial ERP that automatically tracks invoices, predicts defaulters, and recovers your revenue.
          </p>
        </div>

        <div className="relative z-10 mt-auto bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
          <Quote className="w-8 h-8 text-cyan-500/50 mb-3" />
          <p className="text-slate-200 font-medium leading-relaxed mb-4">
            "Before SmartFlow, we manually hunted down 200+ invoices across spreadsheets. Now the AI handles reminders and predicts our cash flow with precision. Literally saved our business."
          </p>
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"></div>
             <div>
               <div className="font-bold text-white text-sm">Sarah Jenkins</div>
               <div className="text-xs text-slate-400">CFO, Apex Technologies</div>
             </div>
          </div>
        </div>
      </div>

      {/* Right Pane - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-950 relative overflow-hidden">
        {/* Subtle glow behind the form */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="w-full max-w-md relative z-10">
           {children}
        </div>
      </div>

    </div>
  );
}
