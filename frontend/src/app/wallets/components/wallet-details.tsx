"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Wallet, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/common";
import { AddressField } from "@/components/wallet";
import { walletApi } from "@/services";
import { lookupAddressSchema, type LookupAddressInput } from "@/lib/validators";
import type { WalletDetails } from "@/types/api";

function WalletDetailsDisplay({
  details,
  onRefresh,
  isRefreshing,
}: {
  details: WalletDetails;
  onRefresh: () => void;
  isRefreshing: boolean;
}) {
  return (
    <div className="space-y-4">
      <AddressField label="Address" value={details.address} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Balance</p>
          <p className="text-lg font-bold">{details.balance}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Nonce</p>
          <p className="text-lg font-bold">{details.nonce}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Transactions</p>
          <p className="text-lg font-bold">{details.transactionCount}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Chain ID</p>
          <p className="text-sm font-semibold">{details.chainId}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Network</p>
          <p className="text-sm font-semibold">{details.network}</p>
        </div>
        <div className="flex items-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}

export function WalletDetails() {
  const [lookupAddress, setLookupAddress] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LookupAddressInput>({
    resolver: zodResolver(lookupAddressSchema),
  });

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["wallet", "details", lookupAddress],
    queryFn: () => walletApi.getDetails(lookupAddress!),
    enabled: !!lookupAddress,
    retry: false,
  });

  const onSubmit = (data: LookupAddressInput) => {
    setLookupAddress(data.address);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Wallet className="h-4 w-4" />
          Wallet Details
        </CardTitle>
        <CardDescription>Look up wallet balance, nonce, and network info</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="details-address" className="sr-only">
              Address
            </Label>
            <Input
              id="details-address"
              placeholder="0x... (enter an address to look up)"
              {...register("address")}
            />
            {errors.address && (
              <p className="text-xs text-destructive">{errors.address.message}</p>
            )}
          </div>
          <Button type="submit" disabled={isFetching}>
            Look Up
          </Button>
        </form>

        {isLoading && <LoadingSpinner text="Loading wallet details..." />}

        {isError && lookupAddress && (
          <p className="text-sm text-destructive">
            Failed to load wallet details. Make sure the address is valid and the backend is running.
          </p>
        )}

        {data && (
          <WalletDetailsDisplay
            details={data}
            onRefresh={() => refetch()}
            isRefreshing={isFetching}
          />
        )}
      </CardContent>
    </Card>
  );
}
