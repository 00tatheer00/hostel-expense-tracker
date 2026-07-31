"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SectionCard } from "@/components/common/section-card";
import { MonthlyDelta } from "../hooks/use-analytics";
import { formatCurrency } from "@/utils/formatters";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/lib/icons";

export interface MonthlyComparisonProps {
  delta: MonthlyDelta;
}

export function MonthlyComparison({ delta }: MonthlyComparisonProps) {
  const { thisMonthSpend, lastMonthSpend, percentageChange, isIncrease } = delta;

  return (
    <SectionCard
      title="Monthly Comparison"
      description="This Month vs Last Month spending trend"
      action={
        <Badge
          variant={isIncrease ? "danger" : "success"}
          className="gap-1 font-mono text-xs font-semibold py-0.5 px-2.5"
        >
          {isIncrease ? (
            <Icons.arrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <Icons.arrowDownLeft className="h-3.5 w-3.5" />
          )}
          <span>
            {isIncrease ? "+" : "-"}
            {percentageChange}% {isIncrease ? "Increase" : "Decrease"}
          </span>
        </Badge>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-1">
        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 rounded-xl border border-primary/20 bg-primary/5 dark:bg-primary/10 space-y-1"
        >
          <span className="caption text-xs uppercase font-mono text-muted-foreground">
            This Month (July 2026)
          </span>
          <div className="numeric text-2xl sm:text-3xl font-bold text-foreground">
            {formatCurrency(thisMonthSpend)}
          </div>
          <p className="caption text-[11px] text-muted-foreground">
            Active month shared hostel room bills
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="p-4 rounded-xl border border-border/60 bg-surface/40 space-y-1"
        >
          <span className="caption text-xs uppercase font-mono text-muted-foreground">
            Last Month (June 2026)
          </span>
          <div className="numeric text-2xl sm:text-3xl font-bold text-muted-foreground">
            {formatCurrency(lastMonthSpend)}
          </div>
          <p className="caption text-[11px] text-muted-foreground">
            Previous month total expenditures
          </p>
        </motion.div>
      </div>
    </SectionCard>
  );
}
