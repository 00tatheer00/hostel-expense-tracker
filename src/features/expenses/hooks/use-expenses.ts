"use client";

import * as React from "react";
import { ExpenseWithSplits, UserRow, UserBalanceSummary } from "@/types/database";
import { CreateExpenseInput } from "@/lib/validations/expense";
import { BalanceService } from "@/services/balance.service";
import { calculateSplit } from "@/utils/calc-utils";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";
import { SettlementRow } from "@/types/database";

// Local storage helper for expenses & settlements
const getStoredExpenses = (): ExpenseWithSplits[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("kamrakhata_expenses");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load expenses from localStorage", e);
    return [];
  }
};

const setStoredExpenses = (list: ExpenseWithSplits[]) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("kamrakhata_expenses", JSON.stringify(list));
      window.dispatchEvent(new Event("kamrakhata_data_change"));
    } catch (e) {
      console.error("Failed to save expenses to localStorage", e);
    }
  }
};

const getStoredSettlements = (): SettlementRow[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("kamrakhata_settlements");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load settlements from localStorage", e);
    return [];
  }
};

export function useExpenses() {
  const { user } = useAuth();
  const [expenses, setExpenses] = React.useState<ExpenseWithSplits[]>([]);
  const [settlements, setSettlements] = React.useState<SettlementRow[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const balanceService = React.useMemo(() => new BalanceService(), []);

  const refreshData = React.useCallback(() => {
    setExpenses(getStoredExpenses());
    setSettlements(getStoredSettlements());
  }, []);

  React.useEffect(() => {
    refreshData();

    const handleDataChange = () => {
      refreshData();
    };

    window.addEventListener("kamrakhata_data_change", handleDataChange);
    window.addEventListener("storage", handleDataChange);

    return () => {
      window.removeEventListener("kamrakhata_data_change", handleDataChange);
      window.removeEventListener("storage", handleDataChange);
    };
  }, [refreshData]);

  // Dynamically compute list of registered roommates
  const roommates: UserRow[] = React.useMemo(() => {
    const list: UserRow[] = [];
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("kamrakhata_custom_roommates") || "[]");
        stored.forEach((u: any) => {
          if (!list.some((existing) => existing.name.toLowerCase() === u.name.toLowerCase())) {
            list.push({
              id: u.id || `rm-${u.name}`,
              name: u.name,
              email: u.email,
              avatar_color: "#10B981",
              theme: "dark",
              created_at: new Date().toISOString(),
            });
          }
        });
      } catch (e) {
        console.error("Failed to load registered roommates", e);
      }
    }
    if (user && !list.some((u) => u.name.toLowerCase() === user.name.toLowerCase())) {
      list.push({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_color: "#10B981",
        theme: "dark",
        created_at: new Date().toISOString(),
      });
    }
    return list;
  }, [user]);

  // Update store helper
  const updateStore = (newList: ExpenseWithSplits[]) => {
    setStoredExpenses(newList);
    setExpenses([...newList]);
  };

  const createExpense = async (input: CreateExpenseInput): Promise<ExpenseWithSplits> => {
    setIsLoading(true);

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

    // Save to local store
    const current = getStoredExpenses();
    const updated = [newExpense, ...current];
    updateStore(updated);

    // Sync to Supabase Database
    try {
      const supabase = createClient();
      await supabase.from("expenses").insert({
        id: newExpense.id,
        amount: newExpense.amount,
        description: newExpense.description,
        category: newExpense.category,
        paid_by: newExpense.paid_by,
        created_at: newExpense.created_at,
      });

      const splitsPayload = newSplits.map((s) => ({
        id: s.id,
        expense_id: s.expense_id,
        user_id: s.user_id,
        share_amount: s.share_amount,
        created_at: s.created_at,
      }));

      await supabase.from("splits").insert(splitsPayload);
    } catch (e) {
      console.log("Supabase sync note:", e);
    }

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

    const current = getStoredExpenses();
    const updatedList = current.map((e) => {
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
    const current = getStoredExpenses();
    const filtered = current.filter((e) => e.id !== id);
    updateStore(filtered);
    setIsLoading(false);
    return true;
  };

  const getExpenseById = (id: string): ExpenseWithSplits | undefined => {
    return expenses.find((e) => e.id === id);
  };

  // Recalculate roommate net balances dynamically incorporating expenses & settlements
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

    return balanceService.calculateRoomBalances(roommates, rawExpenses, rawSplits, settlements);
  }, [expenses, roommates, settlements, balanceService]);

  return {
    expenses,
    settlements,
    roommates,
    roomBalances,
    isLoading,
    createExpense,
    updateExpense,
    deleteExpense,
    getExpenseById,
  };
}
