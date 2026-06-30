import { CheckpointManager } from '../checkpoint/checkpoint.manager';
import { IStorage } from '../storage/storage.interface';
import { Checkpoint } from '../types/indexer.types';

class MockStorage implements IStorage {
  private checkpoint: Checkpoint | null = null;
  saveBlock = jest.fn();
  saveBlocks = jest.fn();
  saveTransaction = jest.fn();
  saveTransactions = jest.fn();
  saveEvent = jest.fn();
  saveEvents = jest.fn();
  saveTokenTransfer = jest.fn();
  saveTokenTransfers = jest.fn();
  getBlocks = jest.fn();
  getTransactions = jest.fn();
  getEvents = jest.fn();
  getTokenTransfers = jest.fn();
  clear = jest.fn();

  async getLatestCheckpoint(): Promise<Checkpoint | null> {
    return this.checkpoint;
  }

  async saveCheckpoint(cp: Checkpoint): Promise<void> {
    this.checkpoint = cp;
  }
}

describe('CheckpointManager', () => {
  let storage: MockStorage;
  let manager: CheckpointManager;

  beforeEach(() => {
    storage = new MockStorage();
    manager = new CheckpointManager(storage);
  });

  describe('getLatest', () => {
    it('should return null when no checkpoint', async () => {
      const result = await manager.getLatest();
      expect(result).toBeNull();
    });

    it('should return the latest checkpoint', async () => {
      await manager.update(5, '0x5');
      const result = await manager.getLatest();
      expect(result).not.toBeNull();
      expect(result!.blockNumber).toBe(5);
    });
  });

  describe('update', () => {
    it('should create a checkpoint with the given block', async () => {
      const cp = await manager.update(10, '0x10');
      expect(cp.blockNumber).toBe(10);
      expect(cp.blockHash).toBe('0x10');
      expect(cp.updatedAt).toBeDefined();
    });

    it('should overwrite previous checkpoint', async () => {
      await manager.update(5, '0x5');
      const cp = await manager.update(10, '0x10');
      expect(cp.blockNumber).toBe(10);
      const latest = await manager.getLatest();
      expect(latest!.blockNumber).toBe(10);
    });
  });

  describe('getNextBlockToIndex', () => {
    it('should return 0 when no checkpoint exists', async () => {
      const next = await manager.getNextBlockToIndex();
      expect(next).toBe(0);
    });

    it('should return checkpoint + 1', async () => {
      await manager.update(5, '0x5');
      const next = await manager.getNextBlockToIndex();
      expect(next).toBe(6);
    });
  });

  describe('hasCheckpoint', () => {
    it('should return false when no checkpoint', async () => {
      const result = await manager.hasCheckpoint();
      expect(result).toBe(false);
    });

    it('should return true when checkpoint exists', async () => {
      await manager.update(1, '0x1');
      const result = await manager.hasCheckpoint();
      expect(result).toBe(true);
    });
  });
});
