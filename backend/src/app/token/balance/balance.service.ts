import { tokenDetector } from '../detector/token.detector';
import { erc20Service } from '../standards/erc20/erc20.service';
import { erc721Service } from '../standards/erc721/erc721.service';
import { erc1155Service } from '../standards/erc1155/erc1155.service';
import { TokenStandard, TokenBalance, TokenBalanceResult } from '../types/token.types';
import { logger } from '../../logger';

export const balanceService = {
  async getBalance(tokenAddress: string, wallet: string, tokenId?: string): Promise<TokenBalanceResult> {
    logger.info('Fetching token balance', { tokenAddress, wallet, tokenId });

    const detection = await tokenDetector.detectStandard(tokenAddress);

    if (detection.standard === TokenStandard.ERC20) {
      const balance = await erc20Service.balanceOf(tokenAddress, wallet);
      return { balances: [balance] };
    }

    if (detection.standard === TokenStandard.ERC721) {
      const balance = await erc721Service.balanceOf(tokenAddress, wallet);
      return { balances: [balance] };
    }

    if (detection.standard === TokenStandard.ERC1155) {
      if (!tokenId) {
        throw new Error('tokenId is required for ERC1155 balance queries');
      }
      const balance = await erc1155Service.balanceOf(tokenAddress, wallet, tokenId);
      return { balances: [balance] };
    }

    throw new Error(`Unknown token standard at ${tokenAddress}`);
  },
};
