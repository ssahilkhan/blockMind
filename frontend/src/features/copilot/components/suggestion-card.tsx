"use client";

import { AlertTriangle, Info, Lightbulb, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { CopilotSuggestion, CopilotSeverity } from "../types";
import { SEVERITY_COLORS, SEVERITY_BORDER_COLORS, CATEGORY_LABELS } from "../types";

const SEVERITY_ICONS: Record<CopilotSeverity, typeof Info> = {
  info: Info,
  suggestion: Lightbulb,
  warning: AlertTriangle,
  critical: ShieldAlert,
};

interface SuggestionCardProps {
  suggestion: CopilotSuggestion;
  onSelect?: (suggestion: CopilotSuggestion) => void;
}

export function SuggestionCard({ suggestion, onSelect }: SuggestionCardProps) {
  const Icon = SEVERITY_ICONS[suggestion.severity];
  const colorClass = SEVERITY_COLORS[suggestion.severity];
  const borderClass = SEVERITY_BORDER_COLORS[suggestion.severity];

  return (
    <Card
      className={`${borderClass} cursor-pointer hover:bg-muted/50 transition-colors`}
      onClick={() => onSelect?.(suggestion)}
    >
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start gap-2">
          <div className={`p-1 rounded ${colorClass}`}>
            <Icon className="h-3.5 w-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium truncate">{suggestion.title}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${colorClass}`}>
                {suggestion.severity.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
              {suggestion.description}
            </p>
          </div>
        </div>
        {suggestion.details && (
          <div className="text-xs text-muted-foreground bg-muted/50 rounded p-2 ml-6 line-clamp-3">
            {suggestion.details}
          </div>
        )}
        <div className="flex items-center gap-2 ml-6 text-[10px] text-muted-foreground">
          <span className="px-1.5 py-0.5 rounded bg-muted">
            {CATEGORY_LABELS[suggestion.category]}
          </span>
          <span>{suggestion.source}</span>
        </div>
      </CardContent>
    </Card>
  );
}
