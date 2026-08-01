"use client";

import * as React from "react";
import { SettlementRow, SuggestedSettlement } from "@/types/database";
import { CreateSettlementInput } from "@/lib/validations/expense";
import { SettlementAlgorithmService } from "@/services/settlement-algorithm.service";
import { useExpenses } from "@/features/expenses/hooks/use-expenses";

export function useSettlements() {
  const [settlements, setSettlements] = React.useState<SettlementRow[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { roommates, roomBalances } = useExpenses();

  const refreshSettlements = React.useCallback(async () => {
    try {
      const res = await fetch("/api/settlements");
      const data = await res.json();
      if (data.settlements) {
        setSettlements(data.settlements);
        if (typeof window !== "undefined") {
          localStorage.setItem("kamrakhata_settlements", JSON.stringify(data.settlements));
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

    const newSettlementId = `stl-${Date.now()}`;
    const newSettlement: SettlementRow = {
      id: newSettlementId,
      from_user: input.fromUser,
      to_user: input.toUser,
      amount: input.amount,
      note: input.note || null,
      created_at: new Date().toISOString(),
    };

    try {
      await fetch("/api/settlements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newSettlementId,
          fromUser: input.fromUser,
          toUser: input.toUser,
          amount: input.amount,
          note: input.note,
        }),
      });
    } catch (e) {
      console.error("Failed to record settlement via API:", e);
    }

    await refreshSettlements();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("kamrakhata_data_change"));
    }

    setIsLoading(false);
    return newSettlement;
  };

  const deleteSettlement = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await fetch(`/api/settlements/${id}`, {
        method: "DELETE",
      });
    } catch (e) {
      console.error("Failed to delete settlement via API:", e);
    }

    await refreshSettlements();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("kamrakhata_data_change"));
    }

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
