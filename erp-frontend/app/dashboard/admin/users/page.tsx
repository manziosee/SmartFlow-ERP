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

import { usersApi } from "@/lib/api";
import { useEffect } from "react";

const roleConfig = {
  ADMIN: { label: "Administrator", icon: ShieldCheck, color: "bg-red-100 text-red-700 border-red-200" },
  MANAGER: { label: "Business Manager", icon: Shield, color: "bg-blue-100 text-blue-700 border-blue-200" },
  ACCOUNTANT: { label: "Sr. Accountant", icon: Building, color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  RECOVERY_AGENT: { label: "Recovery Agent", icon: ShieldAlert, color: "bg-orange-100 text-orange-700 border-orange-200" },
  CLIENT: { label: "External Client", icon: Users, color: "bg-slate-100 text-slate-700 border-slate-200" },
};

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  
  // Form states for new user
  const [newUser, setNewUser] = useState({
    firstName: "", lastName: "", email: "", role: "MANAGER", password: ""
  });

  const filteredUsers = users.filter((u) => {
    const matchesSearch = 
      `${u.name || (u.firstName + ' ' + u.lastName) || ''}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = async () => {
     setIsSubmitting(true);
     try {
       await usersApi.create({
         firstName: newUser.firstName,
         lastName: newUser.lastName,
         email: newUser.email,
         role: newUser.role,
         password: newUser.password
       });
       toast.success("Team member created successfully.");
       setIsAddUserOpen(false);
       setNewUser({ firstName: "", lastName: "", email: "", role: "MANAGER", password: "" });
       loadUsers();
     } catch (err) {
       toast.error("Failed to add user");
     } finally {
       setIsSubmitting(false);
     }
  };

  const handleEditUser = async () => {
     setIsSubmitting(true);
     try {
       await usersApi.update(selectedUser.id, { role: selectedUser.role });
       toast.success("User permissions updated.");
       setIsEditUserOpen(false);
       loadUsers();
     } catch (err) {
       toast.error("Failed to update user");
     } finally {
       setIsSubmitting(false);
     }
  };

  const handleResetPassword = async () => {
    if (!newPassword) return toast.error("Please enter a new password");
    setIsSubmitting(true);
    try {
      await usersApi.resetPassword(selectedUser.id, newPassword);
      toast.success("Password reset successfully.");
      setIsResetPasswordOpen(false);
      setNewPassword("");
    } catch (err) {
      toast.error("Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await usersApi.delete(id);
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success("User account deactivated.");
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const openEditModal = (user: any) => {
    setSelectedUser({ ...user });
    setIsEditUserOpen(true);
  };

  const openResetPasswordModal = (user: any) => {
    setSelectedUser({ ...user });
    setNewPassword("");
    setIsResetPasswordOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 pb-2 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-6">
           <div>
              <h1 className="text-2xl font-semibold tracking-tight">Staff Control</h1>
              <p className="text-muted-foreground font-medium text-lg flex items-center gap-2">
                Enterprise access control and workspace permissions
              </p>
           </div>
        </div>
        <div className="flex gap-3">
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 font-bold h-12 px-8 rounded-2xl shadow-xl shadow-primary/20 transform transition-all hover:scale-105 active:scale-95">
                <UserPlus className="h-4 w-4" />
                Create Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
              <div className="bg-primary p-8 text-primary-foreground">
                <DialogTitle className="text-2xl font-bold">Expand the Team</DialogTitle>
                <DialogDescription className="text-primary-foreground/80 font-medium">
                  Invite a new expert to your SmartFlow workspace.
                </DialogDescription>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                      <Label htmlFor="fname" className="text-sm font-medium text-muted-foreground text-muted-foreground ml-1">First Name</Label>
                      <Input id="fname" value={newUser.firstName} onChange={(e) => setNewUser({...newUser, firstName: e.target.value})} placeholder="Jane" className="h-11 rounded-xl bg-muted/20 border-border/50" />
                   </div>
                   <div className="space-y-1.5">
                      <Label htmlFor="lname" className="text-sm font-medium text-muted-foreground text-muted-foreground ml-1">Last Name</Label>
                      <Input id="lname" value={newUser.lastName} onChange={(e) => setNewUser({...newUser, lastName: e.target.value})} placeholder="Doe" className="h-11 rounded-xl bg-muted/20 border-border/50" />
                   </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium text-muted-foreground text-muted-foreground ml-1">Email Address</Label>
                  <Input id="email" type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} placeholder="jane.doe@smartflow.com" className="h-11 rounded-xl bg-muted/20 border-border/50" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pass" className="text-sm font-medium text-muted-foreground text-muted-foreground ml-1">Access Password</Label>
                  <Input id="pass" type="password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} placeholder="••••••••" className="h-11 rounded-xl bg-muted/20 border-border/50" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="role" className="text-sm font-medium text-muted-foreground text-muted-foreground ml-1">Enterprise Role</Label>
                  <Select value={newUser.role} onValueChange={(v) => setNewUser({...newUser, role: v})}>
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
                    Create User
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
               <DialogTitle className="text-2xl font-bold">Edit Permissions</DialogTitle>
               <DialogDescription className="font-medium">
                  Modifying access for <span className="text-foreground font-bold">{selectedUser?.firstName} {selectedUser?.lastName}</span>
               </DialogDescription>
            </div>
            {selectedUser && (
               <div className="p-8 space-y-6">
                  <div className="space-y-1.5">
                     <Label className="text-sm font-medium text-muted-foreground text-muted-foreground ml-1">Enterprise Role</Label>
                     <Select value={selectedUser.role} onValueChange={(v) => setSelectedUser({...selectedUser, role: v})}>
                        <SelectTrigger className="h-11 rounded-xl bg-muted/20 border-border/50">
                           <SelectValue />
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

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
         <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
            <div className="bg-primary/5 p-8 border-b">
               <DialogTitle className="text-2xl font-bold">Reset Password</DialogTitle>
               <DialogDescription className="font-medium">
                  Set a new password for <span className="text-foreground font-bold">{selectedUser?.firstName} {selectedUser?.lastName}</span>
               </DialogDescription>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-1.5">
                 <Label className="text-sm font-medium text-muted-foreground text-muted-foreground ml-1">New Password</Label>
                 <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="h-11 rounded-xl bg-muted/20 border-border/50" />
              </div>
              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1 h-12 rounded-xl font-bold border-border bg-background" onClick={() => setIsResetPasswordOpen(false)}>Cancel</Button>
                <Button className="flex-1 h-12 rounded-xl font-bold gap-2" onClick={handleResetPassword} disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  Reset Password
                </Button>
              </div>
            </div>
         </DialogContent>
      </Dialog>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: "Total Seats", value: users.length, color: "bg-primary/5 border-primary/20", text: "text-primary" },
          { label: "Active Now", value: users.filter(u => u.status === 'active').length, color: "bg-emerald-50/50 border-emerald-100", text: "text-emerald-700" },
          { label: "Admin Core", value: users.filter(u => u.role === 'ADMIN').length, color: "bg-red-50/50 border-red-100", text: "text-red-700" },
          { label: "Invitations", value: 2, color: "bg-indigo-50/50 border-indigo-100", text: "text-indigo-700" },
        ].map((stat, i) => (
          <Card key={i} className={cn("rounded-[2rem] border shadow-none", stat.color)}>
            <CardHeader className="pb-2 px-6 pt-6">
              <CardDescription className={cn("font-bold uppercase text-[10px] tracking-widest mb-1", stat.text)}>{stat.label}</CardDescription>
              <CardTitle className="text-2xl font-semibold tracking-tight">{stat.value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Table Section */}
      <Card className="rounded-2xl overflow-hidden border-border/50 shadow-none">
        <CardHeader className="p-8 border-b">
          <div className="flex flex-col gap-1 pb-2 md:flex-row md:items-center md:justify-between">
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
                <TableHead className="pl-10 py-5 font-bold uppercase text-[10px] tracking-widest">Workspace Member</TableHead>
                <TableHead className="py-5 font-bold uppercase text-[10px] tracking-widest">Enterprise Role</TableHead>
                <TableHead className="py-5 font-bold uppercase text-[10px] tracking-widest">Organization</TableHead>
                <TableHead className="py-5 font-bold uppercase text-[10px] tracking-widest">Access Status</TableHead>
                <TableHead className="text-right pr-10 py-5 font-bold uppercase text-[10px] tracking-widest">Management</TableHead>
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
                        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center font-bold text-primary text-xs border border-primary/20 shadow-sm transition-transform group-hover:scale-110">
                          {u.name ? u.name[0] : (u.firstName?.[0] || 'U')}{u.name ? u.name[1] || '' : (u.lastName?.[0] || '')}
                        </div>
                        <div className="flex flex-col">
                           <span className="font-bold text-sm tracking-tight">{u.name || `${u.firstName || ''} ${u.lastName || ''}`}</span>
                           <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {u.email}
                           </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("gap-1.5 py-1 px-4 rounded-xl font-bold uppercase text-[10px] tracking-tight border-2 shadow-sm", config.color)}>
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
                        <span className="text-sm font-medium text-muted-foreground truncate">{u.status}</span>
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
                          <DropdownMenuLabel className="px-3 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Console</DropdownMenuLabel>
                          <DropdownMenuSeparator className="my-1 opacity-50" />
                          <DropdownMenuItem className="gap-3 py-2.5 px-3 rounded-xl cursor-not-allowed opacity-50">
                             <TrendingUp className="h-4 w-4" /> Performance Audit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-3 py-2.5 px-3 rounded-xl focus:bg-primary/10 focus:text-primary transition-colors" onClick={() => openEditModal(u)}>
                            <Shield className="h-4 w-4" /> Adjust Permissions
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-3 py-2.5 px-3 rounded-xl focus:bg-primary/10 focus:text-primary transition-colors" onClick={() => openResetPasswordModal(u)}>
                            <ShieldAlert className="h-4 w-4" /> Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="my-1 opacity-50" />
                          <DropdownMenuItem 
                            className="gap-3 py-2.5 px-3 rounded-xl text-destructive font-bold focus:bg-destructive/10 focus:text-destructive transition-colors" 
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
            <p className="text-sm font-bold text-foreground">Workspace Integrity Policy</p>
            <p className="text-xs font-medium leading-relaxed">Changes to staff permissions are logged and visible to all Administrators. Suspended accounts lose access immediately but retain historical audit data.</p>
         </div>
      </div>
    </div>
  );
}
