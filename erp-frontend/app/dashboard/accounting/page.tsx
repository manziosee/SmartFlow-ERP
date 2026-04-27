"use client";

import { useState } from "react";
import { 
  Building2, 
  Receipt, 
  TrendingUp, 
  TrendingDown, 
  Download,
  Calendar,
  Layers,
  FileCheck,
  Calculator,
  AlertCircle,
  RefreshCw,
  ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";

import { expensesApi, invoicesApi } from "@/lib/api";
import { useEffect } from "react";


export default function AccountingPage() {
  const router = useRouter();
  const { formatCurrency } = useCurrency();
  const [period, setPeriod] = useState("Q1-2024");
  const [taxRecords, setTaxRecords] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [expenses, invoices] = await Promise.all([
          expensesApi.getAll(),
          invoicesApi.getAll()
        ]);
        
        const inputRecords = expenses.map((e: any) => ({
          id: `TX-EXP-${e.id}`,
          type: "Input",
          amount: e.amount,
          vat: e.amount * 0.18,
          date: e.date,
          entity: e.description
        }));
        
        const outputRecords = invoices.map((i: any) => ({
          id: `TX-INV-${i.id}`,
          type: "Output",
          amount: i.amount,
          vat: i.amount * 0.18,
          date: i.issueDate,
          entity: i.client?.name || "Unknown"
        }));
        
        const combined = [...inputRecords, ...outputRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setTaxRecords(combined);
      } catch (err) {
        console.error("Failed to load tax records", err);
      }
    }
    loadData();
  }, []);

  const totals = {
    outputTax: taxRecords.filter(r => r.type === 'Output').reduce((acc, r) => acc + r.vat, 0),
    inputTax: taxRecords.filter(r => r.type === 'Input').reduce((acc, r) => acc + r.vat, 0),
    netRevenue: taxRecords.filter(r => r.type === 'Output').reduce((acc, r) => acc + r.amount, 0),
  };

  const liability = totals.outputTax - totals.inputTax;

  return (
    <div className="space-y-8 pb-12 font-geist">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tax Compliance</h1>
          <p className="text-muted-foreground font-medium">Real-time Rwandan tax liability monitoring (18% Flat Rate)</p>
        </div>
        <div className="flex gap-3">
          <Select value={period} onValueChange={setPeriod}>
             <SelectTrigger className="w-[180px] h-12 rounded-2xl bg-muted/20 border-border/50 font-bold">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Tax Period" />
             </SelectTrigger>
             <SelectContent>
                <SelectItem value="Q1-2024">Q1 FY2024</SelectItem>
                <SelectItem value="Q2-2024">Q2 FY2024</SelectItem>
                <SelectItem value="annual-2024">Annual 2024</SelectItem>
             </SelectContent>
          </Select>
          <Button variant="outline" className="h-12 px-6 rounded-2xl border-border bg-background font-bold gap-2">
             <Download className="h-4 w-4" />
             Export Audit File
          </Button>
        </div>
      </div>

      {/* Tax Summary Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-primary/5 border-primary/20 rounded-[2rem] overflow-hidden shadow-none border-dashed transition-all hover:border-solid hover:shadow-xl hover:shadow-primary/5">
          <CardHeader className="pb-2">
            <CardDescription className="text-primary font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
               <Calculator className="h-4 w-4" />
               Net VAT Liability
            </CardDescription>
            <CardTitle className="text-4xl font-black tracking-tight">{formatCurrency(liability)}</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold">
                <AlertCircle className="h-3 w-3 text-amber-500" />
                Due in 42 days
             </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-border/50 shadow-none hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <CardDescription className="uppercase text-[10px] font-black tracking-widest flex items-center gap-2">
               <TrendingUp className="h-4 w-4 text-emerald-500" />
               Output Tax (Collected)
            </CardDescription>
            <CardTitle className="text-3xl font-black">{formatCurrency(totals.outputTax)}</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-xs text-muted-foreground font-medium">From {taxRecords.filter(r => r.type === 'Output').length} sales invoices</p>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-border/50 shadow-none hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <CardDescription className="uppercase text-[10px] font-black tracking-widest flex items-center gap-2">
               <TrendingDown className="h-4 w-4 text-red-500" />
               Input Tax (Expenses)
            </CardDescription>
            <CardTitle className="text-3xl font-black">{formatCurrency(totals.inputTax)}</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-xs text-muted-foreground font-medium">Deductible from expenditures</p>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-border/50 shadow-none hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <CardDescription className="uppercase text-[10px] font-black tracking-widest flex items-center gap-2">
               <Layers className="h-4 w-4 text-primary" />
               Taxable Turnover
            </CardDescription>
            <CardTitle className="text-3xl font-black">{formatCurrency(totals.netRevenue)}</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-xs text-muted-foreground font-medium">Net revenue base for {period}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
         {/* Ledger table */}
         <Card className="lg:col-span-2 rounded-[2rem] border-border/50 overflow-hidden shadow-none">
            <CardHeader className="bg-muted/30 border-b">
               <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl font-bold">Declaration Ledger</CardTitle>
                    <CardDescription>All tax-eligible transactions for {period}</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 font-bold border-emerald-100 uppercase tracking-tighter">
                     <FileCheck className="h-3 w-3 mr-1" />
                     Audit Ready
                  </Badge>
               </div>
            </CardHeader>
            <CardContent className="p-0">
               <Table>
                  <TableHeader className="bg-muted/10">
                     <TableRow>
                        <TableHead className="pl-6 font-bold uppercase text-[10px] tracking-widest">Reference</TableHead>
                        <TableHead className="font-bold uppercase text-[10px] tracking-widest">Entity</TableHead>
                        <TableHead className="font-bold uppercase text-[10px] tracking-widest">Date</TableHead>
                        <TableHead className="font-bold uppercase text-[10px] tracking-widest">Tax Type</TableHead>
                        <TableHead className="text-right pr-6 font-bold uppercase text-[10px] tracking-widest">VAT Amount</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {taxRecords.map(record => (
                        <TableRow key={record.id} className="hover:bg-muted/20 transition-colors">
                           <TableCell className="pl-6 font-bold text-sm tracking-tight">{record.id}</TableCell>
                           <TableCell className="text-sm font-medium">{record.entity}</TableCell>
                           <TableCell className="text-xs text-muted-foreground italic font-mono">{formatDate(record.date)}</TableCell>
                           <TableCell>
                              <Badge variant="outline" className={cn("font-black text-[10px] px-2", 
                                 record.type === 'Output' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100")}>
                                 {record.type.toUpperCase()}
                              </Badge>
                           </TableCell>
                           <TableCell className="text-right pr-6 font-black tabular-nums">
                              {record.type === 'Output' ? '+' : '-'}{formatCurrency(record.vat)}
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </CardContent>
         </Card>

         {/* Side Compliance Check */}
         <div className="space-y-6">
            <Card className="rounded-3xl border-border/50 p-8 bg-gradient-to-br from-indigo-50/50 via-white to-white shadow-none">
               <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-indigo-600" />
                  Tax Estimator
               </h3>
               <div className="space-y-6">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Est. Quarterly EBM sales</p>
                     <p className="text-3xl font-black text-indigo-900 tracking-tighter">{formatCurrency(totals.netRevenue)}</p>
                  </div>
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Projected VAT Payable</p>
                     <p className="text-3xl font-black text-indigo-600 tracking-tighter">{formatCurrency(totals.netRevenue * 0.18)}</p>
                  </div>
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 font-extrabold rounded-2xl h-14 shadow-lg shadow-indigo-100">
                     Generate Tax Projection
                  </Button>
               </div>
            </Card>

            <Card className="rounded-3xl border-border/50 p-8 shadow-none bg-primary/5 hover:bg-primary/10 transition-colors group cursor-pointer" onClick={() => router.push('/dashboard/accounting/reconciliation')}>
               <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                     <RefreshCw className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
               </div>
               <h1 className="text-3xl font-bold tracking-tight">Bank Reconciliation</h1>
               <p className="text-xs text-muted-foreground font-medium">Match {taxRecords.length} internal records with bank statements.</p>
            </Card>

            <Card className="rounded-3xl border-border/50 p-8 shadow-none">
               <p className="text-[10px] font-black text-muted-foreground uppercase mb-6 tracking-[0.2em] border-b pb-2">Compliance Hub</p>
               <div className="space-y-4">
                  {[
                    "EBM (Electronic Billing Machine) sync confirmed",
                    "Input tax invoices digitally verified",
                    "Previous period tax clearance confirmed",
                    "VAT Declaration period active"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs font-bold leading-relaxed">
                       <div className="h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                          <FileCheck className="h-2.5 w-2.5 text-white" />
                       </div>
                       {item}
                    </div>
                  ))}
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}
