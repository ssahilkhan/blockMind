import { apiClient } from "@/lib/api-client";
import type { PortfolioSummary, PortfolioAsset, EventLog } from "@/types/api";

export interface PortfolioHistory {
  address: string;
  transactions: {
    hash: string;
    blockNumber: number;
    from: string;
    to: string;
    value: string;
    timestamp: string;
  }[];
}

export const portfolioApi = {
  getPortfolio: (wallet: string) =>
    apiClient<PortfolioSummary>(`/portfolio/${wallet}`),

  getAssets: (wallet: string) =>
    apiClient<PortfolioAsset[]>(`/portfolio/${wallet}/assets`),

  getBalances: (wallet: string) =>
    apiClient<{ balances: Record<string, string> }>(
      `/portfolio/${wallet}/balances`,
    ),

  getHistory: (wallet: string) =>
    apiClient<PortfolioHistory>(`/portfolio/${wallet}/history`),

  getNFTs: (wallet: string) =>
    apiClient<{ nfts: unknown[] }>(`/portfolio/${wallet}/nfts`),

  getSummary: (wallet: string) =>
    apiClient<PortfolioSummary>(`/portfolio/${wallet}/summary`),
};
