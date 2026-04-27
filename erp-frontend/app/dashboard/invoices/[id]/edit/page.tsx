"use client";

import { useState, useEffect, useMemo } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  Send,
  Save,
  RefreshCw,
  FileText,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LineItem {
  id: number;
  description: string;
  quantity: number;
  rate: number;
}

import { clientsApi, invoicesApi } from "@/lib/api";
import { toast } from "sonner";

const currencies = [
  { code: "RWF", symbol: "FRw", name: "Rwandan Franc", rate: 1 },
  { code: "USD", symbol: "$", name: "US Dollar", rate: 0.00078 },
];

export default function EditInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  
  const [currency, setCurrency] = useState("RWF");
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [formData, setFormData] = useState({
    clientId: "",
    invoiceNumber: "",
    issueDate: "",
    dueDate: "",
    notes: "",
    taxRate: 18,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        const [clientsData, invoiceData] = await Promise.all([
          clientsApi.getAll(),
          id ? invoicesApi.getById(id) : Promise.resolve(null)
        ]);
        
        setClients(clientsData);

        if (invoiceData) {
          setFormData({
            clientId: invoiceData.client?.id?.toString() || "",
            invoiceNumber: invoiceData.id?.toString() || id?.toString() || "",
            issueDate: invoiceData.issueDate || "",
            dueDate: invoiceData.dueDate || "",
            notes: invoiceData.notes || "",
            taxRate: 18,
          });
          setLineItems(invoiceData.items || [
            { id: 1, description: "Professional Consulting", quantity: 1, rate: invoiceData.amount || 0 }
          ]);
        }
      } catch (err) {
        console.error("Failed to load invoice data", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [params.id]);

  const subtotal = lineItems.reduce((acc, item) => acc + item.quantity * item.rate, 0);
  const tax = subtotal * (formData.taxRate / 100);
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      if (!id) return;

      // Prepare payload
      const payload = {
        ...formData,
        amount: subtotal,
        items: lineItems.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.rate,
          totalPrice: item.quantity * item.rate
        }))
      };

      await invoicesApi.update(id, payload);
      toast.success("Invoice updated successfully");
      router.push("/dashboard/invoices");
    } catch (err) {
      toast.error("Failed to update invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateLineItem = (id: number, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };

  if (isLoading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="font-bold text-muted-foreground animate-pulse tracking-widest uppercase text-[10px]">Loading Invoice Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" asChild className="h-12 w-12 rounded-full border bg-background shadow-sm">
            <Link href="/dashboard/invoices">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Edit Record</h1>
            <p className="text-muted-foreground font-medium flex items-center gap-2">
               Modifying <span className="text-foreground font-bold">{formData.invoiceNumber}</span>
            </p>
          </div>
        </div>
        <div className="flex gap-3">
           <Badge variant="outline" className="h-10 px-4 rounded-xl border-emerald-100 bg-emerald-50 text-emerald-700 font-bold uppercase tracking-widest text-[10px]">
             Audit Clear
           </Badge>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        {/* Main Section */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-2xl border-border/50 shadow-none overflow-hidden">
            <CardHeader className="bg-muted/30 p-8 border-b">
               <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  Primary Details
               </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
               <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Client Entity</Label>
                    <Select value={formData.clientId} onValueChange={(v) => setFormData({...formData, clientId: v})}>
                       <SelectTrigger className="h-12 rounded-2xl border-border/50 bg-muted/20">
                          <SelectValue placeholder="Select client" />
                       </SelectTrigger>
                        <SelectContent>
                          {clients.map((c: any) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                       </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Reference No.</Label>
                    <Input value={formData.invoiceNumber} readOnly className="h-12 rounded-2xl bg-muted/30 font-mono font-bold" />
                  </div>
               </div>
               <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Issue Date</Label>
                    <Input type="date" value={formData.issueDate} onChange={e => setFormData({...formData, issueDate: e.target.value})} className="h-12 rounded-2xl bg-muted/10 border-border/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Terms (Due Date)</Label>
                    <Input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="h-12 rounded-2xl bg-muted/10 border-border/50" />
                  </div>
               </div>
            </CardContent>
          </Card>

          {/* Line Items Portal */}
          <Card className="rounded-2xl border-border/50 shadow-none overflow-hidden">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-bold">Line Items</CardTitle>
                <CardDescription>Adjust quantity and rates for consulting hours</CardDescription>
             </CardHeader>
             <CardContent className="p-8 pt-4 space-y-6">
                {lineItems.map((item, idx) => (
                   <div key={item.id} className="grid grid-cols-12 gap-4 items-end bg-muted/10 p-4 rounded-3xl border border-border/20">
                      <div className="col-span-6 space-y-2">
                         <Label className="text-[10px] font-bold italic">Description</Label>
                         <Input value={item.description} onChange={e => updateLineItem(item.id, 'description', e.target.value)} className="h-11 rounded-xl bg-background" />
                      </div>
                      <div className="col-span-2 space-y-2">
                         <Label className="text-[10px] font-bold italic text-center block">Qty</Label>
                         <Input type="number" value={item.quantity} onChange={e => updateLineItem(item.id, 'quantity', parseInt(e.target.value))} className="h-11 rounded-xl bg-background text-center" />
                      </div>
                      <div className="col-span-3 space-y-2">
                         <Label className="text-[10px] font-bold italic text-right block">Rate</Label>
                         <Input type="number" value={item.rate} onChange={e => updateLineItem(item.id, 'rate', parseInt(e.target.value))} className="h-11 rounded-xl bg-background text-right font-bold" />
                      </div>
                      <div className="col-span-1 flex justify-end pb-1 text-red-400 hover:text-red-600 transition-colors">
                         <Trash2 className="h-5 w-5 cursor-pointer" onClick={() => setLineItems(lineItems.filter(li => li.id !== item.id))} />
                      </div>
                   </div>
                ))}
                <Button type="button" variant="outline" onClick={() => setLineItems([...lineItems, {id: Date.now(), description: "", quantity: 1, rate: 0}])} className="w-full h-12 rounded-2xl border-dashed border-2 hover:border-solid hover:bg-primary/5 hover:text-primary transition-all font-bold">
                   <Plus className="h-4 w-4 mr-2" />
                   Append New Line
                </Button>
             </CardContent>
          </Card>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
           <Card className="rounded-2xl border-border/50 shadow-xl shadow-primary/5 p-8 sticky top-24">
              <h3 className="text-lg font-bold uppercase tracking-widest mb-6 border-b pb-4">Financial Ledger</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-muted-foreground uppercase text-[10px] font-extrabold tracking-widest">Gross Subtotal</span>
                    <span className="font-bold">{subtotal.toLocaleString()} FRw</span>
                 </div>
                 <div className="flex justify-between items-center text-sm font-medium">
                    <div className="flex items-center gap-2">
                       <span className="text-muted-foreground uppercase text-[10px] font-extrabold tracking-widest italic">VAT (18%)</span>
                    </div>
                    <span className="font-bold text-amber-600">+{tax.toLocaleString()} FRw</span>
                 </div>
                 <div className="pt-6 border-t mt-4">
                    <div className="flex justify-between items-end">
                       <span className="text-xs font-bold uppercase tracking-widest text-primary">Revised Total</span>
                       <span className="text-3xl font-bold tracking-tight text-foreground">{total.toLocaleString()} FRw</span>
                    </div>
                 </div>
              </div>

              <div className="mt-10 space-y-3">
                 <Button type="submit" className="w-full h-14 rounded-2xl font-bold text-lg gap-2 shadow-lg shadow-primary/30" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    Confirm Revision
                 </Button>
                 <Button variant="outline" type="button" className="w-full h-12 rounded-2xl font-bold border-border bg-background transition-colors hover:bg-muted">
                    Save as Draft
                 </Button>
              </div>

              <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-2">
                 <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase">
                    <AlertCircle className="h-3 w-3" />
                    Revision Policy
                 </div>
                 <p className="text-[10px] text-muted-foreground font-medium leading-relaxed">
                    Altering a confirmed invoice will re-generate the audit trail and notify the assigned Sr. Accountant.
                 </p>
              </div>
           </Card>
        </div>
      </form>
    </div>
  );
}
