"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileText, Users, AlertTriangle, TrendingUp, TrendingDown, Building2, CheckCircle2, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";

import { useAuth, UserRole } from "@/contexts/AuthContext";

interface StatsCardsProps {
  role?: UserRole;
}

export function StatsCards({ role }: StatsCardsProps) {
  const { formatCurrency } = useCurrency();

  // Define stats based on role
  const getStatsByRole = (role?: UserRole) => {
    const baseStats = [
      {
        name: "Total Revenue",
        value: 124592.00,
        isCurrency: true,
        change: "+12.5%",
        changeType: "positive" as const,
        icon: DollarSign,
        description: "vs last month",
      },
      {
        name: "Outstanding Invoices",
        value: 23450.00,
        isCurrency: true,
        change: "15 invoices",
        changeType: "neutral" as const,
        icon: FileText,
        description: "pending payment",
      },
      {
        name: "Active Clients",
        value: 48,
        isCurrency: false,
        change: "+3",
        changeType: "positive" as const,
        icon: Users,
        description: "new this month",
      },
      {
        name: "Overdue Payments",
        value: 8240.00,
        isCurrency: true,
        change: "6 invoices",
        changeType: "negative" as const,
        icon: AlertTriangle,
        description: "require attention",
      },
    ];

    if (role === "RECOVERY_AGENT") {
      return [
        {
          name: "Debt Recovered",
          value: 45000.00,
          isCurrency: true,
          change: "+RWF 1.2M",
          changeType: "positive" as const,
          icon: TrendingUp,
          description: "this week",
        },
        {
          name: "Active Cases",
          value: 12,
          isCurrency: false,
          change: "3 new",
          changeType: "neutral" as const,
          icon: FileText,
          description: "assigned to you",
        },
        {
          name: "Recovery Rate",
          value: 78,
          isCurrency: false,
          change: "+5%",
          changeType: "positive" as const,
          icon: CheckCircle2,
          description: "average success",
        },
        {
          name: "High Risk Amount",
          value: 12400.00,
          isCurrency: true,
          change: "Action needed",
          changeType: "negative" as const,
          icon: AlertTriangle,
          description: "urgent follow-up",
        },
      ];
    }

    if (role === "ACCOUNTANT") {
      return [
        {
          name: "Net Revenue",
          value: 89000.00,
          isCurrency: true,
          change: "+8%",
          changeType: "positive" as const,
          icon: DollarSign,
          description: "post-tax estimate",
        },
        {
          name: "Tax Liability",
          value: 14200.00,
          isCurrency: true,
          change: "Due in 12 days",
          changeType: "neutral" as const,
          icon: Building2,
          description: "RWF equivalent",
        },
        {
          name: "Opex Total",
          value: 23000.00,
          isCurrency: true,
          change: "+2%",
          changeType: "negative" as const,
          icon: TrendingDown,
          description: "monthly operational",
        },
        {
          name: "Payment Success",
          value: 94.5,
          isCurrency: false,
          change: "+0.5%",
          changeType: "positive" as const,
          icon: CreditCard,
          description: "gateway health",
        },
      ];
    }

    return baseStats;
  };

  const currentStats = getStatsByRole(role);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {currentStats.map((stat) => (
        <Card key={stat.name}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.name}
            </CardTitle>
            <div className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg",
              stat.changeType === "negative" ? "bg-destructive/10" : "bg-muted"
            )}>
              <stat.icon className={cn(
                "h-5 w-5",
                stat.changeType === "negative" ? "text-destructive" : "text-muted-foreground"
              )} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stat.isCurrency ? formatCurrency(stat.value as number) : stat.value}
            </div>
            <div className="flex items-center gap-1 mt-1">
              {stat.changeType === "positive" && (
                <TrendingUp className="h-4 w-4 text-green-600" />
              )}
              {stat.changeType === "negative" && (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span
                className={cn(
                  "text-sm",
                  stat.changeType === "positive" && "text-green-600",
                  stat.changeType === "negative" && "text-destructive",
                  stat.changeType === "neutral" && "text-muted-foreground"
                )}
              >
                {stat.change}
              </span>
              <span className="text-sm text-muted-foreground">
                {stat.description}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
