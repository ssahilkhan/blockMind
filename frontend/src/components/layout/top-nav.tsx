"use client";

import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/app-store";
import { useHealthPolling } from "@/hooks/use-network-health";
import { NetworkSelector } from "@/features/multi-chain";

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

export function TopNav() {
  const { data: healthData, isLoading: healthLoading } = useHealthPolling();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-semibold">BlockMind Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <NetworkSelector />

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
