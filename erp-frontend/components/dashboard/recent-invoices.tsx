"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { invoicesApi, type Invoice } from "@/lib/api";

const statusStyles: Record<string, string> = {
  PAID:      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400",
  PENDING:   "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400",
  OVERDUE:   "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400",
  DRAFT:     "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/30 dark:text-slate-400",
  SENT:      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400",
  CANCELLED: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/30 dark:text-slate-400",
};

interface RecentInvoicesProps {
  title?: string;
  className?: string;
}

export function RecentInvoices({ title = "Recent Activity", className = "col-span-3" }: RecentInvoicesProps) {
  const { formatCurrency } = useCurrency();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    invoicesApi.getAll()
      .then((data) => setInvoices(data.slice(0, 5)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className={cn("border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] rounded-[2.5rem] overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between p-8 pb-4">
        <div>
          <CardTitle className="text-xl font-black tracking-tight">{title}</CardTitle>
          <CardDescription className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Latest invoice workflow</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild className="rounded-full font-bold hover:bg-muted">
          <Link href="/dashboard/invoices" className="gap-2">
            Explore All <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-8 pt-4">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-2xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-7 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : invoices.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground font-medium mb-4">No recent activity found.</p>
            <Button variant="outline" className="rounded-2xl font-bold" asChild>
               <Link href="/dashboard/invoices/new">Generate Invoice</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {invoices.map((invoice) => {
              const clientName = invoice.client?.name ?? "Unknown Client";
              const initials = clientName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
              const statusKey = (invoice.status ?? "").toUpperCase();
              return (
                <div key={invoice.id} className="flex items-center justify-between p-4 rounded-[1.5rem] hover:bg-muted/40 transition-all duration-300 group">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5 text-primary text-sm font-black transition-transform duration-500 group-hover:scale-110">
                      {initials}
                    </div>
                    <div>
                      <p className="font-bold tracking-tight">{clientName}</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">INV-{String(invoice.id).padStart(4, "0")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-black tabular-nums">{formatCurrency(invoice.amount)}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Due {formatDate(invoice.dueDate)}</p>
                    </div>
                    <Badge variant="outline" className={cn("rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-tighter", statusStyles[statusKey] ?? statusStyles.DRAFT)}>
                      {invoice.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
