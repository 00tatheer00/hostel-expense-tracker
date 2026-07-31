"use client";

import * as React from "react";
import { Icons } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface SearchBarProps {
  value: string;
  onChange: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search expenses by description, category, payer, or note...",
  className,
}: SearchBarProps) {
  return (
    <div className={cn("relative flex-1", className)}>
      <Icons.info className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-9 pr-9 text-xs sm:text-sm rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground p-0.5 rounded-md"
          title="Clear search"
        >
          <Icons.logout className="h-3.5 w-3.5" />
          <span className="sr-only">Clear search</span>
        </button>
      )}
    </div>
  );
}
