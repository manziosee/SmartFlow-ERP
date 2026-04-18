"use client";

import { useAuth } from "@/contexts/AuthContext";
import { BusinessDashboard } from "@/components/dashboard/roles/BusinessDashboard";
import { AccountantDashboard } from "@/components/dashboard/roles/AccountantDashboard";
import { RecoveryDashboard } from "@/components/dashboard/roles/RecoveryDashboard";
import { ClientDashboard } from "@/components/dashboard/roles/ClientDashboard";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Route to specific dashboards based on role
  switch (user?.role) {
    case "ADMIN":
    case "MANAGER":
      return <BusinessDashboard />;
    case "ACCOUNTANT":
      return <AccountantDashboard />;
    case "RECOVERY_AGENT":
      return <RecoveryDashboard />;
    case "CLIENT":
      return <ClientDashboard />;
    default:
      return <BusinessDashboard />;
  }
}
