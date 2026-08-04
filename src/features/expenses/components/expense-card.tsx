"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ExpenseWithSplits } from "@/types/database";
import { CategoryBadge } from "./category-badge";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Icons } from "@/lib/icons";
import { Button } from "@/components/ui/button";

export interface ExpenseCardProps {
  expense: ExpenseWithSplits;
  isPinned?: boolean;
  onTogglePin?: (id: string) => void;
}

export function ExpenseCard({ expense, isPinned = false, onTogglePin }: ExpenseCardProps) {
  const payerName = expense.payer?.name || "Roommate";
  const splitCount = expense.splits?.length || 0;

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
      <div className="group relative flex flex-col justify-between p-4 rounded-xl border border-border/70 bg-card hover:bg-surface/50 transition-all shadow-subtle space-y-3">
        <div className="flex items-start justify-between gap-2.5">
          {/* Avatar & Main Details */}
          <div className="flex items-start space-x-3 min-w-0 flex-1">
            <Avatar name={payerName} size="md" className="shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <Link
                  href={`/expenses/${expense.id}`}
                  className="font-heading text-sm font-bold text-foreground hover:underline break-words line-clamp-2"
                >
                  {expense.description}
                </Link>
                <CategoryBadge category={expense.category} className="shrink-0" />
              </div>
              <p className="caption text-xs text-muted-foreground break-words">
                Paid by <strong className="text-foreground">{payerName}</strong> • {formatDate(expense.created_at)}
              </p>
            </div>
          </div>

          {/* Amount & Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0 text-right">
            <span className="numeric text-base sm:text-lg font-bold text-foreground whitespace-nowrap">
              {formatCurrency(Number(expense.amount))}
            </span>

            {/* Quick Actions Menu */}
            <div className="flex items-center space-x-1">
              {/* Duplicate Button */}
              <Link
                href={`/expenses/new?desc=${encodeURIComponent(expense.description)}&cat=${expense.category}&amt=${expense.amount}`}
                title="Duplicate Expense"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                >
                  <Icons.plus className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs text-muted-foreground">
          <span className="font-mono">
            Split between {splitCount} roommate{splitCount === 1 ? "" : "s"}
          </span>

          <Link
            href={`/expenses/${expense.id}`}
            className="inline-flex items-center space-x-1 font-semibold text-primary hover:underline"
          >
            <span>Details</span>
            <Icons.chevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
