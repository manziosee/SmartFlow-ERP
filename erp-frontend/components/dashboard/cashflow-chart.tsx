"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrency } from "@/contexts/CurrencyContext";
import { analyticsApi, aiApi, type CashflowEntry, type CashflowForecast } from "@/lib/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

export function CashflowChart() {
  const { formatCurrency } = useCurrency();
  const [data, setData] = useState<Array<{ period: string; inflow: number; outflow: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try real analytics first, fall back to AI forecast
    const load = async () => {
      try {
        const cashflow = await analyticsApi.getCashflow();
        if (cashflow && cashflow.length > 0) {
          setData(cashflow.map((e) => ({
            period: e.period,
            inflow: e.inflow,
            outflow: -Math.abs(e.outflow),
          })));
          return;
        }
      } catch {}

      // Fallback: AI cashflow forecast
      try {
        const forecast = await aiApi.getCashflowForecast();
        setData(forecast.map((f) => ({
          period: f.period,
          inflow: f.projected_inflow,
          outflow: -Math.abs(f.projected_outflow),
        })));
      } catch {
        setData([]);
      }
    };
    load().finally(() => setLoading(false));
  }, []);

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Cash Flow</CardTitle>
        <CardDescription>Inflow vs outflow from live data</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-[250px] w-full rounded-xl" />
        ) : data.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center text-sm text-muted-foreground">
            No cashflow data available yet.
          </div>
        ) : (
          <>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="period" className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickLine={{ stroke: "hsl(var(--border))" }} />
                  <YAxis className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    tickLine={{ stroke: "hsl(var(--border))" }}
                    tickFormatter={(v) => `${formatCurrency(Math.abs(v) / 1000)}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                    formatter={(v: number) => [formatCurrency(Math.abs(v)), ""]} />
                  <Bar dataKey="inflow" name="Inflow" radius={[4, 4, 0, 0]}>
                    {data.map((_, i) => <Cell key={`in-${i}`} fill="hsl(var(--chart-1))" />)}
                  </Bar>
                  <Bar dataKey="outflow" name="Outflow" radius={[4, 4, 0, 0]}>
                    {data.map((_, i) => <Cell key={`out-${i}`} fill="hsl(var(--chart-5))" />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-1))" }} />
                <span className="text-sm text-muted-foreground">Inflow</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-5))" }} />
                <span className="text-sm text-muted-foreground">Outflow</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
