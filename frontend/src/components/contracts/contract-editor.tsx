"use client";

import { Code } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SAMPLE_COUNTER_SOL } from "@/types/contract";

interface ContractEditorProps {
  value: string;
  onChange: (value: string) => void;
  onCompile: () => void;
  isCompiling: boolean;
}

export function ContractEditor({
  value,
  onChange,
  onCompile,
  isCompiling,
}: ContractEditorProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Code className="h-4 w-4" />
          Solidity Editor
        </CardTitle>
        <CardDescription>Write or paste Solidity source code</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter Solidity source code..."
          className="min-h-[300px] flex-1 font-mono text-sm"
          spellCheck={false}
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onChange(SAMPLE_COUNTER_SOL)}
            type="button"
          >
            Load Sample
          </Button>
          <Button
            onClick={onCompile}
            disabled={isCompiling || !value.trim()}
            size="sm"
            className="ml-auto"
          >
            {isCompiling ? "Compiling..." : "Compile"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
