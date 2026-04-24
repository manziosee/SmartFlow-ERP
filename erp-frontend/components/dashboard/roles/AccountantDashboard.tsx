"use client";

import { StatsCards } from "../stats-cards";
import { RecentInvoices } from "../recent-invoices";
import { CashflowChart } from "../cashflow-chart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Receipt, CreditCard, Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import { analyticsApi, expensesApi } from "@/lib/api";

export function AccountantDashboard() {
  const [stats, setStats] = useState({
    vatSummary: 0,
    expenses: 0
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [summary, expensesList] = await Promise.all([
          analyticsApi.getSummary(),
          expensesApi.getAll()
        ]);
        const totalExp = expensesList.reduce((acc, e) => acc + e.amount, 0);
        setStats({
          vatSummary: (summary.totalRevenue || 0) * 0.18,
          expenses: totalExp
        });
      } catch (err) {
        console.error("Failed to load accountant stats", err);
      }
    }
    loadData();
  }, []);

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
            <div className="text-2xl font-bold">RWF {stats.vatSummary.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Pending for Q2 submission</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <Receipt className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">RWF {stats.expenses.toLocaleString()}</div>
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
