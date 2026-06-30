import { CompilationResult, CompilationOutput } from '../types/contract.types';

export interface CompilationResponse {
  success: boolean;
  result?: {
    abi: unknown[];
    bytecode: string;
    deployedBytecode: string;
    metadata: string;
    compilerVersion: string;
    contractName: string;
    warnings: string[];
  };
  errors: Array<{
    message: string;
    severity: string;
    line?: number;
    column?: number;
  }>;
}

export const compilerMapper = {
  toResponse(output: CompilationOutput): CompilationResponse {
    if (!output.success) {
      return {
        success: false,
        errors: output.errors.map((e) => ({
          message: e.message,
          severity: e.severity,
          line: e.line,
          column: e.column,
        })),
      };
    }

    return {
      success: true,
      result: {
        abi: output.result!.abi,
        bytecode: output.result!.bytecode,
        deployedBytecode: output.result!.deployedBytecode,
        metadata: output.result!.metadata,
        compilerVersion: output.result!.compilerVersion,
        contractName: output.result!.contractName,
        warnings: output.result!.warnings,
      },
      errors: output.errors.map((e) => ({
        message: e.message,
        severity: e.severity,
        line: e.line,
        column: e.column,
      })),
    };
  },
};
