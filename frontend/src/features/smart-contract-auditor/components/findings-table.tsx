"use client";

import { cn } from "@/lib/utils";
import type { AuditFinding, AuditSeverity } from "../types";
import { SEVERITY_LABELS, CATEGORY_LABELS, SEVERITY_BORDER_COLORS } from "../types";

const SEVERITY_DOT: Record<AuditSeverity, string> = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-blue-500',
  informational: 'bg-gray-400',
};

export function FindingsTable({ findings }: { findings: AuditFinding[] }) {
  if (findings.length === 0) {
    return (
      <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
        No findings detected
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Severity</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Title</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Category</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {findings.map((finding) => (
              <tr
                key={finding.id}
                className={cn("border-b last:border-0", SEVERITY_BORDER_COLORS[finding.severity], "border-l-2")}
              >
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("h-2 w-2 rounded-full", SEVERITY_DOT[finding.severity])} />
                    <span className="text-xs font-medium">{SEVERITY_LABELS[finding.severity]}</span>
                  </div>
                </td>
                <td className="px-3 py-2">
                  <div>
                    <div className="font-medium">{finding.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{finding.description}</div>
                  </div>
                </td>
                <td className="px-3 py-2 text-xs text-muted-foreground">
                  {CATEGORY_LABELS[finding.category]}
                </td>
                <td className="px-3 py-2 font-mono text-xs">
                  {(finding.confidence * 100).toFixed(0)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
