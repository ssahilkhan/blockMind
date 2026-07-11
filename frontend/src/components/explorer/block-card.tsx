"use client";

import Link from "next/link";
import { CopyButton } from "@/components/common";
import type { BlockResponse } from "@/types/api";

interface BlockCardProps {
  block: BlockResponse;
}

function truncateHash(hash: string): string {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

export function BlockCard({ block }: BlockCardProps) {
  const date = new Date(Number(block.timestamp) * 1000);

  return (
    <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Link
            href={`/blocks/${block.number}`}
            className="font-mono text-sm font-semibold hover:underline"
          >
            #{block.number}
          </Link>
          <span className="text-xs text-muted-foreground">
            {date.toLocaleTimeString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <code className="text-xs text-muted-foreground">
            {truncateHash(block.hash)}
          </code>
          <CopyButton value={block.hash} />
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium">{block.transactionCount} txns</p>
        <p className="text-xs text-muted-foreground">
          Gas: {block.gasUsedPercent}%
        </p>
      </div>
    </div>
  );
}
