/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { EventDetails } from "@/components/events/event-details";
import type { DecodedEvent } from "@/types/events";

const MOCK_EVENT: DecodedEvent = {
  eventName: "Transfer",
  signature: "Transfer(address, address, uint256)",
  args: { from: "0x" + "aa".repeat(20), to: "0x" + "bb".repeat(20), value: "1000" },
  contract: "0x" + "cc".repeat(20),
  logIndex: 0,
  blockNumber: 42,
  blockHash: "0x" + "dd".repeat(32),
  transactionHash: "0x" + "ee".repeat(32),
  from: "0x" + "aa".repeat(20),
  to: "0x" + "bb".repeat(20),
};

describe("EventDetails", () => {
  it("renders event name and standard badge", () => {
    render(<EventDetails event={MOCK_EVENT} onClose={() => {}} />);
    expect(screen.getByText("Transfer")).toBeInTheDocument();
    expect(screen.getByText("ERC20")).toBeInTheDocument();
  });

  it("renders detail fields", () => {
    render(<EventDetails event={MOCK_EVENT} onClose={() => {}} />);
    expect(screen.getByText("Contract Address")).toBeInTheDocument();
    expect(screen.getByText("Transaction Hash")).toBeInTheDocument();
    expect(screen.getByText("Block Number")).toBeInTheDocument();
    expect(screen.getByText("#42")).toBeInTheDocument();
    expect(screen.getByText("Log Index")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("Block Hash")).toBeInTheDocument();
  });

  it("renders decoded parameters", () => {
    render(<EventDetails event={MOCK_EVENT} onClose={() => {}} />);
    expect(screen.getByText("Decoded Parameters")).toBeInTheDocument();
    expect(screen.getByText("from")).toBeInTheDocument();
    expect(screen.getByText("to")).toBeInTheDocument();
    expect(screen.getByText("value")).toBeInTheDocument();
    expect(screen.getByText("1000")).toBeInTheDocument();
  });

  it("calls onClose when X button clicked", () => {
    const onClose = jest.fn();
    render(<EventDetails event={MOCK_EVENT} onClose={onClose} />);
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders event names", () => {
    render(<EventDetails event={MOCK_EVENT} onClose={() => {}} />);
    expect(screen.getByText("Transfer")).toBeInTheDocument();
  });
});
