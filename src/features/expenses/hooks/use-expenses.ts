"use client";

import * as React from "react";
import { ExpenseWithSplits, UserRow, UserBalanceSummary, SettlementRow } from "@/types/database";
import { CreateExpenseInput } from "@/lib/validations/expense";
import { BalanceService } from "@/services/balance.service";
import { calculateSplit } from "@/utils/calc-utils";
import { useAuth } from "@/hooks/use-auth";

export function useExpenses() {
  const { user } = useAuth();
  const [expenses, setExpenses] = React.useState<ExpenseWithSplits[]>([]);
  const [settlements, setSettlements] = React.useState<SettlementRow[]>([]);
  const [dbRoommates, setDbRoommates] = React.useState<UserRow[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const balanceService = React.useMemo(() => new BalanceService(), []);

  // Fetch central database data (expenses, settlements, profiles)
  const refreshData = React.useCallback(async () => {
    try {
      // 1. Fetch expenses
      const expRes = await fetch("/api/expenses");
      const expData = await expRes.json();
      if (expData.expenses) {
        setExpenses(expData.expenses);
        if (typeof window !== "undefined") {
          localStorage.setItem("kamrakhata_expenses", JSON.stringify(expData.expenses));
        }
      }
    } catch (e) {
      console.error("Failed to fetch expenses from API", e);
      // Fallback to localStorage
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("kamrakhata_expenses");
          if (raw) setExpenses(JSON.parse(raw));
        } catch {}
      }
    }

    try {
      // 2. Fetch settlements
      const stlRes = await fetch("/api/settlements");
      const stlData = await stlRes.json();
      if (stlData.settlements) {
        setSettlements(stlData.settlements);
        if (typeof window !== "undefined") {
          localStorage.setItem("kamrakhata_settlements", JSON.stringify(stlData.settlements));
        }
      }
    } catch (e) {
      console.error("Failed to fetch settlements from API", e);
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("kamrakhata_settlements");
          if (raw) setSettlements(JSON.parse(raw));
        } catch {}
      }
    }

    try {
      // 3. Fetch profiles for roommates
      const profRes = await fetch("/api/profiles");
      const profData = await profRes.json();
      if (profData.profiles && Array.isArray(profData.profiles)) {
        const approved = profData.profiles.filter(
          (p: any) => p.status === "approved" || !p.status
        );
        const mapped: UserRow[] = approved.map((p: any) => ({
          id: p.id,
          name: p.name,
          email: p.email,
          avatar_color: "#10B981",
          theme: "dark",
          created_at: p.created_at || new Date().toISOString(),
        }));
        setDbRoommates(mapped);
        if (typeof window !== "undefined") {
          localStorage.setItem("kamrakhata_custom_roommates", JSON.stringify(profData.profiles));
        }
      }
    } catch (e) {
      console.error("Failed to fetch profiles from API", e);
    } finally {
      setIsLoading(false);
    }
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

  // Compute clean list of roommates (excluding Room Admin)
  const roommates: UserRow[] = React.useMemo(() => {
    const list: UserRow[] = [];

    // Filter out Admin accounts from dbRoommates
    dbRoommates.forEach((u) => {
      const isAdmin = u.name?.toLowerCase().includes("admin") || u.email?.toLowerCase().includes("admin");
      if (!isAdmin && !list.some((existing) => existing.id === u.id || existing.name.toLowerCase() === u.name.toLowerCase())) {
        list.push(u);
      }
    });

    // Fallback to localStorage if API roommates are empty
    if (list.length === 0 && typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("kamrakhata_custom_roommates") || "[]");
        stored.forEach((u: any) => {
          const isAdmin = u.role === "Room Admin" || u.name?.toLowerCase().includes("admin");
          if (!isAdmin && (u.status === "approved" || !u.status) && !list.some((existing) => existing.name.toLowerCase() === u.name.toLowerCase())) {
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
        console.error("Failed to load local roommates", e);
      }
    }

    if (user) {
      const isUserAdmin = user.role === "Room Admin" || user.name?.toLowerCase().includes("admin");
      if (!isUserAdmin && !list.some((u) => u.id === user.id || u.name.toLowerCase() === user.name.toLowerCase())) {
        list.push({
          id: user.id,
          name: user.name,
          email: user.email,
          avatar_color: "#10B981",
          theme: "dark",
          created_at: new Date().toISOString(),
        });
      }
    }

    return list;
  }, [dbRoommates, user]);

  const createExpense = async (input: CreateExpenseInput): Promise<ExpenseWithSplits> => {
    setIsLoading(true);

    const shares = calculateSplit(input.amount, input.splitUserIds.length);
    const payer = roommates.find((r) => r.id === input.paidBy || r.name.toLowerCase() === input.paidBy.toLowerCase()) || roommates[0];

    const newExpenseId = `exp-${Date.now()}`;
    const splitsPayload = input.splitUserIds.map((uId, idx) => ({
      id: `sp-${Date.now()}-${idx}`,
      userId: uId,
      user_id: uId,
      shareAmount: shares[idx],
      share_amount: shares[idx],
    }));

    // Post to API / Supabase
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newExpenseId,
          amount: input.amount,
          description: input.description,
          category: input.category,
          paidBy: input.paidBy,
          splits: splitsPayload,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        console.error("Failed to save expense to DB via API:", data.error);
      }
    } catch (e) {
      console.error("Failed to call POST /api/expenses:", e);
    }

    await refreshData();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("kamrakhata_data_change"));
    }

    setIsLoading(false);

    const newSplits = input.splitUserIds.map((uId, idx) => ({
      id: `sp-${Date.now()}-${idx}`,
      expense_id: newExpenseId,
      user_id: uId,
      share_amount: shares[idx],
      created_at: new Date().toISOString(),
      user: roommates.find((r) => r.id === uId),
    }));

    return {
      id: newExpenseId,
      amount: input.amount,
      description: input.description,
      category: input.category,
      paid_by: input.paidBy,
      created_at: new Date().toISOString(),
      payer,
      splits: newSplits,
    };
  };

  const updateExpense = async (
    id: string,
    input: CreateExpenseInput
  ): Promise<ExpenseWithSplits> => {
    setIsLoading(true);

    const shares = calculateSplit(input.amount, input.splitUserIds.length);
    const payer = roommates.find((r) => r.id === input.paidBy || r.name.toLowerCase() === input.paidBy.toLowerCase()) || roommates[0];

    const splitsPayload = input.splitUserIds.map((uId, idx) => ({
      id: `sp-${Date.now()}-${idx}`,
      userId: uId,
      user_id: uId,
      shareAmount: shares[idx],
      share_amount: shares[idx],
    }));

    try {
      await fetch(`/api/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: input.amount,
          description: input.description,
          category: input.category,
          paidBy: input.paidBy,
          splits: splitsPayload,
        }),
      });
    } catch (e) {
      console.error("Failed to update expense via API:", e);
    }

    await refreshData();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("kamrakhata_data_change"));
    }

    setIsLoading(false);

    const updatedSplits = input.splitUserIds.map((uId, idx) => ({
      id: `sp-${Date.now()}-${idx}`,
      expense_id: id,
      user_id: uId,
      share_amount: shares[idx],
      created_at: new Date().toISOString(),
      user: roommates.find((r) => r.id === uId),
    }));

    return {
      id,
      amount: input.amount,
      description: input.description,
      category: input.category,
      paid_by: input.paidBy,
      created_at: new Date().toISOString(),
      payer,
      splits: updatedSplits,
    };
  };

  const deleteExpense = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });
    } catch (e) {
      console.error("Failed to delete expense via API:", e);
    }

    await refreshData();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("kamrakhata_data_change"));
    }

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
      (e.splits || []).map((s) => ({
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
