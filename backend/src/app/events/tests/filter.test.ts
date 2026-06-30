import { applyFilter } from '../filter/event.filter';
import { DecodedEvent } from '../types/events.types';

const makeEvent = (overrides: Partial<DecodedEvent> = {}): DecodedEvent => ({
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
  ...overrides,
});

const events: DecodedEvent[] = [
  makeEvent({ eventName: 'Transfer', blockNumber: 10, logIndex: 0 }),
  makeEvent({ eventName: 'Approval', blockNumber: 10, logIndex: 1 }),
  makeEvent({ eventName: 'Transfer', blockNumber: 11, logIndex: 0, contract: '0x2222222222222222222222222222222222222222' }),
];

describe('Event Filter', () => {
  it('should return all events when no filter', () => {
    const result = applyFilter(events, {});
    expect(result).toHaveLength(3);
  });

  it('should filter by contract address', () => {
    const result = applyFilter(events, { contract: '0x2222222222222222222222222222222222222222' });
    expect(result).toHaveLength(1);
    expect(result[0].contract).toBe('0x2222222222222222222222222222222222222222');
  });

  it('should filter by event name', () => {
    const result = applyFilter(events, { eventName: 'Approval' });
    expect(result).toHaveLength(1);
    expect(result[0].eventName).toBe('Approval');
  });

  it('should filter by fromBlock', () => {
    const result = applyFilter(events, { fromBlock: 11 });
    expect(result).toHaveLength(1);
    expect(result[0].blockNumber).toBe(11);
  });

  it('should filter by toBlock', () => {
    const result = applyFilter(events, { toBlock: 10 });
    expect(result).toHaveLength(2);
    expect(result.every((e) => e.blockNumber <= 10)).toBe(true);
  });

  it('should filter by txHash', () => {
    const targetTx = events[0].transactionHash;
    const filtered = events.filter((e) => e.transactionHash === targetTx);
    const result = applyFilter(events, { txHash: targetTx });
    expect(result).toHaveLength(filtered.length);
  });

  it('should filter by wallet address in from field', () => {
    const result = applyFilter(events, { wallet: '0xaaa' });
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it('should combine multiple filters', () => {
    const result = applyFilter(events, { eventName: 'Transfer', fromBlock: 10, toBlock: 10 });
    expect(result).toHaveLength(1);
    expect(result[0].eventName).toBe('Transfer');
    expect(result[0].blockNumber).toBe(10);
  });

  it('should return empty array for no match', () => {
    const result = applyFilter(events, { eventName: 'NonExistent' });
    expect(result).toHaveLength(0);
  });
});
