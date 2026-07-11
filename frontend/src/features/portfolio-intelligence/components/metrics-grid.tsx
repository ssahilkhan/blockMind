"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PortfolioMetric } from "../types";

interface MetricsGridProps {
  metrics: PortfolioMetric[];
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  if (metrics.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-sm text-muted-foreground">
          No metrics available.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
      {metrics.map((m) => (
        <Card key={m.id}>
          <CardContent className="pt-4 pb-3">
            <div className="text-xs text-muted-foreground mb-1">{m.label}</div>
            <div className="text-xl font-bold">
              {typeof m.value === "number" ? m.value.toLocaleString() : m.value}
              {m.unit && <span className="text-xs text-muted-foreground ml-1">{m.unit}</span>}
            </div>
            {m.changePercent !== undefined && (
              <div
                className={`text-xs mt-1 ${
                  m.changePercent > 0
                    ? "text-green-600"
                    : m.changePercent < 0
                      ? "text-red-600"
                      : "text-muted-foreground"
                }`}
              >
                {m.changePercent > 0 ? "+" : ""}{m.changePercent}%
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
