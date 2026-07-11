import {
  CHAIN_REGISTRY,
  getChainById,
  getChainOrThrow,
  getAllChains,
  getEnabledChains,
  getMainnets,
  getTestnets,
  getDefaultChain,
  getChainColor,
} from '../features/multi-chain/registry';

describe('Chain Registry (Frontend)', () => {
  describe('CHAIN_REGISTRY', () => {
    it('should contain 11 chains', () => {
      expect(CHAIN_REGISTRY.length).toBe(11);
    });

    it('should have all chains with required fields', () => {
      for (const chain of CHAIN_REGISTRY) {
        expect(chain.chainId).toBeGreaterThan(0);
        expect(chain.name).toBeTruthy();
        expect(chain.shortName).toBeTruthy();
        expect(chain.nativeCurrency).toBeDefined();
        expect(chain.rpcConfig).toBeDefined();
        expect(chain.capabilities).toBeDefined();
      }
    });
  });

  describe('getChainById', () => {
    it('should return Ethereum Mainnet', () => {
      const chain = getChainById(1);
      expect(chain).toBeDefined();
      expect(chain!.name).toBe('Ethereum Mainnet');
    });

    it('should return Hardhat', () => {
      const chain = getChainById(31337);
      expect(chain).toBeDefined();
      expect(chain!.name).toBe('Hardhat');
    });

    it('should return undefined for unknown chain', () => {
      expect(getChainById(999999)).toBeUndefined();
    });
  });

  describe('getChainOrThrow', () => {
    it('should return chain for valid id', () => {
      const chain = getChainOrThrow(137);
      expect(chain.name).toBe('Polygon');
    });

    it('should throw for unknown chain', () => {
      expect(() => getChainOrThrow(999999)).toThrow();
    });
  });

  describe('getEnabledChains', () => {
    it('should return at least 10 chains', () => {
      expect(getEnabledChains().length).toBeGreaterThanOrEqual(10);
    });
  });

  describe('getMainnets', () => {
    it('should return mainnet chains only', () => {
      const mainnets = getMainnets();
      expect(mainnets.every((c) => c.type === 'mainnet')).toBe(true);
      expect(mainnets.length).toBeGreaterThanOrEqual(7);
    });
  });

  describe('getTestnets', () => {
    it('should return testnet chains only', () => {
      const testnets = getTestnets();
      expect(testnets.every((c) => c.type === 'testnet')).toBe(true);
      expect(testnets.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('getDefaultChain', () => {
    it('should return Hardhat as default', () => {
      expect(getDefaultChain().chainId).toBe(31337);
    });
  });

  describe('getChainColor', () => {
    it('should return color for known chain', () => {
      expect(getChainColor(1)).toBe('#627EEA');
      expect(getChainColor(137)).toBe('#8247E5');
    });

    it('should return default color for unknown chain', () => {
      expect(getChainColor(999999)).toBe('#6B7280');
    });
  });

  describe('all chains have unique IDs', () => {
    it('should have unique chain IDs', () => {
      const ids = CHAIN_REGISTRY.map((c) => c.chainId);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe('EVM compatibility', () => {
    it('all chains should support token approval', () => {
      for (const chain of getEnabledChains()) {
        expect(chain.capabilities.supportsTokenApproval).toBe(true);
      }
    });

    it('all chains should support NFTs', () => {
      for (const chain of getEnabledChains()) {
        expect(chain.capabilities.supportsNFTs).toBe(true);
      }
    });
  });
});
