"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, History, ArrowUpRight, ArrowDownLeft, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { inventoryApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function InventoryLedgerPage() {
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLedger = () => {
    setLoading(true);
    inventoryApi.getLedger()
      .then(setMovements)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const filteredMovements = movements.filter(m => 
    m.product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.reference?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 pb-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Supply Chain Ledger</h1>
          <p className="text-sm text-muted-foreground">Immutable audit trail of inventory movements and adjustments</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="icon" asChild className="h-12 w-12 rounded-2xl hover:bg-muted border-2">
            <Link href="/dashboard/inventory"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <Button className="h-12 px-6 rounded-2xl font-bold gap-2 shadow-xl shadow-primary/20" onClick={fetchLedger} disabled={loading}>
            <RefreshCcw className={cn("h-4 w-4", loading && "animate-spin")} />
            Sync Ledger
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-sm font-medium text-muted-foreground">Total Movements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{movements.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card overflow-hidden">
        <CardHeader className="p-8 border-b">
          <div className="flex items-center justify-between">
             <div>
                <CardTitle className="text-2xl font-bold tracking-tight uppercase italic">Transaction Journal</CardTitle>
                <CardDescription className="font-medium">Real-time stock flow verification</CardDescription>
             </div>
             <div className="relative w-80">
               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
               <Input
                 placeholder="Search ledger..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="h-11 rounded-2xl border-border/40 bg-muted/20 pl-10 font-medium"
               />
             </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="pl-8 font-bold uppercase text-[10px] tracking-widest">Timestamp</TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest">Product</TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest">Action</TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest">Quantity</TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest">Reference</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-8"><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-lg" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : filteredMovements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-medium italic">No movements recorded yet.</TableCell>
                </TableRow>
              ) : filteredMovements.map((m) => (
                <TableRow key={m.id} className="border-border/30 hover:bg-muted/20 transition-colors">
                  <TableCell className="pl-8 py-4 font-medium text-muted-foreground tabular-nums">
                    {new Date(m.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold">{m.product?.name}</div>
                    <div className="text-[10px] text-muted-foreground font-bold tracking-widest">{m.product?.sku}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn(
                      "rounded-lg font-bold text-[9px] uppercase tracking-widest border-none px-2 py-0.5",
                      m.type === 'INFLOW' ? "bg-emerald-100 text-emerald-700" :
                      m.type === 'OUTFLOW' ? "bg-rose-100 text-rose-700" :
                      "bg-amber-100 text-amber-700"
                    )}>
                      {m.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className={cn(
                      "font-bold text-lg tabular-nums flex items-center gap-1",
                      m.quantity > 0 ? "text-emerald-600" : "text-rose-600"
                    )}>
                      {m.quantity > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownLeft className="h-3 w-3" />}
                      {Math.abs(m.quantity)}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-muted-foreground">
                    {m.reference || "System Adjustment"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
