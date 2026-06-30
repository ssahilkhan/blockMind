import { tokenDetector } from '../detector/token.detector';
import { erc20Service } from '../standards/erc20/erc20.service';
import { erc721Service } from '../standards/erc721/erc721.service';
import { erc1155Service } from '../standards/erc1155/erc1155.service';
import { TokenStandard, TokenMetadata } from '../types/token.types';
import { logger } from '../../logger';

export const metadataService = {
  async getMetadata(address: string): Promise<TokenMetadata> {
    logger.info('Fetching token metadata', { address });

    const detection = await tokenDetector.detectStandard(address);
    const standard = detection.standard;

    if (standard === TokenStandard.ERC20) {
      const [name, symbol, decimals, totalSupply] = await Promise.all([
        erc20Service.name(address),
        erc20Service.symbol(address),
        erc20Service.decimals(address),
        erc20Service.totalSupply(address),
      ]);

      return { name, symbol, decimals, totalSupply, standard: TokenStandard.ERC20 };
    }

    if (standard === TokenStandard.ERC721) {
      const [name, symbol] = await Promise.all([
        erc721Service.name(address),
        erc721Service.symbol(address),
      ]);

      return { name, symbol, decimals: 0, totalSupply: '0', standard: TokenStandard.ERC721 };
    }

    if (standard === TokenStandard.ERC1155) {
      const name = '';
      const symbol = '';
      return { name, symbol, decimals: 0, totalSupply: '0', standard: TokenStandard.ERC1155 };
    }

    throw new Error(`Unknown token standard for address ${address}`);
  },
};
