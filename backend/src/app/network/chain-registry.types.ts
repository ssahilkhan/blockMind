export type NetworkType = 'mainnet' | 'testnet' | 'local';

export interface NativeCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface ExplorerURL {
  name: string;
  url: string;
  apiUrl?: string;
}

export interface RPCConfig {
  rpcUrls: string[];
  fallbackRpcUrls: string[];
  timeout: number;
  retryCount: number;
  retryDelay: number;
}

export interface NetworkCapability {
  supportsEIP1559: boolean;
  supportsEIP2930: boolean;
  supportsContractVerification: boolean;
  supportsTokenApproval: boolean;
  supportsNFTs: boolean;
  supportsERC1155: boolean;
  maxBlockRange: number;
  avgBlockTime: number;
  finalityBlocks: number;
}

export interface ChainMetadata {
  chainId: number;
  name: string;
  shortName: string;
  type: NetworkType;
  nativeCurrency: NativeCurrency;
  rpcConfig: RPCConfig;
  explorers: ExplorerURL[];
  capabilities: NetworkCapability;
  icon?: string;
  color?: string;
  isDefault?: boolean;
  isEnabled?: boolean;
}
