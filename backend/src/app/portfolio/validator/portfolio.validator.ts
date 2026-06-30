import { ethers } from 'ethers';

export function validateWalletAddress(address: unknown): string | null {
  if (typeof address !== 'string' || !address) return 'Wallet address is required';
  if (!ethers.isAddress(address)) return 'Invalid wallet address';
  return null;
}

export function validateLimit(limit: unknown): string | null {
  if (limit === undefined || limit === null) return null;
  const num = typeof limit === 'string' ? parseInt(limit, 10) : limit;
  if (typeof num !== 'number' || isNaN(num) || num < 1) return 'Limit must be a positive integer';
  if (num > 100) return 'Limit cannot exceed 100';
  return null;
}

export function validateBlockRange(fromBlock?: unknown, toBlock?: unknown): string | null {
  if (fromBlock !== undefined && fromBlock !== null) {
    const fb = typeof fromBlock === 'string' ? parseInt(fromBlock as string, 10) : fromBlock;
    if (typeof fb !== 'number' || isNaN(fb) || fb < 0) return 'Invalid fromBlock';
  }
  if (toBlock !== undefined && toBlock !== null) {
    const tb = typeof toBlock === 'string' ? parseInt(toBlock as string, 10) : toBlock;
    if (typeof tb !== 'number' || isNaN(tb) || tb < 0) return 'Invalid toBlock';
  }
  return null;
}
