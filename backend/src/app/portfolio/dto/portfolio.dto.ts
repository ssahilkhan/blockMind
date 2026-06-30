export interface PortfolioQueryDto {
  wallet: string;
}

export interface AssetsQueryDto {
  wallet: string;
}

export interface BalancesQueryDto {
  wallet: string;
}

export interface HistoryQueryDto {
  wallet: string;
  limit?: number;
  fromBlock?: number;
  toBlock?: number;
}

export interface NFTsQueryDto {
  wallet: string;
}

export interface SummaryQueryDto {
  wallet: string;
}
