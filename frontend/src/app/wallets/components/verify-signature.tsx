"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, XCircle, KeyRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { walletApi } from "@/services";
import { verifySignatureSchema, type VerifySignatureInput } from "@/lib/validators";
import { StatusBadge, AddressField } from "@/components/wallet";

export function VerifySignature() {
  const [result, setResult] = useState<{
    valid: boolean;
    recoveredAddress: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifySignatureInput>({
    resolver: zodResolver(verifySignatureSchema),
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: VerifySignatureInput) =>
      walletApi.verifySignature(data.message, data.signature, data.address),
    onSuccess: (data) => setResult(data),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <KeyRound className="h-4 w-4" />
          Verify Signature
        </CardTitle>
        <CardDescription>Verify a signed message and recover the signer address</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="verify-message">Message</Label>
            <Textarea
              id="verify-message"
              placeholder="Original message..."
              {...register("message")}
            />
            {errors.message && (
              <p className="text-xs text-destructive">{errors.message.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="verify-sig">Signature</Label>
            <Input
              id="verify-sig"
              placeholder="0x..."
              {...register("signature")}
            />
            {errors.signature && (
              <p className="text-xs text-destructive">{errors.signature.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="verify-addr">Expected Address</Label>
            <Input
              id="verify-addr"
              placeholder="0x..."
              {...register("address")}
            />
            {errors.address && (
              <p className="text-xs text-destructive">{errors.address.message}</p>
            )}
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Verifying..." : "Verify Signature"}
          </Button>
        </form>

        {error && (
          <p className="text-sm text-destructive">
            Failed to verify signature. Please check your inputs.
          </p>
        )}

        {result && (
          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center gap-3">
              {result.valid ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">
                  {result.valid ? "Signature Valid" : "Signature Invalid"}
                </p>
                <StatusBadge
                  label={result.valid ? "Valid" : "Invalid"}
                  variant={result.valid ? "success" : "error"}
                />
              </div>
            </div>
            {result.valid && (
              <AddressField label="Recovered Address" value={result.recoveredAddress} />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
