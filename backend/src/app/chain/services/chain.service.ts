import { ethers } from 'ethers';
import { IChainProvider, EstimateGasParams } from '../provider/provider.interface';
import { CacheService } from '../cache/cache.service';
import { blockMapper } from '../mapper/block.mapper';
import { transactionMapper } from '../mapper/transaction.mapper';
import { receiptMapper } from '../mapper/receipt.mapper';
import { networkManager } from '../../network/network-manager';
import {
  RawBlock,
  RawTransaction,
  RawReceipt,
  RawLog,
  BlockResponse,
  TransactionResponse,
  ReceiptResponse,
  NetworkResponse,
  GasResponse,
  StatsResponse,
  SearchResult,
} from '../types';

function ethersBlockToRaw(block: ethers.Block): RawBlock {
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

function ethersTxToRaw(tx: ethers.TransactionResponse): RawTransaction {
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

function ethersReceiptToRaw(receipt: ethers.TransactionReceipt): RawReceipt {
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
  private multiChainProviders: Map<number, ethers.JsonRpcProvider> = new Map();

  constructor(
    private provider: IChainProvider,
    private cache: CacheService
  ) {}

  private getMultiChainProvider(chainId?: number): ethers.JsonRpcProvider | null {
    if (!chainId) return null;
    return this.multiChainProviders.get(chainId) ?? null;
  }

  registerMultiChainProvider(chainId: number, rpcUrl: string): void {
    const provider = new ethers.JsonRpcProvider(rpcUrl, chainId);
    this.multiChainProviders.set(chainId, provider);
  }

  async getLatestBlock(chainId?: number): Promise<BlockResponse> {
    const cacheKey = chainId ? `block:latest:${chainId}` : 'block:latest';
    return this.cache.wrap(cacheKey, TTL.LATEST_BLOCK, async () => {
      const mcProvider = this.getMultiChainProvider(chainId);
      if (mcProvider) {
        const blockNumber = await mcProvider.getBlockNumber();
        const block = await mcProvider.getBlock(blockNumber);
        if (!block) throw new Error('Failed to fetch latest block');
        return blockMapper.toResponse(ethersBlockToRaw(block));
      }
      const blockNumber = await this.provider.getBlockNumber();
      const raw = await this.provider.getBlock(blockNumber);
      if (!raw) throw new Error('Failed to fetch latest block');
      return blockMapper.toResponse(raw);
    });
  }

  async getBlockByNumber(number: number, chainId?: number): Promise<BlockResponse | null> {
    const cacheKey = chainId ? `block:${number}:${chainId}` : `block:${number}`;
    return this.cache.wrap(cacheKey, TTL.BLOCK, async () => {
      const mcProvider = this.getMultiChainProvider(chainId);
      if (mcProvider) {
        const block = await mcProvider.getBlock(number);
        if (!block) return null;
        return blockMapper.toResponse(ethersBlockToRaw(block));
      }
      const raw = await this.provider.getBlock(number);
      if (!raw) return null;
      return blockMapper.toResponse(raw);
    });
  }

  async getBlockByHash(hash: string, chainId?: number): Promise<BlockResponse | null> {
    const cacheKey = chainId ? `block:hash:${hash}:${chainId}` : `block:hash:${hash}`;
    return this.cache.wrap(cacheKey, TTL.BLOCK, async () => {
      const mcProvider = this.getMultiChainProvider(chainId);
      if (mcProvider) {
        const block = await mcProvider.getBlock(hash);
        if (!block) return null;
        return blockMapper.toResponse(ethersBlockToRaw(block));
      }
      const raw = await this.provider.getBlock(hash);
      if (!raw) return null;
      return blockMapper.toResponse(raw);
    });
  }

  async getLatestBlocks(limit: number = 10, chainId?: number): Promise<BlockResponse[]> {
    const mcProvider = this.getMultiChainProvider(chainId);
    if (mcProvider) {
      const latest = await mcProvider.getBlockNumber();
      const start = Math.max(0, latest - limit + 1);
      const blocks: BlockResponse[] = [];
      for (let i = latest; i >= start; i--) {
        const block = await this.getBlockByNumber(i, chainId);
        if (block) blocks.push(block);
      }
      return blocks;
    }
    const latest = await this.provider.getBlockNumber();
    const start = Math.max(0, latest - limit + 1);
    const blocks: BlockResponse[] = [];
    for (let i = latest; i >= start; i--) {
      const block = await this.getBlockByNumber(i);
      if (block) blocks.push(block);
    }
    return blocks;
  }

  async getTransaction(hash: string, chainId?: number): Promise<TransactionResponse | null> {
    const cacheKey = chainId ? `tx:${hash}:${chainId}` : `tx:${hash}`;
    return this.cache.wrap(cacheKey, TTL.TRANSACTION, async () => {
      const mcProvider = this.getMultiChainProvider(chainId);
      if (mcProvider) {
        const tx = await mcProvider.getTransaction(hash);
        if (!tx) return null;
        return transactionMapper.toResponse(ethersTxToRaw(tx as ethers.TransactionResponse));
      }
      const raw = await this.provider.getTransaction(hash);
      if (!raw) return null;
      return transactionMapper.toResponse(raw);
    });
  }

  async getReceipt(hash: string, chainId?: number): Promise<ReceiptResponse | null> {
    const cacheKey = chainId ? `receipt:${hash}:${chainId}` : `receipt:${hash}`;
    return this.cache.wrap(cacheKey, TTL.RECEIPT, async () => {
      const mcProvider = this.getMultiChainProvider(chainId);
      if (mcProvider) {
        const receipt = await mcProvider.getTransactionReceipt(hash);
        if (!receipt) return null;
        return receiptMapper.toResponse(ethersReceiptToRaw(receipt));
      }
      const raw = await this.provider.getReceipt(hash);
      if (!raw) return null;
      return receiptMapper.toResponse(raw);
    });
  }

  async getNetwork(chainId?: number): Promise<NetworkResponse> {
    const cacheKey = chainId ? `network:${chainId}` : 'network';
    return this.cache.wrap(cacheKey, TTL.NETWORK, async () => {
      const mcProvider = this.getMultiChainProvider(chainId);
      if (mcProvider) {
        const [network, latestBlock] = await Promise.all([
          mcProvider.getNetwork(),
          mcProvider.getBlockNumber(),
        ]);
        const chainConfig = networkManager.getConfig(chainId);
        return {
          chainId: Number(network.chainId),
          name: chainConfig?.name ?? network.name,
          currency: chainConfig?.nativeCurrency.symbol ?? 'ETH',
          latestBlock,
        };
      }
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

  async getGasPrice(chainId?: number): Promise<GasResponse> {
    const cacheKey = chainId ? `gas:${chainId}` : 'gas';
    return this.cache.wrap(cacheKey, TTL.GAS, async () => {
      const mcProvider = this.getMultiChainProvider(chainId);
      if (mcProvider) {
        const gasPrice = await mcProvider.getFeeData();
        const latestBlock = await mcProvider.getBlockNumber();
        const block = await mcProvider.getBlock(latestBlock);
        return {
          gasPrice: gasPrice.gasPrice
            ? ethers.formatUnits(gasPrice.gasPrice, 'gwei') + ' gwei'
            : '0 gwei',
          baseFee: block?.baseFeePerGas
            ? ethers.formatUnits(block.baseFeePerGas, 'gwei') + ' gwei'
            : null,
        };
      }
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

  async getStats(chainId?: number): Promise<StatsResponse> {
    const [latestBlock, gasPrice, network] = await Promise.all([
      this.getLatestBlock(chainId),
      this.getGasPrice(chainId),
      this.getNetwork(chainId),
    ]);
    return {
      latestBlock: latestBlock.number,
      gasPrice: gasPrice.gasPrice,
      chainId: network.chainId,
      network: network.name,
    };
  }

  async getBalance(address: string, chainId?: number): Promise<{ balance: string; balanceWei: string }> {
    const mcProvider = this.getMultiChainProvider(chainId);
    if (mcProvider) {
      const balance = await mcProvider.getBalance(address);
      return {
        balance: ethers.formatEther(balance),
        balanceWei: balance.toString(),
      };
    }
    const balance = await this.provider.getBalance(address);
    return {
      balance: ethers.formatEther(balance),
      balanceWei: balance.toString(),
    };
  }

  async getTransactionCount(address: string, chainId?: number): Promise<number> {
    const mcProvider = this.getMultiChainProvider(chainId);
    if (mcProvider) {
      return mcProvider.getTransactionCount(address);
    }
    return this.provider.getTransactionCount(address);
  }

  async estimateGas(params: EstimateGasParams, chainId?: number): Promise<bigint> {
    const mcProvider = this.getMultiChainProvider(chainId);
    if (mcProvider) {
      return mcProvider.estimateGas({
        from: params.from,
        to: params.to,
        value: params.value,
        data: params.data,
      });
    }
    return this.provider.estimateGas(params);
  }

  async sendTransaction(signedTx: string, chainId?: number): Promise<string> {
    const mcProvider = this.getMultiChainProvider(chainId);
    if (mcProvider) {
      const txResponse = await mcProvider.broadcastTransaction(signedTx);
      return txResponse.hash;
    }
    return this.provider.sendTransaction(signedTx);
  }

  async call(params: { to: string; data: string }, chainId?: number): Promise<string> {
    const mcProvider = this.getMultiChainProvider(chainId);
    if (mcProvider) {
      return mcProvider.call({ to: params.to, data: params.data });
    }
    return this.provider.call(params);
  }

  async search(query: string, chainId?: number): Promise<SearchResult> {
    if (/^\d+$/.test(query)) {
      const block = await this.getBlockByNumber(parseInt(query, 10), chainId);
      if (block) return { type: 'block', data: block };
    }

    if (/^0x[0-9a-fA-F]{64}$/.test(query)) {
      const tx = await this.getTransaction(query, chainId);
      if (tx) return { type: 'transaction', data: tx };

      const block = await this.getBlockByHash(query, chainId);
      if (block) return { type: 'block', data: block };

      const receipt = await this.getReceipt(query, chainId);
      if (receipt) return { type: 'transaction', data: receipt };
    }

    if (ethers.isAddress(query)) {
      const balance = await this.getBalance(query, chainId);
      const txCount = await this.getTransactionCount(query, chainId);
      return {
        type: 'address',
        data: {
          address: query,
          balance: balance.balance + ' ETH',
          transactionCount: txCount,
        },
      };
    }

    return { type: 'unknown', data: null };
  }
}
