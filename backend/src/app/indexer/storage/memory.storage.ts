import { IStorage } from './storage.interface';
import {
  IndexedBlock,
  IndexedTransaction,
  IndexedEvent,
  IndexedTokenTransfer,
  Checkpoint,
  PaginatedResult,
  PaginationParams,
} from '../types/indexer.types';

export class MemoryStorage implements IStorage {
  private blocks: IndexedBlock[] = [];
  private transactions: IndexedTransaction[] = [];
  private events: IndexedEvent[] = [];
  private tokenTransfers: IndexedTokenTransfer[] = [];
  private checkpoint: Checkpoint | null = null;
  private blockSet: Set<number> = new Set();
  private txSet: Set<string> = new Set();
  private eventSet: Set<string> = new Set();
  private transferSet: Set<string> = new Set();

  async saveBlock(block: IndexedBlock): Promise<void> {
    if (this.blockSet.has(block.blockNumber)) return;
    this.blocks.push(block);
    this.blockSet.add(block.blockNumber);
  }

  async saveBlocks(blocks: IndexedBlock[]): Promise<void> {
    for (const block of blocks) {
      await this.saveBlock(block);
    }
  }

  async saveTransaction(tx: IndexedTransaction): Promise<void> {
    if (this.txSet.has(tx.hash)) return;
    this.transactions.push(tx);
    this.txSet.add(tx.hash);
  }

  async saveTransactions(txs: IndexedTransaction[]): Promise<void> {
    for (const tx of txs) {
      await this.saveTransaction(tx);
    }
  }

  async saveEvent(event: IndexedEvent): Promise<void> {
    if (this.eventSet.has(event.id)) return;
    this.events.push(event);
    this.eventSet.add(event.id);
  }

  async saveEvents(events: IndexedEvent[]): Promise<void> {
    for (const event of events) {
      await this.saveEvent(event);
    }
  }

  async saveTokenTransfer(transfer: IndexedTokenTransfer): Promise<void> {
    if (this.transferSet.has(transfer.id)) return;
    this.tokenTransfers.push(transfer);
    this.transferSet.add(transfer.id);
  }

  async saveTokenTransfers(transfers: IndexedTokenTransfer[]): Promise<void> {
    for (const transfer of transfers) {
      await this.saveTokenTransfer(transfer);
    }
  }

  async getLatestCheckpoint(): Promise<Checkpoint | null> {
    return this.checkpoint;
  }

  async saveCheckpoint(checkpoint: Checkpoint): Promise<void> {
    this.checkpoint = checkpoint;
  }

  async getBlocks(params: PaginationParams): Promise<PaginatedResult<IndexedBlock>> {
    const sorted = this.blocks.sort((a, b) => b.blockNumber - a.blockNumber);
    const items = sorted.slice(params.offset, params.offset + params.limit);
    return { items, total: this.blocks.length, ...params };
  }

  async getTransactions(params: PaginationParams): Promise<PaginatedResult<IndexedTransaction>> {
    const sorted = this.transactions.sort((a, b) => b.blockNumber - a.blockNumber);
    const items = sorted.slice(params.offset, params.offset + params.limit);
    return { items, total: this.transactions.length, ...params };
  }

  async getEvents(params: PaginationParams): Promise<PaginatedResult<IndexedEvent>> {
    const sorted = this.events.sort((a, b) => b.blockNumber - a.blockNumber);
    const items = sorted.slice(params.offset, params.offset + params.limit);
    return { items, total: this.events.length, ...params };
  }

  async getTokenTransfers(params: PaginationParams): Promise<PaginatedResult<IndexedTokenTransfer>> {
    const sorted = this.tokenTransfers.sort((a, b) => b.blockNumber - a.blockNumber);
    const items = sorted.slice(params.offset, params.offset + params.limit);
    return { items, total: this.tokenTransfers.length, ...params };
  }

  async clear(): Promise<void> {
    this.blocks = [];
    this.transactions = [];
    this.events = [];
    this.tokenTransfers = [];
    this.checkpoint = null;
    this.blockSet.clear();
    this.txSet.clear();
    this.eventSet.clear();
    this.transferSet.clear();
  }
}
