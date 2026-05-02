"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { cn } from "@/lib/utils";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { TokenExpiryWatcher } from "@/components/auth/token-expiry-watcher";

const SIDEBAR_KEY = "smartflow:sidebar:collapsed";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(SIDEBAR_KEY) === "true";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleToggle = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_KEY, String(next));
      return next;
    });
  };

  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-muted/30">
        <TokenExpiryWatcher />

        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        <DashboardSidebar
          collapsed={sidebarCollapsed}
          onToggle={handleToggle}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />
        <DashboardHeader
          sidebarCollapsed={sidebarCollapsed}
          onMobileMenuToggle={() => setMobileOpen((o) => !o)}
        />
        <main
          className={cn(
            "pt-16 transition-all duration-300",
            "lg:pl-64",
            sidebarCollapsed && "lg:pl-16"
          )}
        >
          <div className="px-4 sm:px-6 pt-6 pb-2">{children}</div>
        </main>
      </div>
    </CurrencyProvider>
  );
}
