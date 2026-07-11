"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Copy, Check } from "lucide-react";
import type { AILevel } from "@/features/ai/types";

interface AISummaryCardProps {
  summary: string;
  isGenerating: boolean;
  level: AILevel;
  onToggleLevel: (level: AILevel) => void;
  onRefresh: () => void;
}

export function AISummaryCard({
  summary,
  isGenerating,
  level,
  onToggleLevel,
  onRefresh,
}: AISummaryCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!summary) return;
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-purple-500" />
          <CardTitle className="text-sm font-medium">AI Portfolio Summary</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleLevel(level === "beginner" ? "developer" : "beginner")}
            className="text-xs px-2 py-0.5 rounded border border-border hover:bg-muted transition-colors"
          >
            {level === "beginner" ? "Beginner" : "Developer"}
          </button>
          <Button variant="ghost" size="sm" onClick={onRefresh} disabled={isGenerating} className="h-7 px-2">
            {isGenerating ? "Generating..." : "Refresh"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isGenerating && !summary ? (
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded w-full animate-pulse" />
            <div className="h-3 bg-muted rounded w-4/5 animate-pulse" />
            <div className="h-3 bg-muted rounded w-3/5 animate-pulse" />
          </div>
        ) : summary ? (
          <div className="space-y-3">
            <div className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
              {summary}
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCopy}
                className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            Click Refresh to generate an AI analysis of this portfolio.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
