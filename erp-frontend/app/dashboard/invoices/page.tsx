"use client";

import { useEffect, useState } from "react";
import { useState as useOptimistic } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus, Search, Filter, Download, MoreHorizontal, Eye, Edit,
  Send, Trash2, FileText, Clock, CheckCircle, AlertTriangle, Receipt, Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn, formatDate } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { invoicesApi, type Invoice } from "@/lib/api";

const statusConfig: Record<string, { label: string; icon: any; className: string }> = {
  DRAFT:   { label: "Draft",   icon: FileText,      className: "bg-muted text-muted-foreground border-muted" },
  SENT:    { label: "Sent",    icon: Send,          className: "bg-blue-100 text-blue-700 border-blue-200" },
  PENDING: { label: "Pending", icon: Clock,         className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  PAID:    { label: "Paid",    icon: CheckCircle,   className: "bg-green-100 text-green-700 border-green-200" },
  OVERDUE: { label: "Overdue", icon: AlertTriangle, className: "bg-red-100 text-red-700 border-red-200" },
};

export default function InvoicesPage() {
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState<number | null>(null);
  const [sendingReminder, setSendingReminder] = useState<number | null>(null);

  const fetchInvoices = () => {
    setLoading(true);
    invoicesApi.getAll()
      .then(setInvoices)
      .catch(() => toast.error("Failed to load invoices"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchInvoices(); }, []);

  const handleSendReminder = async (id: number) => {
    setSendingReminder(id);
    try {
      await invoicesApi.sendReminder(id);
      toast.success("Reminder sent successfully!");
    } catch {
      toast.error("Failed to send reminder.");
    } finally {
      setSendingReminder(null);
    }
  };

  const handleBulkEmail = () => {
    const overdueIds = invoices.filter(i => i.status?.toUpperCase() === "OVERDUE").map(i => i.id);
    if (overdueIds.length === 0) { toast.info("No overdue invoices found."); return; }
    Promise.all(overdueIds.map((id) => invoicesApi.sendReminder(id)))
      .then(() => toast.success(`Reminders sent to ${overdueIds.length} overdue clients!`))
      .catch(() => toast.error("Some reminders failed to send."));
  };

  const filteredInvoices = invoices.filter((inv) => {
    const clientName = inv.client?.name ?? "";
    const matchesSearch =
      clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(inv.id).includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || (inv.status ?? "").toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: invoices.reduce((a, i) => a + i.amount, 0),
    paid: invoices.filter(i => i.status?.toUpperCase() === "PAID").reduce((a, i) => a + i.amount, 0),
    pending: invoices.filter(i => ["PENDING", "SENT"].includes(i.status?.toUpperCase() ?? "")).reduce((a, i) => a + i.amount, 0),
    overdue: invoices.filter(i => i.status?.toUpperCase() === "OVERDUE").reduce((a, i) => a + i.amount, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">Create, manage, and track all your invoices</p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/dashboard/invoices/new"><Plus className="h-4 w-4" /> Create Invoice</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {loading ? Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}><CardHeader className="pb-2"><Skeleton className="h-4 w-24" /></CardHeader>
            <CardContent><Skeleton className="h-8 w-32" /></CardContent></Card>
        )) : (
          <>
            <Card><CardHeader className="pb-2"><CardDescription>Total Invoiced</CardDescription></CardHeader>
              <CardContent><div className="text-2xl font-bold">{formatCurrency(stats.total)}</div></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardDescription>Paid</CardDescription></CardHeader>
              <CardContent><div className="text-2xl font-bold text-green-600">{formatCurrency(stats.paid)}</div></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardDescription>Pending</CardDescription></CardHeader>
              <CardContent><div className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.pending)}</div></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardDescription>Overdue</CardDescription></CardHeader>
              <CardContent><div className="text-2xl font-bold text-red-600">{formatCurrency(stats.overdue)}</div></CardContent></Card>
          </>
        )}
      </div>

      {/* Filters & Table */}
      <Card>
        <CardHeader><CardTitle>All Invoices</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search invoices..." value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="SENT">Sent</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="OVERDUE">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={handleBulkEmail}>
                <Send className="h-4 w-4" /> Bulk Remind
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" /> Export
              </Button>
            </div>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead><TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead><TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>{Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}</TableRow>
                  ))
                ) : filteredInvoices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      {searchQuery || statusFilter !== "all" ? "No invoices match your filters." : "No invoices yet. Create your first one!"}
                    </TableCell>
                  </TableRow>
                ) : filteredInvoices.map((invoice) => {
                  const statusKey = (invoice.status ?? "DRAFT").toUpperCase();
                  const status = statusConfig[statusKey] ?? statusConfig.DRAFT;
                  const StatusIcon = status.icon;
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        <Link href={`/dashboard/invoices/${invoice.id}`} className="hover:underline">
                          INV-{String(invoice.id).padStart(3, "0")}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{invoice.client?.name ?? "—"}</div>
                        <div className="text-sm text-muted-foreground">{invoice.client?.email ?? ""}</div>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(invoice.amount)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("gap-1", status.className)}>
                          <StatusIcon className="h-3 w-3" />{status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setSelectedInvoice(invoice)}>
                              <Eye className="h-4 w-4 mr-2" /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
                                <Edit className="h-4 w-4 mr-2" /> Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendReminder(invoice.id)}
                              disabled={sendingReminder === invoice.id}>
                              {sendingReminder === invoice.id
                                ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                : <Send className="h-4 w-4 mr-2" />}
                              Send Reminder
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive font-bold"
                              onClick={() => setInvoiceToDelete(invoice.id)}>
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-primary-foreground">
            <div className="flex justify-between items-start">
              <div className="text-left">
                <DialogTitle className="text-3xl font-black mb-1">
                  INV-{String(selectedInvoice?.id ?? "").padStart(3, "0")}
                </DialogTitle>
                <DialogDescription className="text-primary-foreground/80 font-medium">
                  Due {selectedInvoice && formatDate(selectedInvoice.dueDate)}
                </DialogDescription>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Amount</p>
                <p className="text-4xl font-black">{selectedInvoice && formatCurrency(selectedInvoice.amount)}</p>
              </div>
            </div>
          </DialogHeader>
          {selectedInvoice && (
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Client</p>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Receipt className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold">{selectedInvoice.client?.name}</p>
                      <p className="text-xs text-muted-foreground">{selectedInvoice.client?.email}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Status</p>
                  <Badge className={cn("rounded-full px-4",
                    selectedInvoice.status?.toUpperCase() === "PAID"
                      ? "bg-emerald-500 hover:bg-emerald-600"
                      : "bg-amber-500 hover:bg-amber-600")}>
                    {selectedInvoice.status?.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                {user?.role === "CLIENT" && selectedInvoice.status?.toUpperCase() !== "PAID" && (
                  <Button className="flex-1 font-black h-12 rounded-2xl">Pay Now</Button>
                )}
                {user?.role !== "CLIENT" && (
                  <Button variant="outline" className="flex-1 font-black h-12 rounded-2xl" asChild>
                    <Link href={`/dashboard/invoices/${selectedInvoice.id}/edit`}>Edit Record</Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation — no real delete API on invoices, show notice */}
      <AlertDialog open={!!invoiceToDelete} onOpenChange={(open) => !open && setInvoiceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice?</AlertDialogTitle>
            <AlertDialogDescription>
              Invoice <span className="font-bold">INV-{String(invoiceToDelete ?? "").padStart(3, "0")}</span> cannot be deleted once issued. Contact your administrator.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { toast.info("Contact admin to delete invoices."); setInvoiceToDelete(null); }}>
              Understood
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
