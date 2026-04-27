"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Save,
  Loader2,
  Receipt,
  Tag,
  Store,
  Calendar,
  ShieldAlert,
  FileCheck,
  TrendingDown,
  Paperclip
} from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { expensesApi } from "@/lib/api";
import { toast } from "sonner";


const categories = [
  { value: "operations", label: "Operations" },
  { value: "software", label: "Software & SaaS" },
  { value: "marketing", label: "Marketing" },
  { value: "travel", label: "Travel & Dining" },
  { value: "payroll", label: "Payroll & Benefits" },
];

export default function EditExpensePage() {
  const router = useRouter();
  const params = useParams();
  const { formatCurrency } = useCurrency();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    description: "",
    category: "",
    vendor: "",
    amount: 0,
    date: "",
    status: "pending",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        if (!id) return;
        const data = await expensesApi.getById(id);
        if (data) {
          setFormData({
            description: data.description || "",
            category: data.category || "operations",
            vendor: (data as any).vendor || "",
            amount: data.amount || 0,
            date: data.date || "",
            status: data.status || "pending",
          });
        }
      } catch (err) {
        console.error("Failed to load expense", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      if (!id) return;
      await expensesApi.update(id, formData);
      toast.success("Expense entry updated successfully");
      router.push("/dashboard/expenses");
    } catch (err) {
      toast.error("Failed to update expense entry");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="font-bold text-muted-foreground animate-pulse tracking-widest uppercase text-[10px]">Verifying Expenditure...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 font-geist">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" asChild className="h-12 w-12 rounded-full border bg-background shadow-sm transition-transform hover:scale-105">
            <Link href="/dashboard/expenses">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Expense</h1>
            <p className="text-muted-foreground font-medium flex items-center gap-2">
               Revising entry <span className="text-foreground font-bold">{params.id}</span>
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
           <Card className="rounded-[2.5rem] border-border/50 shadow-none overflow-hidden">
              <CardHeader className="bg-muted/30 p-8 border-b">
                 <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
                    <Receipt className="h-6 w-6 text-primary" />
                    Expenditure Context
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                 <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1 italic">Line Description</Label>
                    <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="h-14 rounded-2xl border-border/50 bg-muted/20 text-lg font-bold" />
                 </div>

                 <div className="grid gap-6 md:grid-cols-2 text-balance">
                    <div className="space-y-2">
                       <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                          <Tag className="h-3 w-3" />
                          Ledger Category
                       </Label>
                       <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                          <SelectTrigger className="h-12 rounded-2xl border-border/50 bg-muted/20">
                             <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                             {categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                          </SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                          <Store className="h-3 w-3" />
                          Vendor / Merchant
                       </Label>
                       <Input value={formData.vendor} onChange={e => setFormData({...formData, vendor: e.target.value})} className="h-12 rounded-2xl border-border/50 bg-muted/20" />
                    </div>
                 </div>

                 <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                       <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          Expenditure Date
                       </Label>
                       <Input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="h-12 rounded-2xl border-border/50 bg-muted/20" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1 italic">Total Amount (Incl. VAT)</Label>
                       <div className="relative">
                          <Input type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: parseFloat(e.target.value)})} className="h-12 rounded-2xl border-border/50 bg-muted/20 pl-8 font-black" />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">$</span>
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>

           {/* Evidence & Compliance */}
           <Card className="rounded-[2.5rem] border-border/50 shadow-none overflow-hidden">
              <CardHeader className="p-8 pb-4">
                 <CardTitle className="text-xl font-black">Audit Evidence</CardTitle>
                 <CardDescription>Receipts and compliance documentation</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                 <div className="p-8 rounded-[2rem] border-2 border-dashed border-border/50 bg-muted/10 flex flex-col items-center justify-center gap-4 text-center group cursor-pointer hover:border-primary/50 transition-all">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                       <Paperclip className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                       <p className="text-sm font-bold">Replace Receipt Image</p>
                       <p className="text-xs text-muted-foreground italic">Drag or click to upload PDF/JPG</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 p-4 rounded-2xl border-emerald-100 bg-emerald-50/50">
                    <FileCheck className="h-5 w-5 text-emerald-600" />
                    <span className="text-xs text-emerald-700 font-bold uppercase tracking-tight">Existing receipt verified by AI Scanner</span>
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Sidebar Status */}
        <div className="space-y-8">
           <Card className="rounded-[2.5rem] border-border/50 shadow-xl shadow-primary/5 p-8 sticky top-24">
              <h3 className="text-lg font-black uppercase tracking-widest mb-6 border-b pb-4">Spend Control</h3>
              <div className="space-y-6">
                 <div className="space-y-4">
                    <Button type="submit" className="w-full h-14 rounded-2xl font-black text-lg gap-2 shadow-lg shadow-primary/30" disabled={isSubmitting}>
                       {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                       Update Entry
                    </Button>
                    <Button variant="outline" type="button" className="w-full h-12 rounded-2xl font-bold border-border bg-background transition-colors hover:bg-muted">
                       Cancel Audit
                    </Button>
                 </div>

                 <div className="pt-6 border-t space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-2xl border bg-muted/10">
                       <TrendingDown className="h-5 w-5 text-red-500" />
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-tight">Opex Impact</span>
                          <span className="text-xs text-foreground font-extrabold">{formatCurrency(formData.amount)} Deduced</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-2xl border border-amber-100 bg-amber-50/50">
                       <ShieldAlert className="h-5 w-5 text-amber-600" />
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-tight">Policy Check</span>
                          <span className="text-xs text-amber-700 font-bold">Within monthly limit</span>
                       </div>
                    </div>
                 </div>
              </div>
           </Card>
        </div>
      </form>
    </div>
  );
}
