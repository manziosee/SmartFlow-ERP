"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  AlertTriangle,
  TrendingUp,
  Clock,
  DollarSign,
  ArrowRight,
  Lightbulb,
  Target,
  ShieldCheck,
  RefreshCw,
  CheckCircle,
  XCircle,
  Sparkles,
  AlertCircle,
  Zap,
  Mail,
  Phone,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { aiApi } from "@/lib/api";
import { useEffect } from "react";


const typeConfig = {
  risk: {
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-500",
    lightBg: "bg-red-50",
    borderColor: "border-red-200",
    label: "Risk Alert",
  },
  opportunity: {
    icon: Lightbulb,
    color: "text-amber-600",
    bgColor: "bg-amber-500",
    lightBg: "bg-amber-50",
    borderColor: "border-amber-200",
    label: "Opportunity",
  },
  prediction: {
    icon: TrendingUp,
    color: "text-blue-600",
    bgColor: "bg-blue-500",
    lightBg: "bg-blue-50",
    borderColor: "border-blue-200",
    label: "Prediction",
  },
  alert: {
    icon: AlertCircle,
    color: "text-orange-600",
    bgColor: "bg-orange-500",
    lightBg: "bg-orange-50",
    borderColor: "border-orange-200",
    label: "Alert",
  },
  recommendation: {
    icon: Target,
    color: "text-emerald-600",
    bgColor: "bg-emerald-500",
    lightBg: "bg-emerald-50",
    borderColor: "border-emerald-200",
    label: "Recommendation",
  },
};

export default function AIInsightsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);

  const loadInsights = async () => {
    try {
      setRefreshing(true);
      const data = await aiApi.getInsights();
      setInsights(data.map((i: any, index: number) => ({
        ...i,
        id: index + 1,
        status: "active",
        priority: i.priority?.toLowerCase() || "medium",
        type: i.type?.toLowerCase() || "recommendation",
        impact: i.impact || "General Impact",
        created: "Just now",
        action: i.action || "Review this insight",
      })));
    } catch (err) {
      console.error("Failed to load insights", err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, []);


  const filteredInsights = insights.filter((insight) => {
    if (activeTab === "all") return insight.status === "active";
    if (activeTab === "dismissed") return insight.status === "dismissed";
    return insight.type === activeTab && insight.status === "active";
  });

  const handleRefresh = async () => {
    await loadInsights();
  };

  const stats = {
    total: insights.filter((i) => i.status === "active").length,
    highPriority: insights.filter(
      (i) => i.priority === "high" && i.status === "active"
    ).length,
    risks: insights.filter((i) => i.type === "risk" && i.status === "active")
      .length,
    opportunities: insights.filter(
      (i) => i.type === "opportunity" && i.status === "active"
    ).length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-foreground to-foreground/80 shadow-lg">
            <Brain className="h-7 w-7 text-background" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
            <p className="text-muted-foreground">
              Smart recommendations powered by machine learning
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          className="gap-2"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
          {refreshing ? "Analyzing..." : "Refresh Insights"}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="font-medium">Active Insights</CardDescription>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/10">
              <Brain className="h-5 w-5 text-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-sm text-muted-foreground mt-1">Require attention</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-red-200 bg-red-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="font-medium text-red-700">High Priority</CardDescription>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-700">{stats.highPriority}</div>
            <p className="text-sm text-red-600/70 mt-1">Need immediate action</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-orange-200 bg-orange-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="font-medium text-orange-700">Risk Alerts</CardDescription>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-700">{stats.risks}</div>
            <p className="text-sm text-orange-600/70 mt-1">Potential issues</p>
          </CardContent>
        </Card>
        <Card className="border-2 border-emerald-200 bg-emerald-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="font-medium text-emerald-700">Opportunities</CardDescription>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500">
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-700">{stats.opportunities}</div>
            <p className="text-sm text-emerald-600/70 mt-1">Growth potential</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Summary Card */}
      <Card className="overflow-hidden border-2">
        <div className="flex">
          <div className="w-2 bg-gradient-to-b from-foreground to-foreground/60" />
          <CardContent className="flex-1 pt-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-foreground shadow-md">
                <Sparkles className="h-6 w-6 text-background" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-lg">AI Analysis Summary</h3>
                  <Badge variant="outline" className="bg-foreground/5">
                    Updated just now
                  </Badge>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Based on your financial data from the past 90 days, your business
                  shows healthy growth with a <span className="font-medium text-foreground">12.5% increase in revenue</span>. However,
                  there are <span className="font-medium text-red-600">2 high-priority items</span> requiring attention: a high-risk
                  invoice and unusual expense patterns. Addressing these could
                  protect approximately <span className="font-medium text-foreground">$7,090</span> in potential losses or savings.
                </p>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Insights List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>All Insights</CardTitle>
              <CardDescription>
                AI-generated recommendations and alerts
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Active</TabsTrigger>
              <TabsTrigger value="risk">Risks</TabsTrigger>
              <TabsTrigger value="opportunity">Opportunities</TabsTrigger>
              <TabsTrigger value="prediction">Predictions</TabsTrigger>
              <TabsTrigger value="dismissed">Dismissed</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredInsights.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No insights in this category</p>
                </div>
              ) : (
                filteredInsights.map((insight) => {
                  const typeKey = Object.keys(typeConfig).includes(insight.type) ? insight.type : 'recommendation';
                  const type = typeConfig[typeKey as keyof typeof typeConfig];
                  const TypeIcon = type.icon;
                  return (
                    <div
                      key={insight.id}
                      className={cn(
                        "rounded-xl overflow-hidden border-2 transition-all hover:shadow-md",
                        type.borderColor,
                        type.lightBg
                      )}
                    >
                      {/* Colored top bar */}
                      <div className={cn("h-1.5", type.bgColor)} />
                      
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div
                            className={cn(
                              "flex h-12 w-12 items-center justify-center rounded-xl flex-shrink-0 shadow-sm",
                              type.bgColor
                            )}
                          >
                            <TypeIcon className="h-6 w-6 text-white" />
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {/* Header */}
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <h4 className="font-semibold text-lg">{insight.title}</h4>
                              <Badge className={cn("text-xs font-medium", type.bgColor, "text-white border-0")}>
                                {type.label}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-xs font-medium capitalize",
                                  insight.priority === "high" &&
                                    "bg-red-100 text-red-700 border-red-300",
                                  insight.priority === "medium" &&
                                    "bg-amber-100 text-amber-700 border-amber-300",
                                  insight.priority === "low" &&
                                    "bg-emerald-100 text-emerald-700 border-emerald-300"
                                )}
                              >
                                {insight.priority} priority
                              </Badge>
                            </div>
                            
                            {/* Description */}
                            <p className="text-muted-foreground mb-4 leading-relaxed">
                              {insight.description}
                            </p>
                            
                            {/* Recommendation box */}
                            <div className="bg-background rounded-lg p-4 border mb-4">
                              <div className="flex items-start gap-3">
                                <Zap className={cn("h-5 w-5 flex-shrink-0 mt-0.5", type.color)} />
                                <div>
                                  <span className="font-medium text-sm">Recommended:</span>
                                  <p className="text-sm text-muted-foreground mt-0.5">
                                    {insight.action}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Footer */}
                            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/50">
                              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1.5 font-medium">
                                  <DollarSign className="h-4 w-4" />
                                  <span>{insight.impact}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Clock className="h-4 w-4" />
                                  <span>{insight.created}</span>
                                </div>
                                {insight.probability && (
                                  <div className="flex items-center gap-1.5">
                                    <Target className="h-4 w-4" />
                                    <span>{insight.probability}% confidence</span>
                                  </div>
                                )}
                              </div>
                              
                              {/* Action buttons */}
                              <div className="flex items-center gap-2">
                                {insight.status === "active" && (
                                  <>
                                    <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-destructive">
                                      <XCircle className="h-4 w-4" />
                                      Dismiss
                                    </Button>
                                    <Button size="sm" className={cn("gap-1.5", type.bgColor, "hover:opacity-90")}>
                                      Take Action
                                      <ArrowRight className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                                {insight.status === "dismissed" && (
                                  <Button variant="outline" size="sm" className="gap-1.5">
                                    <CheckCircle className="h-4 w-4" />
                                    Restore
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
