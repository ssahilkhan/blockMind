"use client";

import { Clock, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DeployedContract } from "@/types/contract";

interface ContractHistoryProps {
  contracts: DeployedContract[];
}

export function ContractHistory({ contracts }: ContractHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Deployed Contracts</CardTitle>
      </CardHeader>
      <CardContent>
        {contracts.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No contracts deployed in this session.
          </p>
        ) : (
          <div className="space-y-2">
            {contracts.map((c) => (
              <div
                key={c.address}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{c.name}</span>
                    <Badge variant="secondary" className="text-[10px]">
                      Deployed
                    </Badge>
                  </div>
                  <code className="block break-all font-mono text-xs text-muted-foreground">
                    {c.address}
                  </code>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>Tx: {c.txHash.slice(0, 10)}...</span>
                    <span>{new Date(c.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
                <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
