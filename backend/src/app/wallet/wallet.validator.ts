import { ethers } from 'ethers';
import { VALID_MNEMONIC_LENGTHS } from './wallet.constants';

export function validatePrivateKey(key: unknown): string | null {
  if (typeof key !== 'string' || !key) {
    return 'Private key is required';
  }
  const cleaned = key.startsWith('0x') ? key.slice(2) : key;
  if (!/^[0-9a-fA-F]{64}$/.test(cleaned)) {
    return 'Private key must be a 64-character hex string';
  }
  return null;
}

export function validateMnemonic(mnemonic: unknown): string | null {
  if (typeof mnemonic !== 'string' || !mnemonic) {
    return 'Mnemonic is required';
  }
  const words = mnemonic.trim().split(/\s+/);
  if (!VALID_MNEMONIC_LENGTHS.includes(words.length)) {
    return `Mnemonic must have ${VALID_MNEMONIC_LENGTHS.join(', ')} words`;
  }
  return null;
}

export function validateSignature(signature: unknown): string | null {
  if (typeof signature !== 'string' || !signature) {
    return 'Signature is required';
  }
  const cleaned = signature.startsWith('0x') ? signature.slice(2) : signature;
  if (!/^[0-9a-fA-F]{130}$/.test(cleaned)) {
    return 'Signature must be a 130-character hex string representing 65 bytes (r, s, v)';
  }
  return null;
}

export function validateAddress(address: unknown): string | null {
  if (typeof address !== 'string' || !address) {
    return 'Address is required';
  }
  if (!ethers.isAddress(address)) {
    return 'Invalid Ethereum address';
  }
  return null;
}

export function validateMessage(message: unknown): string | null {
  if (typeof message !== 'string' || !message) {
    return 'Message is required';
  }
  return null;
}
