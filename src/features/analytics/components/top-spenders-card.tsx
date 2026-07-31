"use client";

import * as React from "react";
import { SectionCard } from "@/components/common/section-card";
import { DashboardMetrics } from "@/features/dashboard/hooks/use-dashboard";
import { formatCurrency } from "@/utils/formatters";
import { Avatar } from "@/components/ui/avatar";

export interface TopSpendersCardProps {
  highestSpenderName: string;
  highestSpenderAmount: number;
  largestExpenseDescription: string;
  largestExpenseAmount: number;
}

export function TopSpendersCard({
  highestSpenderName,
  highestSpenderAmount,
  largestExpenseDescription,
  largestExpenseAmount,
}: TopSpendersCardProps) {
  return (
    <SectionCard title="Top Spenders & Rankings" description="Roommate contribution leaders">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-1">
        <div className="flex items-center space-x-3 p-3.5 rounded-xl border border-border/60 bg-surface/40">
          <Avatar name={highestSpenderName} size="md" />
          <div className="space-y-0.5">
            <span className="caption text-[10px] uppercase font-mono text-muted-foreground">
              Highest Spender
            </span>
            <div className="text-sm font-bold text-foreground">
              {highestSpenderName}
            </div>
            <div className="numeric text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Paid {formatCurrency(highestSpenderAmount)}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3.5 rounded-xl border border-border/60 bg-surface/40">
          <Avatar name={largestExpenseDescription} size="md" />
          <div className="space-y-0.5 min-w-0">
            <span className="caption text-[10px] uppercase font-mono text-muted-foreground">
              Largest Purchase
            </span>
            <div className="text-sm font-bold text-foreground truncate">
              {largestExpenseDescription}
            </div>
            <div className="numeric text-xs font-semibold text-primary">
              {formatCurrency(largestExpenseAmount)}
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
