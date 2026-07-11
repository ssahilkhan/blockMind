"use client";

import { cn } from "@/lib/utils";
import { useChainContext } from "../hooks/use-chain-context";

export function MultiChainBadge() {
  const { currentChain, currentChainId, isOnline } = useChainContext();

  return (
    <div className="flex items-center gap-2">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: currentChain.color ?? "#6B7280" }}
      />
      <span className="font-mono text-xs">{currentChain.shortName}</span>
      <span className="text-muted-foreground">#{currentChainId}</span>
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isOnline ? "bg-green-500" : "bg-red-500",
        )}
      />
    </div>
  );
}
