"use client";

import { BookOpen, FileCode2, Zap, ShieldCheck, ListChecks, FileText, ClipboardCheck } from "lucide-react";
import type { CopilotActionType, CopilotWorkspace } from "../types";
import { QUICK_ACTIONS } from "../types";

const ICON_MAP: Record<string, typeof BookOpen> = {
  BookOpen,
  FileCode2,
  Zap,
  ShieldCheck,
  ListChecks,
  FileText,
  ClipboardCheck,
};

interface QuickActionButtonsProps {
  workspace: CopilotWorkspace;
  onAction: (actionType: CopilotActionType) => void;
  isDisabled?: boolean;
}

export function QuickActionButtons({ workspace, onAction, isDisabled }: QuickActionButtonsProps) {
  const relevantActions = QUICK_ACTIONS.filter((a) => {
    if (workspace === "contract") return ["explain", "optimize", "review", "document", "audit"].includes(a.type);
    if (workspace === "transaction") return ["explain", "review", "summarize"].includes(a.type);
    if (workspace === "wallet") return ["explain", "review", "summarize"].includes(a.type);
    if (workspace === "token") return ["explain", "review", "document"].includes(a.type);
    return true;
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
      {relevantActions.map((action) => {
        const Icon = ICON_MAP[action.icon] ?? BookOpen;
        return (
          <button
            key={action.id}
            onClick={() => onAction(action.type)}
            disabled={isDisabled}
            className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-center disabled:opacity-50"
            title={action.description}
          >
            <Icon className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs font-medium">{action.label}</span>
          </button>
        );
      })}
    </div>
  );
}
