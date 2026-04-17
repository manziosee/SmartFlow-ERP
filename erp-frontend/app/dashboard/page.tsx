import { StatsCards } from "@/components/dashboard/stats-cards";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { RecentInvoices } from "@/components/dashboard/recent-invoices";
import { AIInsights } from "@/components/dashboard/ai-insights";
import { CashflowChart } from "@/components/dashboard/cashflow-chart";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your business.
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-7">
        <RevenueChart />
        <CashflowChart />
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-7">
        <RecentInvoices />
        <AIInsights />
      </div>
    </div>
  );
}
