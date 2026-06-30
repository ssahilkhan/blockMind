import { tokenProcessor } from '../processor/token.processor';
import { IndexedEvent } from '../types/indexer.types';

function makeEvent(overrides: Partial<IndexedEvent> & { args: Record<string, unknown> }): IndexedEvent {
  const base: IndexedEvent = {
    id: '1-0',
    blockNumber: 1,
    transactionHash: '0xtx',
    logIndex: 0,
    contract: '0xc',
    eventName: 'Transfer',
    signature: 'Transfer(address,address,uint256)',
    args: {},
    from: '0xa',
    to: '0xb',
    indexedAt: '',
  };
  return { ...base, ...overrides };
}

describe('tokenProcessor', () => {
  describe('process', () => {
    it('should extract ERC20 transfers', () => {
      const events = [makeEvent({ args: { from: '0xa', to: '0xb', value: '1000' } })];
      const transfers = tokenProcessor.process(events);
      expect(transfers).toHaveLength(1);
      expect(transfers[0].standard).toBe('ERC20');
      expect(transfers[0].value).toBe('1000');
      expect(transfers[0].tokenId).toBeNull();
    });

    it('should extract ERC721 transfers', () => {
      const events = [makeEvent({ args: { from: '0xa', to: '0xb', tokenId: '42' }, signature: 'Transfer(address,address,uint256)' })];
      const transfers = tokenProcessor.process(events);
      expect(transfers).toHaveLength(1);
      expect(transfers[0].standard).toBe('ERC721');
      expect(transfers[0].tokenId).toBe('42');
    });

    it('should extract ERC1155 transfers', () => {
      const events = [makeEvent({ args: { from: '0xa', to: '0xb', tokenId: '1', value: '5' }, signature: 'TransferSingle(address,address,address,uint256,uint256)' })];
      const transfers = tokenProcessor.process(events);
      expect(transfers).toHaveLength(1);
      expect(transfers[0].standard).toBe('ERC1155');
      expect(transfers[0].tokenId).toBe('1');
      expect(transfers[0].value).toBe('5');
    });

    it('should skip non-Transfer events', () => {
      const events = [makeEvent({ eventName: 'Approval', args: { owner: '0xa', spender: '0xb', value: '100' } })];
      const transfers = tokenProcessor.process(events);
      expect(transfers).toHaveLength(0);
    });

    it('should skip events with missing from/to', () => {
      const events = [makeEvent({ args: {} })];
      const transfers = tokenProcessor.process(events);
      expect(transfers).toHaveLength(0);
    });

    it('should handle empty events array', () => {
      const transfers = tokenProcessor.process([]);
      expect(transfers).toHaveLength(0);
    });
  });
});
