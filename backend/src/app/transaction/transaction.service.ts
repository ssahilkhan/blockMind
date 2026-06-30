import { ethers } from 'ethers';
import { getChainService } from '../chain/services/chain.service';
import { walletService } from '../wallet/wallet.service';
import { logger } from '../logger';
import {
  BuildTransactionParams,
  EstimateGasParams,
  GasEstimateResult,
  BroadcastResult,
  TrackResult,
} from './transaction.types';

export const transactionService = {
  async buildTransaction(params: BuildTransactionParams): Promise<BuildTransactionParams> {
    const chain = getChainService();
    const network = await chain.getNetwork();

    const tx: BuildTransactionParams = { ...params };

    if (tx.chainId === undefined) {
      tx.chainId = network.chainId;
    }

    return tx;
  },

  async estimateGas(params: EstimateGasParams): Promise<GasEstimateResult> {
    const chain = getChainService();

    const parsed: { from: string; to?: string; value?: bigint; data?: string } = {
      from: params.from,
    };

    if (params.to) parsed.to = params.to;
    if (params.value) parsed.value = ethers.parseEther(params.value);
    if (params.data) parsed.data = params.data;

    const gasEstimationWei = await chain.estimateGas(parsed);

    return {
      gasEstimation: gasEstimationWei.toString(),
      gasEstimationWei: gasEstimationWei.toString(),
    };
  },

  async signAndSend(privateKey: string, params: BuildTransactionParams): Promise<BroadcastResult> {
    const chain = getChainService();

    const txParams = { ...params };

    if (txParams.chainId === undefined) {
      const network = await chain.getNetwork();
      txParams.chainId = network.chainId;
    }

    if (txParams.nonce === undefined) {
      const wallet = new ethers.Wallet(privateKey);
      txParams.nonce = await chain.getTransactionCount(wallet.address);
    }

    if (txParams.gasPrice === undefined && txParams.maxFeePerGas === undefined && txParams.maxPriorityFeePerGas === undefined) {
      try {
        const rawGasPrice = await chain.getGasPrice();
        txParams.gasPrice = rawGasPrice.gasPrice.replace(' gwei', '');
      } catch {
        txParams.gasPrice = '10';
      }
    }

    if (txParams.gasLimit === undefined) {
      if (!txParams.to && !txParams.data) {
        txParams.gasLimit = '21000';
      } else {
        try {
          const estimateParams: { from: string; to?: string; value?: bigint; data?: string } = {
            from: new ethers.Wallet(privateKey).address,
          };
          if (txParams.to) estimateParams.to = txParams.to;
          if (txParams.value) estimateParams.value = ethers.parseEther(txParams.value);
          if (txParams.data) estimateParams.data = txParams.data;
          const estimated = await chain.estimateGas(estimateParams);
          txParams.gasLimit = estimated.toString();
        } catch (err) {
          logger.warn('Gas estimation failed, using default gas limit', { error: (err as Error).message });
          txParams.gasLimit = '3000000';
        }
      }
    }

    const { signedTx } = await walletService.signTransaction(privateKey, txParams);

    const transactionHash = await chain.sendTransaction(signedTx);
    logger.info('Transaction broadcast', { transactionHash });

    return { transactionHash };
  },

  async broadcast(signedTx: string): Promise<BroadcastResult> {
    const chain = getChainService();
    const transactionHash = await chain.sendTransaction(signedTx);
    logger.info('Transaction broadcast', { transactionHash });
    return { transactionHash };
  },

  async trackTransaction(txHash: string): Promise<TrackResult> {
    const chain = getChainService();

    const receipt = await chain.getReceipt(txHash);

    if (!receipt) {
      const tx = await chain.getTransaction(txHash);
      if (tx) {
        return { status: 'pending' };
      }
      return { status: 'pending', error: 'Transaction not yet mined' };
    }

    return {
      status: receipt.status === 'success' ? 'confirmed' : 'failed',
      blockNumber: receipt.blockNumber,
      receipt: {
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        blockHash: receipt.blockHash,
        from: receipt.from,
        to: receipt.to,
        status: receipt.status,
        gasUsed: receipt.gasUsed,
        gasPrice: receipt.gasPrice,
        contractAddress: receipt.contractAddress,
      },
    };
  },
};
