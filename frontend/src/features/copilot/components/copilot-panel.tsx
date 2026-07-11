"use client";

import { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopilotStore } from "../stores/copilot-store";
import { getWorkspaceSuggestions } from "../engine";
import type { CopilotContext, CopilotActionType, CopilotWorkspace, CopilotSeverity, CopilotCategory } from "../types";
import { WORKSPACE_LABELS, SEVERITY_COLORS } from "../types";
import { SuggestionCard } from "./suggestion-card";
import { FilterBar } from "./filter-bar";
import { QuickActionButtons } from "./quick-action-buttons";

interface CopilotPanelProps {
  context: CopilotContext;
  onAction?: (actionType: CopilotActionType, context: CopilotContext) => void;
}

export function CopilotPanel({ context, onAction }: CopilotPanelProps) {
  const {
    suggestions,
    setSuggestions,
    isAnalyzing,
    setIsAnalyzing,
    filterSeverity,
    filterCategory,
    setFilterSeverity,
    setFilterCategory,
  } = useCopilotStore();

  const analyze = useCallback(() => {
    setIsAnalyzing(true);
    try {
      const results = getWorkspaceSuggestions(context.workspace, context);
      setSuggestions(results);
    } finally {
      setIsAnalyzing(false);
    }
  }, [context, setSuggestions, setIsAnalyzing]);

  const filtered = suggestions.filter((s) => {
    if (filterSeverity && s.severity !== filterSeverity) return false;
    if (filterCategory && s.category !== filterCategory) return false;
    return true;
  });

  const counts = {
    critical: suggestions.filter((s) => s.severity === "critical").length,
    warning: suggestions.filter((s) => s.severity === "warning").length,
    suggestion: suggestions.filter((s) => s.severity === "suggestion").length,
    info: suggestions.filter((s) => s.severity === "info").length,
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-purple-500" />
            <CardTitle className="text-sm font-medium">
              Copilot - {WORKSPACE_LABELS[context.workspace]}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={analyze}
              disabled={isAnalyzing}
              className="h-7 px-2"
            >
              <RefreshCw className={`h-3 w-3 ${isAnalyzing ? "animate-spin" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSuggestions([])}
              className="h-7 px-2"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 text-xs">
            {counts.critical > 0 && (
              <Badge className={SEVERITY_COLORS.critical}>{counts.critical} Critical</Badge>
            )}
            {counts.warning > 0 && (
              <Badge className={SEVERITY_COLORS.warning}>{counts.warning} Warnings</Badge>
            )}
            {counts.suggestion > 0 && (
              <Badge className={SEVERITY_COLORS.suggestion}>{counts.suggestion} Suggestions</Badge>
            )}
            {counts.info > 0 && (
              <Badge className={SEVERITY_COLORS.info}>{counts.info} Info</Badge>
            )}
            {suggestions.length === 0 && !isAnalyzing && (
              <span className="text-muted-foreground">No suggestions yet. Click analyze.</span>
            )}
          </div>

          <QuickActionButtons
            workspace={context.workspace}
            onAction={(type) => onAction?.(type, context)}
            isDisabled={isAnalyzing}
          />

          <FilterBar
            filterSeverity={filterSeverity as CopilotSeverity | null}
            filterCategory={filterCategory as CopilotCategory | null}
            onSetFilterSeverity={(s) => setFilterSeverity(s as string | null)}
            onSetFilterCategory={(c) => setFilterCategory(c as string | null)}
          />
        </CardContent>
      </Card>

      {filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map((s) => (
            <SuggestionCard key={s.id} suggestion={s} />
          ))}
        </div>
      )}

      {isAnalyzing && suggestions.length === 0 && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      )}
    </div>
  );
}
