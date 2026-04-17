"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { week: "Week 1", inflow: 12500, outflow: -8200 },
  { week: "Week 2", inflow: 9800, outflow: -6500 },
  { week: "Week 3", inflow: 15200, outflow: -11200 },
  { week: "Week 4", inflow: 8900, outflow: -7800 },
];

export function CashflowChart() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Cash Flow</CardTitle>
        <CardDescription>Weekly inflow vs outflow</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
              <XAxis
                dataKey="week"
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
                tickFormatter={(value) => `$${Math.abs(value) / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value: number) => [`$${Math.abs(value).toLocaleString()}`, ""]}
              />
              <Bar dataKey="inflow" name="Inflow" radius={[4, 4, 0, 0]}>
                {data.map((_, index) => (
                  <Cell key={`inflow-${index}`} fill="hsl(var(--chart-1))" />
                ))}
              </Bar>
              <Bar dataKey="outflow" name="Outflow" radius={[4, 4, 0, 0]}>
                {data.map((_, index) => (
                  <Cell key={`outflow-${index}`} fill="hsl(var(--chart-5))" />
                ))}
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
      </CardContent>
    </Card>
  );
}
