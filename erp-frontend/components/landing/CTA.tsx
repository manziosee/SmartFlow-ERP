import Link from 'next/link';
import { ArrowRight, CircleCheck as CheckCircle2 } from 'lucide-react';

const perks = [
  '14-day free trial',
  'No credit card required',
  'Setup in 5 minutes',
  'Cancel anytime',
];

export default function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
          Ready to stop leaving
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            money on the table?
          </span>
        </h2>
        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          Join 2,400+ businesses that use SmartFlow to collect faster, predict defaults, and grow with confidence.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          {perks.map((perk) => (
            <div key={perk} className="flex items-center gap-2 text-slate-300 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              {perk}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-cyan-600 transition-all shadow-lg hover:shadow-blue-500/30 hover:scale-105 text-base"
          >
            Start Your Free Trial
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/10 transition-all text-base"
          >
            Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}
