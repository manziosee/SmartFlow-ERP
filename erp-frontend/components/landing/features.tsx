import {
  FileText,
  Users,
  CreditCard,
  TrendingUp,
  Bell,
  Brain,
  Shield,
  Zap,
} from "lucide-react";

const features = [
  {
    name: "Invoice Management",
    description:
      "Create, send, and track invoices with ease. Automated reminders ensure you get paid on time.",
    icon: FileText,
  },
  {
    name: "Client Portal",
    description:
      "Give clients a dedicated space to view invoices, make payments, and communicate with your team.",
    icon: Users,
  },
  {
    name: "Payment Tracking",
    description:
      "Monitor all incoming payments, set up recurring billing, and integrate with major payment gateways.",
    icon: CreditCard,
  },
  {
    name: "Expense Management",
    description:
      "Track expenses, categorize spending, and maintain complete financial visibility.",
    icon: TrendingUp,
  },
  {
    name: "Smart Notifications",
    description:
      "Stay informed with intelligent alerts for overdue payments, upcoming deadlines, and cash flow warnings.",
    icon: Bell,
  },
  {
    name: "AI-Powered Insights",
    description:
      "Leverage machine learning to predict cash flow, identify risks, and receive actionable recommendations.",
    icon: Brain,
  },
  {
    name: "Debt Recovery",
    description:
      "Automated follow-ups and escalation workflows to recover outstanding payments efficiently.",
    icon: Shield,
  },
  {
    name: "Real-time Analytics",
    description:
      "Comprehensive dashboards with real-time data visualization for informed decision making.",
    icon: Zap,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-muted-foreground">
            Everything you need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl text-balance">
            Powerful features for modern businesses
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty">
            From invoicing to AI insights, SmartFlow provides all the tools you
            need to manage your finances efficiently.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-4 md:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.name} className="relative group">
                <div className="absolute -inset-2 rounded-lg bg-muted/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground">
                      <feature.icon className="h-5 w-5 text-background" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-4 text-base leading-7 text-muted-foreground">
                    {feature.description}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
