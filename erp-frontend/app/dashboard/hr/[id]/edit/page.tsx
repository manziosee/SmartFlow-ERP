"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Loader2, UserPlus, Briefcase, DollarSign, Mail } from "lucide-react";
import { hrApi } from "@/lib/api";
import { toast } from "sonner";

export default function EditEmployeePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "engineering",
    jobTitle: "",
    baseSalary: 0,
    status: "Active"
  });

  useEffect(() => {
    const loadEmployee = async () => {
      try {
        const data = await hrApi.getEmployee(parseInt(id));
        setFormData(data);
      } catch (err) {
        console.error("Employee Load Error:", err);
        toast.error("Failed to load employee data. Please verify the ID or try again.");
        // We stay on the page to allow the user to see the error or try again
      } finally {
        setIsLoading(false);
      }
    };
    if (id) loadEmployee();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await hrApi.updateEmployee(parseInt(id), formData);
      toast.success("Employee record updated");
      router.push("/dashboard/hr");
    } catch (err) {
      toast.error("Failed to update employee record");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-geist">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/hr">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold tracking-tight">Edit Employee</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl border-border/40 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-2xl font-bold italic tracking-tight">Identity Profile</CardTitle>
              <CardDescription>Primary identification and communication channel</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">First Name</Label>
                  <Input id="firstName" placeholder="Jean" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required className="h-12 rounded-2xl border-border/50 bg-muted/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Last Name</Label>
                  <Input id="lastName" placeholder="Niyomugabo" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required className="h-12 rounded-2xl border-border/50 bg-muted/20" />
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1 flex items-center gap-2"><Mail className="h-3 w-3" /> Email Address</Label>
                  <Input id="email" type="email" placeholder="j.niyomugabo@smartflow.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required className="h-12 rounded-2xl border-border/50 bg-muted/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Phone Number</Label>
                  <Input id="phone" placeholder="+250 788..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="h-12 rounded-2xl border-border/50 bg-muted/20" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/40 shadow-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-2xl font-bold italic tracking-tight">Role & Compensation</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1 flex items-center gap-2"><Briefcase className="h-3 w-3" /> Professional Title</Label>
                  <Input id="jobTitle" placeholder="Senior Accountant" value={formData.jobTitle} onChange={e => setFormData({...formData, jobTitle: e.target.value})} required className="h-12 rounded-2xl border-border/50 bg-muted/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Department</Label>
                  <Select value={formData.department} onValueChange={v => setFormData({...formData, department: v})}>
                    <SelectTrigger className="h-12 rounded-2xl border-border/50 bg-muted/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="sales_marketing">Sales & Marketing</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="baseSalary" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1 flex items-center gap-2"><DollarSign className="h-3 w-3" /> Monthly Base Salary (RWF)</Label>
                <Input id="baseSalary" type="number" value={formData.baseSalary} onChange={e => setFormData({...formData, baseSalary: parseFloat(e.target.value)})} required className="h-12 rounded-2xl border-border/50 bg-muted/20 font-bold text-lg" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl border-border/40 shadow-none bg-primary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-bold">Status Control</CardTitle>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground ml-1">Employment Status</Label>
                <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v})}>
                  <SelectTrigger className="h-12 rounded-2xl border-border/50 bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active Duty</SelectItem>
                    <SelectItem value="OnLeave">On Leave</SelectItem>
                    <SelectItem value="Terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full h-14 rounded-2xl font-bold text-lg gap-2 shadow-xl shadow-primary/20" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                Update Record
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
