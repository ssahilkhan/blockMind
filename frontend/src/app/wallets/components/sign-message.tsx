"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PenLine } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/wallet";
import { walletApi } from "@/services";
import type { SignatureResult } from "@/services/wallet";
import { signMessageSchema, type SignMessageInput } from "@/lib/validators";

export function SignMessage() {
  const [result, setResult] = useState<SignatureResult | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignMessageInput>({
    resolver: zodResolver(signMessageSchema),
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: SignMessageInput) =>
      walletApi.signMessage(data.message),
    onSuccess: (data) => setResult(data),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <PenLine className="h-4 w-4" />
          Sign Message
        </CardTitle>
        <CardDescription>Sign a message with your private key</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="sign-pk">Private Key</Label>
            <Input
              id="sign-pk"
              type="password"
              placeholder="0x..."
              {...register("privateKey")}
            />
            {errors.privateKey && (
              <p className="text-xs text-destructive">{errors.privateKey.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sign-message">Message</Label>
            <Textarea
              id="sign-message"
              placeholder="Enter message to sign..."
              {...register("message")}
            />
            {errors.message && (
              <p className="text-xs text-destructive">{errors.message.message}</p>
            )}
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Signing..." : "Sign Message"}
          </Button>
        </form>

        {error && (
          <p className="text-sm text-destructive">
            Failed to sign message. Please check your private key.
          </p>
        )}

        {result && (
          <div className="space-y-2 rounded-lg border bg-muted/50 p-4">
            <p className="text-sm font-medium">Signature</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded bg-muted px-2 py-1 font-mono text-xs break-all">
                {result.signature}
              </code>
              <CopyButton value={result.signature} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
