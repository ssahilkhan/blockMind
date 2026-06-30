import { IndexedBlock, IndexedTransaction, IndexedEvent, IndexedTokenTransfer, Checkpoint, PaginatedResult, PaginationParams } from '../types/indexer.types';

export interface IStorage {
  saveBlock(block: IndexedBlock): Promise<void>;
  saveBlocks(blocks: IndexedBlock[]): Promise<void>;
  saveTransaction(tx: IndexedTransaction): Promise<void>;
  saveTransactions(txs: IndexedTransaction[]): Promise<void>;
  saveEvent(event: IndexedEvent): Promise<void>;
  saveEvents(events: IndexedEvent[]): Promise<void>;
  saveTokenTransfer(transfer: IndexedTokenTransfer): Promise<void>;
  saveTokenTransfers(transfers: IndexedTokenTransfer[]): Promise<void>;
  getLatestCheckpoint(): Promise<Checkpoint | null>;
  saveCheckpoint(checkpoint: Checkpoint): Promise<void>;
  getBlocks(params: PaginationParams): Promise<PaginatedResult<IndexedBlock>>;
  getTransactions(params: PaginationParams): Promise<PaginatedResult<IndexedTransaction>>;
  getEvents(params: PaginationParams): Promise<PaginatedResult<IndexedEvent>>;
  getTokenTransfers(params: PaginationParams): Promise<PaginatedResult<IndexedTokenTransfer>>;
  clear(): Promise<void>;
}
