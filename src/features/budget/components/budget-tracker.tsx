"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SectionCard } from "@/components/common/section-card";
import { formatCurrency } from "@/utils/formatters";
import { calculatePercentage } from "@/utils/calc-utils";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/lib/icons";

export interface BudgetTrackerProps {
  currentMonthSpend: number;
}

export function BudgetTracker({ currentMonthSpend }: BudgetTrackerProps) {
  const [monthlyBudget, setMonthlyBudget] = React.useState<number>(40000);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [inputBudget, setInputBudget] = React.useState<string>("40000");

  const percentageUsed = calculatePercentage(currentMonthSpend, monthlyBudget);
  const remaining = Math.max(0, monthlyBudget - currentMonthSpend);

  const isOverBudget = currentMonthSpend >= monthlyBudget;
  const isWarning = percentageUsed >= 80 && !isOverBudget;

  const handleSaveBudget = () => {
    const val = parseFloat(inputBudget);
    if (!isNaN(val) && val > 0) {
      setMonthlyBudget(val);
    }
    setIsEditing(false);
  };

  return (
    <SectionCard
      title="Monthly Room Budget Tracker"
      description="Monitor shared hostel budget limits and threshold alerts"
      action={
        <div className="flex items-center space-x-2">
          {isOverBudget && (
            <Badge variant="danger" className="text-[10px] font-mono gap-1">
              <Icons.alertCircle className="h-3 w-3" />
              <span>Budget Exceeded (100%+)</span>
            </Badge>
          )}
          {isWarning && (
            <Badge variant="warning" className="text-[10px] font-mono gap-1">
              <Icons.info className="h-3 w-3" />
              <span>Warning (80%+ Used)</span>
            </Badge>
          )}
          {!isOverBudget && !isWarning && (
            <Badge variant="success" className="text-[10px] font-mono">
              On Track ({percentageUsed}%)
            </Badge>
          )}
        </div>
      }
    >
      <div className="space-y-4 p-1">
        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-muted-foreground font-mono">
              Spent: <strong className="text-foreground">{formatCurrency(currentMonthSpend)}</strong>
            </span>
            <span className="text-muted-foreground font-mono">
              Budget Target:{" "}
              {isEditing ? (
                <span className="inline-flex items-center space-x-1">
                  <input
                    type="number"
                    value={inputBudget}
                    onChange={(e) => setInputBudget(e.target.value)}
                    className="w-20 h-6 px-1 text-xs border rounded bg-background text-foreground"
                  />
                  <button
                    onClick={handleSaveBudget}
                    className="text-xs text-emerald-600 font-bold"
                  >
                    Save
                  </button>
                </span>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="hover:underline font-bold text-foreground"
                  title="Click to edit budget"
                >
                  {formatCurrency(monthlyBudget)}
                </button>
              )}
            </span>
          </div>

          <div className="h-3 w-full rounded-full bg-surface overflow-hidden border border-border/40">
            <motion.div
              className={`h-full rounded-full transition-colors ${
                isOverBudget
                  ? "bg-rose-500"
                  : isWarning
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(percentageUsed, 100)}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Budget Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-surface/50 border border-border/40 space-y-0.5">
            <span className="caption text-[10px] uppercase font-mono text-muted-foreground">
              Budget Limit
            </span>
            <div className="numeric text-base font-bold text-foreground">
              {formatCurrency(monthlyBudget)}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface/50 border border-border/40 space-y-0.5">
            <span className="caption text-[10px] uppercase font-mono text-muted-foreground">
              Spent This Month
            </span>
            <div className="numeric text-base font-bold text-foreground">
              {formatCurrency(currentMonthSpend)}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface/50 border border-border/40 space-y-0.5">
            <span className="caption text-[10px] uppercase font-mono text-muted-foreground">
              Remaining Budget
            </span>
            <div
              className={`numeric text-base font-bold ${
                isOverBudget
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {formatCurrency(remaining)}
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
