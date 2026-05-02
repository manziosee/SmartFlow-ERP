"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Skeleton, PageSkeleton } from "@/components/ui/skeleton";
import { PageBreadcrumb } from "@/components/ui/page-breadcrumb";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useTable } from "@/hooks/use-table";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { useFormValidation, required, email as emailRule } from "@/hooks/use-form-validation";
import {
  Plus, Search, MoreHorizontal, Mail, Phone, MapPin, Building,
  FileText, DollarSign, Edit, Trash2, Eye, Users, TrendingUp,
  AlertTriangle, Loader2, Globe, CreditCard, History, User,
} from "lucide-react";
import { toast } from "sonner";
import { cn, formatDate } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { clientsApi, type Client } from "@/lib/api";

const statusStyles: Record<string, string> = {
  ACTIVE:   "bg-green-100 text-green-700 border-green-200",
  OVERDUE:  "bg-red-100 text-red-700 border-red-200",
  INACTIVE: "bg-muted text-muted-foreground border-muted",
};

export default function ClientsPage() {
  const { formatCurrency } = useCurrency();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<number | null>(null);

  const [newClient, setNewClient] = useState({ name: "", company: "", email: "", phone: "", address: "" });
  const { errors: clientErrors, validate: validateClient, clearError: clearClientError } = useFormValidation({
    name: [required("Client name is required")],
    email: [required("Email is required"), emailRule()],
  });

  const fetchClients = () => {
    setLoading(true);
    clientsApi.getAll()
      .then(setClients)
      .catch(() => toast.error("Failed to load clients"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchClients(); }, []);

  const handleAddClient = async () => {
    if (!validateClient(newClient)) return;
    setIsSubmitting(true);
    try {
      await clientsApi.create(newClient);
      toast.success("Client added successfully!");
      setIsAddDialogOpen(false);
      setNewClient({ name: "", company: "", email: "", phone: "", address: "" });
      fetchClients();
    } catch {
      toast.error("Failed to add client.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = async () => {
    if (!clientToDelete) return;
    try {
      await clientsApi.delete(clientToDelete);
      toast.success("Client deleted successfully!");
      setClientToDelete(null);
      fetchClients();
    } catch {
      toast.error("Failed to delete client. Admin approval may be required.");
      setClientToDelete(null);
    }
  };

  const filteredClients = clients.filter((c) =>
    (c.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.email ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.company ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { page, setPage, pageSize, setPageSize, paginated: pagedClients, total: filteredTotal } =
    useTable(filteredClients, { pageSize: 12 });

  const stats = {
    total: clients.length,
    active: clients.length, // All fetched clients are considered active
    totalRevenue: 0, // Would need analytics endpoint per-client
    outstanding: 0,
  };

  if (loading) return <PageSkeleton cards={4} rows={8} cols={5} />;

  return (
    <div className="space-y-6">
      <PageBreadcrumb />
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Manage your client relationships and contacts</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add Client</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>Enter the client details to register them in the system.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Client Name *</Label>
                <Input id="name" placeholder="John Doe" value={newClient.name}
                  className={clientErrors.name ? "border-destructive" : ""}
                  onChange={(e) => { setNewClient({ ...newClient, name: e.target.value }); clearClientError("name"); }} />
                {clientErrors.name && <p className="text-xs text-destructive">{clientErrors.name}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" placeholder="Acme Corporation" value={newClient.company}
                  onChange={(e) => setNewClient({ ...newClient, company: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" placeholder="client@company.com" value={newClient.email}
                    className={clientErrors.email ? "border-destructive" : ""}
                    onChange={(e) => { setNewClient({ ...newClient, email: e.target.value }); clearClientError("email"); }} />
                  {clientErrors.email && <p className="text-xs text-destructive">{clientErrors.email}</p>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" placeholder="+1 (555) 123-4567" value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="123 Business Ave, City, State" value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddClient} disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Adding...</> : "Add Client"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}><CardHeader className="pb-2"><Skeleton className="h-4 w-24" /></CardHeader>
            <CardContent><Skeleton className="h-8 w-16" /></CardContent></Card>
        )) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Total Clients</CardDescription><Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Registered</CardDescription><TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold text-green-600">{stats.active}</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>With Invoices</CardDescription><FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">—</div></CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardDescription>Avg Risk Index</CardDescription><AlertTriangle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {clients.length > 0
                    ? (clients.reduce((a, c) => a + (c.riskIndex ?? 0), 0) / clients.length).toFixed(1)
                    : "—"}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search clients..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
      </div>

      {/* Client Grid */}
      {filteredTotal === 0 ? (
        <Empty className="py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon"><Users className="h-6 w-6" /></EmptyMedia>
            <EmptyTitle>{searchQuery ? "No matching clients" : "No clients yet"}</EmptyTitle>
            <EmptyDescription>
              {searchQuery ? "Try a different search term." : "Add your first client to get started."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pagedClients.map((client) => {
            const initials = (client.name ?? "??").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
            return (
              <Card key={client.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                        {initials}
                      </div>
                      <div>
                        <CardTitle className="text-base">{client.name}</CardTitle>
                        <CardDescription>{client.company ?? "Independent"}</CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setSelectedClient(client)}>
                          <Eye className="h-4 w-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/clients/${client.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive font-bold"
                          onClick={() => setClientToDelete(client.id)}>
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" /><span className="truncate">{client.email}</span>
                    </div>
                    {client.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" /><span>{client.phone}</span>
                      </div>
                    )}
                    {client.address && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4 flex-shrink-0" /><span className="truncate">{client.address}</span>
                      </div>
                    )}
                  </div>
                  {client.riskIndex !== undefined && (
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-sm text-muted-foreground">Risk Index</span>
                      <Badge variant="outline" className={cn(
                        client.riskIndex > 7 ? "text-red-600 border-red-200 bg-red-50" :
                        client.riskIndex > 4 ? "text-yellow-600 border-yellow-200 bg-yellow-50" :
                        "text-green-600 border-green-200 bg-green-50"
                      )}>
                        {client.riskIndex}/10
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        <DataTablePagination
          total={filteredTotal}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
        />
        </>
      )}

      {/* Detail Modal */}
      <Dialog open={!!selectedClient} onOpenChange={(open) => !open && setSelectedClient(null)}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden rounded-[2rem] border-none shadow-2xl">
          <DialogHeader className="bg-primary p-8 text-primary-foreground">
            <div className="flex items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-foreground text-primary text-3xl font-bold shadow-lg">
                {selectedClient?.name?.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div className="space-y-1 text-left">
                <DialogTitle className="text-2xl font-bold">{selectedClient?.name}</DialogTitle>
                <DialogDescription className="font-bold text-primary-foreground/80 flex items-center gap-2">
                  <Building className="h-4 w-4" />{selectedClient?.company ?? "Independent"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          {selectedClient && (
            <div className="p-8 space-y-6 font-geist max-h-[70vh] overflow-y-auto">
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground text-muted-foreground flex items-center gap-2">
                  <User className="h-3 w-3" /> Contact Details
                </p>
                <div className="grid gap-3">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-border/50">
                    <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center border shadow-sm text-muted-foreground">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Email</p>
                      <p className="font-bold text-sm">{selectedClient.email}</p>
                    </div>
                  </div>
                  {selectedClient.phone && (
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-border/50">
                      <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center border shadow-sm text-muted-foreground">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Phone</p>
                        <p className="font-bold text-sm">{selectedClient.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {selectedClient.address && (
                <div className="p-5 rounded-3xl bg-muted/10 border border-dashed border-border/60 text-sm text-muted-foreground flex gap-4">
                  <Globe className="h-5 w-5 text-primary shrink-0" />{selectedClient.address}
                </div>
              )}
              {selectedClient.riskIndex !== undefined && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border text-center">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Risk Index</p>
                    <p className="text-xl font-bold">{selectedClient.riskIndex}/10</p>
                  </div>
                  <div className="p-4 rounded-2xl border text-center">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold">Avg Delay</p>
                    <p className="text-xl font-bold">{selectedClient.averagePaymentDelayDays ?? 0} days</p>
                  </div>
                </div>
              )}
              <div className="flex gap-4 pt-2">
                <Button className="flex-1 font-bold h-12 rounded-2xl shadow-lg shadow-primary/20" asChild>
                  <Link href="/dashboard/invoices/new">
                    <CreditCard className="mr-2 h-4 w-4" /> Create Invoice
                  </Link>
                </Button>
                <Button variant="outline" className="flex-1 font-bold h-12 rounded-2xl" asChild>
                  <Link href={`/dashboard/clients/${selectedClient.id}/edit`}>Edit Profile</Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Notice */}
      <AlertDialog open={!!clientToDelete} onOpenChange={(open) => !open && setClientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client?</AlertDialogTitle>
            <AlertDialogDescription>
              Deleting <span className="font-bold">{clients.find(c => c.id === clientToDelete)?.name}</span> is a destructive action and requires admin approval.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClient} className="bg-destructive text-destructive-foreground">
              Request Deletion
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
