import { CHAIN_COLORS, NETWORK_TYPE_LABELS } from '../features/multi-chain/types';
import type { ChainMetadata } from '../features/multi-chain/types';

describe('Multi-Chain Types', () => {
  describe('CHAIN_COLORS', () => {
    it('should have colors for all mainnet chains', () => {
      expect(CHAIN_COLORS[1]).toBe('#627EEA');
      expect(CHAIN_COLORS[137]).toBe('#8247E5');
      expect(CHAIN_COLORS[42161]).toBe('#28A0F0');
      expect(CHAIN_COLORS[10]).toBe('#FF0420');
      expect(CHAIN_COLORS[8453]).toBe('#0052FF');
      expect(CHAIN_COLORS[43114]).toBe('#E84142');
      expect(CHAIN_COLORS[56]).toBe('#F0B90B');
    });

    it('should have color for Hardhat', () => {
      expect(CHAIN_COLORS[31337]).toBe('#F59E0B');
    });
  });

  describe('NETWORK_TYPE_LABELS', () => {
    it('should have labels for all network types', () => {
      expect(NETWORK_TYPE_LABELS.mainnet).toBe('Mainnet');
      expect(NETWORK_TYPE_LABELS.testnet).toBe('Testnet');
      expect(NETWORK_TYPE_LABELS.local).toBe('Local');
    });
  });

  describe('ChainMetadata type shape', () => {
    const mockChain: ChainMetadata = {
      chainId: 1,
      name: 'Test',
      shortName: 'test',
      type: 'mainnet',
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      rpcConfig: {
        rpcUrls: ['https://rpc.test'],
        fallbackRpcUrls: [],
        timeout: 5000,
        retryCount: 3,
        retryDelay: 1000,
      },
      explorers: [{ name: 'TestScan', url: 'https://testscan.io' }],
      capabilities: {
        supportsEIP1559: true,
        supportsEIP2930: false,
        supportsContractVerification: true,
        supportsTokenApproval: true,
        supportsNFTs: true,
        supportsERC1155: false,
        maxBlockRange: 1000,
        avgBlockTime: 12,
        finalityBlocks: 12,
      },
      color: '#000000',
    };

    it('should have correct structure', () => {
      expect(mockChain.chainId).toBe(1);
      expect(mockChain.name).toBe('Test');
      expect(mockChain.type).toBe('mainnet');
      expect(mockChain.nativeCurrency.decimals).toBe(18);
      expect(mockChain.rpcConfig.rpcUrls.length).toBe(1);
      expect(mockChain.capabilities.supportsEIP1559).toBe(true);
    });
  });
});
