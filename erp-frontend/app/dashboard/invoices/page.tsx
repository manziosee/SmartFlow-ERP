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
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus, Search, Filter, Download, MoreHorizontal, Eye, Edit,
  Send, Trash2, FileText, Clock, CheckCircle, AlertTriangle, Receipt, Loader2, RefreshCw
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn, formatDate } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { invoicesApi, clientsApi, type Invoice, type Client } from "@/lib/api";
import { Checkbox } from "@/components/ui/checkbox";

const statusConfig: Record<string, { label: string; icon: any; className: string }> = {
  DRAFT:     { label: "Draft",     icon: FileText,      className: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800/30 dark:text-gray-400" },
  SENT:      { label: "Sent",      icon: Send,          className: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400" },
  PENDING:   { label: "Pending",   icon: Clock,         className: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400" },
  PAID:      { label: "Paid",      icon: CheckCircle,   className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400" },
  OVERDUE:   { label: "Overdue",   icon: AlertTriangle, className: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400" },
  CANCELLED: { label: "Cancelled", icon: Trash2,        className: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/30 dark:text-slate-400" },
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenDialogOpen, setIsGenDialogOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientsForGen, setSelectedClientsForGen] = useState<number[]>([]);
  const [genSearchQuery, setGenSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchInvoices = () => {
    setLoading(true);
    invoicesApi.getAll()
      .then(setInvoices)
      .catch(() => toast.error("Failed to load invoices"))
      .finally(() => setLoading(false));
  };

  const handleDeleteInvoice = async () => {
    if (!invoiceToDelete) return;
    setIsDeleting(true);
    try {
      await invoicesApi.delete(invoiceToDelete);
      toast.success("Invoice deleted successfully");
      setInvoices(invoices.filter(i => i.id !== invoiceToDelete));
      setInvoiceToDelete(null);
    } catch {
      toast.error("Failed to delete invoice");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelInvoice = async (id: number) => {
    try {
      await invoicesApi.cancel(id);
      toast.success("Invoice cancelled");
      fetchInvoices();
    } catch {
      toast.error("Failed to cancel invoice");
    }
  };

  useEffect(() => { 
    fetchInvoices();
    clientsApi.getAll().then(setClients).catch(console.error);
  }, []);

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

  const handleGenerateInvoices = async () => {
    setIsGenerating(true);
    try {
      const clientIds = selectedClientsForGen.length > 0 ? selectedClientsForGen : undefined;
      await invoicesApi.generateRecurring(clientIds);
      toast.success("Invoices successfully generated for clients.");
      setIsGenDialogOpen(false);
      setSelectedClientsForGen([]);
      fetchInvoices();
    } catch {
      toast.error("Failed to generate invoices.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendInvoice = async (id: number) => {
    try {
      await invoicesApi.sendInvoice(id);
      toast.success("Invoice sent to client.");
      fetchInvoices();
    } catch {
      toast.error("Failed to send invoice.");
    }
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
        <div className="flex gap-2">
          <Dialog open={isGenDialogOpen} onOpenChange={setIsGenDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Bulk Generate
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-[2rem]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">Recurring Billing</DialogTitle>
                <DialogDescription className="font-medium">
                  Select clients to generate monthly invoices based on their set rates.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4 max-h-[450px] overflow-y-auto pr-2">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Search clients..." 
                    value={genSearchQuery}
                    onChange={(e) => setGenSearchQuery(e.target.value)}
                    className="pl-9 rounded-xl"
                  />
                </div>
                <div className="flex items-center justify-between px-2 pb-2 border-b">
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Client Entity</p>
                   <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Monthly Rate</p>
                </div>
                {clients.filter(c => c.name.toLowerCase().includes(genSearchQuery.toLowerCase())).map((client) => {
                  const hasRate = (client.monthlyRate || 0) > 0;
                  return (
                    <div key={client.id} className={cn(
                      "flex items-center justify-between p-3 rounded-2xl transition-colors border border-transparent",
                      hasRate ? "hover:bg-muted/50 hover:border-border/50" : "opacity-60 bg-muted/20"
                    )}>
                      <div className="flex items-center gap-3">
                        <Checkbox 
                          id={`client-${client.id}`} 
                          checked={selectedClientsForGen.includes(client.id)}
                          disabled={!hasRate}
                          onCheckedChange={(checked) => {
                            if (checked) setSelectedClientsForGen([...selectedClientsForGen, client.id]);
                            else setSelectedClientsForGen(selectedClientsForGen.filter(id => id !== client.id));
                          }}
                        />
                        <label htmlFor={`client-${client.id}`} className={cn("font-bold", hasRate ? "cursor-pointer" : "cursor-not-allowed")}>
                          {client.name}
                          {!hasRate && <span className="ml-2 text-[8px] bg-red-100 text-red-600 px-1 rounded">NO RATE SET</span>}
                          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{client.company || 'Private Client'}</p>
                        </label>
                      </div>
                      <div className="text-right">
                         <p className={cn("font-black", hasRate ? "text-primary" : "text-muted-foreground")}>
                           {hasRate ? formatCurrency(client.monthlyRate!) : "—"}
                         </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="pt-4 flex gap-3">
                 <Button variant="ghost" className="flex-1 font-bold h-12 rounded-2xl" onClick={() => setSelectedClientsForGen(clients.filter(c => (c.monthlyRate || 0) > 0).map(c => c.id))}>Select All Billable</Button>
                 <Button 
                   className="flex-[2] font-black gap-2 h-12 rounded-2xl" 
                   onClick={handleGenerateInvoices}
                   disabled={isGenerating || (selectedClientsForGen.length === 0)}
                 >
                   {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                   Generate {selectedClientsForGen.length > 0 ? selectedClientsForGen.length : ''} Invoices
                 </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button asChild className="gap-2">
            <Link href="/dashboard/invoices/new"><Plus className="h-4 w-4" /> Create Invoice</Link>
          </Button>
        </div>
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
                            {statusKey === "DRAFT" ? (
                              <DropdownMenuItem onClick={() => handleSendInvoice(invoice.id)}>
                                <Send className="h-4 w-4 mr-2" /> Send Invoice
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleSendReminder(invoice.id)}
                                disabled={sendingReminder === invoice.id}>
                                {sendingReminder === invoice.id
                                  ? <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  : <Send className="h-4 w-4 mr-2" />}
                                Send Reminder
                              </DropdownMenuItem>
                            )}
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
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-card">
          <div className="bg-primary p-10 text-primary-foreground relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-20 -mb-20 blur-2xl" />
            
            <div className="relative flex justify-between items-start">
              <div className="text-left">
                <Badge className="mb-4 bg-white/20 hover:bg-white/30 text-white border-none px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  Invoice Details
                </Badge>
                <DialogTitle className="text-4xl font-black tracking-tighter mb-1">
                  INV-{String(selectedInvoice?.id ?? "").padStart(4, "0")}
                </DialogTitle>
                <p className="text-primary-foreground/70 font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Issued on {selectedInvoice && formatDate(selectedInvoice.issueDate)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Total Amount</p>
                <p className="text-5xl font-black tabular-nums tracking-tighter">
                  {selectedInvoice && formatCurrency(selectedInvoice.amount)}
                </p>
                <Badge variant="outline" className={cn("mt-4 px-4 py-1 rounded-full font-bold uppercase tracking-tighter text-[10px]",
                  statusConfig[selectedInvoice?.status?.toUpperCase() ?? "DRAFT"]?.className
                )}>
                  {selectedInvoice?.status}
                </Badge>
              </div>
            </div>
          </div>

          {selectedInvoice && (
            <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Client Information</p>
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Receipt className="h-6 w-6 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-lg leading-tight truncate">{selectedInvoice.client?.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{selectedInvoice.client?.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 text-right">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Payment Terms</p>
                    <div className="space-y-1">
                      <p className="font-bold text-lg">Due by {formatDate(selectedInvoice.dueDate)}</p>
                      <p className="text-sm text-muted-foreground">Late payment fees may apply after due date.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Invoice Items</p>
                <div className="rounded-2xl border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead className="font-bold">Item Description</TableHead>
                        <TableHead className="text-center font-bold">Qty</TableHead>
                        <TableHead className="text-right font-bold">Price</TableHead>
                        <TableHead className="text-right font-bold">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedInvoice.items && selectedInvoice.items.length > 0 ? (
                        selectedInvoice.items.map((item: any, idx: number) => (
                          <TableRow key={idx} className="hover:bg-muted/20 border-border/30">
                            <TableCell className="font-medium">{item.product?.name || item.description || "Service Rendered"}</TableCell>
                            <TableCell className="text-center font-bold">{item.quantity || 1}</TableCell>
                            <TableCell className="text-right tabular-nums">{formatCurrency(item.unitPrice || selectedInvoice.amount)}</TableCell>
                            <TableCell className="text-right font-black tabular-nums">{formatCurrency((item.quantity || 1) * (item.unitPrice || selectedInvoice.amount))}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell className="font-medium">General Service / Product</TableCell>
                          <TableCell className="text-center font-bold">1</TableCell>
                          <TableCell className="text-right tabular-nums">{formatCurrency(selectedInvoice.amount)}</TableCell>
                          <TableCell className="text-right font-black tabular-nums">{formatCurrency(selectedInvoice.amount)}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Calculation Summary */}
              <div className="flex justify-end">
                <div className="w-64 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Subtotal</span>
                    <span className="font-bold tabular-nums">{formatCurrency(selectedInvoice.amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Tax (18% VAT)</span>
                    <span className="font-bold tabular-nums">{formatCurrency(selectedInvoice.amount * 0.18)}</span>
                  </div>
                  <div className="pt-3 border-t border-border flex justify-between">
                    <span className="font-black uppercase tracking-tighter">Total Due</span>
                    <span className="font-black text-xl tabular-nums text-primary">{formatCurrency(selectedInvoice.amount * 1.18)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4 sticky bottom-0 bg-card py-4 border-t border-border/50">
                {user?.role === "CLIENT" && selectedInvoice.status?.toUpperCase() !== "PAID" && (
                  <Button className="flex-1 font-black h-14 rounded-2xl text-lg shadow-lg glow">Pay Now</Button>
                )}
                <Button variant="outline" className="flex-1 font-bold h-14 rounded-2xl gap-2 border-2" onClick={() => window.print()}>
                  <Download className="h-5 w-5" /> Download PDF
                </Button>
                {user?.role !== "CLIENT" && (
                  <Button variant="secondary" className="flex-1 font-bold h-14 rounded-2xl border-2" asChild>
                    <Link href={`/dashboard/invoices/${selectedInvoice.id}/edit`}>Edit Record</Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!invoiceToDelete} onOpenChange={(open) => !open && setInvoiceToDelete(null)}>
        <AlertDialogContent className="rounded-[2.5rem] p-10 border-none shadow-2xl">
          <AlertDialogHeader>
            <div className="h-16 w-16 bg-rose-100 rounded-2xl flex items-center justify-center mb-6">
               <Trash2 className="h-8 w-8 text-rose-600" />
            </div>
            <AlertDialogTitle className="text-3xl font-black tracking-tighter">Delete Invoice?</AlertDialogTitle>
            <AlertDialogDescription className="text-lg font-medium text-muted-foreground py-2">
              Are you sure you want to delete <span className="text-foreground font-bold">INV-{String(invoiceToDelete ?? "").padStart(4, "0")}</span>? 
              This action is permanent and will remove all associated item records and stock adjustments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-6 gap-3">
            <AlertDialogCancel className="h-14 rounded-2xl font-bold flex-1 border-2">Keep Invoice</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteInvoice}
              disabled={isDeleting}
              className="h-14 rounded-2xl font-black flex-1 bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-200"
            >
              {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Yes, Delete It"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
