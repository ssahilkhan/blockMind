import { blockMapper } from '../mapper/block.mapper';
import { transactionMapper } from '../mapper/transaction.mapper';
import { receiptMapper } from '../mapper/receipt.mapper';
import { RawBlock, RawTransaction, RawReceipt } from '../types';

describe('blockMapper', () => {
  const rawBlock: RawBlock = {
    number: 42,
    hash: '0xabcdef',
    parentHash: '0x123456',
    timestamp: 1719000000,
    transactions: ['0xtx1', '0xtx2', '0xtx3'],
    gasUsed: 50000n,
    gasLimit: 100000n,
    miner: '0xabcd',
    extraData: '0x00',
    difficulty: 12345n,
    baseFeePerGas: null,
    size: null,
  };

  it('should map all fields', () => {
    const result = blockMapper.toResponse(rawBlock);
    expect(result.number).toBe(42);
    expect(result.hash).toBe('0xabcdef');
    expect(result.parentHash).toBe('0x123456');
    expect(result.timestamp).toBeDefined();
    expect(result.transactionCount).toBe(3);
    expect(result.transactions).toEqual(['0xtx1', '0xtx2', '0xtx3']);
    expect(result.gasUsed).toBe('50000');
    expect(result.gasLimit).toBe('100000');
    expect(result.gasUsedPercent).toBe('50.00%');
    expect(result.miner).toBe('0xabcd');
    expect(result.difficulty).toBe('12345');
    expect(result.baseFee).toBeNull();
    expect(result.extraData).toBe('0x00');
    expect(result.size).toBeNull();
  });

  it('should format base fee correctly', () => {
    const withBaseFee: RawBlock = { ...rawBlock, baseFeePerGas: 1000000000n };
    const result = blockMapper.toResponse(withBaseFee);
    expect(result.baseFee).toBe('1.0 gwei');
  });

  it('should handle empty transactions', () => {
    const empty: RawBlock = { ...rawBlock, transactions: [], gasUsed: 0n };
    const result = blockMapper.toResponse(empty);
    expect(result.transactionCount).toBe(0);
    expect(result.gasUsedPercent).toBe('0.00%');
  });

  it('should format timestamp as ISO string', () => {
    const result = blockMapper.toResponse(rawBlock);
    const parsed = new Date(result.timestamp);
    expect(parsed.toISOString()).toBe(result.timestamp);
  });
});

describe('transactionMapper', () => {
  const rawTx: RawTransaction = {
    hash: '0xtxhash',
    blockNumber: 42,
    blockHash: '0xblockhash',
    from: '0xfrom',
    to: '0xto',
    value: 1000000000000000000n,
    gasPrice: 20000000000n,
    gasLimit: 21000n,
    nonce: 5,
    input: '0xdeadbeef',
  };

  it('should map all fields', () => {
    const result = transactionMapper.toResponse(rawTx);
    expect(result.hash).toBe('0xtxhash');
    expect(result.blockNumber).toBe(42);
    expect(result.blockHash).toBe('0xblockhash');
    expect(result.from).toBe('0xfrom');
    expect(result.to).toBe('0xto');
    expect(result.value).toBe('1.0 ETH');
    expect(result.gasPrice).toBe('20.0 gwei');
    expect(result.gasLimit).toBe('21000');
    expect(result.nonce).toBe(5);
    expect(result.input).toBe('0xdeadbeef');
  });

  it('should handle null to (contract creation)', () => {
    const creation: RawTransaction = { ...rawTx, to: null };
    const result = transactionMapper.toResponse(creation);
    expect(result.to).toBeNull();
  });

  it('should format zero value correctly', () => {
    const zero: RawTransaction = { ...rawTx, value: 0n };
    const result = transactionMapper.toResponse(zero);
    expect(result.value).toBe('0.0 ETH');
  });
});

describe('receiptMapper', () => {
  const rawReceipt: RawReceipt = {
    transactionHash: '0xtxhash',
    blockNumber: 42,
    blockHash: '0xblockhash',
    from: '0xfrom',
    to: '0xto',
    status: 1,
    gasUsed: 21000n,
    gasPrice: 20000000000n,
    cumulativeGasUsed: 21000n,
    contractAddress: null,
    logs: [
      {
        address: '0xlogaddr',
        topics: ['0xtopic1', '0xtopic2'],
        data: '0xdata',
        logIndex: 0,
      },
    ],
  };

  it('should map success status', () => {
    const result = receiptMapper.toResponse(rawReceipt);
    expect(result.transactionHash).toBe('0xtxhash');
    expect(result.blockNumber).toBe(42);
    expect(result.blockHash).toBe('0xblockhash');
    expect(result.from).toBe('0xfrom');
    expect(result.to).toBe('0xto');
    expect(result.status).toBe('success');
    expect(result.gasUsed).toBe('21000');
    expect(result.gasPrice).toBe('20.0 gwei');
    expect(result.contractAddress).toBeNull();
  });

  it('should map failed status', () => {
    const failed: RawReceipt = { ...rawReceipt, status: 0 };
    const result = receiptMapper.toResponse(failed);
    expect(result.status).toBe('failed');
  });

  it('should map logs', () => {
    const result = receiptMapper.toResponse(rawReceipt);
    expect(result.logs).toHaveLength(1);
    expect(result.logs[0].address).toBe('0xlogaddr');
    expect(result.logs[0].topics).toEqual(['0xtopic1', '0xtopic2']);
    expect(result.logs[0].data).toBe('0xdata');
    expect(result.logs[0].logIndex).toBe(0);
  });

  it('should handle contract address', () => {
    const withContract: RawReceipt = {
      ...rawReceipt,
      to: null,
      contractAddress: '0xnewcontract',
    };
    const result = receiptMapper.toResponse(withContract);
    expect(result.contractAddress).toBe('0xnewcontract');
  });
});
