import { IStorage } from '../storage/storage.interface';
import { Checkpoint } from '../types/indexer.types';
import { logger } from '../../logger';

export class CheckpointManager {
  constructor(private storage: IStorage) {}

  async getLatest(): Promise<Checkpoint | null> {
    return this.storage.getLatestCheckpoint();
  }

  async update(blockNumber: number, blockHash: string): Promise<Checkpoint> {
    const checkpoint: Checkpoint = {
      blockNumber,
      blockHash,
      updatedAt: new Date().toISOString(),
    };
    await this.storage.saveCheckpoint(checkpoint);
    logger.info('Checkpoint updated', { blockNumber });
    return checkpoint;
  }

  async getNextBlockToIndex(): Promise<number> {
    const latest = await this.getLatest();
    if (!latest) return 0;
    return latest.blockNumber + 1;
  }

  hasCheckpoint(): Promise<boolean> {
    return this.storage.getLatestCheckpoint().then((c) => c !== null);
  }
}
