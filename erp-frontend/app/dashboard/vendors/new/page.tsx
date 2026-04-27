"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Loader2, Building2, Mail, Phone, MapPin, ShieldCheck } from "lucide-react";
import { vendorsApi } from "@/lib/api";
import { toast } from "sonner";

export default function OnboardVendorPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    contactPerson: "",
    company: "",
    address: "",
    category: "general",
    status: "Active",
    reliabilityScore: 100
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await vendorsApi.create(formData);
      toast.success("Vendor successfully onboarded");
      router.push("/dashboard/vendors");
    } catch (err) {
      toast.error("Failed to onboard vendor");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-geist">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/vendors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Onboard New Vendor</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl border-border/40 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-2xl font-bold">Vendor Entity Details</CardTitle>
              <CardDescription>Primary identification and contact records</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Legal Name</Label>
                  <Input id="name" placeholder="Acme Corp Ltd" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="h-12 rounded-2xl border-border/50 bg-muted/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Business Email</Label>
                  <Input id="email" type="email" placeholder="vendors@acme.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="h-12 rounded-2xl border-border/50 bg-muted/20" />
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Primary Contact Person</Label>
                  <Input id="contactPerson" placeholder="John Doe" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} className="h-12 rounded-2xl border-border/50 bg-muted/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Phone Number</Label>
                  <Input id="phone" placeholder="+250 788..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="h-12 rounded-2xl border-border/50 bg-muted/20" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Headquarters Address</Label>
                <Textarea id="address" placeholder="Kigali, Rwanda..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="rounded-2xl border-border/50 bg-muted/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl border-border/40 shadow-none bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">Supply Classification</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Category</Label>
                <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
                  <SelectTrigger className="h-12 rounded-2xl border-border/50 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Supplies</SelectItem>
                    <SelectItem value="it_software">IT & Software</SelectItem>
                    <SelectItem value="logistics">Logistics & Freight</SelectItem>
                    <SelectItem value="raw_materials">Raw Materials</SelectItem>
                    <SelectItem value="services">Professional Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Initial Status</Label>
                <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                  <SelectTrigger className="h-12 rounded-2xl border-border/50 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Standard Active</SelectItem>
                    <SelectItem value="Strategic">Strategic Partner</SelectItem>
                    <SelectItem value="Probation">On Probation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full h-14 rounded-2xl font-bold text-lg gap-2 shadow-xl shadow-primary/20" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />}
                Complete Onboarding
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
