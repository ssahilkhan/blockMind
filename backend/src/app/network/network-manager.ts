import { ethers } from 'ethers';
import { ChainMetadata } from './chain-registry.types';
import { chainRegistry } from './chain-registry';
import { logger } from '../logger';

export interface NetworkHealthState {
  chainId: number;
  connected: boolean;
  latency: number;
  latestBlock: number;
  lastChecked: Date;
  error: string | null;
  rpcUrl: string;
  rpcIndex: number;
  consecutiveFailures: number;
}

interface NetworkEntry {
  metadata: ChainMetadata;
  provider: ethers.JsonRpcProvider;
  health: NetworkHealthState;
}

export class NetworkManager {
  private networks: Map<number, NetworkEntry> = new Map();
  private defaultChainId: number;
  private healthCheckIntervals: Map<number, ReturnType<typeof setInterval>> = new Map();
  private readonly HEALTH_CHECK_INTERVAL = 30_000;
  private readonly MAX_CONSECUTIVE_FAILURES = 3;

  constructor() {
    this.defaultChainId = chainRegistry.getDefaultChainId();
  }

  async registerNetwork(chainId: number): Promise<void> {
    const metadata = chainRegistry.getChain(chainId);
    if (!metadata) {
      throw new Error(`Chain ${chainId} is not in the registry`);
    }

    const rpcUrl = metadata.rpcConfig.rpcUrls[0];
    const provider = new ethers.JsonRpcProvider(rpcUrl, chainId, {
      staticNetwork: ethers.Network.from(chainId),
    });

    const health: NetworkHealthState = {
      chainId,
      connected: false,
      latency: 0,
      latestBlock: 0,
      lastChecked: new Date(),
      error: null,
      rpcUrl,
      rpcIndex: 0,
      consecutiveFailures: 0,
    };

    this.networks.set(chainId, { metadata, provider, health });
    logger.info('Network registered', { chainId, name: metadata.name, rpcUrl });
  }

  async registerAllEnabled(): Promise<void> {
    const enabled = chainRegistry.getEnabledChains();
    for (const chain of enabled) {
      try {
        await this.registerNetwork(chain.chainId);
      } catch (err) {
        logger.warn('Failed to register network', {
          chainId: chain.chainId,
          name: chain.name,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
  }

  getProvider(chainId?: number): ethers.JsonRpcProvider {
    const resolved = chainId ?? this.defaultChainId;
    const entry = this.networks.get(resolved);
    if (!entry) {
      throw new Error(`Network ${resolved} is not registered`);
    }
    return entry.provider;
  }

  getConfig(chainId?: number): ChainMetadata {
    const resolved = chainId ?? this.defaultChainId;
    const entry = this.networks.get(resolved);
    if (!entry) {
      return chainRegistry.getChainOrThrow(resolved);
    }
    return entry.metadata;
  }

  getHealth(chainId?: number): NetworkHealthState {
    const resolved = chainId ?? this.defaultChainId;
    const entry = this.networks.get(resolved);
    if (!entry) {
      return {
        chainId: resolved,
        connected: false,
        latency: 0,
        latestBlock: 0,
        lastChecked: new Date(),
        error: 'Network not registered',
        rpcUrl: '',
        rpcIndex: 0,
        consecutiveFailures: 0,
      };
    }
    return entry.health;
  }

  setDefaultChain(chainId: number): void {
    if (!this.networks.has(chainId)) {
      throw new Error(`Cannot set default: network ${chainId} is not registered`);
    }
    this.defaultChainId = chainId;
    chainRegistry.setDefaultChain(chainId);
    logger.info('Default network changed', { chainId });
  }

  getDefaultChainId(): number {
    return this.defaultChainId;
  }

  getRegisteredNetworks(): number[] {
    return Array.from(this.networks.keys());
  }

  isRegistered(chainId: number): boolean {
    return this.networks.has(chainId);
  }

  async connect(chainId?: number): Promise<boolean> {
    const resolved = chainId ?? this.defaultChainId;
    const entry = this.networks.get(resolved);
    if (!entry) {
      logger.warn('Cannot connect: network not registered', { chainId: resolved });
      return false;
    }

    try {
      const start = Date.now();
      await entry.provider.getNetwork();
      const latency = Date.now() - start;
      const latestBlock = await entry.provider.getBlockNumber();

      entry.health.connected = true;
      entry.health.latency = latency;
      entry.health.latestBlock = latestBlock;
      entry.health.lastChecked = new Date();
      entry.health.error = null;
      entry.health.consecutiveFailures = 0;

      logger.info('Network connected', { chainId: resolved, latency, latestBlock });
      return true;
    } catch (err) {
      entry.health.connected = false;
      entry.health.lastChecked = new Date();
      entry.health.error = err instanceof Error ? err.message : String(err);
      entry.health.consecutiveFailures++;

      logger.warn('Network connection failed', {
        chainId: resolved,
        error: entry.health.error,
        failures: entry.health.consecutiveFailures,
      });

      await this.tryFallbackRpc(resolved);
      return false;
    }
  }

  private async tryFallbackRpc(chainId: number): Promise<void> {
    const entry = this.networks.get(chainId);
    if (!entry) return;

    const metadata = entry.metadata;
    const allUrls = [...metadata.rpcConfig.rpcUrls, ...metadata.rpcConfig.fallbackRpcUrls];
    const nextIndex = entry.health.rpcIndex + 1;

    if (nextIndex >= allUrls.length) {
      logger.warn('No more fallback RPCs available', { chainId });
      return;
    }

    const nextUrl = allUrls[nextIndex];
    logger.info('Trying fallback RPC', { chainId, from: entry.health.rpcUrl, to: nextUrl });

    entry.health.rpcIndex = nextIndex;
    entry.health.rpcUrl = nextUrl;
    entry.provider = new ethers.JsonRpcProvider(nextUrl, chainId, {
      staticNetwork: ethers.Network.from(chainId),
    });

    try {
      const start = Date.now();
      await entry.provider.getNetwork();
      const latency = Date.now() - start;
      const latestBlock = await entry.provider.getBlockNumber();

      entry.health.connected = true;
      entry.health.latency = latency;
      entry.health.latestBlock = latestBlock;
      entry.health.lastChecked = new Date();
      entry.health.error = null;
      entry.health.consecutiveFailures = 0;

      logger.info('Fallback RPC connected', { chainId, rpcUrl: nextUrl, latency });
    } catch (err) {
      entry.health.connected = false;
      entry.health.lastChecked = new Date();
      entry.health.error = err instanceof Error ? err.message : String(err);
      entry.health.consecutiveFailures++;
    }
  }

  async checkHealth(chainId: number): Promise<NetworkHealthState> {
    const entry = this.networks.get(chainId);
    if (!entry) {
      return this.getHealth(chainId);
    }

    try {
      const start = Date.now();
      const blockNumber = await entry.provider.getBlockNumber();
      const latency = Date.now() - start;

      entry.health.connected = true;
      entry.health.latency = latency;
      entry.health.latestBlock = blockNumber;
      entry.health.lastChecked = new Date();
      entry.health.error = null;
      entry.health.consecutiveFailures = 0;
    } catch (err) {
      entry.health.connected = false;
      entry.health.lastChecked = new Date();
      entry.health.error = err instanceof Error ? err.message : String(err);
      entry.health.consecutiveFailures++;

      if (entry.health.consecutiveFailures >= this.MAX_CONSECUTIVE_FAILURES) {
        await this.tryFallbackRpc(chainId);
      }
    }

    return entry.health;
  }

  startHealthMonitoring(): void {
    for (const chainId of this.networks.keys()) {
      this.startHealthCheck(chainId);
    }
    logger.info('Health monitoring started', { networks: this.getRegisteredNetworks().length });
  }

  private startHealthCheck(chainId: number): void {
    const existing = this.healthCheckIntervals.get(chainId);
    if (existing) clearInterval(existing);

    const interval = setInterval(async () => {
      await this.checkHealth(chainId);
    }, this.HEALTH_CHECK_INTERVAL);

    this.healthCheckIntervals.set(chainId, interval);
  }

  stopHealthMonitoring(): void {
    for (const [chainId, interval] of this.healthCheckIntervals) {
      clearInterval(interval);
      this.healthCheckIntervals.delete(chainId);
    }
    logger.info('Health monitoring stopped');
  }

  async disconnectAll(): Promise<void> {
    this.stopHealthMonitoring();
    for (const [chainId, entry] of this.networks) {
      try {
        await (entry.provider as unknown as { destroy?: () => void }).destroy?.();
        entry.health.connected = false;
      } catch {
        logger.warn('Error disconnecting network', { chainId });
      }
    }
    this.networks.clear();
  }

  async resolveChainId(input: string | number | undefined): Promise<number> {
    if (typeof input === 'number') return input;
    if (typeof input === 'string' && /^\d+$/.test(input)) return parseInt(input, 10);
    return this.defaultChainId;
  }
}

export const networkManager = new NetworkManager();
