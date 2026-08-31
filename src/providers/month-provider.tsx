"use client";

import * as React from "react";
import {
  ACTIVE_MONTH_KEY,
  isMonthLocked,
  getMonthLabel,
  MonthOption,
  getAvailableMonthOptions,
} from "@/utils/month-utils";

export interface MonthContextValue {
  selectedMonth: string;
  setSelectedMonth: (monthKey: string) => void;
  isLocked: boolean;
  isCurrentMonth: boolean;
  activeMonthKey: string;
  monthLabel: string;
  availableMonths: MonthOption[];
}

const MonthContext = React.createContext<MonthContextValue | undefined>(undefined);

export function MonthProvider({ children }: { children: React.ReactNode }) {
  // Default to September 2026 (Active Month)
  const [selectedMonth, setSelectedMonthState] = React.useState<string>(ACTIVE_MONTH_KEY);

  // Initialize from localStorage or URL query if available
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const qMonth = urlParams.get("month");
        if (qMonth) {
          setSelectedMonthState(qMonth);
          return;
        }

        const stored = localStorage.getItem("kamrakhata_selected_month");
        if (stored) {
          setSelectedMonthState(stored);
        }
      } catch (e) {
        console.error("Failed to load stored month", e);
      }
    }
  }, []);

  const setSelectedMonth = React.useCallback((monthKey: string) => {
    setSelectedMonthState(monthKey);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("kamrakhata_selected_month", monthKey);
        window.dispatchEvent(new CustomEvent("kamrakhata_month_change", { detail: monthKey }));
      } catch (e) {
        console.error("Failed to persist selected month", e);
      }
    }
  }, []);

  const isLocked = React.useMemo(() => isMonthLocked(selectedMonth), [selectedMonth]);
  const isCurrentMonth = React.useMemo(() => selectedMonth === ACTIVE_MONTH_KEY, [selectedMonth]);
  const monthLabel = React.useMemo(() => getMonthLabel(selectedMonth), [selectedMonth]);
  const availableMonths = React.useMemo(() => getAvailableMonthOptions([]), []);

  return (
    <MonthContext.Provider
      value={{
        selectedMonth,
        setSelectedMonth,
        isLocked,
        isCurrentMonth,
        activeMonthKey: ACTIVE_MONTH_KEY,
        monthLabel,
        availableMonths,
      }}
    >
      {children}
    </MonthContext.Provider>
  );
}

export function useMonth(): MonthContextValue {
  const context = React.useContext(MonthContext);
  if (!context) {
    throw new Error("useMonth must be used within a MonthProvider");
  }
  return context;
}
