"use client";

import { Lightbulb, AlertTriangle, CheckCircle, Shield } from "lucide-react";
import type { RiskFinding } from "../types";

interface RecommendationPanelProps {
  recommendations: string[];
  findings: RiskFinding[];
}

export function RecommendationPanel({ recommendations, findings }: RecommendationPanelProps) {
  const criticalFindings = findings.filter(
    (f) => f.severity === "critical" || f.severity === "high",
  );

  return (
    <div className="space-y-4">
      {criticalFindings.length > 0 && (
        <div className="space-y-2">
          <h3 className="flex items-center gap-1.5 text-sm font-semibold text-orange-600">
            <AlertTriangle className="h-4 w-4" />
            Critical Findings
          </h3>
          {criticalFindings.map((f) => (
            <div key={f.id} className="rounded-md border border-orange-500/30 bg-orange-500/5 p-3 space-y-1">
              <p className="text-xs font-medium">{f.title}</p>
              <p className="text-xs text-muted-foreground">{f.description}</p>
              <div className="mt-2 rounded-md bg-background/50 p-2">
                <p className="text-xs font-medium text-muted-foreground">What does this mean?</p>
                <p className="text-xs">{f.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold">
          <Lightbulb className="h-4 w-4" />
          Recommendations
        </h3>
        {recommendations.length === 0 ? (
          <div className="flex items-center gap-2 rounded-md bg-green-500/10 p-3 text-xs text-green-600">
            <CheckCircle className="h-3 w-3" />
            No immediate actions required.
          </div>
        ) : (
          <ul className="space-y-1.5">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-xs">
                <Shield className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                {rec}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
