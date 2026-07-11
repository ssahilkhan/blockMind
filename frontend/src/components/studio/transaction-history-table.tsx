"use client";

import { Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HashBadge } from "./hash-badge";
import type { SessionTransaction } from "@/stores/tx-studio-store";

interface TransactionHistoryTableProps {
  transactions: SessionTransaction[];
}

const STATUS_ICON = {
  pending: Clock,
  confirmed: CheckCircle,
  failed: XCircle,
};

const STATUS_STYLE = {
  pending: "text-yellow-500",
  confirmed: "text-green-500",
  failed: "text-red-500",
};

export function TransactionHistoryTable({ transactions }: TransactionHistoryTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Session History</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No transactions sent in this session.
          </p>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => {
              const Icon = STATUS_ICON[tx.status];
              return (
                <div
                  key={tx.hash}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="space-y-1">
                    <HashBadge hash={tx.hash} />
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>To: {tx.to.slice(0, 10)}...{tx.to.slice(-6)}</span>
                      <span>{tx.value} ETH</span>
                      <span>{new Date(tx.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <Icon className={`h-4 w-4 ${STATUS_STYLE[tx.status]}`} />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
