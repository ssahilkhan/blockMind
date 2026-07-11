"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout";
import { LoadingSpinner } from "@/components/common";
import { CopyButton, AddressField } from "@/components/wallet";
import { chainApi } from "@/services";

function FieldRow({ label, value }: { label: string; value: string | number | null }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b last:border-b-0">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm font-mono text-right break-all">{value ?? "--"}</span>
    </div>
  );
}

function BlockDetailsDisplay({ block }: { block: NonNullable<ReturnType<typeof chainApi.getBlockByNumber> extends Promise<infer T> ? T : never> }) {
  const date = new Date(Number(block.timestamp) * 1000);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/blocks">
          <Button variant="ghost" size="icon-sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Block #{block.number}</h2>
          <p className="text-sm text-muted-foreground">
            {date.toLocaleString()} | {block.transactionCount} transactions
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Block Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          <FieldRow label="Block Number" value={block.number} />
          <div className="flex items-start justify-between gap-4 py-2 border-b">
            <span className="text-sm text-muted-foreground shrink-0">Block Hash</span>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono break-all">{block.hash}</code>
              <CopyButton value={block.hash} />
            </div>
          </div>
          <div className="flex items-start justify-between gap-4 py-2 border-b">
            <span className="text-sm text-muted-foreground shrink-0">Parent Hash</span>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono break-all">{block.parentHash}</code>
              <CopyButton value={block.parentHash} />
            </div>
          </div>
          <FieldRow label="Timestamp" value={date.toLocaleString()} />
          <div className="flex items-start justify-between gap-4 py-2 border-b">
            <span className="text-sm text-muted-foreground shrink-0">Miner</span>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono break-all">{block.miner}</code>
              <CopyButton value={block.miner} />
            </div>
          </div>
          <FieldRow label="Gas Used" value={block.gasUsed} />
          <FieldRow label="Gas Limit" value={block.gasLimit} />
          <FieldRow label="Gas Used %" value={block.gasUsedPercent + "%"} />
          <FieldRow label="Base Fee" value={block.baseFee ?? "N/A"} />
          <FieldRow label="Difficulty" value={block.difficulty} />
          <FieldRow label="Size" value={block.size ? `${block.size} bytes` : "N/A"} />
        </CardContent>
      </Card>

      {block.transactions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Transactions ({block.transactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {block.transactions.map((txHash) => (
                <Link
                  key={txHash}
                  href={`/transactions/${txHash}`}
                  className="flex items-center gap-2 rounded-lg border p-3 text-sm font-mono hover:bg-muted/50 transition-colors"
                >
                  <span className="truncate">{txHash}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function BlockDetailPage({ params }: { params: Promise<{ number: string }> }) {
  const { number } = use(params);
  const blockNumber = parseInt(number, 10);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["chain", "block", blockNumber],
    queryFn: () => chainApi.getBlockByNumber(blockNumber),
    enabled: !isNaN(blockNumber),
  });

  return (
    <DashboardLayout>
      {isLoading ? (
        <LoadingSpinner text="Loading block details..." />
      ) : isError || !data ? (
        <div className="space-y-4">
          <Link href="/blocks">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blocks
            </Button>
          </Link>
          <Card>
            <CardContent className="pt-6 text-center text-sm text-destructive">
              Block not found or failed to load.
            </CardContent>
          </Card>
        </div>
      ) : (
        <BlockDetailsDisplay block={data} />
      )}
    </DashboardLayout>
  );
}
