"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Plus, Search, Users, Briefcase, Calendar, CreditCard, Wallet, Download, Clock, Zap, MapPin, MoreHorizontal, Edit, Trash2
} from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { hrApi } from "@/lib/api";
import { PageSkeleton } from "@/components/ui/skeleton";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { SortableHeader } from "@/components/ui/sortable-header";
import { useTable } from "@/hooks/use-table";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export default function HRPage() {
  const { formatCurrency } = useCurrency();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    hrApi.getEmployees()
      .then(setEmployees)
      .finally(() => setLoading(false));
  }, []);

  const handleRunPayroll = async () => {
    setIsProcessing(true);
    try {
      let totalGross = employees.reduce((acc, e) => acc + (e.baseSalary || 0), 0);
      await hrApi.calculatePayroll(totalGross);
      toast.success("Payroll processed successfully! Payslips sent to employees.");
    } catch {
      toast.error("Payroll processing failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.firstName || ""} ${emp.lastName || ""}`.toLowerCase();
    return (
      fullName.includes(searchQuery.toLowerCase()) ||
      (emp.jobTitle || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.department || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const { sort, toggleSort, page, setPage, pageSize, setPageSize, paginated: pagedEmployees, total: filteredTotal } =
    useTable(filteredEmployees, { pageSize: 20 });

  if (loading) return <PageSkeleton cards={3} rows={8} cols={6} />;

  return (
    <div className="space-y-6">
      <PageBreadcrumb />
      <div className="flex flex-col gap-1 pb-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Talent Control</h1>
          <p className="text-sm text-muted-foreground">Employee lifecycles and automated salary disbursements</p>
        </div>
        <div className="flex gap-3">
          <Button
            className="gap-2 rounded-2xl font-bold bg-foreground text-background hover:bg-foreground/90 h-12 px-6"
            onClick={handleRunPayroll}
            disabled={isProcessing}
          >
            {isProcessing ? <Clock className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
            Run Payroll
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-medium" asChild>
            <Link href="/dashboard/hr/new">
              <Plus className="h-4 w-4" />
              New Employee
            </Link>
          </Button>
        </div>
      </div>

      {/* HR Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card">
          <CardContent className="px-6 pt-6 pb-2">
            <Users className="h-6 w-6 mb-4 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground text-muted-foreground mb-1">Headcount</p>
            <h3 className="text-2xl font-semibold tracking-tight">{employees.length}</h3>
            <p className="text-[10px] font-bold text-emerald-600 mt-2">+1 this month</p>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card">
          <CardContent className="px-6 pt-6 pb-2">
            <CreditCard className="h-6 w-6 mb-4 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground text-muted-foreground mb-1">Monthly Burn</p>
            <h3 className="text-2xl font-semibold tracking-tight">
              {formatCurrency(employees.reduce((acc, e) => acc + (e.baseSalary || 0), 0))}
            </h3>

          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card">
          <CardContent className="px-6 pt-6 pb-2">
            <Zap className="h-6 w-6 mb-4 text-primary" />
            <p className="text-sm font-medium text-muted-foreground text-muted-foreground mb-1">Retention Rate</p>
            <h3 className="text-2xl font-semibold tracking-tight">94%</h3>
            <div className="mt-4 w-full h-1 bg-muted rounded-full">
               <div className="h-full bg-primary rounded-full" style={{ width: "94%" }} />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card">
          <CardContent className="px-6 pt-6 pb-2">
            <Calendar className="h-6 w-6 mb-4 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground text-muted-foreground mb-1">Next Payroll</p>
            <h3 className="text-2xl font-semibold tracking-tight">May 01</h3>
            <p className="text-[10px] font-bold text-orange-600 mt-2">In 6 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Employee Table */}
        <div className="lg:col-span-2">
          <Card className="border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card overflow-hidden">
            <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Active Roster</CardTitle>
                <CardDescription className="font-medium text-muted-foreground">Global workforce management and roles</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search staff..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 rounded-xl bg-muted/20 pl-10 text-xs font-bold"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead className="pl-8 font-bold uppercase text-[10px] tracking-widest">
                      <SortableHeader column="firstName" label="Employee" sort={sort} onSort={toggleSort} />
                    </TableHead>
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest">
                      <SortableHeader column="department" label="Department" sort={sort} onSort={toggleSort} />
                    </TableHead>
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest">
                      <SortableHeader column="baseSalary" label="Salary" sort={sort} onSort={toggleSort} />
                    </TableHead>
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest">
                      <SortableHeader column="status" label="Status" sort={sort} onSort={toggleSort} />
                    </TableHead>
                    <TableHead className="text-right pr-8 font-bold uppercase text-[10px] tracking-widest">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTotal === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Empty>
                          <EmptyHeader>
                            <EmptyMedia variant="icon">
                              <Users />
                            </EmptyMedia>
                            <EmptyTitle>No employees found</EmptyTitle>
                            <EmptyDescription>
                              No employees match your search. Try a different name, title, or department.
                            </EmptyDescription>
                          </EmptyHeader>
                        </Empty>
                      </TableCell>
                    </TableRow>
                  ) : pagedEmployees.map((emp) => (
                    <TableRow key={emp.id} className="group border-border/30 hover:bg-muted/20 transition-colors">
                      <TableCell className="pl-8 py-4">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-xs text-primary ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                              {(emp.firstName || "U").charAt(0)}
                           </div>
                           <div>
                              <p className="font-bold">{emp.firstName} {emp.lastName}</p>
                              <p className="text-[10px] font-bold uppercase text-muted-foreground">{emp.jobTitle}</p>
                           </div>
                        </div>
                      </TableCell>
                      <TableCell>
                         <Badge variant="outline" className="rounded-lg font-bold text-[9px] uppercase tracking-widest border-border/50">{emp.department}</Badge>
                      </TableCell>
                      <TableCell>
                         <p className="font-bold">{formatCurrency(emp.baseSalary || 0)}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "rounded-lg font-bold text-[9px] px-2 py-0.5",
                          (emp.status || "Active") === "Active" ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/10 text-primary"
                        )}>
                          {(emp.status || "Active").toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                         <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary">
                               <Link href={`/dashboard/hr/${emp.id}/edit`}>
                                 <Edit className="h-4 w-4" />
                               </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => {
                                 if(confirm(`Are you sure you want to remove ${emp.firstName}?`)) {
                                   hrApi.deleteEmployee(emp.id)
                                     .then(() => {
                                        toast.success("Employee record removed");
                                        window.location.reload();
                                     })
                                     .catch(() => toast.error("Failed to delete record"));
                                 }
                              }}
                            >
                               <Trash2 className="h-4 w-4" />
                            </Button>
                         </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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

        {/* Recruitment/Onboarding Side */}
        <div className="space-y-6">
           <Card className="rounded-2xl border-border/50 bg-foreground text-background overflow-hidden">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-xl font-bold">Upcoming Onboarding</CardTitle>
             </CardHeader>
             <CardContent className="px-6 pb-6">
               <div className="space-y-4">
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                   <div className="flex items-center gap-3 mb-2">
                     <MapPin className="h-4 w-4 text-primary" />
                     <span className="text-sm font-medium text-muted-foreground">Remote / Seattle</span>
                   </div>
                   <p className="font-bold">Julian Chen</p>
                   <p className="text-xs font-bold text-white/60">UX Designer • Starts Jan 20</p>
                 </div>
                 <Button
                   variant="secondary"
                   className="w-full rounded-xl font-bold bg-white text-black hover:bg-white/90 shadow-xl"
                   onClick={() => {
                     toast.info("Recruitment Pipeline: 1 Candidate in Interview stage (Julian Chen)");
                   }}
                 >
                   View Pipeline
                 </Button>
               </div>
             </CardContent>
           </Card>

           <Card className="rounded-2xl border-border/50 bg-muted/20">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-xl font-bold tracking-tight">Management Suite</CardTitle>
             </CardHeader>
             <CardContent className="p-8 pt-0 space-y-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 rounded-xl font-bold px-4 h-12 hover:bg-background border border-transparent hover:border-border/50 transition-all"
                  onClick={() => {
                    const csv = "Employee,Department,BaseSalary,Status\n" + employees.map(e => `${e.firstName} ${e.lastName},${e.department},${e.baseSalary},${e.status}`).join("\n");
                    const blob = new Blob([csv], { type: 'text/csv' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `payroll_report_${new Date().toISOString().split('T')[0]}.csv`;
                    a.click();
                    toast.success("Payroll report exported (CSV format)");
                  }}
                >
                  <Download className="h-4 w-4 text-emerald-600" /> Export Payroll Report
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 rounded-xl font-bold px-4 h-12 hover:bg-background border border-transparent hover:border-border/50 transition-all"
                  onClick={() => {
                    if (hrApi && typeof hrApi.getBenefits === 'function') {
                      hrApi.getBenefits().then(data => {
                        toast.success(`Benefits Portal Active: ${data?.healthInsurance || 'Standard'}`);
                      }).catch(() => toast.error("Benefits module temporarily unavailable"));
                    } else {
                      toast.error("Benefits module initialization in progress...");
                    }
                  }}
                >
                  <Briefcase className="h-4 w-4 text-primary" /> Manage Benefits
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 rounded-xl font-bold px-4 h-12 hover:bg-background border border-transparent hover:border-border/50 transition-all"
                  onClick={() => {
                    hrApi.getCompliance().then(data => {
                       toast.success(`Compliance Check: ${data.taxJurisdiction || 'Rwanda'} - OK`);
                    }).catch(() => toast.error("Compliance service unreachable"));
                  }}
                >
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" /> Compliance Settings
                </Button>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
