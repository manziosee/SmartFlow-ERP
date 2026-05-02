"use client";

import Link from "next/link";
import { Bell, Search, Plus, Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "next-themes";
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
import { useState, useEffect } from "react";
import { notificationsApi } from "@/lib/api";

interface HeaderProps {
  sidebarCollapsed: boolean;
  onMobileMenuToggle: () => void;
}

const typeColors = {
  payment: "bg-emerald-500",
  client: "bg-purple-500",
  alert: "bg-red-500",
  ai: "bg-amber-500",
  system: "bg-slate-500",
  invoice: "bg-blue-500",
};

export function DashboardHeader({ sidebarCollapsed, onMobileMenuToggle }: HeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    notificationsApi.getAll().then(setNotifications).catch(console.error);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread || !n.read).length;

  return (
    <TooltipProvider>
      <header
        className={cn(
          "fixed top-0 right-0 z-30 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
          "left-0 lg:left-64",
          sidebarCollapsed && "lg:left-[68px]"
        )}
      >
        <div className="flex h-full items-center gap-3 px-4 sm:px-6">
          {/* Hamburger — mobile only */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden flex-shrink-0"
            onClick={onMobileMenuToggle}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

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
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                  aria-label="Toggle dark mode"
                >
                  {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="gap-2 shadow-sm" asChild>
                  <Link href="/dashboard/invoices/new">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">New Invoice</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Create a new invoice</TooltipContent>
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
                <TooltipContent side="bottom">Notifications</TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="w-80 sm:w-96">
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
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">No notifications</div>
                  ) : notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="flex items-start gap-3 p-4 cursor-pointer focus:bg-muted/50"
                    >
                      <div
                        className={cn(
                          "mt-0.5 h-2 w-2 rounded-full flex-shrink-0",
                          (notification.unread || !notification.read)
                            ? typeColors[notification.type as keyof typeof typeColors] || "bg-primary"
                            : "bg-transparent"
                        )}
                      />
                      <div className="flex-1 space-y-1">
                        <p className={cn("text-sm leading-tight", (notification.unread || !notification.read) && "font-medium")}>
                          {notification.title || notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground leading-tight">
                          {notification.description || notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.time || new Date(notification.createdAt).toLocaleString()}
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
