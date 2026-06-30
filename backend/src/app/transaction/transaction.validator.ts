import { ethers } from 'ethers';

export function validatePrivateKey(key: unknown): string | null {
  if (typeof key !== 'string' || !key) return 'Private key is required';
  const cleaned = key.startsWith('0x') ? key.slice(2) : key;
  if (!/^[0-9a-fA-F]{64}$/.test(cleaned)) {
    return 'Private key must be a 64-character hex string';
  }
  return null;
}

export function validateAddress(address: unknown): string | null {
  if (address === undefined || address === null) return null;
  if (typeof address !== 'string' || !address) return 'Address must be a non-empty string';
  if (!ethers.isAddress(address)) return 'Invalid Ethereum address';
  return null;
}

export function validateValue(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') return 'Value must be a string';
  if (!/^\d+(\.\d+)?$/.test(value)) return 'Value must be a valid number string';
  const parsed = parseFloat(value);
  if (isNaN(parsed) || parsed < 0) return 'Value must be a non-negative number';
  return null;
}

export function validateData(data: unknown): string | null {
  if (data === undefined || data === null) return null;
  if (typeof data !== 'string' || !data.startsWith('0x')) return 'Data must be a hex string starting with 0x';
  return null;
}

export function validateNonce(nonce: unknown): string | null {
  if (nonce === undefined || nonce === null) return null;
  if (typeof nonce !== 'number' || !Number.isInteger(nonce) || nonce < 0) {
    return 'Nonce must be a non-negative integer';
  }
  return null;
}

export function validateGasLimit(gasLimit: unknown): string | null {
  if (gasLimit === undefined || gasLimit === null) return null;
  if (typeof gasLimit !== 'string') return 'Gas limit must be a string';
  const num = Number(gasLimit);
  if (isNaN(num) || num < 21000 || !Number.isInteger(num)) {
    return 'Gas limit must be an integer >= 21000';
  }
  return null;
}

export function validateGasPrice(gasPrice: unknown): string | null {
  if (gasPrice === undefined || gasPrice === null) return null;
  if (typeof gasPrice !== 'string') return 'Gas price must be a string';
  const num = parseFloat(gasPrice);
  if (isNaN(num) || num < 0) return 'Gas price must be a non-negative number';
  return null;
}

export function validateMaxFeePerGas(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') return 'maxFeePerGas must be a string';
  const num = parseFloat(value);
  if (isNaN(num) || num < 0) return 'maxFeePerGas must be a non-negative number';
  return null;
}

export function validateMaxPriorityFeePerGas(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string') return 'maxPriorityFeePerGas must be a string';
  const num = parseFloat(value);
  if (isNaN(num) || num < 0) return 'maxPriorityFeePerGas must be a non-negative number';
  return null;
}

export function validateChainId(chainId: unknown): string | null {
  if (chainId === undefined || chainId === null) return null;
  if (typeof chainId !== 'number' || !Number.isInteger(chainId) || chainId < 1) {
    return 'Chain ID must be a positive integer';
  }
  return null;
}

export function validateSignedTx(signedTx: unknown): string | null {
  if (typeof signedTx !== 'string' || !signedTx) return 'Signed transaction is required';
  if (!signedTx.startsWith('0x')) return 'Signed transaction must start with 0x';
  return null;
}

export function validateTxHash(hash: unknown): string | null {
  if (typeof hash !== 'string' || !hash) return 'Transaction hash is required';
  if (!/^0x[0-9a-fA-F]{64}$/.test(hash)) {
    return 'Transaction hash must be a 64-character hex string prefixed with 0x';
  }
  return null;
}
