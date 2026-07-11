import { Router, Request, Response, NextFunction } from 'express';
import { chainRegistry } from '../chain-registry';
import { networkManager } from '../network-manager';
import { AppError } from '../../common/errors';

export function createNetworkRouter(): Router {
  const router = Router();

  router.get(
    '/chains',
    (_req: Request, res: Response, next: NextFunction) => {
      try {
        const networks = chainRegistry.toResponse();
        res.json({ networks, defaultChainId: chainRegistry.getDefaultChainId() });
      } catch (err) {
        next(err);
      }
    }
  );

  router.get(
    '/chains/:chainId',
    (req: Request, res: Response, next: NextFunction) => {
      try {
        const chainId = parseInt(req.params.chainId, 10);
        if (isNaN(chainId)) {
          throw new AppError(400, 'VALIDATION_ERROR', 'Invalid chainId');
        }
        const chain = chainRegistry.getChain(chainId);
        if (!chain) {
          throw new AppError(404, 'NOT_FOUND', `Chain ${chainId} not found`);
        }
        res.json(chain);
      } catch (err) {
        next(err);
      }
    }
  );

  router.get(
    '/health',
    (_req: Request, res: Response, next: NextFunction) => {
      try {
        const networks = networkManager.getRegisteredNetworks();
        const health = networks.map((chainId) => networkManager.getHealth(chainId));
        res.json({ networks: health });
      } catch (err) {
        next(err);
      }
    }
  );

  router.get(
    '/health/:chainId',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const chainId = parseInt(req.params.chainId, 10);
        if (isNaN(chainId)) {
          throw new AppError(400, 'VALIDATION_ERROR', 'Invalid chainId');
        }
        const health = await networkManager.checkHealth(chainId);
        res.json(health);
      } catch (err) {
        next(err);
      }
    }
  );

  router.post(
    '/switch',
    (req: Request, res: Response, next: NextFunction) => {
      try {
        const { chainId } = req.body as { chainId?: number };
        if (!chainId || isNaN(chainId)) {
          throw new AppError(400, 'VALIDATION_ERROR', 'chainId is required');
        }
        if (!networkManager.isRegistered(chainId)) {
          throw new AppError(404, 'NOT_FOUND', `Chain ${chainId} is not registered`);
        }
        networkManager.setDefaultChain(chainId);
        const config = networkManager.getConfig(chainId);
        const health = networkManager.getHealth(chainId);
        res.json({ chainId, name: config.name, health });
      } catch (err) {
        next(err);
      }
    }
  );

  router.get(
    '/default',
    (_req: Request, res: Response, next: NextFunction) => {
      try {
        const chainId = networkManager.getDefaultChainId();
        const config = networkManager.getConfig(chainId);
        res.json({ chainId, name: config.name, shortName: config.shortName });
      } catch (err) {
        next(err);
      }
    }
  );

  return router;
}
