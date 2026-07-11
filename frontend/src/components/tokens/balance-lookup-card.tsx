"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Wallet, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { balanceLookupSchema, type BalanceLookupInput } from "@/lib/validators/token";
import { tokenApi } from "@/services/token";

interface BalanceLookupCardProps {
  tokenAddress: string | null;
  standard: string | null;
}

export function BalanceLookupCard({ tokenAddress, standard }: BalanceLookupCardProps) {
  const [balance, setBalance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isERC1155 = standard === "ERC1155";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BalanceLookupInput>({
    resolver: zodResolver(balanceLookupSchema),
    defaultValues: { tokenAddress: tokenAddress ?? "" },
  });

  const onSubmit = async (data: BalanceLookupInput) => {
    setLoading(true);
    setError(null);
    setBalance(null);
    try {
      const addr = tokenAddress || data.tokenAddress;
      const res = await tokenApi.getBalance(
        addr,
        data.walletAddress,
      );
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
          <Wallet className="h-4 w-4" />
          Balance Lookup
        </CardTitle>
        <CardDescription>Check token balance for a wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {!tokenAddress && (
            <div className="space-y-1.5">
              <Label htmlFor="bal-token">Token Address</Label>
              <Input id="bal-token" placeholder="0x..." {...register("tokenAddress")} />
              {errors.tokenAddress && (
                <p className="text-xs text-destructive">{errors.tokenAddress.message}</p>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="bal-wallet">Wallet Address</Label>
            <Input id="bal-wallet" placeholder="0x..." {...register("walletAddress")} />
            {errors.walletAddress && (
              <p className="text-xs text-destructive">{errors.walletAddress.message}</p>
            )}
          </div>

          {isERC1155 && (
            <div className="space-y-1.5">
              <Label htmlFor="bal-tokenId">Token ID (required for ERC1155)</Label>
              <Input id="bal-tokenId" placeholder="0" {...register("tokenId")} />
            </div>
          )}

          <Button type="submit" disabled={loading || !tokenAddress} size="sm">
            {loading ? (
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            ) : (
              <Wallet className="mr-1 h-3 w-3" />
            )}
            Check Balance
          </Button>
        </form>

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
