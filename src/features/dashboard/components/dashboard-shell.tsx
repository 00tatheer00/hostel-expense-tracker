"use client";

import * as React from "react";
import Link from "next/link";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { ContentWrapper } from "@/components/layout/content-wrapper";
import { BalanceList } from "./balance-list";
import { RecentExpenseList } from "./recent-expense-list";
import { QuickAddBar } from "@/features/expenses/components/quick-add-bar";
import { BudgetTracker } from "@/features/budget/components/budget-tracker";
import { LoadingDashboard } from "./loading-dashboard";
import { useDashboard } from "../hooks/use-dashboard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/lib/icons";

export function DashboardShell() {
  const {
    expenses,
    recentExpenses,
    sortedBalances,
    metrics,
    isLoading,
  } = useDashboard();

  if (isLoading) {
    return <LoadingDashboard />;
  }

  return (
    <PageWrapper>
      {/* Easy Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Room 14 Daily Kharcha
            </h1>
            <Badge variant="success" className="font-mono text-xs gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Al Syed Hostel</span>
            </Badge>
          </div>
          <p className="caption text-xs sm:text-sm text-muted-foreground mt-0.5">
            Simple daily expense & equal roommate split tracker.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 shrink-0">
          <Link href="/expenses/new">
            <Button size="lg" className="gap-2 shadow-subtle font-semibold bg-emerald-700 hover:bg-emerald-800 text-white">
              <Icons.plus className="h-5 w-5" />
              <span>Naya Kharcha Jodein</span>
            </Button>
          </Link>
          <Link href="/settlements/new">
            <Button variant="outline" size="lg" className="gap-1.5 font-semibold text-xs">
              <Icons.checkCircle className="h-4 w-4 text-emerald-600" />
              <span>Settle Up</span>
            </Button>
          </Link>
        </div>
      </div>

      <ContentWrapper>
        {/* Quick Add Template Pills */}
        <div className="p-4 rounded-2xl bg-white border border-border/80 shadow-subtle space-y-3">
          <QuickAddBar />
        </div>

        {/* Current Balances - Auto-sorted 6 Roommates */}
        <BalanceList balances={sortedBalances} />

        {/* Monthly Budget Tracker */}
        <BudgetTracker currentMonthSpend={metrics.currentMonthSpend} />

        {/* Recent Expenses List */}
        <RecentExpenseList expenses={recentExpenses} />
      </ContentWrapper>
    </PageWrapper>
  );
}
