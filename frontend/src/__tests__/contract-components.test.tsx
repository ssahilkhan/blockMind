/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { ContractEditor } from "@/components/contracts/contract-editor";
import { CompileCard } from "@/components/contracts/compile-card";
import { ContractHistory } from "@/components/contracts/contract-history";
import { CalldataEncoder } from "@/components/contracts/calldata-encoder";
import { CalldataDecoder } from "@/components/contracts/calldata-decoder";
import { EventViewer } from "@/components/contracts/event-viewer";
import type { CompiledContract, DeployedContract } from "@/types/contract";

const SAMPLE_ABI = [
  {
    type: "function",
    name: "count",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "increment",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "CountChanged",
    inputs: [{ name: "newCount", type: "uint256", indexed: false }],
  },
];

describe("ContractEditor", () => {
  it("renders with placeholder", () => {
    render(
      <ContractEditor value="" onChange={() => {}} onCompile={() => {}} isCompiling={false} />,
    );
    expect(screen.getByText("Solidity Editor")).toBeInTheDocument();
    expect(screen.getByText("Load Sample")).toBeInTheDocument();
    expect(screen.getByText("Compile")).toBeInTheDocument();
  });

  it("shows compiling state", () => {
    render(
      <ContractEditor value="contract Foo {}" onChange={() => {}} onCompile={() => {}} isCompiling={true} />,
    );
    expect(screen.getByText("Compiling...")).toBeInTheDocument();
  });
});

describe("CompileCard", () => {
  it("shows empty state", () => {
    render(<CompileCard result={null} errors={[]} />);
    expect(screen.getByText(/Compile Solidity code/)).toBeInTheDocument();
  });

  it("shows errors", () => {
    render(<CompileCard result={null} errors={["ParserError: Expected ';'"]} />);
    expect(screen.getByText("Compilation Errors")).toBeInTheDocument();
    expect(screen.getByText("ParserError: Expected ';'")).toBeInTheDocument();
  });

  it("shows compilation result", () => {
    const result: CompiledContract = {
      contractName: "Counter",
      abi: SAMPLE_ABI,
      bytecode: "0x6080",
    };
    render(<CompileCard result={result} errors={[]} />);
    expect(screen.getByText("Counter")).toBeInTheDocument();
    expect(screen.getByText("Compiled")).toBeInTheDocument();
    expect(screen.getByText("count()")).toBeInTheDocument();
    expect(screen.getByText("increment()")).toBeInTheDocument();
  });
});

describe("ContractHistory", () => {
  it("shows empty state", () => {
    render(<ContractHistory contracts={[]} />);
    expect(screen.getByText(/No contracts deployed/)).toBeInTheDocument();
  });

  it("renders deployed contracts", () => {
    const contracts: DeployedContract[] = [
      {
        address: "0x" + "aa".repeat(20),
        name: "Counter",
        abi: [],
        bytecode: "0x",
        txHash: "0x" + "bb".repeat(32),
        timestamp: Date.now(),
      },
    ];
    render(<ContractHistory contracts={contracts} />);
    expect(screen.getByText("Counter")).toBeInTheDocument();
    expect(screen.getByText("Deployed")).toBeInTheDocument();
  });
});

describe("CalldataEncoder", () => {
  it("renders encode form", () => {
    render(<CalldataEncoder />);
    expect(screen.getByText("ABI Encoder")).toBeInTheDocument();
    expect(screen.getByText("Encode")).toBeInTheDocument();
  });
});

describe("CalldataDecoder", () => {
  it("renders decode form", () => {
    render(<CalldataDecoder />);
    expect(screen.getByText("ABI Decoder")).toBeInTheDocument();
    expect(screen.getByText("Decode")).toBeInTheDocument();
  });
});

describe("EventViewer", () => {
  it("renders event viewer form", () => {
    render(<EventViewer />);
    expect(screen.getByText("Event Viewer")).toBeInTheDocument();
    expect(screen.getByText("Decode Events")).toBeInTheDocument();
  });
});
