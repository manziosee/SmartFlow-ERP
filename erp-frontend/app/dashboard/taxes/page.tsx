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
    <div className="space-y-8 font-geist animate-in fade-in duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Tax Compliance</h1>
          <p className="text-muted-foreground font-medium">Global tax configurations and jurisdictional regulatory compliance</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 rounded-2xl border-border/50 bg-background/50 font-bold h-12 px-6">
            <History className="h-4 w-4" />
            Audit Log
          </Button>
          <Button className="gap-2 rounded-2xl font-black shadow-lg shadow-primary/20 h-12 px-6">
            <Globe className="h-4 w-4" />
            New Tax Zone
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Tax Rules Table */}
        <div className="lg:col-span-2">
          <Card className="rounded-[3rem] border-border/50 shadow-none overflow-hidden bg-card">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-2xl font-black tracking-tight">Tax Jurisdictions</CardTitle>
              <CardDescription className="font-medium text-muted-foreground">Active tax rates applied to invoices and transactions</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead className="pl-8 font-black uppercase text-[10px] tracking-widest">Region / Entity</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Tax Type</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Rate (%)</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                    <TableHead className="text-right pr-8 font-black uppercase text-[10px] tracking-widest">Last Update</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-black animate-pulse">Checking Regulatory Data...</TableCell></TableRow>
                  ) : rules.map((rule) => (
                    <TableRow key={rule.id} className="border-border/30 hover:bg-muted/20 transition-colors">
                      <TableCell className="pl-8 py-5">
                        <p className="font-black text-lg">{rule.region}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="rounded-lg font-black text-[9px] uppercase tracking-widest border-none px-2 py-0.5">{rule.taxType || rule.type}</Badge>
                      </TableCell>
                      <TableCell>
                         <p className="font-black text-xl">{rule.rate}%</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-emerald-600">
                           <CheckCircle className="h-4 w-4" />
                           <span className="text-[10px] font-black uppercase tracking-widest">Compliant</span>
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
           <Card className="rounded-[3rem] border-emerald-500/20 bg-emerald-500/5 overflow-hidden">
             <CardHeader className="p-8 pb-4">
                <div className="flex items-center gap-2 mb-2 text-emerald-600">
                  <Shield className="h-5 w-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Compliance Status</span>
                </div>
                <CardTitle className="text-2xl font-black">All Zones Active</CardTitle>
             </CardHeader>
             <CardContent className="p-8 pt-0">
                <p className="text-sm font-medium text-emerald-600/80 mb-6 italic leading-relaxed">
                  "Your tax configurations are currently aligned with the latest legal updates for Q2 2024."
                </p>
                <div className="space-y-4">
                   <div className="flex items-center justify-between p-4 rounded-2xl bg-background border border-emerald-500/10">
                      <span className="text-xs font-bold">VAT Returns Due</span>
                      <span className="font-black text-emerald-600">14 Days</span>
                   </div>
                   <Button className="w-full h-12 rounded-2xl font-black bg-emerald-600 hover:bg-emerald-700">File Tax Report</Button>
                </div>
             </CardContent>
           </Card>

           <Card className="rounded-[3rem] border-border/50 bg-muted/20">
             <CardHeader className="p-8 pb-4">
               <CardTitle className="text-xl font-black tracking-tight">Resources</CardTitle>
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

           <div className="p-8 rounded-[3rem] border border-dashed border-border flex flex-col items-center text-center gap-4 bg-muted/10">
              <Scale className="h-10 w-10 text-muted-foreground/40" />
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Regulatory Advisor</p>
              <p className="text-sm font-medium text-muted-foreground leading-snug italic">"Consider enabling NEXUS tracking for US-based customers."</p>
              <Button variant="ghost" className="rounded-full text-xs font-black uppercase tracking-widest gap-2">
                <HelpCircle className="h-4 w-4" /> Ask AI Accountant
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
