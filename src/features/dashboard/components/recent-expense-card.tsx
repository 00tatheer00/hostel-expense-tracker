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
        className="group flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-border/60 bg-card hover:bg-surface/60 transition-all shadow-subtle"
      >
        <div className="flex items-center space-x-3.5 min-w-0">
          <Avatar name={payerName} size="sm" />
          <div className="space-y-1 truncate">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-foreground truncate">
                {expense.description}
              </span>
              <CategoryBadge category={expense.category} />
            </div>
            <p className="caption text-[11px] text-muted-foreground">
              Paid by <strong className="text-foreground">{payerName}</strong> • {formatDate(expense.created_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0 pl-2">
          <span className="numeric text-sm sm:text-base font-bold text-foreground">
            {formatCurrency(Number(expense.amount))}
          </span>
          <Icons.chevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
        </div>
      </Link>
    </motion.div>
  );
}
