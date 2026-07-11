"use client";

import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
import { useHealthPolling, useNetworkStatus } from "@/hooks/use-network-health";
import { Badge } from "@/components/ui/badge";

function HealthIndicator({ status }: { status: string }) {
  const color =
    status === "healthy"
      ? "bg-green-500"
      : status === "degraded"
        ? "bg-yellow-500"
        : "bg-red-500";

  return (
    <div className="flex items-center gap-2">
      <span className={cn("h-2.5 w-2.5 rounded-full", color)} />
      <span className="text-xs text-muted-foreground capitalize">{status}</span>
    </div>
  );
}

function NetworkBadge() {
  const { data, isLoading, isError } = useNetworkStatus();
  const network = useAppStore((s) => s.currentNetwork);

  if (isLoading) {
    return <Badge variant="outline">Loading...</Badge>;
  }

  if (isError || !network) {
    return <Badge variant="destructive">Disconnected</Badge>;
  }

  return (
    <Badge variant="outline" className="gap-1.5">
      <span className="font-mono text-xs">{network.name}</span>
      <span className="text-muted-foreground">#{network.chainId}</span>
    </Badge>
  );
}

export function TopNav() {
  const { data: healthData, isLoading: healthLoading } = useHealthPolling();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-semibold">BlockMind Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <NetworkBadge />

        <div className="flex items-center">
          {healthLoading ? (
            <span className="text-xs text-muted-foreground">Checking...</span>
          ) : (
            <HealthIndicator status={healthData?.status ?? "unhealthy"} />
          )}
        </div>
      </div>
    </header>
  );
}
