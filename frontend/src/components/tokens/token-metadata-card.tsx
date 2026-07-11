"use client";

import { Coins } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STANDARD_COLORS, type TokenMeta } from "@/types/token";

interface TokenMetadataCardProps {
  metadata: TokenMeta | null;
  loading: boolean;
}

export function TokenMetadataCard({ metadata, loading }: TokenMetadataCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Coins className="h-4 w-4" />
            Token Metadata
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-4 text-center text-sm text-muted-foreground">Loading metadata...</p>
        </CardContent>
      </Card>
    );
  }

  if (!metadata) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Coins className="h-4 w-4" />
            Token Metadata
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="py-4 text-center text-sm text-muted-foreground">
            Detect a token to view its metadata.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Coins className="h-4 w-4" />
            {metadata.name || "Unknown Token"}
          </CardTitle>
          <Badge className={STANDARD_COLORS[metadata.standard] ?? "bg-gray-500/10 text-gray-600"}>
            {metadata.standard}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Symbol</p>
            <p className="text-sm font-semibold">{metadata.symbol || "--"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Decimals</p>
            <p className="text-sm font-semibold">{metadata.decimals}</p>
          </div>
          <div className="col-span-2 space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Total Supply</p>
            <p className="break-all text-sm font-semibold font-mono">
              {metadata.totalSupply || "0"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
