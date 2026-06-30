export interface DetectStandardDto {
  address: string;
}

export interface MetadataDto {
  address: string;
}

export interface BalanceDto {
  address: string;
  wallet: string;
  tokenId?: string;
}

export interface TransferBodyDto {
  tokenAddress: string;
  fromPrivateKey: string;
  to: string;
  amount?: string;
  tokenId?: string;
  standard: string;
}

export interface ApproveBodyDto {
  tokenAddress: string;
  privateKey: string;
  spender: string;
  amount?: string;
  tokenId?: string;
  standard: string;
}

export interface AllowanceBodyDto {
  tokenAddress: string;
  owner: string;
  spender: string;
  standard: string;
}

export interface SetApprovalForAllBodyDto {
  tokenAddress: string;
  privateKey: string;
  operator: string;
  approved: boolean;
  standard: string;
}

export interface GetApprovedBodyDto {
  tokenAddress: string;
  tokenId: string;
}

export interface IsApprovedForAllBodyDto {
  tokenAddress: string;
  owner: string;
  operator: string;
}

export interface NFTMetadataDto {
  address: string;
  tokenId: string;
}
