"use client";

import { Radio, FileCode2, Wallet, Coins, Activity, Briefcase } from "lucide-react";
import type { AIMode } from "../types";
import { useAIStore } from "../stores/ai-store";

const MODE_OPTIONS: Array<{ id: AIMode; label: string; icon: React.ElementType }> = [
  { id: "transaction", label: "Transaction", icon: Radio },
  { id: "contract", label: "Contract", icon: FileCode2 },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "token", label: "Token", icon: Coins },
  { id: "event", label: "Event", icon: Activity },
];

export function ModeSelector() {
  const mode = useAIStore((s) => s.mode);
  const setMode = useAIStore((s) => s.setMode);
  const createConversation = useAIStore((s) => s.createConversation);

  const handleModeChange = (newMode: AIMode) => {
    setMode(newMode);
    createConversation(newMode);
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {MODE_OPTIONS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => handleModeChange(id)}
          className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
            mode === id
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          <Icon className="h-3 w-3" />
          {label}
        </button>
      ))}
    </div>
  );
}
