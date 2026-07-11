import type {
  PortfolioTrend,
  TrendDataPoint,
  TrendDirection,
  TimeFrame,
  ActivityHeatmapEntry,
} from "../types";

function computeDirection(values: number[]): TrendDirection {
  if (values.length < 2) return "flat";
  const first = values.slice(0, Math.ceil(values.length / 2));
  const second = values.slice(Math.ceil(values.length / 2));
  const avgFirst = first.reduce((a, b) => a + b, 0) / first.length;
  const avgSecond = second.reduce((a, b) => a + b, 0) / second.length;

  if (avgSecond > avgFirst * 1.1) return "up";
  if (avgSecond < avgFirst * 0.9) return "down";
  return "flat";
}

function generateDailyPoints(
  historyTxCount: number,
): TrendDataPoint[] {
  const now = new Date();
  const points: TrendDataPoint[] = [];
  const txPerDay = historyTxCount > 0 ? Math.max(1, Math.floor(historyTxCount / 7)) : 0;

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
    const variance = Math.floor(Math.random() * txPerDay * 0.5);
    points.push({
      label: dayLabel,
      transactions: Math.max(0, txPerDay + (i % 2 === 0 ? variance : -variance)),
      gasUsed: Math.floor(Math.random() * 50000) + 21000,
      transfers: Math.max(0, txPerDay - Math.floor(Math.random() * 3)),
      date: d.toISOString().slice(0, 10),
    });
  }
  return points;
}

function generateWeeklyPoints(
  historyTxCount: number,
): TrendDataPoint[] {
  const now = new Date();
  const points: TrendDataPoint[] = [];
  const txPerWeek = historyTxCount > 0 ? Math.max(1, Math.floor(historyTxCount / 4)) : 0;

  for (let i = 3; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 7);
    const weekLabel = `Week ${4 - i}`;
    const variance = Math.floor(Math.random() * txPerWeek * 0.4);
    points.push({
      label: weekLabel,
      transactions: Math.max(0, txPerWeek + variance),
      gasUsed: Math.floor(Math.random() * 200000) + 50000,
      transfers: Math.max(0, txPerWeek - Math.floor(Math.random() * 5)),
      date: d.toISOString().slice(0, 10),
    });
  }
  return points;
}

function generateMonthlyPoints(
  historyTxCount: number,
): TrendDataPoint[] {
  const now = new Date();
  const points: TrendDataPoint[] = [];
  const txPerMonth = historyTxCount > 0 ? Math.max(1, Math.floor(historyTxCount / 3)) : 0;

  for (let i = 2; i >= 0; i--) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i);
    const monthLabel = d.toLocaleDateString("en-US", { month: "short" });
    const variance = Math.floor(Math.random() * txPerMonth * 0.3);
    points.push({
      label: monthLabel,
      transactions: Math.max(0, txPerMonth + variance),
      gasUsed: Math.floor(Math.random() * 800000) + 200000,
      transfers: Math.max(0, txPerMonth - Math.floor(Math.random() * 10)),
      date: d.toISOString().slice(0, 10),
    });
  }
  return points;
}

function buildTrend(
  timeframe: TimeFrame,
  dataPoints: TrendDataPoint[],
  historyTxCount: number,
): PortfolioTrend {
  const txValues = dataPoints.map((p) => p.transactions);
  const direction = computeDirection(txValues);

  const gasValues = dataPoints.map((p) => p.gasUsed);
  const gasTrend = computeDirection(gasValues);

  return {
    timeframe,
    direction,
    dataPoints,
    transferFrequency: historyTxCount > 0 ? Math.round(historyTxCount / (timeframe === "daily" ? 7 : timeframe === "weekly" ? 4 : 3)) : 0,
    gasSpendingTrend: gasTrend,
    newTokensReceived: Math.floor(Math.random() * 5),
    newNFTsReceived: Math.floor(Math.random() * 3),
  };
}

export function generateTrends(historyTxCount: number): PortfolioTrend[] {
  return [
    buildTrend("daily", generateDailyPoints(historyTxCount), historyTxCount),
    buildTrend("weekly", generateWeeklyPoints(historyTxCount), historyTxCount),
    buildTrend("monthly", generateMonthlyPoints(historyTxCount), historyTxCount),
  ];
}

export function generateHeatmapData(historyTxCount: number): ActivityHeatmapEntry[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const entries: ActivityHeatmapEntry[] = [];

  for (const day of days) {
    for (let hour = 0; hour < 24; hour++) {
      const isBusinessHour = hour >= 9 && hour <= 17;
      const isWeekday = days.indexOf(day) < 5;
      const base = isWeekday && isBusinessHour ? 3 : 1;
      const variance = Math.floor(Math.random() * 2);
      entries.push({
        day,
        hour,
        count: Math.max(0, base + variance),
      });
    }
  }

  if (historyTxCount === 0) {
    return entries.map((e) => ({ ...e, count: 0 }));
  }

  return entries;
}
