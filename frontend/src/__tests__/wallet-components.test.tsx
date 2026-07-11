/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { CopyButton } from "@/components/wallet/copy-button";
import { AddressField } from "@/components/wallet/address-field";
import { StatusBadge } from "@/components/wallet/status-badge";
import { BalanceCard } from "@/components/wallet/balance-card";

describe("CopyButton", () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn().mockResolvedValue(undefined) },
    });
  });

  it("renders copy icon", () => {
    const { container } = render(<CopyButton value="test" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});

describe("AddressField", () => {
  it("renders label and truncated address", () => {
    const longAddress = "0x" + "ab".repeat(20);
    render(<AddressField label="Address" value={longAddress} />);
    expect(screen.getByText("Address")).toBeInTheDocument();
    expect(screen.getByText(/0xabab/)).toBeInTheDocument();
  });

  it("renders full address when truncate is false", () => {
    const address = "0x" + "ab".repeat(20);
    render(<AddressField label="Addr" value={address} truncate={false} />);
    expect(screen.getByText(address)).toBeInTheDocument();
  });
});

describe("StatusBadge", () => {
  it("renders with label", () => {
    render(<StatusBadge label="Valid" />);
    expect(screen.getByText("Valid")).toBeInTheDocument();
  });

  it("renders success variant", () => {
    render(<StatusBadge label="OK" variant="success" />);
    const badge = screen.getByText("OK");
    expect(badge).toHaveClass("bg-green-100");
  });

  it("renders error variant", () => {
    render(<StatusBadge label="Fail" variant="error" />);
    const badge = screen.getByText("Fail");
    expect(badge).toHaveClass("bg-red-100");
  });
});

describe("BalanceCard", () => {
  it("renders balance and network", () => {
    render(<BalanceCard balance="1.5 ETH" network="Hardhat" />);
    expect(screen.getByText("1.5 ETH")).toBeInTheDocument();
    expect(screen.getByText("Hardhat")).toBeInTheDocument();
  });

  it("renders refresh button when onRefresh provided", () => {
    const onRefresh = jest.fn();
    render(<BalanceCard balance="1 ETH" network="Local" onRefresh={onRefresh} />);
    const btn = screen.getByLabelText("Refresh balance");
    expect(btn).toBeInTheDocument();
  });
});
