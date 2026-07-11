"use client";

import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GasOptimization } from "../types";

const OPT_SEVERITY: Record<string, { label: string; color: string }> = {
  high: { label: 'High Impact', color: 'text-orange-500' },
  medium: { label: 'Medium Impact', color: 'text-yellow-500' },
  low: { label: 'Low Impact', color: 'text-blue-500' },
};

export function GasOptimizationPanel({ optimizations }: { optimizations: GasOptimization[] }) {
  if (optimizations.length === 0) {
    return (
      <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
        No gas optimizations found
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Gas Optimizations</h3>
        <span className="text-xs text-muted-foreground">{optimizations.length} found</span>
      </div>
      <div className="space-y-2">
        {optimizations.map((opt) => {
          const sev = OPT_SEVERITY[opt.severity] ?? OPT_SEVERITY.low;
          return (
            <div key={opt.id} className="rounded-md border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-yellow-500" />
                  <span className="text-sm font-medium">{opt.title}</span>
                </div>
                <span className={cn("text-xs font-medium", sev.color)}>{sev.label}</span>
              </div>
              <p className="text-xs text-muted-foreground">{opt.description}</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded bg-muted p-2">
                  <div className="text-[10px] font-medium text-muted-foreground mb-1">Current</div>
                  <code className="text-[11px] break-all">{opt.currentCode}</code>
                </div>
                <div className="rounded bg-green-500/5 p-2">
                  <div className="text-[10px] font-medium text-green-600 mb-1">Suggested</div>
                  <code className="text-[11px] break-all text-green-700">{opt.suggestedCode}</code>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Estimated savings: {opt.estimatedSavings}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
