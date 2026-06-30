import { Request, Response, NextFunction } from 'express';
import { IndexerService } from '../service/indexer.service';
import { AppError } from '../../common/errors';
import { validatePollInterval, validatePagination } from '../validator/indexer.validator';
import { indexerMapper } from '../mapper/indexer.mapper';
import { logger } from '../../logger';

export function createIndexerController(indexerService: IndexerService) {
  async function start(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const pollIntervalMs = req.body.pollIntervalMs as number | undefined;
      const error = validatePollInterval(pollIntervalMs);
      if (error) throw new AppError(400, 'VALIDATION_ERROR', error);

      await indexerService.start(pollIntervalMs);
      res.json({ message: 'Indexer started', running: true });
    } catch (err) {
      next(err);
    }
  }

  async function stop(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      indexerService.stop();
      res.json({ message: 'Indexer stopped', running: false });
    } catch (err) {
      next(err);
    }
  }

  async function sync(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await indexerService.syncOnce();
      res.json(indexerMapper.toSyncResultResponse(result));
    } catch (err) {
      next(err);
    }
  }

  async function status(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const status = await indexerService.getStatus();
      res.json(
        indexerMapper.toStatusResponse(
          status.running,
          status.latestIndexedBlock,
          status.latestChainBlock,
          status.startedAt
        )
      );
    } catch (err) {
      next(err);
    }
  }

  async function checkpoint(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const cp = await indexerService.getCheckpoint();
      if (!cp) {
        res.json({ blockNumber: null, blockHash: null, updatedAt: null });
        return;
      }
      res.json(indexerMapper.toCheckpointResponse(cp));
    } catch (err) {
      next(err);
    }
  }

  async function blocks(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { limit, offset, error } = validatePagination(
        req.query.limit as string,
        req.query.offset as string
      );
      if (error) throw new AppError(400, 'VALIDATION_ERROR', error);

      const result = await indexerService.getBlocks(limit, offset);
      res.json(indexerMapper.toPaginatedResponse(result, indexerMapper.toBlockResponse));
    } catch (err) {
      next(err);
    }
  }

  async function events(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { limit, offset, error } = validatePagination(
        req.query.limit as string,
        req.query.offset as string
      );
      if (error) throw new AppError(400, 'VALIDATION_ERROR', error);

      const result = await indexerService.getEvents(limit, offset);
      res.json(indexerMapper.toPaginatedResponse(result, indexerMapper.toEventResponse));
    } catch (err) {
      next(err);
    }
  }

  async function transactions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { limit, offset, error } = validatePagination(
        req.query.limit as string,
        req.query.offset as string
      );
      if (error) throw new AppError(400, 'VALIDATION_ERROR', error);

      const result = await indexerService.getTransactions(limit, offset);
      res.json(indexerMapper.toPaginatedResponse(result, indexerMapper.toTransactionResponse));
    } catch (err) {
      next(err);
    }
  }

  return { start, stop, sync, status, checkpoint, blocks, events, transactions };
}
