"use client";

import * as React from "react";
import { ExpensesContext, ExpensesContextType } from "@/providers/expenses-provider";

export function useExpenses(): ExpensesContextType {
  const context = React.useContext(ExpensesContext);
  if (!context) {
    throw new Error("useExpenses must be used within an ExpensesProvider");
  }
  return context;
}
