import { tokenDetector } from '../detector/token.detector';
import { metadataService } from '../metadata/metadata.service';
import { balanceService } from '../balance/balance.service';
import { transferService } from '../transfer/transfer.service';
import { approvalService } from '../approval/approval.service';
import { erc721Service } from '../standards/erc721/erc721.service';
import { tokenMapper } from '../mapper/token.mapper';
import {
  TokenStandard,
  DetectionResult,
  TokenMetadata,
  TokenBalanceResult,
  TransferRequest,
  TransferResult,
  ApprovalRequest,
  ApprovalResult,
  AllowanceRequest,
  AllowanceResult,
  SetApprovalForAllRequest,
  GetApprovedRequest,
  GetApprovedResult,
  IsApprovedForAllRequest,
  IsApprovedForAllResult,
  NFTMetadata,
} from '../types/token.types';

import type {
  DetectionResponse,
  MetadataResponse,
  BalanceResponse,
  TransferResponse,
  ApprovalResponse,
  AllowanceResponse,
  GetApprovedResponse,
  IsApprovedForAllResponse,
  NFTMetadataResponse,
} from '../mapper/token.mapper';

export const tokenService = {
  async detectStandard(address: string): Promise<DetectionResponse> {
    const result: DetectionResult = await tokenDetector.detectStandard(address);
    return tokenMapper.toDetectionResponse(result);
  },

  async getMetadata(address: string): Promise<MetadataResponse> {
    const metadata: TokenMetadata = await metadataService.getMetadata(address);
    return tokenMapper.toMetadataResponse(metadata);
  },

  async getBalance(tokenAddress: string, wallet: string, tokenId?: string): Promise<BalanceResponse> {
    const result: TokenBalanceResult = await balanceService.getBalance(tokenAddress, wallet, tokenId);
    return tokenMapper.toBalanceResponse(result);
  },

  async transfer(request: TransferRequest): Promise<TransferResponse> {
    const result: TransferResult = await transferService.transfer(request);
    return tokenMapper.toTransferResponse(result);
  },

  async approve(request: ApprovalRequest): Promise<ApprovalResponse> {
    const result: ApprovalResult = await approvalService.approve(request);
    return tokenMapper.toApprovalResponse(result);
  },

  async setApprovalForAll(request: SetApprovalForAllRequest): Promise<{ transactionHash: string }> {
    const txHash = await approvalService.setApprovalForAll(request);
    return { transactionHash: txHash };
  },

  async allowance(request: AllowanceRequest): Promise<AllowanceResponse> {
    const result: AllowanceResult = await approvalService.allowance(request);
    return tokenMapper.toAllowanceResponse(result);
  },

  async getApproved(request: GetApprovedRequest): Promise<GetApprovedResponse> {
    const result: GetApprovedResult = await approvalService.getApproved(request);
    return tokenMapper.toGetApprovedResponse(result);
  },

  async isApprovedForAll(request: IsApprovedForAllRequest): Promise<IsApprovedForAllResponse> {
    const result: IsApprovedForAllResult = await approvalService.isApprovedForAll(request);
    return tokenMapper.toIsApprovedForAllResponse(result);
  },

  async getNFTMetadata(contractAddress: string, tokenId: string): Promise<NFTMetadataResponse> {
    const owner = await erc721Service.ownerOf(contractAddress, tokenId);
    const tokenURI = await erc721Service.tokenURI(contractAddress, tokenId);
    const metadata: NFTMetadata = { owner, tokenURI, tokenId, contractAddress };
    return tokenMapper.toNFTMetadataResponse(metadata);
  },
};
