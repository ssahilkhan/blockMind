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

export interface ChainHealthState {
  chainId: number;
  connected: boolean;
  latency: number;
  latestBlock: number;
  lastChecked: Date;
  error: string | null;
  rpcUrl: string;
  rpcIndex: number;
  consecutiveFailures: number;
}

export interface ChainContextValue {
  currentChain: ChainMetadata;
  currentChainId: number;
  setCurrentChain: (chainId: number) => void;
  health: ChainHealthState | null;
  allChains: ChainMetadata[];
  mainnets: ChainMetadata[];
  testnets: ChainMetadata[];
  isOnline: boolean;
}

export interface ChainRegistryResponse {
  networks: ChainMetadata[];
  defaultChainId: number;
}

export interface ChainHealthResponse {
  networks: ChainHealthState[];
}

export interface ChainSwitchRequest {
  chainId: number;
}

export interface ChainSwitchResponse {
  chainId: number;
  name: string;
  health: ChainHealthState;
}

export const CHAIN_COLORS: Record<number, string> = {
  1: '#627EEA',
  11155111: '#627EEA',
  31337: '#F59E0B',
  137: '#8247E5',
  80002: '#8247E5',
  42161: '#28A0F0',
  421614: '#28A0F0',
  10: '#FF0420',
  8453: '#0052FF',
  43114: '#E84142',
  56: '#F0B90B',
};

export const NETWORK_TYPE_LABELS: Record<NetworkType, string> = {
  mainnet: 'Mainnet',
  testnet: 'Testnet',
  local: 'Local',
};
