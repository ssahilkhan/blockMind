export type NetworkType = 'mainnet' | 'testnet' | 'devnet';

export interface NativeCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface ExplorerURL {
  transaction: string;
  address: string;
  block: string;
  token: string;
}

export interface RPCConfig {
  primary: string;
  fallbacks: string[];
  timeout: number;
  retries: number;
}

export type NetworkCapability =
  | 'evm'
  | 'erc20'
  | 'erc721'
  | 'erc1155'
  | 'contracts'
  | 'events'
  | 'indexer'
  | 'portfolio'
  | 'gas-estimation'
  | 'nonce-tracking';

export interface ChainMetadata {
  chainId: number;
  name: string;
  shortName: string;
  networkType: NetworkType;
  nativeCurrency: NativeCurrency;
  rpc: RPCConfig;
  explorer: ExplorerURL | null;
  capabilities: Set<NetworkCapability>;
  iconColor: string;
  blockTime: number;
  isDefault: boolean;
}

export interface ChainHealthStatus {
  chainId: number;
  connected: boolean;
  latency: number;
  latestBlock: number;
  lastChecked: Date;
  error: string | null;
}

export interface NetworkRegistryEntry {
  metadata: ChainMetadata;
  health: ChainHealthStatus;
}

export interface ChainRegistryResponse {
  networks: ChainMetadata[];
  defaultChainId: number;
}
