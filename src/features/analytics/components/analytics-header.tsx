"use client";

import * as React from "react";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/lib/icons";

export interface AnalyticsHeaderProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export function AnalyticsHeader({
  selectedMonth,
  onMonthChange,
}: AnalyticsHeaderProps) {
  return (
    <PageHeader
      title="Expense Analytics"
      subtitle="Visual insights, monthly spending trends, and category breakdowns for Room 304."
      badge={
        <Badge variant="outline" className="font-mono text-xs gap-1">
          <Icons.analytics className="h-3 w-3 text-muted-foreground" />
          <span>Real-time Insights</span>
        </Badge>
      }
      action={
        <div className="flex items-center space-x-2">
          <span className="caption text-xs font-mono text-muted-foreground">Period:</span>
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="h-9 px-3 py-1 text-xs font-medium rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="current">Current Month (July 2026)</option>
            <option value="previous">Previous Month (June 2026)</option>
            <option value="all">All Time History</option>
          </select>
        </div>
      }
    />
  );
}
