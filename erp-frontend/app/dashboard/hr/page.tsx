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

export default function HRPage() {
  const { formatCurrency } = useCurrency();
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

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

  return (
    <div className="space-y-8 font-geist animate-in fade-in duration-1000">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Talent & Payroll</h1>
          <p className="text-muted-foreground font-medium">Manage employee lifecycles and automated salary disbursements</p>
        </div>
        <div className="flex gap-3">
          <Button 
            className="gap-2 rounded-2xl font-black bg-foreground text-background hover:bg-foreground/90 h-12 px-6"
            onClick={handleRunPayroll}
            disabled={isProcessing}
          >
            {isProcessing ? <Clock className="h-4 w-4 animate-spin" /> : <Wallet className="h-4 w-4" />}
            Run Payroll
          </Button>
          <Button className="gap-2 rounded-2xl font-black shadow-lg shadow-primary/20 h-12 px-6">
            <Plus className="h-4 w-4" />
            New Employee
          </Button>
        </div>
      </div>

      {/* HR Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="rounded-[2.5rem] border-border/40 shadow-none bg-background border-dashed">
          <CardContent className="p-8">
            <Users className="h-6 w-6 mb-4 text-muted-foreground" />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Headcount</p>
            <h3 className="text-3xl font-black tracking-tighter">{employees.length}</h3>
            <p className="text-[10px] font-bold text-emerald-600 mt-2">+1 this month</p>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-border/40 shadow-none bg-background border-dashed">
          <CardContent className="p-8">
            <CreditCard className="h-6 w-6 mb-4 text-muted-foreground" />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Monthly Burn</p>
            <h3 className="text-3xl font-black tracking-tighter">
              {formatCurrency(employees.reduce((acc, e) => acc + (e.baseSalary || 0), 0))}
            </h3>
            <p className="text-[10px] font-bold text-muted-foreground mt-2 italic">Excluding taxes</p>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-border/40 shadow-none bg-background border-dashed">
          <CardContent className="p-8">
            <Zap className="h-6 w-6 mb-4 text-primary" />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Retention Rate</p>
            <h3 className="text-3xl font-black tracking-tighter">94%</h3>
            <div className="mt-4 w-full h-1 bg-muted rounded-full">
               <div className="h-full bg-primary rounded-full" style={{ width: "94%" }} />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-border/40 shadow-none bg-background border-dashed">
          <CardContent className="p-8">
            <Calendar className="h-6 w-6 mb-4 text-muted-foreground" />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Next Payroll</p>
            <h3 className="text-3xl font-black tracking-tighter">May 01</h3>
            <p className="text-[10px] font-bold text-orange-600 mt-2">In 6 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Employee Table */}
        <div className="lg:col-span-2">
          <Card className="rounded-[3rem] border-border/50 shadow-none overflow-hidden bg-card">
            <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-black tracking-tight">Active Roster</CardTitle>
                <CardDescription className="font-medium text-muted-foreground">Global workforce management and roles</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search staff..." className="h-10 rounded-xl bg-muted/20 pl-10 text-xs font-bold" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead className="pl-8 font-black uppercase text-[10px] tracking-widest">Employee</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Department</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Salary</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                    <TableHead className="text-right pr-8 font-black uppercase text-[10px] tracking-widest">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={4} className="h-32 text-center text-muted-foreground font-black animate-pulse">Syncing Employee Records...</TableCell></TableRow>
                  ) : employees.map((emp) => (
                    <TableRow key={emp.id} className="group border-border/30 hover:bg-muted/20 transition-colors">
                      <TableCell className="pl-8 py-4">
                        <div className="flex items-center gap-3">
                           <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-black text-xs text-primary ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                              {(emp.firstName || "U").charAt(0)}
                           </div>
                           <div>
                              <p className="font-bold">{emp.firstName} {emp.lastName}</p>
                              <p className="text-[10px] font-black uppercase text-muted-foreground">{emp.jobTitle}</p>
                           </div>
                        </div>
                      </TableCell>
                      <TableCell>
                         <Badge variant="outline" className="rounded-lg font-black text-[9px] uppercase tracking-widest border-border/50">{emp.department}</Badge>
                      </TableCell>
                      <TableCell>
                         <p className="font-black">{formatCurrency(emp.baseSalary || 0)}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "rounded-lg font-black text-[9px] px-2 py-0.5",
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
            </CardContent>
          </Card>
        </div>

        {/* Recruitment/Onboarding Side */}
        <div className="space-y-6">
           <Card className="rounded-[2.5rem] border-border/50 bg-foreground text-background overflow-hidden">
             <CardHeader className="p-8 pb-4">
               <CardTitle className="text-xl font-black">Upcoming Onboarding</CardTitle>
             </CardHeader>
             <CardContent className="p-8 pt-0">
               <div className="space-y-4">
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                   <div className="flex items-center gap-3 mb-2">
                     <MapPin className="h-4 w-4 text-primary" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Remote / Seattle</span>
                   </div>
                   <p className="font-black">Julian Chen</p>
                   <p className="text-xs font-bold text-white/60">UX Designer • Starts Jan 20</p>
                 </div>
                 <Button variant="outline" className="w-full rounded-xl border-white/20 text-white hover:bg-white/5 font-bold">View Pipeline</Button>
               </div>
             </CardContent>
           </Card>

           <Card className="rounded-[2.5rem] border-border/50 bg-muted/20">
             <CardHeader className="p-8 pb-4">
               <CardTitle className="text-xl font-black">Quick Actions</CardTitle>
             </CardHeader>
             <CardContent className="p-8 pt-0 space-y-2">
                <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl font-bold px-4 h-12 hover:bg-background">
                  <Download className="h-4 w-4" /> Export Payroll Report
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl font-bold px-4 h-12 hover:bg-background">
                  <Briefcase className="h-4 w-4" /> Manage Benefits
                </Button>
                <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl font-bold px-4 h-12 hover:bg-background">
                  <MoreHorizontal className="h-4 w-4" /> Compliance Settings
                </Button>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
