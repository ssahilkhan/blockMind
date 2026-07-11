"use client";

import { DashboardLayout } from "@/components/layout";
import {
  Box,
  Wallet,
  ArrowRightLeft,
  FileCode2,
  Coins,
  Activity,
  PieChart,
  Link2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { chainApi } from "@/services";
import { LoadingSpinner } from "@/components/common";

const DASHBOARD_CARDS = [
  { title: "Latest Block", icon: Box, key: "block" },
  { title: "Wallets", icon: Wallet, key: "wallets" },
  { title: "Transactions", icon: ArrowRightLeft, key: "transactions" },
  { title: "Contracts", icon: FileCode2, key: "contracts" },
  { title: "Tokens", icon: Coins, key: "tokens" },
  { title: "Events", icon: Activity, key: "events" },
  { title: "Portfolio", icon: PieChart, key: "portfolio" },
  { title: "Network", icon: Link2, key: "network" },
] as const;

function StatsCard({
  title,
  icon: Icon,
  value,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  value?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value ?? <span className="text-muted-foreground text-base">--</span>}
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardContent() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["chain", "stats"],
    queryFn: () => chainApi.getStats(),
  });

  if (isLoading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Overview of your blockchain network.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DASHBOARD_CARDS.map((card) => (
          <StatsCard
            key={card.key}
            title={card.title}
            icon={card.icon}
            value={
              card.key === "block" && stats
                ? `#${stats.latestBlock}`
                : card.key === "network" && stats
                  ? stats.network
                  : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
}
