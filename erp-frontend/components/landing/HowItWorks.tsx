import { FileText, Brain, TrendingUp } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: FileText,
    color: 'from-blue-500 to-blue-600',
    title: 'Connect & Invoice',
    description: 'Create your client profiles and start issuing professional invoices in minutes. SmartFlow auto-tracks every payment status in real time.',
    detail: 'Auto-number generation, PDF export, multi-currency support',
  },
  {
    step: '02',
    icon: Brain,
    color: 'from-cyan-500 to-teal-500',
    title: 'AI Predicts & Alerts',
    description: 'Our AI analyzes payment history to predict who will pay late. You get risk scores, automated reminders, and suggested actions before you even ask.',
    detail: 'Risk scoring, automated email/SMS, tone-adaptive messaging',
  },
  {
    step: '03',
    icon: TrendingUp,
    color: 'from-emerald-500 to-green-600',
    title: 'Recover & Grow',
    description: 'AI-guided debt recovery workflows help you collect faster. Real-time insights show you exactly where to focus for maximum revenue impact.',
    detail: 'Debt recovery automation, cashflow forecasting, growth insights',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-600 text-sm font-semibold rounded-full mb-4">
            How It Works
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-5">
            From invoice to cash
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
              in three simple steps
            </span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Set up in under 5 minutes. SmartFlow does the heavy lifting so your team can focus on what matters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-200 via-cyan-200 to-emerald-200" />

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="relative text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className="inline-block px-3 py-1 bg-white text-slate-400 text-xs font-bold rounded-full border border-slate-200 mb-4">
                  STEP {step.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-500 mb-4 leading-relaxed text-sm">{step.description}</p>
                <p className="text-xs text-slate-400 bg-white border border-slate-100 rounded-xl px-4 py-2 inline-block">
                  {step.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
