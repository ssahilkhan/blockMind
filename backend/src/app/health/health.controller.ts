import { Router, Request, Response } from 'express';
import { healthService } from './health.service';

export const healthRouter = Router();

healthRouter.get('/', async (_req: Request, res: Response) => {
  const status = await healthService.getFullStatus();
  const httpStatus = status.status === 'healthy' ? 200 : 503;
  res.status(httpStatus).json(status);
});
