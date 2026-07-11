"use client";

import { Brain, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { AuditAISummary } from "../types";

export function AISummaryPanel({ aiSummary }: { aiSummary: AuditAISummary | undefined }) {
  const [expanded, setExpanded] = useState(true);

  if (!aiSummary) {
    return (
      <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
        <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
        AI summary not available. Enable AI analysis to get an AI-powered audit summary.
      </div>
    );
  }

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-purple-500" />
          <h3 className="text-sm font-semibold">AI Analysis</h3>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {expanded && (
        <div className="space-y-4">
          <Section title="Executive Summary" content={aiSummary.executiveSummary} />
          <Section title="Technical Summary" content={aiSummary.technicalSummary} />
          <Section title="For Beginners" content={aiSummary.beginnerExplanation} accent />
          <Section title="For Developers" content={aiSummary.developerExplanation} />

          {aiSummary.keyRisks.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-1">Key Risks</h4>
              <ul className="space-y-1">
                {aiSummary.keyRisks.map((risk, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="text-red-500 mt-0.5">•</span>
                    {risk}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {aiSummary.mitigations.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground mb-1">Mitigations</h4>
              <ul className="space-y-1">
                {aiSummary.mitigations.map((mit, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="text-green-500 mt-0.5">•</span>
                    {mit}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Section({ title, content, accent }: { title: string; content: string; accent?: boolean }) {
  return (
    <div>
      <h4 className="text-xs font-semibold text-muted-foreground mb-1">{title}</h4>
      <p className={cn("text-xs leading-relaxed", accent ? "bg-purple-500/5 rounded p-2 border border-purple-500/20" : "text-muted-foreground")}>
        {content}
      </p>
    </div>
  );
}
