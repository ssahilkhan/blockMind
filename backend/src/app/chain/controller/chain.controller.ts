import { Router, Request, Response, NextFunction } from 'express';
import { ChainService } from '../services/chain.service';
import { AppError } from '../../common/errors';
import {
  validateBlockNumber,
  validateBlockHash,
  validateTransactionHash,
  validateLimit,
  validateSearchQuery,
} from '../validators';

export function createChainRouter(chainService: ChainService): Router {
  const router = Router();

  router.get(
    '/block/latest',
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const block = await chainService.getLatestBlock();
        res.json(block);
      } catch (err) {
        next(err);
      }
    }
  );

  router.get(
    '/block/:number',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const error = validateBlockNumber(req.params.number);
        if (error) throw new AppError(400, 'VALIDATION_ERROR', error);

        const block = await chainService.getBlockByNumber(Number(req.params.number));
        if (!block) {
          throw new AppError(404, 'NOT_FOUND', `Block ${req.params.number} not found`);
        }
        res.json(block);
      } catch (err) {
        next(err);
      }
    }
  );

  router.get(
    '/block/hash/:hash',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const error = validateBlockHash(req.params.hash);
        if (error) throw new AppError(400, 'VALIDATION_ERROR', error);

        const block = await chainService.getBlockByHash(req.params.hash);
        if (!block) {
          throw new AppError(404, 'NOT_FOUND', 'Block not found');
        }
        res.json(block);
      } catch (err) {
        next(err);
      }
    }
  );

  router.get(
    '/blocks',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const error = validateLimit(req.query.limit);
        if (error) throw new AppError(400, 'VALIDATION_ERROR', error);

        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const blocks = await chainService.getLatestBlocks(limit);
        res.json(blocks);
      } catch (err) {
        next(err);
      }
    }
  );

  router.get(
    '/transaction/:hash',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const error = validateTransactionHash(req.params.hash);
        if (error) throw new AppError(400, 'VALIDATION_ERROR', error);

        const tx = await chainService.getTransaction(req.params.hash);
        if (!tx) {
          throw new AppError(404, 'NOT_FOUND', 'Transaction not found');
        }
        res.json(tx);
      } catch (err) {
        next(err);
      }
    }
  );

  router.get(
    '/receipt/:hash',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const error = validateTransactionHash(req.params.hash);
        if (error) throw new AppError(400, 'VALIDATION_ERROR', error);

        const receipt = await chainService.getReceipt(req.params.hash);
        if (!receipt) {
          throw new AppError(404, 'NOT_FOUND', 'Receipt not found');
        }
        res.json(receipt);
      } catch (err) {
        next(err);
      }
    }
  );

  router.get(
    '/network',
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const network = await chainService.getNetwork();
        res.json(network);
      } catch (err) {
        next(err);
      }
    }
  );

  router.get(
    '/gas',
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const gas = await chainService.getGasPrice();
        res.json(gas);
      } catch (err) {
        next(err);
      }
    }
  );

  router.get(
    '/stats',
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        const stats = await chainService.getStats();
        res.json(stats);
      } catch (err) {
        next(err);
      }
    }
  );

  router.get(
    '/search',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const q = req.query.q as string | undefined;
        const error = validateSearchQuery(q);
        if (error) throw new AppError(400, 'VALIDATION_ERROR', error);

        const result = await chainService.search(q!);
        res.json(result);
      } catch (err) {
        next(err);
      }
    }
  );

  return router;
}
