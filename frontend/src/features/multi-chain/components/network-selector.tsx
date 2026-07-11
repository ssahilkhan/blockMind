"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChainContext } from "../hooks/use-chain-context";
import { NETWORK_TYPE_LABELS } from "../types";
import type { ChainMetadata } from "../types";

export function NetworkSelector() {
  const { currentChain, currentChainId, setCurrentChain, allChains, isOnline } =
    useChainContext();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
      >
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: currentChain.color ?? "#6B7280" }}
        />
        <span className="font-mono text-xs">{currentChain.shortName}</span>
        <span className="text-muted-foreground">#{currentChainId}</span>
        {isOnline ? (
          <Wifi className="h-3 w-3 text-green-500" />
        ) : (
          <WifiOff className="h-3 w-3 text-red-500" />
        )}
        <ChevronDown
          className={cn("h-3 w-3 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-80 rounded-md border bg-popover p-1 shadow-md">
          <div className="max-h-96 overflow-y-auto">
            <ChainGroup
              label="Mainnets"
              chains={allChains.filter((c) => c.type === "mainnet")}
              currentChainId={currentChainId}
              onSelect={(id) => {
                setCurrentChain(id);
                setOpen(false);
              }}
            />
            <ChainGroup
              label="Testnets"
              chains={allChains.filter((c) => c.type === "testnet")}
              currentChainId={currentChainId}
              onSelect={(id) => {
                setCurrentChain(id);
                setOpen(false);
              }}
            />
            <ChainGroup
              label="Local"
              chains={allChains.filter((c) => c.type === "local")}
              currentChainId={currentChainId}
              onSelect={(id) => {
                setCurrentChain(id);
                setOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ChainGroup({
  label,
  chains,
  currentChainId,
  onSelect,
}: {
  label: string;
  chains: ChainMetadata[];
  currentChainId: number;
  onSelect: (chainId: number) => void;
}) {
  if (chains.length === 0) return null;

  return (
    <div className="py-1">
      <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
        {label}
      </div>
      {chains.map((chain) => (
        <button
          key={chain.chainId}
          onClick={() => onSelect(chain.chainId)}
          className={cn(
            "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent",
            chain.chainId === currentChainId && "bg-accent",
          )}
        >
          <span
            className="h-2.5 w-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: chain.color ?? "#6B7280" }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-medium truncate">{chain.name}</span>
              <span className="text-xs text-muted-foreground">
                #{chain.chainId}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {chain.nativeCurrency.symbol} ·{" "}
              {NETWORK_TYPE_LABELS[chain.type]}
            </div>
          </div>
          {chain.chainId === currentChainId && (
            <Check className="h-4 w-4 shrink-0 text-primary" />
          )}
        </button>
      ))}
    </div>
  );
}
