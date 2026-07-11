"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, XCircle, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { walletApi } from "@/services";
import { lookupAddressSchema, type LookupAddressInput } from "@/lib/validators";
import { StatusBadge } from "@/components/wallet";

export function ValidateAddress() {
  const [addressToValidate, setAddressToValidate] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LookupAddressInput>({
    resolver: zodResolver(lookupAddressSchema),
  });

  const { data, isPending, mutate } = useMutation({
    mutationFn: walletApi.validateAddress,
  });

  const onSubmit = (data: LookupAddressInput) => {
    setAddressToValidate(data.address);
    mutate(data.address);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldCheck className="h-4 w-4" />
          Validate Address
        </CardTitle>
        <CardDescription>Check if an Ethereum address is valid</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
          <div className="flex-1 space-y-1.5">
            <Label htmlFor="validate-address" className="sr-only">
              Address
            </Label>
            <Input
              id="validate-address"
              placeholder="0x..."
              {...register("address")}
            />
            {errors.address && (
              <p className="text-xs text-destructive">{errors.address.message}</p>
            )}
          </div>
          <Button type="submit" disabled={isPending}>
            Validate
          </Button>
        </form>

        {isPending && (
          <p className="text-sm text-muted-foreground">Validating...</p>
        )}

        {data && addressToValidate && (
          <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center gap-3">
              {data.valid ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <div>
                <p className="text-sm font-medium">
                  {data.valid ? "Valid Address" : "Invalid Address"}
                </p>
                <code className="text-xs text-muted-foreground break-all">
                  {addressToValidate}
                </code>
              </div>
            </div>
            {data.valid && (
              <div className="flex gap-2">
                <StatusBadge
                  label={data.checksum ? "Valid Checksum" : "No Checksum"}
                  variant={data.checksum ? "success" : "warning"}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
