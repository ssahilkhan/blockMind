import { DEFAULT_PAGE_LIMIT, MAX_PAGE_LIMIT } from '../constants/indexer.constants';

export function validatePollInterval(ms: unknown): string | null {
  if (ms === undefined || ms === null) return null;
  if (typeof ms !== 'number' || isNaN(ms) || ms < 1000) {
    return 'Poll interval must be at least 1000ms';
  }
  return null;
}

export function validateBlockRange(from: unknown, to: unknown): string | null {
  const fromNum = typeof from === 'string' ? parseInt(from, 10) : (from as number | undefined);
  const toNum = typeof to === 'string' ? parseInt(to, 10) : (to as number | undefined);

  if (fromNum !== undefined && fromNum !== null) {
    if (typeof fromNum !== 'number' || isNaN(fromNum) || fromNum < 0) {
      return 'fromBlock must be a non-negative integer';
    }
  }
  if (toNum !== undefined && toNum !== null) {
    if (typeof toNum !== 'number' || isNaN(toNum) || toNum < 0) {
      return 'toBlock must be a non-negative integer';
    }
  }
  if (fromNum !== undefined && fromNum !== null && toNum !== undefined && toNum !== null && toNum < fromNum) {
    return 'toBlock must be >= fromBlock';
  }
  return null;
}

export function validatePagination(limitStr: unknown, offsetStr: unknown): { limit: number; offset: number; error: string | null } {
  const limit = limitStr !== undefined ? parseInt(String(limitStr), 10) : DEFAULT_PAGE_LIMIT;
  const offset = offsetStr !== undefined ? parseInt(String(offsetStr), 10) : 0;

  if (isNaN(limit) || limit < 1) return { limit: DEFAULT_PAGE_LIMIT, offset: 0, error: 'limit must be a positive integer' };
  if (limit > MAX_PAGE_LIMIT) return { limit: MAX_PAGE_LIMIT, offset, error: null };
  if (isNaN(offset) || offset < 0) return { limit, offset: 0, error: 'offset must be a non-negative integer' };

  return { limit, offset, error: null };
}
