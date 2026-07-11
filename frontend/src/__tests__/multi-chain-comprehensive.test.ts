import { CHAIN_REGISTRY, getChainById, getEnabledChains, getMainnets, getTestnets, getDefaultChain } from '../features/multi-chain/registry';
import { CHAIN_COLORS, NETWORK_TYPE_LABELS } from '../features/multi-chain/types';
import type { ChainMetadata, ChainHealthState, ChainContextValue } from '../features/multi-chain/types';

describe('Multi-Chain Registry + Types comprehensive', () => {
  describe('registry completeness', () => {
    it('should have Ethereum Mainnet (1)', () => {
      const chain = getChainById(1);
      expect(chain).toBeDefined();
      expect(chain!.name).toBe('Ethereum Mainnet');
      expect(chain!.shortName).toBe('eth');
      expect(chain!.type).toBe('mainnet');
      expect(chain!.nativeCurrency.symbol).toBe('ETH');
    });

    it('should have Sepolia (11155111)', () => {
      const chain = getChainById(11155111);
      expect(chain).toBeDefined();
      expect(chain!.name).toBe('Sepolia');
      expect(chain!.type).toBe('testnet');
    });

    it('should have Hardhat (31337)', () => {
      const chain = getChainById(31337);
      expect(chain).toBeDefined();
      expect(chain!.isDefault).toBe(true);
    });

    it('should have Polygon (137)', () => {
      const chain = getChainById(137);
      expect(chain!.nativeCurrency.symbol).toBe('MATIC');
    });

    it('should have Polygon Amoy (80002)', () => {
      const chain = getChainById(80002);
      expect(chain).toBeDefined();
      expect(chain!.type).toBe('testnet');
    });

    it('should have Arbitrum One (42161)', () => {
      const chain = getChainById(42161);
      expect(chain!.capabilities.avgBlockTime).toBe(0.25);
    });

    it('should have Arbitrum Sepolia (421614)', () => {
      const chain = getChainById(421614);
      expect(chain).toBeDefined();
      expect(chain!.type).toBe('testnet');
    });

    it('should have Optimism (10)', () => {
      const chain = getChainById(10);
      expect(chain!.color).toBe('#FF0420');
    });

    it('should have Base (8453)', () => {
      const chain = getChainById(8453);
      expect(chain!.color).toBe('#0052FF');
    });

    it('should have Avalanche (43114)', () => {
      const chain = getChainById(43114);
      expect(chain!.nativeCurrency.symbol).toBe('AVAX');
    });

    it('should have BNB Smart Chain (56)', () => {
      const chain = getChainById(56);
      expect(chain!.capabilities.supportsEIP1559).toBe(false);
    });
  });

  describe('color map matches registry', () => {
    for (const chain of CHAIN_REGISTRY) {
      it(`CHAIN_COLORS[${chain.chainId}] matches registry color for ${chain.name}`, () => {
        expect(CHAIN_COLORS[chain.chainId]).toBe(chain.color);
      });
    }
  });

  describe('network type labels', () => {
    it('should map all network types', () => {
      const types = new Set(CHAIN_REGISTRY.map((c) => c.type));
      for (const t of types) {
        expect(NETWORK_TYPE_LABELS[t]).toBeDefined();
      }
    });
  });

  describe('chain capabilities consistency', () => {
    it('all chains should have valid block times', () => {
      for (const chain of CHAIN_REGISTRY) {
        expect(chain.capabilities.avgBlockTime).toBeGreaterThan(0);
      }
    });

    it('all chains should have valid finality blocks', () => {
      for (const chain of CHAIN_REGISTRY) {
        expect(chain.capabilities.finalityBlocks).toBeGreaterThan(0);
      }
    });

    it('mainnets should have longer finality than local', () => {
      const local = getChainById(31337)!;
      const eth = getChainById(1)!;
      expect(eth.capabilities.finalityBlocks).toBeGreaterThanOrEqual(local.capabilities.finalityBlocks);
    });
  });

  describe('ChainHealthState mock', () => {
    const health: ChainHealthState = {
      chainId: 1,
      connected: true,
      latency: 150,
      latestBlock: 19000000,
      lastChecked: new Date(),
      error: null,
      rpcUrl: 'https://eth.llamarpc.com',
      rpcIndex: 0,
      consecutiveFailures: 0,
    };

    it('should be connected', () => {
      expect(health.connected).toBe(true);
    });

    it('should have valid latency', () => {
      expect(health.latency).toBeGreaterThan(0);
    });
  });
});
