import {
  AssetItem,
  BalanceEntry,
  HistoryEntry,
  NFTItem,
  PortfolioData,
  PortfolioSummary,
} from '../types/portfolio.types';

export interface AssetResponse {
  type: string;
  contractAddress: string | null;
  tokenId: string | null;
  name: string;
  symbol: string;
  decimals: number | null;
  balance: string;
  balanceWei: string | null;
  standard: string;
}

export interface NFTResponse {
  contractAddress: string;
  tokenId: string;
  name: string;
  symbol: string;
  metadataURI: string | null;
  standard: string;
}

export interface HistoryResponse {
  eventName: string;
  contract: string;
  transactionHash: string;
  blockNumber: number;
  args: Record<string, unknown>;
}

export interface SummaryResponse {
  totalAssets: number;
  tokenCount: number;
  nftCount: number;
  ethBalance: string;
  totalTransactions: number;
  firstActivity: string | null;
  latestActivity: string | null;
}

export interface PortfolioResponse {
  wallet: string;
  assets: AssetResponse[];
  balances: AssetResponse[];
  nfts: NFTResponse[];
  history: HistoryResponse[];
  summary: SummaryResponse;
}

export const portfolioMapper = {
  toAssetResponse(asset: AssetItem): AssetResponse {
    return {
      type: asset.type,
      contractAddress: asset.contractAddress,
      tokenId: asset.tokenId,
      name: asset.name,
      symbol: asset.symbol,
      decimals: asset.decimals,
      balance: asset.balance,
      balanceWei: asset.balanceWei,
      standard: asset.standard,
    };
  },

  toBalanceResponse(balance: BalanceEntry): AssetResponse {
    return {
      type: balance.type,
      contractAddress: balance.contractAddress,
      tokenId: balance.tokenId,
      name: balance.name,
      symbol: balance.symbol,
      decimals: balance.decimals,
      balance: balance.balance,
      balanceWei: balance.balanceWei,
      standard: balance.standard,
    };
  },

  toNFTResponse(nft: NFTItem): NFTResponse {
    return {
      contractAddress: nft.contractAddress,
      tokenId: nft.tokenId,
      name: nft.name,
      symbol: nft.symbol,
      metadataURI: nft.metadataURI,
      standard: nft.standard,
    };
  },

  toHistoryResponse(entry: HistoryEntry): HistoryResponse {
    return {
      eventName: entry.eventName,
      contract: entry.contract,
      transactionHash: entry.transactionHash,
      blockNumber: entry.blockNumber,
      args: entry.args,
    };
  },

  toSummaryResponse(summary: PortfolioSummary): SummaryResponse {
    return {
      totalAssets: summary.totalAssets,
      tokenCount: summary.tokenCount,
      nftCount: summary.nftCount,
      ethBalance: summary.ethBalance,
      totalTransactions: summary.totalTransactions,
      firstActivity: summary.firstActivity,
      latestActivity: summary.latestActivity,
    };
  },

  toPortfolioResponse(
    wallet: string,
    assets: AssetItem[],
    balances: BalanceEntry[],
    nfts: NFTItem[],
    history: HistoryEntry[],
    summary: PortfolioSummary
  ): PortfolioResponse {
    return {
      wallet,
      assets: assets.map((a) => this.toAssetResponse(a)),
      balances: balances.map((b) => this.toBalanceResponse(b)),
      nfts: nfts.map((n) => this.toNFTResponse(n)),
      history: history.map((h) => this.toHistoryResponse(h)),
      summary: this.toSummaryResponse(summary),
    };
  },
};
