import { DecodedEvent, FilterCriteria } from '../types/events.types';
import { logger } from '../../logger';

export function applyFilter(events: DecodedEvent[], filter: FilterCriteria): DecodedEvent[] {
  logger.info('Applying event filter', { filter });

  return events.filter((event) => {
    if (filter.contract) {
      const match = event.contract.toLowerCase() === filter.contract.toLowerCase();
      if (!match) return false;
    }

    if (filter.eventName) {
      if (event.eventName.toLowerCase() !== filter.eventName.toLowerCase()) return false;
    }

    if (filter.wallet) {
      const wallet = filter.wallet.toLowerCase();
      const args = event.args as Record<string, unknown>;
      const argValues = Object.values(args).map((v) => String(v).toLowerCase());
      const matchesWallet =
        event.from.toLowerCase() === wallet ||
        (event.to !== null && event.to.toLowerCase() === wallet) ||
        argValues.some((v) => v === wallet || v.includes(wallet.slice(2)));
      if (!matchesWallet) return false;
    }

    if (filter.fromBlock !== undefined && event.blockNumber < filter.fromBlock) return false;
    if (filter.toBlock !== undefined && event.blockNumber > filter.toBlock) return false;

    if (filter.txHash) {
      if (event.transactionHash.toLowerCase() !== filter.txHash.toLowerCase()) return false;
    }

    return true;
  });
}
