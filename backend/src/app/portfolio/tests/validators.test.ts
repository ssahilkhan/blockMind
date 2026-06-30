import {
  validateWalletAddress,
  validateLimit,
  validateBlockRange,
} from '../validator/portfolio.validator';

describe('Portfolio Validators', () => {
  describe('validateWalletAddress', () => {
    it('should return null for valid address', () => {
      expect(validateWalletAddress('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')).toBeNull();
    });

    it('should return error for missing address', () => {
      expect(validateWalletAddress('')).toBe('Wallet address is required');
    });

    it('should return error for non-string', () => {
      expect(validateWalletAddress(123)).toBe('Wallet address is required');
    });

    it('should return error for invalid address', () => {
      expect(validateWalletAddress('0x1234')).toBe('Invalid wallet address');
    });
  });

  describe('validateLimit', () => {
    it('should return null for valid limit', () => {
      expect(validateLimit(10)).toBeNull();
    });

    it('should return null for undefined', () => {
      expect(validateLimit(undefined)).toBeNull();
    });

    it('should return null for null', () => {
      expect(validateLimit(null)).toBeNull();
    });

    it('should return error for zero', () => {
      expect(validateLimit(0)).toBe('Limit must be a positive integer');
    });

    it('should return error for negative', () => {
      expect(validateLimit(-1)).toBe('Limit must be a positive integer');
    });

    it('should return error for exceeding 100', () => {
      expect(validateLimit(101)).toBe('Limit cannot exceed 100');
    });

    it('should parse string numbers', () => {
      expect(validateLimit('50')).toBeNull();
    });

    it('should return error for NaN', () => {
      expect(validateLimit('abc')).toBe('Limit must be a positive integer');
    });
  });

  describe('validateBlockRange', () => {
    it('should return null for undefined values', () => {
      expect(validateBlockRange(undefined, undefined)).toBeNull();
    });

    it('should return null for valid range', () => {
      expect(validateBlockRange(10, 20)).toBeNull();
    });

    it('should return error for invalid fromBlock', () => {
      expect(validateBlockRange(-1, 10)).toBe('Invalid fromBlock');
    });

    it('should return error for invalid toBlock', () => {
      expect(validateBlockRange(10, -1)).toBe('Invalid toBlock');
    });
  });
});
