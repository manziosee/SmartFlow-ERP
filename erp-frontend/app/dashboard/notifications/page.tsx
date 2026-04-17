"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  Users,
  AlertTriangle,
  CreditCard,
  Brain,
  Mail,
  Trash2,
  Check,
  Archive,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Notification {
  id: number;
  type: "payment" | "invoice" | "client" | "alert" | "system" | "ai";
  title: string;
  description: string;
  time: string;
  unread: boolean;
  archived: boolean;
  link?: string;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    type: "payment",
    title: "Invoice #INV-001 paid",
    description: "Payment of $5,400 received from Acme Corporation",
    time: "2 minutes ago",
    unread: true,
    archived: false,
  },
  {
    id: 2,
    type: "client",
    title: "New client registered",
    description: "Tech Solutions Inc. joined your client list",
    time: "1 hour ago",
    unread: true,
    archived: false,
  },
  {
    id: 3,
    type: "alert",
    title: "Payment overdue",
    description: "Invoice #INV-089 from Global Dynamics is 7 days overdue ($3,200)",
    time: "3 hours ago",
    unread: true,
    archived: false,
  },
  {
    id: 4,
    type: "ai",
    title: "AI Insight: Cash flow alert",
    description: "Predicted cash flow shortage in 14 days. Review recommended actions.",
    time: "5 hours ago",
    unread: true,
    archived: false,
  },
  {
    id: 5,
    type: "invoice",
    title: "Invoice sent successfully",
    description: "Invoice #INV-102 sent to StartUp Labs for $2,850",
    time: "Yesterday",
    unread: false,
    archived: false,
  },
  {
    id: 6,
    type: "payment",
    title: "Partial payment received",
    description: "Digital Ventures paid $1,500 on Invoice #INV-078",
    time: "Yesterday",
    unread: false,
    archived: false,
  },
  {
    id: 7,
    type: "system",
    title: "Report generated",
    description: "Monthly revenue report for January is ready to download",
    time: "2 days ago",
    unread: false,
    archived: false,
  },
  {
    id: 8,
    type: "client",
    title: "Client updated billing info",
    description: "Acme Corporation updated their payment method",
    time: "3 days ago",
    unread: false,
    archived: false,
  },
  {
    id: 9,
    type: "alert",
    title: "Recovery reminder sent",
    description: "Automatic reminder sent to Global Dynamics for overdue payment",
    time: "4 days ago",
    unread: false,
    archived: false,
  },
  {
    id: 10,
    type: "ai",
    title: "AI Recommendation",
    description: "Consider offering early payment discount to improve cash flow",
    time: "5 days ago",
    unread: false,
    archived: true,
  },
];

const typeConfig = {
  payment: {
    icon: DollarSign,
    bgColor: "bg-emerald-500",
    lightBg: "bg-emerald-50",
  },
  invoice: {
    icon: FileText,
    bgColor: "bg-blue-500",
    lightBg: "bg-blue-50",
  },
  client: {
    icon: Users,
    bgColor: "bg-purple-500",
    lightBg: "bg-purple-50",
  },
  alert: {
    icon: AlertTriangle,
    bgColor: "bg-red-500",
    lightBg: "bg-red-50",
  },
  system: {
    icon: Bell,
    bgColor: "bg-slate-500",
    lightBg: "bg-slate-50",
  },
  ai: {
    icon: Brain,
    bgColor: "bg-amber-500",
    lightBg: "bg-amber-50",
  },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [activeTab, setActiveTab] = useState("all");

  const unreadCount = notifications.filter((n) => n.unread && !n.archived).length;

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return !notification.archived;
    if (activeTab === "unread") return notification.unread && !notification.archived;
    if (activeTab === "archived") return notification.archived;
    return notification.type === activeTab && !notification.archived;
  });

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const archiveNotification = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, archived: true } : n))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-foreground to-foreground/80 shadow-lg">
            <Bell className="h-7 w-7 text-background" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground">
              Stay updated with your business activities
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead} className="gap-2">
            <Check className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payments</p>
                <p className="text-2xl font-bold">
                  {notifications.filter((n) => n.type === "payment" && !n.archived).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Alerts</p>
                <p className="text-2xl font-bold">
                  {notifications.filter((n) => n.type === "alert" && !n.archived).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clients</p>
                <p className="text-2xl font-bold">
                  {notifications.filter((n) => n.type === "client" && !n.archived).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <Brain className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">AI Insights</p>
                <p className="text-2xl font-bold">
                  {notifications.filter((n) => n.type === "ai" && !n.archived).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>
            View and manage all your notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">
                All
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                  {notifications.filter((n) => !n.archived).length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                {unreadCount > 0 && (
                  <Badge className="ml-2 h-5 px-1.5 text-xs bg-red-500 text-white">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="payment">Payments</TabsTrigger>
              <TabsTrigger value="alert">Alerts</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-2">
              {filteredNotifications.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications in this category</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => {
                  const config = typeConfig[notification.type];
                  const Icon = config.icon;

                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        "flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50",
                        notification.unread && "bg-muted/30 border-l-4 border-l-primary"
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0",
                          config.bgColor
                        )}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className={cn("font-medium", notification.unread && "font-semibold")}>
                                {notification.title}
                              </h4>
                              {notification.unread && (
                                <span className="h-2 w-2 rounded-full bg-primary" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {notification.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{notification.time}</span>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {notification.unread && (
                                <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  Mark as read
                                </DropdownMenuItem>
                              )}
                              {!notification.archived && (
                                <DropdownMenuItem onClick={() => archiveNotification(notification.id)}>
                                  <Archive className="h-4 w-4 mr-2" />
                                  Archive
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => deleteNotification(notification.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
