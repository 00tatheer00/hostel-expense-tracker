"use client";

import * as React from "react";
import { SectionCard } from "@/components/common/section-card";
import { DashboardMetrics } from "../hooks/use-dashboard";
import { formatCurrency } from "@/utils/formatters";
import { Icons } from "@/lib/icons";

export interface MonthlySummaryProps {
  metrics: DashboardMetrics;
}

export function MonthlySummary({ metrics }: MonthlySummaryProps) {
  return (
    <SectionCard title="Monthly Summary" description="Overview of monthly room expenses">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-1">
        <div className="space-y-1 p-3 rounded-xl bg-surface/50 border border-border/40">
          <span className="caption text-[10px] uppercase font-mono text-muted-foreground">
            Current Month Spend
          </span>
          <div className="numeric text-lg font-bold text-foreground">
            {formatCurrency(metrics.currentMonthSpend)}
          </div>
        </div>

        <div className="space-y-1 p-3 rounded-xl bg-surface/50 border border-border/40">
          <span className="caption text-[10px] uppercase font-mono text-muted-foreground">
            Average Expense
          </span>
          <div className="numeric text-lg font-bold text-foreground">
            {formatCurrency(metrics.averageExpense)}
          </div>
        </div>

        <div className="space-y-1 p-3 rounded-xl bg-surface/50 border border-border/40">
          <span className="caption text-[10px] uppercase font-mono text-muted-foreground">
            Highest Expense
          </span>
          <div className="numeric text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(metrics.highestExpense)}
          </div>
        </div>

        <div className="space-y-1 p-3 rounded-xl bg-surface/50 border border-border/40">
          <span className="caption text-[10px] uppercase font-mono text-muted-foreground">
            Lowest Expense
          </span>
          <div className="numeric text-lg font-bold text-foreground">
            {formatCurrency(metrics.lowestExpense)}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
