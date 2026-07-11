"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AssetDistribution } from "../types";
import { CHART_COLORS } from "../types";

interface AssetAllocationChartProps {
  distribution: AssetDistribution[];
}

export function AssetAllocationChart({ distribution }: AssetAllocationChartProps) {
  if (distribution.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Asset Allocation
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground py-8">
          No assets to display.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Asset Allocation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distribution}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                dataKey="count"
                nameKey="label"
              >
                {distribution.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => {
                  const pct = (props?.payload as AssetDistribution | undefined)?.percentage ?? 0;
                  return [`${String(value)} items (${pct}%)`, String(name)];
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
