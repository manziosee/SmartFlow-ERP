"use client";

import { useState } from "react";
import Link from "next/link";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  Filter,
  Download,
  DollarSign,
  TrendingDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Building,
  Briefcase,
  Wifi,
  Users,
  Package,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Receipt,
  History
} from "lucide-react";
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
import { cn, formatDate } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { toast } from "sonner";

import { expensesApi } from "@/lib/api";
import { useEffect } from "react";

import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { SortableHeader } from "@/components/ui/sortable-header";
import { useTable } from "@/hooks/use-table";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";


const categoryConfig = {
  operations: { label: "Operations", icon: Package, color: "bg-blue-100 text-blue-700" },
  software: { label: "Software", icon: Wifi, color: "bg-purple-100 text-purple-700" },
  travel: { label: "Travel & Meals", icon: Briefcase, color: "bg-green-100 text-green-700" },
  payroll: { label: "Payroll & HR", icon: Users, color: "bg-orange-100 text-orange-700" },
  rent: { label: "Rent & Utilities", icon: Building, color: "bg-teal-100 text-teal-700" },
};

const statusStyles = {
  approved: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
};

export default function ExpensesPage() {
  const { formatCurrency } = useCurrency();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadExpenses = async () => {
    try {
      setIsLoading(true);
      const data = await expensesApi.getAll();
      setExpenses(data);
    } catch (err) {
      toast.error("Failed to load expenses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);


  // UI States
  const [selectedExpense, setSelectedExpense] = useState<any | null>(null);
  const [expenseToDelete, setExpenseToDelete] = useState<string | number | null>(null);

  const handleDeleteExpense = async () => {
    if (!expenseToDelete) return;
    try {
      await expensesApi.delete(expenseToDelete as number);
      setExpenses((prev) => prev.filter((e) => e.id !== expenseToDelete));
      toast.success(`Expense has been deleted.`);
      setExpenseToDelete(null);
    } catch (err) {
      toast.error("Failed to delete expense");
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      (expense.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (expense.vendor || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const { sort, toggleSort, page, setPage, pageSize, setPageSize, paginated: pagedExpenses, total: filteredTotal } =
    useTable(filteredExpenses, { pageSize: 20 });

  const stats = {
    total: expenses.reduce((acc, e) => acc + e.amount, 0),
    approved: expenses
      .filter((e) => e.status === "approved")
      .reduce((acc, e) => acc + e.amount, 0),
    pending: expenses
      .filter((e) => e.status === "pending")
      .reduce((acc, e) => acc + e.amount, 0),
    thisMonth: expenses.length,
  };

  const handleAddExpense = async () => {
    setIsSubmitting(true);
    try {
      await expensesApi.create({
        description: "New Expense",
        amount: 0,
        category: "operations",
        status: "pending",
        date: new Date().toISOString().split("T")[0]
      });
      loadExpenses();
      toast.success("Expense added successfully");
      setIsAddDialogOpen(false);
    } catch (err) {
      toast.error("Failed to add expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <PageSkeleton cards={3} rows={8} cols={6} />;

  return (
    <div className="space-y-6">
      <PageBreadcrumb />
      {/* Page Header */}
      <div className="flex flex-col gap-1 pb-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Expenditure Ledger</h1>
          <p className="text-sm text-muted-foreground">Real-time tracking of capital outflows and operational costs</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>
                Enter the expense details to track it in your system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Office supplies, software, etc." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" type="number" step="0.01" placeholder="0.00" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="software">Software</SelectItem>
                      <SelectItem value="travel">Travel & Meals</SelectItem>
                      <SelectItem value="payroll">Payroll & HR</SelectItem>
                      <SelectItem value="rent">Rent & Utilities</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="vendor">Vendor</Label>
                  <Input id="vendor" placeholder="Vendor name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Additional details..." rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddExpense} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Expense"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium text-muted-foreground text-muted-foreground mb-1">Total Expenses</CardDescription>
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
            <CardDescription className="text-sm font-medium text-muted-foreground text-emerald-700/60 mb-1">Approved</CardDescription>
            <CheckCircle className="h-5 w-5 text-emerald-600 transition-transform group-hover:scale-110" />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-2xl font-bold">
              {formatCurrency(stats.approved)}
            </div>

          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium text-muted-foreground text-amber-700/60 mb-1">Pending Approval</CardDescription>
            <Receipt className="h-5 w-5 text-amber-600 transition-transform group-hover:scale-110" />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-2xl font-bold">
              {formatCurrency(stats.pending)}
            </div>

          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription className="text-sm font-medium text-muted-foreground text-muted-foreground mb-1">Entry Volume</CardDescription>
            <TrendingDown className="h-5 w-5 text-muted-foreground transition-transform group-hover:scale-110" />
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-2xl font-semibold tracking-tight">{stats.thisMonth} <span className="text-sm font-bold uppercase">Entries</span></div>

          </CardContent>
        </Card>
      </div>

      {/* Expenses Table */}
      <Card className="border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card overflow-hidden">
        <CardHeader className="p-8 border-b">
          <CardTitle className="text-2xl font-bold">Audit Ledger</CardTitle>
          <CardDescription className="font-medium">All categorized business expenditures and settlement statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="software">Software</SelectItem>
                  <SelectItem value="travel">Travel & Meals</SelectItem>
                  <SelectItem value="payroll">Payroll & HR</SelectItem>
                  <SelectItem value="rent">Rent & Utilities</SelectItem>
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
                    <SortableHeader column="description" label="Expense" sort={sort} onSort={toggleSort} />
                  </TableHead>
                  <TableHead>
                    <SortableHeader column="category" label="Category" sort={sort} onSort={toggleSort} />
                  </TableHead>
                  <TableHead>
                    <SortableHeader column="vendor" label="Vendor" sort={sort} onSort={toggleSort} />
                  </TableHead>
                  <TableHead>
                    <SortableHeader column="amount" label="Amount" sort={sort} onSort={toggleSort} />
                  </TableHead>
                  <TableHead>
                    <SortableHeader column="date" label="Date" sort={sort} onSort={toggleSort} />
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTotal === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Empty>
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <Receipt />
                          </EmptyMedia>
                          <EmptyTitle>No expenses found</EmptyTitle>
                          <EmptyDescription>
                            No expenses match your current search or filter. Try adjusting your criteria.
                          </EmptyDescription>
                        </EmptyHeader>
                      </Empty>
                    </TableCell>
                  </TableRow>
                ) : pagedExpenses.map((expense) => {
                  const category = categoryConfig[expense.category as keyof typeof categoryConfig] || { label: expense.category, icon: Package, color: "bg-gray-100 text-gray-700" };
                  const CategoryIcon = category.icon;
                  return (
                    <TableRow key={expense.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{expense.description}</div>
                          <div className="text-xs text-muted-foreground">
                            {expense.id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={cn("inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium", category.color)}>
                          <CategoryIcon className="h-3 w-3" />
                          {category.label}
                        </div>
                      </TableCell>
                      <TableCell>{expense.vendor}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(expense.amount)}
                      </TableCell>
                      <TableCell>
                        {formatDate(expense.date)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("capitalize", statusStyles[expense.status as keyof typeof statusStyles])}
                        >
                          {expense.status}
                        </Badge>
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
                            <DropdownMenuItem onClick={() => setSelectedExpense(expense)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                               <Link href={`/dashboard/expenses/${expense.id}/edit`}>
                                 <Edit className="h-4 w-4 mr-2" />
                                 Edit
                               </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Receipt className="h-4 w-4 mr-2" />
                              View Receipt
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive font-bold"
                              onClick={() => setExpenseToDelete(expense.id)}
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
          <DataTablePagination
            total={filteredTotal}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          />
        </CardContent>
      </Card>
      {/* Detailed View Modal: Center Pop-out */}
      <Dialog open={!!selectedExpense} onOpenChange={(open) => !open && setSelectedExpense(null)}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-primary-foreground">
            <div className="flex justify-between items-start">
              <div className="text-left">
                <DialogTitle className="text-3xl font-bold mb-1">Expense Voucher</DialogTitle>
                <DialogDescription className="text-primary-foreground/80 font-medium">
                  {selectedExpense?.id}
                </DialogDescription>
              </div>
              <div className="text-right">
                <div className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold bg-primary-foreground text-primary")}>
                  {selectedExpense ? (categoryConfig[selectedExpense.category as keyof typeof categoryConfig]?.label || selectedExpense.category) : ""}
                </div>
              </div>
            </div>
          </DialogHeader>

          {selectedExpense && (
            <div className="p-8 space-y-12 max-h-[70vh] overflow-y-auto font-geist">
              {/* Core Details */}
              <div className="flex flex-col items-center justify-center p-8 bg-muted/20 rounded-3xl border border-dashed text-center">
                 <p className="text-sm font-medium text-muted-foreground text-muted-foreground mb-2">Total Expenditure</p>
                 <h2 className="text-5xl font-bold tracking-tight text-primary">
                    {formatCurrency(selectedExpense.amount)}
                 </h2>
                 <p className="mt-4 text-sm font-bold bg-muted px-4 py-1 rounded-full border">
                   {selectedExpense.description}
                 </p>
              </div>

              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-4">
                  <p className="text-sm font-medium text-muted-foreground text-muted-foreground">Vendor Details</p>
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                      <Building className="h-5 w-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold">{selectedExpense.vendor}</p>
                      <p className="text-xs text-muted-foreground">Registered Entity</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4 text-right">
                  <p className="text-sm font-medium text-muted-foreground text-muted-foreground">Filing Info</p>
                  <div className="space-y-1 text-sm">
                    <p className="flex justify-between gap-4"><span className="text-muted-foreground">Transaction Date:</span> <span className="font-bold">{formatDate(selectedExpense.date)}</span></p>
                    <div className="flex justify-end pt-2">
                       <Badge variant="outline" className={cn("font-bold px-3 py-1", statusStyles[selectedExpense.status as keyof typeof statusStyles])}>
                         {selectedExpense.status.toUpperCase()}
                       </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compliance & Receipt Section */}
              <div className="space-y-6">
                <p className="text-sm font-medium text-muted-foreground text-muted-foreground flex items-center gap-2">
                  <Receipt className="h-3 w-3" />
                  Compliance Checklist
                </p>
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-3 text-sm font-bold">
                      <div className={cn("h-5 w-5 rounded-full flex items-center justify-center", selectedExpense.receipt ? "bg-emerald-500" : "bg-red-500")}>
                        {selectedExpense.receipt ? <CheckCircle className="h-3 w-3 text-white" /> : <AlertTriangle className="h-3 w-3 text-white" />}
                      </div>
                      Tax Receipt Attached
                    </div>
                    {selectedExpense.receipt && <Button variant="link" className="text-xs font-bold p-0 h-auto">VIEW PDF</Button>}
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
                    <div className="flex items-center gap-3 text-sm font-bold">
                       <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-white" />
                       </div>
                       Budget Code Verified
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
                 <div className="flex items-center gap-2 mb-4">
                    <History className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium text-muted-foreground">Processing History</p>
                 </div>
                 <div className="space-y-6 pl-2 border-l-2 border-primary/20 text-left">
                    <div className="relative pl-6">
                       <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                       <p className="text-xs font-bold">Expense Filed</p>
                       <p className="text-[10px] text-muted-foreground">{formatDate(selectedExpense.date)}</p>
                    </div>
                    {selectedExpense.status === 'approved' && (
                      <div className="relative pl-6">
                         <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-background" />
                         <p className="text-xs font-bold">Manager Approval Confirmed</p>
                         <p className="text-[10px] text-muted-foreground">Internal Audit Passed</p>
                      </div>
                    )}
                 </div>
              </div>

              <div className="flex gap-4 pt-4 pb-8">
                 <Button className="flex-1 font-bold h-12 rounded-2xl shadow-xl shadow-primary/20">
                    Process Reimbursement
                 </Button>
                 <Button variant="outline" className="flex-1 font-bold h-12 rounded-2xl border-border bg-background" asChild>
                    <Link href={`/dashboard/expenses/${selectedExpense?.id}/edit`}>
                       Edit Entry
                    </Link>
                 </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!expenseToDelete} onOpenChange={(open) => !open && setExpenseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete expense record
              <span className="font-bold text-foreground mx-1">{expenseToDelete}</span>
              and remove it from your balance sheet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteExpense} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
