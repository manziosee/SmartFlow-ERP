"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/contexts/CurrencyContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", revenue: 12400, expenses: 8200 },
  { month: "Feb", revenue: 15600, expenses: 9100 },
  { month: "Mar", revenue: 11200, expenses: 7800 },
  { month: "Apr", revenue: 18500, expenses: 10200 },
  { month: "May", revenue: 22100, expenses: 11500 },
  { month: "Jun", revenue: 19800, expenses: 10800 },
  { month: "Jul", revenue: 24500, expenses: 12100 },
  { month: "Aug", revenue: 21300, expenses: 11200 },
  { month: "Sep", revenue: 26800, expenses: 13500 },
  { month: "Oct", revenue: 29200, expenses: 14200 },
  { month: "Nov", revenue: 31500, expenses: 15100 },
  { month: "Dec", revenue: 34200, expenses: 16400 },
];

export function RevenueChart() {
  const { formatCurrency } = useCurrency();

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>
          Monthly revenue and expenses comparison
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: "hsl(var(--muted-foreground))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                tickFormatter={(value) => formatCurrency(value / 1000) + "k"}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value: number) => [formatCurrency(value), ""]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                strokeWidth={2}
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="hsl(var(--chart-2))"
                fillOpacity={1}
                fill="url(#colorExpenses)"
                strokeWidth={2}
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-1))" }} />
            <span className="text-sm text-muted-foreground">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(var(--chart-2))" }} />
            <span className="text-sm text-muted-foreground">Expenses</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
