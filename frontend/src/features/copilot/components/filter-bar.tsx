"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import type { CopilotSeverity, CopilotCategory } from "../types";
import { SEVERITY_COLORS, CATEGORY_LABELS } from "../types";

interface FilterBarProps {
  filterSeverity: CopilotSeverity | null;
  filterCategory: CopilotCategory | null;
  onSetFilterSeverity: (s: CopilotSeverity | null) => void;
  onSetFilterCategory: (c: CopilotCategory | null) => void;
}

const SEVERITY_OPTIONS: CopilotSeverity[] = ["critical", "warning", "suggestion", "info"];
const CATEGORY_OPTIONS: CopilotCategory[] = ["security", "gas", "best-practice", "optimization", "review", "documentation"];

export function FilterBar({
  filterSeverity,
  filterCategory,
  onSetFilterSeverity,
  onSetFilterCategory,
}: FilterBarProps) {
  const hasFilter = filterSeverity !== null || filterCategory !== null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Filter className="h-3 w-3" />
        <span>Filters</span>
        {hasFilter && (
          <button
            onClick={() => {
              onSetFilterSeverity(null);
              onSetFilterCategory(null);
            }}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-1">
        {SEVERITY_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSetFilterSeverity(filterSeverity === s ? null : s)}
            className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
              filterSeverity === s
                ? SEVERITY_COLORS[s]
                : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1">
        {CATEGORY_OPTIONS.map((c) => (
          <button
            key={c}
            onClick={() => onSetFilterCategory(filterCategory === c ? null : c)}
            className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
              filterCategory === c
                ? "bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>
    </div>
  );
}
