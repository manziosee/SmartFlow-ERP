"use client";

import { StatsCards } from "../stats-cards";
import { RevenueChart } from "../revenue-chart";
import { RecentInvoices } from "../recent-invoices";
import { AIInsights } from "../ai-insights";
import { CashflowChart } from "../cashflow-chart";

import { Button } from "@/components/ui/button";
import { UserPlus, Users, BarChart3, Settings } from "lucide-react";

export function BusinessDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 pb-2">
        <h1 className="text-2xl font-semibold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">System overview and management controls</p>
      </div>
      
      <StatsCards role="ADMIN" />
      
      <div className="flex items-center gap-3">
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-medium">
          <UserPlus className="h-4 w-4" /> Add Staff User
        </Button>
        <Button variant="outline" className="rounded-xl gap-2 font-medium border-border/50">
          <Users className="h-4 w-4" /> Manage Members
        </Button>
        <Button variant="outline" className="rounded-xl gap-2 font-medium border-border/50">
          <BarChart3 className="h-4 w-4" /> View Reports
        </Button>
        <Button variant="outline" className="rounded-xl gap-2 font-medium border-border/50">
          <Settings className="h-4 w-4" /> System Settings
        </Button>
      </div>

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
