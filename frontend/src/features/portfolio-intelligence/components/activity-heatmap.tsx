"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ActivityHeatmapEntry } from "../types";

interface ActivityHeatmapProps {
  data: ActivityHeatmapEntry[];
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function getIntensity(count: number, max: number): string {
  if (max === 0 || count === 0) return "bg-muted";
  const ratio = count / max;
  if (ratio > 0.75) return "bg-blue-600";
  if (ratio > 0.5) return "bg-blue-400";
  if (ratio > 0.25) return "bg-blue-200";
  return "bg-blue-100 dark:bg-blue-900";
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Activity Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground py-8">
          No activity data.
        </CardContent>
      </Card>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  const grid: Record<string, Record<number, number>> = {};
  for (const entry of data) {
    if (!grid[entry.day]) grid[entry.day] = {};
    grid[entry.day][entry.hour] = entry.count;
  }

  const visibleHours = [0, 3, 6, 9, 12, 15, 18, 21];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Activity Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[500px]">
            <div className="flex gap-1 mb-1 ml-10">
              {visibleHours.map((h) => (
                <div key={h} className="text-[9px] text-muted-foreground w-5 text-center">
                  {h}
                </div>
              ))}
            </div>
            {DAYS.map((day) => (
              <div key={day} className="flex items-center gap-1 mb-0.5">
                <span className="text-[10px] text-muted-foreground w-9 text-right pr-1">{day}</span>
                {visibleHours.map((h) => (
                  <div
                    key={`${day}-${h}`}
                    className={`w-5 h-5 rounded-sm ${getIntensity(grid[day]?.[h] ?? 0, maxCount)}`}
                    title={`${day} ${h}:00 - ${grid[day]?.[h] ?? 0} tx`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 text-[10px] text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-0.5">
            {["bg-muted", "bg-blue-100 dark:bg-blue-900", "bg-blue-200", "bg-blue-400", "bg-blue-600"].map((c, i) => (
              <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
            ))}
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
