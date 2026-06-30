import { Router } from 'express';
import {
  buildAndSend,
  estimateGas,
  broadcast,
  track,
} from './transaction.controller';

export const transactionRouter = Router();

transactionRouter.post('/send', buildAndSend);
transactionRouter.post('/estimate-gas', estimateGas);
transactionRouter.post('/broadcast', broadcast);
transactionRouter.get('/track/:hash', track);
