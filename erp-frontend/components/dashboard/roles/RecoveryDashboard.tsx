"use client";

import { StatsCards } from "../stats-cards";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { RecentInvoices } from "../recent-invoices";
import { OverdueBanner } from "../overdue-banner";

export function RecoveryDashboard() {
  return (
    <div className="space-y-6">
      <OverdueBanner />
      <StatsCards role="RECOVERY_AGENT" />
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-red-200 bg-red-50/10">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              High Risk Jurisdictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">Clients with 90+ days overdue status</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm p-2 bg-background rounded-lg border">
                <span>Global Dynamics</span>
                <span className="font-bold text-red-600">RWF 4.2M</span>
              </div>
              <div className="flex justify-between items-center text-sm p-2 bg-background rounded-lg border">
                <span>TechCorp Inc</span>
                <span className="font-bold text-red-600">RWF 1.8M</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              Upcoming Recovery Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-3">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                Follow-up call with Startup Labs (Tomorrow)
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500" />
                Send Stage 3 reminder to Digital Ventures
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        <RecentInvoices title="Current Overdue Cases" />
      </div>
    </div>
  );
}
