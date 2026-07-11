"use client";

import { useAIStore } from "../stores/ai-store";
import type { AILevel } from "../types";

export function LevelToggle() {
  const level = useAIStore((s) => s.level);
  const setLevel = useAIStore((s) => s.setLevel);

  const options: Array<{ id: AILevel; label: string }> = [
    { id: "beginner", label: "Beginner" },
    { id: "developer", label: "Developer" },
  ];

  return (
    <div className="flex items-center gap-1 rounded-md border p-0.5">
      {options.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => setLevel(id)}
          className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
            level === id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
