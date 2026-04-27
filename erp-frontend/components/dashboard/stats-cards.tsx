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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.name} className="relative overflow-hidden border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] group hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-500 rounded-[2rem]">
          {/* Subtle accent gradient */}
          <div className={cn(
            "absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-30",
            stat.changeType === "positive" ? "bg-emerald-500" : 
            stat.changeType === "negative" ? "bg-rose-500" : "bg-primary"
          )} />
          
          <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.name}</CardTitle>
            <div className={cn("flex h-10 w-10 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:rotate-12",
              stat.changeType === "negative" ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" : 
              stat.changeType === "positive" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400" :
              "bg-primary/10 text-primary")}>
              <stat.icon className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-black tracking-tight mb-2 tabular-nums">
              {stat.isCurrency ? formatCurrency(stat.value as number) : stat.value}
            </div>
            <div className="flex items-center gap-2">
              <div className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter",
                stat.changeType === "positive" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" :
                stat.changeType === "negative" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" :
                "bg-muted text-muted-foreground")}>
                {stat.changeType === "positive" && <TrendingUp className="h-3 w-3" />}
                {stat.changeType === "negative" && <TrendingDown className="h-3 w-3" />}
                {stat.change}
              </div>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
