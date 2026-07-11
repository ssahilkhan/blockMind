export interface AbiParameter {
  name: string;
  type: string;
  indexed?: boolean;
  components?: AbiParameter[];
}

export interface AbiFunction {
  type: "function";
  name: string;
  inputs: AbiParameter[];
  outputs: AbiParameter[];
  stateMutability: string;
}

export interface AbiEvent {
  type: "event";
  name: string;
  inputs: AbiParameter[];
}

export interface AbiConstructor {
  type: "constructor";
  inputs: AbiParameter[];
}

export interface ParsedAbi {
  functions: AbiFunction[];
  readFunctions: AbiFunction[];
  writeFunctions: AbiFunction[];
  events: AbiEvent[];
  constructor: AbiConstructor | null;
}

export interface CompiledContract {
  contractName: string;
  abi: unknown[];
  bytecode: string;
  compilerVersion?: string;
  warnings?: string[];
}

export interface DeployedContract {
  address: string;
  name: string;
  abi: unknown[];
  bytecode: string;
  txHash: string;
  timestamp: number;
}

export interface DecodedEvent {
  eventName: string;
  signature: string;
  args: Record<string, unknown>;
  address: string;
  logIndex: number;
}

export interface DecodedEventsResult {
  events: DecodedEvent[];
}

export interface DecodeFunctionResult {
  functionName: string;
  signature: string;
  args: Record<string, unknown>;
}

export function parseAbi(abi: unknown[]): ParsedAbi {
  const functions: AbiFunction[] = [];
  const events: AbiEvent[] = [];
  let constructorFn: AbiConstructor | null = null;

  for (const item of abi) {
    if (typeof item !== "object" || item === null) continue;
    const entry = item as Record<string, unknown>;
    switch (entry.type) {
      case "function":
        functions.push(item as AbiFunction);
        break;
      case "event":
        events.push(item as AbiEvent);
        break;
      case "constructor":
        constructorFn = item as AbiConstructor;
        break;
    }
  }

  const readFunctions = functions.filter(
    (f) => f.stateMutability === "view" || f.stateMutability === "pure",
  );
  const writeFunctions = functions.filter(
    (f) => f.stateMutability !== "view" && f.stateMutability !== "pure",
  );

  return { functions, readFunctions, writeFunctions, events, constructor: constructorFn };
}

export function formatSolidityType(param: AbiParameter): string {
  if (param.type === "tuple" && param.components) {
    const inner = param.components.map(formatSolidityType).join(", ");
    return `(${inner})`;
  }
  if (param.type.endsWith("[]")) {
    return `${formatSolidityType({ ...param, type: param.type.slice(0, -2) })}[]`;
  }
  return param.type;
}

export function functionSignature(fn: AbiFunction): string {
  const params = fn.inputs.map(formatSolidityType).join(", ");
  return `${fn.name}(${params})`;
}

export const SAMPLE_COUNTER_SOL = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Counter {
    uint256 private _count;
    address public owner;

    event CountChanged(uint256 newCount);
    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
        _count = 0;
    }

    function count() public view returns (uint256) {
        return _count;
    }

    function increment() public {
        _count += 1;
        emit CountChanged(_count);
    }

    function decrement() public {
        require(_count > 0, "Count is zero");
        _count -= 1;
        emit CountChanged(_count);
    }

    function getCount() public view returns (uint256) {
        return _count;
    }

    function reset() public onlyOwner {
        _count = 0;
        emit CountChanged(_count);
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner is zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}`;
