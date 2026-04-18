"use client";

import { useState } from "react";
import { RoleGate } from "@/components/auth/role-gate";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  RefreshCw,
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  FileText,
  AlertTriangle,
  Clock,
  DollarSign,
  TrendingUp,
  Send,
  Calendar,
  CheckCircle2,
  XCircle,
  Brain,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RecoveryCase {
  id: string;
  invoiceNumber: string;
  client: string;
  clientEmail: string;
  amount: number;
  currency: string;
  dueDate: string;
  daysOverdue: number;
  remindersCount: number;
  lastReminder: string;
  riskScore: number;
  assignedAgent: string;
  status: "pending" | "contacted" | "promised" | "failed" | "resolved";
}

const recoveryCases: RecoveryCase[] = [
  {
    id: "1",
    invoiceNumber: "INV-089",
    client: "Global Dynamics",
    clientEmail: "finance@globaldynamics.com",
    amount: 6200,
    currency: "USD",
    dueDate: "2024-01-10",
    daysOverdue: 45,
    remindersCount: 3,
    lastReminder: "3 days ago",
    riskScore: 78,
    assignedAgent: "John Doe",
    status: "contacted",
  },
  {
    id: "2",
    invoiceNumber: "INV-092",
    client: "StartUp Labs",
    clientEmail: "billing@startuplabs.io",
    amount: 3450,
    currency: "USD",
    dueDate: "2024-01-25",
    daysOverdue: 30,
    remindersCount: 2,
    lastReminder: "1 week ago",
    riskScore: 45,
    assignedAgent: "Sarah Smith",
    status: "promised",
  },
  {
    id: "3",
    invoiceNumber: "INV-098",
    client: "Digital Ventures",
    clientEmail: "accounts@digitalventures.co",
    amount: 1850,
    currency: "USD",
    dueDate: "2024-02-01",
    daysOverdue: 23,
    remindersCount: 1,
    lastReminder: "2 weeks ago",
    riskScore: 32,
    assignedAgent: "John Doe",
    status: "pending",
  },
  {
    id: "4",
    invoiceNumber: "INV-101",
    client: "NextGen Solutions",
    clientEmail: "pay@nextgen.io",
    amount: 4100,
    currency: "USD",
    dueDate: "2024-02-05",
    daysOverdue: 19,
    remindersCount: 1,
    lastReminder: "5 days ago",
    riskScore: 28,
    assignedAgent: "Sarah Smith",
    status: "pending",
  },
  {
    id: "5",
    invoiceNumber: "INV-078",
    client: "TechCorp Inc.",
    clientEmail: "billing@techcorp.com",
    amount: 2500,
    currency: "USD",
    dueDate: "2024-02-10",
    daysOverdue: 14,
    remindersCount: 0,
    lastReminder: "Never",
    riskScore: 15,
    assignedAgent: "John Doe",
    status: "pending",
  },
];

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-slate-100 text-slate-700 border-slate-200",
  },
  contacted: {
    label: "Contacted",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  promised: {
    label: "Promised Payment",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  failed: {
    label: "Failed Recovery",
    color: "bg-red-100 text-red-700 border-red-200",
  },
  resolved: {
    label: "Resolved",
    color: "bg-green-100 text-green-700 border-green-200",
  },
};

export default function RecoveryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const totalOverdue = recoveryCases.reduce((acc, inv) => acc + inv.amount, 0);
  const highRiskCount = recoveryCases.filter((inv) => inv.riskScore >= 60).length;
  const avgDaysOverdue = Math.round(
    recoveryCases.reduce((acc, inv) => acc + inv.daysOverdue, 0) / recoveryCases.length
  );

  const filteredInvoices = recoveryCases.filter((invoice) => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.client.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    return matchesSearch && invoice.status === activeTab;
  });

  const getRiskColor = (score: number) => {
    if (score >= 70) return "text-red-600 bg-red-100";
    if (score >= 40) return "text-amber-600 bg-amber-100";
    return "text-green-600 bg-green-100";
  };

  return (
    <RoleGate allowedRoles={["ADMIN", "MANAGER", "RECOVERY_AGENT"]}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
              <RefreshCw className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Recovery Cases</h1>
              <p className="text-muted-foreground">
                Turning debt into actionable recovery cases
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Brain className="h-4 w-4" />
              AI Recommendations
            </Button>
            <Button className="gap-2">
              <Send className="h-4 w-4" />
              Send Bulk Reminders
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-2 border-red-200 bg-red-50/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="font-medium text-red-700">Total Overdue</CardDescription>
              <DollarSign className="h-5 w-5 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-700">
                ${totalOverdue.toLocaleString()}
              </div>
              <p className="text-sm text-red-600/70 mt-1">
                {recoveryCases.length} active cases
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="font-medium">High Risk</CardDescription>
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{highRiskCount}</div>
              <p className="text-sm text-muted-foreground mt-1">
                Risk score {">"}60%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="font-medium">Avg Days Overdue</CardDescription>
              <Clock className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgDaysOverdue}</div>
              <p className="text-sm text-muted-foreground mt-1">
                days on average
              </p>
            </CardContent>
          </Card>
          <Card className="border-2 border-green-200 bg-green-50/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="font-medium text-green-700">Recovery Rate</CardDescription>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-700">72%</div>
              <p className="text-sm text-green-600/70 mt-1">
                +8% this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Overdue Invoices Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Overdue Cases</CardTitle>
                <CardDescription>
                  Manage and track recovery operations
                </CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search cases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="contacted">Contacted</TabsTrigger>
                <TabsTrigger value="promised">Promised</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                <div className="rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Case/Inv</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Overdue</TableHead>
                        <TableHead>Risk</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-mono font-medium">
                            {invoice.invoiceNumber}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{invoice.client}</p>
                              <p className="text-xs text-muted-foreground whitespace-nowrap">
                                {invoice.clientEmail}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-semibold">
                            ${invoice.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <span className="text-red-600 font-medium whitespace-nowrap">
                              {invoice.daysOverdue} days
                            </span>
                          </TableCell>
                          <TableCell>
                            <div
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                                getRiskColor(invoice.riskScore)
                              )}
                            >
                              {invoice.riskScore}%
                            </div>
                          </TableCell>
                          <TableCell>
                             <div className="flex items-center gap-2">
                               <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                                 {invoice.assignedAgent.split(' ').map(n => n[0]).join('')}
                               </div>
                               <span className="text-sm">{invoice.assignedAgent}</span>
                             </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                "font-medium whitespace-nowrap",
                                statusConfig[invoice.status].color
                              )}
                            >
                              {statusConfig[invoice.status].label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Mail className="h-4 w-4 mr-2" />
                                  Send Reminder
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Phone className="h-4 w-4 mr-2" />
                                  Log Call
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Clock className="h-4 w-4 mr-2" />
                                  Update Status
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <AlertTriangle className="h-4 w-4 mr-2" />
                                  Escalate
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </RoleGate>
  );
}
