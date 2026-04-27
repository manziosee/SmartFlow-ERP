"use client";

import { useState, useEffect } from "react";
import { RoleGate } from "@/components/auth/role-gate";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  RefreshCw,
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  FileText,
  AlertTriangle,
  Clock,
  DollarSign,
  TrendingUp,
  Send,
  Calendar,
  CheckCircle2,
  XCircle,
  Brain,
  Zap,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface RecoveryCase {
  id: string;
  invoiceNumber: string;
  client: string;
  clientEmail: string;
  amount: number;
  currency: string;
  dueDate: string;
  daysOverdue: number;
  remindersCount: number;
  lastReminder: string;
  riskScore: number;
  assignedAgent: string;
  status: "pending" | "contacted" | "promised" | "failed" | "resolved";
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-slate-100 text-slate-700 border-slate-200" },
  contacted: { label: "Contacted", color: "bg-blue-100 text-blue-700 border-blue-200" },
  promised: { label: "Promised Payment", color: "bg-amber-100 text-amber-700 border-amber-200" },
  failed: { label: "Failed Recovery", color: "bg-red-100 text-red-700 border-red-200" },
  resolved: { label: "Resolved", color: "bg-green-100 text-green-700 border-green-200" },
};

export default function RecoveryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [recoveryCases, setRecoveryCases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBulkSending, setIsBulkSending] = useState(false);
  const [showAiDialog, setShowAiDialog] = useState(false);
  const [aiInsights, setAiInsights] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const { recoveryApi } = await import("@/lib/api");
        const data = await recoveryApi.getAll();
        setRecoveryCases(data);
      } catch (err) {
        console.error("Recovery Load Error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const totalOverdue = recoveryCases.reduce((acc, c) => acc + (c.invoice?.amount || 0), 0);
  const highRiskCount = recoveryCases.filter((c) => (c.invoice?.client?.riskIndex || 0) >= 60).length;
  
  const avgDaysOverdue = recoveryCases.length > 0 
    ? Math.round(
        recoveryCases.reduce((acc, c) => {
          if (!c.invoice?.dueDate) return acc;
          const diffTime = Math.abs(new Date().getTime() - new Date(c.invoice.dueDate).getTime());
          return acc + Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }, 0) / recoveryCases.length
      )
    : 0;

  const filteredCases = recoveryCases.filter((c) => {
    const matchesSearch =
      (c.invoice?.invoiceNumber || c.invoice?.id?.toString() || "").includes(searchQuery) ||
      (c.invoice?.client?.name || "").toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    return matchesSearch && c.status.toLowerCase() === activeTab;
  });

  const handleBulkReminders = async () => {
    setIsBulkSending(true);
    try {
      const { invoicesApi } = await import("@/lib/api");
      const pending = recoveryCases.filter(c => c.status === "pending" || c.status === "PENDING");
      if (pending.length === 0) {
        toast.info("No pending cases to remind.");
        return;
      }
      await Promise.all(pending.map(c => invoicesApi.sendReminder(c.invoice.id)));
      toast.success(`Successfully sent ${pending.length} smart reminders`);
    } catch {
      toast.error("Failed to execute bulk reminder sequence");
    } finally {
      setIsBulkSending(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return "text-red-600 bg-red-100 dark:bg-red-900/20";
    if (score >= 40) return "text-amber-600 bg-amber-100 dark:bg-amber-900/20";
    return "text-green-600 bg-green-100 dark:bg-green-900/20";
  };

  return (
    <RoleGate allowedRoles={["ADMIN", "MANAGER", "RECOVERY_AGENT"]}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Recovery Intelligence</h1>
            <p className="text-sm text-muted-foreground">Predictive delinquency management and automated debt collection</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="gap-2 font-medium"
              onClick={async () => {
                setShowAiDialog(true);
                const { aiApi } = await import("@/lib/api");
                aiApi.getInsights("RECOVERY_AGENT").then(setAiInsights).catch(console.error);
              }}
            >
              <Brain className="h-4 w-4" />
              AI Strategy
            </Button>
            <Button 
              className="gap-2 font-medium"
              onClick={handleBulkReminders}
              disabled={isBulkSending}
            >
              {isBulkSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send Bulk Reminders
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>Total Overdue</CardDescription>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rwf {totalOverdue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">{recoveryCases.length} active cases</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>High Risk</CardDescription>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{highRiskCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Risk score &gt; 60%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>Avg Days Overdue</CardDescription>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgDaysOverdue} <span className="text-sm font-normal">days</span></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription>Recovery Rate</CardDescription>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">72%</div>
              <p className="text-xs text-muted-foreground mt-1">+8% this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Overdue Invoices Table */}
        <Card className="border border-border/50 shadow-sm rounded-2xl overflow-hidden">
          <CardHeader className="border-b">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Recovery Ledger</CardTitle>
                <CardDescription>Prioritized debt collection pipeline</CardDescription>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search case, client or invoice..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 rounded-2xl bg-muted/40 border-none font-bold"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-8 pt-4 bg-muted/5 border-b pb-0">
                <TabsList className="bg-transparent border-b-0 gap-8 h-12 p-0">
                  {["all", "pending", "contacted", "promised", "failed"].map((tab) => (
                    <TabsTrigger 
                      key={tab} 
                      value={tab} 
                      className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-0 pb-3 font-bold uppercase text-[10px] tracking-widest"
                    >
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="mt-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/10">
                      <TableRow className="hover:bg-transparent border-none">
                        <TableHead className="pl-8 py-5 font-bold uppercase text-[10px] tracking-widest">Case ID</TableHead>
                        <TableHead className="py-5 font-bold uppercase text-[10px] tracking-widest">Client Entity</TableHead>
                        <TableHead className="py-5 font-bold uppercase text-[10px] tracking-widest text-right">Liability</TableHead>
                        <TableHead className="py-5 font-bold uppercase text-[10px] tracking-widest">Overdue</TableHead>
                        <TableHead className="py-5 font-bold uppercase text-[10px] tracking-widest text-center">Risk Index</TableHead>
                        <TableHead className="py-5 font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
                        <TableHead className="pr-8 py-5 font-bold uppercase text-[10px] tracking-widest text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow><TableCell colSpan={7} className="h-64 text-center font-bold animate-pulse text-muted-foreground">Syncing Recovery Intelligence...</TableCell></TableRow>
                      ) : filteredCases.length === 0 ? (
                        <TableRow><TableCell colSpan={7} className="h-64 text-center text-muted-foreground italic font-medium">No active cases match your filters.</TableCell></TableRow>
                      ) : filteredCases.map((c) => {
                        const daysOverdue = c.invoice?.dueDate 
                          ? Math.ceil((new Date().getTime() - new Date(c.invoice.dueDate).getTime()) / (1000 * 3600 * 24))
                          : 0;
                        const riskScore = c.invoice?.client?.riskIndex || 0;
                        const agent = c.assignedAgent || "System Intelligence";

                        return (
                        <TableRow key={c.id} className="group border-border/30 hover:bg-muted/30 transition-all">
                          <TableCell className="pl-8 py-6 font-mono font-bold text-xs text-muted-foreground">
                            {c.invoice?.invoiceNumber || `INV-${String(c.invoice?.id).padStart(3, '0')}`}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center font-bold text-[10px] text-primary">
                                {(c.invoice?.client?.name || 'U').charAt(0)}
                              </div>
                              <div className="min-w-0 max-w-[200px]">
                                <p className="font-bold truncate">{c.invoice?.client?.name || 'Unknown Entity'}</p>
                                <p className="text-[10px] font-bold uppercase text-muted-foreground truncate">
                                  {c.invoice?.client?.email || 'OFFLINE'}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span className="font-bold tabular-nums">Rwf {(c.invoice?.amount || 0).toLocaleString()}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-rose-600 font-bold text-xs uppercase tracking-tight flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {daysOverdue} days
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <div
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-[10px] font-bold",
                                getRiskColor(riskScore)
                              )}
                            >
                              {riskScore}%
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                "font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-lg border-2 shadow-sm",
                                statusConfig[c.status.toLowerCase()]?.color || statusConfig['pending'].color
                              )}
                            >
                              {statusConfig[c.status.toLowerCase()]?.label || c.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-8">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-muted transition-colors">
                                  <MoreHorizontal className="h-5 w-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[180px] shadow-2xl border-border/50">
                                <DropdownMenuLabel className="text-sm font-medium text-muted-foreground text-muted-foreground px-3 py-2">Ops Command</DropdownMenuLabel>
                                <DropdownMenuSeparator className="bg-muted" />
                                <DropdownMenuItem className="rounded-xl px-3 py-2 font-bold focus:bg-primary/5 focus:text-primary cursor-pointer gap-3" onClick={() => toast.success("Manual reminder dispatched")}>
                                  <Mail className="h-4 w-4" />
                                  Send Reminder
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-xl px-3 py-2 font-bold focus:bg-primary/5 focus:text-primary cursor-pointer gap-3">
                                  <Phone className="h-4 w-4" />
                                  Log Call
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-xl px-3 py-2 font-bold focus:bg-primary/5 focus:text-primary cursor-pointer gap-3">
                                  <Clock className="h-4 w-4" />
                                  Update Status
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-muted" />
                                <DropdownMenuItem className="rounded-xl px-3 py-2 font-bold focus:bg-destructive/10 focus:text-destructive text-destructive cursor-pointer gap-3">
                                  <AlertTriangle className="h-4 w-4" />
                                  Escalate Case
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )})}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* AI Strategy Dialog */}
      <Dialog open={showAiDialog} onOpenChange={setShowAiDialog}>
        <DialogContent className="sm:max-w-[650px] rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-foreground text-background p-10">
            <DialogHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-6 shadow-xl shadow-primary/40">
                <Brain className="h-6 w-6" />
              </div>
              <DialogTitle className="text-2xl font-semibold tracking-tight">Recovery Intelligence</DialogTitle>
              <DialogDescription className="text-white/60 font-medium text-base">
                Machine learning analysis of payment patterns and behavioral risk factors.
              </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-10 space-y-6 max-h-[60vh] overflow-y-auto">
            {aiInsights.length > 0 ? (
              <div className="grid gap-6">
                {aiInsights.map((insight, idx) => (
                  <div key={idx} className="group p-6 rounded-[2rem] border-2 border-muted hover:border-primary/20 bg-muted/20 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Zap className="h-4 w-4 text-primary" />
                        </div>
                        <h4 className="font-bold text-primary uppercase text-[10px] tracking-widest">{insight.type || "Strategy"}</h4>
                      </div>
                      <Badge variant="outline" className={cn(
                        "text-[9px] font-bold rounded-lg border-2",
                        insight.priority === "HIGH" ? "border-rose-100 bg-rose-50 text-rose-600" : "border-amber-100 bg-amber-50 text-amber-600"
                      )}>{insight.priority}</Badge>
                    </div>
                    <h5 className="text-xl font-bold mb-2 tracking-tight">{insight.title}</h5>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-6">{insight.description}</p>
                    <Button 
                      className="w-full rounded-2xl h-12 font-bold gap-2 transition-all active:scale-95"
                      onClick={() => {
                        // Mock implementation: Update status of the first matching case for this client
                        const caseId = recoveryCases.find(c => c.invoice?.client?.name === insight.title.split(":")[0])?.id;
                        if (caseId) {
                          setRecoveryCases(prev => prev.map(c => c.id === caseId ? { ...c, status: 'contacted' } : c));
                        }
                        toast.success(`Strategy Implemented: ${insight.title}`);
                        setShowAiDialog(false);
                      }}
                    >
                      Implement Recommendation
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center gap-6 text-center">
                <Loader2 className="h-16 w-16 animate-spin text-primary opacity-20" />
                <div>
                  <p className="font-bold text-xl mb-1">Synthesizing Accounts...</p>
                  <p className="text-muted-foreground font-medium">Crunching historical settlement data</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </RoleGate>
  );
}
