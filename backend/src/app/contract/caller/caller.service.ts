import { ethers } from 'ethers';
import { abiManager } from '../abi/abi.manager';
import { encoderService } from '../encoder/encoder.service';
import { getChainService } from '../../chain/services/chain.service';
import { logger } from '../../logger';
import { ReadRequest, ReadResult } from '../types/contract.types';

function formatValue(value: unknown): unknown {
  if (typeof value === 'bigint') return value.toString();
  if (value instanceof ethers.Result || Array.isArray(value)) {
    const arr = value as ArrayLike<unknown>;
    const result: unknown[] = [];
    for (let i = 0; i < arr.length; i++) {
      result.push(formatValue(arr[i]));
    }
    return result;
  }
  if (typeof value === 'object' && value !== null) {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      if (isNaN(Number(k))) {
        result[k] = formatValue(v);
      }
    }
    return result;
  }
  return value;
}

export const callerService = {
  async read(request: ReadRequest): Promise<ReadResult> {
    logger.info('Read call executed', { contractAddress: request.contractAddress, functionName: request.functionName });

    const iface = abiManager.getInterface(request.abi);
    const func = iface.getFunction(request.functionName);
    if (!func) {
      throw new Error(`Function '${request.functionName}' not found in ABI`);
    }

    const data = encoderService.encodeFunction(request.abi, request.functionName, request.args);

    const chain = getChainService();
    const rawResult = await chain.call({
      to: request.contractAddress,
      data: data.encoded,
    });

    const decoded = iface.decodeFunctionResult(request.functionName, rawResult);

    return {
      functionName: request.functionName,
      args: request.args,
      result: formatValue(decoded),
    };
  },
};
