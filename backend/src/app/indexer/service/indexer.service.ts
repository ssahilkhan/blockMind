import { IStorage } from '../storage/storage.interface';
import { CheckpointManager } from '../checkpoint/checkpoint.manager';
import { Synchronizer } from '../synchronizer/synchronizer.service';
import { Scheduler } from '../scheduler/scheduler.service';
import { MemoryStorage } from '../storage/memory.storage';
import { IndexerStatus, SyncResult } from '../types/indexer.types';
import { getChainService } from '../../chain/services/chain.service';
import { DEFAULT_POLL_INTERVAL_MS } from '../constants/indexer.constants';
import { logger } from '../../logger';

export class IndexerService {
  private storage: IStorage;
  private checkpointManager: CheckpointManager;
  private synchronizer: Synchronizer;
  private scheduler: Scheduler;

  constructor(pollIntervalMs?: number) {
    this.storage = new MemoryStorage();
    this.checkpointManager = new CheckpointManager(this.storage);
    this.synchronizer = new Synchronizer(this.storage, this.checkpointManager);
    this.scheduler = new Scheduler(this.synchronizer, pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS);
  }

  getStorage(): IStorage {
    return this.storage;
  }

  getCheckpointManager(): CheckpointManager {
    return this.checkpointManager;
  }

  async start(pollIntervalMs?: number): Promise<void> {
    if (pollIntervalMs) {
      this.scheduler = new Scheduler(this.synchronizer, pollIntervalMs);
    }
    this.scheduler.start();
    logger.info('Indexer service started');
  }

  stop(): void {
    this.scheduler.stop();
    logger.info('Indexer service stopped');
  }

  async syncOnce(): Promise<SyncResult> {
    return this.synchronizer.syncOnce();
  }

  async getStatus(): Promise<IndexerStatus> {
    const chain = getChainService();
    const latestBlock = await chain.getLatestBlock();
    const checkpoint = await this.checkpointManager.getLatest();

    return {
      running: this.scheduler.isRunning(),
      latestIndexedBlock: checkpoint?.blockNumber ?? null,
      latestChainBlock: latestBlock.number,
      syncProgress: 0,
      startedAt: this.scheduler.getStartedAt(),
    };
  }

  getCheckpoint() {
    return this.checkpointManager.getLatest();
  }

  getBlocks(limit: number, offset: number) {
    return this.storage.getBlocks({ limit, offset });
  }

  getEvents(limit: number, offset: number) {
    return this.storage.getEvents({ limit, offset });
  }

  getTransactions(limit: number, offset: number) {
    return this.storage.getTransactions({ limit, offset });
  }

  isRunning(): boolean {
    return this.scheduler.isRunning();
  }
}
