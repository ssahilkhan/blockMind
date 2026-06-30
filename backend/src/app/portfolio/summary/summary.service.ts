import { AssetItem, NFTItem, PortfolioSummary, HistoryEntry } from '../types/portfolio.types';
import { logger } from '../../logger';

export const summaryService = {
  generateSummary(
    wallet: string,
    assets: AssetItem[],
    nfts: NFTItem[],
    ethBalance: string,
    history: HistoryEntry[]
  ): PortfolioSummary {
    logger.info('Generating portfolio summary', { wallet });

    const tokenCount = assets.filter((a) => a.type === 'ERC20').length;
    const nftCount = nfts.length;

    const blockNumbers = history.map((h) => h.blockNumber).filter((n) => n > 0);
    const firstActivity = blockNumbers.length > 0 ? String(Math.min(...blockNumbers)) : null;
    const latestActivity = blockNumbers.length > 0 ? String(Math.max(...blockNumbers)) : null;

    return {
      totalAssets: assets.length,
      tokenCount,
      nftCount,
      ethBalance,
      totalTransactions: history.length,
      firstActivity,
      latestActivity,
    };
  },
};
