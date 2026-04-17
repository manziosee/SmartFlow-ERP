"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  Book,
  MessageCircle,
  Mail,
  Phone,
  Video,
  FileText,
  HelpCircle,
  ExternalLink,
  Loader2,
} from "lucide-react";

const faqs = [
  {
    question: "How do I create a new invoice?",
    answer:
      "Navigate to the Invoices page and click the 'Create Invoice' button in the top right corner. Fill in the client details, add line items for your products or services, set the due date, and click 'Create & Send' to send it to your client.",
  },
  {
    question: "How do I add a new client?",
    answer:
      "Go to the Clients page and click 'Add Client'. Enter the client's name, company, email, phone, and address. You can also add notes about the client for future reference.",
  },
  {
    question: "What payment methods are supported?",
    answer:
      "SmartFlow supports multiple payment methods including credit/debit cards, bank transfers, and PayPal. You can configure your preferred payment gateways in Settings > Billing.",
  },
  {
    question: "How does the AI insights feature work?",
    answer:
      "Our AI analyzes your financial data patterns to identify risks, opportunities, and trends. It provides actionable recommendations like predicting which invoices might become overdue, optimal times to send invoices, and cash flow forecasts.",
  },
  {
    question: "Can I customize invoice templates?",
    answer:
      "Yes! Go to Settings > Company to upload your logo and configure default invoice settings. You can customize the invoice number format, default payment terms, and add custom notes that appear on all invoices.",
  },
  {
    question: "How do I export my data?",
    answer:
      "Each module (Invoices, Clients, Payments, Expenses) has an Export button that allows you to download your data in CSV or PDF format. You can also generate comprehensive reports from the Reports page.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use bank-level encryption (AES-256) for all data, both in transit and at rest. We're SOC 2 Type II certified and GDPR compliant. Your data is never shared with third parties.",
  },
  {
    question: "How do I cancel my subscription?",
    answer:
      "You can cancel your subscription at any time from Settings > Billing > Cancel Subscription. Your data will be retained for 30 days after cancellation in case you want to reactivate.",
  },
];

const resources = [
  {
    title: "Getting Started Guide",
    description: "Learn the basics of SmartFlow ERP",
    icon: Book,
    href: "#",
  },
  {
    title: "Video Tutorials",
    description: "Step-by-step video walkthroughs",
    icon: Video,
    href: "#",
  },
  {
    title: "API Documentation",
    description: "Integrate SmartFlow with your tools",
    icon: FileText,
    href: "#",
  },
  {
    title: "Knowledge Base",
    description: "In-depth articles and guides",
    icon: HelpCircle,
    href: "#",
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground mt-2">
          Find answers to common questions or get in touch with our support team
        </p>
      </div>

      {/* Search */}
      <div className="max-w-xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-4">
        {resources.map((resource) => (
          <Card
            key={resource.title}
            className="hover:shadow-md transition-shadow cursor-pointer"
          >
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <resource.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{resource.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {resource.description}
                </p>
                <Button variant="link" className="mt-2 gap-1 p-0">
                  Learn more
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No results found for &quot;{searchQuery}&quot;</p>
                <p className="text-sm mt-1">Try a different search term</p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardContent>
        </Card>

        {/* Contact Support */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Can&apos;t find what you&apos;re looking for? Send us a message.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="What do you need help with?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your issue in detail..."
                    rows={4}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Other Ways to Reach Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-sm text-muted-foreground">
                    support@smartflow.com
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-sm text-muted-foreground">
                    +1 (800) 123-4567 (Mon-Fri, 9am-6pm EST)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <MessageCircle className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Live Chat</p>
                  <p className="text-sm text-muted-foreground">
                    Available for Pro and Enterprise plans
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
