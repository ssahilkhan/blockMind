"use client";

import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

export function LoadingSpinner({ text, className }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 ${className ?? ""}`}>
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      {text && (
        <p className="mt-3 text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
}
