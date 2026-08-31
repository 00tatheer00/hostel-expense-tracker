"use client";

import * as React from "react";
import { ThemeProvider } from "./theme-provider";
import { QueryProvider } from "./query-provider";
import { ToastProvider } from "./toast-provider";
import { AuthProvider } from "./auth-provider";
import { MonthProvider } from "./month-provider";

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
            <ToastProvider>{children}</ToastProvider>
          </MonthProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
