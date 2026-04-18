"use client";

import { useState } from "react";
import Link from "next/link";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Send,
  Trash2,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Receipt,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn, formatDate } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";

const INITIAL_INVOICES = [
  {
    id: "INV-001",
    client: "Acme Corporation",
    clientEmail: "billing@acme.com",
    amount: 4500.0,
    status: "paid",
    issueDate: "2024-01-01",
    dueDate: "2024-01-15",
    paidDate: "2024-01-14",
  },
  {
    id: "INV-002",
    client: "Tech Solutions Inc.",
    clientEmail: "accounts@techsolutions.com",
    amount: 2800.0,
    status: "pending",
    issueDate: "2024-01-05",
    dueDate: "2024-01-20",
    paidDate: null,
  },
  {
    id: "INV-003",
    client: "Global Dynamics",
    clientEmail: "finance@globaldynamics.com",
    amount: 6200.0,
    status: "overdue",
    issueDate: "2023-12-25",
    dueDate: "2024-01-10",
    paidDate: null,
  },
  {
    id: "INV-004",
    client: "StartUp Labs",
    clientEmail: "hello@startuplabs.io",
    amount: 1500.0,
    status: "pending",
    issueDate: "2024-01-10",
    dueDate: "2024-01-25",
    paidDate: null,
  },
  {
    id: "INV-005",
    client: "Digital Ventures",
    clientEmail: "pay@digitalventures.co",
    amount: 3750.0,
    status: "paid",
    issueDate: "2023-12-28",
    dueDate: "2024-01-12",
    paidDate: "2024-01-11",
  },
  {
    id: "INV-006",
    client: "Cloud Nine Systems",
    clientEmail: "billing@cloudnine.com",
    amount: 8900.0,
    status: "draft",
    issueDate: "2024-01-12",
    dueDate: "2024-01-27",
    paidDate: null,
  },
  {
    id: "INV-007",
    client: "Nexus Innovations",
    clientEmail: "accounts@nexusinnovations.com",
    amount: 5600.0,
    status: "sent",
    issueDate: "2024-01-08",
    dueDate: "2024-01-23",
    paidDate: null,
  },
  {
    id: "INV-008",
    client: "Quantum Corp",
    clientEmail: "finance@quantumcorp.com",
    amount: 12400.0,
    status: "overdue",
    issueDate: "2023-12-15",
    dueDate: "2023-12-30",
    paidDate: null,
  },
];

const statusConfig = {
  draft: {
    label: "Draft",
    icon: FileText,
    className: "bg-muted text-muted-foreground border-muted",
  },
  sent: {
    label: "Sent",
    icon: Send,
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  paid: {
    label: "Paid",
    icon: CheckCircle,
    className: "bg-green-100 text-green-700 border-green-200",
  },
  overdue: {
    label: "Overdue",
    icon: AlertTriangle,
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

export default function InvoicesPage() {
  const { user } = useAuth();
  const { formatCurrency } = useCurrency();
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // UI States
  const [selectedInvoice, setSelectedInvoice] = useState<(typeof INITIAL_INVOICES)[0] | null>(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);

  const handleBulkEmail = () => {
    toast.success("Bulk reminders sent to all overdue clients!");
  };

  const handlePayNow = (id: string) => {
    toast.info("Redirecting to Secure Payment Gateway...");
    // Mock redirect
    setTimeout(() => {
      toast.success("Payment successful!");
      setSelectedInvoice(null);
    }, 2000);
  };

  const handleDelete = () => {
    if (!invoiceToDelete) return;
    setInvoices((prev) => prev.filter((inv) => inv.id !== invoiceToDelete));
    toast.success(`Invoice ${invoiceToDelete} has been deleted.`);
    setInvoiceToDelete(null);
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: invoices.reduce((acc, inv) => acc + inv.amount, 0),
    paid: invoices
      .filter((inv) => inv.status === "paid")
      .reduce((acc, inv) => acc + inv.amount, 0),
    pending: invoices
      .filter((inv) => inv.status === "pending" || inv.status === "sent")
      .reduce((acc, inv) => acc + inv.amount, 0),
    overdue: invoices
      .filter((inv) => inv.status === "overdue")
      .reduce((acc, inv) => acc + inv.amount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">
            Create, manage, and track all your invoices
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/dashboard/invoices/new">
            <Plus className="h-4 w-4" />
            Create Invoice
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Invoiced</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Paid</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${stats.paid.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              ${stats.pending.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overdue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${stats.overdue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
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
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2" onClick={handleBulkEmail}>
                <Send className="h-4 w-4" />
                Bulk Email
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => {
                  const status = statusConfig[invoice.status as keyof typeof statusConfig];
                  const StatusIcon = status.icon;
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        <Link
                          href={`/dashboard/invoices/${invoice.id}`}
                          className="hover:underline"
                        >
                          {invoice.id}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{invoice.client}</div>
                          <div className="text-sm text-muted-foreground">
                            {invoice.clientEmail}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(invoice.amount)}
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
                        {formatDate(invoice.issueDate)}
                      </TableCell>
                      <TableCell>
                        {formatDate(invoice.dueDate)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setSelectedInvoice(invoice)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                               <Link href={`/dashboard/invoices/${invoice.id}/edit`}>
                                 <Edit className="h-4 w-4 mr-2" />
                                 Edit
                               </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Send className="h-4 w-4 mr-2" />
                              Send Reminder
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive font-bold"
                              onClick={() => setInvoiceToDelete(invoice.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
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
      {/* Detailed View Modal: Center Pop-out */}
      <Dialog open={!!selectedInvoice} onOpenChange={(open) => !open && setSelectedInvoice(null)}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-primary-foreground">
            <div className="flex justify-between items-start">
              <div className="text-left">
                <DialogTitle className="text-3xl font-black mb-1">Invoice {selectedInvoice?.id}</DialogTitle>
                <DialogDescription className="text-primary-foreground/80 font-medium">
                  Issued on {selectedInvoice && formatDate(selectedInvoice.issueDate)}
                </DialogDescription>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Amount Due</p>
                <p className="text-4xl font-black">{selectedInvoice && formatCurrency(selectedInvoice.amount)}</p>
              </div>
            </div>
          </DialogHeader>

          {selectedInvoice && (
            <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto font-geist">
              {/* Profile Card Style */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Client Details</p>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                      <Receipt className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold">{selectedInvoice.client}</p>
                      <p className="text-xs text-muted-foreground">{selectedInvoice.clientEmail}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Timeline</p>
                  <div className="space-y-1 text-sm">
                    <p className="flex justify-between gap-4"><span className="text-muted-foreground">Due Date:</span> <span className="font-bold">{formatDate(selectedInvoice.dueDate)}</span></p>
                    {selectedInvoice.paidDate && (
                      <p className="flex justify-between gap-4"><span className="text-muted-foreground">Paid On:</span> <span className="font-bold text-emerald-600">{formatDate(selectedInvoice.paidDate)}</span></p>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div className="bg-muted/30 p-6 rounded-3xl border border-dashed flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center",
                    selectedInvoice.status === 'paid' ? "bg-emerald-100" : "bg-amber-100"
                  )}>
                    {selectedInvoice.status === 'paid' ? <CheckCircle className="h-6 w-6 text-emerald-600" /> : <Clock className="h-6 w-6 text-amber-600" />}
                  </div>
                  <div className="text-left font-geist">
                    <p className="font-bold capitalize">{selectedInvoice.status}</p>
                    <p className="text-xs text-muted-foreground font-medium">Verification status cleared</p>
                  </div>
                </div>
                <Badge className={cn("rounded-full px-4 text-xs font-bold", 
                  selectedInvoice.status === 'paid' ? "bg-emerald-500 hover:bg-emerald-600" : "bg-amber-500 hover:bg-amber-600"
                )}>
                  {selectedInvoice.status.toUpperCase()}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                {user?.role === 'CLIENT' && selectedInvoice.status !== 'paid' && (
                  <Button className="flex-1 font-black h-12 rounded-2xl shadow-xl shadow-primary/20" onClick={() => handlePayNow(selectedInvoice.id)}>
                    Pay Now
                  </Button>
                )}
                {user?.role !== 'CLIENT' && (
                  <Button variant="outline" className="flex-1 font-black h-12 rounded-2xl border-border bg-background" asChild>
                    <Link href={`/dashboard/invoices/${selectedInvoice.id}/edit`}>
                      Edit Record
                    </Link>
                  </Button>
                )}
                <Button variant="outline" className="font-black h-12 w-12 rounded-2xl border-border flex items-center justify-center">
                   <Download className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!invoiceToDelete} onOpenChange={(open) => !open && setInvoiceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete invoice 
              <span className="font-bold text-foreground mx-1">{invoiceToDelete}</span>
              from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Invoice
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
