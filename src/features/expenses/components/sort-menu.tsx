"use client";

import * as React from "react";
import { Icons } from "@/lib/icons";

export type SortOption = "newest" | "oldest" | "highest" | "lowest" | "alphabetical";

export interface SortMenuProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
}

export function SortMenu({ value, onChange }: SortMenuProps) {
  return (
    <div className="flex items-center space-x-2 shrink-0">
      <span className="caption text-xs font-mono text-muted-foreground hidden sm:inline-block">
        Sort:
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="h-10 px-3 py-1 text-xs font-medium rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="highest">Highest Amount</option>
        <option value="lowest">Lowest Amount</option>
        <option value="alphabetical">Alphabetical (A-Z)</option>
      </select>
    </div>
  );
}
