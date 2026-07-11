"use client";

import { DashboardLayout } from "@/components/layout";
import { SecurityDashboard } from "@/features/security/components";

export default function SecurityPage() {
  return (
    <DashboardLayout>
      <SecurityDashboard />
    </DashboardLayout>
  );
}
