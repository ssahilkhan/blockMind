"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { tokenTransferSchema, type TokenTransferInput } from "@/lib/validators/token";
import { tokenApi } from "@/services/token";
import { useTokenStore } from "@/stores/token-store";

interface TransferCardProps {
  tokenAddress: string | null;
  standard: string | null;
}

export function TransferCard({ tokenAddress, standard }: TransferCardProps) {
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const addRecentTransfer = useTokenStore((s) => s.addRecentTransfer);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TokenTransferInput>({
    resolver: zodResolver(tokenTransferSchema),
  });

  const onSubmit = async (data: TokenTransferInput) => {
    if (!tokenAddress || !standard) return;
    setLoading(true);
    setError(null);
    setTxHash(null);
    try {
      const res = await tokenApi.transfer({
        tokenAddress,
        to: data.to,
        amount: data.amount,
        privateKey: data.privateKey,
        standard,
      });
      setTxHash(res.transactionHash);
      addRecentTransfer({
        hash: res.transactionHash,
        tokenAddress,
        to: data.to,
        amount: data.amount,
        standard,
        timestamp: Date.now(),
      });
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Send className="h-4 w-4" />
          Transfer Token
        </CardTitle>
        <CardDescription>Send tokens to another address</CardDescription>
      </CardHeader>
      <CardContent>
        {!tokenAddress ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Detect a token first to enable transfers.
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="xfer-to">Recipient</Label>
              <Input id="xfer-to" placeholder="0x..." {...register("to")} />
              {errors.to && (
                <p className="text-xs text-destructive">{errors.to.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="xfer-amount">Amount</Label>
                <Input id="xfer-amount" placeholder="1000" {...register("amount")} />
                {errors.amount && (
                  <p className="text-xs text-destructive">{errors.amount.message}</p>
                )}
              </div>
              {(standard === "ERC721" || standard === "ERC1155") && (
                <div className="space-y-1.5">
                  <Label htmlFor="xfer-tokenId">Token ID</Label>
                  <Input id="xfer-tokenId" placeholder="1" {...register("tokenId")} />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="xfer-pk">Private Key</Label>
              <Input
                id="xfer-pk"
                type="password"
                placeholder="0x..."
                {...register("privateKey")}
              />
              {errors.privateKey && (
                <p className="text-xs text-destructive">{errors.privateKey.message}</p>
              )}
            </div>

            <Button type="submit" disabled={loading} size="sm">
              {loading ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <Send className="mr-1 h-3 w-3" />
              )}
              Transfer
            </Button>
          </form>
        )}

        {error && (
          <div className="mt-3 rounded-md bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {txHash && (
          <div className="mt-3 flex items-start gap-2 rounded-md bg-green-500/10 p-3">
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-green-600">Transfer Sent</p>
              <code className="block break-all font-mono text-xs">{txHash}</code>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
