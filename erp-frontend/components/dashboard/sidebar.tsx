"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Logo, NavIcons } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronLeft, LogOut } from "lucide-react";
import { useAuth, UserRole } from "@/contexts/AuthContext";

const navigation = [
  { name: "Dashboard", href: "/dashboard", Icon: NavIcons.Dashboard, roles: ["ADMIN", "MANAGER", "ACCOUNTANT", "RECOVERY_AGENT", "CLIENT"] },
  { name: "Invoices", href: "/dashboard/invoices", Icon: NavIcons.Invoices, roles: ["ADMIN", "MANAGER", "ACCOUNTANT", "CLIENT", "RECOVERY_AGENT"] },
  { name: "Clients", href: "/dashboard/clients", Icon: NavIcons.Clients, roles: ["ADMIN", "MANAGER", "ACCOUNTANT", "RECOVERY_AGENT"] },
  { name: "Payments", href: "/dashboard/payments", Icon: NavIcons.Payments, roles: ["ADMIN", "MANAGER", "ACCOUNTANT", "RECOVERY_AGENT"] },
  { name: "Expenses", href: "/dashboard/expenses", Icon: NavIcons.Expenses, roles: ["ADMIN", "MANAGER", "ACCOUNTANT"] },
  { name: "Recovery", href: "/dashboard/recovery", Icon: NavIcons.Recovery, roles: ["ADMIN", "MANAGER", "RECOVERY_AGENT"] },
  { name: "Reports", href: "/dashboard/reports", Icon: NavIcons.Reports, roles: ["ADMIN", "MANAGER", "ACCOUNTANT"] },
  { name: "Accounting", href: "/dashboard/accounting", Icon: NavIcons.Accounting, roles: ["ADMIN", "MANAGER", "ACCOUNTANT"] },
  { name: "Staff Management", href: "/dashboard/admin/users", Icon: NavIcons.Users, roles: ["ADMIN"] },
  { name: "AI Insights", href: "/dashboard/insights", Icon: NavIcons.AIInsights, roles: ["ADMIN", "MANAGER"] },
  { name: "Marketplace", href: "/dashboard/help", Icon: NavIcons.Help, roles: ["CLIENT"] },
];

const secondaryNavigation = [
  { name: "Settings", href: "/dashboard/settings", Icon: NavIcons.Settings, roles: ["ADMIN", "MANAGER", "ACCOUNTANT", "RECOVERY_AGENT", "CLIENT"] },
  { name: "Help & Support", href: "/dashboard/help", Icon: NavIcons.Help, roles: ["ADMIN", "MANAGER", "ACCOUNTANT", "RECOVERY_AGENT", "CLIENT"] },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function DashboardSidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
  };

  const filteredNavigation = navigation.filter(item => 
    !item.roles || (user?.role && item.roles.includes(user.role))
  );

  const filteredSecondaryNavigation = secondaryNavigation.filter(item => 
    !item.roles || (user?.role && item.roles.includes(user.role))
  );

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <Link href="/dashboard" className="flex items-center">
              <Logo size="sm" showText={!collapsed} />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className={cn(
                "h-8 w-8 flex-shrink-0",
                collapsed &&
                  "absolute -right-4 bg-card border border-border rounded-full shadow-sm"
              )}
            >
              <ChevronLeft
                className={cn(
                  "h-4 w-4 transition-transform",
                  collapsed && "rotate-180"
                )}
              />
            </Button>
          </div>

          <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");

              const linkContent = (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <item.Icon />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );

              if (collapsed) {
                return (
                  <Tooltip key={item.name}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right" sideOffset={10}>
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return linkContent;
            })}
          </nav>

          <div className="border-t border-border px-2 py-4 space-y-1">
            {filteredSecondaryNavigation.map((item) => {
              const isActive = pathname === item.href;

              const linkContent = (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <item.Icon />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );

              if (collapsed) {
                return (
                  <Tooltip key={item.name}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right" sideOffset={10}>
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return linkContent;
            })}

            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center justify-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="h-5 w-5 flex-shrink-0" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>
                  Sign out
                </TooltipContent>
              </Tooltip>
            ) : (
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                <span>Sign out</span>
              </button>
            )}
          </div>

          {/* User profile */}
          {!collapsed && (
            <div className="border-t border-border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-sm font-semibold shadow-sm">
                  JD
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">John Doe</p>
                  <p className="text-xs text-muted-foreground truncate">
                    john@acme.com
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
