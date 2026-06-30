import { ethers } from 'ethers';
import { tokenDetector } from '../detector/token.detector';
import { erc20Service } from '../standards/erc20/erc20.service';
import { erc721Service } from '../standards/erc721/erc721.service';
import { erc1155Service } from '../standards/erc1155/erc1155.service';
import { TokenStandard, TransferRequest, TransferResult } from '../types/token.types';
import { logger } from '../../logger';

export const transferService = {
  async transfer(request: TransferRequest): Promise<TransferResult> {
    logger.info('Initiating token transfer', {
      tokenAddress: request.tokenAddress,
      to: request.to,
      standard: request.standard,
    });

    const wallet = new ethers.Wallet(request.fromPrivateKey);
    const from = wallet.address;

    if (request.standard === TokenStandard.ERC20) {
      if (!request.amount) throw new Error('amount is required for ERC20 transfer');
      const txHash = await erc20Service.transfer(
        request.fromPrivateKey,
        request.tokenAddress,
        request.to,
        request.amount
      );
      return {
        transactionHash: txHash,
        tokenAddress: request.tokenAddress,
        from,
        to: request.to,
        amount: request.amount,
        standard: TokenStandard.ERC20,
      };
    }

    if (request.standard === TokenStandard.ERC721) {
      if (!request.tokenId) throw new Error('tokenId is required for ERC721 transfer');
      const txHash = await erc721Service.safeTransferFrom(
        request.fromPrivateKey,
        request.tokenAddress,
        from,
        request.to,
        request.tokenId
      );
      return {
        transactionHash: txHash,
        tokenAddress: request.tokenAddress,
        from,
        to: request.to,
        tokenId: request.tokenId,
        standard: TokenStandard.ERC721,
      };
    }

    if (request.standard === TokenStandard.ERC1155) {
      if (!request.tokenId) throw new Error('tokenId is required for ERC1155 transfer');
      if (!request.amount) throw new Error('amount is required for ERC1155 transfer');
      const txHash = await erc1155Service.safeTransferFrom(
        request.fromPrivateKey,
        request.tokenAddress,
        from,
        request.to,
        request.tokenId,
        request.amount
      );
      return {
        transactionHash: txHash,
        tokenAddress: request.tokenAddress,
        from,
        to: request.to,
        tokenId: request.tokenId,
        amount: request.amount,
        standard: TokenStandard.ERC1155,
      };
    }

    throw new Error(`Unsupported token standard: ${request.standard}`);
  },
};
