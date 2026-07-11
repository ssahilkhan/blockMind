"use client";

import { AlertTriangle, AlertCircle, Info, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AuditRecommendation } from "../types";
import { CATEGORY_LABELS } from "../types";

const PRIORITY_CONFIG: Record<string, { icon: typeof AlertTriangle; color: string; bg: string }> = {
  critical: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
  high: { icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  medium: { icon: Info, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  low: { icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
};

export function RecommendationsPanel({ recommendations }: { recommendations: AuditRecommendation[] }) {
  if (recommendations.length === 0) {
    return (
      <div className="rounded-lg border p-4 text-center text-sm text-muted-foreground">
        No recommendations
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <h3 className="text-sm font-semibold">Recommendations</h3>
      <div className="space-y-2">
        {recommendations.map((rec) => {
          const config = PRIORITY_CONFIG[rec.priority] ?? PRIORITY_CONFIG.low;
          const Icon = config.icon;
          return (
            <div key={rec.id} className={cn("rounded-md p-3 border-l-2", config.bg, `border-l-${rec.priority === 'critical' ? 'red' : rec.priority === 'high' ? 'orange' : rec.priority === 'medium' ? 'yellow' : 'blue'}-500`)}>
              <div className="flex items-start gap-2">
                <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", config.color)} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{rec.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{rec.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {CATEGORY_LABELS[rec.category]}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
