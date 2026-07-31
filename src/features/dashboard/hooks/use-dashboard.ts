"use client";

import * as React from "react";
import { useExpenses } from "@/features/expenses/hooks/use-expenses";
import { BalanceService } from "@/services/balance.service";
import { sortBalancesByNet } from "@/utils/calc-utils";
import { ExpenseWithSplits, UserBalanceSummary } from "@/types/database";

export interface DashboardMetrics {
  currentMonthSpend: number;
  totalExpensesCount: number;
  activeRoommatesCount: number;
  lastExpenseDate: string | null;
  averageExpense: number;
  highestExpense: number;
  lowestExpense: number;
  highestSpenderName: string;
  highestSpenderAmount: number;
  largestExpenseDescription: string;
  largestExpenseAmount: number;
}

export function useDashboard() {
  const { expenses, roommates, roomBalances, isLoading } = useExpenses();
  const balanceService = React.useMemo(() => new BalanceService(), []);

  // Sorted room balances: Creditors first, debtors last
  const sortedBalances = React.useMemo(() => {
    return sortBalancesByNet(roomBalances);
  }, [roomBalances]);

  // Recent 10 expenses
  const recentExpenses = React.useMemo(() => {
    return [...expenses].slice(0, 10);
  }, [expenses]);

  // Comprehensive Room & Monthly Metrics
  const metrics: DashboardMetrics = React.useMemo(() => {
    const totalCount = expenses.length;

    if (totalCount === 0) {
      return {
        currentMonthSpend: 0,
        totalExpensesCount: 0,
        activeRoommatesCount: roommates.length,
        lastExpenseDate: null,
        averageExpense: 0,
        highestExpense: 0,
        lowestExpense: 0,
        highestSpenderName: "None",
        highestSpenderAmount: 0,
        largestExpenseDescription: "None",
        largestExpenseAmount: 0,
      };
    }

    const currentMonthSpend = balanceService.calculateMonthlySpent(
      expenses.map((e) => ({
        id: e.id,
        amount: e.amount,
        description: e.description,
        category: e.category,
        paid_by: e.paid_by,
        created_at: e.created_at,
      }))
    );

    const amounts = expenses.map((e) => Number(e.amount));
    const totalSum = amounts.reduce((a, b) => a + b, 0);
    const averageExpense = Math.round((totalSum / totalCount) * 100) / 100;
    const highestExpense = Math.max(...amounts);
    const lowestExpense = Math.min(...amounts);

    // Largest Expense
    const largestExp = expenses.reduce(
      (max, curr) => (Number(curr.amount) > Number(max.amount) ? curr : max),
      expenses[0]
    );

    // Top Spender
    const spenderTotals: Record<string, number> = {};
    expenses.forEach((e) => {
      const payerId = e.paid_by;
      spenderTotals[payerId] = (spenderTotals[payerId] || 0) + Number(e.amount);
    });

    let topSpenderId = "";
    let maxSpent = 0;
    Object.entries(spenderTotals).forEach(([pId, amt]) => {
      if (amt > maxSpent) {
        maxSpent = amt;
        topSpenderId = pId;
      }
    });

    const topSpenderObj = roommates.find((r) => r.id === topSpenderId);

    return {
      currentMonthSpend,
      totalExpensesCount: totalCount,
      activeRoommatesCount: roommates.length,
      lastExpenseDate: expenses[0]?.created_at || null,
      averageExpense,
      highestExpense,
      lowestExpense,
      highestSpenderName: topSpenderObj?.name || "Roommate",
      highestSpenderAmount: maxSpent,
      largestExpenseDescription: largestExp.description,
      largestExpenseAmount: Number(largestExp.amount),
    };
  }, [expenses, roommates, balanceService]);

  return {
    expenses,
    recentExpenses,
    roommates,
    sortedBalances,
    metrics,
    isLoading,
  };
}
