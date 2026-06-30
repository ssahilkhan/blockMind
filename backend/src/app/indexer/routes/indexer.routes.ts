import { Router } from 'express';
import { IndexerService } from '../service/indexer.service';
import { createIndexerController } from '../controller/indexer.controller';

export function createIndexerRouter(indexerService: IndexerService): Router {
  const router = Router();
  const ctrl = createIndexerController(indexerService);

  router.post('/start', ctrl.start);
  router.post('/stop', ctrl.stop);
  router.post('/sync', ctrl.sync);
  router.get('/status', ctrl.status);
  router.get('/checkpoint', ctrl.checkpoint);
  router.get('/blocks', ctrl.blocks);
  router.get('/events', ctrl.events);
  router.get('/transactions', ctrl.transactions);

  return router;
}
