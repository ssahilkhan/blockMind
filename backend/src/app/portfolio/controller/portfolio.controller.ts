import { Request, Response, NextFunction } from 'express';
import { portfolioService } from '../service/portfolio.service';
import { AppError } from '../../common/errors';
import {
  validateWalletAddress,
  validateLimit,
  validateBlockRange,
} from '../validator/portfolio.validator';

export async function getPortfolio(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { wallet } = req.params;
    const addrError = validateWalletAddress(wallet);
    if (addrError) throw new AppError(400, 'VALIDATION_ERROR', addrError);

    const result = await portfolioService.getPortfolio(wallet);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getAssets(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { wallet } = req.params;
    const addrError = validateWalletAddress(wallet);
    if (addrError) throw new AppError(400, 'VALIDATION_ERROR', addrError);

    const result = await portfolioService.getAssets(wallet);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getBalances(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { wallet } = req.params;
    const addrError = validateWalletAddress(wallet);
    if (addrError) throw new AppError(400, 'VALIDATION_ERROR', addrError);

    const result = await portfolioService.getBalances(wallet);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getHistory(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { wallet } = req.params;
    const addrError = validateWalletAddress(wallet);
    if (addrError) throw new AppError(400, 'VALIDATION_ERROR', addrError);

    const { limit, fromBlock, toBlock } = req.query as Record<string, string | undefined>;
    const limitError = validateLimit(limit);
    if (limitError) throw new AppError(400, 'VALIDATION_ERROR', limitError);
    const rangeError = validateBlockRange(fromBlock, toBlock);
    if (rangeError) throw new AppError(400, 'VALIDATION_ERROR', rangeError);

    const result = await portfolioService.getHistory(wallet, limit ? parseInt(limit, 10) : undefined);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getNFTs(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { wallet } = req.params;
    const addrError = validateWalletAddress(wallet);
    if (addrError) throw new AppError(400, 'VALIDATION_ERROR', addrError);

    const result = await portfolioService.getNFTs(wallet);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getSummary(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { wallet } = req.params;
    const addrError = validateWalletAddress(wallet);
    if (addrError) throw new AppError(400, 'VALIDATION_ERROR', addrError);

    const result = await portfolioService.getSummary(wallet);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
