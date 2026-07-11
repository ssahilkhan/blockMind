"use client";

import { Activity, Coins, Image, Layers, Code2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  total: number;
  erc20: number;
  erc721: number;
  erc1155: number;
  custom: number;
}

const STATS = [
  { key: "total" as const, label: "Events Loaded", icon: Activity, color: "text-primary" },
  { key: "erc20" as const, label: "ERC-20 Events", icon: Coins, color: "text-blue-500" },
  { key: "erc721" as const, label: "ERC-721 Events", icon: Image, color: "text-purple-500" },
  { key: "erc1155" as const, label: "ERC-1155 Events", icon: Layers, color: "text-orange-500" },
  { key: "custom" as const, label: "Custom Events", icon: Code2, color: "text-gray-500" },
];

export function StatsCards({ total, erc20, erc721, erc1155, custom }: StatsCardsProps) {
  const values = { total, erc20, erc721, erc1155, custom };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {STATS.map(({ key, label, icon: Icon, color }) => (
        <Card key={key}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              {label}
            </CardTitle>
            <Icon className={`h-4 w-4 ${color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{values[key]}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
