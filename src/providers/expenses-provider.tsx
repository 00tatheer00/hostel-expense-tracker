"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ExpenseWithSplits,
  UserRow,
  UserBalanceSummary,
  SettlementRow,
} from "@/types/database";
import { CreateExpenseInput } from "@/lib/validations/expense";
import { BalanceService } from "@/services/balance.service";
import { calculateSplit } from "@/utils/calc-utils";
import { useAuth } from "@/hooks/use-auth";
import { useMonth } from "@/providers/month-provider";
import { filterItemsByMonth, isExpenseLocked, ACTIVE_MONTH_KEY } from "@/utils/month-utils";

export interface ExpensesContextType {
  allExpenses: ExpenseWithSplits[];
  allSettlements: SettlementRow[];
  expenses: ExpenseWithSplits[];
  settlements: SettlementRow[];
  roommates: UserRow[];
  allRoommates: UserRow[];
  roomBalances: UserBalanceSummary[];
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  isLocked: boolean;
  isLoading: boolean;
  createExpense: (input: CreateExpenseInput) => Promise<ExpenseWithSplits>;
  updateExpense: (id: string, input: CreateExpenseInput) => Promise<ExpenseWithSplits>;
  deleteExpense: (id: string) => Promise<boolean>;
  updateSettlement: (
    id: string,
    input: { fromUser: string; toUser: string; amount: number; note?: string }
  ) => Promise<SettlementRow>;
  deleteSettlement: (id: string) => Promise<boolean>;
  getExpenseById: (id: string) => ExpenseWithSplits | undefined;
  refreshData: () => Promise<void>;
}

export const ExpensesContext = React.createContext<ExpensesContextType | null>(null);

// Fast helper to safely read localStorage synchronously for 0ms initial paint
function getLocalCache<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function ExpensesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { selectedMonth, setSelectedMonth, isLocked } = useMonth();
  const queryClient = useQueryClient();
  const balanceService = React.useMemo(() => new BalanceService(), []);

  // 1. Instant 0ms Paint: Seed from local storage cache if available
  const [allExpenses, setAllExpenses] = React.useState<ExpenseWithSplits[]>(() =>
    getLocalCache("kamrakhata_expenses", [])
  );
  const [allSettlements, setAllSettlements] = React.useState<SettlementRow[]>(() =>
    getLocalCache("kamrakhata_settlements", [])
  );
  const [dbRoommates, setDbRoommates] = React.useState<UserRow[]>(() => {
    const rawProfiles = getLocalCache<any[]>("kamrakhata_custom_roommates", []);
    return rawProfiles
      .filter((p: any) => p.status === "approved" || !p.status)
      .map((p: any) => ({
        id: p.id,
        name: p.name,
        email: p.email,
        avatar_color: p.avatarColor || p.avatar_color || "#10B981",
        theme: "dark",
        created_at: p.createdAt || p.created_at || new Date().toISOString(),
      }));
  });

  // Track initial loading only if absolutely NO cached data exists
  const hasInitialCache = allExpenses.length > 0 || dbRoommates.length > 0;
  const [isInitialLoading, setIsInitialLoading] = React.useState<boolean>(!hasInitialCache);

  // 2. Parallel Unified TanStack React Query Fetching (Eliminates Waterfalls & Deduplicates)
  const { data: centralData, refetch } = useQuery({
    queryKey: ["kamrakhata_central_data"],
    queryFn: async () => {
      const [expRes, stlRes, profRes] = await Promise.all([
        fetch("/api/expenses").then((r) => r.json()).catch(() => ({ expenses: [] })),
        fetch("/api/settlements").then((r) => r.json()).catch(() => ({ settlements: [] })),
        fetch("/api/profiles").then((r) => r.json()).catch(() => ({ profiles: [] })),
      ]);

      return {
        expenses: expRes.expenses || [],
        settlements: stlRes.settlements || [],
        profiles: profRes.profiles || [],
      };
    },
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // 3. Sync fetched data into state & localStorage
  React.useEffect(() => {
    if (!centralData) return;

    if (Array.isArray(centralData.expenses)) {
      setAllExpenses(centralData.expenses);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("kamrakhata_expenses", JSON.stringify(centralData.expenses));
        } catch {}
      }
    }

    if (Array.isArray(centralData.settlements)) {
      setAllSettlements(centralData.settlements);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("kamrakhata_settlements", JSON.stringify(centralData.settlements));
        } catch {}
      }
    }

    if (Array.isArray(centralData.profiles)) {
      const approved = centralData.profiles.filter(
        (p: any) => p.status === "approved" || !p.status
      );
      const mapped: UserRow[] = approved.map((p: any) => ({
        id: p.id,
        name: p.name,
        email: p.email,
        avatar_color: p.avatarColor || p.avatar_color || "#10B981",
        theme: "dark",
        created_at: p.createdAt || p.created_at || new Date().toISOString(),
      }));
      setDbRoommates(mapped);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("kamrakhata_custom_roommates", JSON.stringify(centralData.profiles));
        } catch {}
      }
    }

    setIsInitialLoading(false);
  }, [centralData]);

  // Compute clean list of roommates (excluding Room Admin)
  const roommates: UserRow[] = React.useMemo(() => {
    const list: UserRow[] = [];

    dbRoommates.forEach((u) => {
      const isAdmin =
        u.name?.toLowerCase().includes("admin") || u.email?.toLowerCase().includes("admin");
      if (
        !isAdmin &&
        !list.some(
          (existing) =>
            existing.id === u.id || existing.name.toLowerCase() === u.name.toLowerCase()
        )
      ) {
        list.push(u);
      }
    });

    if (user) {
      const isUserAdmin =
        user.role === "Room Admin" || user.name?.toLowerCase().includes("admin");
      if (
        !isUserAdmin &&
        !list.some((u) => u.id === user.id || u.name.toLowerCase() === user.name.toLowerCase())
      ) {
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

  // Scoped list of roommates based on selected month
  const scopedRoommates: UserRow[] = React.useMemo(() => {
    if (selectedMonth === "2026-08") {
      return roommates.filter((r) => {
        const joinDate = new Date(r.created_at);
        const joinedBeforeSept =
          joinDate.getTime() < new Date("2026-09-01T00:00:00.000Z").getTime();
        const hasActivityInMonth = allExpenses.some(
          (e) =>
            (e.paid_by === r.id || e.splits?.some((s) => s.user_id === r.id)) &&
            e.created_at.startsWith("2026-08")
        );
        return joinedBeforeSept || hasActivityInMonth;
      });
    }
    return roommates;
  }, [roommates, selectedMonth, allExpenses]);

  // Filtered expenses & settlements based on active selected month
  const expenses = React.useMemo(() => {
    return filterItemsByMonth(allExpenses, selectedMonth);
  }, [allExpenses, selectedMonth]);

  const settlements = React.useMemo(() => {
    return filterItemsByMonth(allSettlements, selectedMonth);
  }, [allSettlements, selectedMonth]);

  // Dynamic Roommate Net Balances for active month view
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

    return balanceService.calculateRoomBalances(
      scopedRoommates,
      rawExpenses,
      rawSplits,
      settlements
    );
  }, [expenses, scopedRoommates, settlements, balanceService]);

  const refreshData = React.useCallback(async () => {
    await refetch();
  }, [refetch]);

  const createExpense = async (input: CreateExpenseInput): Promise<ExpenseWithSplits> => {
    const shares = calculateSplit(input.amount, input.splitUserIds.length);
    const payer =
      roommates.find(
        (r) =>
          r.id === input.paidBy || r.name.toLowerCase() === input.paidBy.toLowerCase()
      ) || roommates[0];

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

    // Optimistic Update
    setAllExpenses((prev) => [newExpense, ...prev]);

    if (isLocked) {
      setSelectedMonth(ACTIVE_MONTH_KEY);
    }

    try {
      const splitsPayload = input.splitUserIds.map((uId, idx) => ({
        id: `sp-${Date.now()}-${idx}`,
        userId: uId,
        user_id: uId,
        shareAmount: shares[idx],
        share_amount: shares[idx],
      }));

      await fetch("/api/expenses", {
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
    } catch (e) {
      console.error("Failed to POST expense:", e);
    }

    // Refresh query cache in background
    queryClient.invalidateQueries({ queryKey: ["kamrakhata_central_data"] });
    return newExpense;
  };

  const updateExpense = async (
    id: string,
    input: CreateExpenseInput
  ): Promise<ExpenseWithSplits> => {
    const existing = allExpenses.find((e) => e.id === id);
    if (existing && isExpenseLocked(existing.created_at)) {
      throw new Error("🔒 August 2026 ka kharcha locked hai aur edit nahi kiya ja sakta.");
    }

    const shares = calculateSplit(input.amount, input.splitUserIds.length);
    const payer =
      roommates.find(
        (r) =>
          r.id === input.paidBy || r.name.toLowerCase() === input.paidBy.toLowerCase()
      ) || roommates[0];

    const updatedSplits = input.splitUserIds.map((uId, idx) => ({
      id: `sp-${Date.now()}-${idx}`,
      expense_id: id,
      user_id: uId,
      share_amount: shares[idx],
      created_at: existing?.created_at || new Date().toISOString(),
      user: roommates.find((r) => r.id === uId),
    }));

    const updatedExpenseObj: ExpenseWithSplits = {
      id,
      amount: input.amount,
      description: input.description,
      category: input.category,
      paid_by: payer?.id || input.paidBy,
      created_at: existing?.created_at || new Date().toISOString(),
      payer,
      splits: updatedSplits,
    };

    // Optimistic Update
    setAllExpenses((prev) =>
      prev.map((exp) => (exp.id === id ? updatedExpenseObj : exp))
    );

    try {
      const splitsPayload = input.splitUserIds.map((uId, idx) => ({
        id: `sp-${Date.now()}-${idx}`,
        userId: uId,
        user_id: uId,
        shareAmount: shares[idx],
        share_amount: shares[idx],
      }));

      await fetch(`/api/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: input.amount,
          description: input.description,
          category: input.category,
          paidBy: payer?.id || input.paidBy,
          splits: splitsPayload,
        }),
      });
    } catch (e) {
      console.error("Failed to update expense via API:", e);
      throw e;
    }

    queryClient.invalidateQueries({ queryKey: ["kamrakhata_central_data"] });
    return updatedExpenseObj;
  };

  const deleteExpense = async (id: string): Promise<boolean> => {
    const existing = allExpenses.find((e) => e.id === id);
    if (existing && isExpenseLocked(existing.created_at)) {
      throw new Error("🔒 August 2026 ka kharcha locked hai aur delete nahi kiya ja sakta.");
    }

    // Optimistic Update
    setAllExpenses((prev) => prev.filter((e) => e.id !== id));

    try {
      await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });
    } catch (e) {
      console.error("Failed to delete expense via API:", e);
      throw e;
    }

    queryClient.invalidateQueries({ queryKey: ["kamrakhata_central_data"] });
    return true;
  };

  const updateSettlement = async (
    id: string,
    input: { fromUser: string; toUser: string; amount: number; note?: string }
  ): Promise<SettlementRow> => {
    const existing = allSettlements.find((s) => s.id === id);
    if (existing && isExpenseLocked(existing.created_at)) {
      throw new Error("🔒 August 2026 ka settlement locked hai aur edit nahi ho sakta.");
    }

    const updated: SettlementRow = {
      id,
      from_user: input.fromUser,
      to_user: input.toUser,
      amount: input.amount,
      note: input.note || null,
      created_at: existing?.created_at || new Date().toISOString(),
    };

    setAllSettlements((prev) => prev.map((s) => (s.id === id ? updated : s)));

    try {
      await fetch(`/api/settlements/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromUser: input.fromUser,
          toUser: input.toUser,
          amount: input.amount,
          note: input.note,
        }),
      });
    } catch (e) {
      console.error("Failed to update settlement:", e);
      throw e;
    }

    queryClient.invalidateQueries({ queryKey: ["kamrakhata_central_data"] });
    return updated;
  };

  const deleteSettlement = async (id: string): Promise<boolean> => {
    const existing = allSettlements.find((s) => s.id === id);
    if (existing && isExpenseLocked(existing.created_at)) {
      throw new Error("🔒 August 2026 ka settlement locked hai aur delete nahi ho sakta.");
    }

    setAllSettlements((prev) => prev.filter((s) => s.id !== id));

    try {
      await fetch(`/api/settlements/${id}`, {
        method: "DELETE",
      });
    } catch (e) {
      console.error("Failed to delete settlement:", e);
      throw e;
    }

    queryClient.invalidateQueries({ queryKey: ["kamrakhata_central_data"] });
    return true;
  };

  const getExpenseById = (id: string): ExpenseWithSplits | undefined => {
    return allExpenses.find((e) => e.id === id);
  };

  return (
    <ExpensesContext.Provider
      value={{
        allExpenses,
        allSettlements,
        expenses,
        settlements,
        roommates: scopedRoommates,
        allRoommates: roommates,
        roomBalances,
        selectedMonth,
        setSelectedMonth,
        isLocked,
        isLoading: isInitialLoading,
        createExpense,
        updateExpense,
        deleteExpense,
        updateSettlement,
        deleteSettlement,
        getExpenseById,
        refreshData,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}
