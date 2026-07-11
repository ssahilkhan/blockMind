import { apiClient } from "@/lib/api-client";
import type { HealthResponse } from "@/types/api";

export const healthApi = {
  getHealth: () => apiClient<HealthResponse>("/health"),
};
