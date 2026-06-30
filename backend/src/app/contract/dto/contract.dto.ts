export interface CompileDto {
  source: string;
}

export interface DeployDto {
  abi: unknown[];
  bytecode: string;
  constructorArgs?: unknown[];
  privateKey: string;
}

export interface ReadDto {
  contractAddress: string;
  abi: unknown[];
  functionName: string;
  args?: unknown[];
}

export interface WriteDto {
  contractAddress: string;
  abi: unknown[];
  functionName: string;
  args?: unknown[];
  privateKey: string;
  value?: string;
}

export interface EncodeDto {
  type: 'constructor' | 'function';
  abi: unknown[];
  functionName?: string;
  args?: unknown[];
}

export interface DecodeDto {
  abi: unknown[];
  data: string;
}

export interface ValidateAbiDto {
  abi: unknown[];
}
