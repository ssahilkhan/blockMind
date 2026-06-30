import { MemoryStorage } from '../storage/memory.storage';
import { IndexedBlock, IndexedTransaction, IndexedEvent, IndexedTokenTransfer, Checkpoint } from '../types/indexer.types';

function makeBlock(n: number): IndexedBlock {
  return { blockNumber: n, hash: `0x${n}`, parentHash: '0x0', timestamp: 1000 + n, transactionCount: 1, indexedAt: new Date().toISOString() };
}

function makeTx(hash: string, blockNumber: number): IndexedTransaction {
  return { hash, blockNumber, blockHash: `0x${blockNumber}`, from: '0xa', to: '0xb', value: '100', gasLimit: '21000', gasPrice: '10', nonce: 0, indexedAt: new Date().toISOString() };
}

function makeEvent(id: string, blockNumber: number): IndexedEvent {
  return { id, blockNumber, transactionHash: '0xtx', logIndex: 0, contract: '0xc', eventName: 'Transfer', signature: 'Transfer(address,address,uint256)', args: {}, from: '0xa', to: '0xb', indexedAt: new Date().toISOString() };
}

function makeTransfer(id: string, blockNumber: number): IndexedTokenTransfer {
  return { id, transactionHash: '0xtx', blockNumber, contract: '0xc', standard: 'ERC20', from: '0xa', to: '0xb', tokenId: null, value: '100', indexedAt: new Date().toISOString() };
}

describe('MemoryStorage', () => {
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = new MemoryStorage();
  });

  describe('blocks', () => {
    it('should save and retrieve blocks', async () => {
      await storage.saveBlock(makeBlock(1));
      const result = await storage.getBlocks({ limit: 10, offset: 0 });
      expect(result.total).toBe(1);
      expect(result.items[0].blockNumber).toBe(1);
    });

    it('should not duplicate blocks', async () => {
      await storage.saveBlock(makeBlock(1));
      await storage.saveBlock(makeBlock(1));
      const result = await storage.getBlocks({ limit: 10, offset: 0 });
      expect(result.total).toBe(1);
    });

    it('should return blocks sorted by blockNumber descending', async () => {
      await storage.saveBlocks([makeBlock(1), makeBlock(2), makeBlock(3)]);
      const result = await storage.getBlocks({ limit: 10, offset: 0 });
      expect(result.items.map((b) => b.blockNumber)).toEqual([3, 2, 1]);
    });

    it('should support pagination', async () => {
      await storage.saveBlocks([makeBlock(1), makeBlock(2), makeBlock(3)]);
      const result = await storage.getBlocks({ limit: 2, offset: 0 });
      expect(result.items.length).toBe(2);
      expect(result.items.map((b) => b.blockNumber)).toEqual([3, 2]);
    });

    it('should return empty when no blocks', async () => {
      const result = await storage.getBlocks({ limit: 10, offset: 0 });
      expect(result.total).toBe(0);
      expect(result.items).toEqual([]);
    });
  });

  describe('transactions', () => {
    it('should save and retrieve transactions', async () => {
      await storage.saveTransaction(makeTx('0xtx1', 1));
      const result = await storage.getTransactions({ limit: 10, offset: 0 });
      expect(result.total).toBe(1);
      expect(result.items[0].hash).toBe('0xtx1');
    });

    it('should not duplicate transactions', async () => {
      await storage.saveTransaction(makeTx('0xtx1', 1));
      await storage.saveTransaction(makeTx('0xtx1', 1));
      const result = await storage.getTransactions({ limit: 10, offset: 0 });
      expect(result.total).toBe(1);
    });
  });

  describe('events', () => {
    it('should save and retrieve events', async () => {
      await storage.saveEvent(makeEvent('1-0', 1));
      const result = await storage.getEvents({ limit: 10, offset: 0 });
      expect(result.total).toBe(1);
      expect(result.items[0].id).toBe('1-0');
    });

    it('should not duplicate events', async () => {
      await storage.saveEvent(makeEvent('1-0', 1));
      await storage.saveEvent(makeEvent('1-0', 1));
      const result = await storage.getEvents({ limit: 10, offset: 0 });
      expect(result.total).toBe(1);
    });
  });

  describe('token transfers', () => {
    it('should save and retrieve token transfers', async () => {
      await storage.saveTokenTransfer(makeTransfer('1-0', 1));
      const result = await storage.getTokenTransfers({ limit: 10, offset: 0 });
      expect(result.total).toBe(1);
      expect(result.items[0].id).toBe('1-0');
    });

    it('should not duplicate transfers', async () => {
      await storage.saveTokenTransfer(makeTransfer('1-0', 1));
      await storage.saveTokenTransfer(makeTransfer('1-0', 1));
      const result = await storage.getTokenTransfers({ limit: 10, offset: 0 });
      expect(result.total).toBe(1);
    });
  });

  describe('checkpoints', () => {
    it('should return null when no checkpoint exists', async () => {
      const cp = await storage.getLatestCheckpoint();
      expect(cp).toBeNull();
    });

    it('should save and retrieve checkpoint', async () => {
      const cp: Checkpoint = { blockNumber: 5, blockHash: '0x5', updatedAt: new Date().toISOString() };
      await storage.saveCheckpoint(cp);
      const result = await storage.getLatestCheckpoint();
      expect(result).not.toBeNull();
      expect(result!.blockNumber).toBe(5);
    });

    it('should overwrite previous checkpoint', async () => {
      await storage.saveCheckpoint({ blockNumber: 1, blockHash: '0x1', updatedAt: '' });
      await storage.saveCheckpoint({ blockNumber: 2, blockHash: '0x2', updatedAt: '' });
      const result = await storage.getLatestCheckpoint();
      expect(result!.blockNumber).toBe(2);
    });
  });

  describe('clear', () => {
    it('should remove all data', async () => {
      await storage.saveBlock(makeBlock(1));
      await storage.saveTransaction(makeTx('0xtx', 1));
      await storage.saveEvent(makeEvent('1-0', 1));
      await storage.saveTokenTransfer(makeTransfer('1-0', 1));
      await storage.saveCheckpoint({ blockNumber: 1, blockHash: '0x1', updatedAt: '' });
      await storage.clear();
      expect((await storage.getBlocks({ limit: 10, offset: 0 })).total).toBe(0);
      expect((await storage.getTransactions({ limit: 10, offset: 0 })).total).toBe(0);
      expect((await storage.getEvents({ limit: 10, offset: 0 })).total).toBe(0);
      expect((await storage.getTokenTransfers({ limit: 10, offset: 0 })).total).toBe(0);
      expect(await storage.getLatestCheckpoint()).toBeNull();
    });
  });
});
