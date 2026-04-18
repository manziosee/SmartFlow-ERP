"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";

const invoices = [
  {
    id: "INV-001",
    client: "Acme Corporation",
    amount: 4500.0,
    status: "paid",
    dueDate: "2024-01-15",
  },
  {
    id: "INV-002",
    client: "Tech Solutions Inc.",
    amount: 2800.0,
    status: "pending",
    dueDate: "2024-01-20",
  },
  {
    id: "INV-003",
    client: "Global Dynamics",
    amount: 6200.0,
    status: "overdue",
    dueDate: "2024-01-10",
  },
  {
    id: "INV-004",
    client: "StartUp Labs",
    amount: 1500.0,
    status: "pending",
    dueDate: "2024-01-25",
  },
  {
    id: "INV-005",
    client: "Digital Ventures",
    amount: 3750.0,
    status: "paid",
    dueDate: "2024-01-12",
  },
];

const statusStyles = {
  paid: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  overdue: "bg-red-100 text-red-700 border-red-200",
};

interface RecentInvoicesProps {
  title?: string;
  className?: string;
}

export function RecentInvoices({ title = "Recent Invoices", className = "col-span-3" }: RecentInvoicesProps) {
  const { formatCurrency } = useCurrency();

  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Latest invoice activity</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/invoices" className="gap-1">
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                  {invoice.client
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="font-medium">{invoice.client}</p>
                  <p className="text-sm text-muted-foreground">{invoice.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-medium">
                    {formatCurrency(invoice.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Due {formatDate(invoice.dueDate)}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={cn("capitalize", statusStyles[invoice.status as keyof typeof statusStyles])}
                >
                  {invoice.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
