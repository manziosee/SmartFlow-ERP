"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, Clock, ArrowRight, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { NavIcons } from "@/components/ui/logo";
import { toast } from "sonner";

import { aiApi } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface InsightData {
  type: string;
  priority: string;
  title: string;
  description: string;
  targetId?: string;
}

const iconMap: Record<string, any> = {
  DEBT_RECOVERY: AlertTriangle,
  CASHFLOW: TrendingUp,
  DEFAULT: Sparkles
};

const priorityStyles = {
  HIGH: "border-l-4 border-l-destructive",
  MEDIUM: "border-l-4 border-l-yellow-500",
  LOW: "border-l-4 border-l-green-500",
};

export function AIInsights() {
  const { user } = useAuth();
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      try {
        const data = await aiApi.getInsights(user?.role || "MANAGER");
        setInsights(data);
      } catch (error) {
        console.error("AI Insight Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchInsights();
  }, [user]);

  return (
    <Card className="col-span-4 rounded-[2rem] border-none shadow-xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-primary/5 pb-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <NavIcons.AIInsights />
          </div>
          <div>
            <CardTitle className="text-xl font-black">AI Insights</CardTitle>
            <CardDescription className="font-bold">Smart recommendations for your business</CardDescription>
          </div>
        </div>
        <Button variant="ghost" size="sm" asChild className="font-bold hover:bg-primary/10 transition-colors">
          <Link href="/dashboard/insights" className="gap-1">
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-black text-muted-foreground animate-pulse">Analyzing Financial Patterns...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight, index) => {
              const Icon = iconMap[insight.type] || iconMap.DEFAULT;
              return (
                <div
                  key={index}
                  className={cn(
                    "rounded-3xl bg-muted/30 p-5 transition-all hover:bg-muted/50 border border-transparent hover:border-primary/10",
                    priorityStyles[insight.priority as keyof typeof priorityStyles]
                  )}
                >
                  <div className="flex items-start gap-5">
                    <div className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-2xl flex-shrink-0 shadow-sm",
                      insight.priority === "HIGH" ? "bg-destructive/10 text-destructive" : "bg-background text-primary"
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-base">{insight.title}</h4>
                      <p className="text-sm font-bold text-muted-foreground mt-2 leading-relaxed">
                        {insight.description}
                      </p>
                      <div className="flex gap-4 mt-4">
                        <Button variant="secondary" size="sm" className="rounded-xl font-bold h-9 bg-background shadow-sm hover:shadow-md transition-all" asChild>
                          <Link href={insight.targetId ? `/dashboard/invoices/${insight.targetId}` : "/dashboard/insights"}>
                            Action Required
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {insights.length === 0 && (
               <div className="text-center py-8">
                  <p className="text-sm font-bold text-muted-foreground italic">No critical insights detected today.</p>
               </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
