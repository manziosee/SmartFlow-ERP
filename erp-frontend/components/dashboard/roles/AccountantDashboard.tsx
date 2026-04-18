"use client";

import { StatsCards } from "../stats-cards";
import { RecentInvoices } from "../recent-invoices";
import { CashflowChart } from "../cashflow-chart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Receipt, CreditCard, Building2 } from "lucide-react";

export function AccountantDashboard() {
  return (
    <div className="space-y-6">
      <StatsCards role="ACCOUNTANT" />
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass border-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">VAT Summary</CardTitle>
            <Building2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RWF 1,240,000</div>
            <p className="text-xs text-muted-foreground mt-1">Pending for Q2 submission</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <Receipt className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RWF 450,900</div>
            <p className="text-xs text-muted-foreground mt-1">Total operational costs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bank Sync</CardTitle>
            <CreditCard className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-green-600">Connected</div>
            <p className="text-xs text-muted-foreground mt-1">Last synced 5 mins ago</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-7">
        <div className="lg:col-span-4">
          <CashflowChart />
        </div>
        <div className="lg:col-span-3">
          <RecentInvoices />
        </div>
      </div>
    </div>
  );
}
