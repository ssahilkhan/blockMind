import { eventMapper } from '../mapper/event.mapper';
import { DecodedEvent } from '../types/events.types';

const mockEvent: DecodedEvent = {
  eventName: 'Transfer',
  signature: 'Transfer(address,address,uint256)',
  args: { from: '0xaaa', to: '0xbbb', value: 100n },
  contract: '0x1111111111111111111111111111111111111111',
  logIndex: 0,
  blockNumber: 10,
  blockHash: '0x' + 'a'.repeat(64),
  transactionHash: '0x' + 'b'.repeat(64),
  from: '0xaaa',
  to: '0x1111111111111111111111111111111111111111',
};

describe('Event Mapper', () => {
  it('should map single event to response', () => {
    const result = eventMapper.toEventResponse(mockEvent);
    expect(result.eventName).toBe('Transfer');
    expect(result.signature).toBe('Transfer(address,address,uint256)');
    expect(result.blockNumber).toBe(10);
    expect(result.logIndex).toBe(0);
    expect(result.args).toEqual({ from: '0xaaa', to: '0xbbb', value: 100n });
  });

  it('should map list result to response', () => {
    const result = eventMapper.toEventListResponse({ events: [mockEvent, mockEvent], total: 2 });
    expect(result.events).toHaveLength(2);
    expect(result.total).toBe(2);
  });

  it('should map empty result', () => {
    const result = eventMapper.toEventListResponse({ events: [], total: 0 });
    expect(result.events).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it('should map registry info', () => {
    const info = {
      standards: ['ERC20', 'ERC721'],
      events: [
        { signature: 'ERC20:Transfer', name: 'Transfer', standard: 'ERC20' },
      ],
      contracts: [
        { address: '0xabc', abi: [], label: 'Test' },
      ],
    };
    const result = eventMapper.toRegistryResponse(info);
    expect(result.standards).toEqual(['ERC20', 'ERC721']);
    expect(result.events).toHaveLength(1);
    expect(result.events[0].signature).toBe('ERC20:Transfer');
    expect(result.contracts).toHaveLength(1);
    expect(result.contracts[0].address).toBe('0xabc');
  });
});
