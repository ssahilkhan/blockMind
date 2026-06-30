import { ethers } from 'ethers';
import { abiManager } from '../abi/abi.manager';

export function validateSoliditySource(source: unknown): string | null {
  if (typeof source !== 'string' || !source.trim()) {
    return 'Solidity source is required';
  }
  if (!source.includes('contract') && !source.includes('interface') && !source.includes('library')) {
    return 'Source must contain at least one contract, interface, or library definition';
  }
  return null;
}

export function validateABI(abi: unknown): string | null {
  return abiManager.validateABI(abi as unknown[]);
}

export function validateBytecode(bytecode: unknown): string | null {
  if (typeof bytecode !== 'string' || !bytecode) {
    return 'Bytecode is required';
  }
  if (!/^(0x)?[0-9a-fA-F]*$/.test(bytecode)) {
    return 'Bytecode must be a hex string';
  }
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

export function validateContractAddress(address: unknown): string | null {
  if (typeof address !== 'string' || !address) return 'Contract address is required';
  if (!ethers.isAddress(address)) return 'Invalid Ethereum address';
  return null;
}

export function validateFunctionName(name: unknown): string | null {
  if (typeof name !== 'string' || !name.trim()) {
    return 'Function name is required';
  }
  if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name)) {
    return 'Function name must be a valid identifier';
  }
  return null;
}

export function validateConstructorArgs(args: unknown): string | null {
  if (args === undefined || args === null) return null;
  if (!Array.isArray(args)) return 'Constructor arguments must be an array';
  return null;
}

export function validateFunctionArgs(args: unknown): string | null {
  if (args === undefined || args === null) return null;
  if (!Array.isArray(args)) return 'Function arguments must be an array';
  return null;
}

export function validateEncodeType(type: unknown): string | null {
  if (type !== 'constructor' && type !== 'function') {
    return "Type must be 'constructor' or 'function'";
  }
  return null;
}

export function validateCalldata(data: unknown): string | null {
  if (typeof data !== 'string' || !data) return 'Calldata is required';
  if (!data.startsWith('0x')) return 'Calldata must start with 0x';
  return null;
}

export function validateTxHash(hash: unknown): string | null {
  if (typeof hash !== 'string' || !hash) return 'Transaction hash is required';
  if (!/^0x[0-9a-fA-F]{64}$/.test(hash)) {
    return 'Transaction hash must be a 64-character hex string prefixed with 0x';
  }
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
