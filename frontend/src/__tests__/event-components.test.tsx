/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { SearchBar } from "@/components/events/search-bar";
import { FilterPanel } from "@/components/events/filter-panel";
import { StatsCards } from "@/components/events/stats-cards";
import { RegistryTable } from "@/components/events/registry-table";
import { RecentEvents } from "@/components/events/recent-events";
import type { RegistryEntry } from "@/types/events";

describe("SearchBar", () => {
  it("renders search form", () => {
    render(<SearchBar onSearch={() => {}} isLoading={false} />);
    expect(screen.getByText("Search Events")).toBeInTheDocument();
    expect(screen.getByText("Search")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    render(<SearchBar onSearch={() => {}} isLoading={true} />);
    expect(screen.getByText("Search")).toBeInTheDocument();
  });
});

describe("FilterPanel", () => {
  it("renders filters", () => {
    render(
      <FilterPanel
        onFilterRange={() => {}}
        onFilterStandard={() => {}}
        activeStandard={null}
        isLoading={false}
      />,
    );
    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("ERC20")).toBeInTheDocument();
    expect(screen.getByText("ERC721")).toBeInTheDocument();
    expect(screen.getByText("ERC1155")).toBeInTheDocument();
    expect(screen.getByText("Custom")).toBeInTheDocument();
    expect(screen.getByText("Load Range")).toBeInTheDocument();
  });
});

describe("StatsCards", () => {
  it("renders all stat cards", () => {
    render(
      <StatsCards total={10} erc20={5} erc721={3} erc1155={1} custom={1} />,
    );
    expect(screen.getByText("Events Loaded")).toBeInTheDocument();
    expect(screen.getByText("ERC-20 Events")).toBeInTheDocument();
    expect(screen.getByText("ERC-721 Events")).toBeInTheDocument();
    expect(screen.getByText("ERC-1155 Events")).toBeInTheDocument();
    expect(screen.getByText("Custom Events")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });
});

describe("RegistryTable", () => {
  it("shows loading state", () => {
    render(<RegistryTable entries={[]} loading={true} />);
    expect(screen.getByText("Loading registry...")).toBeInTheDocument();
  });

  it("shows empty state", () => {
    render(<RegistryTable entries={[]} loading={false} />);
    expect(screen.getByText("No registered events found.")).toBeInTheDocument();
  });

  it("renders grouped entries with count", () => {
    const entries: RegistryEntry[] = [
      { signature: "ERC20:Transfer", name: "Transfer", standard: "ERC20" },
      { signature: "ERC20:Approval", name: "Approval", standard: "ERC20" },
      { signature: "ERC721:Transfer", name: "Transfer", standard: "ERC721" },
    ];
    render(<RegistryTable entries={entries} loading={false} />);
    expect(screen.getByText("Event Registry")).toBeInTheDocument();
    expect(screen.getByText(/\(3 total\)/)).toBeInTheDocument();
    expect(screen.getAllByText("Transfer").length).toBeGreaterThanOrEqual(2);
  });
});

describe("RecentEvents", () => {
  it("shows empty state", () => {
    render(<RecentEvents />);
    expect(screen.getByText("Session History")).toBeInTheDocument();
    expect(screen.getByText(/No events viewed/)).toBeInTheDocument();
  });
});
