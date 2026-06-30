import { ethers } from 'ethers';
import { abiManager } from '../abi/abi.manager';
import { logger } from '../../logger';
import { DecodeRequest, DecodeResult } from '../types/contract.types';

function formatArgs(parsed: ethers.Result): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(parsed)) {
    if (isNaN(Number(key))) {
      result[key] = formatValue(parsed[key]);
    }
  }
  return result;
}

function formatValue(value: unknown): unknown {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  if (value instanceof ethers.Result || Array.isArray(value)) {
    const arr = value as ArrayLike<unknown>;
    const result: Record<string, unknown> = {};
    for (let i = 0; i < arr.length; i++) {
      const key = Object.keys(arr).find((k) => arr[k as unknown as number] === arr[i] && isNaN(Number(k))) || i.toString();
      result[key.toString()] = formatValue(arr[i]);
    }
    return result;
  }
  return value;
}

export const decoderService = {
  decodeFunction(abi: unknown[], data: string): DecodeResult {
    const iface = abiManager.getInterface(abi);
    const parsed = iface.parseTransaction({ data });

    if (!parsed) {
      throw new Error('Unable to parse transaction data with given ABI');
    }

    logger.info('Function data decoded', { functionName: parsed.name });

    return {
      functionName: parsed.name,
      signature: parsed.signature,
      args: formatArgs(parsed.args),
    };
  },

  decodeInput(abi: unknown[], data: string): DecodeResult {
    return this.decodeFunction(abi, data);
  },
};
