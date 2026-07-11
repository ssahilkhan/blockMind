"use client";

import { CopyButton } from "./copy-button";
import { cn } from "@/lib/utils";

interface AddressFieldProps {
  label: string;
  value: string;
  truncate?: boolean;
  className?: string;
}

export function AddressField({
  label,
  value,
  truncate = true,
  className,
}: AddressFieldProps) {
  const displayValue = truncate && value.length > 20
    ? `${value.slice(0, 10)}...${value.slice(-8)}`
    : value;

  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2">
        <code className="flex-1 rounded bg-muted px-2 py-1 font-mono text-xs break-all">
          {displayValue}
        </code>
        <CopyButton value={value} />
      </div>
    </div>
  );
}
