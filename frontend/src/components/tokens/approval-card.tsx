"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Shield, Loader2, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { approveSchema, type ApproveInput } from "@/lib/validators/token";
import { tokenApi } from "@/services/token";

const ETH_ADDRESS = /^0x[0-9a-fA-F]{40}$/;

const allowanceSchema = z.object({
  owner: z.string().min(1, "Owner is required").regex(ETH_ADDRESS, "Invalid address"),
  spender: z.string().min(1, "Spender is required").regex(ETH_ADDRESS, "Invalid address"),
});

type AllowanceForm = z.infer<typeof allowanceSchema>;

interface ApprovalCardProps {
  tokenAddress: string | null;
  standard: string | null;
}

export function ApprovalCard({ tokenAddress, standard }: ApprovalCardProps) {
  const [txHash, setTxHash] = useState<string | null>(null);
  const [allowance, setAllowance] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingAllowance, setCheckingAllowance] = useState(false);
  const isERC20 = standard === "ERC20";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApproveInput>({
    resolver: zodResolver(approveSchema),
  });

  const {
    register: regAllowance,
    handleSubmit: handleAllowance,
    formState: { errors: allowanceErrors },
  } = useForm<AllowanceForm>({
    resolver: zodResolver(allowanceSchema),
  });

  const onApprove = async (data: ApproveInput) => {
    if (!tokenAddress || !standard) return;
    setLoading(true);
    setError(null);
    setTxHash(null);
    try {
      const res = await tokenApi.approve({
        tokenAddress,
        spender: data.spender,
        amount: data.amount,
        privateKey: data.privateKey,
        standard,
      });
      setTxHash(`approval-${res.success}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approval failed");
    } finally {
      setLoading(false);
    }
  };

  const onCheckAllowance = async (data: AllowanceForm) => {
    if (!tokenAddress) return;
    setCheckingAllowance(true);
    setAllowance(null);
    setError(null);
    try {
      const res = await tokenApi.allowance({
        tokenAddress,
        owner: data.owner,
        spender: data.spender,
        standard: standard ?? undefined,
      });
      setAllowance(res.allowance);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Allowance check failed");
    } finally {
      setCheckingAllowance(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Shield className="h-4 w-4" />
          Approvals
        </CardTitle>
        <CardDescription>Manage token spending approvals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!tokenAddress ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Detect a token first to manage approvals.
          </p>
        ) : (
          <>
            {isERC20 && (
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground">Check Allowance</p>
                <form onSubmit={handleAllowance(onCheckAllowance)} className="space-y-2">
                  <Input placeholder="Owner address (0x...)" {...regAllowance("owner")} />
                  {allowanceErrors.owner && (
                    <p className="text-xs text-destructive">{allowanceErrors.owner.message}</p>
                  )}
                  <Input placeholder="Spender address (0x...)" {...regAllowance("spender")} />
                  {allowanceErrors.spender && (
                    <p className="text-xs text-destructive">{allowanceErrors.spender.message}</p>
                  )}
                  <Button type="submit" disabled={checkingAllowance} size="sm" variant="outline">
                    {checkingAllowance && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                    Check Allowance
                  </Button>
                </form>
                {allowance !== null && (
                  <div className="rounded-md bg-muted p-2">
                    <p className="text-xs text-muted-foreground">Current Allowance</p>
                    <p className="font-mono text-sm font-bold">{allowance}</p>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-3">
              <p className="text-xs font-medium text-muted-foreground">Approve Spender</p>
              <form onSubmit={handleSubmit(onApprove)} className="space-y-2">
                <Input placeholder="Spender address (0x...)" {...register("spender")} />
                {errors.spender && (
                  <p className="text-xs text-destructive">{errors.spender.message}</p>
                )}
                <Input placeholder="Amount" {...register("amount")} />
                {errors.amount && (
                  <p className="text-xs text-destructive">{errors.amount.message}</p>
                )}
                <Input
                  type="password"
                  placeholder="Private key (0x...)"
                  {...register("privateKey")}
                />
                {errors.privateKey && (
                  <p className="text-xs text-destructive">{errors.privateKey.message}</p>
                )}
                <Button type="submit" disabled={loading} size="sm">
                  {loading ? (
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  ) : (
                    <Shield className="mr-1 h-3 w-3" />
                  )}
                  Approve
                </Button>
              </form>
            </div>
          </>
        )}

        {error && (
          <div className="rounded-md bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {txHash && (
          <div className="flex items-start gap-2 rounded-md bg-green-500/10 p-3">
            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
            <p className="text-sm font-medium text-green-600">Approval Updated</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
