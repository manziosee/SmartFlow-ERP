"use client";

import { StatsCards } from "../stats-cards";
import { RevenueChart } from "../revenue-chart";
import { RecentInvoices } from "../recent-invoices";
import { AIInsights } from "../ai-insights";
import { CashflowChart } from "../cashflow-chart";

export function BusinessDashboard() {
  return (
    <div className="space-y-6">
      <StatsCards role="ADMIN" />
      <div className="grid gap-6 lg:grid-cols-7">
        <RevenueChart />
        <CashflowChart />
      </div>
      <div className="grid gap-6 lg:grid-cols-7">
        <RecentInvoices />
        <AIInsights />
      </div>
    </div>
  );
}
