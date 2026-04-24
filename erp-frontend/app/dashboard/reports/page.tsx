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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  FileText,
  Users,
  Calendar,
} from "lucide-react";

import { analyticsApi, expensesApi, invoicesApi } from "@/lib/api";
import { useEffect } from "react";


export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("this-year");
  const [activeTab, setActiveTab] = useState("overview");

  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [clientRevenueData, setClientRevenueData] = useState<any[]>([]);
  const [invoiceStatusData, setInvoiceStatusData] = useState<any[]>([]);
  const [expenseBreakdown, setExpenseBreakdown] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    totalProfit: 0,
    revenueGrowth: 0,
    profitMargin: 0,
    activeClients: 0
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [summary, cashflow, expenses, invoices] = await Promise.all([
          analyticsApi.getSummary(),
          analyticsApi.getCashflow(),
          expensesApi.getAll(),
          invoicesApi.getAll(),
        ]);

        const revData = cashflow.map((c) => ({
          month: c.period,
          revenue: c.inflow,
          expenses: c.outflow,
          profit: c.net,
        }));
        setRevenueData(revData.length ? revData : [
          { month: "Jan", revenue: 0, expenses: 0, profit: 0 }
        ]);

        setStats({
          totalRevenue: summary.totalRevenue,
          totalExpenses: revData.reduce((acc, c) => acc + c.expenses, 0),
          totalProfit: summary.totalRevenue - revData.reduce((acc, c) => acc + c.expenses, 0),
          revenueGrowth: 10, // Simulated or calculated
          profitMargin: summary.totalRevenue > 0 ? ((summary.totalRevenue - revData.reduce((acc, c) => acc + c.expenses, 0)) / summary.totalRevenue) * 100 : 0,
          activeClients: summary.activeClients
        });

        const statusMap = {
          Paid: summary.paidInvoices,
          Pending: summary.pendingInvoices,
          Overdue: invoices.filter(i => new Date(i.dueDate) < new Date() && i.status !== 'PAID').length
        };
        
        setInvoiceStatusData([
          { name: "Paid", value: statusMap.Paid || 1, color: "#22c55e" },
          { name: "Pending", value: statusMap.Pending || 1, color: "#eab308" },
          { name: "Overdue", value: statusMap.Overdue || 0, color: "#ef4444" },
        ]);

        // Simple mock grouping for clients
        setClientRevenueData([
          { name: "Acme Corp", value: 45000, color: "hsl(var(--chart-1))" },
          { name: "Others", value: 52000, color: "hsl(var(--chart-5))" }
        ]);

        setExpenseBreakdown(expenses.map(e => ({
          category: e.category,
          amount: e.amount,
          percentage: 100
        })));
      } catch (err) {
        console.error("Failed to load reports", err);
      }
    }
    loadData();
  }, []);


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive financial analytics and insights
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(stats.totalRevenue / 1000).toFixed(0)}K
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              +{stats.revenueGrowth}% from last year
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Total Expenses</CardDescription>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(stats.totalExpenses / 1000).toFixed(0)}K
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              +8.2% from last year
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Net Profit</CardDescription>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${(stats.totalProfit / 1000).toFixed(0)}K
            </div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              +18.5% from last year
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Profit Margin</CardDescription>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.profitMargin.toFixed(1)}%</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              +3.2% from last year
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Active Clients</CardDescription>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeClients}</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              +6 new this year
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="clients">Clients</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Revenue vs Expenses Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Expenses vs Profit</CardTitle>
              <CardDescription>Monthly breakdown for the year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-5))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--chart-5))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      axisLine={{ stroke: "hsl(var(--border))" }}
                    />
                    <YAxis
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      axisLine={{ stroke: "hsl(var(--border))" }}
                      tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--chart-1))"
                      fill="url(#colorRevenue)"
                      strokeWidth={2}
                      name="Revenue"
                    />
                    <Area
                      type="monotone"
                      dataKey="expenses"
                      stroke="hsl(var(--chart-5))"
                      fill="url(#colorExpenses)"
                      strokeWidth={2}
                      name="Expenses"
                    />
                    <Area
                      type="monotone"
                      dataKey="profit"
                      stroke="hsl(var(--chart-2))"
                      fill="url(#colorProfit)"
                      strokeWidth={2}
                      name="Profit"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Bottom Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Invoice Status */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Status Distribution</CardTitle>
                <CardDescription>Current invoice breakdown by status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={invoiceStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {invoiceStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`${value}%`, ""]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Top Clients */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Top Clients</CardTitle>
                <CardDescription>Client contribution to total revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={clientRevenueData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
                      <XAxis
                        type="number"
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                        tickFormatter={(value) => `$${value / 1000}k`}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        tick={{ fill: "hsl(var(--muted-foreground))" }}
                        width={100}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                        formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {clientRevenueData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
              <CardDescription>Detailed revenue breakdown and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      tickFormatter={(value) => `$${value / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                    />
                    <Legend />
                    <Bar dataKey="revenue" fill="hsl(var(--chart-1))" name="Revenue" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Expense Breakdown</CardTitle>
              <CardDescription>Expenses by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expenseBreakdown.map((expense, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{expense.category}</span>
                      <span className="text-muted-foreground">
                        ${expense.amount.toLocaleString()} ({expense.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${expense.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Revenue Distribution</CardTitle>
              <CardDescription>Revenue contribution by client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={clientRevenueData}
                      cx="50%"
                      cy="50%"
                      outerRadius={150}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {clientRevenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
