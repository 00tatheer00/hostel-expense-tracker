"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/common/stat-card";
import { formatCurrency } from "@/utils/formatters";
import { staggerContainer, listItemAnimation } from "@/lib/motion";

export interface AnalyticsSummaryCardsProps {
  totalRoomSpend: number;
  currentMonthSpend: number;
  totalExpensesCount: number;
  averageExpense: number;
  highestExpense: number;
}

export function AnalyticsSummaryCards({
  totalRoomSpend,
  currentMonthSpend,
  totalExpensesCount,
  averageExpense,
  highestExpense,
}: AnalyticsSummaryCardsProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <motion.div variants={listItemAnimation}>
        <StatCard
          id="an-1"
          title="Total Room Spending"
          value={formatCurrency(totalRoomSpend)}
          subtitle="Cumulative room expenses"
          icon="wallet"
          variant="default"
        />
      </motion.div>

      <motion.div variants={listItemAnimation}>
        <StatCard
          id="an-2"
          title="Current Month Spend"
          value={formatCurrency(currentMonthSpend)}
          subtitle="Active month expenditures"
          icon="expenses"
          variant="default"
        />
      </motion.div>

      <motion.div variants={listItemAnimation}>
        <StatCard
          id="an-3"
          title="Average Expense"
          value={formatCurrency(averageExpense)}
          subtitle="Per purchase average"
          icon="analytics"
          variant="default"
        />
      </motion.div>

      <motion.div variants={listItemAnimation}>
        <StatCard
          id="an-4"
          title="Total Expenses Count"
          value={`${totalExpensesCount} Entries`}
          subtitle={`Highest purchase: ${formatCurrency(highestExpense)}`}
          icon="building"
          badgeText="Recorded"
          variant="success"
        />
      </motion.div>
    </motion.div>
  );
}
