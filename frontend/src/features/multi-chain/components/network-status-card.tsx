"use client";

import { Activity, Wifi, WifiOff, Clock, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChainContext } from "../hooks/use-chain-context";
import type { ChainHealthState } from "../types";

function HealthDot({ connected }: { connected: boolean }) {
  return (
    <span
      className={cn(
        "inline-block h-2 w-2 rounded-full",
        connected ? "bg-green-500" : "bg-red-500",
      )}
    />
  );
}

export function NetworkStatusCard() {
  const { currentChain, health, isOnline, currentChainId } = useChainContext();

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: currentChain.color ?? "#6B7280" }}
          />
          <h3 className="text-sm font-semibold">{currentChain.name}</h3>
        </div>
        <div className="flex items-center gap-1.5">
          <HealthDot connected={isOnline} />
          <span className="text-xs text-muted-foreground">
            {isOnline ? "Connected" : "Disconnected"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Layers className="h-3 w-3" />
          <span>Chain ID</span>
        </div>
        <div className="font-mono text-right">{currentChainId}</div>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Activity className="h-3 w-3" />
          <span>RPC Latency</span>
        </div>
        <div className="font-mono text-right">
          {health?.latency ? `${health.latency}ms` : "N/A"}
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Layers className="h-3 w-3" />
          <span>Latest Block</span>
        </div>
        <div className="font-mono text-right">
          {health?.latestBlock ? health.latestBlock.toLocaleString() : "N/A"}
        </div>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Currency</span>
        </div>
        <div className="text-right">{currentChain.nativeCurrency.symbol}</div>
      </div>

      {health?.error && (
        <div className="rounded bg-destructive/10 px-2 py-1 text-xs text-destructive">
          {health.error}
        </div>
      )}
    </div>
  );
}
