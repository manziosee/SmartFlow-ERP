import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-foreground px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-background sm:text-4xl text-balance">
            Ready to transform your financial operations?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-background/80">
            Join 500+ businesses already using SmartFlow to streamline their finances. Start your free trial today.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-4">
            <Button
              size="lg"
              asChild
              className="bg-background text-foreground hover:bg-background/90 gap-2"
            >
              <Link href="/register">
                Start Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-background/30 text-background hover:bg-background/10"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
          {/* Background decoration */}
          <svg
            viewBox="0 0 1024 1024"
            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            aria-hidden="true"
          >
            <circle
              cx={512}
              cy={512}
              r={512}
              fill="url(#gradient)"
              fillOpacity="0.15"
            />
            <defs>
              <radialGradient id="gradient">
                <stop stopColor="#fff" />
                <stop offset={1} stopColor="#fff" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  );
}
