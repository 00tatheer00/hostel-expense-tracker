"use client";

import * as React from "react";
import { useExpenses } from "@/features/expenses/hooks/use-expenses";
import { useAuth } from "@/hooks/use-auth";
import { BalanceService } from "@/services/balance.service";
import { ExpenseCategory, ExpenseWithSplits } from "@/types/database";
import { calculatePercentage } from "@/utils/calc-utils";

export interface CategoryBreakdownItem {
  category: ExpenseCategory;
  amount: number;
  percentage: number;
  count: number;
}

export interface MonthlyDelta {
  thisMonthSpend: number;
  lastMonthSpend: number;
  percentageChange: number;
  isIncrease: boolean;
}

export interface PersonalAnalytics {
  name: string;
  totalPaid: number;
  totalOwes: number;
  totalReceives: number;
  netBalance: number;
  expensesAddedCount: number;
  averageExpense: number;
}

export interface RoomAnalytics {
  mostExpensiveCategory: ExpenseCategory;
  leastUsedCategory: ExpenseCategory;
  averageDailySpend: number;
  totalExpensesCount: number;
}

export function useAnalytics() {
  const { expenses, roommates, roomBalances, isLoading } = useExpenses();
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = React.useState<string>("current");
  const balanceService = React.useMemo(() => new BalanceService(), []);

  // Total Room Spend
  const totalRoomSpend = React.useMemo(() => {
    return balanceService.calculateTotalSpent(expenses);
  }, [expenses, balanceService]);

  // Current Month Spend
  const currentMonthSpend = React.useMemo(() => {
    return balanceService.calculateMonthlySpent(expenses);
  }, [expenses, balanceService]);

  // Last Month Spend & Comparison Delta
  const monthlyDelta: MonthlyDelta = React.useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const lastMonthIndex = currentMonth === 0 ? 11 : currentMonth - 1;

    const lastMonthSpend = balanceService.calculateMonthlySpent(
      expenses,
      lastMonthYear,
      lastMonthIndex
    );

    let percentageChange = 0;
    if (lastMonthSpend > 0) {
      percentageChange =
        Math.round(((currentMonthSpend - lastMonthSpend) / lastMonthSpend) * 1000) / 10;
    } else if (currentMonthSpend > 0) {
      percentageChange = 100;
    }

    return {
      thisMonthSpend: currentMonthSpend,
      lastMonthSpend,
      percentageChange: Math.abs(percentageChange),
      isIncrease: percentageChange >= 0,
    };
  }, [expenses, currentMonthSpend, balanceService]);

  // Category Breakdown
  const categoryBreakdown: CategoryBreakdownItem[] = React.useMemo(() => {
    const categories: ExpenseCategory[] = ["Food", "Rent", "Electricity", "Internet", "Other"];
    const categoryTotals: Record<ExpenseCategory, { amount: number; count: number }> = {
      Food: { amount: 0, count: 0 },
      Rent: { amount: 0, count: 0 },
      Electricity: { amount: 0, count: 0 },
      Internet: { amount: 0, count: 0 },
      Other: { amount: 0, count: 0 },
    };

    expenses.forEach((e) => {
      const cat = e.category || "Other";
      if (categoryTotals[cat]) {
        categoryTotals[cat].amount += Number(e.amount);
        categoryTotals[cat].count += 1;
      }
    });

    return categories.map((cat) => {
      const amt = categoryTotals[cat].amount;
      const count = categoryTotals[cat].count;
      const percentage = calculatePercentage(amt, totalRoomSpend);

      return {
        category: cat,
        amount: amt,
        percentage,
        count,
      };
    });
  }, [expenses, totalRoomSpend]);

  // Personal Insights for active user
  const personalAnalytics: PersonalAnalytics = React.useMemo(() => {
    const activeUserName = user?.name || "Waheed";
    const activeUserObj = roommates.find((r) => r.name.toLowerCase() === activeUserName.toLowerCase()) || roommates[0];

    const activeUserId = activeUserObj?.id || "";
    const userSummary = roomBalances.find((b) => b.user.id === activeUserId);

    const userExpensesAdded = expenses.filter((e) => e.paid_by === activeUserId);
    const userTotalPaid = userExpensesAdded.reduce((sum, e) => sum + Number(e.amount), 0);
    const userAvg = userExpensesAdded.length > 0 ? userTotalPaid / userExpensesAdded.length : 0;

    const totalOwes = userSummary?.totalOwed || 0;
    const totalReceives = balanceService.calculateUserReceives(
      activeUserId,
      expenses,
      expenses.flatMap((e) => e.splits)
    );

    return {
      name: activeUserObj?.name || activeUserName,
      totalPaid: userTotalPaid,
      totalOwes,
      totalReceives,
      netBalance: userSummary?.netBalance || 0,
      expensesAddedCount: userExpensesAdded.length,
      averageExpense: Math.round(userAvg * 100) / 100,
    };
  }, [user, roommates, roomBalances, expenses, balanceService]);

  // Room Insights
  const roomAnalytics: RoomAnalytics = React.useMemo(() => {
    if (categoryBreakdown.length === 0 || expenses.length === 0) {
      return {
        mostExpensiveCategory: "Food",
        leastUsedCategory: "Other",
        averageDailySpend: 0,
        totalExpensesCount: 0,
      };
    }

    const sortedCats = [...categoryBreakdown].sort((a, b) => b.amount - a.amount);
    const mostExpensiveCategory = sortedCats[0]?.category || "Food";
    const leastUsedCategory = sortedCats[sortedCats.length - 1]?.category || "Other";

    // Approx daily average for 30 days
    const averageDailySpend = Math.round((currentMonthSpend / 30) * 100) / 100;

    return {
      mostExpensiveCategory,
      leastUsedCategory,
      averageDailySpend,
      totalExpensesCount: expenses.length,
    };
  }, [categoryBreakdown, expenses, currentMonthSpend]);

  return {
    expenses,
    roommates,
    totalRoomSpend,
    currentMonthSpend,
    monthlyDelta,
    categoryBreakdown,
    personalAnalytics,
    roomAnalytics,
    selectedMonth,
    setSelectedMonth,
    isLoading,
  };
}
