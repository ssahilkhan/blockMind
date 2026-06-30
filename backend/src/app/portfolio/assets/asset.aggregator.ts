import { eventService } from '../../events/service/event.service';
import { tokenDetector } from '../../token/detector/token.detector';
import { erc20Service } from '../../token/standards/erc20/erc20.service';
import { TokenStandard } from '../../token/types/token.types';
import { balanceService } from '../balances/balance.service';
import { nftService } from '../nft/nft.service';
import { AssetItem } from '../types/portfolio.types';
import { logger } from '../../logger';

export const assetAggregator = {
  async aggregate(wallet: string): Promise<AssetItem[]> {
    logger.info('Aggregating assets', { wallet });
    const assets: AssetItem[] = [];

    const native = await balanceService.getNativeBalance(wallet);
    assets.push({
      type: 'native',
      contractAddress: null,
      tokenId: null,
      name: native.name,
      symbol: native.symbol,
      decimals: native.decimals,
      balance: native.balance,
      balanceWei: native.balanceWei,
      standard: 'native',
      metadataURI: null,
    });

    const events = await eventService.searchEvents({ wallet });
    const erc20Candidates = new Set<string>();

    for (const event of events.events) {
      if (event.eventName !== 'Transfer') continue;
      const hasTokenId = event.args.tokenId !== undefined;
      if (!hasTokenId) {
        erc20Candidates.add(event.contract.toLowerCase());
      }
    }

    for (const addr of erc20Candidates) {
      try {
        const detection = await tokenDetector.detectStandard(addr);
        if (detection.standard !== TokenStandard.ERC20) continue;
        const bal = await erc20Service.balanceOf(addr, wallet);
        if (bal.balance === '0') continue;
        const name = await erc20Service.name(addr);
        const symbol = await erc20Service.symbol(addr);
        const decimals = await erc20Service.decimals(addr);
        assets.push({
          type: 'ERC20',
          contractAddress: addr,
          tokenId: null,
          name,
          symbol,
          decimals,
          balance: bal.balance,
          balanceWei: null,
          standard: TokenStandard.ERC20,
          metadataURI: null,
        });
      } catch { /* skip */ }
    }

    const nfts = await nftService.getOwnedNFTs(wallet);
    for (const nft of nfts) {
      assets.push({
        type: nft.standard === TokenStandard.ERC721 ? 'ERC721' : 'ERC1155',
        contractAddress: nft.contractAddress,
        tokenId: nft.tokenId,
        name: nft.name,
        symbol: nft.symbol,
        decimals: nft.standard === TokenStandard.ERC721 ? 0 : 0,
        balance: '1',
        balanceWei: null,
        standard: nft.standard,
        metadataURI: nft.metadataURI,
      });
    }

    return assets;
  },
};
