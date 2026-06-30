import { getChainService } from '../../chain/services/chain.service';
import { decodeLogs } from '../decoder/event.decoder';
import { DecodedEventResult } from '../types/events.types';
import { logger } from '../../logger';
import { MAX_BLOCKS_PER_SCAN } from '../constants/events.constants';

export const eventListener = {
  async getEventsFromReceipt(txHash: string, customABI?: unknown[]): Promise<DecodedEventResult> {
    logger.info('Fetching events from receipt', { txHash });

    const chain = getChainService();
    const [receipt, tx] = await Promise.all([
      chain.getReceipt(txHash),
      chain.getTransaction(txHash),
    ]);

    if (!receipt) {
      return { events: [], total: 0 };
    }

    const logs = receipt.logs.map((log) => ({
      address: log.address,
      topics: log.topics,
      data: log.data,
      logIndex: log.logIndex,
    }));

    return decodeLogs(
      logs,
      receipt.blockNumber,
      receipt.blockHash,
      txHash,
      receipt.from,
      receipt.to,
      customABI
    );
  },

  async getEventsByBlock(blockNumber: number, customABI?: unknown[]): Promise<DecodedEventResult> {
    logger.info('Fetching events from block', { blockNumber });

    const chain = getChainService();
    const block = await chain.getBlockByNumber(blockNumber);

    if (!block) {
      return { events: [], total: 0 };
    }

    const allEvents: DecodedEventResult = { events: [], total: 0 };

    for (const txHash of block.transactions) {
      const result = await this.getEventsFromReceipt(txHash, customABI);
      allEvents.events.push(...result.events);
      allEvents.total += result.total;
    }

    allEvents.events.sort((a, b) => a.logIndex - b.logIndex);

    logger.info('Block events fetched', { blockNumber, eventCount: allEvents.total });
    return allEvents;
  },

  async getEventsBetweenBlocks(from: number, to: number, customABI?: unknown[]): Promise<DecodedEventResult> {
    logger.info('Fetching events between blocks', { from, to });

    const allEvents: DecodedEventResult = { events: [], total: 0 };
    const start = Math.max(0, from);
    const end = Math.min(to, start + MAX_BLOCKS_PER_SCAN - 1);

    for (let i = start; i <= end; i++) {
      const result = await this.getEventsByBlock(i, customABI);
      allEvents.events.push(...result.events);
      allEvents.total += result.total;
    }

    allEvents.events.sort((a, b) => a.blockNumber - b.blockNumber || a.logIndex - b.logIndex);

    logger.info('Block range events fetched', { from: start, to: end, eventCount: allEvents.total });
    return allEvents;
  },
};
