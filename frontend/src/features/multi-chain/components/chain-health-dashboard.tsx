"use client";

import { Activity, Wifi, WifiOff, Clock, Layers, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChainContext } from "../hooks/use-chain-context";
import { useChainHealthPolling } from "../hooks/use-chain-health";
import { Badge } from "@/components/ui/badge";
import type { ChainHealthState } from "../types";

function HealthIndicator({ health }: { health: ChainHealthState }) {
  const color = health.connected ? "bg-green-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <span className={cn("h-2 w-2 rounded-full", color)} />
      <span className="text-xs text-muted-foreground">
        {health.connected ? "Connected" : "Disconnected"}
      </span>
    </div>
  );
}

function ChainHealthRow({ health }: { health: ChainHealthState }) {
  const allChains = useChainContext().allChains;
  const chain = allChains.find((c) => c.chainId === health.chainId);
  if (!chain) return null;

  return (
    <div className="flex items-center justify-between rounded-md border p-3">
      <div className="flex items-center gap-3">
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: chain.color ?? "#6B7280" }}
        />
        <div>
          <div className="text-sm font-medium">{chain.name}</div>
          <div className="text-xs text-muted-foreground">
            #{chain.chainId} · {chain.nativeCurrency.symbol}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 text-xs">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Activity className="h-3 w-3" />
          <span className="font-mono">
            {health.latency > 0 ? `${health.latency}ms` : "—"}
          </span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Layers className="h-3 w-3" />
          <span className="font-mono">
            {health.latestBlock > 0 ? health.latestBlock.toLocaleString() : "—"}
          </span>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span className="font-mono">
            {health.lastChecked
              ? new Date(health.lastChecked).toLocaleTimeString()
              : "—"}
          </span>
        </div>
        <HealthIndicator health={health} />
      </div>
    </div>
  );
}

export function ChainHealthDashboard() {
  const { data, isLoading, refetch } = useChainHealthPolling(30_000);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Chain Health</h2>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-1 rounded-md border px-2 py-1 text-xs text-muted-foreground hover:bg-accent"
        >
          <RefreshCw className="h-3 w-3" />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-14 animate-pulse rounded-md border bg-muted"
            />
          ))}
        </div>
      ) : data?.networks && data.networks.length > 0 ? (
        <div className="space-y-2">
          {data.networks.map((health) => (
            <ChainHealthRow key={health.chainId} health={health} />
          ))}
        </div>
      ) : (
        <div className="rounded-md border p-6 text-center text-sm text-muted-foreground">
          No chain health data available
        </div>
      )}
    </div>
  );
}
