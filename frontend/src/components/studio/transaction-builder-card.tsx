"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { buildTransactionSchema, type BuildTransactionInput } from "@/lib/validators/transaction";

interface TransactionBuilderCardProps {
  onSubmit: (data: BuildTransactionInput) => void;
  isPending: boolean;
}

export function TransactionBuilderCard({ onSubmit, isPending }: TransactionBuilderCardProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BuildTransactionInput>({
    resolver: zodResolver(buildTransactionSchema),
    defaultValues: {
      from: "",
      to: "",
      value: "0",
      data: "",
      gasLimit: "",
      gasPrice: "",
      privateKey: "",
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Send className="h-4 w-4" />
          Transaction Builder
        </CardTitle>
        <CardDescription>Create and send an Ethereum transaction</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="tx-from">From Address</Label>
            <Input id="tx-from" placeholder="0x..." {...register("from")} />
            {errors.from && (
              <p className="text-xs text-destructive">{errors.from.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tx-to">To Address</Label>
            <Input id="tx-to" placeholder="0x..." {...register("to")} />
            {errors.to && (
              <p className="text-xs text-destructive">{errors.to.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="tx-value">Value (ETH)</Label>
              <Input id="tx-value" placeholder="0.0" {...register("value")} />
              {errors.value && (
                <p className="text-xs text-destructive">{errors.value.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tx-data">Data (optional)</Label>
              <Input id="tx-data" placeholder="0x..." {...register("data")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="tx-gasLimit">Gas Limit (optional)</Label>
              <Input id="tx-gasLimit" placeholder="21000" {...register("gasLimit")} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tx-gasPrice">Gas Price (optional)</Label>
              <Input id="tx-gasPrice" placeholder="20000000000" {...register("gasPrice")} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tx-pk">Private Key</Label>
            <Input
              id="tx-pk"
              type="password"
              placeholder="0x..."
              {...register("privateKey")}
            />
            {errors.privateKey && (
              <p className="text-xs text-destructive">{errors.privateKey.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Sending..." : "Send Transaction"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
