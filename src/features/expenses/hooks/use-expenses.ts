"use client";

import * as React from "react";
import { ExpenseWithSplits, UserRow, UserBalanceSummary } from "@/types/database";
import { CreateExpenseInput } from "@/lib/validations/expense";
import { BalanceService } from "@/services/balance.service";
import { calculateSplit } from "@/utils/calc-utils";
import { DEV_SEED_USERS, DEV_SEED_EXPENSES, DEV_SEED_SPLITS } from "@/services/seed.service";

// In-memory store for clean slate expense tracking
let globalExpensesStore: ExpenseWithSplits[] = [];

export function useExpenses() {
  const [expenses, setExpenses] = React.useState<ExpenseWithSplits[]>(globalExpensesStore);
  const [roommates] = React.useState<UserRow[]>(DEV_SEED_USERS);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const balanceService = React.useMemo(() => new BalanceService(), []);

  // Update store helper
  const updateStore = (newList: ExpenseWithSplits[]) => {
    globalExpensesStore = newList;
    setExpenses([...newList]);
  };

  const createExpense = async (input: CreateExpenseInput): Promise<ExpenseWithSplits> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 400)); // Simulate async latency

    const shares = calculateSplit(input.amount, input.splitUserIds.length);
    const payer = roommates.find((r) => r.id === input.paidBy) || roommates[0];

    const newExpenseId = `exp-${Date.now()}`;
    const newSplits = input.splitUserIds.map((uId, idx) => ({
      id: `sp-${Date.now()}-${idx}`,
      expense_id: newExpenseId,
      user_id: uId,
      share_amount: shares[idx],
      created_at: new Date().toISOString(),
      user: roommates.find((r) => r.id === uId),
    }));

    const newExpense: ExpenseWithSplits = {
      id: newExpenseId,
      amount: input.amount,
      description: input.description,
      category: input.category,
      paid_by: input.paidBy,
      created_at: new Date().toISOString(),
      payer,
      splits: newSplits,
    };

    const updated = [newExpense, ...expenses];
    updateStore(updated);
    setIsLoading(false);
    return newExpense;
  };

  const updateExpense = async (
    id: string,
    input: CreateExpenseInput
  ): Promise<ExpenseWithSplits> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 400));

    const shares = calculateSplit(input.amount, input.splitUserIds.length);
    const payer = roommates.find((r) => r.id === input.paidBy) || roommates[0];

    const updatedSplits = input.splitUserIds.map((uId, idx) => ({
      id: `sp-${Date.now()}-${idx}`,
      expense_id: id,
      user_id: uId,
      share_amount: shares[idx],
      created_at: new Date().toISOString(),
      user: roommates.find((r) => r.id === uId),
    }));

    const updatedList = expenses.map((e) => {
      if (e.id === id) {
        return {
          ...e,
          amount: input.amount,
          description: input.description,
          category: input.category,
          paid_by: input.paidBy,
          payer,
          splits: updatedSplits,
        };
      }
      return e;
    });

    updateStore(updatedList);
    setIsLoading(false);
    return updatedList.find((e) => e.id === id)!;
  };

  const deleteExpense = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 300));
    const filtered = expenses.filter((e) => e.id !== id);
    updateStore(filtered);
    setIsLoading(false);
    return true;
  };

  const getExpenseById = (id: string): ExpenseWithSplits | undefined => {
    return expenses.find((e) => e.id === id);
  };

  // Recalculate roommate net balances dynamically
  const roomBalances: UserBalanceSummary[] = React.useMemo(() => {
    const rawExpenses = expenses.map((e) => ({
      id: e.id,
      amount: e.amount,
      description: e.description,
      category: e.category,
      paid_by: e.paid_by,
      created_at: e.created_at,
    }));

    const rawSplits = expenses.flatMap((e) =>
      e.splits.map((s) => ({
        id: s.id,
        expense_id: s.expense_id,
        user_id: s.user_id,
        share_amount: s.share_amount,
        created_at: s.created_at,
      }))
    );

    return balanceService.calculateRoomBalances(roommates, rawExpenses, rawSplits, []);
  }, [expenses, roommates, balanceService]);

  return {
    expenses,
    roommates,
    roomBalances,
    isLoading,
    createExpense,
    updateExpense,
    deleteExpense,
    getExpenseById,
  };
}
