"use client";

import { Clock, ArrowRightLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTokenStore } from "@/stores/token-store";
import { STANDARD_COLORS } from "@/types/token";

export function RecentTokens() {
  const recentTokens = useTokenStore((s) => s.recentTokens);
  const recentTransfers = useTokenStore((s) => s.recentTransfers);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4" />
            Recent Tokens
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentTokens.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No tokens viewed in this session.
            </p>
          ) : (
            <div className="space-y-2">
              {recentTokens.map((t) => (
                <div
                  key={t.address}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {t.name || "Unknown"}
                      </span>
                      <Badge className={STANDARD_COLORS[t.standard] ?? "bg-gray-500/10 text-gray-600"}>
                        {t.standard}
                      </Badge>
                    </div>
                    <code className="block break-all font-mono text-xs text-muted-foreground">
                      {t.address}
                    </code>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(t.viewedAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {recentTransfers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ArrowRightLeft className="h-4 w-4" />
              Recent Transfers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentTransfers.map((tx) => (
                <div
                  key={tx.hash}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {tx.amount} tokens
                      </span>
                      <Badge className={STANDARD_COLORS[tx.standard] ?? ""}>
                        {tx.standard}
                      </Badge>
                    </div>
                    <code className="block break-all font-mono text-xs text-muted-foreground">
                      {tx.hash}
                    </code>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(tx.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
