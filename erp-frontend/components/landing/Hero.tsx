'use client';

import Link from 'next/link';
import { ArrowRight, TrendingUp, Shield, Zap, Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoLTZ2LTZoNnptMC0xMHY2aC02di02aDZ6bS0xMCA2djZoLTZ2LTZoNnptMC0xMHY2aC02di02aDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300 text-sm font-medium mb-8 backdrop-blur-sm">
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Financial Intelligence ERP
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6">
            Stop Chasing
            <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Late Payments
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto mb-10">
            SmartFlow ERP predicts who will pay late, automates debt recovery, and gives you real-time financial intelligence — so you can focus on growing your business.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/register"
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg hover:shadow-blue-500/30 hover:scale-105 text-base"
            >
              Start Free 14-Day Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/10 transition-all text-base backdrop-blur-sm">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <Play className="w-3 h-3 fill-white" />
              </div>
              Watch Demo
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mb-16">
            {[
              { icon: TrendingUp, label: 'Revenue Recovered', value: '+31%' },
              { icon: Shield, label: 'Default Prevention', value: '94%' },
              { icon: Zap, label: 'Faster Collections', value: '3x' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                <Icon className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-blue-900/50">
            <div className="bg-slate-800/80 backdrop-blur-sm p-3 border-b border-white/10 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-slate-700/50 rounded-md h-5 w-48 mx-auto" />
              </div>
            </div>
            <div className="bg-slate-900/90 p-6">
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Revenue', value: '$196,200', color: 'text-emerald-400', bg: 'bg-emerald-500/10', up: true },
                  { label: 'Pending', value: '$29,100', color: 'text-amber-400', bg: 'bg-amber-500/10', up: null },
                  { label: 'Overdue', value: '$16,600', color: 'text-red-400', bg: 'bg-red-500/10', up: false },
                  { label: 'Cash Balance', value: '$84,300', color: 'text-blue-400', bg: 'bg-blue-500/10', up: true },
                ].map(({ label, value, color, bg }) => (
                  <div key={label} className={`${bg} rounded-xl p-3 border border-white/5`}>
                    <div className="text-slate-400 text-xs mb-1">{label}</div>
                    <div className={`font-bold text-lg ${color}`}>{value}</div>
                  </div>
                ))}
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                <div className="text-slate-400 text-xs mb-3">Monthly Cashflow</div>
                <div className="flex items-end gap-2 h-20">
                  {[42, 38, 55, 47, 63, 71, 68, 75, 82, 79, 91, 105].map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end gap-0.5">
                      <div
                        className="bg-gradient-to-t from-blue-600 to-cyan-400 rounded-sm opacity-80 hover:opacity-100 transition-opacity"
                        style={{ height: `${(val / 105) * 100}%` }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-slate-500 text-xs mt-2">
                  <span>Jan</span><span>Mar</span><span>Jun</span><span>Sep</span><span>Dec</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
