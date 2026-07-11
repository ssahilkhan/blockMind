"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BalanceCardProps {
  balance: string;
  network: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function BalanceCard({
  balance,
  network,
  onRefresh,
  isRefreshing,
}: BalanceCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Balance
        </CardTitle>
        {onRefresh && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Refresh balance"
          >
            <RefreshCw
              className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{balance}</div>
        <p className="text-xs text-muted-foreground">{network}</p>
      </CardContent>
    </Card>
  );
}
