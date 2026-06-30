export interface StartIndexerDto {
  pollIntervalMs?: number;
}

export interface SyncDto {
  fromBlock?: number;
  toBlock?: number;
}

export interface PaginationDto {
  limit?: string;
  offset?: string;
}

export interface IndexerActionResponse {
  message: string;
  running: boolean;
}
