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
import { InfoPopover } from "@/components/common/info-popover";

import { PersonalDebtAnalyticsCard } from "./personal-debt-analytics-card";

export function DashboardShell() {
  const {
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
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center">
              <span>Room 14 Live Khata</span>
              <InfoPopover
                title="Room 14 Dashboard"
                explanation="Yeh Room 14 (Al Syed Hostel) ka main dashboard hai jahan live personal hisaab, qarza analytics aur rozana ke kharchay dikhayi dete hain."
              />
            </h1>
            <Badge variant="success" className="font-mono text-xs gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Al Syed Hostel</span>
            </Badge>
          </div>
          <p className="caption text-xs sm:text-sm text-muted-foreground mt-0.5">
            Personal debt analytics & equal roommate split tracker.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <Link href="/guide">
            <Button variant="secondary" size="lg" className="gap-1.5 font-semibold text-xs border border-border/60">
              <Icons.help className="h-4 w-4 text-amber-500" />
              <span>Tareeqa (Guide)</span>
            </Button>
          </Link>
          <Link href="/expenses/new">
            <Button size="lg" className="gap-2 shadow-subtle font-semibold bg-emerald-600 hover:bg-emerald-700 text-white">
              <Icons.plus className="h-5 w-5" />
              <span>Naya Kharcha Jodein</span>
            </Button>
          </Link>
          <Link href="/settlements/new">
            <Button variant="outline" size="lg" className="gap-1.5 font-semibold text-xs border-emerald-500/40 text-emerald-600 dark:text-emerald-400">
              <Icons.checkCircle className="h-4 w-4 text-emerald-600" />
              <span>Khaata Safaya (Settle)</span>
            </Button>
          </Link>
        </div>
      </div>

      <ContentWrapper>
        {/* 1. Personalized Debt Analytics & Person-by-Person Breakdown */}
        <PersonalDebtAnalyticsCard />

        {/* 2. Quick Add Template Pills */}
        <div className="p-4 rounded-2xl bg-white dark:bg-card border border-border/80 shadow-subtle space-y-3">
          <QuickAddBar />
        </div>

        {/* 3. Current Balances - Auto-sorted Roommates */}
        <BalanceList balances={sortedBalances} />

        {/* 4. Monthly Budget Tracker */}
        <BudgetTracker currentMonthSpend={metrics.currentMonthSpend} />

        {/* Recent Expenses List */}
        <RecentExpenseList expenses={recentExpenses} />
      </ContentWrapper>
    </PageWrapper>
  );
}
