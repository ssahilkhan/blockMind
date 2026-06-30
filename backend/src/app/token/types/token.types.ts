export enum TokenStandard {
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  ERC1155 = 'ERC1155',
  Unknown = 'Unknown',
}

export interface TokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  standard: TokenStandard;
}

export interface ERC721Metadata extends TokenMetadata {
  standard: TokenStandard.ERC721;
}

export interface ERC1155Metadata extends TokenMetadata {
  standard: TokenStandard.ERC1155;
}

export interface TokenBalance {
  address: string;
  tokenAddress: string;
  balance: string;
  standard: TokenStandard;
  tokenId?: string;
}

export interface TokenBalanceResult {
  balances: TokenBalance[];
}

export interface TransferRequest {
  tokenAddress: string;
  fromPrivateKey: string;
  to: string;
  amount?: string;
  tokenId?: string;
  standard: TokenStandard;
}

export interface TransferResult {
  transactionHash: string;
  tokenAddress: string;
  from: string;
  to: string;
  amount?: string;
  tokenId?: string;
  standard: TokenStandard;
}

export interface ApprovalRequest {
  tokenAddress: string;
  privateKey: string;
  spender: string;
  amount?: string;
  tokenId?: string;
  standard: TokenStandard;
}

export interface ApprovalResult {
  transactionHash: string;
  tokenAddress: string;
  owner: string;
  spender: string;
  amount?: string;
  tokenId?: string;
  standard: TokenStandard;
}

export interface AllowanceRequest {
  tokenAddress: string;
  owner: string;
  spender: string;
  standard: TokenStandard;
}

export interface AllowanceResult {
  tokenAddress: string;
  owner: string;
  spender: string;
  allowance: string;
  standard: TokenStandard;
}

export interface SetApprovalForAllRequest {
  tokenAddress: string;
  privateKey: string;
  operator: string;
  approved: boolean;
  standard: TokenStandard;
}

export interface GetApprovedRequest {
  tokenAddress: string;
  tokenId: string;
}

export interface GetApprovedResult {
  tokenAddress: string;
  tokenId: string;
  approved: string;
}

export interface IsApprovedForAllRequest {
  tokenAddress: string;
  owner: string;
  operator: string;
}

export interface IsApprovedForAllResult {
  tokenAddress: string;
  owner: string;
  operator: string;
  approved: boolean;
}

export interface DetectionResult {
  address: string;
  standard: TokenStandard;
  supportsERC165: boolean;
}

export interface NFTMetadata {
  owner: string;
  tokenURI: string;
  tokenId: string;
  contractAddress: string;
}
