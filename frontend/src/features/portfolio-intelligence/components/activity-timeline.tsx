"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, ArrowRight, Flame, Coins, Image } from "lucide-react";
import type { PortfolioTrend } from "../types";
import { TREND_COLORS } from "../types";

interface ActivityTimelineProps {
  trend: PortfolioTrend | undefined;
}

function TrendIcon({ direction }: { direction: PortfolioTrend["direction"] }) {
  switch (direction) {
    case "up":
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    case "down":
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    default:
      return <Minus className="h-4 w-4 text-muted-foreground" />;
  }
}

export function ActivityTimeline({ trend }: ActivityTimelineProps) {
  if (!trend) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground py-8">
          No activity data available.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Activity Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <TrendIcon direction={trend.direction} />
            <span className={TREND_COLORS[trend.direction]}>
              {trend.direction === "up" ? "Increasing" : trend.direction === "down" ? "Decreasing" : "Stable"}
            </span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">{trend.transferFrequency} transfers/{trend.timeframe}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <Coins className="h-4 w-4 mx-auto mb-1 text-blue-500" />
            <div className="text-lg font-bold">{trend.newTokensReceived}</div>
            <div className="text-xs text-muted-foreground">New Tokens</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <Image className="h-4 w-4 mx-auto mb-1 text-purple-500" />
            <div className="text-lg font-bold">{trend.newNFTsReceived}</div>
            <div className="text-xs text-muted-foreground">New NFTs</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/50">
            <Flame className="h-4 w-4 mx-auto mb-1 text-orange-500" />
            <div className={`text-lg font-bold ${TREND_COLORS[trend.gasSpendingTrend]}`}>
              {trend.gasSpendingTrend === "up" ? "↑" : trend.gasSpendingTrend === "down" ? "↓" : "→"}
            </div>
            <div className="text-xs text-muted-foreground">Gas Trend</div>
          </div>
        </div>

        <div className="space-y-1">
          {trend.dataPoints.slice(-3).map((dp) => (
            <div key={dp.label} className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{dp.label}</span>
              <span>{dp.transactions} tx · {dp.transfers} transfers</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
