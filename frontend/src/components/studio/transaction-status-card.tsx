"use client";

import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HashBadge } from "./hash-badge";
import type { TrackResult } from "@/services/transaction";

interface TransactionStatusCardProps {
  result: TrackResult;
  hash: string;
}

const STATUS_CONFIG = {
  pending: { icon: Clock, variant: "secondary" as const, label: "Pending" },
  confirmed: { icon: CheckCircle, variant: "default" as const, label: "Confirmed" },
  failed: { icon: XCircle, variant: "destructive" as const, label: "Failed" },
};

export function TransactionStatusCard({ result, hash }: TransactionStatusCardProps) {
  const config = STATUS_CONFIG[result.status];
  const Icon = config.icon;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Transaction Status</CardTitle>
        <Badge variant={config.variant}>{config.label}</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <HashBadge hash={hash} label="Transaction Hash" />

        <div className="grid grid-cols-2 gap-4">
          {result.blockNumber && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Block Number</p>
              <p className="text-sm font-semibold">#{result.blockNumber}</p>
            </div>
          )}
          {result.confirmations !== undefined && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Confirmations</p>
              <p className="text-sm font-semibold">{result.confirmations}</p>
            </div>
          )}
          {result.receipt && (
            <>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Gas Used</p>
                <p className="text-sm font-semibold">{result.receipt.gasUsed}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Effective Gas Price</p>
                <p className="text-sm font-semibold">{result.receipt.gasPrice}</p>
              </div>
            </>
          )}
        </div>

        {result.error && (
          <div className="rounded-md bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{result.error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
