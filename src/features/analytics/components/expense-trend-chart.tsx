"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SectionCard } from "@/components/common/section-card";
import { CategoryBreakdownItem } from "../hooks/use-analytics";
import { formatCurrency } from "@/utils/formatters";

export interface ExpenseTrendChartProps {
  categories: CategoryBreakdownItem[];
}

export function ExpenseTrendChart({ categories }: ExpenseTrendChartProps) {
  const maxAmount = Math.max(...categories.map((c) => c.amount), 1);

  const barColors: Record<string, string> = {
    Food: "bg-emerald-500 hover:bg-emerald-600",
    Rent: "bg-blue-500 hover:bg-blue-600",
    Electricity: "bg-amber-500 hover:bg-amber-600",
    Internet: "bg-purple-500 hover:bg-purple-600",
    Other: "bg-stone-500 hover:bg-stone-600",
  };

  return (
    <SectionCard
      title="Expense Distribution Bar Chart"
      description="Visual proportion of room expenses"
    >
      <div className="pt-4 pb-2">
        <div className="h-44 flex items-end justify-between gap-3 border-b border-border/60 px-2 pb-2">
          {categories.map((cat) => {
            const heightPercent = Math.max(Math.round((cat.amount / maxAmount) * 100), cat.amount > 0 ? 8 : 2);
            const colorClass = barColors[cat.category] || "bg-primary";

            return (
              <div key={cat.category} className="flex-1 flex flex-col items-center group h-full justify-end">
                {/* Tooltip value */}
                <span className="numeric text-[10px] font-mono font-semibold text-muted-foreground opacity-80 group-hover:opacity-100 mb-1 transition-opacity">
                  {formatCurrency(cat.amount)}
                </span>

                {/* Animated Column Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`w-full rounded-t-lg transition-colors shadow-subtle ${colorClass}`}
                />
              </div>
            );
          })}
        </div>

        {/* X Axis Labels */}
        <div className="flex justify-between gap-3 pt-2 px-2">
          {categories.map((cat) => (
            <span
              key={cat.category}
              className="flex-1 text-center caption text-[11px] font-medium font-mono text-muted-foreground truncate"
            >
              {cat.category}
            </span>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
