import { indexerMapper } from '../mapper/indexer.mapper';
import { IndexedBlock, IndexedTransaction, IndexedEvent, IndexedTokenTransfer, Checkpoint, SyncResult, PaginatedResult } from '../types/indexer.types';

describe('indexerMapper', () => {
  describe('toBlockResponse', () => {
    it('should map block to response', () => {
      const block: IndexedBlock = { blockNumber: 1, hash: '0x1', parentHash: '0x0', timestamp: 1000, transactionCount: 2, indexedAt: '2024-01-01' };
      const resp = indexerMapper.toBlockResponse(block);
      expect(resp.blockNumber).toBe(1);
      expect(resp.hash).toBe('0x1');
      expect(resp.transactionCount).toBe(2);
    });
  });

  describe('toTransactionResponse', () => {
    it('should map transaction to response', () => {
      const tx: IndexedTransaction = { hash: '0xtx', blockNumber: 1, blockHash: '0x1', from: '0xa', to: '0xb', value: '100', gasLimit: '21000', gasPrice: '10', nonce: 0, indexedAt: '' };
      const resp = indexerMapper.toTransactionResponse(tx);
      expect(resp.hash).toBe('0xtx');
      expect(resp.from).toBe('0xa');
    });
  });

  describe('toEventResponse', () => {
    it('should map event to response', () => {
      const event: IndexedEvent = { id: '1-0', blockNumber: 1, transactionHash: '0xtx', logIndex: 0, contract: '0xc', eventName: 'Transfer', signature: '0x...', args: { from: '0xa' }, from: '0xa', to: '0xb', indexedAt: '' };
      const resp = indexerMapper.toEventResponse(event);
      expect(resp.id).toBe('1-0');
      expect(resp.eventName).toBe('Transfer');
    });
  });

  describe('toTokenTransferResponse', () => {
    it('should map token transfer to response', () => {
      const t: IndexedTokenTransfer = { id: '1-0', transactionHash: '0xtx', blockNumber: 1, contract: '0xc', standard: 'ERC20', from: '0xa', to: '0xb', tokenId: null, value: '100', indexedAt: '' };
      const resp = indexerMapper.toTokenTransferResponse(t);
      expect(resp.standard).toBe('ERC20');
      expect(resp.value).toBe('100');
    });
  });

  describe('toCheckpointResponse', () => {
    it('should map checkpoint to response', () => {
      const cp: Checkpoint = { blockNumber: 5, blockHash: '0x5', updatedAt: '2024-01-01' };
      const resp = indexerMapper.toCheckpointResponse(cp);
      expect(resp.blockNumber).toBe(5);
    });
  });

  describe('toStatusResponse', () => {
    it('should compute progress percentage', () => {
      const resp = indexerMapper.toStatusResponse(true, 50, 100, '2024-01-01');
      expect(resp.running).toBe(true);
      expect(resp.latestIndexedBlock).toBe(50);
      expect(resp.latestChainBlock).toBe(100);
      expect(resp.syncProgress).toBe('50.00%');
      expect(resp.startedAt).toBe('2024-01-01');
    });

    it('should return 0% when no blocks indexed', () => {
      const resp = indexerMapper.toStatusResponse(false, null, 100, null);
      expect(resp.running).toBe(false);
      expect(resp.latestIndexedBlock).toBeNull();
      expect(resp.syncProgress).toBe('0%');
      expect(resp.startedAt).toBeNull();
    });
  });

  describe('toSyncResultResponse', () => {
    it('should map sync result to response', () => {
      const result: SyncResult = { blocksIndexed: 5, transactionsIndexed: 10, eventsIndexed: 15, tokenTransfersIndexed: 3, fromBlock: 1, toBlock: 5 };
      const resp = indexerMapper.toSyncResultResponse(result);
      expect(resp.blocksIndexed).toBe(5);
      expect(resp.fromBlock).toBe(1);
    });
  });

  describe('toPaginatedResponse', () => {
    it('should map paginated result with mapper function', () => {
      const blocks = [{ blockNumber: 1, hash: '0x1', parentHash: '0x0', timestamp: 1000, transactionCount: 1, indexedAt: '' }];
      const paginated: PaginatedResult<IndexedBlock> = { items: blocks, total: 1, limit: 10, offset: 0 };
      const resp = indexerMapper.toPaginatedResponse(paginated, indexerMapper.toBlockResponse);
      expect(resp.items).toHaveLength(1);
      expect(resp.items[0].blockNumber).toBe(1);
      expect(resp.total).toBe(1);
    });
  });
});
