/**
 * @jest-environment jsdom
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import { useAppStore } from "@/stores/app-store";

beforeEach(() => {
  useAppStore.setState({
    currentNetwork: null,
    backendHealth: "healthy",
    sidebarCollapsed: false,
  });
});

describe("AppStore", () => {
  it("has default state", () => {
    const state = useAppStore.getState();
    expect(state.backendHealth).toBe("healthy");
    expect(state.sidebarCollapsed).toBe(false);
    expect(state.currentNetwork).toBeNull();
  });

  it("toggles sidebar", () => {
    const { toggleSidebar } = useAppStore.getState();
    toggleSidebar();
    expect(useAppStore.getState().sidebarCollapsed).toBe(true);
    toggleSidebar();
    expect(useAppStore.getState().sidebarCollapsed).toBe(false);
  });

  it("sets backend health", () => {
    const { setBackendHealth } = useAppStore.getState();
    setBackendHealth("unhealthy");
    expect(useAppStore.getState().backendHealth).toBe("unhealthy");
  });

  it("sets current network", () => {
    const { setCurrentNetwork } = useAppStore.getState();
    setCurrentNetwork({ chainId: 31337, name: "Hardhat", currency: "ETH" });
    expect(useAppStore.getState().currentNetwork?.name).toBe("Hardhat");
  });
});
