"use client";

import * as React from "react";
import { SettlementRow, SuggestedSettlement } from "@/types/database";
import { CreateSettlementInput } from "@/lib/validations/expense";
import { SettlementAlgorithmService } from "@/services/settlement-algorithm.service";
import { useExpenses } from "@/features/expenses/hooks/use-expenses";

// Helper to sync settlements with localStorage and dispatch event
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

const setStoredSettlements = (list: SettlementRow[]) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("kamrakhata_settlements", JSON.stringify(list));
      window.dispatchEvent(new Event("kamrakhata_data_change"));
    } catch (e) {
      console.error("Failed to save settlements to localStorage", e);
    }
  }
};

export function useSettlements() {
  const [settlements, setSettlements] = React.useState<SettlementRow[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { roommates, roomBalances } = useExpenses();

  const refreshSettlements = React.useCallback(() => {
    setSettlements(getStoredSettlements());
  }, []);

  React.useEffect(() => {
    refreshSettlements();

    const handleDataChange = () => {
      refreshSettlements();
    };

    window.addEventListener("kamrakhata_data_change", handleDataChange);
    window.addEventListener("storage", handleDataChange);

    return () => {
      window.removeEventListener("kamrakhata_data_change", handleDataChange);
      window.removeEventListener("storage", handleDataChange);
    };
  }, [refreshSettlements]);

  const algorithmService = React.useMemo(() => new SettlementAlgorithmService(), []);

  // Compute smart settlement suggestions dynamically from room balances
  const smartSuggestions: SuggestedSettlement[] = React.useMemo(() => {
    return algorithmService.computeOptimalSettlements(roomBalances);
  }, [roomBalances, algorithmService]);

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

    const current = getStoredSettlements();
    const updated = [newSettlement, ...current];
    setStoredSettlements(updated);
    setSettlements(updated);
    setIsLoading(false);
    return newSettlement;
  };

  const deleteSettlement = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((res) => setTimeout(res, 300));
    const current = getStoredSettlements();
    const filtered = current.filter((s) => s.id !== id);
    setStoredSettlements(filtered);
    setSettlements(filtered);
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
    refreshSettlements,
  };
}
