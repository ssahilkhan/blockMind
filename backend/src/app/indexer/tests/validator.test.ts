import { validatePollInterval, validateBlockRange, validatePagination } from '../validator/indexer.validator';

describe('indexer validator', () => {
  describe('validatePollInterval', () => {
    it('should return null for valid intervals', () => {
      expect(validatePollInterval(5000)).toBeNull();
      expect(validatePollInterval(1000)).toBeNull();
      expect(validatePollInterval(undefined)).toBeNull();
      expect(validatePollInterval(null)).toBeNull();
    });

    it('should return error for invalid intervals', () => {
      expect(validatePollInterval(999)).not.toBeNull();
      expect(validatePollInterval(0)).not.toBeNull();
      expect(validatePollInterval(-1)).not.toBeNull();
      expect(validatePollInterval(NaN)).not.toBeNull();
    });
  });

  describe('validateBlockRange', () => {
    it('should return null for valid ranges', () => {
      expect(validateBlockRange(1, 10)).toBeNull();
      expect(validateBlockRange(5, 5)).toBeNull();
      expect(validateBlockRange(undefined, 10)).toBeNull();
      expect(validateBlockRange(1, undefined)).toBeNull();
    });

    it('should return error for invalid ranges', () => {
      expect(validateBlockRange(-1, 10)).not.toBeNull();
      expect(validateBlockRange(10, 5)).not.toBeNull();
      expect(validateBlockRange(-1, -1)).not.toBeNull();
    });
  });

  describe('validatePagination', () => {
    it('should return default values for empty input', () => {
      const result = validatePagination(undefined, undefined);
      expect(result.limit).toBe(20);
      expect(result.offset).toBe(0);
      expect(result.error).toBeNull();
    });

    it('should cap limit at MAX_PAGE_LIMIT', () => {
      const result = validatePagination('200', '0');
      expect(result.limit).toBe(100);
      expect(result.error).toBeNull();
    });

    it('should return error for invalid limit', () => {
      const result = validatePagination('abc', '0');
      expect(result.error).not.toBeNull();
    });

    it('should return error for negative offset', () => {
      const result = validatePagination('10', '-1');
      expect(result.error).not.toBeNull();
    });
  });
});
