"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  ChainHealthDashboard,
  NetworkStatusCard,
} from "@/features/multi-chain";

export default function NetworksPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-bold">Networks</h1>
          <p className="text-sm text-muted-foreground">
            Multi-chain intelligence platform — manage and monitor all supported
            networks
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h2 className="mb-3 text-lg font-semibold">Current Network</h2>
            <NetworkStatusCard />
          </div>

          <div className="lg:col-span-2">
            <ChainHealthDashboard />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
