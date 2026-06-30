import { Router } from 'express';
import {
  getReceiptEvents,
  getBlockEvents,
  getRangeEvents,
  searchEvents,
  getRegistry,
} from '../controller/event.controller';

export const eventRouter = Router();

eventRouter.get('/receipt/:txHash', getReceiptEvents);
eventRouter.get('/block/:number', getBlockEvents);
eventRouter.get('/range', getRangeEvents);
eventRouter.get('/search', searchEvents);
eventRouter.get('/registry', getRegistry);
