"use client";

import { Clock, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import type { SecurityTimelineEntry, RiskLevel } from "../types";

interface SecurityTimelineProps {
  entries: SecurityTimelineEntry[];
}

const LEVEL_ICON: Record<RiskLevel, React.ElementType> = {
  low: CheckCircle,
  medium: Shield,
  high: AlertTriangle,
  critical: AlertTriangle,
};

const LEVEL_COLOR: Record<RiskLevel, string> = {
  low: "border-green-500/30 bg-green-500/5",
  medium: "border-yellow-500/30 bg-yellow-500/5",
  high: "border-orange-500/30 bg-orange-500/5",
  critical: "border-red-500/30 bg-red-500/5",
};

const LEVEL_DOT: Record<RiskLevel, string> = {
  low: "bg-green-500",
  medium: "bg-yellow-500",
  high: "bg-orange-500",
  critical: "bg-red-500",
};

export function SecurityTimeline({ entries }: SecurityTimelineProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          No security findings yet. Run an analysis to get started.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-1.5 text-sm font-semibold">
        <Clock className="h-4 w-4" />
        Security Timeline
      </h3>

      <div className="relative space-y-3 pl-4">
        <div className="absolute left-1.5 top-0 h-full w-0.5 bg-border" />

        {entries.map((entry) => {
          const Icon = LEVEL_ICON[entry.level];
          return (
            <div
              key={entry.id}
              className={`relative rounded-md border p-3 ${LEVEL_COLOR[entry.level]}`}
            >
              <div className={`absolute -left-2.5 top-3 h-2.5 w-2.5 rounded-full ${LEVEL_DOT[entry.level]}`} />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-3 w-3" />
                  <span className="text-xs font-medium">{entry.type.toUpperCase()}</span>
                  <code className="text-xs text-muted-foreground">{entry.targetAddress.slice(0, 10)}...</code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold">{entry.score}/100</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{entry.summary}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
