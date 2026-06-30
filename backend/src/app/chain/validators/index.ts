export function validateBlockNumber(value: unknown): string | null {
  if (value === undefined || value === null) return 'Block number is required';
  const num = Number(value);
  if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
    return 'Block number must be a non-negative integer';
  }
  return null;
}

export function validateBlockHash(value: unknown): string | null {
  if (typeof value !== 'string' || !value) return 'Block hash is required';
  if (!/^0x[0-9a-fA-F]{64}$/.test(value)) {
    return 'Block hash must be a 64-character hex string prefixed with 0x';
  }
  return null;
}

export function validateTransactionHash(value: unknown): string | null {
  if (typeof value !== 'string' || !value) return 'Transaction hash is required';
  if (!/^0x[0-9a-fA-F]{64}$/.test(value)) {
    return 'Transaction hash must be a 64-character hex string prefixed with 0x';
  }
  return null;
}

export function validateLimit(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  const num = Number(value);
  if (isNaN(num) || num < 1 || num > 100 || !Number.isInteger(num)) {
    return 'Limit must be an integer between 1 and 100';
  }
  return null;
}

export function validateSearchQuery(value: unknown): string | null {
  if (typeof value !== 'string' || !value) return 'Search query is required';
  return null;
}
