"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TokenDistribution } from "../types";
import { CHART_COLORS } from "../types";

interface TokenDistributionChartProps {
  tokens: TokenDistribution[];
}

export function TokenDistributionChart({ tokens }: TokenDistributionChartProps) {
  if (tokens.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Token Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground py-8">
          No tokens to display.
        </CardContent>
      </Card>
    );
  }

  const chartData = tokens.slice(0, 10).map((t) => ({
    name: t.symbol || t.name,
    percentage: t.percentage,
    balance: t.balance,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Token Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip
                formatter={(value) => [`${String(value)}%`, "Share"]}
              />
              <Bar dataKey="percentage" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
