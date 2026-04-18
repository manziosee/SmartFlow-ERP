"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RecentInvoices } from "../recent-invoices";
import { Wallet, FileText, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ClientDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass border-primary overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Wallet className="h-24 w-24" />
          </div>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Your Current Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black tracking-tight">RWF 452,000</div>
            <p className="text-sm text-muted-foreground mt-2">Due by April 24, 2026</p>
            <Button className="mt-6 w-full gap-2 rounded-xl">
              Pay Now
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm">Active Invoices</span>
              </div>
              <span className="font-bold">4</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-600" />
                <span className="text-sm">Settled (Year)</span>
              </div>
              <span className="font-bold">12</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        <RecentInvoices title="My Recent Invoices" />
      </div>
    </div>
  );
}
