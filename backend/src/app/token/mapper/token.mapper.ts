import {
  DetectionResult,
  TokenMetadata,
  TokenBalanceResult,
  TransferResult,
  ApprovalResult,
  AllowanceResult,
  GetApprovedResult,
  IsApprovedForAllResult,
  NFTMetadata,
} from '../types/token.types';

export interface DetectionResponse {
  address: string;
  standard: string;
  supportsERC165: boolean;
}

export interface MetadataResponse {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  standard: string;
}

export interface BalanceResponse {
  balances: Array<{
    address: string;
    tokenAddress: string;
    balance: string;
    standard: string;
    tokenId?: string;
  }>;
}

export interface TransferResponse {
  transactionHash: string;
  tokenAddress: string;
  from: string;
  to: string;
  amount?: string;
  tokenId?: string;
  standard: string;
}

export interface ApprovalResponse {
  transactionHash: string;
  tokenAddress: string;
  owner: string;
  spender: string;
  amount?: string;
  tokenId?: string;
  standard: string;
}

export interface AllowanceResponse {
  tokenAddress: string;
  owner: string;
  spender: string;
  allowance: string;
  standard: string;
}

export interface GetApprovedResponse {
  tokenAddress: string;
  tokenId: string;
  approved: string;
}

export interface IsApprovedForAllResponse {
  tokenAddress: string;
  owner: string;
  operator: string;
  approved: boolean;
}

export interface NFTMetadataResponse {
  owner: string;
  tokenURI: string;
  tokenId: string;
  contractAddress: string;
}

export const tokenMapper = {
  toDetectionResponse(result: DetectionResult): DetectionResponse {
    return {
      address: result.address,
      standard: result.standard,
      supportsERC165: result.supportsERC165,
    };
  },

  toMetadataResponse(metadata: TokenMetadata): MetadataResponse {
    return {
      name: metadata.name,
      symbol: metadata.symbol,
      decimals: metadata.decimals,
      totalSupply: metadata.totalSupply,
      standard: metadata.standard,
    };
  },

  toBalanceResponse(result: TokenBalanceResult): BalanceResponse {
    return {
      balances: result.balances.map((b) => ({
        address: b.address,
        tokenAddress: b.tokenAddress,
        balance: b.balance,
        standard: b.standard,
        tokenId: b.tokenId,
      })),
    };
  },

  toTransferResponse(result: TransferResult): TransferResponse {
    return {
      transactionHash: result.transactionHash,
      tokenAddress: result.tokenAddress,
      from: result.from,
      to: result.to,
      amount: result.amount,
      tokenId: result.tokenId,
      standard: result.standard,
    };
  },

  toApprovalResponse(result: ApprovalResult): ApprovalResponse {
    return {
      transactionHash: result.transactionHash,
      tokenAddress: result.tokenAddress,
      owner: result.owner,
      spender: result.spender,
      amount: result.amount,
      tokenId: result.tokenId,
      standard: result.standard,
    };
  },

  toAllowanceResponse(result: AllowanceResult): AllowanceResponse {
    return {
      tokenAddress: result.tokenAddress,
      owner: result.owner,
      spender: result.spender,
      allowance: result.allowance,
      standard: result.standard,
    };
  },

  toGetApprovedResponse(result: GetApprovedResult): GetApprovedResponse {
    return {
      tokenAddress: result.tokenAddress,
      tokenId: result.tokenId,
      approved: result.approved,
    };
  },

  toIsApprovedForAllResponse(result: IsApprovedForAllResult): IsApprovedForAllResponse {
    return {
      tokenAddress: result.tokenAddress,
      owner: result.owner,
      operator: result.operator,
      approved: result.approved,
    };
  },

  toNFTMetadataResponse(result: NFTMetadata): NFTMetadataResponse {
    return {
      owner: result.owner,
      tokenURI: result.tokenURI,
      tokenId: result.tokenId,
      contractAddress: result.contractAddress,
    };
  },
};
