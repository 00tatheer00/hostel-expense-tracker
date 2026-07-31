"use client";

import * as React from "react";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { ContentWrapper } from "@/components/layout/content-wrapper";
import { DashboardHeader } from "./dashboard-header";
import { SummaryCards } from "./summary-cards";
import { BalanceList } from "./balance-list";
import { QuickActions } from "./quick-actions";
import { RecentExpenseList } from "./recent-expense-list";
import { MonthlySummary } from "./monthly-summary";
import { StatisticsCard } from "./statistics-card";
import { EmptyDashboard } from "./empty-dashboard";
import { LoadingDashboard } from "./loading-dashboard";
import { BudgetTracker } from "@/features/budget/components/budget-tracker";
import { QuickAddBar } from "@/features/expenses/components/quick-add-bar";
import { ActivityFeed } from "@/features/activity/components/activity-feed";
import { ExportModal } from "@/features/export/components/export-modal";
import { useDashboard } from "../hooks/use-dashboard";

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
      {/* Page Header */}
      <DashboardHeader />

      <ContentWrapper>
        {/* Quick Add Bar & Export Data */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-surface/40 p-3 rounded-2xl border border-border/60">
          <div className="flex-1">
            <QuickAddBar />
          </div>
          <div className="shrink-0 self-end sm:self-center">
            <ExportModal />
          </div>
        </div>

        {/* Monthly Budget Tracker */}
        <BudgetTracker currentMonthSpend={metrics.currentMonthSpend} />

        {/* Room Summary Stat Cards */}
        <SummaryCards metrics={metrics} />

        {/* Current Balances - Auto-sorted 6 Roommates */}
        <BalanceList balances={sortedBalances} />

        {/* Quick Actions Shortcuts */}
        <QuickActions />

        {/* Recent Expenses & Activity Feed */}
        {expenses.length === 0 ? (
          <EmptyDashboard />
        ) : (
          <>
            <RecentExpenseList expenses={recentExpenses} />
            <ActivityFeed />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MonthlySummary metrics={metrics} />
              <StatisticsCard metrics={metrics} />
            </div>
          </>
        )}
      </ContentWrapper>
    </PageWrapper>
  );
}
