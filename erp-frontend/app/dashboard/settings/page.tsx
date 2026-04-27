"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Loader2, Upload, Building, CreditCard, Bell, Shield, Palette, Database } from "lucide-react";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useAuth } from "@/contexts/AuthContext";
import { backupApi } from "@/lib/api";
import { useEffect } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { currency, setCurrency } = useCurrency();
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    emailInvoice: true,
    emailPayment: true,
    emailReminder: true,
    pushAll: false,
    weeklyReport: true,
  });
  const { user } = useAuth();
  const [backupStats, setBackupStats] = useState<any>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupTime, setBackupTime] = useState("02:00");

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      backupApi.getStats().then(setBackupStats).catch(console.error);
    }
  }, [user]);

  const handleBackup = async () => {
    setIsBackingUp(true);
    try {
      await backupApi.trigger();
      toast.success("Database backup completed successfully.");
      const stats = await backupApi.getStats();
      setBackupStats(stats);
    } catch {
      toast.error("Failed to perform backup.");
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences
        </p>
      </div>

      <Tabs defaultValue="company" className="space-y-6">
        <TabsList>
          <TabsTrigger value="company" className="gap-2">
            <Building className="h-4 w-4" />
            Company
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          {user?.role === 'ADMIN' && (
            <TabsTrigger value="backups" className="gap-2">
              <Database className="h-4 w-4" />
              Database Backups
            </TabsTrigger>
          )}
        </TabsList>

        {/* Company Settings */}
        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                This information will appear on your invoices and documents.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <Button variant="outline" size="sm">Upload Logo</Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    PNG, JPG up to 2MB
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" defaultValue="Acme Inc." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Business Email</Label>
                  <Input id="email" type="email" defaultValue="hello@acme.com" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue="https://acme.com" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Business Address</Label>
                <Textarea
                  id="address"
                  defaultValue="123 Business Ave, Suite 100&#10;New York, NY 10001&#10;United States"
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                  <Input id="taxId" defaultValue="US123456789" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="$">USD - US Dollar ($)</SelectItem>
                      <SelectItem value="Rwf">RWF - Rwandan Franc (Rwf)</SelectItem>
                      <SelectItem value="€">EUR - Euro (€)</SelectItem>
                      <SelectItem value="£">GBP - British Pound (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Settings</CardTitle>
              <CardDescription>
                Configure default settings for your invoices.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="prefix">Invoice Number Prefix</Label>
                  <Input id="prefix" defaultValue="INV-" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentTerms">Default Payment Terms</Label>
                  <Select defaultValue="14">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Net 7 days</SelectItem>
                      <SelectItem value="14">Net 14 days</SelectItem>
                      <SelectItem value="30">Net 30 days</SelectItem>
                      <SelectItem value="60">Net 60 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Default Invoice Notes</Label>
                <Textarea
                  id="notes"
                  defaultValue="Thank you for your business! Payment is due within the specified terms."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Plan</CardTitle>
              <CardDescription>
                You are currently on the Professional plan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
                <div>
                  <h3 className="font-semibold">Professional Plan</h3>
                  <p className="text-sm text-muted-foreground">
                    Unlimited invoices, unlimited clients, AI insights
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">$79</p>
                  <p className="text-sm text-muted-foreground">/month</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="outline">Change Plan</Button>
                <Button variant="outline" className="text-destructive">
                  Cancel Subscription
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>
                Manage your payment methods and billing information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-14 items-center justify-center rounded bg-muted">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Edit</Button>
              </div>
              <Button variant="outline">Add Payment Method</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Choose what email notifications you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Invoice sent confirmations</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when an invoice is successfully sent
                  </p>
                </div>
                <Switch
                  checked={notifications.emailInvoice}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailInvoice: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Payment received</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when a payment is received
                  </p>
                </div>
                <Switch
                  checked={notifications.emailPayment}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailPayment: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Payment reminders</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified about upcoming and overdue payments
                  </p>
                </div>
                <Switch
                  checked={notifications.emailReminder}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailReminder: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Weekly summary report</p>
                  <p className="text-sm text-muted-foreground">
                    Receive a weekly summary of your financial activity
                  </p>
                </div>
                <Switch
                  checked={notifications.weeklyReport}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, weeklyReport: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button>Update Password</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">Authenticator App</p>
                  <p className="text-sm text-muted-foreground">
                    Use an authenticator app for 2FA
                  </p>
                </div>
                <Button variant="outline">Enable</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>
                Customize the appearance of the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Color Theme</Label>
                <Select defaultValue="light">
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Backups Settings */}
        {user?.role === 'ADMIN' && (
          <TabsContent value="backups" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Database Backups</CardTitle>
                <CardDescription>
                  Manage cross-region database backups for the primary and secondary databases.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="p-4 rounded-xl border bg-muted/20">
                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Primary DB (Neon)</p>
                     <p className="text-3xl font-bold">{backupStats?.primaryDbSizeMB || 0} MB</p>
                  </div>
                  <div className="p-4 rounded-xl border bg-muted/20">
                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Secondary DB (Turso)</p>
                     <p className="text-3xl font-bold">{backupStats?.secondaryDbSizeMB || 0} MB</p>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="font-bold">System Status</p>
                        <p className="text-sm text-muted-foreground">Last Backup: {backupStats?.lastBackupTime ? new Date(backupStats.lastBackupTime).toLocaleString() : 'N/A'}</p>
                     </div>
                     <Badge className="bg-emerald-500 hover:bg-emerald-600 font-bold px-3">
                        {backupStats?.status || "Healthy"}
                     </Badge>
                  </div>

                  <div className="flex gap-4 pt-4">
                     <div className="flex-1 flex gap-2">
                        <Input 
                          type="time" 
                          value={backupTime}
                          onChange={(e) => setBackupTime(e.target.value)}
                          className="w-32 h-12" 
                        />
                        <Button variant="outline" className="h-12 font-bold" onClick={async () => {
                          try {
                            const res = await backupApi.schedule(backupTime);
                            toast.success(res.message);
                          } catch {
                            toast.error("Failed to schedule backup");
                          }
                        }}>
                          Set Schedule
                        </Button>
                     </div>
                     <Button className="font-bold h-12 gap-2" onClick={handleBackup} disabled={isBackingUp}>
                        {isBackingUp ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
                        Trigger Manual Backup
                     </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
