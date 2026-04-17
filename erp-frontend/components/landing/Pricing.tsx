'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    monthly: 29,
    annual: 23,
    description: 'Perfect for freelancers and micro-businesses',
    color: 'border-slate-200',
    buttonClass: 'bg-slate-900 text-white hover:bg-slate-800',
    popular: false,
    features: [
      'Up to 50 invoices/month',
      '5 active clients',
      'Basic payment tracking',
      'Email reminders',
      'PDF exports',
      'Basic dashboard',
    ],
  },
  {
    name: 'Growth',
    monthly: 79,
    annual: 63,
    description: 'For growing SMEs that need intelligent automation',
    color: 'border-blue-500',
    buttonClass: 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600',
    popular: true,
    features: [
      'Unlimited invoices',
      'Unlimited clients',
      'AI risk scoring',
      'Email + SMS reminders',
      'Smart debt recovery',
      'Real-time cashflow dashboard',
      'AI business insights',
      'Expense tracking',
    ],
  },
  {
    name: 'Enterprise',
    monthly: 199,
    annual: 159,
    description: 'For teams requiring advanced controls and integrations',
    color: 'border-slate-200',
    buttonClass: 'bg-slate-900 text-white hover:bg-slate-800',
    popular: false,
    features: [
      'Everything in Growth',
      'Multi-user teams (up to 25)',
      'Role-based access control',
      'Priority AI model',
      'API access',
      'Custom integrations',
      'Dedicated account manager',
      'SLA support',
    ],
  },
];

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full mb-4">
            Simple Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-5">
            Plans that grow
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              with your business
            </span>
          </h2>
          <div className="inline-flex items-center gap-3 bg-slate-100 rounded-full p-1 mt-4">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${!annual ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${annual ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
            >
              Annual
              <span className="ml-1.5 text-xs text-emerald-600 font-bold">-20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border-2 ${plan.color} p-8 ${plan.popular ? 'shadow-2xl shadow-blue-100 scale-105' : 'hover:shadow-lg'} transition-all`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
                    <Zap className="w-3 h-3" /> MOST POPULAR
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-1">{plan.name}</h3>
                <p className="text-sm text-slate-500">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">
                    ${annual ? plan.annual : plan.monthly}
                  </span>
                  <span className="text-slate-500 text-sm mb-1">/mo</span>
                </div>
                {annual && (
                  <p className="text-xs text-emerald-600 font-medium mt-1">Billed annually — save ${(plan.monthly - plan.annual) * 12}/year</p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`block text-center py-3 px-6 rounded-xl font-semibold text-sm ${plan.buttonClass} transition-all`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-slate-400 mt-10">
          All plans include 14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  );
}
