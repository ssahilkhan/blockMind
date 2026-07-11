"use client";

import { CopyButton } from "@/components/common";

interface HashBadgeProps {
  hash: string;
  label?: string;
}

function truncateHash(hash: string): string {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

export function HashBadge({ hash, label }: HashBadgeProps) {
  return (
    <div className="space-y-1">
      {label && (
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
      )}
      <div className="flex items-center gap-2">
        <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
          {truncateHash(hash)}
        </code>
        <CopyButton value={hash} />
      </div>
    </div>
  );
}
