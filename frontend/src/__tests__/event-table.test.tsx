/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { EventTable } from "@/components/events/event-table";
import type { DecodedEvent } from "@/types/events";

const MOCK_EVENTS: DecodedEvent[] = [
  {
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
  },
  {
    eventName: "Approval",
    signature: "Approval(address, address, uint256)",
    args: { owner: "0x" + "aa".repeat(20), spender: "0x" + "bb".repeat(20), value: "500" },
    contract: "0x" + "ff".repeat(20),
    logIndex: 1,
    blockNumber: 43,
    blockHash: "0x" + "01".repeat(32),
    transactionHash: "0x" + "02".repeat(32),
    from: "0x" + "aa".repeat(20),
    to: "0x" + "bb".repeat(20),
  },
];

describe("EventTable", () => {
  it("shows loading state", () => {
    render(<EventTable events={[]} loading={true} onSelect={() => {}} />);
    expect(screen.getByText("Loading events...")).toBeInTheDocument();
  });

  it("shows empty state", () => {
    render(<EventTable events={[]} loading={false} onSelect={() => {}} />);
    expect(screen.getByText(/No events found/)).toBeInTheDocument();
  });

  it("renders events with count", () => {
    render(<EventTable events={MOCK_EVENTS} loading={false} onSelect={() => {}} />);
    expect(screen.getByText("2 event(s) found")).toBeInTheDocument();
    expect(screen.getByText("Transfer")).toBeInTheDocument();
    expect(screen.getByText("Approval")).toBeInTheDocument();
  });

  it("renders block numbers", () => {
    render(<EventTable events={MOCK_EVENTS} loading={false} onSelect={() => {}} />);
    expect(screen.getByText("Block #42")).toBeInTheDocument();
    expect(screen.getByText("Block #43")).toBeInTheDocument();
  });

  it("renders standard badges", () => {
    render(<EventTable events={MOCK_EVENTS} loading={false} onSelect={() => {}} />);
    const badges = screen.getAllByText("ERC20");
    expect(badges.length).toBeGreaterThanOrEqual(2);
  });
});
