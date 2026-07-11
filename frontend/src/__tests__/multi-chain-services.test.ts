import {
  getChainById,
  getChainOrThrow,
  getAllChains,
  getEnabledChains,
  getMainnets,
  getTestnets,
  getDefaultChain,
  getChainColor,
  CHAIN_REGISTRY,
} from '../features/multi-chain/registry';
import { networkApi } from '../features/multi-chain/services/network-api';

describe('Multi-Chain Services', () => {
  describe('networkApi', () => {
    it('should export getChains function', () => {
      expect(typeof networkApi.getChains).toBe('function');
    });

    it('should export getChain function', () => {
      expect(typeof networkApi.getChain).toBe('function');
    });

    it('should export getHealth function', () => {
      expect(typeof networkApi.getHealth).toBe('function');
    });

    it('should export getChainHealth function', () => {
      expect(typeof networkApi.getChainHealth).toBe('function');
    });

    it('should export switchChain function', () => {
      expect(typeof networkApi.switchChain).toBe('function');
    });

    it('should export getDefault function', () => {
      expect(typeof networkApi.getDefault).toBe('function');
    });
  });

  describe('registry functions', () => {
    it('getChainById returns correct chain', () => {
      const chain = getChainById(42161);
      expect(chain?.name).toBe('Arbitrum One');
    });

    it('getChainOrThrow throws for invalid', () => {
      expect(() => getChainOrThrow(0)).toThrow();
    });

    it('getAllChains returns all 11', () => {
      expect(getAllChains()).toHaveLength(11);
    });

    it('getEnabledChains returns only enabled', () => {
      const enabled = getEnabledChains();
      expect(enabled.every((c) => c.isEnabled !== false)).toBe(true);
    });

    it('getMainnets has 7+ chains', () => {
      expect(getMainnets().length).toBeGreaterThanOrEqual(7);
    });

    it('getTestnets has 3+ chains', () => {
      expect(getTestnets().length).toBeGreaterThanOrEqual(3);
    });

    it('getDefaultChain is Hardhat', () => {
      expect(getDefaultChain().chainId).toBe(31337);
    });

    it('getChainColor returns hex for known chain', () => {
      expect(getChainColor(1)).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });

    it('getChainColor returns fallback for unknown', () => {
      expect(getChainColor(0)).toBe('#6B7280');
    });
  });
});
