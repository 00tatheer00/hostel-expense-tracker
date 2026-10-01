"use client";

import * as React from "react";
import { useMonth } from "@/providers/month-provider";
import { Icons } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface MonthSelectorProps {
  compact?: boolean;
  className?: string;
  showAllOption?: boolean;
}

export function MonthSelector({
  compact = false,
  className,
  showAllOption = true,
}: MonthSelectorProps) {
  const { selectedMonth, setSelectedMonth, availableMonths, isLocked } = useMonth();

  const handleSelect = (key: string) => {
    setSelectedMonth(key);
  };

  if (compact) {
    return (
      <div className={cn("relative inline-flex items-center", className)}>
        <select
          value={selectedMonth}
          onChange={(e) => handleSelect(e.target.value)}
          className={cn(
            "h-8 px-2.5 pr-7 text-xs font-bold rounded-lg border transition-all cursor-pointer appearance-none",
            isLocked
              ? "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30"
              : "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30"
          )}
        >
          {availableMonths.map((m) => (
            <option key={m.key} value={m.key} className="bg-background text-foreground">
              {m.key === "2026-10"
                ? "🟢 Oct 2026 (Active)"
                : m.key === "2026-09"
                ? "🔒 Sep 2026 (Locked)"
                : m.key === "2026-08"
                ? "🔒 Aug 2026 (Locked)"
                : m.label}
            </option>
          ))}
          {showAllOption && (
            <option value="all" className="bg-background text-foreground">
              📊 All Time History
            </option>
          )}
        </select>
        <Icons.chevronRight className="absolute right-2 h-3.5 w-3.5 rotate-90 pointer-events-none opacity-60" />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-surface/60 border border-border/60 shadow-xs", className)}>
      <span className="caption text-[11px] font-mono text-muted-foreground px-2 font-semibold">
        Mahina (Month):
      </span>

      {availableMonths.map((m) => {
        const isSelected = selectedMonth === m.key;
        return (
          <button
            key={m.key}
            type="button"
            onClick={() => handleSelect(m.key)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5",
              isSelected
                ? m.isLocked
                  ? "bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-500/40 shadow-sm"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-surface border border-transparent"
            )}
          >
            {m.isLocked ? (
              <Icons.info className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            ) : m.isCurrent ? (
              <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse shrink-0" />
            ) : null}
            <span>
              {m.key === "2026-10"
                ? "October 2026 (Active)"
                : m.key === "2026-09"
                ? "September 2026 (Locked Archive)"
                : m.key === "2026-08"
                ? "August 2026 (Locked Archive)"
                : m.label}
            </span>
          </button>
        );
      })}

      {showAllOption && (
        <button
          type="button"
          onClick={() => handleSelect("all")}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5",
            selectedMonth === "all"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-surface border border-transparent"
          )}
        >
          <Icons.history className="h-3.5 w-3.5 shrink-0" />
          <span>All Time (Mukammal Record)</span>
        </button>
      )}
    </div>
  );
}
