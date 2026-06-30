import { Request, Response, NextFunction } from 'express';
import { contractService } from '../service/contract.service';
import { AppError } from '../../common/errors';
import {
  validateSoliditySource,
  validateABI,
  validateBytecode,
  validatePrivateKey,
  validateContractAddress,
  validateFunctionName,
  validateConstructorArgs,
  validateFunctionArgs,
  validateEncodeType,
  validateCalldata,
  validateTxHash,
  validateValue,
} from '../validator/contract.validator';
import {
  CompileDto,
  DeployDto,
  ReadDto,
  WriteDto,
  EncodeDto,
  DecodeDto,
  ValidateAbiDto,
} from '../dto/contract.dto';
import { getChainService } from '../../chain/services/chain.service';

export async function compile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { source } = req.body as CompileDto;
    const error = validateSoliditySource(source);
    if (error) throw new AppError(400, 'VALIDATION_ERROR', error);

    const result = contractService.compile({ source });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function deploy(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as DeployDto;

    const abiError = validateABI(body.abi);
    if (abiError) throw new AppError(400, 'VALIDATION_ERROR', abiError);

    const bytecodeError = validateBytecode(body.bytecode);
    if (bytecodeError) throw new AppError(400, 'VALIDATION_ERROR', bytecodeError);

    const keyError = validatePrivateKey(body.privateKey);
    if (keyError) throw new AppError(400, 'VALIDATION_ERROR', keyError);

    const argsError = validateConstructorArgs(body.constructorArgs);
    if (argsError) throw new AppError(400, 'VALIDATION_ERROR', argsError);

    const result = await contractService.deploy({
      abi: body.abi,
      bytecode: body.bytecode,
      constructorArgs: body.constructorArgs || [],
      privateKey: body.privateKey,
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function read(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as ReadDto;

    const addrError = validateContractAddress(body.contractAddress);
    if (addrError) throw new AppError(400, 'VALIDATION_ERROR', addrError);

    const abiError = validateABI(body.abi);
    if (abiError) throw new AppError(400, 'VALIDATION_ERROR', abiError);

    const nameError = validateFunctionName(body.functionName);
    if (nameError) throw new AppError(400, 'VALIDATION_ERROR', nameError);

    const argsError = validateFunctionArgs(body.args);
    if (argsError) throw new AppError(400, 'VALIDATION_ERROR', argsError);

    const result = await contractService.read({
      contractAddress: body.contractAddress,
      abi: body.abi,
      functionName: body.functionName,
      args: body.args || [],
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function write(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as WriteDto;

    const addrError = validateContractAddress(body.contractAddress);
    if (addrError) throw new AppError(400, 'VALIDATION_ERROR', addrError);

    const abiError = validateABI(body.abi);
    if (abiError) throw new AppError(400, 'VALIDATION_ERROR', abiError);

    const nameError = validateFunctionName(body.functionName);
    if (nameError) throw new AppError(400, 'VALIDATION_ERROR', nameError);

    const argsError = validateFunctionArgs(body.args);
    if (argsError) throw new AppError(400, 'VALIDATION_ERROR', argsError);

    const keyError = validatePrivateKey(body.privateKey);
    if (keyError) throw new AppError(400, 'VALIDATION_ERROR', keyError);

    const valueError = validateValue(body.value);
    if (valueError) throw new AppError(400, 'VALIDATION_ERROR', valueError);

    const result = await contractService.execute({
      contractAddress: body.contractAddress,
      abi: body.abi,
      functionName: body.functionName,
      args: body.args || [],
      privateKey: body.privateKey,
      value: body.value,
    });

    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function encode(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as EncodeDto;

    const typeError = validateEncodeType(body.type);
    if (typeError) throw new AppError(400, 'VALIDATION_ERROR', typeError);

    const abiError = validateABI(body.abi);
    if (abiError) throw new AppError(400, 'VALIDATION_ERROR', abiError);

    if (body.type === 'function') {
      const nameError = validateFunctionName(body.functionName);
      if (nameError) throw new AppError(400, 'VALIDATION_ERROR', nameError);
    }

    const argsError = body.type === 'constructor'
      ? validateConstructorArgs(body.args)
      : validateFunctionArgs(body.args);
    if (argsError) throw new AppError(400, 'VALIDATION_ERROR', argsError);

    const result = contractService.encode({
      type: body.type,
      abi: body.abi,
      functionName: body.functionName,
      args: body.args || [],
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function decode(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as DecodeDto;

    const abiError = validateABI(body.abi);
    if (abiError) throw new AppError(400, 'VALIDATION_ERROR', abiError);

    const dataError = validateCalldata(body.data);
    if (dataError) throw new AppError(400, 'VALIDATION_ERROR', dataError);

    const result = contractService.decode({
      abi: body.abi,
      data: body.data,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function validateAbi(
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  const { abi } = req.body as ValidateAbiDto;
  const error = contractService.validateABI(abi);
  res.json({ valid: error === null, error });
}

export async function decodeEvents(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { txHash } = req.params;

    const hashError = validateTxHash(txHash);
    if (hashError) throw new AppError(400, 'VALIDATION_ERROR', hashError);

    const chain = getChainService();
    const receipt = await chain.getReceipt(txHash);

    if (!receipt) {
      throw new AppError(404, 'NOT_FOUND', 'Transaction receipt not found');
    }

    const abiRaw = req.query.abi;
    let abi: unknown[];

    if (abiRaw) {
      try {
        abi = JSON.parse(abiRaw as string);
      } catch {
        throw new AppError(400, 'VALIDATION_ERROR', 'ABI must be a valid JSON array');
      }
    } else {
      throw new AppError(400, 'VALIDATION_ERROR', 'ABI query parameter is required');
    }

    const abiError = validateABI(abi);
    if (abiError) throw new AppError(400, 'VALIDATION_ERROR', abiError);

    const logs = receipt.logs.map((log) => ({
      address: log.address,
      topics: log.topics,
      data: log.data,
    }));

    const result = await contractService.decodeEvents({ abi, logs });
    res.json(result);
  } catch (err) {
    next(err);
  }
}
