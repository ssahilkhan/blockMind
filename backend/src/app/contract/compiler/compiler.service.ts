import { logger } from '../../logger';
import {
  CompilationRequest,
  CompilationResult,
  CompilationOutput,
  CompilationErrorDetail,
} from '../types/contract.types';

type Solc = {
  compile(input: string): string;
  version(): string;
};

let solcInstance: Solc | null = null;

function getSolc(): Solc {
  if (!solcInstance) {
    solcInstance = require('solc') as Solc;
  }
  return solcInstance;
}

export const compilerService = {
  compile(request: CompilationRequest): CompilationOutput {
    const solc = getSolc();
    logger.info('Compilation started');

    const input = JSON.stringify({
      language: 'Solidity',
      sources: {
        'contract.sol': {
          content: request.source,
        },
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['abi', 'evm.bytecode', 'evm.deployedBytecode', 'metadata'],
          },
        },
      },
    });

    const output = JSON.parse(solc.compile(input));
    const errors: CompilationErrorDetail[] = [];

    if (output.errors) {
      for (const err of output.errors) {
        errors.push({
          message: err.message,
          severity: err.severity,
          line: err.sourceLocation?.startLine,
          column: err.sourceLocation?.startColumn,
        });
      }

      const fatalErrors = errors.filter(
        (e) => e.severity === 'error'
      );

      if (fatalErrors.length > 0) {
        logger.warn('Compilation failed', { errorCount: fatalErrors.length });
        return { success: false, errors };
      }
    }

    const contractFile = output.contracts['contract.sol'];
    if (!contractFile) {
      logger.warn('Compilation produced no contracts');
      return {
        success: false,
        errors: [{ message: 'No contracts found in source', severity: 'error' }],
      };
    }

    const contractNames = Object.keys(contractFile);
    if (contractNames.length === 0) {
      logger.warn('Compilation produced no contracts');
      return {
        success: false,
        errors: [{ message: 'No contracts found in source', severity: 'error' }],
      };
    }

    const contractName = contractNames[0];
    const contract = contractFile[contractName];
    const compilerVersion = solc.version();

    const warnings = errors
      .filter((e) => e.severity === 'warning')
      .map((e) => e.message);

    const result: CompilationResult = {
      abi: contract.abi,
      bytecode: contract.evm.bytecode.object,
      deployedBytecode: contract.evm.deployedBytecode.object,
      metadata: contract.metadata,
      compilerVersion,
      contractName,
      warnings,
    };

    logger.info('Compilation finished', { contractName });
    return { success: true, result, errors: warnings.length > 0 ? warnings.map((m) => ({ message: m, severity: 'warning' })) : [] };
  },
};
