"use client";

import { Eye, Edit3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { parseAbi, functionSignature, type AbiFunction, type AbiEvent } from "@/types/contract";

interface FunctionListProps {
  abi: unknown[];
  onSelectFunction: (fn: AbiFunction) => void;
  selectedName: string | null;
}

export function FunctionList({ abi, onSelectFunction, selectedName }: FunctionListProps) {
  const parsed = parseAbi(abi);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Contract Functions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {parsed.readFunctions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">Read</p>
              <Badge variant="secondary" className="text-[10px]">
                {parsed.readFunctions.length}
              </Badge>
            </div>
            <div className="space-y-1">
              {parsed.readFunctions.map((fn) => (
                <Button
                  key={fn.name}
                  variant={selectedName === fn.name ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start font-mono text-xs"
                  onClick={() => onSelectFunction(fn)}
                >
                  {fn.name}({fn.inputs.map((i) => i.type).join(", ")})
                </Button>
              ))}
            </div>
          </div>
        )}

        {parsed.writeFunctions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Edit3 className="h-3.5 w-3.5 text-muted-foreground" />
              <p className="text-xs font-medium text-muted-foreground">Write</p>
              <Badge variant="secondary" className="text-[10px]">
                {parsed.writeFunctions.length}
              </Badge>
            </div>
            <div className="space-y-1">
              {parsed.writeFunctions.map((fn) => (
                <Button
                  key={fn.name}
                  variant={selectedName === fn.name ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start font-mono text-xs"
                  onClick={() => onSelectFunction(fn)}
                >
                  {fn.name}({fn.inputs.map((i) => i.type).join(", ")})
                </Button>
              ))}
            </div>
          </div>
        )}

        {parsed.events.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Events</p>
            <div className="space-y-1">
              {parsed.events.map((ev) => (
                <div
                  key={ev.name}
                  className="rounded-md bg-muted/50 px-3 py-1.5 font-mono text-xs text-muted-foreground"
                >
                  {functionSignature({ ...ev, type: "function", outputs: [], stateMutability: "nonpayable" } as AbiFunction)}
                </div>
              ))}
            </div>
          </div>
        )}

        {parsed.functions.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No functions found in ABI.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
