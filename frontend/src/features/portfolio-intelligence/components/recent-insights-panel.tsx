"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Info, Bell } from "lucide-react";
import type { PortfolioInsight } from "../types";

interface RecentInsightsPanelProps {
  insights: PortfolioInsight[];
}

const SEVERITY_ICONS: Record<PortfolioInsight["severity"], typeof Info> = {
  info: Info,
  warning: AlertTriangle,
  alert: Bell,
};

const SEVERITY_COLORS: Record<PortfolioInsight["severity"], string> = {
  info: "text-blue-500",
  warning: "text-yellow-500",
  alert: "text-red-500",
};

export function RecentInsightsPanel({ insights }: RecentInsightsPanelProps) {
  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Recent Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground py-8">
          No insights generated yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Recent Insights ({insights.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight) => {
          const Icon = SEVERITY_ICONS[insight.severity];
          return (
            <div
              key={insight.id}
              className="p-3 rounded-lg border border-border bg-card space-y-1"
            >
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 shrink-0 ${SEVERITY_COLORS[insight.severity]}`} />
                <span className="text-sm font-medium flex-1">{insight.title}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {insight.category}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {insight.description}
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
