import { ethers } from 'ethers';
import { encoderService } from '../encoder/encoder.service';
import { transactionService } from '../../transaction/transaction.service';
import { getChainService } from '../../chain/services/chain.service';
import { logger } from '../../logger';
import { DeployRequest, DeployResult } from '../types/contract.types';
import { DEFAULT_GAS_LIMIT } from '../constants/contract.constants';

export const deployerService = {
  async deploy(request: DeployRequest): Promise<DeployResult> {
    logger.info('Deployment started');

    const encodedArgs = encoderService.encodeConstructor(request.abi, request.constructorArgs);
    const deployData = '0x' + request.bytecode + encodedArgs.slice(2);

    const broadcastResult = await transactionService.signAndSend(request.privateKey, {
      data: deployData,
      gasLimit: DEFAULT_GAS_LIMIT,
    });

    const { transactionHash } = broadcastResult;

    const chain = getChainService();
    const trackResult = await transactionService.trackTransaction(transactionHash);

    if (trackResult.status === 'confirmed' && trackResult.receipt) {
      const contractAddress = trackResult.receipt.contractAddress;
      if (!contractAddress) {
        logger.error('Deployment confirmed but no contract address in receipt');
        throw new Error('Deployment confirmed but no contract address in receipt');
      }

      logger.info('Deployment completed', { contractAddress, transactionHash });
      return {
        contractAddress,
        transactionHash,
        blockNumber: trackResult.receipt.blockNumber,
        gasUsed: trackResult.receipt.gasUsed,
        status: 'success',
      };
    }

    if (trackResult.status === 'failed') {
      logger.error('Deployment failed', { transactionHash });
      throw new Error(`Deployment failed: ${trackResult.error || 'Unknown error'}`);
    }

    logger.warn('Deployment pending', { transactionHash });
    throw new Error(`Deployment pending: transaction ${transactionHash} not yet mined`);
  },
};
