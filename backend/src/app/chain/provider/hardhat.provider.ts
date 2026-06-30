import { ethers } from 'ethers';
import { IChainProvider, EstimateGasParams } from './provider.interface';
import {
  RawBlock,
  RawTransaction,
  RawReceipt,
  RawLog,
} from '../types';
import { logger } from '../../logger';

export class HardhatProvider implements IChainProvider {
  private provider: ethers.JsonRpcProvider;
  private connected = false;

  constructor(rpcUrl: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
  }

  async connect(): Promise<void> {
    try {
      await this.provider.getNetwork();
      this.connected = true;
      logger.info('HardhatProvider connected');
    } catch (err) {
      this.connected = false;
      throw err;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  async getBlock(blockNumberOrHash: number | string): Promise<RawBlock | null> {
    const block = await this.provider.getBlock(blockNumberOrHash);
    if (!block) return null;

    return {
      number: block.number,
      hash: block.hash ?? '',
      parentHash: block.parentHash ?? '',
      timestamp: block.timestamp,
      transactions: [...block.transactions],
      gasUsed: block.gasUsed,
      gasLimit: block.gasLimit,
      miner: block.miner,
      extraData: block.extraData,
      difficulty: block.difficulty,
      baseFeePerGas: block.baseFeePerGas ?? null,
      size: null,
    };
  }

  async getTransaction(txHash: string): Promise<RawTransaction | null> {
    const tx = await this.provider.getTransaction(txHash);
    if (!tx) return null;

    return {
      hash: tx.hash,
      blockNumber: tx.blockNumber,
      blockHash: tx.blockHash,
      from: tx.from,
      to: tx.to ?? null,
      value: tx.value,
      gasPrice: tx.gasPrice,
      gasLimit: tx.gasLimit,
      nonce: tx.nonce,
      input: tx.data,
    };
  }

  async getReceipt(txHash: string): Promise<RawReceipt | null> {
    const receipt = await this.provider.getTransactionReceipt(txHash);
    if (!receipt) return null;

    return {
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      blockHash: receipt.blockHash,
      from: receipt.from,
      to: receipt.to ?? null,
      status: receipt.status ?? 0,
      gasUsed: receipt.gasUsed,
      gasPrice: receipt.gasPrice,
      cumulativeGasUsed: receipt.cumulativeGasUsed,
      contractAddress: receipt.contractAddress ?? null,
      logs: receipt.logs.map(
        (log): RawLog => ({
          address: log.address,
          topics: [...log.topics],
          data: log.data,
          logIndex: log.index,
        })
      ),
    };
  }

  async getBalance(address: string): Promise<bigint> {
    return this.provider.getBalance(address);
  }

  async getTransactionCount(address: string): Promise<number> {
    const result = await this.provider.send('eth_getTransactionCount', [address, 'latest']);
    return parseInt(result, 16);
  }

  async getBlockNumber(): Promise<number> {
    return this.provider.getBlockNumber();
  }

  async getGasPrice(): Promise<bigint> {
    const fee = await this.provider.getFeeData();
    return fee.gasPrice ?? 0n;
  }

  async estimateGas(params: EstimateGasParams): Promise<bigint> {
    return this.provider.estimateGas({
      from: params.from,
      to: params.to,
      value: params.value,
      data: params.data,
    });
  }

  async sendTransaction(signedTx: string): Promise<string> {
    const txResponse = await this.provider.broadcastTransaction(signedTx);
    return txResponse.hash;
  }

  async call(params: { to: string; data: string }): Promise<string> {
    return this.provider.call({
      to: params.to,
      data: params.data,
    });
  }

  async getNetwork(): Promise<{ chainId: number; name: string }> {
    const network = await this.provider.getNetwork();
    return { chainId: Number(network.chainId), name: network.name || 'unknown' };
  }
}
