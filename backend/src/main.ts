import express, { Request, Response } from 'express';
import cors from 'cors';
import { config } from './app/config';
import { logger } from './app/logger';
import { blockchainService } from './app/blockchain/blockchain.service';
import { healthRouter } from './app/health/health.controller';
import { blockchainRouter } from './app/blockchain/blockchain.controller';
import { requestLogger } from './app/middleware/request-logger';
import { errorHandler } from './app/middleware/error-handler';
import { walletRouter } from './app/wallet/wallet.routes';
import { networkManager } from './app/network/network.manager';
import { HardhatProvider } from './app/chain/provider/hardhat.provider';
import { CacheService } from './app/chain/cache/cache.service';
import { initChainService } from './app/chain/services/chain.service';
import { createChainRouter } from './app/chain/controller/chain.controller';

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'BlockMind API',
    version: '0.1.0',
    status: 'running',
  });
});

app.use('/health', healthRouter);
app.use('/blockchain', blockchainRouter);
app.use('/wallet', walletRouter);

app.use(errorHandler);

async function start(): Promise<void> {
  networkManager.register({
    name: 'hardhat',
    chainId: 31337,
    rpcUrl: config.RPC_URL,
    currency: 'ETH',
  });

  const provider = new HardhatProvider(config.RPC_URL);
  const cache = new CacheService();

  try {
    await provider.connect();
    logger.info('Chain provider connected');
  } catch {
    logger.warn('Chain provider connection failed on startup', { rpc: config.RPC_URL });
  }

  const chainService = initChainService(provider, cache);
  app.use('/chain', createChainRouter(chainService));

  try {
    await blockchainService.connect();
  } catch {
    logger.warn('Blockchain connection failed on startup. Health checks will report degraded.', {
      rpc: config.RPC_URL,
    });
  }

  app.listen(config.PORT, () => {
    logger.info(`BlockMind API running on port ${config.PORT}`);
  });
}

start();
