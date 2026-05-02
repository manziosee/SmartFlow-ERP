"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  invoices: "Invoices",
  clients: "Clients",
  vendors: "Vendors",
  payments: "Payments",
  expenses: "Expenses",
  hr: "HR & Payroll",
  inventory: "Inventory",
  reports: "Reports",
  accounting: "Accounting",
  taxes: "Taxes",
  insights: "AI Insights",
  settings: "Settings",
  help: "Help & Support",
  notifications: "Notifications",
  recovery: "Recovery",
  admin: "Admin",
  users: "Staff Management",
  new: "New",
};

function labelFor(segment: string) {
  // UUID-like or numeric ID → truncate
  if (/^\d+$/.test(segment)) return `#${segment}`;
  if (segment.length > 12 && /^[a-f0-9-]+$/.test(segment)) return segment.substring(0, 8) + "…";
  return SEGMENT_LABELS[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
}

interface PageBreadcrumbProps {
  className?: string;
  /** Extra label overrides e.g. { "123": "Invoice INV-0023" } */
  labels?: Record<string, string>;
}

export function PageBreadcrumb({ className, labels = {} }: PageBreadcrumbProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length <= 1) return null;

  const crumbs = segments.map((seg, idx) => ({
    label: labels[seg] ?? labelFor(seg),
    href: "/" + segments.slice(0, idx + 1).join("/"),
    isLast: idx === segments.length - 1,
  }));

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("flex items-center gap-1 text-sm text-muted-foreground mb-4", className)}
    >
      <Link href="/dashboard" className="hover:text-foreground transition-colors">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {crumbs.slice(1).map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
          {crumb.isLast ? (
            <span className="font-medium text-foreground truncate max-w-[180px]">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-foreground transition-colors truncate max-w-[140px]">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
