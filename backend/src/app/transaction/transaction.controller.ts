import { Request, Response, NextFunction } from 'express';
import { transactionService } from './transaction.service';
import { AppError } from '../common/errors';
import {
  validatePrivateKey,
  validateAddress,
  validateValue,
  validateData,
  validateNonce,
  validateGasLimit,
  validateGasPrice,
  validateMaxFeePerGas,
  validateMaxPriorityFeePerGas,
  validateChainId,
  validateSignedTx,
  validateTxHash,
} from './transaction.validator';
import {
  BuildAndSendDto,
  EstimateGasDto,
  BroadcastTxDto,
} from './transaction.dto';

export async function buildAndSend(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as BuildAndSendDto;

    const keyError = validatePrivateKey(body.privateKey);
    if (keyError) throw new AppError(400, 'VALIDATION_ERROR', keyError);

    const toError = validateAddress(body.to);
    if (toError) throw new AppError(400, 'VALIDATION_ERROR', toError);

    const valueError = validateValue(body.value);
    if (valueError) throw new AppError(400, 'VALIDATION_ERROR', valueError);

    const dataError = validateData(body.data);
    if (dataError) throw new AppError(400, 'VALIDATION_ERROR', dataError);

    const nonceError = validateNonce(body.nonce);
    if (nonceError) throw new AppError(400, 'VALIDATION_ERROR', nonceError);

    const gasLimitError = validateGasLimit(body.gasLimit);
    if (gasLimitError) throw new AppError(400, 'VALIDATION_ERROR', gasLimitError);

    const gasPriceError = validateGasPrice(body.gasPrice);
    if (gasPriceError) throw new AppError(400, 'VALIDATION_ERROR', gasPriceError);

    const maxFeeError = validateMaxFeePerGas(body.maxFeePerGas);
    if (maxFeeError) throw new AppError(400, 'VALIDATION_ERROR', maxFeeError);

    const maxPriorityError = validateMaxPriorityFeePerGas(body.maxPriorityFeePerGas);
    if (maxPriorityError) throw new AppError(400, 'VALIDATION_ERROR', maxPriorityError);

    const chainIdError = validateChainId(body.chainId);
    if (chainIdError) throw new AppError(400, 'VALIDATION_ERROR', chainIdError);

    const result = await transactionService.signAndSend(body.privateKey, {
      to: body.to,
      value: body.value,
      data: body.data,
      nonce: body.nonce,
      gasLimit: body.gasLimit,
      gasPrice: body.gasPrice,
      maxFeePerGas: body.maxFeePerGas,
      maxPriorityFeePerGas: body.maxPriorityFeePerGas,
      chainId: body.chainId,
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function estimateGas(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as EstimateGasDto;

    if (!body.from) throw new AppError(400, 'VALIDATION_ERROR', 'From address is required');

    const fromError = validateAddress(body.from);
    if (fromError) throw new AppError(400, 'VALIDATION_ERROR', fromError);

    const toError = validateAddress(body.to);
    if (toError) throw new AppError(400, 'VALIDATION_ERROR', toError);

    const valueError = validateValue(body.value);
    if (valueError) throw new AppError(400, 'VALIDATION_ERROR', valueError);

    const dataError = validateData(body.data);
    if (dataError) throw new AppError(400, 'VALIDATION_ERROR', dataError);

    const result = await transactionService.estimateGas({
      from: body.from,
      to: body.to,
      value: body.value,
      data: body.data,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function broadcast(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as BroadcastTxDto;

    const signedTxError = validateSignedTx(body.signedTx);
    if (signedTxError) throw new AppError(400, 'VALIDATION_ERROR', signedTxError);

    const result = await transactionService.broadcast(body.signedTx);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function track(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { hash } = req.params;

    const hashError = validateTxHash(hash);
    if (hashError) throw new AppError(400, 'VALIDATION_ERROR', hashError);

    const result = await transactionService.trackTransaction(hash);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
