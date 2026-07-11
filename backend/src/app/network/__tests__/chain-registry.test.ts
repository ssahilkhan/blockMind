import { ChainRegistry } from '../chain-registry';

describe('ChainRegistry', () => {
  let registry: ChainRegistry;

  beforeEach(() => {
    registry = new ChainRegistry();
  });

  describe('getChain', () => {
    it('should return Ethereum Mainnet', () => {
      const chain = registry.getChain(1);
      expect(chain).toBeDefined();
      expect(chain!.name).toBe('Ethereum Mainnet');
      expect(chain!.chainId).toBe(1);
      expect(chain!.type).toBe('mainnet');
    });

    it('should return Hardhat local chain', () => {
      const chain = registry.getChain(31337);
      expect(chain).toBeDefined();
      expect(chain!.name).toBe('Hardhat');
      expect(chain!.type).toBe('local');
      expect(chain!.isDefault).toBe(true);
    });

    it('should return Polygon', () => {
      const chain = registry.getChain(137);
      expect(chain).toBeDefined();
      expect(chain!.name).toBe('Polygon');
      expect(chain!.nativeCurrency.symbol).toBe('MATIC');
    });

    it('should return Arbitrum One', () => {
      const chain = registry.getChain(42161);
      expect(chain).toBeDefined();
      expect(chain!.name).toBe('Arbitrum One');
    });

    it('should return Optimism', () => {
      const chain = registry.getChain(10);
      expect(chain).toBeDefined();
      expect(chain!.name).toBe('Optimism');
    });

    it('should return Base', () => {
      const chain = registry.getChain(8453);
      expect(chain).toBeDefined();
      expect(chain!.name).toBe('Base');
    });

    it('should return Avalanche', () => {
      const chain = registry.getChain(43114);
      expect(chain).toBeDefined();
      expect(chain!.name).toBe('Avalanche C-Chain');
    });

    it('should return BNB Smart Chain', () => {
      const chain = registry.getChain(56);
      expect(chain).toBeDefined();
      expect(chain!.name).toBe('BNB Smart Chain');
    });

    it('should return undefined for unknown chain', () => {
      expect(registry.getChain(999999)).toBeUndefined();
    });
  });

  describe('getChainOrThrow', () => {
    it('should return chain for valid id', () => {
      const chain = registry.getChainOrThrow(1);
      expect(chain.chainId).toBe(1);
    });

    it('should throw for unknown chain', () => {
      expect(() => registry.getChainOrThrow(999999)).toThrow('Chain 999999 is not registered');
    });
  });

  describe('getAllChains', () => {
    it('should return all 11 chains', () => {
      const chains = registry.getAllChains();
      expect(chains.length).toBe(11);
    });
  });

  describe('getEnabledChains', () => {
    it('should return all enabled chains', () => {
      const chains = registry.getEnabledChains();
      expect(chains.length).toBeGreaterThanOrEqual(10);
      expect(chains.every((c) => c.isEnabled !== false)).toBe(true);
    });
  });

  describe('getMainnets', () => {
    it('should return mainnet chains', () => {
      const mainnets = registry.getMainnets();
      expect(mainnets.length).toBeGreaterThanOrEqual(7);
      expect(mainnets.every((c) => c.type === 'mainnet')).toBe(true);
    });
  });

  describe('getTestnets', () => {
    it('should return testnet chains', () => {
      const testnets = registry.getTestnets();
      expect(testnets.length).toBeGreaterThanOrEqual(3);
      expect(testnets.every((c) => c.type === 'testnet')).toBe(true);
    });
  });

  describe('getDefaultChain', () => {
    it('should return Hardhat as default', () => {
      const defaultChain = registry.getDefaultChain();
      expect(defaultChain.chainId).toBe(31337);
      expect(defaultChain.name).toBe('Hardhat');
    });
  });

  describe('isSupported', () => {
    it('should return true for supported chains', () => {
      expect(registry.isSupported(1)).toBe(true);
      expect(registry.isSupported(137)).toBe(true);
      expect(registry.isSupported(31337)).toBe(true);
    });

    it('should return false for unsupported chains', () => {
      expect(registry.isSupported(999999)).toBe(false);
    });
  });

  describe('getRpcUrl', () => {
    it('should return primary RPC URL', () => {
      const url = registry.getRpcUrl(1);
      expect(url).toBe('https://eth.llamarpc.com');
    });

    it('should return fallback RPC URL', () => {
      const url = registry.getRpcUrl(1, 2);
      expect(url).toBe('https://ethereum.publicnode.com');
    });

    it('should throw for out of bounds index', () => {
      expect(() => registry.getRpcUrl(1, 100)).toThrow('No RPC URL available');
    });
  });

  describe('getExplorerUrl', () => {
    it('should return address URL', () => {
      const url = registry.getExplorerUrl(1, 'address', '0x123');
      expect(url).toBe('https://etherscan.io/address/0x123');
    });

    it('should return tx URL', () => {
      const url = registry.getExplorerUrl(1, 'tx', '0xabc');
      expect(url).toBe('https://etherscan.io/tx/0xabc');
    });

    it('should return null for chains without explorers', () => {
      const url = registry.getExplorerUrl(31337, 'address', '0x123');
      expect(url).toBeNull();
    });
  });

  describe('registerChain', () => {
    it('should register a new chain', () => {
      registry.registerChain({
        chainId: 999,
        name: 'Test Chain',
        shortName: 'test',
        type: 'testnet',
        nativeCurrency: { name: 'Test', symbol: 'TST', decimals: 18 },
        rpcConfig: {
          rpcUrls: ['https://test.rpc'],
          fallbackRpcUrls: [],
          timeout: 5000,
          retryCount: 1,
          retryDelay: 500,
        },
        explorers: [],
        capabilities: {
          supportsEIP1559: true,
          supportsEIP2930: false,
          supportsContractVerification: false,
          supportsTokenApproval: true,
          supportsNFTs: false,
          supportsERC1155: false,
          maxBlockRange: 1000,
          avgBlockTime: 5,
          finalityBlocks: 10,
        },
      });
      expect(registry.isSupported(999)).toBe(true);
    });
  });

  describe('unregisterChain', () => {
    it('should unregister a non-default chain', () => {
      registry.registerChain({
        chainId: 999,
        name: 'Test',
        shortName: 'test',
        type: 'testnet',
        nativeCurrency: { name: 'T', symbol: 'T', decimals: 18 },
        rpcConfig: { rpcUrls: [''], fallbackRpcUrls: [], timeout: 5000, retryCount: 1, retryDelay: 500 },
        explorers: [],
        capabilities: {
          supportsEIP1559: false, supportsEIP2930: false, supportsContractVerification: false,
          supportsTokenApproval: false, supportsNFTs: false, supportsERC1155: false,
          maxBlockRange: 1000, avgBlockTime: 5, finalityBlocks: 10,
        },
      });
      expect(registry.unregisterChain(999)).toBe(true);
      expect(registry.isSupported(999)).toBe(false);
    });

    it('should not unregister default chain', () => {
      expect(() => registry.unregisterChain(31337)).toThrow('Cannot unregister the default chain');
    });
  });

  describe('capabilities', () => {
    it('should have correct EIP-1559 support', () => {
      expect(registry.getChainOrThrow(1).capabilities.supportsEIP1559).toBe(true);
      expect(registry.getChainOrThrow(56).capabilities.supportsEIP1559).toBe(false);
    });

    it('should have correct block times', () => {
      expect(registry.getChainOrThrow(1).capabilities.avgBlockTime).toBe(12);
      expect(registry.getChainOrThrow(42161).capabilities.avgBlockTime).toBe(0.25);
      expect(registry.getChainOrThrow(31337).capabilities.avgBlockTime).toBe(1);
    });
  });

  describe('toResponse', () => {
    it('should return serializable response', () => {
      const response = registry.toResponse();
      expect(response.length).toBeGreaterThanOrEqual(10);
      expect(response[0]).toHaveProperty('chainId');
      expect(response[0]).toHaveProperty('name');
      expect(response[0]).toHaveProperty('nativeCurrency');
      expect(response[0]).toHaveProperty('capabilities');
    });
  });
});
