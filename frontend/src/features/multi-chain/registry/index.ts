import type { ChainMetadata } from '../types';

export const CHAIN_REGISTRY: ChainMetadata[] = [
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
      { name: 'Etherscan Sepolia', url: 'https://sepolia.etherscan.io' },
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
      { name: 'Polygonscan', url: 'https://polygonscan.com' },
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
      { name: 'Polygonscan Amoy', url: 'https://amoy.polygonscan.com' },
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
      { name: 'Arbiscan', url: 'https://arbiscan.io' },
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
      { name: 'Arbiscan Sepolia', url: 'https://sepolia.arbiscan.io' },
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
      { name: 'Optimistic Etherscan', url: 'https://optimistic.etherscan.io' },
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
      { name: 'Basescan', url: 'https://basescan.org' },
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
      { name: 'Snowtrace', url: 'https://snowtrace.io' },
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
      { name: 'BscScan', url: 'https://bscscan.com' },
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

const registryMap = new Map<number, ChainMetadata>(
  CHAIN_REGISTRY.map((c) => [c.chainId, c]),
);

export function getChainById(chainId: number): ChainMetadata | undefined {
  return registryMap.get(chainId);
}

export function getChainOrThrow(chainId: number): ChainMetadata {
  const chain = registryMap.get(chainId);
  if (!chain) throw new Error(`Chain ${chainId} not found in registry`);
  return chain;
}

export function getAllChains(): ChainMetadata[] {
  return [...CHAIN_REGISTRY];
}

export function getEnabledChains(): ChainMetadata[] {
  return CHAIN_REGISTRY.filter((c) => c.isEnabled !== false);
}

export function getMainnets(): ChainMetadata[] {
  return getEnabledChains().filter((c) => c.type === 'mainnet');
}

export function getTestnets(): ChainMetadata[] {
  return getEnabledChains().filter((c) => c.type === 'testnet');
}

export function getDefaultChain(): ChainMetadata {
  return CHAIN_REGISTRY.find((c) => c.isDefault) ?? CHAIN_REGISTRY[2];
}

export function getChainColor(chainId: number): string {
  return registryMap.get(chainId)?.color ?? '#6B7280';
}
