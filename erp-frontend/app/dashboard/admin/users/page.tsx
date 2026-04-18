"use client";

import { useState } from "react";
import { 
  Users, 
  UserPlus, 
  Shield, 
  Trash2, 
  Edit, 
  Search, 
  Filter,
  MoreVertical,
  Mail,
  Building,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  Loader2
} from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const INITIAL_USERS = [
  { id: 1, firstName: "Admin", lastName: "User", email: "admin@smartflow.com", role: "ADMIN", status: "active", company: "SmartFlow Corp" },
  { id: 2, firstName: "Alice", lastName: "Accountant", email: "alice@smartflow.com", role: "ACCOUNTANT", status: "active", company: "SmartFlow Corp" },
  { id: 3, firstName: "Bob", lastName: "Manager", email: "bob@smartflow.com", role: "MANAGER", status: "active", company: "SmartFlow Corp" },
  { id: 4, firstName: "Charlie", lastName: "Agent", email: "charlie@smartflow.com", role: "RECOVERY_AGENT", status: "active", company: "FastDebt Inc" },
  { id: 5, firstName: "David", lastName: "ClientHub", email: "david@client.com", role: "CLIENT", status: "inactive", company: "External Client" },
];

const roleConfig = {
  ADMIN: { label: "Administrator", icon: ShieldCheck, color: "bg-red-100 text-red-700 border-red-200" },
  MANAGER: { label: "Business Manager", icon: Shield, color: "bg-blue-100 text-blue-700 border-blue-200" },
  ACCOUNTANT: { label: "Sr. Accountant", icon: Building, color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  RECOVERY_AGENT: { label: "Recovery Agent", icon: ShieldAlert, color: "bg-orange-100 text-orange-700 border-orange-200" },
  CLIENT: { label: "External Client", icon: Users, color: "bg-slate-100 text-slate-700 border-slate-200" },
};

export default function UserManagementPage() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = async () => {
     setIsSubmitting(true);
     await new Promise(r => setTimeout(r, 1000));
     toast.success("Staff member invited successfully.");
     setIsSubmitting(false);
     setIsAddUserOpen(false);
  };

  const handleEditUser = async () => {
     setIsSubmitting(true);
     await new Promise(r => setTimeout(r, 1000));
     setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u));
     toast.success("User permissions updated.");
     setIsSubmitting(false);
     setIsEditUserOpen(false);
  };

  const handleDeleteUser = (id: number) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    toast.success("User account deactivated.");
  };

  const openEditModal = (user: any) => {
    setSelectedUser({ ...user });
    setIsEditUserOpen(true);
  };

  return (
    <div className="space-y-8 pb-12 font-geist">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter">Staff Management</h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Global access control and workspace permissions
          </p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 font-black h-12 px-8 rounded-2xl shadow-xl shadow-primary/20 transform transition-all hover:scale-105 active:scale-95">
                <UserPlus className="h-4 w-4" />
                Invite Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
              <div className="bg-primary p-8 text-primary-foreground">
                <DialogTitle className="text-2xl font-black tracking-tight">Expand the Team</DialogTitle>
                <DialogDescription className="text-primary-foreground/80 font-medium">
                  Invite a new expert to your SmartFlow workspace.
                </DialogDescription>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap- Borser">
                   <div className="space-y-1.5">
                      <Label htmlFor="fname" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">First Name</Label>
                      <Input id="fname" placeholder="Jane" className="h-11 rounded-xl bg-muted/20 border-border/50" />
                   </div>
                   <div className="space-y-1.5">
                      <Label htmlFor="lname" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Last Name</Label>
                      <Input id="lname" placeholder="Doe" className="h-11 rounded-xl bg-muted/20 border-border/50" />
                   </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
                  <Input id="email" type="email" placeholder="jane.doe@smartflow.com" className="h-11 rounded-xl bg-muted/20 border-border/50" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="role" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Enterprise Role</Label>
                  <Select>
                    <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/50">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Administrator</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                      <SelectItem value="ACCOUNTANT">Sr. Accountant</SelectItem>
                      <SelectItem value="RECOVERY_AGENT">Recovery Agent</SelectItem>
                      <SelectItem value="CLIENT">External Client</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold border-border bg-background" onClick={() => setIsAddUserOpen(false)}>Discard</Button>
                  <Button className="flex-1 h-12 rounded-xl font-bold gap-2" onClick={handleAddUser} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                    Send Invite
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
         <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
            <div className="bg-primary/5 p-8 border-b">
               <DialogTitle className="text-2xl font-black tracking-tight">Edit Permissions</DialogTitle>
               <DialogDescription className="font-medium">
                  Modifying access for <span className="text-foreground font-black">{selectedUser?.firstName} {selectedUser?.lastName}</span>
               </DialogDescription>
            </div>
            {selectedUser && (
               <div className="p-8 space-y-6">
                  <div className="space-y-1.5">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Access Status</Label>
                     <Select value={selectedUser.status} onValueChange={(v) => setSelectedUser({...selectedUser, status: v})}>
                        <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/50">
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="active">Active Access</SelectItem>
                           <SelectItem value="inactive">Suspended</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
                  <div className="space-y-1.5">
                     <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Enterprise Role</Label>
                     <Select value={selectedUser.role} onValueChange={(v) => setSelectedUser({...selectedUser, role: v})}>
                        <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/50">
                           <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="ADMIN">Administrator</SelectItem>
                           <SelectItem value="MANAGER">Manager</SelectItem>
                           <SelectItem value="ACCOUNTANT">Sr. Accountant</SelectItem>
                           <SelectItem value="RECOVERY_AGENT">Recovery Agent</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold border-border bg-background" onClick={() => setIsEditUserOpen(false)}>Cancel</Button>
                    <Button className="flex-1 h-12 rounded-xl font-bold gap-2" onClick={handleEditUser} disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                      Save Updates
                    </Button>
                  </div>
               </div>
            )}
         </DialogContent>
      </Dialog>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: "Total Seats", value: users.length, color: "bg-primary/5 border-primary/20", text: "text-primary" },
          { label: "Active Now", value: users.filter(u => u.status === 'active').length, color: "bg-emerald-50/50 border-emerald-100", text: "text-emerald-700" },
          { label: "Admin Core", value: users.filter(u => u.role === 'ADMIN').length, color: "bg-red-50/50 border-red-100", text: "text-red-700" },
          { label: "Invitations", value: 2, color: "bg-muted/30 border-border/50", text: "text-foreground" },
        ].map((stat, i) => (
          <Card key={i} className={cn("rounded-3xl border shadow-none", stat.color)}>
            <CardHeader className="pb-2">
              <CardDescription className={cn("font-black uppercase text-[10px] tracking-widest", stat.text)}>{stat.label}</CardDescription>
              <CardTitle className="text-4xl font-black tracking-tight">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Table Section */}
      <Card className="rounded-[2.5rem] overflow-hidden border-border/50 shadow-none">
        <CardHeader className="p-8 border-b">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-sm">
               <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
               <Input 
                placeholder="Search by name or email..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 rounded-2xl bg-muted/20 border-border/50 font-medium"
               />
            </div>
            <div className="flex gap-3">
               <Select value={roleFilter} onValueChange={setRoleFilter}>
                   <SelectTrigger className="w-[180px] h-12 rounded-2xl border-border/50 bg-background font-bold">
                     <Filter className="h-4 w-4 mr-2" />
                     <SelectValue placeholder="All Roles" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="all">All Roles</SelectItem>
                     <SelectItem value="ADMIN">Admins</SelectItem>
                     <SelectItem value="ACCOUNTANT">Accountants</SelectItem>
                     <SelectItem value="MANAGER">Managers</SelectItem>
                     <SelectItem value="RECOVERY_AGENT">Agents</SelectItem>
                   </SelectContent>
               </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="pl-10 py-5 font-black uppercase text-[10px] tracking-widest">Workspace Member</TableHead>
                <TableHead className="py-5 font-black uppercase text-[10px] tracking-widest">Enterprise Role</TableHead>
                <TableHead className="py-5 font-black uppercase text-[10px] tracking-widest">Organization</TableHead>
                <TableHead className="py-5 font-black uppercase text-[10px] tracking-widest">Access Status</TableHead>
                <TableHead className="text-right pr-10 py-5 font-black uppercase text-[10px] tracking-widest">Management</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => {
                const config = roleConfig[u.role as keyof typeof roleConfig] || roleConfig.CLIENT;
                const RoleIcon = config.icon;
                return (
                  <TableRow key={u.id} className="group hover:bg-muted/20 transition-all border-none">
                    <TableCell className="pl-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center font-black text-primary text-xs border border-primary/20 shadow-sm transition-transform group-hover:scale-110">
                          {u.firstName[0]}{u.lastName[0]}
                        </div>
                        <div className="flex flex-col">
                           <span className="font-black text-sm tracking-tight">{u.firstName} {u.lastName}</span>
                           <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {u.email}
                           </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("gap-1.5 py-1 px-4 rounded-xl font-black uppercase text-[10px] tracking-tighter border-2 shadow-sm", config.color)}>
                        <RoleIcon className="h-3.5 w-3.5" />
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground tracking-tight">
                          <Building className="h-3 w-3" />
                          {u.company}
                       </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className={cn("h-2.5 w-2.5 rounded-full border-2 border-white shadow-sm ring-1 ring-border", u.status === 'active' ? "bg-emerald-500" : "bg-slate-300")} />
                        <span className="text-[10px] font-black uppercase tracking-widest truncate">{u.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-background shadow-none border border-transparent hover:border-border">
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-border/50">
                          <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Console</DropdownMenuLabel>
                          <DropdownMenuSeparator className="my-1 opacity-50" />
                          <DropdownMenuItem className="gap-3 py-2.5 px-3 rounded-xl cursor-not-allowed opacity-50">
                             <TrendingUp className="h-4 w-4" /> Performance Audit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-3 py-2.5 px-3 rounded-xl focus:bg-primary/10 focus:text-primary transition-colors" onClick={() => openEditModal(u)}>
                            <Shield className="h-4 w-4" /> Adjust Permissions
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1 opacity-50" />
                          <DropdownMenuItem 
                            className="gap-3 py-2.5 px-3 rounded-xl text-destructive font-black focus:bg-destructive/10 focus:text-destructive transition-colors" 
                            onClick={() => handleDeleteUser(u.id)}
                          >
                            <Trash2 className="h-4 w-4" /> Deactivate Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center border p-8 rounded-[2rem] border-dashed border-border/50 text-muted-foreground gap-4 bg-muted/5">
         <ShieldAlert className="h-6 w-6 text-primary" />
         <div className="flex-1">
            <p className="text-sm font-black text-foreground">Workspace Integrity Policy</p>
            <p className="text-xs font-medium leading-relaxed">Changes to staff permissions are logged and visible to all Administrators. Suspended accounts lose access immediately but retain historical audit data.</p>
         </div>
      </div>
    </div>
  );
}
