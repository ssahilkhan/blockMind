import {
  IndexedBlock,
  IndexedTransaction,
  IndexedEvent,
  IndexedTokenTransfer,
  Checkpoint,
  IndexerStatus,
  SyncResult,
  PaginatedResult,
} from '../types/indexer.types';

export interface BlockResponse {
  blockNumber: number;
  hash: string;
  parentHash: string;
  timestamp: number;
  transactionCount: number;
  indexedAt: string;
}

export interface TransactionResponse {
  hash: string;
  blockNumber: number;
  blockHash: string;
  from: string;
  to: string | null;
  value: string;
  gasLimit: string;
  gasPrice: string;
  nonce: number;
  indexedAt: string;
}

export interface EventResponse {
  id: string;
  blockNumber: number;
  transactionHash: string;
  logIndex: number;
  contract: string;
  eventName: string;
  signature: string;
  args: Record<string, unknown>;
  from: string;
  to: string | null;
  indexedAt: string;
}

export interface TokenTransferResponse {
  id: string;
  transactionHash: string;
  blockNumber: number;
  contract: string;
  standard: string;
  from: string;
  to: string;
  tokenId: string | null;
  value: string;
  indexedAt: string;
}

export interface CheckpointResponse {
  blockNumber: number;
  blockHash: string;
  updatedAt: string;
}

export interface StatusResponse {
  running: boolean;
  latestIndexedBlock: number | null;
  latestChainBlock: number;
  syncProgress: string;
  startedAt: string | null;
}

export interface SyncResultResponse {
  blocksIndexed: number;
  transactionsIndexed: number;
  eventsIndexed: number;
  tokenTransfersIndexed: number;
  fromBlock: number;
  toBlock: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export const indexerMapper = {
  toBlockResponse(block: IndexedBlock): BlockResponse {
    return {
      blockNumber: block.blockNumber,
      hash: block.hash,
      parentHash: block.parentHash,
      timestamp: block.timestamp,
      transactionCount: block.transactionCount,
      indexedAt: block.indexedAt,
    };
  },

  toTransactionResponse(tx: IndexedTransaction): TransactionResponse {
    return {
      hash: tx.hash,
      blockNumber: tx.blockNumber,
      blockHash: tx.blockHash,
      from: tx.from,
      to: tx.to,
      value: tx.value,
      gasLimit: tx.gasLimit,
      gasPrice: tx.gasPrice,
      nonce: tx.nonce,
      indexedAt: tx.indexedAt,
    };
  },

  toEventResponse(event: IndexedEvent): EventResponse {
    return {
      id: event.id,
      blockNumber: event.blockNumber,
      transactionHash: event.transactionHash,
      logIndex: event.logIndex,
      contract: event.contract,
      eventName: event.eventName,
      signature: event.signature,
      args: event.args,
      from: event.from,
      to: event.to,
      indexedAt: event.indexedAt,
    };
  },

  toTokenTransferResponse(transfer: IndexedTokenTransfer): TokenTransferResponse {
    return {
      id: transfer.id,
      transactionHash: transfer.transactionHash,
      blockNumber: transfer.blockNumber,
      contract: transfer.contract,
      standard: transfer.standard,
      from: transfer.from,
      to: transfer.to,
      tokenId: transfer.tokenId,
      value: transfer.value,
      indexedAt: transfer.indexedAt,
    };
  },

  toCheckpointResponse(checkpoint: Checkpoint): CheckpointResponse {
    return {
      blockNumber: checkpoint.blockNumber,
      blockHash: checkpoint.blockHash,
      updatedAt: checkpoint.updatedAt,
    };
  },

  toStatusResponse(
    running: boolean,
    latestIndexedBlock: number | null,
    latestChainBlock: number,
    startedAt: string | null
  ): StatusResponse {
    const progress =
      latestIndexedBlock !== null && latestChainBlock > 0
        ? ((latestIndexedBlock / latestChainBlock) * 100).toFixed(2) + '%'
        : '0%';
    return { running, latestIndexedBlock, latestChainBlock, syncProgress: progress, startedAt };
  },

  toSyncResultResponse(result: SyncResult): SyncResultResponse {
    return {
      blocksIndexed: result.blocksIndexed,
      transactionsIndexed: result.transactionsIndexed,
      eventsIndexed: result.eventsIndexed,
      tokenTransfersIndexed: result.tokenTransfersIndexed,
      fromBlock: result.fromBlock,
      toBlock: result.toBlock,
    };
  },

  toPaginatedResponse<T, U>(result: PaginatedResult<T>, mapper: (item: T) => U): PaginatedResponse<U> {
    return {
      items: result.items.map(mapper),
      total: result.total,
      limit: result.limit,
      offset: result.offset,
    };
  },
};
