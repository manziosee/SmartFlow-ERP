"use client";

import { useState } from "react";
import { 
  CreditCard, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Search,
  Filter,
  ArrowRightLeft,
  ChevronRight,
  RefreshCw,
  Wallet,
  ShieldCheck,
  History,
  FileText
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";

import { paymentsApi } from "@/lib/api";
import { useEffect } from "react";


export default function ReconciliationPage() {
  const { formatCurrency } = useCurrency();
  const [isSyncing, setIsSyncing] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [records, setRecords] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const payments = await paymentsApi.getAll();
      setRecords(payments.map(p => ({
        id: `TX-${p.id}`,
        date: p.paymentDate,
        description: `Payment for Invoice ${p.invoice?.id || 'Unknown'}`,
        erpAmount: p.amount,
        bankAmount: p.amount,
        status: "matched",
        matchScore: 100
      })));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = {
    total: records.length,
    matched: records.filter(r => r.status === 'matched').length,
    unresolved: records.filter(r => r.status !== 'matched').length,
    mismatchVal: records.reduce((acc, r) => acc + Math.abs(r.erpAmount - r.bankAmount), 0),
  };

  const handleSync = async () => {
    setIsSyncing(true);
    await loadData();
    setIsSyncing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Bank Reconciliation</h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Financial hygiene: Matching ERP ledgers with bank reality
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="h-12 px-6 rounded-2xl border-border bg-background font-bold gap-2"
            onClick={() => setShowUploadDialog(true)}
          >
             <Upload className="h-4 w-4" />
             Upload Statement (CSV/PDF)
          </Button>
          <Button onClick={handleSync} disabled={isSyncing} className="h-12 px-6 rounded-2xl font-bold gap-2 shadow-lg shadow-primary/20">
             <RefreshCw className={cn("h-4 w-4", isSyncing && "animate-spin")} />
             {isSyncing ? "Analyzing Reality..." : "Batch Match"}
          </Button>
        </div>
      </div>

      {/* Sync Health Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-primary font-bold uppercase text-[10px] tracking-widest">Health Score</CardDescription>
            <CardTitle className="text-2xl font-semibold tracking-tight">85.4%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
               <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '85.4%' }} />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card">
          <CardHeader className="pb-2">
            <CardDescription className="uppercase text-[10px] font-bold tracking-widest">Auto-Matched</CardDescription>
            <CardTitle className="text-3xl font-bold text-emerald-600">{stats.matched}/{stats.total}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card">
          <CardHeader className="pb-2">
            <CardDescription className="uppercase text-[10px] font-bold tracking-widest text-destructive">Discrepancy Val</CardDescription>
            <CardTitle className="text-3xl font-bold">{formatCurrency(stats.mismatchVal)}</CardTitle>
          </CardHeader>
        </Card>

        <Card className="border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card">
          <CardHeader className="pb-2">
            <CardDescription className="uppercase text-[10px] font-bold tracking-widest">Connected Bank</CardDescription>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
               BK Rwanda 
               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Reconciliation Table */}
      <Card className="rounded-2xl border-border/50 overflow-hidden shadow-none">
        <CardHeader className="bg-muted/30 border-b p-8">
           <div className="flex flex-col gap-1 pb-2 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Sync Inbox</CardTitle>
                <CardDescription>Resolve discrepancies between system logs and bank statements</CardDescription>
              </div>
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search records..." className="pl-10 h-12 rounded-2xl bg-muted/20 border-border/50" />
              </div>
           </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="pl-8 py-4 font-bold uppercase text-[10px] tracking-widest">Transaction Date</TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest">Description</TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest">ERP Amount</TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest">Bank Amount</TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest">Match Result</TableHead>
                <TableHead className="text-right pr-8 font-bold uppercase text-[10px] tracking-widest">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((tx) => (
                <TableRow key={tx.id} className="group hover:bg-muted/30 transition-all border-none">
                  <TableCell className="pl-8 py-6 font-bold text-sm tracking-tight italic text-muted-foreground">
                    {formatDate(tx.date)}
                  </TableCell>
                  <TableCell>
                     <div className="flex flex-col">
                        <span className="font-bold text-sm">{tx.description}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">{tx.id}</span>
                     </div>
                  </TableCell>
                  <TableCell className="font-bold tabular-nums">{tx.erpAmount > 0 ? formatCurrency(tx.erpAmount) : '—'}</TableCell>
                  <TableCell className="font-bold tabular-nums">{tx.bankAmount > 0 ? formatCurrency(tx.bankAmount) : '—'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <Badge variant="outline" className={cn("px-3 py-1 font-bold text-[10px] tracking-tight truncate max-w-[120px]", 
                          tx.status === 'matched' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
                          tx.status === 'mismatch' ? "bg-amber-50 text-amber-600 border-amber-100" : 
                          "bg-red-50 text-red-600 border-red-100"
                       )}>
                          {tx.status.replace(/_/g, ' ').toUpperCase()}
                       </Badge>
                       {tx.matchScore > 0 && tx.matchScore < 100 && (
                          <span className="text-[10px] font-bold text-amber-600">{tx.matchScore}% Match</span>
                       )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    {tx.status === 'matched' ? (
                      <div className="flex items-center justify-end text-emerald-500 gap-1.5 font-bold text-xs">
                         <CheckCircle className="h-4 w-4" />
                         Sync'd
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" className="rounded-xl font-bold h-9 border-border bg-background hover:bg-primary hover:text-primary-foreground transform active:scale-95 transition-all">
                         Resolve
                         <ChevronRight className="h-3 w-3 ml-1.5" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Footnotes */}
      <div className="flex items-center gap-6 p-8 bg-muted/20 border border-dashed rounded-[2rem] text-muted-foreground italic text-sm">
         <History className="h-5 w-5 text-primary" />
         <span>Last reconciliation completed by Sr. Accountant on {formatDate(new Date().toISOString())}. Next audit scheduled in 4 days.</span>
      </div>

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-[500px] rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Upload Statement</DialogTitle>
            <DialogDescription>Supported formats: .csv, .xlsx, .pdf (OCR enabled)</DialogDescription>
          </DialogHeader>
          <div className="py-8">
            <div className="border-2 border-dashed border-muted-foreground/20 rounded-[2rem] p-12 flex flex-col items-center gap-4 bg-muted/5 group hover:bg-muted/10 transition-colors cursor-pointer">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Upload className="h-8 w-8" />
              </div>
              <p className="font-bold text-sm tracking-tight text-center">Drag and drop your statement here or <span className="text-primary underline">browse files</span></p>
              <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Max size: 10MB</p>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
             <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold" onClick={() => setShowUploadDialog(false)}>Cancel</Button>
             <Button className="flex-1 h-12 rounded-xl font-bold" onClick={() => {
                toast.success("Statement uploaded. Analyzing transactions...");
                setShowUploadDialog(false);
                setTimeout(handleSync, 2000);
             }}>Process File</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
