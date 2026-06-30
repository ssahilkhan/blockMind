import { Request, Response, NextFunction } from 'express';
import { walletService } from './wallet.service';
import { AppError } from '../common/errors';
import {
  validatePrivateKey,
  validateMnemonic,
  validateAddress,
  validateMessage,
  validateSignature,
} from './wallet.validator';
import {
  ImportPrivateKeyDto,
  ImportMnemonicDto,
  SignMessageDto,
  VerifySignatureDto,
} from './wallet.dto';

export async function createWallet(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const wallet = walletService.createWallet();
    res.status(201).json(wallet);
  } catch (err) {
    next(err);
  }
}

export async function importFromPrivateKey(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { privateKey } = req.body as ImportPrivateKeyDto;
    const error = validatePrivateKey(privateKey);
    if (error) {
      throw new AppError(400, 'VALIDATION_ERROR', error);
    }
    const wallet = walletService.importFromPrivateKey(privateKey);
    res.json(wallet);
  } catch (err) {
    next(err);
  }
}

export async function importFromMnemonic(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { mnemonic, path } = req.body as ImportMnemonicDto;
    const error = validateMnemonic(mnemonic);
    if (error) {
      throw new AppError(400, 'VALIDATION_ERROR', error);
    }
    const wallet = walletService.importFromMnemonic(mnemonic, path);
    res.json(wallet);
  } catch (err) {
    next(err);
  }
}

export async function getWalletDetails(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { address } = req.params;
    const error = validateAddress(address);
    if (error) {
      throw new AppError(400, 'VALIDATION_ERROR', error);
    }
    const details = await walletService.getWalletDetails(address);
    res.json(details);
  } catch (err) {
    next(err);
  }
}

export async function getBalance(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { address } = req.params;
    const error = validateAddress(address);
    if (error) {
      throw new AppError(400, 'VALIDATION_ERROR', error);
    }
    const balance = await walletService.getBalance(address);
    res.json(balance);
  } catch (err) {
    next(err);
  }
}

export async function validateAddressHandler(
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  const { address } = req.params;
  const result = walletService.validateAddress(address);
  res.json(result);
}

export async function signMessage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { privateKey, message } = req.body as SignMessageDto;
    const keyError = validatePrivateKey(privateKey);
    if (keyError) {
      throw new AppError(400, 'VALIDATION_ERROR', keyError);
    }
    const msgError = validateMessage(message);
    if (msgError) {
      throw new AppError(400, 'VALIDATION_ERROR', msgError);
    }
    const signature = walletService.signMessage(privateKey, message);
    res.json({ signature });
  } catch (err) {
    next(err);
  }
}

export async function verifySignature(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { message, signature } = req.body as VerifySignatureDto;
    const msgError = validateMessage(message);
    if (msgError) {
      throw new AppError(400, 'VALIDATION_ERROR', msgError);
    }
    const sigError = validateSignature(signature);
    if (sigError) {
      throw new AppError(400, 'VALIDATION_ERROR', sigError);
    }
    const result = walletService.verifySignature(message, signature);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
