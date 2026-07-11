"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle, FileCode2, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { parseAbi, functionSignature, type AbiFunction, type AbiEvent } from "@/types/contract";
import type { CompiledContract } from "@/types/contract";

interface CompileCardProps {
  result: CompiledContract | null;
  errors: string[];
}

export function CompileCard({ result, errors }: CompileCardProps) {
  const [copied, setCopied] = useState(false);

  if (!result && errors.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileCode2 className="h-4 w-4" />
            Compilation Result
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-4 text-center text-sm text-muted-foreground">
            Compile Solidity code to see results.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (errors.length > 0 && !result) {
    return (
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Compilation Errors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {errors.map((err, i) => (
              <div key={i} className="rounded-md bg-destructive/10 p-3">
                <p className="text-sm text-destructive font-mono">{err}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) return null;

  const parsed = parseAbi(result.abi);
  const bytecodeSize = (result.bytecode.length - 2) / 2;

  const handleCopyAbi = () => {
    navigator.clipboard.writeText(JSON.stringify(result.abi, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileCode2 className="h-4 w-4" />
            {result.contractName}
          </CardTitle>
          <Badge variant="default">Compiled</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {result.warnings && result.warnings.length > 0 && (
          <div className="space-y-1">
            {result.warnings.map((w, i) => (
              <div key={i} className="rounded-md bg-yellow-500/10 p-2">
                <p className="text-xs text-yellow-600">{w}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Bytecode Size</p>
            <p className="font-mono">{bytecodeSize.toLocaleString()} bytes</p>
          </div>
          {result.compilerVersion && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Compiler</p>
              <p className="font-mono text-xs">{result.compilerVersion}</p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">ABI</p>
            <Button variant="ghost" size="sm" onClick={handleCopyAbi}>
              <Copy className="mr-1 h-3 w-3" />
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <pre className="max-h-40 overflow-auto rounded-md bg-muted p-3 text-xs font-mono">
            {JSON.stringify(result.abi, null, 2)}
          </pre>
        </div>

        {parsed.readFunctions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Read Functions</p>
            <div className="space-y-1">
              {parsed.readFunctions.map((fn: AbiFunction) => (
                <div key={fn.name} className="rounded-md bg-muted/50 px-3 py-1.5 font-mono text-xs">
                  {functionSignature(fn)}
                </div>
              ))}
            </div>
          </div>
        )}

        {parsed.writeFunctions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Write Functions</p>
            <div className="space-y-1">
              {parsed.writeFunctions.map((fn: AbiFunction) => (
                <div key={fn.name} className="rounded-md bg-muted/50 px-3 py-1.5 font-mono text-xs">
                  {functionSignature(fn)}
                </div>
              ))}
            </div>
          </div>
        )}

        {parsed.events.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Events</p>
            <div className="space-y-1">
              {parsed.events.map((ev: AbiEvent) => (
                <div key={ev.name} className="rounded-md bg-muted/50 px-3 py-1.5 font-mono text-xs">
                  {ev.name}({ev.inputs.map((i) => `${i.type} ${i.name}`).join(", ")})
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
