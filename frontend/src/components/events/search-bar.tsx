"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { eventSearchSchema, type EventSearchInput } from "@/lib/validators/events";

interface SearchBarProps {
  onSearch: (params: EventSearchInput) => void;
  isLoading: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventSearchInput>({
    resolver: zodResolver(eventSearchSchema),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Search className="h-4 w-4" />
          Search Events
        </CardTitle>
        <CardDescription>Filter by contract, event name, tx hash, or wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSearch)} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="search-contract">Contract Address</Label>
              <Input
                id="search-contract"
                placeholder="0x..."
                {...register("contract")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="search-event">Event Name</Label>
              <Input
                id="search-event"
                placeholder="Transfer, Approval..."
                {...register("event")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="search-tx">Transaction Hash</Label>
              <Input
                id="search-tx"
                placeholder="0x..."
                {...register("txHash")}
              />
              {errors.txHash && (
                <p className="text-xs text-destructive">{errors.txHash.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="search-wallet">Wallet Address</Label>
              <Input
                id="search-wallet"
                placeholder="0x..."
                {...register("wallet")}
              />
            </div>
          </div>
          <Button type="submit" disabled={isLoading} size="sm">
            {isLoading ? (
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            ) : (
              <Search className="mr-1 h-3 w-3" />
            )}
            Search
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
