"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image, Loader2, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { nftLookupSchema, type NftLookupInput } from "@/lib/validators/token";
import { tokenApi } from "@/services/token";

interface NFTViewerProps {
  tokenAddress: string | null;
}

interface NFTData {
  name: string;
  description: string;
  image: string;
}

export function NFTViewer({ tokenAddress }: NFTViewerProps) {
  const [nftData, setNftData] = useState<NFTData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NftLookupInput>({
    resolver: zodResolver(nftLookupSchema),
  });

  const onSubmit = async (data: NftLookupInput) => {
    if (!tokenAddress) return;
    setLoading(true);
    setError(null);
    setNftData(null);
    try {
      const res = await tokenApi.getNFTMetadata(tokenAddress, data.tokenId);
      setNftData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch NFT metadata");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Image className="h-4 w-4" />
          NFT Explorer
        </CardTitle>
        <CardDescription>View NFT ownership and metadata</CardDescription>
      </CardHeader>
      <CardContent>
        {!tokenAddress ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Detect an ERC-721 token first.
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="nft-tokenId">Token ID</Label>
              <Input id="nft-tokenId" placeholder="0" {...register("tokenId")} />
              {errors.tokenId && (
                <p className="text-xs text-destructive">{errors.tokenId.message}</p>
              )}
            </div>
            <Button type="submit" disabled={loading} size="sm">
              {loading ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <Image className="mr-1 h-3 w-3" />
              )}
              Fetch NFT
            </Button>
          </form>
        )}

        {error && (
          <div className="mt-3 rounded-md bg-destructive/10 p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {nftData && (
          <div className="mt-4 space-y-4">
            {nftData.image && (
              <div className="overflow-hidden rounded-lg border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={nftData.image}
                  alt={nftData.name}
                  className="w-full object-contain max-h-64"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">{nftData.name}</h4>
              {nftData.description && (
                <p className="text-xs text-muted-foreground">{nftData.description}</p>
              )}
            </div>
            {nftData.image && nftData.image.startsWith("http") && (
              <a
                href={nftData.image}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                View Original <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
