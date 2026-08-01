"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/common/stat-card";
import { DashboardMetrics } from "../hooks/use-dashboard";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { staggerContainer, listItemAnimation } from "@/lib/motion";

import { siteConfig } from "@/config/site";

export interface SummaryCardsProps {
  metrics: DashboardMetrics;
}

export function SummaryCards({ metrics }: SummaryCardsProps) {
  const lastDateFormatted = metrics.lastExpenseDate
    ? formatDate(metrics.lastExpenseDate)
    : "No expenses yet";

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <motion.div variants={listItemAnimation}>
        <StatCard
          id="m-1"
          title="Current Month Spend"
          value={formatCurrency(metrics.currentMonthSpend)}
          subtitle="Total shared room bills this month"
          icon="wallet"
          variant="default"
        />
      </motion.div>

      <motion.div variants={listItemAnimation}>
        <StatCard
          id="m-2"
          title="Total Recorded Expenses"
          value={`${metrics.totalExpensesCount} Entry${metrics.totalExpensesCount === 1 ? "" : "ies"}`}
          subtitle={`Last entry: ${lastDateFormatted}`}
          icon="expenses"
          variant="default"
        />
      </motion.div>

      <motion.div variants={listItemAnimation}>
        <StatCard
          id="m-3"
          title="Active Roommates"
          value={`${metrics.activeRoommatesCount} Members`}
          subtitle={`${siteConfig.roomNumber} - Equal split`}
          icon="users"
          badgeText="Full Room"
          variant="success"
        />
      </motion.div>

      <motion.div variants={listItemAnimation}>
        <StatCard
          id="m-4"
          title="Average Expense"
          value={formatCurrency(metrics.averageExpense)}
          subtitle="Per purchase average cost"
          icon="analytics"
          variant="default"
        />
      </motion.div>
    </motion.div>
  );
}
