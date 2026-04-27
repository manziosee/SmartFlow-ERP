"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Globe, Shield, FileText, CheckCircle, AlertCircle, History, Settings2, ExternalLink, Scale, HelpCircle
} from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";

import { taxesApi } from "@/lib/api";

export default function TaxesPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    taxesApi.getRules()
      .then(setRules)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tax Compliance</h1>
          <p className="text-muted-foreground font-medium">Global tax configurations and jurisdictional regulatory compliance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 rounded-2xl border-border/50 bg-background/50 font-bold h-12 px-6">
            <History className="h-4 w-4" />
            Audit Log
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-medium">
            <Globe className="h-4 w-4" />
            New Tax Zone
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Tax Rules Table */}
        <div className="lg:col-span-2">
          <Card className="border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-2xl font-bold">Tax Jurisdictions</CardTitle>
              <CardDescription className="font-medium text-muted-foreground">Active tax rates applied to invoices and transactions</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead className="pl-8 font-bold uppercase text-[10px] tracking-widest">Region / Entity</TableHead>
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest">Tax Type</TableHead>
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest">Rate (%)</TableHead>
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
                    <TableHead className="text-right pr-8 font-bold uppercase text-[10px] tracking-widest">Last Update</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-bold animate-pulse">Checking Regulatory Data...</TableCell></TableRow>
                  ) : rules.map((rule) => (
                    <TableRow key={rule.id} className="border-border/30 hover:bg-muted/20 transition-colors">
                      <TableCell className="pl-8 py-5">
                        <p className="font-bold text-lg">{rule.region}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="rounded-lg font-bold text-[9px] uppercase tracking-widest border-none px-2 py-0.5">{rule.taxType || rule.type}</Badge>
                      </TableCell>
                      <TableCell>
                         <p className="font-bold text-xl">{rule.rate}%</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-emerald-600">
                           <CheckCircle className="h-4 w-4" />
                           <span className="text-sm font-medium text-muted-foreground">Compliant</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <p className="text-xs font-bold text-muted-foreground">{rule.lastUpdated || "N/A"}</p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Regulatory Status Sidebar */}
        <div className="space-y-6">
           <Card className="rounded-2xl border-emerald-500/20 bg-emerald-500/5 overflow-hidden">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center gap-2 mb-2 text-emerald-600">
                  <Shield className="h-5 w-5" />
                  <span className="text-sm font-medium text-muted-foreground">Compliance Status</span>
                </div>
                <CardTitle className="text-2xl font-bold">All Zones Active</CardTitle>
             </CardHeader>
             <CardContent className="px-6 pb-6">
                <p className="text-sm font-medium text-emerald-600/80 mb-6 italic leading-relaxed">
                  "Your tax configurations are currently aligned with the latest legal updates for Q2 2024."
                </p>
                <div className="space-y-4">
                   <div className="flex items-center justify-between p-4 rounded-2xl bg-background border border-emerald-500/10">
                      <span className="text-xs font-bold">VAT Returns Due</span>
                      <span className="font-bold text-emerald-600">14 Days</span>
                   </div>
                   <Button className="w-full h-12 rounded-2xl font-bold bg-emerald-600 hover:bg-emerald-700">File Tax Report</Button>
                </div>
             </CardContent>
           </Card>

           <Card className="rounded-2xl border-border/50 bg-muted/20">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
               <CardTitle className="text-xl font-bold tracking-tight">Resources</CardTitle>
             </CardHeader>
             <CardContent className="p-8 pt-0 space-y-3">
                <div className="flex items-center justify-between group cursor-pointer">
                   <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground">2024 Global Tax Guide</span>
                   <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between group cursor-pointer border-t border-border/30 pt-3">
                   <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground">Local Filing Deadlines</span>
                   <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between group cursor-pointer border-t border-border/30 pt-3">
                   <span className="text-sm font-bold text-muted-foreground group-hover:text-foreground">Tax Strategy Tips</span>
                   <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
             </CardContent>
           </Card>

           <div className="p-8 rounded-2xl border border-dashed border-border flex flex-col items-center text-center gap-4 bg-muted/10">
              <Scale className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground text-muted-foreground">Regulatory Advisor</p>
              <p className="text-sm font-medium text-muted-foreground leading-snug italic">"Consider enabling NEXUS tracking for US-based customers."</p>
              <Button variant="ghost" className="rounded-full text-xs font-bold uppercase tracking-widest gap-2">
                <HelpCircle className="h-4 w-4" /> Ask AI Accountant
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
