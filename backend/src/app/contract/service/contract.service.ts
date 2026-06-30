import { compilerService } from '../compiler/compiler.service';
import { encoderService } from '../encoder/encoder.service';
import { decoderService } from '../decoder/decoder.service';
import { eventDecoderService } from '../event-decoder/event-decoder.service';
import { deployerService } from '../deployer/deployer.service';
import { callerService } from '../caller/caller.service';
import { executorService } from '../executor/executor.service';
import { abiManager } from '../abi/abi.manager';
import {
  CompilationRequest,
  CompilationOutput,
  DeployRequest,
  DeployResult,
  ReadRequest,
  ReadResult,
  WriteRequest,
  WriteResult,
  EncodeRequest,
  EncodeResult,
  DecodeRequest,
  DecodeResult,
  EventDecodeRequest,
  EventDecodeResult,
} from '../types/contract.types';
import { compilerMapper, CompilationResponse } from '../mapper/compiler.mapper';
import { deployerMapper, DeployResponse } from '../mapper/deployer.mapper';
import { callerMapper, ReadResponse } from '../mapper/caller.mapper';
import { eventMapper, EventResponse } from '../mapper/event.mapper';

export const contractService = {
  compile(request: CompilationRequest): CompilationResponse {
    const output: CompilationOutput = compilerService.compile(request);
    return compilerMapper.toResponse(output);
  },

  async deploy(request: DeployRequest): Promise<DeployResponse> {
    const result: DeployResult = await deployerService.deploy(request);
    return deployerMapper.toResponse(result);
  },

  async read(request: ReadRequest): Promise<ReadResponse> {
    const result: ReadResult = await callerService.read(request);
    return callerMapper.toResponse(result);
  },

  async execute(request: WriteRequest): Promise<WriteResult> {
    return executorService.execute(request);
  },

  encode(request: EncodeRequest): EncodeResult {
    return encoderService.encode(request);
  },

  decode(request: DecodeRequest): DecodeResult {
    return decoderService.decodeFunction(request.abi, request.data);
  },

  validateABI(abi: unknown[]): string | null {
    return abiManager.validateABI(abi);
  },

  async decodeEvents(request: EventDecodeRequest): Promise<EventResponse> {
    const result: EventDecodeResult = eventDecoderService.decodeEvents(request);
    return eventMapper.toResponse(result);
  },
};
