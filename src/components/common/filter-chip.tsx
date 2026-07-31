"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface FilterChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function FilterChip({
  label,
  isActive,
  onClick,
  icon,
  className,
}: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 select-none whitespace-nowrap",
        isActive
          ? "border-primary bg-primary text-primary-foreground shadow-subtle font-semibold"
          : "border-border/60 bg-surface/50 text-muted-foreground hover:bg-surface hover:text-foreground",
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
    </button>
  );
}
