"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  Building,
  MapPin,
  FileText,
  DollarSign,
  Edit,
  Trash2,
  Eye,
  Users,
  TrendingUp,
  AlertTriangle,
  Loader2,
  Globe,
  CreditCard,
  History,
  User,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn, formatDate } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";

const INITIAL_CLIENTS = [
  {
    id: "1",
    name: "Acme Corporation",
    email: "billing@acme.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Corp",
    address: "123 Business Ave, New York, NY 10001",
    totalInvoiced: 45000,
    totalPaid: 40500,
    status: "active",
    lastInvoice: "2024-01-15",
    invoiceCount: 12,
  },
  {
    id: "2",
    name: "Tech Solutions Inc.",
    email: "accounts@techsolutions.com",
    phone: "+1 (555) 234-5678",
    company: "Tech Solutions Inc.",
    address: "456 Tech Park, San Francisco, CA 94102",
    totalInvoiced: 28000,
    totalPaid: 22400,
    status: "active",
    lastInvoice: "2024-01-10",
    invoiceCount: 8,
  },
  {
    id: "3",
    name: "Global Dynamics",
    email: "finance@globaldynamics.com",
    phone: "+1 (555) 345-6789",
    company: "Global Dynamics Ltd",
    address: "789 Global Plaza, Chicago, IL 60601",
    totalInvoiced: 62000,
    totalPaid: 55800,
    status: "overdue",
    lastInvoice: "2023-12-28",
    invoiceCount: 15,
  },
  {
    id: "4",
    name: "StartUp Labs",
    email: "hello@startuplabs.io",
    phone: "+1 (555) 456-7890",
    company: "StartUp Labs",
    address: "101 Innovation Dr, Austin, TX 78701",
    totalInvoiced: 15000,
    totalPaid: 15000,
    status: "active",
    lastInvoice: "2024-01-08",
    invoiceCount: 4,
  },
  {
    id: "5",
    name: "Digital Ventures",
    email: "pay@digitalventures.co",
    phone: "+1 (555) 567-8901",
    company: "Digital Ventures Co",
    address: "202 Startup Lane, Seattle, WA 98101",
    totalInvoiced: 37500,
    totalPaid: 33750,
    status: "active",
    lastInvoice: "2024-01-12",
    invoiceCount: 9,
  },
  {
    id: "6",
    name: "Cloud Nine Systems",
    email: "billing@cloudnine.com",
    phone: "+1 (555) 678-9012",
    company: "Cloud Nine Systems",
    address: "303 Cloud Way, Denver, CO 80201",
    totalInvoiced: 89000,
    totalPaid: 80100,
    status: "active",
    lastInvoice: "2024-01-14",
    invoiceCount: 22,
  },
];

const statusStyles = {
  active: "bg-green-100 text-green-700 border-green-200",
  overdue: "bg-red-100 text-red-700 border-red-200",
  inactive: "bg-muted text-muted-foreground border-muted",
};

export default function ClientsPage() {
  const { formatCurrency } = useCurrency();
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Action States
  const [selectedClient, setSelectedClient] = useState<(typeof INITIAL_CLIENTS)[0] | null>(null);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);

  const handleDeleteClient = () => {
    if (!clientToDelete) return;
    setClients((prev) => prev.filter((c) => c.id !== clientToDelete));
    toast.success("Client data purged successfully.");
    setClientToDelete(null);
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: clients.length,
    active: clients.filter((c) => c.status === "active").length,
    totalRevenue: clients.reduce((acc, c) => acc + c.totalPaid, 0),
    outstanding: clients.reduce((acc, c) => acc + (c.totalInvoiced - c.totalPaid), 0),
  };

  const handleAddClient = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsAddDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            Manage your client relationships and contacts
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Enter the client details to add them to your system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Client Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" placeholder="Acme Corporation" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="client@company.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="+1 (555) 123-4567" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="123 Business Ave, City, State ZIP" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddClient} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Client"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Total Clients</CardDescription>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Active Clients</CardDescription>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Outstanding</CardDescription>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              ${stats.outstanding.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search clients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Client Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    {client.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <CardTitle className="text-base">{client.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {client.company}
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setSelectedClient(client)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                       <Link href={`/dashboard/clients/${client.id}/edit`}>
                         <Edit className="h-4 w-4 mr-2" />
                         Edit
                       </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="h-4 w-4 mr-2" />
                      Create Invoice
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive font-bold"
                      onClick={() => setClientToDelete(client.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{client.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{client.address}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Invoiced</p>
                    <p className="font-semibold">
                      {formatCurrency(client.totalInvoiced)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Outstanding</p>
                    <p className="font-semibold text-yellow-600">
                      {formatCurrency(client.totalInvoiced - client.totalPaid)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize",
                    statusStyles[client.status as keyof typeof statusStyles]
                  )}
                >
                  {client.status}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {client.invoiceCount} invoices
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Detail View Modal: Center Pop-out */}
      <Dialog open={!!selectedClient} onOpenChange={(open) => !open && setSelectedClient(null)}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-primary-foreground">
            <div className="flex items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-foreground text-primary text-3xl font-black shadow-lg">
                {selectedClient?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="space-y-1 text-left">
                <DialogTitle className="text-2xl font-black">{selectedClient?.name}</DialogTitle>
                <DialogDescription className="font-bold text-primary-foreground/80 flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  {selectedClient?.company}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          {selectedClient && (
            <div className="p-8 space-y-10 font-geist max-h-[70vh] overflow-y-auto">
              {/* Financial Vitality */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-3xl text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Lifetime Revenue</p>
                    <p className="text-2xl font-black text-emerald-700">{formatCurrency(selectedClient.totalPaid)}</p>
                 </div>
                 <div className="p-6 bg-amber-50/50 border border-amber-100 rounded-3xl text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Active Debt</p>
                    <p className="text-2xl font-black text-amber-700">{formatCurrency(selectedClient.totalInvoiced - selectedClient.totalPaid)}</p>
                 </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <User className="h-3 w-3" />
                    Account details
                 </p>
                 <div className="grid gap-3">
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-border/50 transition-colors hover:bg-muted/30">
                       <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center border shadow-sm text-muted-foreground">
                          <Mail className="h-5 w-5" />
                       </div>
                       <div className="flex-1 overflow-hidden text-left">
                          <p className="text-[10px] font-black text-muted-foreground uppercase">Email Address</p>
                          <p className="font-bold text-sm truncate">{selectedClient.email}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-border/50 transition-colors hover:bg-muted/30">
                       <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center border shadow-sm text-muted-foreground">
                          <Phone className="h-5 w-5" />
                       </div>
                       <div className="flex-1 overflow-hidden text-left">
                          <p className="text-[10px] font-black text-muted-foreground uppercase">Direct Line</p>
                          <p className="font-bold text-sm">{selectedClient.phone}</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Physical Presence */}
              <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    Billing HQ
                 </p>
                 <div className="p-5 rounded-3xl bg-muted/10 border border-dashed border-border/60 text-sm italic text-muted-foreground flex gap-4 text-left">
                    <Globe className="h-5 w-5 text-primary shrink-0" />
                    {selectedClient.address}
                 </div>
              </div>

              {/* Engagement Stats */}
              <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <History className="h-3 w-3" />
                    Engagement Metrics
                 </p>
                 <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl border text-center">
                       <p className="text-[10px] text-muted-foreground uppercase font-black">Invoices</p>
                       <p className="text-xl font-black">{selectedClient.invoiceCount}</p>
                    </div>
                    <div className="p-4 rounded-2xl border text-center">
                       <p className="text-[10px] text-muted-foreground uppercase font-black">Status</p>
                       <p className="text-xs font-black uppercase text-emerald-600">{selectedClient.status}</p>
                    </div>
                    <div className="p-4 rounded-2xl border text-center">
                       <p className="text-[10px] text-muted-foreground uppercase font-black">Tier</p>
                       <p className="text-xs font-black uppercase">Enterprise</p>
                    </div>
                 </div>
              </div>

              <div className="flex gap-4 pt-4 pb-8">
                 <Button className="flex-1 font-bold h-12 rounded-2xl shadow-lg shadow-primary/20">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Create New Invoice
                 </Button>
                 <Button variant="outline" className="flex-1 font-bold h-12 rounded-2xl border-border bg-background hover:bg-muted" asChild>
                    <Link href={`/dashboard/clients/${selectedClient.id}/edit`}>
                       Edit Profile
                    </Link>
                 </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!clientToDelete} onOpenChange={(open) => !open && setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. You are about to permanently delete
              <span className="font-bold text-foreground mx-1">
              {clients.find(c => c.id === clientToDelete)?.name}
              </span>
              and all associated record history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteClient}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirm Deletion
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
