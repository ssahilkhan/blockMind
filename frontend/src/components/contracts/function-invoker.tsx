"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Play, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  readFunctionSchema,
  writeFunctionSchema,
  type ReadFunctionInput,
  type WriteFunctionInput,
} from "@/lib/validators/contract";
import { contractApi } from "@/services/contract";
import type { AbiFunction } from "@/types/contract";

interface FunctionInvokerProps {
  fn: AbiFunction;
  abi: unknown[];
  contractAddress: string;
}

function parseArgs(argsStr?: string): unknown[] {
  if (!argsStr?.trim()) return [];
  try {
    return JSON.parse(argsStr);
  } catch {
    throw new Error("Invalid JSON in arguments");
  }
}

function ReadForm({
  fn,
  abi,
  contractAddress,
}: {
  fn: AbiFunction;
  abi: unknown[];
  contractAddress: string;
}) {
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReadFunctionInput>({
    resolver: zodResolver(readFunctionSchema),
  });

  const onSubmit = async (data: ReadFunctionInput) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const args = parseArgs(data.args);
      const res = await contractApi.read({
        contractAddress,
        abi,
        functionName: fn.name,
        args,
      });
      setResult(res.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Read failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {fn.inputs.length > 0 && (
          <div className="space-y-2">
            <Label>Arguments (JSON array)</Label>
            {fn.inputs.map((input, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-32 shrink-0 truncate font-mono text-xs text-muted-foreground">
                  {input.name || `arg${idx}`}: {input.type}
                </span>
              </div>
            ))}
            <Input placeholder='["0x...", 100, true]' {...register("args")} />
            {errors.args && (
              <p className="text-xs text-destructive">{errors.args.message}</p>
            )}
          </div>
        )}
        <Button type="submit" disabled={loading} size="sm">
          {loading ? (
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          ) : (
            <Play className="mr-1 h-3 w-3" />
          )}
          Read
        </Button>
      </form>

      {error && (
        <div className="mt-3 rounded-md bg-destructive/10 p-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {result !== null && (
        <div className="mt-3 space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Result</p>
          <pre className="max-h-40 overflow-auto rounded-md bg-muted p-3 text-xs font-mono">
            {typeof result === "object"
              ? JSON.stringify(
                  result,
                  (_, v) => (typeof v === "bigint" ? v.toString() : v),
                  2,
                )
              : String(result)}
          </pre>
        </div>
      )}
    </>
  );
}

function WriteForm({
  fn,
  abi,
  contractAddress,
}: {
  fn: AbiFunction;
  abi: unknown[];
  contractAddress: string;
}) {
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WriteFunctionInput>({
    resolver: zodResolver(writeFunctionSchema),
  });

  const onSubmit = async (data: WriteFunctionInput) => {
    setLoading(true);
    setError(null);
    setTxHash(null);
    try {
      const args = parseArgs(data.args);
      const res = await contractApi.write({
        contractAddress,
        abi,
        functionName: fn.name,
        args,
        privateKey: data.privateKey,
      });
      setTxHash(res.transactionHash);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Write failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {fn.inputs.length > 0 && (
          <div className="space-y-2">
            <Label>Arguments (JSON array)</Label>
            {fn.inputs.map((input, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-32 shrink-0 truncate font-mono text-xs text-muted-foreground">
                  {input.name || `arg${idx}`}: {input.type}
                </span>
              </div>
            ))}
            <Input placeholder='["0x...", 100, true]' {...register("args")} />
            {errors.args && (
              <p className="text-xs text-destructive">{errors.args.message}</p>
            )}
          </div>
        )}

        <div className="space-y-1.5">
          <Label>Private Key</Label>
          <Input
            type="password"
            placeholder="0x..."
            {...register("privateKey")}
          />
          {errors.privateKey && (
            <p className="text-xs text-destructive">{errors.privateKey.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Value in ETH (optional)</Label>
          <Input placeholder="0" {...register("value")} />
        </div>

        <Button type="submit" disabled={loading} size="sm">
          {loading ? (
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
          ) : (
            <Play className="mr-1 h-3 w-3" />
          )}
          Execute
        </Button>
      </form>

      {error && (
        <div className="mt-3 rounded-md bg-destructive/10 p-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {txHash && (
        <div className="mt-3 space-y-1">
          <p className="text-xs font-medium text-green-600">Transaction Sent</p>
          <code className="block break-all rounded bg-muted p-2 text-xs font-mono">
            {txHash}
          </code>
        </div>
      )}
    </>
  );
}

export function FunctionInvoker({ fn, abi, contractAddress }: FunctionInvokerProps) {
  const isRead = fn.stateMutability === "view" || fn.stateMutability === "pure";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Play className="h-4 w-4" />
          {fn.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isRead ? (
          <ReadForm fn={fn} abi={abi} contractAddress={contractAddress} />
        ) : (
          <WriteForm fn={fn} abi={abi} contractAddress={contractAddress} />
        )}
      </CardContent>
    </Card>
  );
}
