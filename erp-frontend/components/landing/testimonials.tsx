const testimonials = [
  {
    content:
      "SmartFlow has transformed how we manage our finances. The AI insights alone have saved us thousands in potential bad debt.",
    author: "Sarah Chen",
    role: "CFO, TechStart Inc.",
    avatar: "SC",
  },
  {
    content:
      "The debt recovery automation is incredible. We reduced our outstanding invoices by 40% in the first three months.",
    author: "Michael Rodriguez",
    role: "Owner, Rodriguez Consulting",
    avatar: "MR",
  },
  {
    content:
      "Finally, an ERP that understands small business needs. Simple to use yet powerful enough to scale with us.",
    author: "Emily Thompson",
    role: "Founder, Creative Solutions",
    avatar: "ET",
  },
  {
    content:
      "The real-time analytics dashboard gives me complete visibility into our cash flow. It&apos;s like having a financial advisor on call 24/7.",
    author: "David Kim",
    role: "Managing Director, Kim & Associates",
    avatar: "DK",
  },
  {
    content:
      "We switched from a legacy ERP and the difference is night and day. SmartFlow is intuitive, fast, and actually enjoyable to use.",
    author: "Lisa Patel",
    role: "Operations Manager, Patel Industries",
    avatar: "LP",
  },
  {
    content:
      "The AI-powered predictions have helped us make better decisions about when to extend credit and when to be cautious.",
    author: "James Wilson",
    role: "Finance Director, Wilson Group",
    avatar: "JW",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-muted-foreground">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl text-balance">
            Loved by businesses worldwide
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col justify-between rounded-2xl bg-muted/30 p-8 ring-1 ring-border hover:ring-foreground/20 transition-all"
            >
              <blockquote className="text-base leading-7 text-foreground">
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground text-background text-sm font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
