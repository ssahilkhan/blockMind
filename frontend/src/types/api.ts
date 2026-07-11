export interface HealthResponse {
  status: "healthy" | "degraded" | "unhealthy";
  timestamp: string;
  services: {
    database: string;
    blockchain: string;
  };
}

export interface NetworkResponse {
  chainId: number;
  name: string;
  currency: string;
  latestBlock: number;
}

export interface BlockResponse {
  number: number;
  hash: string;
  parentHash: string;
  timestamp: string;
  transactionCount: number;
  transactions: string[];
  gasUsed: string;
  gasLimit: string;
  gasUsedPercent: string;
  miner: string;
  difficulty: string;
  baseFee: string | null;
  extraData: string;
  size: number | null;
}

export interface TransactionResponse {
  hash: string;
  blockNumber: number | null;
  blockHash: string | null;
  from: string;
  to: string | null;
  value: string;
  gasPrice: string;
  gasLimit: string;
  nonce: number;
  input: string;
}

export interface WalletDetails {
  address: string;
  balance: string;
  balanceWei: string;
  nonce: number;
  transactionCount: number;
  chainId: number;
  network: string;
}

export interface CreatedWallet {
  address: string;
  publicKey: string;
  privateKey: string;
  mnemonic: string;
  path: string;
}

export interface BalanceResult {
  address: string;
  balance: string;
  balanceWei: string;
  network: string;
  chainId: number;
}

export interface GasResponse {
  gasPrice: string;
  baseFee: string | null;
}

export interface StatsResponse {
  latestBlock: number;
  gasPrice: string;
  chainId: number;
  network: string;
}

export interface SearchResult {
  type: "block" | "transaction" | "address" | "unknown";
  data: unknown;
}

export interface ContractCompileResult {
  contractName: string;
  abi: unknown[];
  bytecode: string;
}

export interface TokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  standard: string;
}

export interface PortfolioSummary {
  address: string;
  nativeBalance: string;
  tokenCount: number;
  nftCount: number;
}

export interface PortfolioAsset {
  type: "native" | "erc20" | "erc721" | "erc1155";
  name: string;
  symbol: string;
  balance: string;
  address?: string;
}

export interface EventLog {
  address: string;
  topics: string[];
  data: string;
  logIndex: number;
}
