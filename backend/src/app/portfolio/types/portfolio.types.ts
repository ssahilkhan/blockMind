import { TokenStandard } from '../../token/types/token.types';

export interface AssetItem {
  type: 'native' | 'ERC20' | 'ERC721' | 'ERC1155';
  contractAddress: string | null;
  tokenId: string | null;
  name: string;
  symbol: string;
  decimals: number | null;
  balance: string;
  balanceWei: string | null;
  standard: TokenStandard | 'native';
  metadataURI: string | null;
}

export interface NFTItem {
  contractAddress: string;
  tokenId: string;
  name: string;
  symbol: string;
  metadataURI: string | null;
  standard: TokenStandard;
}

export interface BalanceEntry {
  type: 'native' | 'ERC20' | 'ERC721' | 'ERC1155';
  contractAddress: string | null;
  tokenId: string | null;
  balance: string;
  balanceWei: string | null;
  name: string;
  symbol: string;
  decimals: number | null;
  standard: TokenStandard | 'native';
}

export interface HistoryEntry {
  eventName: string;
  contract: string;
  transactionHash: string;
  blockNumber: number;
  timestamp: string | null;
  args: Record<string, unknown>;
  standard: string;
}

export interface PortfolioSummary {
  totalAssets: number;
  tokenCount: number;
  nftCount: number;
  ethBalance: string;
  totalTransactions: number;
  firstActivity: string | null;
  latestActivity: string | null;
}

export interface PortfolioData {
  wallet: string;
  assets: AssetItem[];
  balances: BalanceEntry[];
  nfts: NFTItem[];
  history: HistoryEntry[];
  summary: PortfolioSummary;
}
