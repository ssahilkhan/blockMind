"use client";

import { Lightbulb, Shield, Zap, Code2, Sparkles } from "lucide-react";
import type { QuickAction } from "../types";

interface QuickActionsProps {
  onAction: (action: QuickAction) => void;
  disabled: boolean;
}

const ACTIONS: Array<{ id: QuickAction; label: string; icon: React.ElementType }> = [
  { id: "explain", label: "Explain", icon: Lightbulb },
  { id: "summarize", label: "Summarize", icon: Sparkles },
  { id: "risks", label: "Find Risks", icon: Shield },
  { id: "simplify", label: "Simplify", icon: Zap },
  { id: "developer", label: "Developer Mode", icon: Code2 },
];

export function QuickActions({ onAction, disabled }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {ACTIONS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onAction(id)}
          disabled={disabled}
          className="flex items-center gap-1 rounded-md border bg-background px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
        >
          <Icon className="h-3 w-3" />
          {label}
        </button>
      ))}
    </div>
  );
}
