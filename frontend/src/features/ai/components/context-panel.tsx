"use client";

import { Wallet, Radio, FileCode2, Coins, Activity, PieChart, RefreshCw } from "lucide-react";
import { useAIContextStore } from "../stores/context-store";
import type { AIMode, AIContext } from "../types";

const CONTEXT_ICONS: Record<string, React.ElementType> = {
  wallet: Wallet,
  transaction: Radio,
  contract: FileCode2,
  token: Coins,
  event: Activity,
  portfolio: PieChart,
};

const CONTEXT_LABELS: Record<string, string> = {
  wallet: "Wallet",
  transaction: "Transaction",
  contract: "Contract",
  token: "Token",
  event: "Event",
  portfolio: "Portfolio",
};

interface ContextPanelProps {
  currentMode: AIMode;
}

export function ContextPanel({ currentMode }: ContextPanelProps) {
  const context = useAIContextStore((s) => s.context);
  const clearContext = useAIContextStore((s) => s.clearContext);

  const contextType = context.type ?? currentMode;
  const Icon = CONTEXT_ICONS[contextType ?? "wallet"] ?? Wallet;
  const label = CONTEXT_LABELS[contextType ?? "wallet"] ?? "Unknown";

  const contextEntries = getContextEntries(context, contextType);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Context</h3>
        <button
          onClick={clearContext}
          className="text-muted-foreground hover:text-foreground"
          title="Clear context"
        >
          <RefreshCw className="h-3 w-3" />
        </button>
      </div>

      <div className="rounded-lg border bg-card p-3 space-y-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{label}</span>
        </div>

        {contextEntries.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No context detected. Visit a page to auto-load context.
          </p>
        ) : (
          <div className="space-y-2">
            {contextEntries.map((entry) => (
              <div key={entry.key} className="space-y-0.5">
                <p className="text-xs text-muted-foreground">{entry.label}</p>
                <p className="break-all font-mono text-xs">{entry.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface ContextEntry {
  key: string;
  label: string;
  value: string;
}

function getContextEntries(
  context: AIContext,
  contextType: string | null,
): ContextEntry[] {
  const entries: ContextEntry[] = [];

  if (context.walletAddress) {
    entries.push({ key: "wallet", label: "Wallet Address", value: context.walletAddress });
  }
  if (context.transactionHash) {
    entries.push({ key: "tx", label: "Transaction Hash", value: context.transactionHash });
  }
  if (context.contractAddress) {
    entries.push({ key: "contract", label: "Contract Address", value: context.contractAddress });
  }
  if (context.tokenAddress) {
    entries.push({ key: "token", label: "Token Address", value: context.tokenAddress });
  }
  if (context.blockNumber) {
    entries.push({ key: "block", label: "Block Number", value: String(context.blockNumber) });
  }
  if (context.chainId) {
    entries.push({ key: "chain", label: "Chain ID", value: String(context.chainId) });
  }

  return entries;
}
