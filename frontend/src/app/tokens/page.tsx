"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TokenDetector,
  TokenMetadataCard,
  BalanceLookupCard,
  TransferCard,
  ApprovalCard,
  NFTViewer,
  ERC1155Viewer,
  RecentTokens,
} from "@/components/tokens";
import { tokenApi } from "@/services/token";
import { useTokenStore } from "@/stores/token-store";
import type { TokenStandardType, TokenMeta } from "@/types/token";

function ExploreTab({
  address,
  standard,
  onDetected,
}: {
  address: string | null;
  standard: TokenStandardType | null;
  onDetected: (addr: string, std: TokenStandardType) => void;
}) {
  const addRecentToken = useTokenStore((s) => s.addRecentToken);

  const { data: metadata, isLoading } = useQuery<TokenMeta | null>({
    queryKey: ["token-metadata", address],
    queryFn: async () => {
      if (!address) return null;
      const res = await tokenApi.getMetadata(address);
      addRecentToken({
        address,
        name: res.name,
        symbol: res.symbol,
        standard: res.standard,
        viewedAt: Date.now(),
      });
      return res;
    },
    enabled: !!address,
    retry: false,
  });

  return (
    <div className="space-y-6">
      <TokenDetector onDetected={onDetected} />
      <TokenMetadataCard
        metadata={metadata ?? null}
        loading={isLoading}
      />
    </div>
  );
}

function ManageTab({
  address,
  standard,
}: {
  address: string | null;
  standard: TokenStandardType | null;
}) {
  const isERC721 = standard === "ERC721";
  const isERC1155 = standard === "ERC1155";
  const isERC20 = standard === "ERC20";

  if (!address) {
    return (
      <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
        Detect a token first to access balance, transfer, and approval features.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <BalanceLookupCard tokenAddress={address} standard={standard} />
        <TransferCard tokenAddress={address} standard={standard} />
      </div>
      {isERC20 && (
        <ApprovalCard tokenAddress={address} standard={standard} />
      )}
    </div>
  );
}

function NFTTab({
  address,
  standard,
}: {
  address: string | null;
  standard: TokenStandardType | null;
}) {
  if (!address) {
    return (
      <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
        Detect an ERC-721 or ERC-1155 token first.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {(standard === "ERC721" || !standard) && (
          <NFTViewer tokenAddress={address} />
        )}
        {(standard === "ERC1155" || !standard) && (
          <ERC1155Viewer tokenAddress={address} />
        )}
      </div>
    </div>
  );
}

export default function TokensPage() {
  const [detectedAddress, setDetectedAddress] = useState<string | null>(null);
  const [detectedStandard, setDetectedStandard] = useState<TokenStandardType | null>(null);

  const handleDetected = (address: string, standard: TokenStandardType) => {
    setDetectedAddress(address);
    setDetectedStandard(standard);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Token Explorer</h2>
          <p className="text-sm text-muted-foreground">
            Detect, explore, and manage ERC-20, ERC-721, and ERC-1155 tokens.
          </p>
        </div>

        <Tabs defaultValue="explore">
          <TabsList variant="line">
            <TabsTrigger value="explore">Explore</TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
            <TabsTrigger value="nft">NFTs</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <div className="mt-4">
            <TabsContent value="explore">
              <ExploreTab
                address={detectedAddress}
                standard={detectedStandard}
                onDetected={handleDetected}
              />
            </TabsContent>
            <TabsContent value="manage">
              <ManageTab address={detectedAddress} standard={detectedStandard} />
            </TabsContent>
            <TabsContent value="nft">
              <NFTTab address={detectedAddress} standard={detectedStandard} />
            </TabsContent>
            <TabsContent value="history">
              <RecentTokens />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
