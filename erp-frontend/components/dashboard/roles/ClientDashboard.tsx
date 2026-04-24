"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RecentInvoices } from "../recent-invoices";
import { Wallet, FileText, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { analyticsApi, invoicesApi } from "@/lib/api";

export function ClientDashboard() {
  const [stats, setStats] = useState({
    balance: 0,
    activeInvoices: 0,
    settledInvoices: 0
  });

  useEffect(() => {
    async function loadData() {
      try {
        const invoices = await invoicesApi.getAll();
        // Just mock filtering logic for client for now since we don't have user id
        const clientInvoices = invoices.slice(0, 5); // mock slice
        const active = clientInvoices.filter(i => i.status !== 'PAID').length;
        const settled = clientInvoices.filter(i => i.status === 'PAID').length;
        const balance = clientInvoices.filter(i => i.status !== 'PAID').reduce((acc, i) => acc + i.amount, 0);
        
        setStats({ balance, activeInvoices: active, settledInvoices: settled });
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);
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
            <div className="text-4xl font-black tracking-tight">RWF {stats.balance.toLocaleString()}</div>
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
              <span className="font-bold">{stats.activeInvoices}</span>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-600" />
                <span className="text-sm">Settled (Year)</span>
              </div>
              <span className="font-bold">{stats.settledInvoices}</span>
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
