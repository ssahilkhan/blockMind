"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { encodeSchema, type EncodeInput } from "@/lib/validators/contract";
import { contractApi } from "@/services/contract";
import { parseAbi, type AbiFunction } from "@/types/contract";

interface CalldataEncoderProps {
  abi?: unknown[];
}

export function CalldataEncoder({ abi }: CalldataEncoderProps) {
  const [encoded, setEncoded] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [functions, setFunctions] = useState<AbiFunction[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EncodeInput>({
    resolver: zodResolver(encodeSchema),
  });

  const handleAbiChange = (value: string) => {
    try {
      const parsed = JSON.parse(value);
      setFunctions(parseAbi(parsed).functions);
    } catch {
      setFunctions([]);
    }
  };

  const onSubmit = async (data: EncodeInput) => {
    setLoading(true);
    setError(null);
    setEncoded(null);
    try {
      if (!abi) {
        setError("ABI is required. Load a contract first.");
        setLoading(false);
        return;
      }
      let args: unknown[] = [];
      if (data.args?.trim()) {
        args = JSON.parse(data.args);
      }
      const res = await contractApi.encode({
        abi,
        functionName: data.functionName,
        args,
      });
      setEncoded(res.encoded);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Encoding failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Lock className="h-4 w-4" />
          ABI Encoder
        </CardTitle>
        <CardDescription>Encode function calldata</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="enc-fn">Function Name</Label>
            <Input
              id="enc-fn"
              placeholder="increment, transfer, etc."
              {...register("functionName")}
              list="encoder-functions"
            />
            {functions.length > 0 && (
              <datalist id="encoder-functions">
                {functions.map((fn) => (
                  <option key={fn.name} value={fn.name} />
                ))}
              </datalist>
            )}
            {errors.functionName && (
              <p className="text-xs text-destructive">{errors.functionName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="enc-args">Arguments (JSON array)</Label>
            <Input
              id="enc-args"
              placeholder='[1, "hello"]'
              {...register("args")}
            />
          </div>

          <Button type="submit" disabled={loading} size="sm">
            {loading ? (
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            ) : (
              <Lock className="mr-1 h-3 w-3" />
            )}
            Encode
          </Button>
        </form>

        {error && (
          <div className="mt-3 rounded-md bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {encoded && (
          <div className="mt-3 space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Encoded Calldata</p>
            <pre className="max-h-32 overflow-auto break-all rounded-md bg-muted p-3 text-xs font-mono">
              {encoded}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
