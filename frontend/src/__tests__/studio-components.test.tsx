/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { HashBadge } from "@/components/studio/hash-badge";
import { GasEstimateCard } from "@/components/studio/gas-estimate-card";
import { TransactionHistoryTable } from "@/components/studio/transaction-history-table";
import { TransactionStatusCard } from "@/components/studio/transaction-status-card";
import type { TrackResult } from "@/services/transaction";
import type { SessionTransaction } from "@/stores/tx-studio-store";
import type { GasEstimate } from "@/services/transaction";

describe("HashBadge", () => {
  it("renders truncated hash", () => {
    const hash = "0x" + "ab".repeat(32);
    render(<HashBadge hash={hash} />);
    expect(screen.getByText(/0xabab/)).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    render(<HashBadge hash="0x" label="Tx Hash" />);
    expect(screen.getByText("Tx Hash")).toBeInTheDocument();
  });
});

describe("GasEstimateCard", () => {
  it("shows loading state", () => {
    render(<GasEstimateCard estimate={null} isLoading={true} />);
    expect(screen.getByText("Estimating gas...")).toBeInTheDocument();
  });

  it("shows empty state", () => {
    render(<GasEstimateCard estimate={null} isLoading={false} />);
    expect(screen.getByText(/Enter a transaction/)).toBeInTheDocument();
  });

  it("shows estimate", () => {
    const estimate: GasEstimate = {
      gasEstimation: "21000",
      gasEstimationWei: "420000000000000",
    };
    render(<GasEstimateCard estimate={estimate} isLoading={false} />);
    expect(screen.getByText("21000")).toBeInTheDocument();
    expect(screen.getByText("420000000000000")).toBeInTheDocument();
  });
});

describe("TransactionHistoryTable", () => {
  it("shows empty state", () => {
    render(<TransactionHistoryTable transactions={[]} />);
    expect(screen.getByText(/No transactions sent/)).toBeInTheDocument();
  });

  it("renders transactions", () => {
    const txs: SessionTransaction[] = [
      {
        hash: "0x" + "aa".repeat(32),
        to: "0x" + "bb".repeat(20),
        value: "1.5",
        status: "confirmed",
        timestamp: Date.now(),
      },
    ];
    render(<TransactionHistoryTable transactions={txs} />);
    expect(screen.getByText("Session History")).toBeInTheDocument();
  });
});

describe("TransactionStatusCard", () => {
  it("renders confirmed status", () => {
    const result: TrackResult = {
      status: "confirmed",
      blockNumber: 42,
      confirmations: 3,
      receipt: {
        transactionHash: "0x" + "cc".repeat(32),
        blockNumber: 42,
        blockHash: "0x" + "dd".repeat(32),
        from: "0x" + "11".repeat(20),
        to: "0x" + "22".repeat(20),
        status: "success",
        gasUsed: "21000",
        gasPrice: "20000000000",
        contractAddress: null,
      },
    };
    render(
      <TransactionStatusCard result={result} hash={"0x" + "cc".repeat(32)} />,
    );
    expect(screen.getByText("Confirmed")).toBeInTheDocument();
    expect(screen.getByText("#42")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
