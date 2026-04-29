"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { cn } from "@/lib/utils";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { TokenExpiryWatcher } from "@/components/auth/token-expiry-watcher";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <CurrencyProvider>
      <div className="min-h-screen bg-muted/30">
        <TokenExpiryWatcher />
        <DashboardSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <DashboardHeader sidebarCollapsed={sidebarCollapsed} />
        <main
          className={cn(
            "pt-16 transition-all duration-300",
            sidebarCollapsed ? "pl-16" : "pl-64"
          )}
        >
          <div className="px-6 pt-6 pb-2">{children}</div>
        </main>
      </div>
    </CurrencyProvider>
  );
}
