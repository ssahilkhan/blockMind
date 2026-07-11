export type TokenStandardType = "ERC20" | "ERC721" | "ERC1155" | "Unknown";

export interface DetectedToken {
  address: string;
  standard: TokenStandardType;
}

export interface TokenMeta {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  standard: string;
}

export interface RecentToken {
  address: string;
  name: string;
  symbol: string;
  standard: string;
  viewedAt: number;
}

export interface RecentTransfer {
  hash: string;
  tokenAddress: string;
  to: string;
  amount: string;
  standard: string;
  timestamp: number;
}

export const STANDARD_COLORS: Record<string, string> = {
  ERC20: "bg-blue-500/10 text-blue-600",
  ERC721: "bg-purple-500/10 text-purple-600",
  ERC1155: "bg-orange-500/10 text-orange-600",
  Unknown: "bg-gray-500/10 text-gray-600",
};

export const STANDARD_LABELS: Record<string, string> = {
  ERC20: "ERC-20 Fungible Token",
  ERC721: "ERC-721 Non-Fungible Token",
  ERC1155: "ERC-1155 Multi-Token",
  Unknown: "Unknown Standard",
};
