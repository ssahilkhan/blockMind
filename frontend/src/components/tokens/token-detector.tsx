"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, Loader2, Fingerprint } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { tokenAddressSchema, type TokenAddressInput } from "@/lib/validators/token";
import { tokenApi } from "@/services/token";
import { STANDARD_COLORS, STANDARD_LABELS, type TokenStandardType } from "@/types/token";

interface TokenDetectorProps {
  onDetected: (address: string, standard: TokenStandardType) => void;
}

export function TokenDetector({ onDetected }: TokenDetectorProps) {
  const [standard, setStandard] = useState<TokenStandardType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastAddress, setLastAddress] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TokenAddressInput>({
    resolver: zodResolver(tokenAddressSchema),
  });

  const onSubmit = async (data: TokenAddressInput) => {
    setLoading(true);
    setError(null);
    setStandard(null);
    try {
      const res = await tokenApi.detectStandard(data.address);
      const s = res.standard as TokenStandardType;
      setStandard(s);
      setLastAddress(data.address);
      onDetected(data.address, s);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Detection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Fingerprint className="h-4 w-4" />
          Token Detector
        </CardTitle>
        <CardDescription>
          Enter a contract address to detect its token standard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="detect-addr">Contract Address</Label>
            <Input
              id="detect-addr"
              placeholder="0x..."
              {...register("address")}
            />
            {errors.address && (
              <p className="text-xs text-destructive">{errors.address.message}</p>
            )}
          </div>
          <Button type="submit" disabled={loading} size="sm">
            {loading ? (
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            ) : (
              <Search className="mr-1 h-3 w-3" />
            )}
            Detect Standard
          </Button>
        </form>

        {error && (
          <div className="mt-3 rounded-md bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {standard && (
          <div className="mt-4 flex items-center gap-3">
            <Badge className={STANDARD_COLORS[standard]}>
              {standard}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {STANDARD_LABELS[standard]}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
