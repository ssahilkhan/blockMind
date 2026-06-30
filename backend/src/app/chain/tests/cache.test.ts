import { CacheService } from '../cache/cache.service';

describe('CacheService', () => {
  let cache: CacheService;

  beforeEach(() => {
    cache = new CacheService();
  });

  describe('basic operations', () => {
    it('should store and retrieve a value', () => {
      cache.set('key1', 'value1', 5000);
      expect(cache.get('key1')).toBe('value1');
    });

    it('should return undefined for missing key', () => {
      expect(cache.get('nonexistent')).toBeUndefined();
    });

    it('should delete a key', () => {
      cache.set('key1', 'value1', 5000);
      cache.delete('key1');
      expect(cache.get('key1')).toBeUndefined();
    });

    it('should clear all keys', () => {
      cache.set('key1', 'value1', 5000);
      cache.set('key2', 'value2', 5000);
      cache.clear();
      expect(cache.size()).toBe(0);
    });
  });

  describe('TTL', () => {
    it('should expire entries after TTL', () => {
      jest.useFakeTimers();
      cache.set('key1', 'value1', 100);
      jest.advanceTimersByTime(101);
      expect(cache.get('key1')).toBeUndefined();
      jest.useRealTimers();
    });

    it('should not expire before TTL', () => {
      jest.useFakeTimers();
      cache.set('key1', 'value1', 100);
      jest.advanceTimersByTime(99);
      expect(cache.get('key1')).toBe('value1');
      jest.useRealTimers();
    });
  });

  describe('wrap', () => {
    it('should call factory on cache miss', async () => {
      const factory = jest.fn().mockResolvedValue('computed');
      const result = await cache.wrap('key1', 5000, factory);
      expect(result).toBe('computed');
      expect(factory).toHaveBeenCalledTimes(1);
    });

    it('should return cached value on cache hit', async () => {
      const factory = jest.fn().mockResolvedValue('computed');
      await cache.wrap('key1', 5000, factory);
      const result = await cache.wrap('key1', 5000, factory);
      expect(result).toBe('computed');
      expect(factory).toHaveBeenCalledTimes(1);
    });
  });
});
