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

function parseChainId(req: Request): number | undefined {
  const network = req.query.network as string | undefined;
  if (network && /^\d+$/.test(network)) {
    return parseInt(network, 10);
  }
  return undefined;
}

export function createChainRouter(chainService: ChainService): Router {
  const router = Router();

  router.get(
    '/block/latest',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const chainId = parseChainId(req);
        const block = await chainService.getLatestBlock(chainId);
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

        const chainId = parseChainId(req);
        const block = await chainService.getBlockByNumber(Number(req.params.number), chainId);
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

        const chainId = parseChainId(req);
        const block = await chainService.getBlockByHash(req.params.hash, chainId);
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
        const chainId = parseChainId(req);
        const blocks = await chainService.getLatestBlocks(limit, chainId);
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

        const chainId = parseChainId(req);
        const tx = await chainService.getTransaction(req.params.hash, chainId);
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

        const chainId = parseChainId(req);
        const receipt = await chainService.getReceipt(req.params.hash, chainId);
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
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const chainId = parseChainId(req);
        const network = await chainService.getNetwork(chainId);
        res.json(network);
      } catch (err) {
        next(err);
      }
    }
  );

  router.get(
    '/gas',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const chainId = parseChainId(req);
        const gas = await chainService.getGasPrice(chainId);
        res.json(gas);
      } catch (err) {
        next(err);
      }
    }
  );

  router.get(
    '/stats',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const chainId = parseChainId(req);
        const stats = await chainService.getStats(chainId);
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

        const chainId = parseChainId(req);
        const result = await chainService.search(q!, chainId);
        res.json(result);
      } catch (err) {
        next(err);
      }
    }
  );

  return router;
}
