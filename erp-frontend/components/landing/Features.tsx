import { FileText, Brain, Bell, ChartBar as BarChart2, Users, DollarSign, Lock, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: FileText,
    color: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    title: 'Smart Invoicing',
    description: 'Create professional invoices in seconds. Auto-generate numbers, track status, and export to PDF. Due-date intelligence suggests optimal payment deadlines.',
    badge: 'Core',
  },
  {
    icon: Brain,
    color: 'from-rose-500 to-rose-600',
    bg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    title: 'AI Debt Recovery',
    description: 'Predicts who will pay late with 94% accuracy. Get risk scores per client and receive actionable recommendations — discount, reminder, or escalate.',
    badge: 'AI Powered',
  },
  {
    icon: Bell,
    color: 'from-amber-500 to-amber-600',
    bg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    title: 'Smart Reminders',
    description: 'Automated multi-channel reminders via Email & SMS. Tone auto-adjusts: Friendly → Firm → Urgent based on how overdue the payment is.',
    badge: 'Automated',
  },
  {
    icon: BarChart2,
    color: 'from-emerald-500 to-emerald-600',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    title: 'Real-Time Cashflow',
    description: 'Live cashflow dashboard with animated charts. See money in vs money out, outstanding invoices, and monthly revenue trends at a glance.',
    badge: 'Live',
  },
  {
    icon: Users,
    color: 'from-cyan-500 to-cyan-600',
    bg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
    title: 'Client Intelligence',
    description: 'Every client gets a risk profile. Track payment behavior, average delay days, total revenue, and risk score (Low / Medium / High).',
    badge: 'Analytics',
  },
  {
    icon: TrendingUp,
    color: 'from-violet-500 to-violet-600',
    bg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    title: 'AI Business Insights',
    description: '"You lose 18% revenue to late payments." Get actionable intelligence: best day for sales, revenue concentration risk, and growth opportunities.',
    badge: 'AI Powered',
  },
  {
    icon: DollarSign,
    color: 'from-teal-500 to-teal-600',
    bg: 'bg-teal-50',
    iconColor: 'text-teal-600',
    title: 'Expense Tracking',
    description: 'Track and categorize all business expenses. Calculate real profit margins and feed intelligent cashflow forecasting with accurate expense data.',
    badge: 'Finance',
  },
  {
    icon: Lock,
    color: 'from-slate-500 to-slate-600',
    bg: 'bg-slate-50',
    iconColor: 'text-slate-600',
    title: 'Role-Based Access',
    description: 'Granular permissions for Admin, Accountant, and Sales roles. Keep sensitive financial data secure while empowering your team to move fast.',
    badge: 'Security',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full mb-4">
            Platform Features
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-5">
            Everything you need to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              master your cash flow
            </span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            SmartFlow combines invoicing, AI predictions, automated workflows, and real-time analytics into one powerful platform built for SMEs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group relative bg-white border border-slate-100 rounded-2xl p-6 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 cursor-default"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 ${feat.bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${feat.iconColor}`} />
                  </div>
                  <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-base">{feat.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feat.description}</p>
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feat.color} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
