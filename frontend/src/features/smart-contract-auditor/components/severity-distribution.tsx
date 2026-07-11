"use client";

import type { AuditSummary } from "../types";
import { SEVERITY_LABELS } from "../types";

const SEVERAGE_COLORS: Record<string, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-blue-500',
  informational: 'bg-gray-400',
};

export function SeverityDistribution({ summary }: { summary: AuditSummary }) {
  const items = [
    { label: SEVERITY_LABELS.critical, count: summary.criticalCount, color: SEVERAGE_COLORS.critical },
    { label: SEVERITY_LABELS.high, count: summary.highCount, color: SEVERAGE_COLORS.high },
    { label: SEVERITY_LABELS.medium, count: summary.mediumCount, color: SEVERAGE_COLORS.medium },
    { label: SEVERITY_LABELS.low, count: summary.lowCount, color: SEVERAGE_COLORS.low },
    { label: SEVERITY_LABELS.informational, count: summary.informationalCount, color: SEVERAGE_COLORS.informational },
  ];

  const total = summary.totalFindings;

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <h3 className="text-sm font-semibold">Severity Distribution</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
            <span className="text-xs text-muted-foreground w-24">{item.label}</span>
            <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full ${item.color} transition-all`}
                style={{ width: total > 0 ? `${(item.count / total) * 100}%` : '0%' }}
              />
            </div>
            <span className="text-xs font-mono w-6 text-right">{item.count}</span>
          </div>
        ))}
      </div>
      <div className="pt-1 text-xs text-muted-foreground">
        Total: {total} findings · {summary.totalGasOptimizations} gas optimizations
      </div>
    </div>
  );
}
