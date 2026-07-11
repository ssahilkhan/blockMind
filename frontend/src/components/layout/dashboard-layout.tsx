"use client";

import { Providers } from "@/components/providers";
import { AppShell } from "@/components/layout";
import { ErrorBoundary } from "@/components/common";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <ErrorBoundary>
        <AppShell>{children}</AppShell>
      </ErrorBoundary>
    </Providers>
  );
}
