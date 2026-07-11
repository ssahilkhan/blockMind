export type HealthStatus = "healthy" | "degraded" | "unhealthy";

export type SidebarItem = {
  label: string;
  href: string;
  icon: string;
};

export type CurrentNetwork = {
  chainId: number;
  name: string;
  currency: string;
} | null;

export type AppState = {
  currentNetwork: CurrentNetwork;
  backendHealth: HealthStatus;
  sidebarCollapsed: boolean;
  setCurrentNetwork: (network: CurrentNetwork) => void;
  setBackendHealth: (health: HealthStatus) => void;
  toggleSidebar: () => void;
};
