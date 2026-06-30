import { ethers } from 'ethers';
import { IChainProvider, EstimateGasParams } from '../provider/provider.interface';
import { CacheService } from '../cache/cache.service';
import { blockMapper } from '../mapper/block.mapper';
import { transactionMapper } from '../mapper/transaction.mapper';
import { receiptMapper } from '../mapper/receipt.mapper';
import {
  BlockResponse,
  TransactionResponse,
  ReceiptResponse,
  NetworkResponse,
  GasResponse,
  StatsResponse,
  SearchResult,
} from '../types';

const TTL = {
  LATEST_BLOCK: 2_000,
  BLOCK: 30_000,
  TRANSACTION: 30_000,
  RECEIPT: 30_000,
  NETWORK: 30_000,
  GAS: 2_000,
  BALANCE: 10_000,
};

let globalChainService: ChainService | null = null;

export function initChainService(provider: IChainProvider, cache: CacheService): ChainService {
  globalChainService = new ChainService(provider, cache);
  return globalChainService;
}

export function getChainService(): ChainService {
  if (!globalChainService) {
    throw new Error('ChainService not initialized. Call initChainService() first.');
  }
  return globalChainService;
}

export class ChainService {
  constructor(
    private provider: IChainProvider,
    private cache: CacheService
  ) {}

  async getLatestBlock(): Promise<BlockResponse> {
    return this.cache.wrap('block:latest', TTL.LATEST_BLOCK, async () => {
      const blockNumber = await this.provider.getBlockNumber();
      const raw = await this.provider.getBlock(blockNumber);
      if (!raw) throw new Error('Failed to fetch latest block');
      return blockMapper.toResponse(raw);
    });
  }

  async getBlockByNumber(number: number): Promise<BlockResponse | null> {
    return this.cache.wrap(`block:${number}`, TTL.BLOCK, async () => {
      const raw = await this.provider.getBlock(number);
      if (!raw) return null;
      return blockMapper.toResponse(raw);
    });
  }

  async getBlockByHash(hash: string): Promise<BlockResponse | null> {
    return this.cache.wrap(`block:hash:${hash}`, TTL.BLOCK, async () => {
      const raw = await this.provider.getBlock(hash);
      if (!raw) return null;
      return blockMapper.toResponse(raw);
    });
  }

  async getLatestBlocks(limit: number = 10): Promise<BlockResponse[]> {
    const latest = await this.provider.getBlockNumber();
    const start = Math.max(0, latest - limit + 1);
    const blocks: BlockResponse[] = [];
    for (let i = latest; i >= start; i--) {
      const block = await this.getBlockByNumber(i);
      if (block) blocks.push(block);
    }
    return blocks;
  }

  async getTransaction(hash: string): Promise<TransactionResponse | null> {
    return this.cache.wrap(`tx:${hash}`, TTL.TRANSACTION, async () => {
      const raw = await this.provider.getTransaction(hash);
      if (!raw) return null;
      return transactionMapper.toResponse(raw);
    });
  }

  async getReceipt(hash: string): Promise<ReceiptResponse | null> {
    return this.cache.wrap(`receipt:${hash}`, TTL.RECEIPT, async () => {
      const raw = await this.provider.getReceipt(hash);
      if (!raw) return null;
      return receiptMapper.toResponse(raw);
    });
  }

  async getNetwork(): Promise<NetworkResponse> {
    return this.cache.wrap('network', TTL.NETWORK, async () => {
      const [network, latestBlock] = await Promise.all([
        this.provider.getNetwork(),
        this.provider.getBlockNumber(),
      ]);
      return {
        chainId: network.chainId,
        name: network.name,
        currency: 'ETH',
        latestBlock,
      };
    });
  }

  async getGasPrice(): Promise<GasResponse> {
    return this.cache.wrap('gas', TTL.GAS, async () => {
      const gasPrice = await this.provider.getGasPrice();
      const latestBlock = await this.provider.getBlockNumber();
      const block = await this.provider.getBlock(latestBlock);
      return {
        gasPrice: ethers.formatUnits(gasPrice, 'gwei') + ' gwei',
        baseFee: block?.baseFeePerGas
          ? ethers.formatUnits(block.baseFeePerGas, 'gwei') + ' gwei'
          : null,
      };
    });
  }

  async getStats(): Promise<StatsResponse> {
    const [latestBlock, gasPrice, network] = await Promise.all([
      this.getLatestBlock(),
      this.getGasPrice(),
      this.getNetwork(),
    ]);
    return {
      latestBlock: latestBlock.number,
      gasPrice: gasPrice.gasPrice,
      chainId: network.chainId,
      network: network.name,
    };
  }

  async getBalance(address: string): Promise<{ balance: string; balanceWei: string }> {
    const balance = await this.provider.getBalance(address);
    return {
      balance: ethers.formatEther(balance),
      balanceWei: balance.toString(),
    };
  }

  async getTransactionCount(address: string): Promise<number> {
    return this.provider.getTransactionCount(address);
  }

  async estimateGas(params: EstimateGasParams): Promise<bigint> {
    return this.provider.estimateGas(params);
  }

  async sendTransaction(signedTx: string): Promise<string> {
    return this.provider.sendTransaction(signedTx);
  }

  async call(params: { to: string; data: string }): Promise<string> {
    return this.provider.call(params);
  }

  async search(query: string): Promise<SearchResult> {
    if (/^\d+$/.test(query)) {
      const block = await this.getBlockByNumber(parseInt(query, 10));
      if (block) return { type: 'block', data: block };
    }

    if (/^0x[0-9a-fA-F]{64}$/.test(query)) {
      const tx = await this.getTransaction(query);
      if (tx) return { type: 'transaction', data: tx };

      const block = await this.getBlockByHash(query);
      if (block) return { type: 'block', data: block };

      const receipt = await this.getReceipt(query);
      if (receipt) return { type: 'transaction', data: receipt };
    }

    if (ethers.isAddress(query)) {
      const balance = await this.provider.getBalance(query);
      const txCount = await this.provider.getTransactionCount(query);
      return {
        type: 'address',
        data: {
          address: query,
          balance: ethers.formatEther(balance) + ' ETH',
          transactionCount: txCount,
        },
      };
    }

    return { type: 'unknown', data: null };
  }
}
