import { getChainService } from '../../chain/services/chain.service';
import { IndexedBlock } from '../types/indexer.types';
import { logger } from '../../logger';

function now(): string {
  return new Date().toISOString();
}

export const blockScanner = {
  async scanLatest(): Promise<IndexedBlock | null> {
    const chain = getChainService();
    const block = await chain.getLatestBlock();
    if (!block) return null;

    logger.info('Block scanned', { blockNumber: block.number });
    return {
      blockNumber: block.number,
      hash: block.hash,
      parentHash: block.parentHash,
      timestamp: parseInt(block.timestamp, 10),
      transactionCount: block.transactionCount,
      indexedAt: now(),
    };
  },

  async scanBlock(number: number): Promise<IndexedBlock | null> {
    const chain = getChainService();
    const block = await chain.getBlockByNumber(number);
    if (!block) return null;

    logger.info('Block scanned', { blockNumber: block.number });
    return {
      blockNumber: block.number,
      hash: block.hash,
      parentHash: block.parentHash,
      timestamp: parseInt(block.timestamp, 10),
      transactionCount: block.transactionCount,
      indexedAt: now(),
    };
  },

  async scanRange(from: number, to: number): Promise<IndexedBlock[]> {
    const results: IndexedBlock[] = [];
    for (let i = from; i <= to; i++) {
      const block = await this.scanBlock(i);
      if (block) results.push(block);
    }
    return results;
  },
};
