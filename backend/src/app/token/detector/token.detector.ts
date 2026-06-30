import { ethers } from 'ethers';
import { callerService } from '../../contract/caller/caller.service';
import { getChainService } from '../../chain/services/chain.service';
import {
  ERC165_ABI,
  ERC165_INTERFACE_ID,
  ERC20_INTERFACE_ID,
  ERC721_INTERFACE_ID,
  ERC1155_INTERFACE_ID,
} from '../constants/token.constants';
import { TokenStandard, DetectionResult } from '../types/token.types';
import { logger } from '../../logger';

function formatId(id: string): string {
  return id.toLowerCase();
}

function sig(selector: string): string {
  return selector.slice(2, 10);
}

export const tokenDetector = {
  async detectStandard(address: string): Promise<DetectionResult> {
    logger.info('Detecting token standard', { address });

    const supportsERC165 = await this.supportsERC165(address);

    if (supportsERC165) {
      const isERC20 = await this.supportsInterface(address, ERC20_INTERFACE_ID);
      if (isERC20) {
        logger.info('Token detected as ERC20', { address });
        return { address, standard: TokenStandard.ERC20, supportsERC165: true };
      }

      const isERC721 = await this.supportsInterface(address, ERC721_INTERFACE_ID);
      if (isERC721) {
        logger.info('Token detected as ERC721', { address });
        return { address, standard: TokenStandard.ERC721, supportsERC165: true };
      }

      const isERC1155 = await this.supportsInterface(address, ERC1155_INTERFACE_ID);
      if (isERC1155) {
        logger.info('Token detected as ERC1155', { address });
        return { address, standard: TokenStandard.ERC1155, supportsERC165: true };
      }
    }

    const detected = await this.detectByFallback(address);
    logger.info('Token detected by fallback', { address, standard: detected.standard });
    return detected;
  },

  async supportsERC165(address: string): Promise<boolean> {
    try {
      return await this.supportsInterface(address, ERC165_INTERFACE_ID);
    } catch {
      return false;
    }
  },

  async supportsInterface(address: string, interfaceId: string): Promise<boolean> {
    try {
      const result = await callerService.read({
        contractAddress: address,
        abi: ERC165_ABI,
        functionName: 'supportsInterface',
        args: [formatId(interfaceId)],
      });
      const value = result.result as { 0?: boolean };
      return value[0] === true;
    } catch {
      return false;
    }
  },

  async detectByFallback(address: string): Promise<DetectionResult> {
    const chain = getChainService();

    const erc1155Sig = sig(ethers.id('balanceOf(address,uint256)'));
    try {
      const padded = '0x' + erc1155Sig + '0'.repeat(24) + address.slice(2) + '0'.repeat(63) + '1';
      const data = await chain.call({ to: address, data: padded });
      if (data !== '0x' && data.length > 2) {
        return { address, standard: TokenStandard.ERC1155, supportsERC165: false };
      }
    } catch {
      // not ERC1155
    }

    const erc20Sig = sig(ethers.id('totalSupply()'));
    try {
      const padded = '0x' + erc20Sig;
      const data = await chain.call({ to: address, data: padded });
      if (data && data !== '0x' && data.length > 2) {
        return { address, standard: TokenStandard.ERC20, supportsERC165: false };
      }
    } catch {
      // not ERC20
    }

    const erc721Sig = sig(ethers.id('ownerOf(uint256)'));
    try {
      const padded = '0x' + erc721Sig + '0'.repeat(63) + '0';
      const data = await chain.call({ to: address, data: padded });
      if (data.length === 66 && data !== '0x' + '0'.repeat(64)) {
        return { address, standard: TokenStandard.ERC721, supportsERC165: false };
      }
    } catch {
      return { address, standard: TokenStandard.ERC721, supportsERC165: false };
    }

    return { address, standard: TokenStandard.Unknown, supportsERC165: false };
  },
};
