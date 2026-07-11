/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { TokenDetector } from "@/components/tokens/token-detector";
import { TokenMetadataCard } from "@/components/tokens/token-metadata-card";
import { BalanceLookupCard } from "@/components/tokens/balance-lookup-card";
import { NFTViewer } from "@/components/tokens/nft-viewer";
import { ERC1155Viewer } from "@/components/tokens/erc1155-viewer";
import { RecentTokens } from "@/components/tokens/recent-tokens";
import type { TokenMeta } from "@/types/token";

describe("TokenDetector", () => {
  it("renders with input and button", () => {
    render(<TokenDetector onDetected={() => {}} />);
    expect(screen.getByText("Token Detector")).toBeInTheDocument();
    expect(screen.getByText("Detect Standard")).toBeInTheDocument();
  });

  it("shows placeholder text", () => {
    render(<TokenDetector onDetected={() => {}} />);
    expect(
      screen.getByText(/Enter a contract address/),
    ).toBeInTheDocument();
  });
});

describe("TokenMetadataCard", () => {
  it("shows empty state", () => {
    render(<TokenMetadataCard metadata={null} loading={false} />);
    expect(screen.getByText(/Detect a token/)).toBeInTheDocument();
  });

  it("shows loading state", () => {
    render(<TokenMetadataCard metadata={null} loading={true} />);
    expect(screen.getByText("Loading metadata...")).toBeInTheDocument();
  });

  it("displays metadata", () => {
    const metadata: TokenMeta = {
      name: "Test Token",
      symbol: "TST",
      decimals: 18,
      totalSupply: "1000000",
      standard: "ERC20",
    };
    render(<TokenMetadataCard metadata={metadata} loading={false} />);
    expect(screen.getByText("Test Token")).toBeInTheDocument();
    expect(screen.getByText("TST")).toBeInTheDocument();
    expect(screen.getByText("18")).toBeInTheDocument();
    expect(screen.getByText("1000000")).toBeInTheDocument();
    expect(screen.getByText("ERC20")).toBeInTheDocument();
  });
});

describe("BalanceLookupCard", () => {
  it("shows empty state when no token", () => {
    render(<BalanceLookupCard tokenAddress={null} standard={null} />);
    expect(screen.getByText("Balance Lookup")).toBeInTheDocument();
    expect(screen.getByText("Check Balance")).toBeInTheDocument();
  });

  it("renders wallet input", () => {
    render(<BalanceLookupCard tokenAddress="0x" standard="ERC20" />);
    expect(screen.getByText("Wallet Address")).toBeInTheDocument();
  });
});

describe("NFTViewer", () => {
  it("shows empty state when no token", () => {
    render(<NFTViewer tokenAddress={null} />);
    expect(screen.getByText("NFT Explorer")).toBeInTheDocument();
    expect(screen.getByText(/Detect an ERC-721/)).toBeInTheDocument();
  });

  it("renders token ID input when address provided", () => {
    render(<NFTViewer tokenAddress="0x" />);
    expect(screen.getByText("Token ID")).toBeInTheDocument();
    expect(screen.getByText("Fetch NFT")).toBeInTheDocument();
  });
});

describe("ERC1155Viewer", () => {
  it("shows empty state when no token", () => {
    render(<ERC1155Viewer tokenAddress={null} />);
    expect(screen.getByText("ERC-1155 Explorer")).toBeInTheDocument();
    expect(screen.getByText(/Detect an ERC-1155/)).toBeInTheDocument();
  });

  it("renders form when address provided", () => {
    render(<ERC1155Viewer tokenAddress="0x" />);
    expect(screen.getByText("Wallet Address")).toBeInTheDocument();
    expect(screen.getByText("Token ID")).toBeInTheDocument();
    expect(screen.getByText("Check Balance")).toBeInTheDocument();
  });
});

describe("RecentTokens", () => {
  it("renders history cards", () => {
    render(<RecentTokens />);
    expect(screen.getByText("Recent Tokens")).toBeInTheDocument();
    expect(screen.getByText(/No tokens viewed/)).toBeInTheDocument();
  });
});
