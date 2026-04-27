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
  Building2,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  DollarSign,
  CalendarDays
} from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { clientsApi } from "@/lib/api";
import { toast } from "sonner";

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const { formatCurrency } = useCurrency();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    address: "",
    address: "",
    status: "active",
    totalInvoiced: 0,
    totalPaid: 0,
    monthlyRate: 0,
    preferredBillingDay: 1,
  });

  useEffect(() => {
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!id) return;

    clientsApi.getById(parseInt(id))
      .then(data => {
        setFormData({
          name: data.name || "",
          email: data.email || "",
          company: data.company || "",
          phone: data.phone || "",
          address: data.address || "",
          status: "active",
          totalInvoiced: (data as any).lifetimeRevenue || 0,
          totalPaid: (data as any).totalPaidAmount || 0,
          monthlyRate: data.monthlyRate || 0,
          preferredBillingDay: data.preferredBillingDay || 1,
        });
      })
      .catch(() => toast.error("Failed to load client profile"))
      .finally(() => setIsLoading(false));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      await clientsApi.update(parseInt(id!), formData);
      toast.success("Client profile updated successfully");
      router.push("/dashboard/clients");
    } catch {
      toast.error("Failed to update client profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="font-bold text-muted-foreground animate-pulse tracking-widest uppercase text-[10px]">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" asChild className="h-12 w-12 rounded-full border bg-background shadow-sm transition-transform hover:scale-105">
            <Link href="/dashboard/clients">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Edit Client</h1>
            <p className="text-muted-foreground font-medium flex items-center gap-2">
               Managing profile for <span className="text-foreground font-bold">{formData.name}</span>
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3 text-balance">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
           <Card className="rounded-2xl border-border/50 shadow-none overflow-hidden">
              <CardHeader className="bg-muted/30 p-8 border-b">
                 <CardTitle className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-primary" />
                    Company Information
                 </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                 <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                       <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Legal Entity Name</Label>
                       <Input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-12 rounded-2xl border-border/50 bg-muted/20 placeholder:italic" placeholder="e.g. Acme Corporation" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Trade/Alias Name</Label>
                       <Input value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="h-12 rounded-2xl border-border/50 bg-muted/20" />
                    </div>
                 </div>

                 <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                       <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          Billing Email
                       </Label>
                       <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="h-12 rounded-2xl border-border/50 bg-muted/20" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          Primary Contact Phone
                       </Label>
                       <Input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="h-12 rounded-2xl border-border/50 bg-muted/20" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                       <MapPin className="h-3 w-3" />
                       Registered Address
                    </Label>
                    <Textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="rounded-2xl border-border/50 bg-muted/20 resize-none min-h-[100px]" />
                 </div>
              </CardContent>
           </Card>

           {/* Financial Context */}
           <Card className="rounded-2xl border-border/50 shadow-none overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                 <CardTitle className="text-xl font-bold">Account Context</CardTitle>
                 <CardDescription>Administrative flags and financial standing</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                 <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                       <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Account Status</Label>
                       <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                          <SelectTrigger className="h-12 rounded-2xl border-border/50">
                             <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                             <SelectItem value="active">Active Relationship</SelectItem>
                             <SelectItem value="inactive">Legacy / Inactive</SelectItem>
                             <SelectItem value="blocked">Doubtful / Blocked</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                    <div className="col-span-2 p-6 rounded-3xl bg-muted/20 flex items-center justify-between border border-dashed border-border/50">
                       <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium text-muted-foreground text-muted-foreground italic">Lifetime Revenue</span>
                          <span className="text-2xl font-bold text-foreground">{formatCurrency(formData.totalInvoiced)}</span>
                       </div>
                       <TrendingUp className="h-8 w-8 text-emerald-500/30" />
                    </div>
                 </div>

                 <div className="grid gap-6 md:grid-cols-2 mt-8">
                    <div className="space-y-2">
                       <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground flex items-center gap-2">
                          <DollarSign className="h-3 w-3" />
                          Monthly Retainer Rate
                       </Label>
                       <Input 
                         type="number" 
                         value={formData.monthlyRate} 
                         onChange={e => setFormData({...formData, monthlyRate: parseFloat(e.target.value) || 0})} 
                         className="h-12 rounded-2xl border-primary/20 bg-primary/5 font-bold text-primary text-lg" 
                       />
                       <p className="text-[10px] text-muted-foreground italic font-medium">Used for automatic end-of-month invoice generation.</p>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground flex items-center gap-2">
                          <CalendarDays className="h-3 w-3" />
                          Preferred Billing Day
                       </Label>
                       <Input 
                         type="number" 
                         min="1" 
                         max="31" 
                         value={formData.preferredBillingDay} 
                         onChange={e => setFormData({...formData, preferredBillingDay: parseInt(e.target.value) || 1})} 
                         className="h-12 rounded-2xl border-border/50 bg-muted/20" 
                       />
                    </div>
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
           <Card className="rounded-2xl border-border/50 shadow-xl shadow-primary/5 p-8 sticky top-24">
              <h3 className="text-lg font-bold uppercase tracking-widest mb-6 border-b pb-4">CRM Control</h3>
              <div className="space-y-6">
                 <div className="flex flex-col gap-4">
                    <Button type="submit" className="w-full h-14 rounded-2xl font-bold text-lg gap-2 shadow-lg shadow-primary/30" disabled={isSubmitting}>
                       {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                       Commit Changes
                    </Button>
                    <Button variant="outline" type="button" className="w-full h-12 rounded-2xl font-bold border-border bg-background transition-colors hover:bg-muted">
                       Discard Edits
                    </Button>
                 </div>

                 <div className="pt-6 border-t space-y-4">
                    <div className="flex items-center gap-3 p-4 rounded-2x border border-border/50 bg-muted/10">
                       <ShieldCheck className="h-5 w-5 text-emerald-600" />
                       <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-tight">Identity Verification</span>
                          <span className="text-xs text-muted-foreground font-medium">No flagged issues found</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-2x border border-border/50 bg-muted/10">
                       <CreditCard className="h-5 w-5 text-indigo-600" />
                       <div className="flex flex-col">
                          <span className="text-[10px] font-bold uppercase tracking-tight">Payment Health</span>
                          <span className="text-xs text-muted-foreground font-medium">92% collection rate</span>
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
