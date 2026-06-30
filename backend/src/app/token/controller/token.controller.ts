import { Request, Response, NextFunction } from 'express';
import { tokenService } from '../service/token.service';
import { AppError } from '../../common/errors';
import {
  validateTokenAddress,
  validateWalletAddress,
  validatePrivateKey,
  validateTokenId,
  validateAmount,
  validateStandard,
  validateSpender,
  validateOperator,
  validateApproved,
} from '../validator/token.validator';
import {
  DetectStandardDto,
  MetadataDto,
  BalanceDto,
  TransferBodyDto,
  ApproveBodyDto,
  AllowanceBodyDto,
  SetApprovalForAllBodyDto,
  GetApprovedBodyDto,
  IsApprovedForAllBodyDto,
  NFTMetadataDto,
} from '../dto/token.dto';

export async function detectStandard(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { address } = req.params as unknown as DetectStandardDto;
    const error = validateTokenAddress(address);
    if (error) throw new AppError(400, 'VALIDATION_ERROR', error);

    const result = await tokenService.detectStandard(address);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getMetadata(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { address } = req.params as unknown as MetadataDto;
    const error = validateTokenAddress(address);
    if (error) throw new AppError(400, 'VALIDATION_ERROR', error);

    const result = await tokenService.getMetadata(address);
    res.json(result);
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
    const { address, wallet } = req.params;
    const { tokenId } = req.query as { tokenId?: string };

    const addrError = validateTokenAddress(address);
    if (addrError) throw new AppError(400, 'VALIDATION_ERROR', addrError);

    const walletError = validateWalletAddress(wallet);
    if (walletError) throw new AppError(400, 'VALIDATION_ERROR', walletError);

    const idError = validateTokenId(tokenId);
    if (idError) throw new AppError(400, 'VALIDATION_ERROR', idError);

    const result = await tokenService.getBalance(address, wallet, tokenId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function transfer(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as TransferBodyDto;

    const addrError = validateTokenAddress(body.tokenAddress);
    if (addrError) throw new AppError(400, 'VALIDATION_ERROR', addrError);

    const keyError = validatePrivateKey(body.fromPrivateKey);
    if (keyError) throw new AppError(400, 'VALIDATION_ERROR', keyError);

    const toError = validateWalletAddress(body.to);
    if (toError) throw new AppError(400, 'VALIDATION_ERROR', toError);

    const standardError = validateStandard(body.standard);
    if (standardError) throw new AppError(400, 'VALIDATION_ERROR', standardError);

    const amountError = validateAmount(body.amount);
    if (amountError) throw new AppError(400, 'VALIDATION_ERROR', amountError);

    const idError = validateTokenId(body.tokenId);
    if (idError) throw new AppError(400, 'VALIDATION_ERROR', idError);

    const result = await tokenService.transfer({
      tokenAddress: body.tokenAddress,
      fromPrivateKey: body.fromPrivateKey,
      to: body.to,
      amount: body.amount,
      tokenId: body.tokenId,
      standard: body.standard as any,
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function approve(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as ApproveBodyDto;

    const addrError = validateTokenAddress(body.tokenAddress);
    if (addrError) throw new AppError(400, 'VALIDATION_ERROR', addrError);

    const keyError = validatePrivateKey(body.privateKey);
    if (keyError) throw new AppError(400, 'VALIDATION_ERROR', keyError);

    const spenderError = validateSpender(body.spender);
    if (spenderError) throw new AppError(400, 'VALIDATION_ERROR', spenderError);

    const standardError = validateStandard(body.standard);
    if (standardError) throw new AppError(400, 'VALIDATION_ERROR', standardError);

    const amountError = validateAmount(body.amount);
    if (amountError) throw new AppError(400, 'VALIDATION_ERROR', amountError);

    const idError = validateTokenId(body.tokenId);
    if (idError) throw new AppError(400, 'VALIDATION_ERROR', idError);

    const result = await tokenService.approve({
      tokenAddress: body.tokenAddress,
      privateKey: body.privateKey,
      spender: body.spender,
      amount: body.amount,
      tokenId: body.tokenId,
      standard: body.standard as any,
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function allowance(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as AllowanceBodyDto;

    const addrError = validateTokenAddress(body.tokenAddress);
    if (addrError) throw new AppError(400, 'VALIDATION_ERROR', addrError);

    const ownerError = validateWalletAddress(body.owner);
    if (ownerError) throw new AppError(400, 'VALIDATION_ERROR', ownerError);

    const spenderError = validateSpender(body.spender);
    if (spenderError) throw new AppError(400, 'VALIDATION_ERROR', spenderError);

    const standardError = validateStandard(body.standard);
    if (standardError) throw new AppError(400, 'VALIDATION_ERROR', standardError);

    const result = await tokenService.allowance({
      tokenAddress: body.tokenAddress,
      owner: body.owner,
      spender: body.spender,
      standard: body.standard as any,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function setApprovalForAll(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as SetApprovalForAllBodyDto;

    const addrError = validateTokenAddress(body.tokenAddress);
    if (addrError) throw new AppError(400, 'VALIDATION_ERROR', addrError);

    const keyError = validatePrivateKey(body.privateKey);
    if (keyError) throw new AppError(400, 'VALIDATION_ERROR', keyError);

    const operatorError = validateOperator(body.operator);
    if (operatorError) throw new AppError(400, 'VALIDATION_ERROR', operatorError);

    const approvedError = validateApproved(body.approved);
    if (approvedError) throw new AppError(400, 'VALIDATION_ERROR', approvedError);

    const standardError = validateStandard(body.standard);
    if (standardError) throw new AppError(400, 'VALIDATION_ERROR', standardError);

    const result = await tokenService.setApprovalForAll({
      tokenAddress: body.tokenAddress,
      privateKey: body.privateKey,
      operator: body.operator,
      approved: body.approved,
      standard: body.standard as any,
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getApproved(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as GetApprovedBodyDto;

    const addrError = validateTokenAddress(body.tokenAddress);
    if (addrError) throw new AppError(400, 'VALIDATION_ERROR', addrError);

    const idError = validateTokenId(body.tokenId);
    if (idError) throw new AppError(400, 'VALIDATION_ERROR', idError);

    const result = await tokenService.getApproved({
      tokenAddress: body.tokenAddress,
      tokenId: body.tokenId,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function isApprovedForAll(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as IsApprovedForAllBodyDto;

    const addrError = validateTokenAddress(body.tokenAddress);
    if (addrError) throw new AppError(400, 'VALIDATION_ERROR', addrError);

    const ownerError = validateWalletAddress(body.owner);
    if (ownerError) throw new AppError(400, 'VALIDATION_ERROR', ownerError);

    const operatorError = validateOperator(body.operator);
    if (operatorError) throw new AppError(400, 'VALIDATION_ERROR', operatorError);

    const result = await tokenService.isApprovedForAll({
      tokenAddress: body.tokenAddress,
      owner: body.owner,
      operator: body.operator,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getNFTMetadata(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { address, id } = req.params;

    const addrError = validateTokenAddress(address);
    if (addrError) throw new AppError(400, 'VALIDATION_ERROR', addrError);

    const idError = validateTokenId(id);
    if (idError) throw new AppError(400, 'VALIDATION_ERROR', idError);

    const result = await tokenService.getNFTMetadata(address, id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
