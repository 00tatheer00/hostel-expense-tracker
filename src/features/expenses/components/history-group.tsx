"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ExpenseCard } from "./expense-card";
import { ExpenseWithSplits } from "@/types/database";
import { staggerContainer, listItemAnimation } from "@/lib/motion";

export interface HistoryGroupProps {
  expenses: ExpenseWithSplits[];
}

export function HistoryGroup({ expenses }: HistoryGroupProps) {
  // Helper to categorize transaction date into timeline buckets
  const groupExpenses = React.useMemo(() => {
    const now = new Date();
    const todayStr = now.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    const groups: Record<string, ExpenseWithSplits[]> = {
      Today: [],
      Yesterday: [],
      "This Week": [],
      "This Month": [],
      Older: [],
    };

    expenses.forEach((exp) => {
      const expDate = new Date(exp.created_at);
      const expDateStr = expDate.toDateString();

      const diffTime = Math.abs(now.getTime() - expDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (expDateStr === todayStr) {
        groups.Today.push(exp);
      } else if (expDateStr === yesterdayStr) {
        groups.Yesterday.push(exp);
      } else if (diffDays <= 7) {
        groups["This Week"].push(exp);
      } else if (expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear()) {
        groups["This Month"].push(exp);
      } else {
        groups.Older.push(exp);
      }
    });

    return Object.entries(groups).filter(([_, items]) => items.length > 0);
  }, [expenses]);

  return (
    <div className="space-y-6">
      {groupExpenses.map(([groupTitle, groupItems]) => (
        <div key={groupTitle} className="space-y-3">
          <div className="flex items-center space-x-2 py-1">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {groupTitle}
            </h4>
            <div className="flex-1 border-t border-border/40" />
            <span className="caption text-[11px] font-mono text-muted-foreground">
              {groupItems.length} item{groupItems.length === 1 ? "" : "s"}
            </span>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {groupItems.map((expense) => (
              <motion.div key={expense.id} variants={listItemAnimation}>
                <ExpenseCard expense={expense} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      ))}
    </div>
  );
}
