"use client";

import * as React from "react";
import { ThemeProvider } from "./theme-provider";
import { QueryProvider } from "./query-provider";
import { ToastProvider } from "./toast-provider";
import { AuthProvider } from "./auth-provider";
import { MonthProvider } from "./month-provider";
import { ExpensesProvider } from "./expenses-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      <QueryProvider>
        <AuthProvider>
          <MonthProvider>
            <ExpensesProvider>
              <ToastProvider>{children}</ToastProvider>
            </ExpensesProvider>
          </MonthProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
