import { ethers } from 'ethers';
import { abiManager } from '../abi/abi.manager';
import { logger } from '../../logger';
import { EncodeRequest, EncodeResult } from '../types/contract.types';

export const encoderService = {
  encodeConstructor(abi: unknown[], args: unknown[]): string {
    const iface = abiManager.getInterface(abi);
    const encoded = iface.encodeDeploy(args as ethers.Result);
    logger.info('Constructor arguments encoded');
    return encoded;
  },

  encodeFunction(abi: unknown[], functionName: string, args: unknown[]): EncodeResult {
    const iface = abiManager.getInterface(abi);
    const func = iface.getFunction(functionName);
    if (!func) {
      throw new Error(`Function '${functionName}' not found in ABI`);
    }
    const encoded = iface.encodeFunctionData(functionName, args as ethers.Result);
    logger.info('Function data encoded', { functionName });
    return {
      encoded,
      functionSignature: func.format(),
    };
  },

  encode(request: EncodeRequest): EncodeResult {
    if (request.type === 'constructor') {
      const encoded = this.encodeConstructor(request.abi, request.args);
      return { encoded };
    }
    return this.encodeFunction(request.abi, request.functionName!, request.args);
  },
};
