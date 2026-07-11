"use client";

import { useAIStore } from "../stores/ai-store";
import { getAvailableProviders } from "../services/providers";
import type { AIProviderID } from "../types";

export function ProviderSelector() {
  const provider = useAIStore((s) => s.provider);
  const setProvider = useAIStore((s) => s.setProvider);
  const providerConfig = useAIStore((s) => s.providerConfig);
  const setProviderConfig = useAIStore((s) => s.setProviderConfig);
  const providers = getAvailableProviders();

  return (
    <div className="space-y-2">
      <select
        value={provider}
        onChange={(e) => {
          const id = e.target.value as AIProviderID;
          setProvider(id);
          setProviderConfig({ id });
        }}
        className="w-full rounded-md border bg-background px-2 py-1.5 text-xs"
      >
        {providers.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <input
        type="password"
        placeholder="API Key"
        value={providerConfig.apiKey ?? ""}
        onChange={(e) => setProviderConfig({ apiKey: e.target.value })}
        className="w-full rounded-md border bg-background px-2 py-1.5 text-xs"
      />

      <input
        type="text"
        placeholder="Model (e.g. gpt-4o-mini)"
        value={providerConfig.model ?? ""}
        onChange={(e) => setProviderConfig({ model: e.target.value })}
        className="w-full rounded-md border bg-background px-2 py-1.5 text-xs"
      />
    </div>
  );
}
