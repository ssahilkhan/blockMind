export interface CompilationRequest {
  source: string;
}

export interface CompilationResult {
  abi: unknown[];
  bytecode: string;
  deployedBytecode: string;
  metadata: string;
  compilerVersion: string;
  contractName: string;
  warnings: string[];
}

export interface CompilationErrorDetail {
  message: string;
  severity: string;
  line?: number;
  column?: number;
}

export interface CompilationOutput {
  success: boolean;
  result?: CompilationResult;
  errors: CompilationErrorDetail[];
}

export interface DeployRequest {
  abi: unknown[];
  bytecode: string;
  constructorArgs: unknown[];
  privateKey: string;
}

export interface DeployResult {
  contractAddress: string;
  transactionHash: string;
  blockNumber: number;
  gasUsed: string;
  status: 'success' | 'failed';
}

export interface ReadRequest {
  contractAddress: string;
  abi: unknown[];
  functionName: string;
  args: unknown[];
}

export interface ReadResult {
  functionName: string;
  args: unknown[];
  result: unknown;
}

export interface WriteRequest {
  contractAddress: string;
  abi: unknown[];
  functionName: string;
  args: unknown[];
  privateKey: string;
  value?: string;
}

export interface WriteResult {
  transactionHash: string;
}

export interface EncodeRequest {
  type: 'constructor' | 'function';
  abi: unknown[];
  functionName?: string;
  args: unknown[];
}

export interface EncodeResult {
  encoded: string;
  functionSignature?: string;
}

export interface DecodeRequest {
  abi: unknown[];
  data: string;
}

export interface DecodeResult {
  functionName: string;
  signature: string;
  args: Record<string, unknown>;
}

export interface EventDecodeRequest {
  abi: unknown[];
  logs: Array<{
    address: string;
    topics: string[];
    data: string;
  }>;
}

export interface DecodedEvent {
  eventName: string;
  signature: string;
  args: Record<string, unknown>;
  address: string;
  logIndex: number;
}

export interface EventDecodeResult {
  events: DecodedEvent[];
}
