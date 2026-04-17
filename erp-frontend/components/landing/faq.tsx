"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is SmartFlow ERP?",
    answer:
      "SmartFlow ERP is an AI-powered financial management platform designed for SMEs. It helps businesses manage invoices, track payments, recover debts, and gain actionable insights through advanced analytics and machine learning.",
  },
  {
    question: "How does the AI-powered insights feature work?",
    answer:
      "Our AI analyzes your financial data patterns to predict cash flow trends, identify potential payment risks, and provide actionable recommendations. It learns from your business data to give increasingly accurate predictions over time.",
  },
  {
    question: "Can I integrate SmartFlow with my existing tools?",
    answer:
      "Yes! SmartFlow integrates with popular accounting software, payment gateways, CRM systems, and banks. We also provide a robust API for custom integrations.",
  },
  {
    question: "Is my financial data secure?",
    answer:
      "Absolutely. We use bank-level encryption (AES-256) for all data, both in transit and at rest. We&apos;re SOC 2 Type II certified and GDPR compliant. Your data is never shared with third parties.",
  },
  {
    question: "What happens after the 14-day free trial?",
    answer:
      "After your trial ends, you can choose a plan that fits your needs. If you decide not to continue, your account will be downgraded to a limited free tier. Your data is retained for 30 days in case you want to reactivate.",
  },
  {
    question: "Do you offer support for migration from other systems?",
    answer:
      "Yes, we provide free migration assistance for Professional and Enterprise plans. Our team will help you import your existing data from spreadsheets, QuickBooks, Xero, and other platforms.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-24 sm:py-32 bg-muted/30">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-muted-foreground">
            FAQ
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl text-balance">
            Frequently asked questions
          </p>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Everything you need to know about SmartFlow ERP.
          </p>
        </div>

        <div className="mt-16">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
