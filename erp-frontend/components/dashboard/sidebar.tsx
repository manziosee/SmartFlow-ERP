"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Logo, NavIcons } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft, LogOut, X } from "lucide-react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { notificationsApi } from "@/lib/api";

const navigation = [
  { name: "Dashboard", href: "/dashboard", Icon: NavIcons.Dashboard, roles: ["ADMIN", "MANAGER", "ACCOUNTANT", "RECOVERY_AGENT", "CLIENT"] },
  { name: "Invoices", href: "/dashboard/invoices", Icon: NavIcons.Invoices, roles: ["ADMIN", "MANAGER", "ACCOUNTANT", "CLIENT", "RECOVERY_AGENT"] },
  { name: "Inventory", href: "/dashboard/inventory", Icon: NavIcons.Inventory, roles: ["ADMIN", "MANAGER", "ACCOUNTANT"] },
  { name: "Vendors", href: "/dashboard/vendors", Icon: NavIcons.Vendors, roles: ["ADMIN", "MANAGER", "ACCOUNTANT"] },
  { name: "Clients", href: "/dashboard/clients", Icon: NavIcons.Clients, roles: ["ADMIN", "MANAGER", "ACCOUNTANT", "RECOVERY_AGENT"] },
  { name: "Payments", href: "/dashboard/payments", Icon: NavIcons.Payments, roles: ["ADMIN", "MANAGER", "ACCOUNTANT", "RECOVERY_AGENT"] },
  { name: "Expenses", href: "/dashboard/expenses", Icon: NavIcons.Expenses, roles: ["ADMIN", "MANAGER", "ACCOUNTANT"] },
  { name: "HR & Payroll", href: "/dashboard/hr", Icon: NavIcons.HR, roles: ["ADMIN", "MANAGER"] },
  { name: "Recovery", href: "/dashboard/recovery", Icon: NavIcons.Recovery, roles: ["ADMIN", "MANAGER", "RECOVERY_AGENT"] },
  { name: "Reports", href: "/dashboard/reports", Icon: NavIcons.Reports, roles: ["ADMIN", "MANAGER", "ACCOUNTANT"] },
  { name: "Accounting", href: "/dashboard/accounting", Icon: NavIcons.Accounting, roles: ["ADMIN", "MANAGER", "ACCOUNTANT"] },
  { name: "Taxes", href: "/dashboard/taxes", Icon: NavIcons.Taxes, roles: ["ADMIN", "MANAGER", "ACCOUNTANT"] },
  { name: "Staff Management", href: "/dashboard/admin/users", Icon: NavIcons.Users, roles: ["ADMIN"] },
  { name: "AI Insights", href: "/dashboard/insights", Icon: NavIcons.AIInsights, roles: ["ADMIN", "MANAGER"] },
  { name: "Marketplace", href: "/dashboard/help", Icon: NavIcons.Help, roles: ["CLIENT"] },
];

const secondaryNavigation = [
  { name: "Settings", href: "/dashboard/settings", Icon: NavIcons.Settings, roles: ["ADMIN", "MANAGER", "ACCOUNTANT", "RECOVERY_AGENT", "CLIENT"] },
  { name: "Help & Support", href: "/dashboard/help", Icon: NavIcons.Help, roles: ["ADMIN", "MANAGER", "ACCOUNTANT", "RECOVERY_AGENT", "CLIENT"] },
];

export interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function DashboardSidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    notificationsApi.getAll()
      .then(data => {
        const count = data.filter((n: any) => n.unread || !n.read).length;
        setUnreadCount(count);
      })
      .catch(() => {});
    const interval = setInterval(() => {
      notificationsApi.getAll()
        .then(data => setUnreadCount(data.filter((n: any) => n.unread || !n.read).length))
        .catch(() => {});
    }, 60_000);
    return () => clearInterval(interval);
  }, [user]);

  const handleSignOut = () => logout();

  const filteredNavigation = navigation.filter(item =>
    !item.roles || (user?.role && item.roles.includes(user.role))
  );

  const filteredSecondaryNavigation = secondaryNavigation.filter(item =>
    !item.roles || (user?.role && item.roles.includes(user.role))
  );

  const sidebarContent = (isMobile: boolean) => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <Link href="/dashboard" className="flex items-center" onClick={isMobile ? onMobileClose : undefined}>
          <Logo size="sm" showText={isMobile || !collapsed} />
        </Link>
        {isMobile ? (
          <Button variant="ghost" size="icon" onClick={onMobileClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn(
              "h-8 w-8 flex-shrink-0",
              collapsed && "absolute -right-4 bg-card border border-border rounded-full shadow-sm"
            )}
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </Button>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 px-2 py-2 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const showCollapsed = !isMobile && collapsed;

          const linkContent = (
            <Link
              key={item.name}
              href={item.href}
              onClick={isMobile ? onMobileClose : undefined}
              className={cn(
                "group relative flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold transition-all duration-300",
                isActive
                  ? "bg-primary text-primary-foreground shadow-[0_8px_16px_-6px_rgba(0,0,0,0.15)] glow"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                showCollapsed && "justify-center px-2"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110 relative",
                isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
              )}>
                <item.Icon className="h-5 w-5" />
                {item.href === "/dashboard/notifications" && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              {!showCollapsed && (
                <span className="flex-1 truncate">{item.name}</span>
              )}
              {!showCollapsed && item.href === "/dashboard/notifications" && unreadCount > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
              {isActive && !showCollapsed && item.href !== "/dashboard/notifications" && (
                <div className="absolute right-2 h-1.5 w-1.5 rounded-full bg-primary-foreground/50" />
              )}
            </Link>
          );

          if (showCollapsed) {
            return (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>{item.name}</TooltipContent>
              </Tooltip>
            );
          }
          return linkContent;
        })}
      </nav>

      <div className="border-t border-border px-2 py-2 space-y-0.5">
        {filteredSecondaryNavigation.map((item) => {
          const isActive = pathname === item.href;
          const showCollapsed = !isMobile && collapsed;

          const linkContent = (
            <Link
              key={item.name}
              href={item.href}
              onClick={isMobile ? onMobileClose : undefined}
              className={cn(
                "group flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold transition-all duration-300",
                isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                showCollapsed && "justify-center px-2"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110",
                isActive ? "text-foreground" : "text-muted-foreground group-hover:text-primary"
              )}>
                <item.Icon className="h-5 w-5" />
              </div>
              {!showCollapsed && <span className="flex-1 truncate">{item.name}</span>}
            </Link>
          );
          if (showCollapsed) {
            return (
              <Tooltip key={item.name}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>{item.name}</TooltipContent>
              </Tooltip>
            );
          }
          return linkContent;
        })}

        {(!isMobile && collapsed) ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center justify-center gap-2 rounded-xl px-2 py-1.5 text-sm font-semibold text-muted-foreground transition-all duration-300 hover:bg-destructive/10 hover:text-destructive shadow-sm"
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10}>Sign out</TooltipContent>
          </Tooltip>
        ) : (
          <button
            onClick={handleSignOut}
            className="group flex w-full items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold text-muted-foreground transition-all duration-300 hover:bg-destructive/10 hover:text-destructive"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110">
              <LogOut className="h-5 w-5 flex-shrink-0" />
            </div>
            <span>Sign out</span>
          </button>
        )}
      </div>

      {/* User profile */}
      {(isMobile || !collapsed) && (
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-sm font-semibold shadow-sm">
              {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || "Unknown User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email || "No email"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <TooltipProvider delayDuration={0}>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300",
          "hidden lg:block",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        {sidebarContent(false)}
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-72 border-r border-border bg-card transition-transform duration-300",
          "lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent(true)}
      </aside>
    </TooltipProvider>
  );
}
