import { Router } from 'express';
import {
  compile,
  deploy,
  read,
  write,
  encode,
  decode,
  validateAbi,
  decodeEvents,
} from '../controller/contract.controller';

export const contractRouter = Router();

contractRouter.post('/compile', compile);
contractRouter.post('/deploy', deploy);
contractRouter.post('/read', read);
contractRouter.post('/write', write);
contractRouter.post('/encode', encode);
contractRouter.post('/decode', decode);
contractRouter.post('/abi/validate', validateAbi);
contractRouter.get('/events/:txHash', decodeEvents);
