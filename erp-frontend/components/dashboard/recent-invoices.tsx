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
  PAID: "bg-green-100 text-green-700 border-green-200",
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  OVERDUE: "bg-red-100 text-red-700 border-red-200",
  DRAFT: "bg-muted text-muted-foreground border-muted",
  SENT: "bg-blue-100 text-blue-700 border-blue-200",
};

interface RecentInvoicesProps {
  title?: string;
  className?: string;
}

export function RecentInvoices({ title = "Recent Invoices", className = "col-span-3" }: RecentInvoicesProps) {
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
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Latest invoice activity</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/invoices" className="gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : invoices.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No invoices yet. <Link href="/dashboard/invoices/new" className="text-primary font-bold underline">Create one</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => {
              const clientName = invoice.client?.name ?? "Unknown Client";
              const initials = clientName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
              const statusKey = (invoice.status ?? "").toUpperCase();
              return (
                <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                      {initials}
                    </div>
                    <div>
                      <p className="font-medium">{clientName}</p>
                      <p className="text-sm text-muted-foreground">INV-{String(invoice.id).padStart(3, "0")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(invoice.amount)}</p>
                      <p className="text-xs text-muted-foreground">Due {formatDate(invoice.dueDate)}</p>
                    </div>
                    <Badge variant="outline" className={cn("capitalize", statusStyles[statusKey] ?? statusStyles.DRAFT)}>
                      {invoice.status?.toLowerCase()}
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
