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
  Plus, Search, Filter, Phone, Mail, Building2, Star, CreditCard, ChevronRight, MoreHorizontal, UserCheck, ShieldCheck
} from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { cn } from "@/lib/utils";

import { vendorsApi } from "@/lib/api";

export default function VendorsPage() {
  const { formatCurrency } = useCurrency();
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    vendorsApi.getAll()
      .then(setVendors)
      .finally(() => setLoading(false));
  }, []);

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (v.contactPerson && v.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 font-geist animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Vendor Network</h1>
          <p className="text-muted-foreground font-medium">Manage supply chain partners and procurement channels</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 rounded-2xl border-border/50 bg-background/50 font-bold">
            <Filter className="h-4 w-4" />
            Filter By Category
          </Button>
          <Button className="gap-2 rounded-2xl font-black shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" />
            Onboard Vendor
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-[2.5rem] border-border/40 shadow-none bg-gradient-to-br from-background to-muted/20">
          <CardContent className="p-8">
             <div className="flex justify-between items-start">
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Strategic Partners</p>
                  <h3 className="text-3xl font-black tracking-tighter">08</h3>
               </div>
               <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <Star className="h-6 w-6" />
               </div>
             </div>
             <div className="mt-4 flex items-center gap-2">
                <Badge variant="secondary" className="rounded-full bg-emerald-500/10 text-emerald-600 border-none font-bold">+2 New This Month</Badge>
             </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-border/40 shadow-none bg-gradient-to-br from-background to-muted/20">
          <CardContent className="p-8">
             <div className="flex justify-between items-start">
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Procurement</p>
                  <h3 className="text-3xl font-black tracking-tighter">{formatCurrency(51500)}</h3>
               </div>
               <div className="p-3 rounded-2xl bg-indigo-100/50 text-indigo-600">
                  <CreditCard className="h-6 w-6" />
               </div>
             </div>
             <div className="mt-4 flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Accounts Payable: </span>
                <span className="text-sm font-black text-red-600">{formatCurrency(12400)}</span>
             </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-border/40 shadow-none bg-gradient-to-br from-background to-muted/20">
          <CardContent className="p-8">
             <div className="flex justify-between items-start">
               <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Avg Reliability</p>
                  <h3 className="text-3xl font-black tracking-tighter">92.4%</h3>
               </div>
               <div className="p-3 rounded-2xl bg-emerald-100/50 text-emerald-600">
                  <ShieldCheck className="h-6 w-6" />
               </div>
             </div>
             <div className="mt-4 w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "92.4%" }} />
             </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendors Table */}
      <Card className="rounded-[3rem] border-border/50 shadow-none overflow-hidden bg-card">
        <CardHeader className="p-8 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black tracking-tight">Suppliers Directory</CardTitle>
              <CardDescription className="font-medium text-muted-foreground">Maintain high-quality relationships with verified vendors</CardDescription>
            </div>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search vendor name or contact..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 rounded-2xl border-border/40 bg-muted/20 pl-10 font-medium"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="pl-8 font-black uppercase text-[10px] tracking-widest">Supplier Entity</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Performance</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Total Spend</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                <TableHead className="text-right pr-8 font-black uppercase text-[10px] tracking-widest">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={5} className="h-40 text-center text-muted-foreground font-black animate-pulse">Scanning Global Supply Chain...</TableCell></TableRow>
              ) : filteredVendors.map((vendor) => (
                <TableRow key={vendor.id} className="group border-border/30 hover:bg-muted/30 transition-colors">
                  <TableCell className="pl-8 py-5">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center font-black text-lg text-primary/60 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          {vendor.name.charAt(0)}
                       </div>
                       <div>
                          <p className="font-black text-lg leading-tight">{vendor.name}</p>
                          <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                             <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {vendor.email}</span>
                             <span className="flex items-center gap-1 font-black text-primary/70">{vendor.contactPerson || "No Contact"}</span>
                          </div>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5">
                       <div className="flex items-center justify-between w-24">
                          <span className="text-[10px] font-black uppercase tracking-tighter">Reliability</span>
                          <span className="text-[10px] font-black text-primary">{vendor.reliabilityScore || 0}%</span>
                       </div>
                       <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full", (vendor.reliabilityScore || 0) > 90 ? "bg-emerald-500" : (vendor.reliabilityScore || 0) > 80 ? "bg-primary" : "bg-orange-500")} 
                            style={{ width: `${vendor.reliabilityScore || 0}%` }} 
                          />
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                     <p className="font-black text-lg">{formatCurrency(vendor.totalPurchasedAmount || 0)}</p>
                     <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{vendor.category || "General"}</p>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "rounded-lg font-black text-[9px] px-2 py-0.5 border-none",
                      (vendor.status || "Active") === "Strategic" ? "bg-indigo-500/10 text-indigo-600" :
                      (vendor.status || "Active") === "Active" ? "bg-emerald-500/10 text-emerald-600" :
                      "bg-orange-500/10 text-orange-600"
                    )}>
                      {(vendor.status || "Active").toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex items-center justify-end gap-2">
                       <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary">
                          <ChevronRight className="h-5 w-5" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl">
                          <MoreHorizontal className="h-5 w-5" />
                       </Button>
                    </div>
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
