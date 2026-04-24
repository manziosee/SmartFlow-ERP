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
        <Card key={stat.name}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.name}</CardTitle>
            <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg",
              stat.changeType === "negative" ? "bg-destructive/10" : "bg-muted")}>
              <stat.icon className={cn("h-5 w-5",
                stat.changeType === "negative" ? "text-destructive" : "text-muted-foreground")} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stat.isCurrency ? formatCurrency(stat.value as number) : stat.value}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {stat.changeType === "positive" && <TrendingUp className="h-4 w-4 text-green-600" />}
              {stat.changeType === "negative" && <TrendingDown className="h-4 w-4 text-destructive" />}
              <span className={cn("text-sm",
                stat.changeType === "positive" && "text-green-600",
                stat.changeType === "negative" && "text-destructive",
                stat.changeType === "neutral" && "text-muted-foreground")}>
                {stat.change}
              </span>
              <span className="text-sm text-muted-foreground">{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
