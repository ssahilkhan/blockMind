"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { StatsResponse } from "@/types/api";

interface StatsCardProps {
  stats: StatsResponse;
}

interface StatItemProps {
  label: string;
  value: string | number;
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

export function StatsCard({ stats }: StatsCardProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Latest Block
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Link href={`/blocks/${stats.latestBlock}`} className="text-lg font-bold hover:underline">
            #{stats.latestBlock}
          </Link>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Chain ID
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-bold">{stats.chainId}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-bold">{stats.network}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Gas Price
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-bold">{stats.gasPrice}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs font-medium text-muted-foreground">
            Currency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg font-bold">ETH</p>
        </CardContent>
      </Card>
    </div>
  );
}
