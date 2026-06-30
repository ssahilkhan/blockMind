import { abiManager } from '../abi/abi.manager';

const VALID_ABI = [
  {
    type: 'function',
    name: 'get',
    inputs: [],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'CounterUpdated',
    inputs: [{ name: 'value', type: 'uint256', indexed: false }],
    anonymous: false,
  },
  {
    type: 'constructor',
    inputs: [{ name: '_initialValue', type: 'uint256' }],
  },
];

describe('abiManager', () => {
  describe('validateABI', () => {
    it('should return null for valid ABI', () => {
      expect(abiManager.validateABI(VALID_ABI)).toBeNull();
    });

    it('should return error for non-array input', () => {
      expect(abiManager.validateABI({} as unknown[])).toBe('ABI must be an array');
    });

    it('should return error for invalid entry type', () => {
      const bad = [{ type: 'invalid_type' }];
      expect(abiManager.validateABI(bad)).toMatch(/Invalid ABI entry type/);
    });

    it('should return error if function has no name', () => {
      const bad = [{ type: 'function', inputs: [] }];
      expect(abiManager.validateABI(bad)).toMatch(/must have a name/);
    });

    it('should return error for null entry', () => {
      const bad = [null];
      expect(abiManager.validateABI(bad)).toBe('Each ABI entry must be an object');
    });
  });

  describe('parseABI and getInterface', () => {
    it('should return an ethers Interface', () => {
      const iface = abiManager.parseABI(VALID_ABI);
      expect(iface).toBeDefined();
      expect(typeof iface.getFunction).toBe('function');
    });

    it('should cache parsed interfaces', () => {
      const iface1 = abiManager.getInterface(VALID_ABI);
      const iface2 = abiManager.getInterface(VALID_ABI);
      expect(iface1).toBe(iface2);
    });

    it('should find functions by name', () => {
      const iface = abiManager.getInterface(VALID_ABI);
      const func = iface.getFunction('get');
      expect(func).toBeDefined();
      expect(func!.name).toBe('get');
    });
  });
});
