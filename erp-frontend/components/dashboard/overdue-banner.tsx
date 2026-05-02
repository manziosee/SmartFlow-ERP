"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { invoicesApi } from "@/lib/api";
import { useCurrency } from "@/contexts/CurrencyContext";

export function OverdueBanner() {
  const { formatCurrency } = useCurrency();
  const [overdueCount, setOverdueCount] = useState(0);
  const [overdueTotal, setOverdueTotal] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    invoicesApi.getAll({ status: "OVERDUE" })
      .then((invoices: any[]) => {
        setOverdueCount(invoices.length);
        setOverdueTotal(invoices.reduce((sum: number, inv: any) => sum + (inv.amount || 0), 0));
      })
      .catch(() => {});
  }, []);

  if (dismissed || overdueCount === 0) return null;

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
      <div className="flex items-center gap-3 min-w-0">
        <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-500" />
        <p className="text-sm font-medium truncate">
          <span className="font-bold">{overdueCount} overdue invoice{overdueCount > 1 ? "s" : ""}</span>
          {" — "}
          {formatCurrency(overdueTotal)} outstanding. Immediate follow-up recommended.
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-red-700 hover:text-red-900 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/40 gap-1 text-xs font-semibold"
          asChild
        >
          <Link href="/dashboard/invoices?status=OVERDUE">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/40"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
