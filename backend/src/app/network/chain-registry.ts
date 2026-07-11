import { ChainMetadata, NetworkCapability } from './chain-registry.types';

const CHAIN_METADATA: ChainMetadata[] = [
  {
    chainId: 1,
    name: 'Ethereum Mainnet',
    shortName: 'eth',
    type: 'mainnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcConfig: {
      rpcUrls: ['https://eth.llamarpc.com', 'https://rpc.ankr.com/eth'],
      fallbackRpcUrls: ['https://ethereum.publicnode.com'],
      timeout: 15_000,
      retryCount: 3,
      retryDelay: 1_000,
    },
    explorers: [
      { name: 'Etherscan', url: 'https://etherscan.io', apiUrl: 'https://api.etherscan.io/api' },
    ],
    capabilities: {
      supportsEIP1559: true,
      supportsEIP2930: true,
      supportsContractVerification: true,
      supportsTokenApproval: true,
      supportsNFTs: true,
      supportsERC1155: true,
      maxBlockRange: 2_000,
      avgBlockTime: 12,
      finalityBlocks: 12,
    },
    color: '#627EEA',
    isEnabled: true,
  },
  {
    chainId: 11155111,
    name: 'Sepolia',
    shortName: 'sepolia',
    type: 'testnet',
    nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
    rpcConfig: {
      rpcUrls: ['https://rpc.sepolia.org', 'https://ethereum-sepolia-rpc.publicnode.com'],
      fallbackRpcUrls: ['https://sepolia.drpc.org'],
      timeout: 15_000,
      retryCount: 3,
      retryDelay: 1_000,
    },
    explorers: [
      { name: 'Etherscan Sepolia', url: 'https://sepolia.etherscan.io', apiUrl: 'https://api-sepolia.etherscan.io/api' },
    ],
    capabilities: {
      supportsEIP1559: true,
      supportsEIP2930: true,
      supportsContractVerification: true,
      supportsTokenApproval: true,
      supportsNFTs: true,
      supportsERC1155: true,
      maxBlockRange: 2_000,
      avgBlockTime: 12,
      finalityBlocks: 12,
    },
    color: '#627EEA',
    isEnabled: true,
  },
  {
    chainId: 31337,
    name: 'Hardhat',
    shortName: 'hardhat',
    type: 'local',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcConfig: {
      rpcUrls: ['http://localhost:8545'],
      fallbackRpcUrls: [],
      timeout: 5_000,
      retryCount: 1,
      retryDelay: 500,
    },
    explorers: [],
    capabilities: {
      supportsEIP1559: true,
      supportsEIP2930: true,
      supportsContractVerification: false,
      supportsTokenApproval: true,
      supportsNFTs: true,
      supportsERC1155: true,
      maxBlockRange: 10_000,
      avgBlockTime: 1,
      finalityBlocks: 1,
    },
    color: '#F59E0B',
    isDefault: true,
    isEnabled: true,
  },
  {
    chainId: 137,
    name: 'Polygon',
    shortName: 'polygon',
    type: 'mainnet',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcConfig: {
      rpcUrls: ['https://polygon-rpc.com', 'https://rpc.ankr.com/polygon'],
      fallbackRpcUrls: ['https://polygon.publicnode.com'],
      timeout: 10_000,
      retryCount: 3,
      retryDelay: 1_000,
    },
    explorers: [
      { name: 'Polygonscan', url: 'https://polygonscan.com', apiUrl: 'https://api.polygonscan.com/api' },
    ],
    capabilities: {
      supportsEIP1559: true,
      supportsEIP2930: true,
      supportsContractVerification: true,
      supportsTokenApproval: true,
      supportsNFTs: true,
      supportsERC1155: true,
      maxBlockRange: 5_000,
      avgBlockTime: 2,
      finalityBlocks: 128,
    },
    color: '#8247E5',
    isEnabled: true,
  },
  {
    chainId: 80002,
    name: 'Polygon Amoy',
    shortName: 'amoy',
    type: 'testnet',
    nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
    rpcConfig: {
      rpcUrls: ['https://rpc-amoy.polygon.technology'],
      fallbackRpcUrls: ['https://polygon-amoy-bor-rpc.publicnode.com'],
      timeout: 10_000,
      retryCount: 3,
      retryDelay: 1_000,
    },
    explorers: [
      { name: 'Polygonscan Amoy', url: 'https://amoy.polygonscan.com', apiUrl: 'https://api-amoy.polygonscan.com/api' },
    ],
    capabilities: {
      supportsEIP1559: true,
      supportsEIP2930: true,
      supportsContractVerification: true,
      supportsTokenApproval: true,
      supportsNFTs: true,
      supportsERC1155: true,
      maxBlockRange: 5_000,
      avgBlockTime: 2,
      finalityBlocks: 128,
    },
    color: '#8247E5',
    isEnabled: true,
  },
  {
    chainId: 42161,
    name: 'Arbitrum One',
    shortName: 'arb',
    type: 'mainnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcConfig: {
      rpcUrls: ['https://arb1.arbitrum.io/rpc', 'https://rpc.ankr.com/arbitrum'],
      fallbackRpcUrls: ['https://arbitrum-one.publicnode.com'],
      timeout: 10_000,
      retryCount: 3,
      retryDelay: 1_000,
    },
    explorers: [
      { name: 'Arbiscan', url: 'https://arbiscan.io', apiUrl: 'https://api.arbiscan.io/api' },
    ],
    capabilities: {
      supportsEIP1559: true,
      supportsEIP2930: true,
      supportsContractVerification: true,
      supportsTokenApproval: true,
      supportsNFTs: true,
      supportsERC1155: true,
      maxBlockRange: 10_000,
      avgBlockTime: 0.25,
      finalityBlocks: 1,
    },
    color: '#28A0F0',
    isEnabled: true,
  },
  {
    chainId: 421614,
    name: 'Arbitrum Sepolia',
    shortName: 'arb-sep',
    type: 'testnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcConfig: {
      rpcUrls: ['https://sepolia-rollup.arbitrum.io/rpc'],
      fallbackRpcUrls: ['https://arbitrum-sepolia-rpc.publicnode.com'],
      timeout: 10_000,
      retryCount: 3,
      retryDelay: 1_000,
    },
    explorers: [
      { name: 'Arbiscan Sepolia', url: 'https://sepolia.arbiscan.io', apiUrl: 'https://api-sepolia.arbiscan.io/api' },
    ],
    capabilities: {
      supportsEIP1559: true,
      supportsEIP2930: true,
      supportsContractVerification: true,
      supportsTokenApproval: true,
      supportsNFTs: true,
      supportsERC1155: true,
      maxBlockRange: 10_000,
      avgBlockTime: 0.25,
      finalityBlocks: 1,
    },
    color: '#28A0F0',
    isEnabled: true,
  },
  {
    chainId: 10,
    name: 'Optimism',
    shortName: 'op',
    type: 'mainnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcConfig: {
      rpcUrls: ['https://mainnet.optimism.io', 'https://rpc.ankr.com/optimism'],
      fallbackRpcUrls: ['https://optimism.publicnode.com'],
      timeout: 10_000,
      retryCount: 3,
      retryDelay: 1_000,
    },
    explorers: [
      { name: 'Optimistic Etherscan', url: 'https://optimistic.etherscan.io', apiUrl: 'https://api-optimistic.etherscan.io/api' },
    ],
    capabilities: {
      supportsEIP1559: true,
      supportsEIP2930: true,
      supportsContractVerification: true,
      supportsTokenApproval: true,
      supportsNFTs: true,
      supportsERC1155: true,
      maxBlockRange: 10_000,
      avgBlockTime: 2,
      finalityBlocks: 1,
    },
    color: '#FF0420',
    isEnabled: true,
  },
  {
    chainId: 8453,
    name: 'Base',
    shortName: 'base',
    type: 'mainnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcConfig: {
      rpcUrls: ['https://mainnet.base.org', 'https://base.llamarpc.com'],
      fallbackRpcUrls: ['https://base.publicnode.com'],
      timeout: 10_000,
      retryCount: 3,
      retryDelay: 1_000,
    },
    explorers: [
      { name: 'Basescan', url: 'https://basescan.org', apiUrl: 'https://api.basescan.org/api' },
    ],
    capabilities: {
      supportsEIP1559: true,
      supportsEIP2930: true,
      supportsContractVerification: true,
      supportsTokenApproval: true,
      supportsNFTs: true,
      supportsERC1155: true,
      maxBlockRange: 10_000,
      avgBlockTime: 2,
      finalityBlocks: 1,
    },
    color: '#0052FF',
    isEnabled: true,
  },
  {
    chainId: 43114,
    name: 'Avalanche C-Chain',
    shortName: 'avax',
    type: 'mainnet',
    nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
    rpcConfig: {
      rpcUrls: ['https://api.avax.network/ext/bc/C/rpc', 'https://rpc.ankr.com/avalanche-c'],
      fallbackRpcUrls: ['https://avalanche-c-chain.publicnode.com'],
      timeout: 10_000,
      retryCount: 3,
      retryDelay: 1_000,
    },
    explorers: [
      { name: 'Snowtrace', url: 'https://snowtrace.io', apiUrl: 'https://api.routescan.io/v2/network/mainnet/evm/43114/etherscan' },
    ],
    capabilities: {
      supportsEIP1559: true,
      supportsEIP2930: true,
      supportsContractVerification: true,
      supportsTokenApproval: true,
      supportsNFTs: true,
      supportsERC1155: true,
      maxBlockRange: 2_000,
      avgBlockTime: 2,
      finalityBlocks: 1,
    },
    color: '#E84142',
    isEnabled: true,
  },
  {
    chainId: 56,
    name: 'BNB Smart Chain',
    shortName: 'bsc',
    type: 'mainnet',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcConfig: {
      rpcUrls: ['https://bsc-dataseed.binance.org', 'https://rpc.ankr.com/bsc'],
      fallbackRpcUrls: ['https://bsc.publicnode.com'],
      timeout: 10_000,
      retryCount: 3,
      retryDelay: 1_000,
    },
    explorers: [
      { name: 'BscScan', url: 'https://bscscan.com', apiUrl: 'https://api.bscscan.com/api' },
    ],
    capabilities: {
      supportsEIP1559: false,
      supportsEIP2930: false,
      supportsContractVerification: true,
      supportsTokenApproval: true,
      supportsNFTs: true,
      supportsERC1155: true,
      maxBlockRange: 5_000,
      avgBlockTime: 3,
      finalityBlocks: 15,
    },
    color: '#F0B90B',
    isEnabled: true,
  },
];

export class ChainRegistry {
  private chains: Map<number, ChainMetadata> = new Map();
  private defaultChainId: number = 31337;

  constructor() {
    for (const chain of CHAIN_METADATA) {
      this.chains.set(chain.chainId, chain);
      if (chain.isDefault) {
        this.defaultChainId = chain.chainId;
      }
    }
  }

  getChain(chainId: number): ChainMetadata | undefined {
    return this.chains.get(chainId);
  }

  getChainOrThrow(chainId: number): ChainMetadata {
    const chain = this.chains.get(chainId);
    if (!chain) {
      throw new Error(`Chain ${chainId} is not registered`);
    }
    return chain;
  }

  getAllChains(): ChainMetadata[] {
    return Array.from(this.chains.values());
  }

  getEnabledChains(): ChainMetadata[] {
    return this.getAllChains().filter((c) => c.isEnabled !== false);
  }

  getChainsByType(type: ChainMetadata['type']): ChainMetadata[] {
    return this.getAllChains().filter((c) => c.type === type);
  }

  getMainnets(): ChainMetadata[] {
    return this.getChainsByType('mainnet');
  }

  getTestnets(): ChainMetadata[] {
    return this.getChainsByType('testnet');
  }

  getDefaultChain(): ChainMetadata {
    return this.getChainOrThrow(this.defaultChainId);
  }

  getDefaultChainId(): number {
    return this.defaultChainId;
  }

  setDefaultChain(chainId: number): void {
    if (!this.chains.has(chainId)) {
      throw new Error(`Cannot set default: chain ${chainId} is not registered`);
    }
    this.defaultChainId = chainId;
  }

  isSupported(chainId: number): boolean {
    return this.chains.has(chainId);
  }

  getRpcUrl(chainId: number, index = 0): string {
    const chain = this.getChainOrThrow(chainId);
    const allUrls = [...chain.rpcConfig.rpcUrls, ...chain.rpcConfig.fallbackRpcUrls];
    if (index >= allUrls.length) {
      throw new Error(`No RPC URL available at index ${index} for chain ${chainId}`);
    }
    return allUrls[index];
  }

  getExplorerUrl(chainId: number, type: 'address' | 'tx' | 'block', value: string): string | null {
    const chain = this.getChain(chainId);
    if (!chain || chain.explorers.length === 0) return null;
    const base = chain.explorers[0].url;
    switch (type) {
      case 'address': return `${base}/address/${value}`;
      case 'tx': return `${base}/tx/${value}`;
      case 'block': return `${base}/block/${value}`;
    }
  }

  registerChain(metadata: ChainMetadata): void {
    this.chains.set(metadata.chainId, metadata);
  }

  unregisterChain(chainId: number): boolean {
    if (chainId === this.defaultChainId) {
      throw new Error('Cannot unregister the default chain');
    }
    return this.chains.delete(chainId);
  }

  toResponse(): Array<{
    chainId: number;
    name: string;
    shortName: string;
    type: string;
    nativeCurrency: { name: string; symbol: string; decimals: number };
    explorers: Array<{ name: string; url: string }>;
    capabilities: NetworkCapability;
    color: string | undefined;
    isDefault: boolean;
    isEnabled: boolean;
  }> {
    return this.getEnabledChains().map((c) => ({
      chainId: c.chainId,
      name: c.name,
      shortName: c.shortName,
      type: c.type,
      nativeCurrency: c.nativeCurrency,
      explorers: c.explorers.map((e) => ({ name: e.name, url: e.url })),
      capabilities: c.capabilities,
      color: c.color,
      isDefault: c.chainId === this.defaultChainId,
      isEnabled: c.isEnabled ?? true,
    }));
  }
}

export const chainRegistry = new ChainRegistry();
