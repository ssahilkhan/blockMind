import { ethers } from 'ethers';
import { TokenStandard } from '../types/token.types';

export function validateTokenAddress(address: unknown): string | null {
  if (typeof address !== 'string' || !address) return 'Token address is required';
  if (!ethers.isAddress(address)) return 'Invalid token address';
  return null;
}

export function validateWalletAddress(address: unknown): string | null {
  if (typeof address !== 'string' || !address) return 'Wallet address is required';
  if (!ethers.isAddress(address)) return 'Invalid wallet address';
  return null;
}

export function validatePrivateKey(key: unknown): string | null {
  if (typeof key !== 'string' || !key) return 'Private key is required';
  const cleaned = key.startsWith('0x') ? key.slice(2) : key;
  if (!/^[0-9a-fA-F]{64}$/.test(cleaned)) {
    return 'Private key must be a 64-character hex string';
  }
  return null;
}

export function validateTokenId(tokenId: unknown): string | null {
  if (tokenId === undefined || tokenId === null) return null;
  if (typeof tokenId !== 'string') return 'Token ID must be a string';
  if (!/^\d+$/.test(tokenId)) return 'Token ID must be a numeric string';
  return null;
}

export function validateAmount(amount: unknown): string | null {
  if (amount === undefined || amount === null) return null;
  if (typeof amount !== 'string') return 'Amount must be a string';
  if (!/^\d+$/.test(amount)) return 'Amount must be a numeric string';
  return null;
}

export function validateStandard(standard: unknown): string | null {
  if (typeof standard !== 'string' || !standard) return 'Token standard is required';
  const validStandards: string[] = Object.values(TokenStandard).filter((s) => s !== TokenStandard.Unknown);
  if (!validStandards.includes(standard)) {
    return `Standard must be one of: ${validStandards.join(', ')}`;
  }
  return null;
}

export function validateSpender(spender: unknown): string | null {
  if (typeof spender !== 'string' || !spender) return 'Spender address is required';
  if (!ethers.isAddress(spender)) return 'Invalid spender address';
  return null;
}

export function validateOperator(operator: unknown): string | null {
  if (typeof operator !== 'string' || !operator) return 'Operator address is required';
  if (!ethers.isAddress(operator)) return 'Invalid operator address';
  return null;
}

export function validateApproved(approved: unknown): string | null {
  if (typeof approved !== 'boolean') return 'Approved must be a boolean';
  return null;
}
