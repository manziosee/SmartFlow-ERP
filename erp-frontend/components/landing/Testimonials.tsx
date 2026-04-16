import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CFO, Apex Technologies',
    avatar: 'SC',
    avatarColor: 'from-blue-500 to-blue-600',
    stars: 5,
    quote: "SmartFlow's AI flagged 3 high-risk clients before they defaulted. We recovered $28,000 that would have been lost. The ROI is unreal — it paid for itself in the first week.",
  },
  {
    name: 'Marcus Johnson',
    role: 'Founder, GreenBuild Ltd',
    avatar: 'MJ',
    avatarColor: 'from-emerald-500 to-emerald-600',
    stars: 5,
    quote: "I used to spend 6 hours a week chasing invoices. Now the system handles it automatically — reminders go out, payments come in. I focus on building. Cashflow has never been healthier.",
  },
  {
    name: 'Priya Sharma',
    role: 'Operations Manager, DataFlow Inc',
    avatar: 'PS',
    avatarColor: 'from-rose-500 to-rose-600',
    stars: 5,
    quote: "The AI insights are genuinely useful. It told us our best sales day is Friday and that our top 3 clients drive 70% of revenue. We acted on that and grew 31% in one quarter.",
  },
  {
    name: 'Tom Walcott',
    role: 'CEO, Summit Advisory',
    avatar: 'TW',
    avatarColor: 'from-amber-500 to-amber-600',
    stars: 5,
    quote: "The debt recovery feature is incredible. It predicts which clients need escalation, suggests whether to offer a discount or firm reminder. It's like having a financial advisor built in.",
  },
  {
    name: 'Elena Rodriguez',
    role: 'Accountant, MidWest Logistics',
    avatar: 'ER',
    avatarColor: 'from-cyan-500 to-cyan-600',
    stars: 5,
    quote: "Our average collection time dropped from 45 days to 14 days after switching to SmartFlow. The automated reminder system alone was worth the subscription price.",
  },
  {
    name: 'James Park',
    role: 'Director, Horizon Media',
    avatar: 'JP',
    avatarColor: 'from-teal-500 to-teal-600',
    stars: 5,
    quote: "Clean UI, powerful automation, genuinely intelligent insights. This is what modern ERP should look like. Our entire finance team switched within a day — zero training needed.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-600 text-sm font-semibold rounded-full mb-4">
            Customer Stories
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-5">
            Trusted by 2,400+
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
              finance-forward teams
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all"
            >
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(t.stars)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="text-slate-600 text-sm leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatarColor} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{t.name}</div>
                  <div className="text-slate-400 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
