"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExpenseWithSplits } from "@/types/database";
import { CategoryBadge } from "@/features/expenses/components/category-badge";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Icons } from "@/lib/icons";

export function RecentExpenseCard({ expense }: { expense: ExpenseWithSplits }) {
  const payerName = expense.payer?.name || "Roommate";

  return (
    <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.15 }}>
      <Link
        href={`/expenses/${expense.id}`}
        className="group flex items-start justify-between p-3.5 sm:p-4 rounded-xl border border-border/60 bg-card hover:bg-surface/60 transition-all shadow-subtle gap-2.5"
      >
        <div className="flex items-start space-x-3 min-w-0 flex-1">
          <Avatar name={payerName} size="sm" className="shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-foreground line-clamp-2 break-words">
                {expense.description}
              </span>
              <CategoryBadge category={expense.category} className="shrink-0" />
            </div>
            <p className="caption text-[11px] text-muted-foreground break-words">
              Paid by <strong className="text-foreground">{payerName}</strong> • {formatDate(expense.created_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0 pl-1 pt-0.5">
          <span className="numeric text-sm sm:text-base font-bold text-foreground whitespace-nowrap">
            {formatCurrency(Number(expense.amount))}
          </span>
          <Icons.chevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
        </div>
      </Link>
    </motion.div>
  );
}
