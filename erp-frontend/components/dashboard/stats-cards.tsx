"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DollarSign, FileText, Users, AlertTriangle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { analyticsApi, type AnalyticsSummary } from "@/lib/api";

interface StatsCardsProps {
  role?: UserRole;
}

function pctChange(current: number, previous: number): number | null {
  if (!previous) return null;
  return Math.round(((current - previous) / previous) * 100);
}

const REFRESH_INTERVAL = 30_000;

export function StatsCards({ role }: StatsCardsProps) {
  const { formatCurrency } = useCurrency();
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [prev, setPrev] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [current, lastMonth] = await Promise.all([
        analyticsApi.getSummary(),
        analyticsApi.getSummary("last-month").catch(() => null),
      ]);
      setData(current);
      if (lastMonth) setPrev(lastMonth);
    } catch {
      // silent on refresh failure
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(id);
  }, [fetchData]);

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
          prevValue: prev?.totalRevenue,
          isCurrency: true,
          icon: DollarSign,
          baseType: "positive" as const,
          description: `${data.paidInvoices || 0} paid invoices`,
        },
        {
          name: "Outstanding",
          value: data.outstandingAmount || data.outstandingInvoices || 0,
          prevValue: prev?.outstandingInvoices,
          isCurrency: true,
          icon: FileText,
          baseType: "neutral" as const,
          description: `${data.pendingInvoices || 0} pending`,
        },
        {
          name: "Active Clients",
          value: data.activeClients || 0,
          prevValue: prev?.activeClients,
          isCurrency: false,
          icon: Users,
          baseType: "positive" as const,
          description: "registered in system",
        },
        {
          name: "Overdue Amount",
          value: data.overdueAmount || 0,
          prevValue: prev?.overdueAmount,
          isCurrency: true,
          icon: AlertTriangle,
          baseType: "negative" as const,
          description: "past due date",
        },
      ]
    : [];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const pct = stat.prevValue != null ? pctChange(stat.value as number, stat.prevValue) : null;
        const changeType =
          pct == null ? stat.baseType
          : stat.baseType === "negative"
            ? pct > 0 ? "negative" : pct < 0 ? "positive" : "neutral"
            : pct > 0 ? "positive" : pct < 0 ? "negative" : "neutral";

        return (
          <Card key={stat.name} className="relative overflow-hidden border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-4 pt-6 px-6">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl",
                changeType === "negative" ? "bg-red-50 text-red-500 dark:bg-red-950/50" :
                changeType === "positive" ? "bg-emerald-50 text-emerald-500 dark:bg-emerald-950/50" :
                "bg-blue-50 text-blue-500 dark:bg-blue-950/50")}>
                <stat.icon className="h-5 w-5" />
              </div>

              <div className={cn("flex items-center gap-1 text-sm font-semibold",
                changeType === "positive" ? "text-emerald-500" :
                changeType === "negative" ? "text-red-500" :
                "text-muted-foreground")}>
                {pct != null ? (
                  <>
                    {pct > 0 ? <TrendingUp className="h-4 w-4" /> : pct < 0 ? <TrendingDown className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                    {pct > 0 ? "+" : ""}{pct}%
                  </>
                ) : (
                  <>
                    {changeType === "positive" && <TrendingUp className="h-4 w-4" />}
                    {changeType === "negative" && <TrendingDown className="h-4 w-4" />}
                    {changeType === "neutral" && <Minus className="h-4 w-4" />}
                    <span className="text-xs">vs last mo.</span>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-0">
              <div className="text-3xl font-bold tracking-tight mb-1">
                {stat.isCurrency ? formatCurrency(stat.value as number) : stat.value}
              </div>
              <p className="text-sm text-muted-foreground font-medium">{stat.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
