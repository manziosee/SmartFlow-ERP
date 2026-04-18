"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Menu, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function LandingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-6">
      <nav
        className={cn(
          "mx-auto max-w-5xl flex items-center justify-between rounded-2xl px-6 py-3 transition-all duration-500",
          scrolled
            ? "glass shadow-2xl shadow-primary/5 border-primary/10"
            : "bg-transparent border-transparent"
        )}
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo size="sm" />
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl p-2.5 text-foreground hover:bg-muted transition-all active:scale-95"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="h-6 w-6" />
          </button>
        </div>

        <div className="hidden lg:flex lg:gap-x-1">
          {["Features", "Pricing", "Testimonials", "FAQ"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              className="px-5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all duration-300"
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <Button variant="ghost" asChild className="font-semibold rounded-xl">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild className="gap-2 font-semibold shadow-xl shadow-primary/20 rounded-xl px-6">
            <Link href="/register">
              Get Started
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div
            className="fixed inset-0 bg-background/40 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-4 right-4 z-50 w-[calc(100%-2rem)] max-w-sm overflow-y-auto bg-background/95 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-white/10 animate-in slide-in-from-right-8 duration-500">
            <div className="flex items-center justify-between">
              <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                <Logo size="sm" />
              </Link>
              <button
                type="button"
                className="rounded-xl p-2.5 hover:bg-muted transition-all active:scale-95"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-12 flow-root">
              <div className="space-y-2 py-6">
                {["Features", "Pricing", "Testimonials", "FAQ"].map((item) => (
                  <Link
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="block rounded-2xl px-4 py-4 text-lg font-semibold hover:bg-muted transition-all active:translate-x-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </Link>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-border space-y-4">
                <Button variant="outline" className="w-full h-14 text-lg rounded-2xl" asChild>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
                </Button>
                <Button className="w-full h-14 text-lg rounded-2xl shadow-xl shadow-primary/20" asChild>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
