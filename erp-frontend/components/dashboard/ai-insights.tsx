import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, AlertTriangle, TrendingUp, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const insights = [
  {
    type: "warning",
    icon: AlertTriangle,
    title: "High-Risk Invoice Detected",
    description: "Invoice #INV-003 from Global Dynamics has a 78% probability of becoming overdue based on payment history.",
    action: "View Details",
    href: "/dashboard/invoices/INV-003",
    priority: "high",
  },
  {
    type: "opportunity",
    icon: TrendingUp,
    title: "Cash Flow Optimization",
    description: "Sending invoices 2 days earlier could improve collection time by 15%, based on your payment patterns.",
    action: "Learn More",
    href: "/dashboard/insights",
    priority: "medium",
  },
  {
    type: "reminder",
    icon: Clock,
    title: "Follow-up Recommended",
    description: "3 invoices are approaching their due dates. Sending reminders now could prevent late payments.",
    action: "Send Reminders",
    href: "/dashboard/invoices?filter=due-soon",
    priority: "medium",
  },
];

const priorityStyles = {
  high: "border-l-4 border-l-destructive",
  medium: "border-l-4 border-l-yellow-500",
  low: "border-l-4 border-l-green-500",
};

export function AIInsights() {
  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle>AI Insights</CardTitle>
            <CardDescription>Smart recommendations for your business</CardDescription>
          </div>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/insights" className="gap-1">
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={cn(
                "rounded-lg bg-muted/50 p-4",
                priorityStyles[insight.priority as keyof typeof priorityStyles]
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg flex-shrink-0",
                  insight.priority === "high" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
                )}>
                  <insight.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {insight.description}
                  </p>
                  <Button variant="link" size="sm" className="px-0 mt-2" asChild>
                    <Link href={insight.href}>
                      {insight.action}
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
