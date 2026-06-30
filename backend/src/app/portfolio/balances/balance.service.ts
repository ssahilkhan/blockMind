import { getChainService } from '../../chain/services/chain.service';
import { erc20Service } from '../../token/standards/erc20/erc20.service';
import { erc721Service } from '../../token/standards/erc721/erc721.service';
import { erc1155Service } from '../../token/standards/erc1155/erc1155.service';
import { tokenDetector } from '../../token/detector/token.detector';
import { TokenStandard } from '../../token/types/token.types';
import { NATIVE_DECIMALS, NATIVE_SYMBOL, NATIVE_NAME } from '../constants/portfolio.constants';
import { BalanceEntry } from '../types/portfolio.types';
import { logger } from '../../logger';

export const balanceService = {
  async getNativeBalance(wallet: string): Promise<BalanceEntry> {
    const chain = getChainService();
    const result = await chain.getBalance(wallet);
    logger.info('Native balance fetched', { wallet, balance: result.balance });
    return {
      type: 'native',
      contractAddress: null,
      tokenId: null,
      balance: result.balance,
      balanceWei: result.balanceWei,
      name: NATIVE_NAME,
      symbol: NATIVE_SYMBOL,
      decimals: NATIVE_DECIMALS,
      standard: 'native',
    };
  },

  async getTokenBalance(contract: string, wallet: string, tokenId?: string): Promise<BalanceEntry | null> {
    try {
      const detection = await tokenDetector.detectStandard(contract);
      if (detection.standard === TokenStandard.ERC20) {
        const bal = await erc20Service.balanceOf(contract, wallet);
        const name = await erc20Service.name(contract);
        const symbol = await erc20Service.symbol(contract);
        const decimals = await erc20Service.decimals(contract);
        return {
          type: 'ERC20',
          contractAddress: contract,
          tokenId: null,
          balance: bal.balance,
          balanceWei: null,
          name,
          symbol,
          decimals,
          standard: TokenStandard.ERC20,
        };
      }
      if (detection.standard === TokenStandard.ERC721 && tokenId) {
        const owner = await erc721Service.ownerOf(contract, tokenId);
        if (owner.toLowerCase() !== wallet.toLowerCase()) return null;
        return {
          type: 'ERC721',
          contractAddress: contract,
          tokenId,
          balance: '1',
          balanceWei: null,
          name: await erc721Service.name(contract),
          symbol: await erc721Service.symbol(contract),
          decimals: 0,
          standard: TokenStandard.ERC721,
        };
      }
      if (detection.standard === TokenStandard.ERC1155 && tokenId) {
        const bal = await erc1155Service.balanceOf(contract, wallet, tokenId);
        if (bal.balance === '0') return null;
        return {
          type: 'ERC1155',
          contractAddress: contract,
          tokenId,
          balance: bal.balance,
          balanceWei: null,
          name: 'ERC1155',
          symbol: 'ERC1155',
          decimals: 0,
          standard: TokenStandard.ERC1155,
        };
      }
      return null;
    } catch {
      return null;
    }
  },
};
