import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    id: "tier-starter",
    href: "/register?plan=starter",
    price: "$29",
    description: "Perfect for freelancers and small businesses getting started.",
    features: [
      "Up to 50 invoices/month",
      "Up to 25 clients",
      "Basic reporting",
      "Email support",
      "Payment tracking",
    ],
    featured: false,
  },
  {
    name: "Professional",
    id: "tier-professional",
    href: "/register?plan=professional",
    price: "$79",
    description: "Ideal for growing businesses with advanced needs.",
    features: [
      "Unlimited invoices",
      "Unlimited clients",
      "Advanced analytics",
      "AI-powered insights",
      "Debt recovery automation",
      "Priority support",
      "Custom branding",
      "API access",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    id: "tier-enterprise",
    href: "/register?plan=enterprise",
    price: "Custom",
    description: "Tailored solutions for large organizations.",
    features: [
      "Everything in Professional",
      "Dedicated account manager",
      "Custom integrations",
      "Advanced security",
      "SLA guarantee",
      "On-premise deployment option",
      "Training & onboarding",
    ],
    featured: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 sm:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-muted-foreground">
            Pricing
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl text-balance">
            Simple, transparent pricing
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground text-pretty">
            Choose the plan that fits your business. All plans include a 14-day
            free trial.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-5xl lg:grid-cols-3">
          {tiers.map((tier, tierIdx) => (
            <div
              key={tier.id}
              className={`relative flex flex-col rounded-2xl p-8 ${
                tier.featured
                  ? "bg-foreground text-background ring-1 ring-foreground z-10 lg:scale-105 shadow-xl"
                  : "bg-background ring-1 ring-border"
              } ${tierIdx === 0 ? "lg:rounded-r-none" : ""} ${
                tierIdx === 2 ? "lg:rounded-l-none" : ""
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-background px-4 py-1 text-xs font-semibold text-foreground">
                  Most Popular
                </div>
              )}
              <div className="flex items-center justify-between gap-x-4">
                <h3 className={`text-lg font-semibold leading-8 ${tier.featured ? "text-background" : ""}`}>
                  {tier.name}
                </h3>
              </div>
              <p className={`mt-4 text-sm leading-6 ${tier.featured ? "text-background/80" : "text-muted-foreground"}`}>
                {tier.description}
              </p>
              <p className="mt-6 flex items-baseline gap-x-1">
                <span className={`text-4xl font-bold tracking-tight ${tier.featured ? "text-background" : ""}`}>
                  {tier.price}
                </span>
                {tier.price !== "Custom" && (
                  <span className={`text-sm font-semibold leading-6 ${tier.featured ? "text-background/80" : "text-muted-foreground"}`}>
                    /month
                  </span>
                )}
              </p>
              <ul className={`mt-8 space-y-3 text-sm leading-6 ${tier.featured ? "text-background/90" : "text-muted-foreground"}`}>
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check className={`h-5 w-5 flex-none ${tier.featured ? "text-background" : "text-foreground"}`} aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={`mt-8 ${
                  tier.featured
                    ? "bg-background text-foreground hover:bg-background/90"
                    : ""
                }`}
                variant={tier.featured ? "secondary" : "default"}
              >
                <Link href={tier.href}>
                  {tier.price === "Custom" ? "Contact Sales" : "Get Started"}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
