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
  Plus, Search, Filter, Download, Package, AlertOctagon, TrendingUp, TrendingDown, Warehouse, Loader2, Sparkles, History, Edit, Trash2
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";

import { inventoryApi, expensesApi } from "@/lib/api";

export default function InventoryPage() {
  const { formatCurrency } = useCurrency();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isForecasting, setIsForecasting] = useState(false);
  const [forecast, setForecast] = useState<any | null>(null);

  useEffect(() => {
    inventoryApi.getAll()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const handleForecast = async (product: any) => {
    setSelectedProduct(product);
    setForecast(null);
    setIsForecasting(true);
    try {
      const data = await inventoryApi.getForecast(product.sku, product.stockQuantity, 5);
      setForecast(data);
    } catch {
      toast.error("AI Insight failed.");
    } finally {
      setIsForecasting(false);
    }
  };

  const [isGeneratingPO, setIsGeneratingPO] = useState(false);

  const handleGeneratePurchaseOrder = async () => {
    if (!selectedProduct || !forecast) return;
    setIsGeneratingPO(true);
    try {
      const qty = Math.max(forecast.recommended_reorder_quantity || 50, 10);
      const unitPrice = selectedProduct.unitPrice || 1000;
      const total = qty * unitPrice;
      const poNumber = `PO-${Date.now().toString().slice(-6)}`;
      await expensesApi.create({
        description: `Purchase Order ${poNumber} — ${qty} × ${selectedProduct.name}`,
        amount: total,
        category: "operations",
        vendor: selectedProduct.supplier || "Supplier",
        status: "pending",
        date: new Date().toISOString().split("T")[0],
      });
      toast.success(`✅ ${poNumber} created — ${qty} units of ${selectedProduct.name} for ${total.toLocaleString()} Rwf`);
    } catch {
      toast.error("Failed to generate purchase order.");
    } finally {
      setIsGeneratingPO(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockCount = products.filter(p => p.stockQuantity <= p.minStockLevel).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 pb-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Stock Intelligence</h1>
          <p className="text-sm text-muted-foreground">Predictive inventory control and warehouse logistics</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl gap-2 font-medium border-border/50" asChild>
            <Link href="/dashboard/inventory/ledger">
              <History className="h-4 w-4" /> Stock Ledger
            </Link>
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-medium" asChild>
            <Link href="/dashboard/inventory/new">
              <Plus className="h-4 w-4" /> Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="relative overflow-hidden border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-4 pt-6 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-500 dark:bg-blue-950/50">
              <Package className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-emerald-500">
              <TrendingUp className="h-4 w-4" /> 12.5%
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-sm text-muted-foreground font-medium">Total Items</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-4 pt-6 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-950/50">
              <AlertOctagon className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-red-500">
              <TrendingDown className="h-4 w-4" /> 3.2%
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-2xl font-bold">{lowStockCount}</div>
            <p className="text-sm text-muted-foreground font-medium">Low Stock</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-4 pt-6 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500 dark:bg-emerald-950/50">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-emerald-500">
              <TrendingUp className="h-4 w-4" /> 8.4%
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-2xl font-bold">
              {formatCurrency(products.reduce((acc, p) => acc + (p.stockQuantity * p.unitPrice), 0))}
            </div>
            <p className="text-sm text-muted-foreground font-medium">Asset Value</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-4 pt-6 px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500 dark:bg-indigo-950/50">
              <Warehouse className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-muted-foreground">
              0%
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="text-2xl font-bold">04</div>
            <p className="text-sm text-muted-foreground font-medium">Locations</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Inventory List */}
        <div className="lg:col-span-2">
          <Card className="border border-border/50 shadow-sm rounded-2xl bg-white dark:bg-card overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold">Stock List</CardTitle>
                  <CardDescription className="font-medium text-muted-foreground">Real-time inventory levels across all categories</CardDescription>
                </div>
                <div className="relative w-72">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search SKU or Name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 rounded-2xl border-border/40 bg-muted/20 pl-10 placeholder:italic font-medium"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead className="w-[100px] pl-8 font-bold uppercase text-[10px] tracking-widest">SKU</TableHead>
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest">Product</TableHead>
                    <TableHead className="font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
                    <TableHead className="text-center font-bold uppercase text-[10px] tracking-widest">Stock Level</TableHead>
                    <TableHead className="text-right font-bold uppercase text-[10px] tracking-widest pr-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={4} className="h-32 text-center text-muted-foreground font-bold animate-pulse">Scanning Warehouse...</TableCell></TableRow>
                  ) : filteredProducts.map((product) => (
                    <TableRow 
                      key={product.id} 
                      className="cursor-pointer border-border/30 hover:bg-muted/30 transition-colors"
                      onClick={() => handleForecast(product)}
                    >
                      <TableCell className="pl-8 font-mono font-bold text-primary">{product.sku}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold">{product.name}</span>
                          <span className="text-[10px] text-muted-foreground uppercase font-bold">{product.category} • {product.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.stockQuantity <= product.minStockLevel ? (
                          <Badge variant="destructive" className="rounded-lg font-bold text-[9px] px-2 py-0.5">CRITICAL</Badge>
                        ) : (
                          <Badge variant="outline" className="rounded-lg border-emerald-500/30 text-emerald-600 bg-emerald-500/5 font-bold text-[9px] px-2 py-0.5 uppercase">Healthy</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-24 h-2 bg-muted/40 rounded-full overflow-hidden">
                            <div 
                              className={cn("h-full transition-all duration-500", product.stockQuantity <= product.minStockLevel ? "bg-red-500" : "bg-primary")} 
                              style={{ width: `${Math.min((product.stockQuantity / 100) * 100, 100)}%` }} 
                            />
                          </div>
                          <span className="font-bold text-lg w-10">{product.stockQuantity}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                           <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary">
                              <Link href={`/dashboard/inventory/${product.id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                           </Button>
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive"
                             onClick={() => {
                                if(confirm(`Are you sure you want to delete ${product.name}?`)) {
                                  inventoryApi.delete(product.id)
                                    .then(() => {
                                       toast.success("Product removed");
                                       window.location.reload();
                                    })
                                    .catch(() => toast.error("Failed to delete product"));
                                }
                             }}
                           >
                              <Trash2 className="h-4 w-4" />
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

        {/* AI Insight Sidebar */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-primary/20 shadow-2xl shadow-primary/5 bg-gradient-to-b from-primary/5 to-transparent sticky top-24">
            <CardHeader className="pb-2 px-6 pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Predictive Insights</span>
              </div>
              <CardTitle className="text-2xl font-bold">AI Stock Forecast</CardTitle>
              <CardDescription className="font-medium">Deep analysis of turnover rates and reorder necessity</CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {selectedProduct ? (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                  <div className="p-6 rounded-[2rem] bg-background border border-border/50 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-bold text-lg">{selectedProduct.sku}</p>
                      <Badge variant="secondary" className="rounded-full font-bold">{selectedProduct.name}</Badge>
                    </div>
                    {isForecasting ? (
                      <div className="flex flex-col items-center justify-center py-8 gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm font-medium text-muted-foreground text-muted-foreground">Analyzing Sales Velocity...</p>
                      </div>
                    ) : forecast && (
                      <div className="space-y-4">
                        <div className="flex items-end gap-2">
                           <span className="text-5xl font-bold tracking-tight text-primary">{forecast.days_until_out}</span>
                           <span className="text-xs font-bold text-muted-foreground pb-2 uppercase tracking-widest">Days until stockout</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-muted/30 border border-dashed border-border text-sm font-medium leading-relaxed italic">
                          "{forecast.recommendation}"
                        </div>
                        <div className="pt-4 border-t border-border/50">
                           <p className="text-sm font-medium text-muted-foreground text-muted-foreground mb-1">Target Reorder Date</p>
                           <p className="text-xl font-bold text-foreground">{forecast.predicted_reorder_date}</p>
                        </div>
                        <Button 
                          className="w-full font-medium gap-2" 
                          onClick={handleGeneratePurchaseOrder}
                          disabled={isGeneratingPO}
                        >
                          {isGeneratingPO ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                          {isGeneratingPO ? "Generating..." : "Generate Purchase Order"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border-2 border-dashed border-border/50 rounded-2xl bg-muted/10 opacity-60">
                   <Package className="h-12 w-12 text-muted-foreground" />
                   <p className="text-sm font-bold text-muted-foreground">Select a product to view <br /> AI predictive analysis</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
