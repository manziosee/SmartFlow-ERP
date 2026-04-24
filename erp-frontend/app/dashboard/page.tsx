"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { BusinessDashboard } from "@/components/dashboard/roles/BusinessDashboard";
import { AccountantDashboard } from "@/components/dashboard/roles/AccountantDashboard";
import { RecoveryDashboard } from "@/components/dashboard/roles/RecoveryDashboard";
import { ClientDashboard } from "@/components/dashboard/roles/ClientDashboard";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
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
