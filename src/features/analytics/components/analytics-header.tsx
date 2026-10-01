"use client";

import * as React from "react";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/lib/icons";
import { MonthSelector } from "@/components/common/month-selector";
import { useMonth } from "@/providers/month-provider";

export function AnalyticsHeader() {
  const { isLocked, selectedMonth, monthLabel } = useMonth();

  return (
    <PageHeader
      title="Expense Analytics & Trends"
      subtitle="Visual insights, monthly spending comparisons, and category breakdowns for Room 14."
      badge={
        isLocked ? (
          <Badge variant="warning" className="font-mono text-xs gap-1 bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-500/40">
            <span>🔒 {monthLabel}</span>
          </Badge>
        ) : (
          <Badge variant="outline" className="font-mono text-xs gap-1">
            <Icons.analytics className="h-3 w-3 text-muted-foreground" />
            <span>{selectedMonth === "all" ? "All Time Records" : "October 2026 Live Insights"}</span>
          </Badge>
        )
      }
      action={
        <div className="flex items-center space-x-2">
          <MonthSelector compact />
        </div>
      }
    />
  );
}
