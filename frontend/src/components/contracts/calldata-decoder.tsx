"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Unlock, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { decodeSchema, type DecodeInput } from "@/lib/validators/contract";
import { contractApi } from "@/services/contract";
import type { DecodeFunctionResult } from "@/types/contract";

interface CalldataDecoderProps {
  abi?: unknown[];
}

export function CalldataDecoder({ abi }: CalldataDecoderProps) {
  const [decoded, setDecoded] = useState<DecodeFunctionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DecodeInput>({
    resolver: zodResolver(decodeSchema),
  });

  const onSubmit = async (data: DecodeInput) => {
    setLoading(true);
    setError(null);
    setDecoded(null);
    try {
      if (!abi) {
        setError("ABI is required. Load a contract first.");
        setLoading(false);
        return;
      }
      const res = await contractApi.decode({ abi, data: data.data });
      setDecoded(res as unknown as DecodeFunctionResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Decoding failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Unlock className="h-4 w-4" />
          ABI Decoder
        </CardTitle>
        <CardDescription>Decode raw calldata to identify function and parameters</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="dec-data">Raw Calldata</Label>
            <Input
              id="dec-data"
              placeholder="0x6d4ce63c..."
              {...register("data")}
            />
            {errors.data && (
              <p className="text-xs text-destructive">{errors.data.message}</p>
            )}
          </div>

          <Button type="submit" disabled={loading} size="sm">
            {loading ? (
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            ) : (
              <Unlock className="mr-1 h-3 w-3" />
            )}
            Decode
          </Button>
        </form>

        {error && (
          <div className="mt-3 rounded-md bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {decoded && (
          <div className="mt-4 space-y-3">
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Function</p>
              <p className="font-mono text-sm">{decoded.signature}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Parameters</p>
              <div className="space-y-1">
                {Object.entries(decoded.args).map(([key, value]) => (
                  <div key={key} className="flex gap-2 text-xs">
                    <span className="font-medium text-muted-foreground">{key}:</span>
                    <span className="break-all font-mono">
                      {typeof value === "bigint" ? value.toString() : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
