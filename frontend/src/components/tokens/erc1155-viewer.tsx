"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Layers, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { tokenApi } from "@/services/token";

const ETH_ADDRESS = /^0x[0-9a-fA-F]{40}$/;

const erc1155Schema = z.object({
  walletAddress: z
    .string()
    .min(1, "Wallet address is required")
    .regex(ETH_ADDRESS, "Invalid address"),
  tokenId: z
    .string()
    .min(1, "Token ID is required")
    .regex(/^\d+$/, "Must be numeric"),
});

type ERC1155Form = z.infer<typeof erc1155Schema>;

interface ERC1155ViewerProps {
  tokenAddress: string | null;
}

export function ERC1155Viewer({ tokenAddress }: ERC1155ViewerProps) {
  const [balance, setBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ERC1155Form>({
    resolver: zodResolver(erc1155Schema),
  });

  const onSubmit = async (data: ERC1155Form) => {
    if (!tokenAddress) return;
    setLoading(true);
    setError(null);
    setBalance(null);
    try {
      const res = await tokenApi.getBalance(tokenAddress, data.walletAddress);
      setBalance(res.balance);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Balance lookup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Layers className="h-4 w-4" />
          ERC-1155 Explorer
        </CardTitle>
        <CardDescription>Check balances for multi-token assets</CardDescription>
      </CardHeader>
      <CardContent>
        {!tokenAddress ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Detect an ERC-1155 token first.
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="erc1155-wallet">Wallet Address</Label>
              <Input id="erc1155-wallet" placeholder="0x..." {...register("walletAddress")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="erc1155-tokenId">Token ID</Label>
              <Input id="erc1155-tokenId" placeholder="0" {...register("tokenId")} />
              {errors.tokenId && (
                <p className="text-xs text-destructive">{errors.tokenId.message}</p>
              )}
            </div>
            <Button type="submit" disabled={loading} size="sm">
              {loading ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <Layers className="mr-1 h-3 w-3" />
              )}
              Check Balance
            </Button>
          </form>
        )}

        {error && (
          <div className="mt-3 rounded-md bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {balance !== null && (
          <div className="mt-3 space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Balance</p>
            <p className="text-lg font-bold font-mono">{balance}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
