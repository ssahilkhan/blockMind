import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  PortfolioIntelligenceReport,
  PortfolioHealth,
  PortfolioMetric,
  AssetDistribution,
  TokenDistribution,
  ActivitySummary,
  PortfolioTrend,
  PortfolioInsight,
  PortfolioRecommendation,
} from "../types";

interface PortfolioIntelligenceState {
  activeAddress: string;
  report: PortfolioIntelligenceReport | null;
  isAnalyzing: boolean;
  error: string | null;
  timeframe: "daily" | "weekly" | "monthly";

  setActiveAddress: (address: string) => void;
  setReport: (report: PortfolioIntelligenceReport) => void;
  setIsAnalyzing: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setTimeframe: (tf: "daily" | "weekly" | "monthly") => void;
  clearReport: () => void;
}

export const usePortfolioStore = create<PortfolioIntelligenceState>()(
  persist(
    (set) => ({
      activeAddress: "",
      report: null,
      isAnalyzing: false,
      error: null,
      timeframe: "daily",

      setActiveAddress: (address: string) => set({ activeAddress: address }),
      setReport: (report: PortfolioIntelligenceReport) => set({ report }),
      setIsAnalyzing: (loading: boolean) => set({ isAnalyzing: loading }),
      setError: (error: string | null) => set({ error }),
      setTimeframe: (tf) => set({ timeframe: tf }),
      clearReport: () => set({ report: null, error: null }),
    }),
    { name: "blockmind-portfolio-intelligence" },
  ),
);
