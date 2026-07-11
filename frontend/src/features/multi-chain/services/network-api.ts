import { apiClient } from '@/lib/api-client';
import type {
  ChainMetadata,
  ChainHealthState,
  ChainRegistryResponse,
  ChainHealthResponse,
  ChainSwitchResponse,
} from '../types';

export const networkApi = {
  getChains: () => apiClient<ChainRegistryResponse>('/network/chains'),

  getChain: (chainId: number) =>
    apiClient<ChainMetadata>(`/network/chains/${chainId}`),

  getHealth: () =>
    apiClient<ChainHealthResponse>('/network/health'),

  getChainHealth: (chainId: number) =>
    apiClient<ChainHealthState>(`/network/health/${chainId}`),

  switchChain: (chainId: number) =>
    apiClient<ChainSwitchResponse>('/network/switch', {
      method: 'POST',
      body: JSON.stringify({ chainId }),
    }),

  getDefault: () =>
    apiClient<{ chainId: number; name: string; shortName: string }>('/network/default'),
};
