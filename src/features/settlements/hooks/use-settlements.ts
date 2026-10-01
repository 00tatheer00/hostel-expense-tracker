"use client";

import * as React from "react";
import { SettlementRow } from "@/types/database";
import { CreateSettlementInput } from "@/lib/validations/expense";
import { useExpenses } from "@/features/expenses/hooks/use-expenses";

export function useSettlements() {
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const {
    settlements,
    allSettlements,
    roommates,
    selectedMonth,
    isLocked,
    isLoading: isExpensesLoading,
    updateSettlement: updateSettlementCtx,
    deleteSettlement: deleteSettlementCtx,
    refreshData,
  } = useExpenses();

  const recordSettlement = async (input: CreateSettlementInput): Promise<SettlementRow> => {
    setIsSubmitting(true);

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

    await refreshData();
    setIsSubmitting(false);
    return newSettlement;
  };

  const updateSettlement = async (
    id: string,
    input: { fromUser: string; toUser: string; amount: number; note?: string }
  ): Promise<SettlementRow> => {
    setIsSubmitting(true);
    try {
      const res = await updateSettlementCtx(id, input);
      setIsSubmitting(false);
      return res;
    } catch (e) {
      setIsSubmitting(false);
      throw e;
    }
  };

  const deleteSettlement = async (id: string): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const res = await deleteSettlementCtx(id);
      setIsSubmitting(false);
      return res;
    } catch (e) {
      setIsSubmitting(false);
      throw e;
    }
  };

  return {
    settlements,
    allSettlements,
    roommates,
    selectedMonth,
    isLocked,
    isLoading: isExpensesLoading || isSubmitting,
    recordSettlement,
    updateSettlement,
    deleteSettlement,
    refreshSettlements: refreshData,
  };
}
