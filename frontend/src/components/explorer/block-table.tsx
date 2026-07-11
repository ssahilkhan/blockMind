"use client";

import { BlockCard } from "./block-card";
import type { BlockResponse } from "@/types/api";

interface BlockTableProps {
  blocks: BlockResponse[];
}

export function BlockTable({ blocks }: BlockTableProps) {
  if (blocks.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        No blocks found.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {blocks.map((block) => (
        <BlockCard key={block.number} block={block} />
      ))}
    </div>
  );
}
