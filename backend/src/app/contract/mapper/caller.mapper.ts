import { ReadResult } from '../types/contract.types';

export interface ReadResponse {
  functionName: string;
  args: unknown[];
  result: unknown;
}

export const callerMapper = {
  toResponse(result: ReadResult): ReadResponse {
    return {
      functionName: result.functionName,
      args: result.args,
      result: result.result,
    };
  },
};
