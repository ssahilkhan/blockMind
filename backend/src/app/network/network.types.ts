export type {
  NetworkType,
  NativeCurrency,
  ExplorerURL,
  RPCConfig,
  NetworkCapability,
  ChainMetadata,
} from './chain-registry.types';

export interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  currency: string;
  explorerUrl?: string;
}
