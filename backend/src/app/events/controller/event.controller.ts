import { Request, Response, NextFunction } from 'express';
import { eventService } from '../service/event.service';
import { AppError } from '../../common/errors';
import {
  validateTxHash,
  validateBlockNumber,
  validateBlockRange,
  validateContractAddress,
  validateEventName,
  validateWalletAddress,
} from '../validator/event.validator';

export async function getReceiptEvents(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { txHash } = req.params;
    const abiRaw = req.query.abi as string | undefined;

    const hashError = validateTxHash(txHash);
    if (hashError) throw new AppError(400, 'VALIDATION_ERROR', hashError);

    const result = await eventService.getEventsFromReceipt(txHash, abiRaw);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getBlockEvents(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { number } = req.params;
    const abiRaw = req.query.abi as string | undefined;

    const num = parseInt(number, 10);
    const numError = validateBlockNumber(num);
    if (numError) throw new AppError(400, 'VALIDATION_ERROR', numError);

    const result = await eventService.getEventsByBlock(num, abiRaw);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getRangeEvents(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const fromRaw = req.query.from as string;
    const toRaw = req.query.to as string;
    const abiRaw = req.query.abi as string | undefined;

    const fromNum = parseInt(fromRaw, 10);
    const toNum = parseInt(toRaw, 10);

    const rangeError = validateBlockRange(fromNum, toNum);
    if (rangeError) throw new AppError(400, 'VALIDATION_ERROR', rangeError);

    const result = await eventService.getEventsBetweenBlocks(fromNum, toNum, abiRaw);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function searchEvents(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { contract, event, wallet, fromBlock, toBlock, txHash } = req.query as Record<string, string | undefined>;
    const abiRaw = req.query.abi as string | undefined;

    const contractError = validateContractAddress(contract);
    if (contractError) throw new AppError(400, 'VALIDATION_ERROR', contractError);

    const eventError = validateEventName(event);
    if (eventError) throw new AppError(400, 'VALIDATION_ERROR', eventError);

    const walletError = validateWalletAddress(wallet);
    if (walletError) throw new AppError(400, 'VALIDATION_ERROR', walletError);

    const fromNum = fromBlock ? parseInt(fromBlock, 10) : undefined;
    const toNum = toBlock ? parseInt(toBlock, 10) : undefined;

    if (fromNum !== undefined) {
      const fbError = validateBlockNumber(fromNum);
      if (fbError) throw new AppError(400, 'VALIDATION_ERROR', fbError);
    }
    if (toNum !== undefined) {
      const tbError = validateBlockNumber(toNum);
      if (tbError) throw new AppError(400, 'VALIDATION_ERROR', tbError);
    }

    const result = await eventService.searchEvents(
      {
        contract,
        eventName: event,
        wallet,
        fromBlock: fromNum,
        toBlock: toNum,
        txHash,
      },
      abiRaw
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getRegistry(
  _req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  const result = eventService.getRegistry();
  res.json(result);
}
