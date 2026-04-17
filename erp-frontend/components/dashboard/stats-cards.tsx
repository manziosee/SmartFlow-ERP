import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileText, Users, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    name: "Total Revenue",
    value: "$124,592.00",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "vs last month",
  },
  {
    name: "Outstanding Invoices",
    value: "$23,450.00",
    change: "15 invoices",
    changeType: "neutral" as const,
    icon: FileText,
    description: "pending payment",
  },
  {
    name: "Active Clients",
    value: "48",
    change: "+3",
    changeType: "positive" as const,
    icon: Users,
    description: "new this month",
  },
  {
    name: "Overdue Payments",
    value: "$8,240.00",
    change: "6 invoices",
    changeType: "negative" as const,
    icon: AlertTriangle,
    description: "require attention",
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
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
            <div className="text-2xl font-bold">{stat.value}</div>
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
