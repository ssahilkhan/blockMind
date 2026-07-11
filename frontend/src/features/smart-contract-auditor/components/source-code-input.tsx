"use client";

import { useState } from "react";
import { Play, FileCode2, Loader2 } from "lucide-react";
import { SAMPLE_COUNTER_SOL } from "@/types/contract";
import { cn } from "@/lib/utils";

interface SourceCodeInputProps {
  onAudit: (sourceCode: string, contractName: string) => void;
  isRunning: boolean;
}

export function SourceCodeInput({ onAudit, isRunning }: SourceCodeInputProps) {
  const [sourceCode, setSourceCode] = useState('');
  const [contractName, setContractName] = useState('');

  const handleAudit = () => {
    if (!sourceCode.trim()) return;
    const name = contractName.trim() || extractContractName(sourceCode) || 'UnknownContract';
    onAudit(sourceCode, name);
  };

  const loadSample = () => {
    setSourceCode(SAMPLE_COUNTER_SOL);
    setContractName('Counter');
  };

  return (
    <div className="rounded-lg border p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCode2 className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Smart Contract Source</h3>
        </div>
        <button
          onClick={loadSample}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Load Sample
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Contract name (auto-detected if empty)"
          value={contractName}
          onChange={(e) => setContractName(e.target.value)}
          className="flex-1 rounded-md border bg-background px-3 py-1.5 text-sm"
        />
      </div>

      <textarea
        placeholder="Paste your Solidity source code here..."
        value={sourceCode}
        onChange={(e) => setSourceCode(e.target.value)}
        className={cn(
          "w-full rounded-md border bg-background px-3 py-2 font-mono text-xs",
          "min-h-[300px] resize-y",
        )}
        spellCheck={false}
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {sourceCode.length > 0 ? `${sourceCode.split('\n').length} lines` : 'No source code'}
        </span>
        <button
          onClick={handleAudit}
          disabled={!sourceCode.trim() || isRunning}
          className={cn(
            "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
            sourceCode.trim() && !isRunning
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "bg-muted text-muted-foreground cursor-not-allowed",
          )}
        >
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Running Audit...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Run Audit
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function extractContractName(source: string): string | null {
  const match = source.match(/contract\s+(\w+)/);
  return match?.[1] ?? null;
}
