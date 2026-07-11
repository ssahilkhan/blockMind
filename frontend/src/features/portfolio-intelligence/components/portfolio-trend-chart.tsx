"use client";

import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PortfolioTrend, TimeFrame } from "../types";

interface PortfolioTrendChartProps {
  trends: PortfolioTrend[];
}

export function PortfolioTrendChart({ trends }: PortfolioTrendChartProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeFrame>("daily");

  const trend = trends.find((t) => t.timeframe === selectedTimeframe) ?? trends[0];

  if (!trend) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Activity Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground py-8">
          No trend data available.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Activity Trend
        </CardTitle>
        <div className="flex gap-1">
          {(["daily", "weekly", "monthly"] as TimeFrame[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`text-xs px-2 py-0.5 rounded transition-colors ${
                selectedTimeframe === tf
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {tf.charAt(0).toUpperCase() + tf.slice(1)}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend.dataPoints}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="label" className="text-xs" />
              <YAxis className="text-xs" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="transactions"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Transactions"
              />
              <Line
                type="monotone"
                dataKey="transfers"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Transfers"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>Direction: {trend.direction}</span>
          <span>Gas trend: {trend.gasSpendingTrend}</span>
        </div>
      </CardContent>
    </Card>
  );
}
