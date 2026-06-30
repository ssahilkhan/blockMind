import { eventService } from '../../events/service/event.service';
import { HistoryEntry } from '../types/portfolio.types';
import { logger } from '../../logger';

export const historyService = {
  async getWalletHistory(wallet: string, limit?: number): Promise<HistoryEntry[]> {
    logger.info('Fetching wallet history', { wallet });

    const result = await eventService.searchEvents({ wallet });

    const history: HistoryEntry[] = result.events.map((event) => ({
      eventName: event.eventName,
      contract: event.contract,
      transactionHash: event.transactionHash,
      blockNumber: event.blockNumber,
      timestamp: null,
      args: event.args,
      standard: 'unknown',
    }));

    history.sort((a, b) => b.blockNumber - a.blockNumber);

    const sliced = limit ? history.slice(0, limit) : history;

    logger.info('Wallet history fetched', { wallet, count: sliced.length });
    return sliced;
  },
};
