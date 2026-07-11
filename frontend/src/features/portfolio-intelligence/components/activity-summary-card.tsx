"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import type { ActivitySummary } from "../types";

interface ActivitySummaryCardProps {
  activity: ActivitySummary;
}

export function ActivitySummaryCard({ activity }: ActivitySummaryCardProps) {
  const stats = [
    { label: "Total Transactions", value: activity.totalTransactions },
    { label: "Active Days", value: activity.activeDays },
    { label: "Unique Contracts", value: activity.uniqueContracts },
    { label: "Unique Tokens", value: activity.uniqueTokens },
    { label: "Inbound", value: activity.inboundTransfers },
    { label: "Outbound", value: activity.outboundTransfers },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Activity Summary
        </CardTitle>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="text-lg font-bold">{s.value.toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t">
          <div className="text-xs text-muted-foreground">
            Avg Daily Transactions: <span className="font-medium text-foreground">{activity.avgDailyTransactions}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
