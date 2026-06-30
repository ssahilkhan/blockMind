import { ethers } from 'ethers';
import { NetworkConfig } from './network.types';
import { logger } from '../logger';

interface NetworkEntry {
  config: NetworkConfig;
  provider: ethers.JsonRpcProvider;
}

class NetworkManager {
  private networks: Map<string, NetworkEntry> = new Map();
  private defaultNetwork = 'hardhat';

  register(config: NetworkConfig): void {
    const provider = new ethers.JsonRpcProvider(config.rpcUrl);
    this.networks.set(config.name, { config, provider });
    logger.info('Network registered', { name: config.name, chainId: config.chainId });
  }

  getProvider(name?: string): ethers.JsonRpcProvider {
    const resolved = name || this.defaultNetwork;
    const entry = this.networks.get(resolved);
    if (!entry) {
      throw new Error(`Network '${resolved}' is not registered`);
    }
    return entry.provider;
  }

  getConfig(name?: string): NetworkConfig {
    const resolved = name || this.defaultNetwork;
    const entry = this.networks.get(resolved);
    if (!entry) {
      throw new Error(`Network '${resolved}' is not registered`);
    }
    return entry.config;
  }

  setDefaultNetwork(name: string): void {
    if (!this.networks.has(name)) {
      throw new Error(`Cannot set default: network '${name}' is not registered`);
    }
    this.defaultNetwork = name;
  }

  getDefaultNetwork(): string {
    return this.defaultNetwork;
  }

  getRegisteredNetworks(): string[] {
    return Array.from(this.networks.keys());
  }
}

export const networkManager = new NetworkManager();
