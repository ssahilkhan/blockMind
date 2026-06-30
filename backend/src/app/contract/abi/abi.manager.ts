import { ethers } from 'ethers';
import { logger } from '../../logger';

type InterfaceCache = Map<string, ethers.Interface>;

const interfaceCache: InterfaceCache = new Map();

function cacheKey(abi: unknown[]): string {
  return JSON.stringify(abi);
}

export const abiManager = {
  validateABI(abi: unknown[]): string | null {
    if (!Array.isArray(abi)) return 'ABI must be an array';

    for (const entry of abi) {
      if (typeof entry !== 'object' || entry === null) {
        return 'Each ABI entry must be an object';
      }
      const item = entry as Record<string, unknown>;
      if (typeof item.type !== 'string') {
        return 'Each ABI entry must have a type field';
      }
      if (!/^(function|constructor|event|error|fallback|receive)$/.test(item.type as string)) {
        return `Invalid ABI entry type: ${item.type}`;
      }
      if (item.type === 'function' || item.type === 'event') {
        if (typeof item.name !== 'string' || !item.name) {
          return `ABI entry of type '${item.type}' must have a name`;
        }
      }
    }

    return null;
  },

  parseABI(abi: unknown[]): ethers.Interface {
    const key = cacheKey(abi);
    const cached = interfaceCache.get(key);
    if (cached) return cached;

    const iface = new ethers.Interface(abi as ethers.InterfaceAbi);
    interfaceCache.set(key, iface);
    logger.info('ABI parsed and cached');
    return iface;
  },

  getInterface(abi: unknown[]): ethers.Interface {
    return this.parseABI(abi);
  },
};
