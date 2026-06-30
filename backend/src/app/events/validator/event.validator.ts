import { ethers } from 'ethers';

export function validateTxHash(hash: unknown): string | null {
  if (typeof hash !== 'string' || !hash) return 'Transaction hash is required';
  if (!/^0x[0-9a-fA-F]{64}$/.test(hash)) {
    return 'Transaction hash must be a 64-character hex string prefixed with 0x';
  }
  return null;
}

export function validateBlockNumber(num: unknown): string | null {
  if (num === undefined || num === null) return null;
  const n = typeof num === 'string' ? parseInt(num, 10) : num;
  if (typeof n !== 'number' || isNaN(n) || n < 0) return 'Block number must be a non-negative integer';
  return null;
}

export function validateBlockRange(from: unknown, to: unknown): string | null {
  const fromNum = typeof from === 'string' ? parseInt(from, 10) : from;
  const toNum = typeof to === 'string' ? parseInt(to, 10) : to;

  if (typeof fromNum !== 'number' || isNaN(fromNum) || fromNum < 0) {
    return 'from must be a valid block number';
  }
  if (typeof toNum !== 'number' || isNaN(toNum) || toNum < 0) {
    return 'to must be a valid block number';
  }
  if (toNum < fromNum) return 'to must be >= from';
  if (toNum - fromNum > 100) return 'Block range cannot exceed 100 blocks';
  return null;
}

export function validateContractAddress(address: unknown): string | null {
  if (address === undefined || address === null) return null;
  if (typeof address !== 'string' || !address) return 'Contract address is required';
  if (!ethers.isAddress(address)) return 'Invalid contract address';
  return null;
}

export function validateEventName(name: unknown): string | null {
  if (name === undefined || name === null) return null;
  if (typeof name !== 'string' || !name.trim()) return 'Event name is required';
  return null;
}

export function validateWalletAddress(address: unknown): string | null {
  if (address === undefined || address === null) return null;
  if (typeof address !== 'string' || !address) return 'Wallet address is required';
  if (!ethers.isAddress(address)) return 'Invalid wallet address';
  return null;
}
