"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AuditDashboard } from "@/features/smart-contract-auditor";

export default function AuditorPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold">Smart Contract Auditor</h1>
          <p className="text-sm text-muted-foreground">
            AI-powered smart contract analysis with security findings, gas optimizations, and code quality recommendations
          </p>
        </div>
        <AuditDashboard />
      </div>
    </DashboardLayout>
  );
}
