"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileText, Users, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { analyticsApi, type AnalyticsSummary } from "@/lib/api";

interface StatsCardsProps {
  role?: UserRole;
}

export function StatsCards({ role }: StatsCardsProps) {
  const { formatCurrency } = useCurrency();
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsApi.getSummary()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2"><Skeleton className="h-4 w-32" /></CardHeader>
            <CardContent><Skeleton className="h-8 w-24 mb-2" /><Skeleton className="h-3 w-20" /></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = data
    ? [
        {
          name: "Total Revenue",
          value: data.totalRevenue || 0,
          isCurrency: true,
          change: `${data.paidInvoices || 0} paid invoices`,
          changeType: "positive" as const,
          icon: DollarSign,
          description: "lifetime collected",
        },
        {
          name: "Outstanding Invoices",
          value: data.outstandingAmount || data.outstandingInvoices || 0,
          isCurrency: true,
          change: `${data.pendingInvoices || 0} invoices`,
          changeType: "neutral" as const,
          icon: FileText,
          description: "pending payment",
        },
        {
          name: "Active Clients",
          value: data.activeClients || 0,
          isCurrency: false,
          change: "Registered",
          changeType: "positive" as const,
          icon: Users,
          description: "in system",
        },
        {
          name: "Overdue Amount",
          value: data.overdueAmount || 0,
          isCurrency: true,
          change: "Requires attention",
          changeType: "negative" as const,
          icon: AlertTriangle,
          description: "past due date",
        },
      ]
    : [];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.name} className="relative overflow-hidden border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-4 pt-6 px-6">
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl",
              stat.changeType === "negative" ? "bg-red-50 text-red-500 dark:bg-red-950/50" : 
              stat.changeType === "positive" ? "bg-emerald-50 text-emerald-500 dark:bg-emerald-950/50" :
              "bg-blue-50 text-blue-500 dark:bg-blue-950/50")}>
              <stat.icon className="h-5 w-5" />
            </div>
            
            <div className={cn("flex items-center gap-1 text-sm font-semibold",
                stat.changeType === "positive" ? "text-emerald-500" :
                stat.changeType === "negative" ? "text-red-500" :
                "text-muted-foreground")}>
                {stat.changeType === "positive" && <TrendingUp className="h-4 w-4" />}
                {stat.changeType === "negative" && <TrendingDown className="h-4 w-4" />}
                {stat.changeType === "positive" ? "12.5%" : stat.changeType === "negative" ? "3.2%" : "0%"}
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-0">
            <div className="text-3xl font-bold tracking-tight mb-1">
              {stat.isCurrency ? formatCurrency(stat.value as number) : stat.value}
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              {stat.name}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
