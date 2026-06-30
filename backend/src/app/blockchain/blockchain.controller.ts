import { Router, Request, Response, NextFunction } from 'express';
import { blockchainService } from './blockchain.service';
import { RpcConnectionError } from '../common/errors';

export const blockchainRouter = Router();

blockchainRouter.get(
  '/info',
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const [chainId, networkInfo, latestBlock, gasPrice] = await Promise.all([
        blockchainService.getChainId(),
        blockchainService.getNetwork(),
        blockchainService.getBlockNumber(),
        blockchainService.getGasPrice(),
      ]);

      res.json({
        chainId,
        network: networkInfo.name,
        latestBlock,
        gasPrice,
        connected: blockchainService.isConnected(),
      });
    } catch (err) {
      next(new RpcConnectionError());
    }
  }
);
