"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layout";
import { SearchBar, StatsCard, BlockTable } from "@/components/explorer";
import { LoadingSpinner } from "@/components/common";
import { chainApi } from "@/services";

const PAGE_SIZE = 10;
const REFRESH_INTERVAL = 15_000;

function BlocksContent() {
  const [page, setPage] = useState(0);
  const offset = page * PAGE_SIZE;

  const statsQuery = useQuery({
    queryKey: ["chain", "stats"],
    queryFn: () => chainApi.getStats(),
    refetchInterval: REFRESH_INTERVAL,
  });

  const blocksQuery = useQuery({
    queryKey: ["chain", "blocks", offset, PAGE_SIZE],
    queryFn: () => chainApi.getLatestBlocks(PAGE_SIZE + offset),
    refetchInterval: REFRESH_INTERVAL,
  });

  const stats = statsQuery.data;
  const allBlocks = blocksQuery.data ?? [];
  const displayBlocks = allBlocks.slice(offset, offset + PAGE_SIZE);
  const latestBlockNum = stats?.latestBlock ?? 0;
  const hasPrev = page > 0;
  const hasNext = allBlocks.length >= PAGE_SIZE + offset && displayBlocks.length === PAGE_SIZE;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Block Explorer</h2>
        <p className="text-sm text-muted-foreground">
          Browse blocks, transactions, and blockchain statistics.
        </p>
      </div>

      <SearchBar />

      {stats && <StatsCard stats={stats} />}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Latest Blocks</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Auto-refreshes every 15s
            </span>
            <RefreshCw
              className={`h-4 w-4 text-muted-foreground ${blocksQuery.isFetching ? "animate-spin" : ""}`}
            />
          </div>
        </CardHeader>
        <CardContent>
          {blocksQuery.isLoading ? (
            <LoadingSpinner text="Loading blocks..." />
          ) : (
            <>
              <BlockTable blocks={displayBlocks} />
              <div className="mt-4 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={!hasPrev}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page + 1} | Blocks {offset + 1}-{offset + displayBlocks.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!hasNext}
                >
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function BlocksPage() {
  return (
    <DashboardLayout>
      <BlocksContent />
    </DashboardLayout>
  );
}
