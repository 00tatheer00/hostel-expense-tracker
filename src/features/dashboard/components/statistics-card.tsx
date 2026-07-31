"use client";

import * as React from "react";
import { SectionCard } from "@/components/common/section-card";
import { DashboardMetrics } from "../hooks/use-dashboard";
import { formatCurrency } from "@/utils/formatters";
import { Avatar } from "@/components/ui/avatar";
import { Icons } from "@/lib/icons";

export interface StatisticsCardProps {
  metrics: DashboardMetrics;
}

export function StatisticsCard({ metrics }: StatisticsCardProps) {
  return (
    <SectionCard title="Top Statistics" description="Roommate spending highlights">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-1">
        <div className="flex items-center space-x-3 p-3.5 rounded-xl border border-border/60 bg-surface/40">
          <Avatar name={metrics.highestSpenderName} size="md" />
          <div className="space-y-0.5">
            <span className="caption text-[10px] uppercase font-mono text-muted-foreground">
              Highest Spender
            </span>
            <div className="text-sm font-bold text-foreground">
              {metrics.highestSpenderName}
            </div>
            <div className="numeric text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Paid {formatCurrency(metrics.highestSpenderAmount)} total
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3.5 rounded-xl border border-border/60 bg-surface/40">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20">
            <Icons.receipt className="h-5 w-5" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <span className="caption text-[10px] uppercase font-mono text-muted-foreground">
              Largest Single Expense
            </span>
            <div className="text-sm font-bold text-foreground truncate">
              {metrics.largestExpenseDescription}
            </div>
            <div className="numeric text-xs font-semibold text-primary">
              {formatCurrency(metrics.largestExpenseAmount)}
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
