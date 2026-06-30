import { eventService } from '../../events/service/event.service';
import { erc721Service } from '../../token/standards/erc721/erc721.service';
import { erc1155Service } from '../../token/standards/erc1155/erc1155.service';
import { tokenDetector } from '../../token/detector/token.detector';
import { TokenStandard } from '../../token/types/token.types';
import { NFTItem } from '../types/portfolio.types';
import { logger } from '../../logger';

export const nftService = {
  async getOwnedNFTs(wallet: string): Promise<NFTItem[]> {
    logger.info('Discovering NFTs', { wallet });

    const events = await eventService.searchEvents({ wallet });

    const transferOut721 = new Set<string>();
    const transferIn721 = new Set<string>();
    const balance1155 = new Map<string, Set<string>>();
    const erc721Contracts = new Set<string>();
    const erc1155Contracts = new Set<string>();

    for (const event of events.events) {
      if (event.eventName !== 'Transfer' && event.eventName !== 'TransferSingle' && event.eventName !== 'TransferBatch') continue;

      const contract = event.contract.toLowerCase();

      if (event.eventName === 'Transfer') {
        const tokenId = event.args.tokenId as string | undefined;
        if (!tokenId) continue;
        const key = `${contract}:${tokenId}`;
        const to = (event.args.to as string || '').toLowerCase();
        const from = (event.args.from as string || '').toLowerCase();
        if (to === wallet.toLowerCase()) transferIn721.add(key);
        if (from === wallet.toLowerCase()) transferOut721.add(key);
      }

      if (event.eventName === 'TransferSingle') {
        const id = event.args.id as string | undefined;
        const to = (event.args.to as string || '').toLowerCase();
        const from = (event.args.from as string || '').toLowerCase();
        const value = event.args.value as string | undefined;
        if (!id) continue;
        if (!balance1155.has(contract)) balance1155.set(contract, new Set());
        if (to === wallet.toLowerCase()) balance1155.get(contract)!.add(id);
        if (from === wallet.toLowerCase()) balance1155.get(contract)!.delete(id);
      }

      if (event.eventName === 'TransferBatch') {
        const ids = event.args.ids as string[] | undefined;
        const to = (event.args.to as string || '').toLowerCase();
        const from = (event.args.from as string || '').toLowerCase();
        if (!ids) continue;
        if (!balance1155.has(contract)) balance1155.set(contract, new Set());
        for (const id of ids) {
          if (to === wallet.toLowerCase()) balance1155.get(contract)!.add(id);
          if (from === wallet.toLowerCase()) balance1155.get(contract)!.delete(id);
        }
      }
    }

    const owned721Keys = new Set<string>();
    for (const key of transferIn721) {
      if (!transferOut721.has(key)) owned721Keys.add(key);
    }

    const nfts: NFTItem[] = [];

    for (const key of owned721Keys) {
      const [contract, tokenId] = key.split(':');
      try {
        const owner = await erc721Service.ownerOf(contract, tokenId);
        if (owner.toLowerCase() !== wallet.toLowerCase()) continue;
        const name = await erc721Service.name(contract);
        const symbol = await erc721Service.symbol(contract);
        const uri = await erc721Service.tokenURI(contract, tokenId);
        nfts.push({ contractAddress: contract, tokenId, name, symbol, metadataURI: uri, standard: TokenStandard.ERC721 });
      } catch { /* stale event */ }
    }

    for (const [contract, tokenIds] of balance1155) {
      for (const tokenId of tokenIds) {
        try {
          const bal = await erc1155Service.balanceOf(contract, wallet, tokenId);
          if (bal.balance === '0') continue;
          const uri = await erc1155Service.uri(contract, tokenId);
          nfts.push({ contractAddress: contract, tokenId, name: 'ERC1155', symbol: 'ERC1155', metadataURI: uri, standard: TokenStandard.ERC1155 });
        } catch { /* skip */ }
      }
    }

    logger.info('NFT discovery complete', { wallet, count: nfts.length });
    return nfts;
  },
};
