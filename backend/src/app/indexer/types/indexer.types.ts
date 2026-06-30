export interface IndexedBlock {
  blockNumber: number;
  hash: string;
  parentHash: string;
  timestamp: number;
  transactionCount: number;
  indexedAt: string;
}

export interface IndexedTransaction {
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

export interface IndexedEvent {
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

export interface IndexedTokenTransfer {
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

export interface Checkpoint {
  blockNumber: number;
  blockHash: string;
  updatedAt: string;
}

export interface IndexerStatus {
  running: boolean;
  latestIndexedBlock: number | null;
  latestChainBlock: number;
  syncProgress: number;
  startedAt: string | null;
}

export interface SyncResult {
  blocksIndexed: number;
  transactionsIndexed: number;
  eventsIndexed: number;
  tokenTransfersIndexed: number;
  fromBlock: number;
  toBlock: number;
}

export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}
