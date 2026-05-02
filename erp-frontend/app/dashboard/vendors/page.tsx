"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Plus, Search, Filter, Mail, Star, CreditCard, ShieldCheck, Edit, Trash2, TrendingUp, TrendingDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrency } from "@/contexts/CurrencyContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { vendorsApi } from "@/lib/api";
import { PageSkeleton } from "@/components/ui/skeleton";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { SortableHeader } from "@/components/ui/sortable-header";
import { useTable } from "@/hooks/use-table";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export default function VendorsPage() {
  const { formatCurrency } = useCurrency();
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    vendorsApi.getAll()
      .then(setVendors)
      .finally(() => setLoading(false));
  }, []);

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.contactPerson && v.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || v.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const { sort, toggleSort, page, setPage, pageSize, setPageSize, paginated: pagedVendors, total: filteredTotal } =
    useTable(filteredVendors, { pageSize: 20 });

  if (loading) return <PageSkeleton cards={3} rows={8} cols={5} />;

  return (
    <div className="space-y-6">
      <PageBreadcrumb />
      <div className="flex flex-col gap-1 pb-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Vendor Network</h1>
          <p className="text-sm text-muted-foreground">Supply chain partners and procurement channels</p>
        </div>
        <div className="flex gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-xl gap-2 font-medium border-border/50">
                <Filter className="h-4 w-4" />
                Filter By Category
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl border-border/50">
              <DropdownMenuLabel className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Select Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setCategoryFilter("all")}>All Categories</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter("it_software")}>IT & Software</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter("logistics")}>Logistics</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter("raw_materials")}>Raw Materials</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCategoryFilter("services")}>Services</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-medium" asChild>
            <Link href="/dashboard/vendors/new">
              <Plus className="h-4 w-4" />
              Onboard Vendor
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="relative overflow-hidden border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-4 pt-6 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500 dark:bg-blue-950/50">
              <Star className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-emerald-500">
              <TrendingUp className="h-4 w-4" /> 2.1%
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-2xl font-bold">08</div>
            <p className="text-sm text-muted-foreground font-medium">Strategic Partners</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-4 pt-6 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 dark:bg-indigo-950/50">
              <CreditCard className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-red-500">
              <TrendingDown className="h-4 w-4" /> 1.5%
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-2xl font-bold">{formatCurrency(51500)}</div>
            <p className="text-sm text-muted-foreground font-medium">Total Procurement</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-4 pt-6 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 dark:bg-emerald-950/50">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-emerald-500">
              <TrendingUp className="h-4 w-4" /> 4.2%
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-2xl font-bold">92.4%</div>
            <p className="text-sm text-muted-foreground font-medium">Avg Reliability</p>
          </CardContent>
        </Card>
      </div>

      {/* Vendors Table */}
      <Card className="border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Suppliers Directory</CardTitle>
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
                <TableHead className="pl-8 font-bold uppercase text-[10px] tracking-widest">
                  <SortableHeader column="name" label="Supplier Entity" sort={sort} onSort={toggleSort} />
                </TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest">
                  <SortableHeader column="category" label="Performance" sort={sort} onSort={toggleSort} />
                </TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest">
                  <SortableHeader column="totalPurchasedAmount" label="Total Spend" sort={sort} onSort={toggleSort} />
                </TableHead>
                <TableHead className="font-bold uppercase text-[10px] tracking-widest">
                  <SortableHeader column="status" label="Status" sort={sort} onSort={toggleSort} />
                </TableHead>
                <TableHead className="text-right pr-8 font-bold uppercase text-[10px] tracking-widest">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTotal === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <ShieldCheck />
                        </EmptyMedia>
                        <EmptyTitle>No vendors found</EmptyTitle>
                        <EmptyDescription>
                          No vendors match your current search or filter. Try adjusting your criteria.
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              ) : pagedVendors.map((vendor) => (
                <TableRow key={vendor.id} className="group border-border/30 hover:bg-muted/30 transition-colors">
                  <TableCell className="pl-8 py-5">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center font-bold text-lg text-primary/60 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          {vendor.name.charAt(0)}
                       </div>
                       <div>
                          <p className="font-bold text-lg leading-tight">{vendor.name}</p>
                          <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                             <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {vendor.email}</span>
                             <span className="flex items-center gap-1 font-bold text-primary/70">{vendor.contactPerson || "No Contact"}</span>
                          </div>
                       </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1.5">
                       <div className="flex items-center justify-between w-24">
                          <span className="text-[10px] font-bold uppercase tracking-tight">Reliability</span>
                          <span className="text-[10px] font-bold text-primary">{vendor.reliabilityScore || 0}%</span>
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
                     <p className="font-bold text-lg">{formatCurrency(vendor.totalPurchasedAmount || 0)}</p>
                     <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{vendor.category || "General"}</p>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "rounded-lg font-bold text-[9px] px-2 py-0.5 border-none",
                      (vendor.status || "Active") === "Strategic" ? "bg-indigo-500/10 text-indigo-600" :
                      (vendor.status || "Active") === "Active" ? "bg-emerald-500/10 text-emerald-600" :
                      "bg-orange-500/10 text-orange-600"
                    )}>
                      {(vendor.status || "Active").toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex items-center justify-end gap-2">
                       <Button variant="ghost" size="icon" asChild className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary">
                          <Link href={`/dashboard/vendors/${vendor.id}/edit`}>
                            <Edit className="h-5 w-5" />
                          </Link>
                       </Button>
                       <Button
                         variant="ghost"
                         size="icon"
                         className="h-10 w-10 rounded-xl hover:bg-destructive/10 hover:text-destructive"
                         onClick={() => {
                            if(confirm("Are you sure you want to delete this vendor?")) {
                              vendorsApi.delete(vendor.id)
                                .then(() => {
                                   toast.success("Vendor deleted");
                                   window.location.reload();
                                })
                                .catch(() => toast.error("Failed to delete vendor"));
                            }
                         }}
                       >
                          <Trash2 className="h-5 w-5" />
                       </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <DataTablePagination
            total={filteredTotal}
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
