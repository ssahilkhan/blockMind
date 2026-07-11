/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { BlockCard } from "@/components/explorer/block-card";
import { TransactionCard } from "@/components/explorer/transaction-card";
import { BlockTable } from "@/components/explorer/block-table";
import type { BlockResponse, TransactionResponse } from "@/types/api";

const mockBlock: BlockResponse = {
  number: 42,
  hash: "0x" + "ab".repeat(32),
  parentHash: "0x" + "cd".repeat(32),
  timestamp: String(Math.floor(Date.now() / 1000)),
  transactionCount: 5,
  transactions: ["0x" + "ef".repeat(32)],
  gasUsed: "21000",
  gasLimit: "30000000",
  gasUsedPercent: "0.07",
  miner: "0x" + "11".repeat(20),
  difficulty: "0",
  baseFee: "1000000000",
  extraData: "0x",
  size: 1000,
};

const mockTx: TransactionResponse = {
  hash: "0x" + "aa".repeat(32),
  blockNumber: 42,
  blockHash: "0x" + "bb".repeat(32),
  from: "0x" + "11".repeat(20),
  to: "0x" + "22".repeat(20),
  value: "1.5",
  gasPrice: "20000000000",
  gasLimit: "21000",
  nonce: 0,
  input: "0x",
};

describe("BlockCard", () => {
  it("renders block number and tx count", () => {
    render(<BlockCard block={mockBlock} />);
    expect(screen.getByText("#42")).toBeInTheDocument();
    expect(screen.getByText("5 txns")).toBeInTheDocument();
  });
});

describe("TransactionCard", () => {
  it("renders tx hash and value", () => {
    render(<TransactionCard tx={mockTx} />);
    expect(screen.getByText("1.5 ETH")).toBeInTheDocument();
  });
});

describe("BlockTable", () => {
  it("renders empty state", () => {
    render(<BlockTable blocks={[]} />);
    expect(screen.getByText("No blocks found.")).toBeInTheDocument();
  });

  it("renders blocks", () => {
    render(<BlockTable blocks={[mockBlock]} />);
    expect(screen.getByText("#42")).toBeInTheDocument();
  });
});
