"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SectionCard } from "@/components/common/section-card";
import { CategoryBreakdownItem } from "../hooks/use-analytics";
import { CategoryBadge } from "@/features/expenses/components/category-badge";
import { formatCurrency } from "@/utils/formatters";

export interface CategoryChartProps {
  categories: CategoryBreakdownItem[];
}

export function CategoryChart({ categories }: CategoryChartProps) {
  const barColors: Record<string, string> = {
    Food: "bg-emerald-500",
    Rent: "bg-blue-500",
    Electricity: "bg-amber-500",
    Internet: "bg-purple-500",
    Other: "bg-stone-500",
  };

  return (
    <SectionCard
      title="Category Breakdown"
      description="Distribution of room spending across categories"
    >
      <div className="space-y-4 p-1">
        {categories.map((item) => {
          const colorClass = barColors[item.category] || "bg-primary";

          return (
            <div key={item.category} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <CategoryBadge category={item.category} />
                  <span className="caption text-xs text-muted-foreground font-mono">
                    ({item.count} purchase{item.count === 1 ? "" : "s"})
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="numeric font-bold text-foreground">
                    {formatCurrency(item.amount)}
                  </span>
                  <span className="caption font-mono font-semibold text-muted-foreground w-12 text-right">
                    {item.percentage}%
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full rounded-full bg-surface overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${colorClass}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(item.percentage, item.amount > 0 ? 3 : 0)}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
