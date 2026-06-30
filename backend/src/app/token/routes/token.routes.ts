import { Router } from 'express';
import {
  detectStandard,
  getMetadata,
  getBalance,
  transfer,
  approve,
  allowance,
  setApprovalForAll,
  getApproved,
  isApprovedForAll,
  getNFTMetadata,
} from '../controller/token.controller';

export const tokenRouter = Router();

tokenRouter.get('/:address/type', detectStandard);
tokenRouter.get('/:address', getMetadata);
tokenRouter.get('/:address/balance/:wallet', getBalance);
tokenRouter.post('/transfer', transfer);
tokenRouter.post('/approve', approve);
tokenRouter.post('/allowance', allowance);
tokenRouter.post('/set-approval-for-all', setApprovalForAll);
tokenRouter.post('/get-approved', getApproved);
tokenRouter.post('/is-approved-for-all', isApprovedForAll);
tokenRouter.get('/:address/token/:id', getNFTMetadata);
