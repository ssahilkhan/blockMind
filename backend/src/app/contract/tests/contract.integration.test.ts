import { ethers } from 'ethers';
import { compilerService } from '../compiler/compiler.service';
import { deployerService } from '../deployer/deployer.service';
import { callerService } from '../caller/caller.service';
import { executorService } from '../executor/executor.service';
import { eventDecoderService } from '../event-decoder/event-decoder.service';
import { getChainService, initChainService } from '../../chain/services/chain.service';
import { HardhatProvider } from '../../chain/provider/hardhat.provider';
import { CacheService } from '../../chain/cache/cache.service';

const RPC_URL = 'http://localhost:8545';

function isHardhatRunning(): boolean {
  try {
    require('net').connect({ port: 8545, host: '127.0.0.1' }).destroy();
    return true;
  } catch {
    return false;
  }
}

const describeIf = isHardhatRunning() ? describe : describe.skip;

const COUNTER_SOURCE = `
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter {
    uint256 public counter;

    event CounterUpdated(uint256 value);

    constructor(uint256 _initialValue) {
        counter = _initialValue;
    }

    function increment() public {
        counter += 1;
        emit CounterUpdated(counter);
    }

    function decrement() public {
        require(counter > 0, "Counter: cannot decrement below zero");
        counter -= 1;
        emit CounterUpdated(counter);
    }

    function getCounter() public view returns (uint256) {
        return counter;
    }
}
`;

const HARDHAT_ACCOUNT_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

describeIf('Contract Integration', () => {
  let compiledContract: {
    abi: unknown[];
    bytecode: string;
    contractName: string;
  };
  let contractAddress: string;
  let abi: unknown[];

  beforeAll(async () => {
    const provider = new HardhatProvider(RPC_URL);
    await provider.connect();
    const cache = new CacheService();
    initChainService(provider, cache);
  });

  it('should compile the Counter contract', () => {
    const result = compilerService.compile({ source: COUNTER_SOURCE });

    expect(result.success).toBe(true);
    expect(result.result).toBeDefined();
    expect(result.result!.contractName).toBe('Counter');
    expect(result.result!.bytecode).toBeDefined();
    expect(result.result!.abi).toBeDefined();
    expect(result.result!.abi.length).toBeGreaterThan(0);

    compiledContract = {
      abi: result.result!.abi,
      bytecode: result.result!.bytecode,
      contractName: result.result!.contractName,
    };
    abi = result.result!.abi;
  });

  it('should deploy the Counter contract', async () => {
    const result = await deployerService.deploy({
      abi: compiledContract.abi,
      bytecode: compiledContract.bytecode,
      constructorArgs: [42],
      privateKey: HARDHAT_ACCOUNT_PRIVATE_KEY,
    });

    expect(result.contractAddress).toMatch(/^0x[0-9a-fA-F]{40}$/);
    expect(result.transactionHash).toMatch(/^0x[0-9a-fA-F]{64}$/);
    expect(result.blockNumber).toBeGreaterThan(0);
    expect(result.gasUsed).toBeDefined();
    expect(result.status).toBe('success');

    contractAddress = result.contractAddress;
  });

  it('should perform a read-only call (getCounter)', async () => {
    const result = await callerService.read({
      contractAddress,
      abi,
      functionName: 'getCounter',
      args: [],
    });

    expect(result.functionName).toBe('getCounter');
    expect(result.result).toBeDefined();
  });

  it('should perform a read-only call to public variable (counter)', async () => {
    const result = await callerService.read({
      contractAddress,
      abi,
      functionName: 'counter',
      args: [],
    });

    expect(result.functionName).toBe('counter');
    expect(result.result).toBeDefined();
  });

  it('should execute a state-changing call (increment)', async () => {
    const result = await executorService.execute({
      contractAddress,
      abi,
      functionName: 'increment',
      args: [],
      privateKey: HARDHAT_ACCOUNT_PRIVATE_KEY,
    });

    expect(result.transactionHash).toMatch(/^0x[0-9a-fA-F]{64}$/);
  });

  it('should read updated state after increment', async () => {
    const chain = getChainService();

    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = await callerService.read({
      contractAddress,
      abi,
      functionName: 'getCounter',
      args: [],
    });

    const resultValue = result.result as { 0?: string };
    const rawValue = resultValue[0] !== undefined ? resultValue[0] : resultValue as unknown as string;
    const value = typeof rawValue === 'string' ? rawValue : JSON.stringify(rawValue);

    expect(value).toBe('43');
  });

  it('should decode events from increment transaction', async () => {
    const chain = getChainService();
    const result = await executorService.execute({
      contractAddress,
      abi,
      functionName: 'increment',
      args: [],
      privateKey: HARDHAT_ACCOUNT_PRIVATE_KEY,
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    const receipt = await chain.getReceipt(result.transactionHash);
    expect(receipt).not.toBeNull();

    const logs = receipt!.logs.map((log) => ({
      address: log.address,
      topics: log.topics,
      data: log.data,
    }));

    const decoded = eventDecoderService.decodeEvents({ abi, logs });

    expect(decoded.events.length).toBeGreaterThan(0);
    expect(decoded.events[0].eventName).toBe('CounterUpdated');
  });

  it('should decrement counter', async () => {
    const result = await executorService.execute({
      contractAddress,
      abi,
      functionName: 'decrement',
      args: [],
      privateKey: HARDHAT_ACCOUNT_PRIVATE_KEY,
    });

    expect(result.transactionHash).toMatch(/^0x[0-9a-fA-F]{64}$/);
  });

  it('should decrement to zero and verify', async () => {
    const readBefore = await callerService.read({
      contractAddress,
      abi,
      functionName: 'getCounter',
      args: [],
    });

    const beforeVal = readBefore.result as { 0?: string };
    const before = typeof beforeVal[0] === 'string' ? BigInt(beforeVal[0]) : 0n;

    for (let i = 0; i < before; i++) {
      await executorService.execute({
        contractAddress,
        abi,
        functionName: 'decrement',
        args: [],
        privateKey: HARDHAT_ACCOUNT_PRIVATE_KEY,
      });
    }

    const readAfter = await callerService.read({
      contractAddress,
      abi,
      functionName: 'getCounter',
      args: [],
    });

    const afterVal = readAfter.result as { 0?: string };
    const after = typeof afterVal[0] === 'string' ? afterVal[0] : '0';
    expect(after).toBe('0');
  });
});
