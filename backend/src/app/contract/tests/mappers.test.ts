import { compilerMapper } from '../mapper/compiler.mapper';
import { deployerMapper } from '../mapper/deployer.mapper';
import { callerMapper } from '../mapper/caller.mapper';
import { eventMapper } from '../mapper/event.mapper';
import { CompilationOutput, DeployResult, ReadResult, EventDecodeResult } from '../types/contract.types';

describe('compilerMapper', () => {
  it('should map successful compilation', () => {
    const output: CompilationOutput = {
      success: true,
      result: {
        abi: [{ type: 'function', name: 'get', inputs: [], outputs: [{ type: 'uint256' }] }],
        bytecode: '60806040',
        deployedBytecode: '60806040',
        metadata: '{}',
        compilerVersion: '0.8.28',
        contractName: 'Test',
        warnings: ['Warning: unused parameter'],
      },
      errors: [{ message: 'Warning: unused parameter', severity: 'warning' }],
    };

    const response = compilerMapper.toResponse(output);
    expect(response.success).toBe(true);
    expect(response.result!.contractName).toBe('Test');
    expect(response.result!.bytecode).toBe('60806040');
    expect(response.result!.warnings).toHaveLength(1);
  });

  it('should map compilation failure', () => {
    const output: CompilationOutput = {
      success: false,
      errors: [{ message: 'Syntax error', severity: 'error', line: 3, column: 5 }],
    };

    const response = compilerMapper.toResponse(output);
    expect(response.success).toBe(false);
    expect(response.result).toBeUndefined();
    expect(response.errors).toHaveLength(1);
    expect(response.errors[0].line).toBe(3);
  });
});

describe('deployerMapper', () => {
  it('should map deploy result', () => {
    const result: DeployResult = {
      contractAddress: '0x1234',
      transactionHash: '0xtxhash',
      blockNumber: 42,
      gasUsed: '21000',
      status: 'success',
    };

    const response = deployerMapper.toResponse(result);
    expect(response.contractAddress).toBe('0x1234');
    expect(response.transactionHash).toBe('0xtxhash');
    expect(response.blockNumber).toBe(42);
    expect(response.gasUsed).toBe('21000');
    expect(response.status).toBe('success');
  });
});

describe('callerMapper', () => {
  it('should map read result', () => {
    const result: ReadResult = {
      functionName: 'getCounter',
      args: [],
      result: 42,
    };

    const response = callerMapper.toResponse(result);
    expect(response.functionName).toBe('getCounter');
    expect(response.result).toBe(42);
  });
});

describe('eventMapper', () => {
  it('should map event decode result', () => {
    const result: EventDecodeResult = {
      events: [
        {
          eventName: 'CounterUpdated',
          signature: 'CounterUpdated(uint256)',
          args: { value: '1' },
          address: '0xcontract',
          logIndex: 0,
        },
      ],
    };

    const response = eventMapper.toResponse(result);
    expect(response.events).toHaveLength(1);
    expect(response.events[0].eventName).toBe('CounterUpdated');
    expect(response.events[0].args).toEqual({ value: '1' });
  });

  it('should map empty events', () => {
    const result: EventDecodeResult = { events: [] };
    const response = eventMapper.toResponse(result);
    expect(response.events).toHaveLength(0);
  });
});
