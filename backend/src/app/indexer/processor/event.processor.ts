import { eventService } from '../../events/service/event.service';
import { IndexedEvent, IndexedBlock } from '../types/indexer.types';
import { logger } from '../../logger';

function now(): string {
  return new Date().toISOString();
}

export const eventProcessor = {
  async process(block: IndexedBlock): Promise<IndexedEvent[]> {
    const result = await eventService.getEventsByBlock(block.blockNumber);
    if (!result.events.length) return [];

    const events: IndexedEvent[] = result.events.map((e) => ({
      id: `${block.blockNumber}-${e.logIndex}`,
      blockNumber: e.blockNumber,
      transactionHash: e.transactionHash,
      logIndex: e.logIndex,
      contract: e.contract,
      eventName: e.eventName,
      signature: e.signature,
      args: e.args,
      from: e.from,
      to: e.to,
      indexedAt: now(),
    }));

    logger.info('Events processed', { blockNumber: block.blockNumber, count: events.length });
    return events;
  },
};
