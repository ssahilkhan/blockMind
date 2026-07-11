"use client";

import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Radar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardLayout } from "@/components/layout";
import {
  TransactionBuilderCard,
  GasEstimateCard,
  TransactionStatusCard,
  TransactionHistoryTable,
} from "@/components/studio";
import { transactionApi, type TrackResult } from "@/services/transaction";
import { useTxStudioStore } from "@/stores/tx-studio-store";
import {
  buildTransactionSchema,
  estimateGasSchema,
  trackTxSchema,
  type BuildTransactionInput,
  type TrackTxInput,
} from "@/lib/validators/transaction";

const TRACK_REFRESH_MS = 5_000;

function TrackerSection() {
  const [trackHash, setTrackHash] = useState<string | null>(null);
  const [trackResult, setTrackResult] = useState<TrackResult | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackTxInput>({
    resolver: zodResolver(trackTxSchema),
  });

  const pollTrack = useCallback(async (hash: string) => {
    try {
      const result = await transactionApi.track(hash);
      setTrackResult(result);
      return result.status;
    } catch {
      return "failed" as const;
    }
  }, []);

  useEffect(() => {
    if (!trackHash) return;

    let active = true;
    let interval: ReturnType<typeof setInterval>;

    const poll = async () => {
      const status = await pollTrack(trackHash);
      if (status !== "pending" || !active) {
        clearInterval(interval);
      }
    };

    poll();
    interval = setInterval(poll, TRACK_REFRESH_MS);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [trackHash, pollTrack]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Radar className="h-4 w-4" />
          Transaction Tracker
        </CardTitle>
        <CardDescription>
          Track a transaction by hash. Auto-refreshes every 5s until confirmed.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          onSubmit={handleSubmit((data) => {
            setTrackHash(data.hash);
            setTrackResult(null);
          })}
          className="flex gap-2"
        >
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="track-hash" className="sr-only">
              Transaction Hash
            </Label>
            <Input
              id="track-hash"
              placeholder="0x... (transaction hash)"
              {...register("hash")}
            />
            {errors.hash && (
              <p className="text-xs text-destructive">{errors.hash.message}</p>
            )}
          </div>
          <Button type="submit">Track</Button>
        </form>

        {trackResult && trackHash && (
          <TransactionStatusCard result={trackResult} hash={trackHash} />
        )}
      </CardContent>
    </Card>
  );
}

function StudioContent() {
  const { sessionTxs, addTx, updateTxStatus } = useTxStudioStore();
  const [lastHash, setLastHash] = useState<string | null>(null);

  const sendMutation = useMutation({
    mutationFn: (data: BuildTransactionInput) =>
      transactionApi.buildAndSend({
        to: data.to,
        value: data.value,
        data: data.data || undefined,
        gasLimit: data.gasLimit || undefined,
        gasPrice: data.gasPrice || undefined,
        privateKey: data.privateKey,
      }),
    onSuccess: (data) => {
      setLastHash(data.transactionHash);
      addTx({
        hash: data.transactionHash,
        to: "sent",
        value: "-",
        status: "pending",
        timestamp: Date.now(),
      });
    },
  });

  const estimateMutation = useMutation({
    mutationFn: transactionApi.estimateGas,
  });

  const handleBuild = (data: BuildTransactionInput) => {
    sendMutation.mutate({
      from: data.from,
      to: data.to,
      value: data.value,
      data: data.data || undefined,
      gasLimit: data.gasLimit || undefined,
      gasPrice: data.gasPrice || undefined,
      privateKey: data.privateKey,
    });

    estimateMutation.mutate({
      from: data.from,
      to: data.to,
      value: data.value,
      data: data.data || undefined,
    });
  };

  useEffect(() => {
    if (!lastHash) return;

    let active = true;
    let interval: ReturnType<typeof setInterval>;

    const poll = async () => {
      try {
        const result = await transactionApi.track(lastHash);
        updateTxStatus(lastHash, result.status);
        if (result.status !== "pending" || !active) {
          clearInterval(interval);
        }
      } catch {
        updateTxStatus(lastHash, "failed");
        clearInterval(interval);
      }
    };

    interval = setInterval(poll, TRACK_REFRESH_MS);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [lastHash, updateTxStatus]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Transaction Studio</h2>
        <p className="text-sm text-muted-foreground">
          Build, estimate, send, and track Ethereum transactions.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TransactionBuilderCard
          onSubmit={handleBuild}
          isPending={sendMutation.isPending}
        />
        <GasEstimateCard
          estimate={estimateMutation.data ?? null}
          isLoading={estimateMutation.isPending}
        />
      </div>

      {sendMutation.isError && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">
              Transaction failed. Please check your inputs and try again.
            </p>
          </CardContent>
        </Card>
      )}

      {sendMutation.data && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-green-600">
                Transaction sent successfully
              </p>
              <div className="flex items-center gap-2">
                <code className="rounded bg-muted px-2 py-1 font-mono text-xs break-all">
                  {sendMutation.data.transactionHash}
                </code>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <TrackerSection />

      <TransactionHistoryTable transactions={sessionTxs} />
    </div>
  );
}

export default function TransactionStudioPage() {
  return (
    <DashboardLayout>
      <StudioContent />
    </DashboardLayout>
  );
}
