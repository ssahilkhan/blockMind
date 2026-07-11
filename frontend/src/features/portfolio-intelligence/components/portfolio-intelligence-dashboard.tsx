"use client";

import { useState, useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAIStore } from "@/features/ai/stores/ai-store";
import { gatherPortfolioData, buildMetrics, buildAssetDistribution, buildTokenDistribution, buildActivitySummary, computeHealth, generateTrends, generateHeatmapData, generatePortfolioRecommendations, generatePortfolioInsights, buildPortfolioSummaryPayloads, buildPortfolioSummaryMessages } from "../analysis";
import type { AILevel } from "@/features/ai/types";
import type { PortfolioIntelligenceReport } from "../types";
import { PortfolioHealthCard } from "./portfolio-health-card";
import { AISummaryCard } from "./ai-summary-card";
import { MetricsGrid } from "./metrics-grid";
import { AssetAllocationChart } from "./asset-allocation-chart";
import { PortfolioTrendChart } from "./portfolio-trend-chart";
import { TokenDistributionChart } from "./token-distribution-chart";
import { ActivityTimeline } from "./activity-timeline";
import { RecommendationsPanel } from "./recommendations-panel";
import { RecentInsightsPanel } from "./recent-insights-panel";
import { ActivitySummaryCard } from "./activity-summary-card";
import { ActivityHeatmap } from "./activity-heatmap";
import { ExportCard } from "./export-card";

export function PortfolioIntelligenceDashboard() {
  const [address, setAddress] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<PortfolioIntelligenceReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [aiSummary, setAiSummary] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiLevel, setAiLevel] = useState<AILevel>("beginner");

  const aiProvider = useAIStore((s) => s.providerConfig);

  const analyze = useCallback(async (target: string) => {
    if (!target.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    setAiSummary("");

    try {
      const { summary, assets, walletDetails } = await gatherPortfolioData(target);
      const metrics = buildMetrics(summary, walletDetails);
      const assetDistribution = buildAssetDistribution(assets, summary);
      const tokenDistribution = buildTokenDistribution(assets);
      const activitySummary = buildActivitySummary(walletDetails, assets);
      const health = computeHealth(assets, walletDetails.transactionCount);
      const trends = generateTrends(walletDetails.transactionCount);
      const heatmapData = generateHeatmapData(walletDetails.transactionCount);
      const recommendations = generatePortfolioRecommendations(health, activitySummary, assetDistribution, trends);
      const insights = generatePortfolioInsights(health, activitySummary, assetDistribution, trends);

      const reportData: PortfolioIntelligenceReport = {
        address: target,
        generatedAt: Date.now(),
        health,
        metrics,
        assetDistribution,
        tokenDistribution,
        activitySummary,
        trends,
        insights,
        recommendations,
      };

      setReport(reportData);
      (reportData as PortfolioIntelligenceReport & { heatmapData?: typeof heatmapData }).heatmapData = heatmapData;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to analyze portfolio");
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const generateAiSummary = useCallback(async () => {
    if (!report) return;
    setIsGenerating(true);

    try {
      const payloads = buildPortfolioSummaryPayloads(
        report.health,
        report.metrics,
        report.assetDistribution,
        report.activitySummary,
        report.trends,
      );
      const messages = buildPortfolioSummaryMessages(aiLevel, payloads);

      const res = await fetch(
        `/api/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages,
            providerConfig: aiProvider,
          }),
        },
      );

      if (res.ok) {
        const data = await res.json();
        setAiSummary(data.content ?? data.message ?? "Summary generated.");
      } else {
        setAiSummary(
          `Portfolio Overview:\n` +
          `- Health: ${report.health.score}/100 (${report.health.level})\n` +
          `- ${report.activitySummary.totalTransactions} transactions, ${report.activitySummary.uniqueContracts} contracts\n` +
          `- ${report.assetDistribution.length} asset types, ${report.tokenDistribution.length} tokens\n` +
          `- ${report.recommendations.length} recommendations, ${report.insights.length} insights`
        );
      }
    } catch {
      setAiSummary(
        `Portfolio Overview:\n` +
        `- Health: ${report.health.score}/100 (${report.health.level})\n` +
        `- ${report.activitySummary.totalTransactions} transactions across ${report.activitySummary.activeDays} active days\n` +
        `- ${report.recommendations.length} recommendations available`
      );
    } finally {
      setIsGenerating(false);
    }
  }, [report, aiLevel, aiProvider]);

  const heatmapData = report ? generateHeatmapData(report.activitySummary.totalTransactions) : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter wallet address (0x...)"
            className="pl-9 font-mono text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter") analyze(address);
            }}
          />
        </div>
        <Button
          onClick={() => analyze(address)}
          disabled={isAnalyzing || !address.trim()}
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Portfolio"}
        </Button>
      </div>

      {error && (
        <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/5 text-sm text-red-600">
          {error}
        </div>
      )}

      {report && (
        <>
          <MetricsGrid metrics={report.metrics} />

          <div className="grid gap-4 lg:grid-cols-3">
            <PortfolioHealthCard health={report.health} />
            <div className="lg:col-span-2">
              <AISummaryCard
                summary={aiSummary}
                isGenerating={isGenerating}
                level={aiLevel}
                onToggleLevel={setAiLevel}
                onRefresh={generateAiSummary}
              />
            </div>
          </div>

          <ActivitySummaryCard activity={report.activitySummary} />

          <div className="grid gap-4 lg:grid-cols-2">
            <AssetAllocationChart distribution={report.assetDistribution} />
            <TokenDistributionChart tokens={report.tokenDistribution} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <PortfolioTrendChart trends={report.trends} />
            <ActivityTimeline trend={report.trends[0]} />
          </div>

          <ActivityHeatmap data={heatmapData} />

          <div className="grid gap-4 lg:grid-cols-2">
            <RecommendationsPanel recommendations={report.recommendations} />
            <RecentInsightsPanel insights={report.insights} />
          </div>

          <ExportCard report={report} />
        </>
      )}

      {!report && !isAnalyzing && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg font-medium mb-2">Enter a wallet address to get started</p>
          <p className="text-sm">
            BlockMind will analyze the portfolio, generate insights, and provide recommendations.
          </p>
        </div>
      )}
    </div>
  );
}
