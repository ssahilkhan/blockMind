import {
  validateTxHash,
  validateBlockNumber,
  validateBlockRange,
  validateContractAddress,
  validateEventName,
  validateWalletAddress,
} from '../validator/event.validator';

describe('Event Validators', () => {
  describe('validateTxHash', () => {
    it('should return null for valid tx hash', () => {
      expect(validateTxHash('0x' + 'a'.repeat(64))).toBeNull();
    });

    it('should return error for missing hash', () => {
      expect(validateTxHash('')).toBe('Transaction hash is required');
    });

    it('should return error for non-string', () => {
      expect(validateTxHash(123)).toBe('Transaction hash is required');
    });

    it('should return error for invalid hex', () => {
      expect(validateTxHash('0xzzz')).toBe('Transaction hash must be a 64-character hex string prefixed with 0x');
    });

    it('should return error for wrong length', () => {
      expect(validateTxHash('0x1234')).toBe('Transaction hash must be a 64-character hex string prefixed with 0x');
    });
  });

  describe('validateBlockNumber', () => {
    it('should return null for valid block number', () => {
      expect(validateBlockNumber(42)).toBeNull();
    });

    it('should return null for undefined', () => {
      expect(validateBlockNumber(undefined)).toBeNull();
    });

    it('should return null for null', () => {
      expect(validateBlockNumber(null)).toBeNull();
    });

    it('should return error for negative number', () => {
      expect(validateBlockNumber(-1)).toBe('Block number must be a non-negative integer');
    });

    it('should return error for NaN', () => {
      expect(validateBlockNumber(NaN)).toBe('Block number must be a non-negative integer');
    });
  });

  describe('validateBlockRange', () => {
    it('should return null for valid range', () => {
      expect(validateBlockRange(10, 20)).toBeNull();
    });

    it('should return error when to < from', () => {
      expect(validateBlockRange(20, 10)).toBe('to must be >= from');
    });

    it('should return error for range > 100', () => {
      expect(validateBlockRange(0, 200)).toBe('Block range cannot exceed 100 blocks');
    });

    it('should return error for invalid from', () => {
      expect(validateBlockRange(-1, 10)).toBe('from must be a valid block number');
    });

    it('should return error for invalid to', () => {
      expect(validateBlockRange(10, -1)).toBe('to must be a valid block number');
    });
  });

  describe('validateContractAddress', () => {
    it('should return null for valid address', () => {
      expect(validateContractAddress('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')).toBeNull();
    });

    it('should return null for undefined', () => {
      expect(validateContractAddress(undefined)).toBeNull();
    });

    it('should return error for invalid address', () => {
      expect(validateContractAddress('0x1234')).toBe('Invalid contract address');
    });
  });

  describe('validateEventName', () => {
    it('should return null for valid name', () => {
      expect(validateEventName('Transfer')).toBeNull();
    });

    it('should return null for undefined', () => {
      expect(validateEventName(undefined)).toBeNull();
    });

    it('should return error for empty string', () => {
      expect(validateEventName('')).toBe('Event name is required');
    });
  });

  describe('validateWalletAddress', () => {
    it('should return null for valid address', () => {
      expect(validateWalletAddress('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')).toBeNull();
    });

    it('should return null for undefined', () => {
      expect(validateWalletAddress(undefined)).toBeNull();
    });

    it('should return error for invalid address', () => {
      expect(validateWalletAddress('0x1234')).toBe('Invalid wallet address');
    });
  });
});
