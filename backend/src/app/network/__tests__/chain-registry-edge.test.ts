import { ChainRegistry } from '../chain-registry';

describe('ChainRegistry edge cases', () => {
  let registry: ChainRegistry;

  beforeEach(() => {
    registry = new ChainRegistry();
  });

  describe('all chains have required fields', () => {
    const chains = registry.getAllChains();

    it.each(chains.map((c) => [c.chainId, c.name]))(
      'chain %s (%s) has valid name',
      (_id, name) => {
        expect(typeof name).toBe('string');
        expect(name.length).toBeGreaterThan(0);
      },
    );

    it.each(chains.map((c) => [c.chainId, c.name]))(
      'chain %s (%s) has valid shortName',
      (_id, name) => {
        const chain = registry.getChain(_id as number)!;
        expect(typeof chain.shortName).toBe('string');
        expect(chain.shortName.length).toBeGreaterThan(0);
      },
    );

    it.each(chains.map((c) => [c.chainId, c.name]))(
      'chain %s (%s) has valid nativeCurrency',
      (_id, name) => {
        const chain = registry.getChain(_id as number)!;
        expect(chain.nativeCurrency.name).toBeTruthy();
        expect(chain.nativeCurrency.symbol).toBeTruthy();
        expect(chain.nativeCurrency.decimals).toBe(18);
      },
    );

    it.each(chains.map((c) => [c.chainId, c.name]))(
      'chain %s (%s) has RPC URLs',
      (_id, name) => {
        const chain = registry.getChain(_id as number)!;
        expect(chain.rpcConfig.rpcUrls.length).toBeGreaterThan(0);
        expect(chain.rpcConfig.rpcUrls[0]).toMatch(/^https?:\/\//);
      },
    );
  });

  describe('unique chain IDs', () => {
    it('should have unique chain IDs', () => {
      const chains = registry.getAllChains();
      const ids = chains.map((c) => c.chainId);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe('unique chain names', () => {
    it('should have unique names', () => {
      const chains = registry.getAllChains();
      const names = chains.map((c) => c.name);
      expect(new Set(names).size).toBe(names.length);
    });
  });

  describe('only one default chain', () => {
    it('should have exactly one default', () => {
      const chains = registry.getAllChains();
      const defaults = chains.filter((c) => c.isDefault);
      expect(defaults.length).toBe(1);
      expect(defaults[0].chainId).toBe(31337);
    });
  });

  describe('network types', () => {
    it('should have mainnet, testnet, and local chains', () => {
      const types = new Set(registry.getAllChains().map((c) => c.type));
      expect(types.has('mainnet')).toBe(true);
      expect(types.has('testnet')).toBe(true);
      expect(types.has('local')).toBe(true);
    });
  });

  describe('mainnet chain IDs', () => {
    it('should have correct mainnet chain IDs', () => {
      const mainnets = registry.getMainnets();
      const ids = mainnets.map((c) => c.chainId);
      expect(ids).toContain(1);     // Ethereum
      expect(ids).toContain(137);   // Polygon
      expect(ids).toContain(42161); // Arbitrum
      expect(ids).toContain(10);    // Optimism
      expect(ids).toContain(8453);  // Base
      expect(ids).toContain(43114); // Avalanche
      expect(ids).toContain(56);    // BSC
    });
  });
});
