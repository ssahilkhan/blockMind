import { encoderService } from '../encoder/encoder.service';
import { transactionService } from '../../transaction/transaction.service';
import { logger } from '../../logger';
import { WriteRequest, WriteResult } from '../types/contract.types';

export const executorService = {
  async execute(request: WriteRequest): Promise<WriteResult> {
    logger.info('Write call executed', { contractAddress: request.contractAddress, functionName: request.functionName });

    const encoded = encoderService.encodeFunction(request.abi, request.functionName, request.args);

    const broadcastResult = await transactionService.signAndSend(request.privateKey, {
      to: request.contractAddress,
      data: encoded.encoded,
      value: request.value,
    });

    logger.info('Write call transaction broadcast', {
      transactionHash: broadcastResult.transactionHash,
      functionName: request.functionName,
    });

    return {
      transactionHash: broadcastResult.transactionHash,
    };
  },
};
