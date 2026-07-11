"use client";

import { RISK_COLORS } from "../types";
import type { RiskScore as RiskScoreType } from "../types";

interface RiskScoreCardProps {
  score: RiskScoreType;
  title: string;
  subtitle?: string;
}

function getScoreRingColor(level: string): string {
  switch (level) {
    case "low":
      return "stroke-green-500";
    case "medium":
      return "stroke-yellow-500";
    case "high":
      return "stroke-orange-500";
    case "critical":
      return "stroke-red-500";
    default:
      return "stroke-gray-500";
  }
}

export function RiskScoreCard({ score, title, subtitle }: RiskScoreCardProps) {
  const colorClass = RISK_COLORS[score.level];
  const ringColor = getScoreRingColor(score.level);
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (score.score / 100) * circumference;

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20">
          <svg className="h-20 w-20 -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="currentColor"
              className="text-muted/30"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              className={ringColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold">{score.score}</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${colorClass}`}>
            {score.level.toUpperCase()}
          </span>
          <p className="text-xs text-muted-foreground">
            {score.findings.length} finding(s)
          </p>
        </div>
      </div>
    </div>
  );
}
