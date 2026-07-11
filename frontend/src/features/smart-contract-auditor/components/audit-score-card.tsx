"use client";

import { cn } from "@/lib/utils";
import type { AuditScore } from "../types";

const GRADE_COLORS: Record<string, string> = {
  'A+': 'text-green-600', 'A': 'text-green-500', 'A-': 'text-green-400',
  'B+': 'text-blue-500', 'B': 'text-blue-400', 'B-': 'text-blue-300',
  'C+': 'text-yellow-500', 'C': 'text-yellow-400', 'C-': 'text-orange-400',
  'D': 'text-orange-500', 'F': 'text-red-500',
};

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono">{value}/100</span>
      </div>
      <div className="h-2 rounded-full bg-muted">
        <div className={cn("h-2 rounded-full transition-all", color)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function AuditScoreCard({ score }: { score: AuditScore }) {
  return (
    <div className="rounded-lg border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Audit Score</h3>
        <div className="text-right">
          <div className={cn("text-3xl font-bold", GRADE_COLORS[score.grade] ?? 'text-muted-foreground')}>
            {score.grade}
          </div>
          <div className="text-xs text-muted-foreground">{score.overall}/100</div>
        </div>
      </div>
      <div className="space-y-2">
        <ScoreBar label="Security" value={score.security} />
        <ScoreBar label="Gas Efficiency" value={score.gasEfficiency} />
        <ScoreBar label="Code Quality" value={score.codeQuality} />
        <ScoreBar label="Documentation" value={score.documentation} />
      </div>
    </div>
  );
}
