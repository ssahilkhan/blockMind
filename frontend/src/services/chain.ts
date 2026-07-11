import { apiClient } from "@/lib/api-client";
import type {
  NetworkResponse,
  BlockResponse,
  TransactionResponse,
  GasResponse,
  StatsResponse,
  SearchResult,
} from "@/types/api";

export const chainApi = {
  getNetwork: () => apiClient<NetworkResponse>("/chain/network"),

  getGasPrice: () => apiClient<GasResponse>("/chain/gas"),

  getStats: () => apiClient<StatsResponse>("/chain/stats"),

  getLatestBlock: () => apiClient<BlockResponse>("/chain/block/latest"),

  getBlockByNumber: (number: number) =>
    apiClient<BlockResponse>(`/chain/block/${number}`),

  getBlockByHash: (hash: string) =>
    apiClient<BlockResponse>(`/chain/block/hash/${hash}`),

  getLatestBlocks: (limit = 10) =>
    apiClient<BlockResponse[]>(`/chain/blocks?limit=${limit}`),

  getTransaction: (hash: string) =>
    apiClient<TransactionResponse>(`/chain/transaction/${hash}`),

  getReceipt: (hash: string) =>
    apiClient<TransactionResponse>(`/chain/receipt/${hash}`),

  search: (query: string) =>
    apiClient<SearchResult>(`/chain/search?q=${encodeURIComponent(query)}`),
};
