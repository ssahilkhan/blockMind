import { AssetItem } from '../types/portfolio.types';
import { logger } from '../../logger';

export interface ValuationEntry {
  asset: AssetItem;
  quantity: string;
  priceUsd: null;
  valueUsd: null;
}

export const valuationService = {
  estimate(assets: AssetItem[]): ValuationEntry[] {
    logger.info('Valuing assets', { count: assets.length });

    return assets.map((asset) => ({
      asset,
      quantity: asset.balance,
      priceUsd: null,
      valueUsd: null,
    }));
  },
};
