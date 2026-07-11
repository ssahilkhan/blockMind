"use client";

import Link from "next/link";
import { CopyButton } from "@/components/common";
import type { TransactionResponse } from "@/types/api";

interface TransactionCardProps {
  tx: TransactionResponse;
}

function truncateHash(hash: string): string {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

function truncateAddress(address: string | null): string {
  if (!address) return "Contract Creation";
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
}

export function TransactionCard({ tx }: TransactionCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Link
            href={`/transactions/${tx.hash}`}
            className="font-mono text-sm font-semibold hover:underline"
          >
            {truncateHash(tx.hash)}
          </Link>
          <CopyButton value={tx.hash} />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Block #{tx.blockNumber ?? "pending"}</span>
          <span>From: {truncateAddress(tx.from)}</span>
          <span>To: {truncateAddress(tx.to)}</span>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium">{tx.value} ETH</p>
      </div>
    </div>
  );
}
