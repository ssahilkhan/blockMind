import { IndexedTokenTransfer, IndexedEvent } from '../types/indexer.types';
import { TRANSFER_EVENT_TOPIC } from '../constants/indexer.constants';
import { TokenStandard } from '../../token/types/token.types';
import { logger } from '../../logger';

function now(): string {
  return new Date().toISOString();
}

function determineStandard(event: IndexedEvent): string {
  const args = event.args as Record<string, unknown>;
  if (args.tokenId !== undefined && args.value !== undefined) return TokenStandard.ERC1155;
  if (args.tokenId !== undefined) return TokenStandard.ERC721;
  return TokenStandard.ERC20;
}

export const tokenProcessor = {
  process(events: IndexedEvent[]): IndexedTokenTransfer[] {
    const transfers: IndexedTokenTransfer[] = [];

    for (const event of events) {
      if (event.eventName !== TRANSFER_EVENT_TOPIC) continue;

      const args = event.args as Record<string, unknown>;
      const from = String(args.from ?? '');
      const to = String(args.to ?? '');
      if (!from || !to) continue;

      const standard = determineStandard(event);
      const transfer: IndexedTokenTransfer = {
        id: event.id,
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        contract: event.contract,
        standard,
        from,
        to,
        tokenId: args.tokenId !== undefined ? String(args.tokenId) : null,
        value: String(args.value ?? args.tokenId ?? '0'),
        indexedAt: now(),
      };

      transfers.push(transfer);
    }

    if (transfers.length) {
      logger.info('Token transfers processed', { count: transfers.length });
    }
    return transfers;
  },
};
