"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PortfolioHealth } from "../types";
import { HEALTH_COLORS, HEALTH_BORDER_COLORS } from "../types";

interface PortfolioHealthCardProps {
  health: PortfolioHealth;
}

export function PortfolioHealthCard({ health }: PortfolioHealthCardProps) {
  const levelLabel = health.level.toUpperCase();
  const colorClass = HEALTH_COLORS[health.level];
  const borderClass = HEALTH_BORDER_COLORS[health.level];

  return (
    <Card className={borderClass}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Portfolio Health
        </CardTitle>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colorClass}`}>
          {levelLabel}
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold">{health.score}</span>
          <span className="text-sm text-muted-foreground mb-1">/100</span>
        </div>

        <p className="text-xs text-muted-foreground">{health.summary}</p>

        <div className="space-y-2">
          {health.factors.map((factor) => (
            <div key={factor.label}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">{factor.label}</span>
                <span>{factor.value}/{factor.max}</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    factor.impact === "positive"
                      ? "bg-green-500"
                      : factor.impact === "negative"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                  }`}
                  style={{ width: `${(factor.value / factor.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
