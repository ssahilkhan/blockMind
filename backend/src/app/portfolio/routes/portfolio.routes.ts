import { Router } from 'express';
import {
  getPortfolio,
  getAssets,
  getBalances,
  getHistory,
  getNFTs,
  getSummary,
} from '../controller/portfolio.controller';

export const portfolioRouter = Router();

portfolioRouter.get('/:wallet', getPortfolio);
portfolioRouter.get('/:wallet/assets', getAssets);
portfolioRouter.get('/:wallet/balances', getBalances);
portfolioRouter.get('/:wallet/history', getHistory);
portfolioRouter.get('/:wallet/nfts', getNFTs);
portfolioRouter.get('/:wallet/summary', getSummary);
