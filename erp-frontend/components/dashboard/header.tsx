"use client";

import Link from "next/link";
import { Bell, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface HeaderProps {
  sidebarCollapsed: boolean;
}

const notifications = [
  {
    id: 1,
    title: "Invoice #INV-001 paid",
    description: "Payment of $5,400 received from Acme Corp",
    time: "2 minutes ago",
    unread: true,
    type: "payment",
  },
  {
    id: 2,
    title: "New client registered",
    description: "Tech Solutions Inc. joined your client list",
    time: "1 hour ago",
    unread: true,
    type: "client",
  },
  {
    id: 3,
    title: "Payment overdue",
    description: "Invoice #INV-089 is 7 days overdue ($3,200)",
    time: "3 hours ago",
    unread: false,
    type: "alert",
  },
  {
    id: 4,
    title: "AI Insight: Cash flow alert",
    description: "Predicted cash flow shortage in 14 days",
    time: "5 hours ago",
    unread: true,
    type: "ai",
  },
];

const typeColors = {
  payment: "bg-emerald-500",
  client: "bg-purple-500",
  alert: "bg-red-500",
  ai: "bg-amber-500",
};

export function DashboardHeader({ sidebarCollapsed }: HeaderProps) {
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <TooltipProvider>
      <header
        className={cn(
          "fixed top-0 right-0 z-30 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
          sidebarCollapsed ? "left-[68px]" : "left-64"
        )}
      >
        <div className="flex h-full items-center justify-between px-6">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search invoices, clients, payments..."
                className="pl-9 bg-muted/50 border-0 focus-visible:ring-1"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="gap-2 shadow-sm" asChild>
                  <Link href="/dashboard/invoices/new">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">New Invoice</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Create a new invoice
              </TooltipContent>
            </Tooltip>

            {/* Notifications */}
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-medium">
                          {unreadCount}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  Notifications
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="w-96">
                <DropdownMenuLabel className="flex items-center justify-between py-3">
                  <span className="text-base font-semibold">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                      {unreadCount} unread
                    </span>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="flex items-start gap-3 p-4 cursor-pointer focus:bg-muted/50"
                    >
                      <div
                        className={cn(
                          "mt-0.5 h-2 w-2 rounded-full flex-shrink-0",
                          notification.unread
                            ? typeColors[notification.type as keyof typeof typeColors]
                            : "bg-transparent"
                        )}
                      />
                      <div className="flex-1 space-y-1">
                        <p className={cn("text-sm leading-tight", notification.unread && "font-medium")}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground leading-tight">
                          {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.time}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="p-0">
                  <Link
                    href="/dashboard/notifications"
                    className="flex items-center justify-center py-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors w-full"
                  >
                    View all notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}
