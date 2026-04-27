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
  Plus, Search, Filter, Download, Package, AlertOctagon, TrendingUp, Warehouse, Loader2, Sparkles, History
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";

import { inventoryApi } from "@/lib/api";

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
    setIsForecasting(true);
    try {
      // Pass required params for AI forecast: sku, current_stock, avg_daily_sales
      const data = await inventoryApi.getForecast(product.sku, product.stockQuantity, 5); // Assuming 5 for avg_daily_sales for now
      setForecast(data);
    } catch {
      toast.error("AI Insight failed.");
    } finally {
      setIsForecasting(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lowStockCount = products.filter(p => p.stockQuantity <= p.minStockLevel).length;

  return (
    <div className="space-y-8 font-geist animate-in fade-in duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Control</h1>
          <p className="text-muted-foreground">Manage stock levels, SKUs and warehouse logistics</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 rounded-2xl border-border/50 bg-background/50 font-bold">
            <History className="h-4 w-4" />
            Stock Ledger
          </Button>
          <Button className="gap-2 rounded-2xl font-black shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="rounded-[2.5rem] border-border/40 shadow-none overflow-hidden bg-gradient-to-br from-background to-muted/30">
          <CardContent className="p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                <Package className="h-7 w-7" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Items</p>
                <h3 className="text-3xl font-black tracking-tighter">{products.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-border/40 shadow-none overflow-hidden bg-gradient-to-br from-background to-red-50/10">
          <CardContent className="p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-red-100/50 text-red-600">
                <AlertOctagon className="h-7 w-7" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Low Stock</p>
                <h3 className="text-3xl font-black tracking-tighter text-red-600">{lowStockCount}</h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-border/40 shadow-none overflow-hidden bg-gradient-to-br from-background to-emerald-50/10">
          <CardContent className="p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-100/50 text-emerald-600">
                <TrendingUp className="h-7 w-7" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Asset Value</p>
                <h3 className="text-3xl font-black tracking-tighter text-emerald-600">
                  {formatCurrency(products.reduce((acc, p) => acc + (p.stockQuantity * p.unitPrice), 0))}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-border/40 shadow-none overflow-hidden bg-gradient-to-br from-background to-indigo-50/10">
          <CardContent className="p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-100/50 text-indigo-600">
                <Warehouse className="h-7 w-7" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Locations</p>
                <h3 className="text-3xl font-black tracking-tighter text-indigo-600">04</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Inventory List */}
        <div className="lg:col-span-2">
          <Card className="rounded-[3rem] border-border/50 shadow-none overflow-hidden bg-card">
            <CardHeader className="p-8 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-black tracking-tight">Stock List</CardTitle>
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
                    <TableHead className="w-[100px] pl-8 font-black uppercase text-[10px] tracking-widest">SKU</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Product</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                    <TableHead className="text-right font-black uppercase text-[10px] tracking-widest pr-8">Stock Level</TableHead>
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
                          <span className="text-[10px] text-muted-foreground uppercase font-black">{product.category} • {product.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.stockQuantity <= product.minStockLevel ? (
                          <Badge variant="destructive" className="rounded-lg font-black text-[9px] px-2 py-0.5">CRITICAL</Badge>
                        ) : (
                          <Badge variant="outline" className="rounded-lg border-emerald-500/30 text-emerald-600 bg-emerald-500/5 font-black text-[9px] px-2 py-0.5 uppercase">Healthy</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex items-center justify-end gap-3">
                          <div className="w-24 h-2 bg-muted/40 rounded-full overflow-hidden">
                            <div 
                              className={cn("h-full transition-all duration-500", product.stockQuantity <= product.minStockLevel ? "bg-red-500" : "bg-primary")} 
                              style={{ width: `${Math.min((product.stockQuantity / 100) * 100, 100)}%` }} 
                            />
                          </div>
                          <span className="font-black text-lg w-10">{product.stockQuantity}</span>
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
          <Card className="rounded-[3rem] border-primary/20 shadow-2xl shadow-primary/5 bg-gradient-to-b from-primary/5 to-transparent sticky top-24">
            <CardHeader className="p-8">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Predictive Insights</span>
              </div>
              <CardTitle className="text-2xl font-black">AI Stock Forecast</CardTitle>
              <CardDescription className="font-medium">Deep analysis of turnover rates and reorder necessity</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0">
              {selectedProduct ? (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                  <div className="p-6 rounded-[2rem] bg-background border border-border/50 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-black text-lg">{selectedProduct.sku}</p>
                      <Badge variant="secondary" className="rounded-full font-bold">{selectedProduct.name}</Badge>
                    </div>
                    {isForecasting ? (
                      <div className="flex flex-col items-center justify-center py-8 gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Analyzing Sales Velocity...</p>
                      </div>
                    ) : forecast && (
                      <div className="space-y-4">
                        <div className="flex items-end gap-2">
                           <span className="text-5xl font-black tracking-tighter text-primary">{forecast.days_until_out}</span>
                           <span className="text-xs font-bold text-muted-foreground pb-2 uppercase tracking-widest">Days until stockout</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-muted/30 border border-dashed border-border text-sm font-medium leading-relaxed italic">
                          "{forecast.recommendation}"
                        </div>
                        <div className="pt-4 border-t border-border/50">
                           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Target Reorder Date</p>
                           <p className="text-xl font-black text-foreground">{forecast.predicted_reorder_date}</p>
                        </div>
                        <Button className="w-full h-12 rounded-2xl font-black shadow-lg shadow-primary/20">
                          Generate Purchase Order
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border-2 border-dashed border-border/50 rounded-[3rem] bg-muted/10 opacity-60">
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
