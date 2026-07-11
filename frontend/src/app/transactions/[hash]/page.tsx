"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

function TxDetailsDisplay({ tx }: { tx: NonNullable<ReturnType<typeof chainApi.getTransaction> extends Promise<infer T> ? T : never> }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/transactions">
          <Button variant="ghost" size="icon-sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">Transaction</h2>
          <div className="flex items-center gap-2 mt-1">
            <code className="text-xs text-muted-foreground break-all">{tx.hash}</code>
            <CopyButton value={tx.hash} />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Transaction Details</CardTitle>
          <Badge variant={tx.blockNumber ? "default" : "secondary"}>
            {tx.blockNumber ? "Confirmed" : "Pending"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-0">
          <div className="flex items-start justify-between gap-4 py-2 border-b">
            <span className="text-sm text-muted-foreground shrink-0">Hash</span>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono break-all">{tx.hash}</code>
              <CopyButton value={tx.hash} />
            </div>
          </div>
          <FieldRow label="Block Number" value={tx.blockNumber ?? "Pending"} />
          <div className="flex items-start justify-between gap-4 py-2 border-b">
            <span className="text-sm text-muted-foreground shrink-0">Block Hash</span>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono break-all">{tx.blockHash ?? "N/A"}</code>
              {tx.blockHash && <CopyButton value={tx.blockHash} />}
            </div>
          </div>
          <div className="flex items-start justify-between gap-4 py-2 border-b">
            <span className="text-sm text-muted-foreground shrink-0">From</span>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono break-all">{tx.from}</code>
              <CopyButton value={tx.from} />
            </div>
          </div>
          <div className="flex items-start justify-between gap-4 py-2 border-b">
            <span className="text-sm text-muted-foreground shrink-0">To</span>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono break-all">{tx.to ?? "Contract Creation"}</code>
              {tx.to && <CopyButton value={tx.to} />}
            </div>
          </div>
          <FieldRow label="Value" value={`${tx.value} ETH`} />
          <FieldRow label="Gas Price" value={tx.gasPrice} />
          <FieldRow label="Gas Limit" value={tx.gasLimit} />
          <FieldRow label="Nonce" value={tx.nonce} />
        </CardContent>
      </Card>

      {tx.input && tx.input !== "0x" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Input Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-2">
              <code className="flex-1 rounded bg-muted p-3 font-mono text-xs break-all whitespace-pre-wrap">
                {tx.input}
              </code>
              <CopyButton value={tx.input} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function TransactionDetailPage({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = use(params);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["chain", "transaction", hash],
    queryFn: () => chainApi.getTransaction(hash),
    enabled: !!hash,
  });

  return (
    <DashboardLayout>
      {isLoading ? (
        <LoadingSpinner text="Loading transaction details..." />
      ) : isError || !data ? (
        <div className="space-y-4">
          <Link href="/transactions">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Transactions
            </Button>
          </Link>
          <Card>
            <CardContent className="pt-6 text-center text-sm text-destructive">
              Transaction not found or failed to load.
            </CardContent>
          </Card>
        </div>
      ) : (
        <TxDetailsDisplay tx={data} />
      )}
    </DashboardLayout>
  );
}
