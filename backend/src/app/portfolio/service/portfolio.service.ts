import { assetAggregator } from '../assets/asset.aggregator';
import { balanceService } from '../balances/balance.service';
import { nftService } from '../nft/nft.service';
import { historyService } from '../history/history.service';
import { summaryService } from '../summary/summary.service';
import { portfolioMapper, PortfolioResponse, AssetResponse, NFTResponse, HistoryResponse, SummaryResponse } from '../mapper/portfolio.mapper';
import { NFTItem, HistoryEntry } from '../types/portfolio.types';
import { logger } from '../../logger';

export const portfolioService = {
  async getPortfolio(wallet: string): Promise<PortfolioResponse> {
    logger.info('Building portfolio', { wallet });

    const [assets, nfts, history] = await Promise.all([
      assetAggregator.aggregate(wallet),
      nftService.getOwnedNFTs(wallet),
      historyService.getWalletHistory(wallet),
    ]);

    const nativeAsset = assets.find((a) => a.type === 'native');
    const ethBalance = nativeAsset?.balance || '0';
    const nftItems: NFTItem[] = nfts;
    const historyItems: HistoryEntry[] = history;
    const summary = summaryService.generateSummary(wallet, assets, nftItems, ethBalance, historyItems);

    const balances = assets.filter((a) => a.type === 'native' || a.type === 'ERC20');
    return portfolioMapper.toPortfolioResponse(
      wallet, assets, balances, nftItems, historyItems, summary
    );
  },

  async getAssets(wallet: string): Promise<{ assets: AssetResponse[] }> {
    const assets = await assetAggregator.aggregate(wallet);
    return { assets: assets.map((a) => portfolioMapper.toAssetResponse(a)) };
  },

  async getBalances(wallet: string): Promise<{ balances: AssetResponse[] }> {
    const native = await balanceService.getNativeBalance(wallet);
    return { balances: [portfolioMapper.toBalanceResponse(native)] };
  },

  async getNFTs(wallet: string): Promise<{ nfts: NFTResponse[] }> {
    const nfts = await nftService.getOwnedNFTs(wallet);
    return { nfts: nfts.map((n) => portfolioMapper.toNFTResponse(n)) };
  },

  async getHistory(wallet: string, limit?: number): Promise<{ history: HistoryResponse[] }> {
    const history = await historyService.getWalletHistory(wallet, limit);
    return { history: history.map((h) => portfolioMapper.toHistoryResponse(h)) };
  },

  async getSummary(wallet: string): Promise<{ summary: SummaryResponse }> {
    const [assets, nfts, history] = await Promise.all([
      assetAggregator.aggregate(wallet),
      nftService.getOwnedNFTs(wallet),
      historyService.getWalletHistory(wallet),
    ]);

    const nativeAsset = assets.find((a) => a.type === 'native');
    const ethBalance = nativeAsset?.balance || '0';
    const summary = summaryService.generateSummary(wallet, assets, nfts, ethBalance, history);
    return { summary: portfolioMapper.toSummaryResponse(summary) };
  },
};
