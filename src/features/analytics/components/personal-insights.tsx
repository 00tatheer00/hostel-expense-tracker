"use client";

import * as React from "react";
import { SectionCard } from "@/components/common/section-card";
import { PersonalAnalytics } from "../hooks/use-analytics";
import { formatCurrency } from "@/utils/formatters";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export interface PersonalInsightsProps {
  analytics: PersonalAnalytics;
}

export function PersonalInsights({ analytics }: PersonalInsightsProps) {
  const isPositive = analytics.netBalance > 0.01;
  const isNegative = analytics.netBalance < -0.01;

  return (
    <SectionCard
      title="Personal Contribution Insights"
      description={`Analytics summary for ${analytics.name}`}
      action={
        <div className="flex items-center space-x-2">
          <Avatar name={analytics.name} size="sm" />
          <Badge variant={isPositive ? "success" : isNegative ? "danger" : "outline"} className="text-[10px] font-mono">
            {isPositive ? "Gets Back" : isNegative ? "Owes Dues" : "Settled"}
          </Badge>
        </div>
      }
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-1">
        <div className="p-3 rounded-xl bg-surface/50 border border-border/40 space-y-0.5">
          <span className="caption text-[10px] uppercase font-mono text-muted-foreground">
            Total Paid Out
          </span>
          <div className="numeric text-lg font-bold text-foreground">
            {formatCurrency(analytics.totalPaid)}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-surface/50 border border-border/40 space-y-0.5">
          <span className="caption text-[10px] uppercase font-mono text-muted-foreground">
            Total Dues Owed
          </span>
          <div className="numeric text-lg font-bold text-rose-600 dark:text-rose-400">
            {formatCurrency(analytics.totalOwes)}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-surface/50 border border-border/40 space-y-0.5">
          <span className="caption text-[10px] uppercase font-mono text-muted-foreground">
            Receivables
          </span>
          <div className="numeric text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(analytics.totalReceives)}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-surface/50 border border-border/40 space-y-0.5">
          <span className="caption text-[10px] uppercase font-mono text-muted-foreground">
            Net Share Balance
          </span>
          <div className="numeric text-lg font-bold text-foreground">
            {formatCurrency(analytics.netBalance)}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-surface/50 border border-border/40 space-y-0.5">
          <span className="caption text-[10px] uppercase font-mono text-muted-foreground">
            Expenses Added
          </span>
          <div className="numeric text-lg font-bold text-foreground font-mono">
            {analytics.expensesAddedCount}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-surface/50 border border-border/40 space-y-0.5">
          <span className="caption text-[10px] uppercase font-mono text-muted-foreground">
            Personal Average
          </span>
          <div className="numeric text-lg font-bold text-foreground">
            {formatCurrency(analytics.averageExpense)}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
