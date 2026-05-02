"use client";

import { useState } from "react";
import { PageSkeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Download,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  CreditCard,
  Building,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { paymentsApi } from "@/lib/api";
import { useEffect } from "react";
import { useCurrency } from "@/contexts/CurrencyContext";

import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { SortableHeader } from "@/components/ui/sortable-header";
import { useTable } from "@/hooks/use-table";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";


const statusConfig = {
  completed: {
    label: "Completed",
    icon: CheckCircle,
    className: "bg-green-100 text-green-700 border-green-200",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  failed: {
    label: "Failed",
    icon: Clock,
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

const methodConfig = {
  credit_card: { label: "Credit Card", icon: CreditCard },
  bank_transfer: { label: "Bank Transfer", icon: Building },
  paypal: { label: "PayPal", icon: Wallet },
};

export default function PaymentsPage() {
  const { formatCurrency } = useCurrency();
  const [payments, setPayments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  const loadPayments = async () => {
    try {
      setIsLoading(true);
      const data = await paymentsApi.getAll();
      setPayments(data);
    } catch (err) {
      console.error("Failed to load payments", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);


  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      (payment.client || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (payment.id?.toString() || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (payment.invoice?.id?.toString() || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const { sort, toggleSort, page, setPage, pageSize, setPageSize, paginated: pagedPayments, total: filteredTotal } =
    useTable(filteredPayments, { pageSize: 20 });

  const stats = {
    total: payments.reduce((acc, p) => acc + p.amount, 0),
    completed: payments
      .filter((p) => p.status === "completed")
      .reduce((acc, p) => acc + p.amount, 0),
    pending: payments
      .filter((p) => p.status === "pending")
      .reduce((acc, p) => acc + p.amount, 0),
    thisMonth: payments.length,
  };

  if (isLoading) return <PageSkeleton cards={3} rows={8} cols={5} />;

  return (
    <div className="space-y-6">
      <PageBreadcrumb />
      {/* Page Header */}
      <div className="flex flex-col gap-1 pb-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Payments Ledger</h1>
          <p className="text-sm text-muted-foreground">Real-time tracking of capital inflows and settlement status</p>
        </div>
        <Button variant="outline" className="h-12 px-6 rounded-2xl font-bold gap-2 border-2 hover:bg-primary/5 transition-all">
           <Download className="h-5 w-5" /> Export Statements
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium text-muted-foreground text-muted-foreground mb-1">Total Received</CardDescription>
            <DollarSign className="h-5 w-5 text-muted-foreground transition-transform group-hover:scale-110" />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-2xl font-semibold tracking-tight">
              {formatCurrency(stats.total)}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium text-muted-foreground text-emerald-700/60 mb-1">Completed</CardDescription>
            <CheckCircle className="h-5 w-5 text-emerald-600 transition-transform group-hover:scale-110" />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-2xl font-bold">
              {formatCurrency(stats.completed)}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium text-muted-foreground text-amber-700/60 mb-1">Pending</CardDescription>
            <Clock className="h-5 w-5 text-amber-600 transition-transform group-hover:scale-110" />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-2xl font-bold">
              {formatCurrency(stats.pending)}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium text-muted-foreground text-indigo-700/60 mb-1">Inflow Volume</CardDescription>
            <TrendingUp className="h-5 w-5 text-indigo-600 transition-transform group-hover:scale-110" />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-2xl font-bold">{stats.thisMonth} <span className="text-sm font-bold uppercase">Payments</span></div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card className="border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card overflow-hidden">
        <CardHeader className="p-8 border-b">
          <CardTitle className="text-2xl font-bold">Transaction History</CardTitle>
          <CardDescription className="font-medium">All incoming settlements and payment statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search payments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <SortableHeader column="id" label="Payment ID" sort={sort} onSort={toggleSort} />
                  </TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>
                    <SortableHeader column="client" label="Client" sort={sort} onSort={toggleSort} />
                  </TableHead>
                  <TableHead>
                    <SortableHeader column="amount" label="Amount" sort={sort} onSort={toggleSort} />
                  </TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>
                    <SortableHeader column="status" label="Status" sort={sort} onSort={toggleSort} />
                  </TableHead>
                  <TableHead>
                    <SortableHeader column="paymentDate" label="Date" sort={sort} onSort={toggleSort} />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTotal === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Empty>
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <DollarSign />
                          </EmptyMedia>
                          <EmptyTitle>No payments found</EmptyTitle>
                          <EmptyDescription>
                            No payments match your current search or filter. Try adjusting your criteria.
                          </EmptyDescription>
                        </EmptyHeader>
                      </Empty>
                    </TableCell>
                  </TableRow>
                ) : pagedPayments.map((payment) => {
                  const statusKey = (payment.status || 'pending').toLowerCase();
                  const status = statusConfig[statusKey as keyof typeof statusConfig] || statusConfig.pending;
                  const methodKey = (payment.method || 'bank_transfer').toLowerCase();
                  const method = methodConfig[methodKey as keyof typeof methodConfig] || methodConfig.bank_transfer;
                  const StatusIcon = status.icon;
                  const MethodIcon = method.icon;
                  return (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.id}</TableCell>
                      <TableCell>
                        <span className="text-primary hover:underline cursor-pointer">
                          {payment.invoice?.id || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>{payment.invoice?.client?.name || payment.client || 'N/A'}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MethodIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{method.label}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("gap-1", status.className)}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'N/A'}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          <DataTablePagination
            total={filteredTotal}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
