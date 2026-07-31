"use client";

import * as React from "react";
import { SettlementRow, SuggestedSettlement } from "@/types/database";
import { CreateSettlementInput } from "@/lib/validations/expense";
import { SettlementAlgorithmService } from "@/services/settlement-algorithm.service";
import { useExpenses } from "@/features/expenses/hooks/use-expenses";

// In-memory settlement store for Phase 6
let globalSettlementsStore: SettlementRow[] = [];

export function useSettlements() {
  const [settlements, setSettlements] = React.useState<SettlementRow[]>(globalSettlementsStore);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { roommates, roomBalances } = useExpenses();

  const algorithmService = React.useMemo(() => new SettlementAlgorithmService(), []);

  // Compute smart settlement suggestions dynamically from room balances
  const smartSuggestions: SuggestedSettlement[] = React.useMemo(() => {
    return algorithmService.computeOptimalSettlements(roomBalances);
  }, [roomBalances, algorithmService]);

  const updateStore = (newList: SettlementRow[]) => {
    globalSettlementsStore = newList;
    setSettlements([...newList]);
  };

  const recordSettlement = async (input: CreateSettlementInput): Promise<SettlementRow> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 300)); // Simulate API delay

    const newSettlement: SettlementRow = {
      id: `stl-${Date.now()}`,
      from_user: input.fromUser,
      to_user: input.toUser,
      amount: input.amount,
      note: input.note || null,
      created_at: new Date().toISOString(),
    };

    const updated = [newSettlement, ...settlements];
    updateStore(updated);
    setIsLoading(false);
    return newSettlement;
  };

  const deleteSettlement = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 300));
    const filtered = settlements.filter((s) => s.id !== id);
    updateStore(filtered);
    setIsLoading(false);
    return true;
  };

  return {
    settlements,
    roommates,
    smartSuggestions,
    isLoading,
    recordSettlement,
    deleteSettlement,
  };
}
