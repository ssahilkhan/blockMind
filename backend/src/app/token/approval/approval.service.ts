import { ethers } from 'ethers';
import { tokenDetector } from '../detector/token.detector';
import { erc20Service } from '../standards/erc20/erc20.service';
import { erc721Service } from '../standards/erc721/erc721.service';
import { erc1155Service } from '../standards/erc1155/erc1155.service';
import {
  TokenStandard,
  ApprovalRequest,
  ApprovalResult,
  AllowanceRequest,
  AllowanceResult,
  SetApprovalForAllRequest,
  GetApprovedRequest,
  GetApprovedResult,
  IsApprovedForAllRequest,
  IsApprovedForAllResult,
} from '../types/token.types';
import { logger } from '../../logger';

export const approvalService = {
  async approve(request: ApprovalRequest): Promise<ApprovalResult> {
    logger.info('Initiating token approval', {
      tokenAddress: request.tokenAddress,
      spender: request.spender,
      standard: request.standard,
    });

    const wallet = new ethers.Wallet(request.privateKey);

    if (request.standard === TokenStandard.ERC20) {
      if (!request.amount) throw new Error('amount is required for ERC20 approve');
      const txHash = await erc20Service.approve(
        request.privateKey,
        request.tokenAddress,
        request.spender,
        request.amount
      );
      return {
        transactionHash: txHash,
        tokenAddress: request.tokenAddress,
        owner: wallet.address,
        spender: request.spender,
        amount: request.amount,
        standard: TokenStandard.ERC20,
      };
    }

    if (request.standard === TokenStandard.ERC721) {
      if (!request.tokenId) throw new Error('tokenId is required for ERC721 approve');
      const txHash = await erc721Service.approve(
        request.privateKey,
        request.tokenAddress,
        request.spender,
        request.tokenId
      );
      return {
        transactionHash: txHash,
        tokenAddress: request.tokenAddress,
        owner: wallet.address,
        spender: request.spender,
        tokenId: request.tokenId,
        standard: TokenStandard.ERC721,
      };
    }

    throw new Error(`Approval not supported for standard: ${request.standard}`);
  },

  async setApprovalForAll(request: SetApprovalForAllRequest): Promise<string> {
    logger.info('Setting approval for all', {
      tokenAddress: request.tokenAddress,
      operator: request.operator,
      approved: request.approved,
      standard: request.standard,
    });

    if (request.standard === TokenStandard.ERC721) {
      return erc721Service.setApprovalForAll(
        request.privateKey,
        request.tokenAddress,
        request.operator,
        request.approved
      );
    }

    if (request.standard === TokenStandard.ERC1155) {
      return erc1155Service.setApprovalForAll(
        request.privateKey,
        request.tokenAddress,
        request.operator,
        request.approved
      );
    }

    throw new Error(`setApprovalForAll not supported for standard: ${request.standard}`);
  },

  async allowance(request: AllowanceRequest): Promise<AllowanceResult> {
    logger.info('Fetching allowance', {
      tokenAddress: request.tokenAddress,
      owner: request.owner,
      spender: request.spender,
    });

    if (request.standard === TokenStandard.ERC20) {
      const allowance = await erc20Service.allowance(
        request.tokenAddress,
        request.owner,
        request.spender
      );
      return {
        tokenAddress: request.tokenAddress,
        owner: request.owner,
        spender: request.spender,
        allowance,
        standard: TokenStandard.ERC20,
      };
    }

    throw new Error(`Allowance not supported for standard: ${request.standard}`);
  },

  async getApproved(request: GetApprovedRequest): Promise<GetApprovedResult> {
    logger.info('Fetching approved address for token', {
      tokenAddress: request.tokenAddress,
      tokenId: request.tokenId,
    });

    const approved = await erc721Service.getApproved(
      request.tokenAddress,
      request.tokenId
    );
    return {
      tokenAddress: request.tokenAddress,
      tokenId: request.tokenId,
      approved,
    };
  },

  async isApprovedForAll(request: IsApprovedForAllRequest): Promise<IsApprovedForAllResult> {
    logger.info('Checking isApprovedForAll', {
      tokenAddress: request.tokenAddress,
      owner: request.owner,
      operator: request.operator,
    });

    const approved = await erc721Service.isApprovedForAll(
      request.tokenAddress,
      request.owner,
      request.operator
    );
    return {
      tokenAddress: request.tokenAddress,
      owner: request.owner,
      operator: request.operator,
      approved,
    };
  },
};
