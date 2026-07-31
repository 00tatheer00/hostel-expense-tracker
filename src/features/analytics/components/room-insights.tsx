"use client";

import * as React from "react";
import { SectionCard } from "@/components/common/section-card";
import { RoomAnalytics } from "../hooks/use-analytics";
import { formatCurrency } from "@/utils/formatters";
import { CategoryBadge } from "@/features/expenses/components/category-badge";

export interface RoomInsightsProps {
  analytics: RoomAnalytics;
}

export function RoomInsights({ analytics }: RoomInsightsProps) {
  return (
    <SectionCard title="Room Intelligence" description="Room 304 spending dynamics">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-1">
        <div className="p-3.5 rounded-xl border border-border/60 bg-surface/40 space-y-1">
          <span className="caption text-[10px] uppercase font-mono text-muted-foreground">
            Most Expensive Category
          </span>
          <div>
            <CategoryBadge category={analytics.mostExpensiveCategory} />
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-border/60 bg-surface/40 space-y-1">
          <span className="caption text-[10px] uppercase font-mono text-muted-foreground">
            Least Used Category
          </span>
          <div>
            <CategoryBadge category={analytics.leastUsedCategory} />
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-border/60 bg-surface/40 space-y-1">
          <span className="caption text-[10px] uppercase font-mono text-muted-foreground">
            Average Daily Spend
          </span>
          <div className="numeric text-lg font-bold text-foreground">
            {formatCurrency(analytics.averageDailySpend)}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
