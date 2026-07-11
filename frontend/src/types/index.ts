export type HealthStatus = "healthy" | "degraded" | "unhealthy";

export type SidebarItem = {
  label: string;
  href: string;
  icon: string;
};

export type AppState = {
  currentNetwork: {
    chainId: number;
    name: string;
    currency: string;
  } | null;
  backendHealth: HealthStatus;
  sidebarCollapsed: boolean;
  setCurrentNetwork: (network: AppState["currentNetwork"]) => void;
  setBackendHealth: (health: HealthStatus) => void;
  toggleSidebar: () => void;
};
