import { eventDecoderService } from '../../contract/event-decoder/event-decoder.service';
import { eventRegistry } from '../registry/event.registry';
import { logger } from '../../logger';
import { DecodedEvent, DecodedEventResult } from '../types/events.types';

export interface RawLogInput {
  address: string;
  topics: string[];
  data: string;
  logIndex: number;
}

export function decodeLogs(
  logs: RawLogInput[],
  blockNumber: number,
  blockHash: string,
  transactionHash: string,
  from: string,
  to: string | null,
  customABI?: unknown[]
): DecodedEventResult {
  const events: DecodedEvent[] = [];
  const standardABIs = eventRegistry.getStandardABIs();

  const abisToTry: unknown[][] = [];
  if (customABI) abisToTry.push(customABI);
  for (const [, abi] of standardABIs) {
    abisToTry.push(abi);
  }

  for (const log of logs) {
    for (const abi of abisToTry) {
      const result = eventDecoderService.decodeEvents({
        abi,
        logs: [{ address: log.address, topics: log.topics, data: log.data }],
      });

      for (const event of result.events) {
        events.push({
          eventName: event.eventName,
          signature: event.signature,
          args: event.args,
          contract: log.address,
          logIndex: log.logIndex,
          blockNumber,
          blockHash,
          transactionHash,
          from,
          to,
        });
      }
    }
  }

  events.sort((a, b) => a.logIndex - b.logIndex);

  logger.info('Logs decoded', { eventCount: events.length, txHash: transactionHash });
  return { events, total: events.length };
}
