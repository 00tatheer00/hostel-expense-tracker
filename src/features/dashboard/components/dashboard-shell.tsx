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

import { useAuth } from "@/hooks/use-auth";

export function DashboardShell() {
  const { user } = useAuth();
  const {
    recentExpenses,
    sortedBalances,
    metrics,
    isLoading,
  } = useDashboard();

  const [pendingUsers, setPendingUsers] = React.useState<any[]>([]);

  const checkPendingUsers = React.useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("kamrakhata_custom_roommates") || "[]");
        const pending = stored.filter((u: any) => u.status === "pending");
        setPendingUsers(pending);
      } catch (e) {
        console.error("Failed to parse custom roommates", e);
      }
    }
  }, []);

  React.useEffect(() => {
    checkPendingUsers();
    window.addEventListener("storage", checkPendingUsers);
    window.addEventListener("kamrakhata_data_change", checkPendingUsers);

    return () => {
      window.removeEventListener("storage", checkPendingUsers);
      window.removeEventListener("kamrakhata_data_change", checkPendingUsers);
    };
  }, [checkPendingUsers]);

  if (isLoading) {
    return <LoadingDashboard />;
  }

  return (
    <PageWrapper>
      {/* Live Admin Pending Registration Notification Banner */}
      {user?.role === "Room Admin" && pendingUsers.length > 0 && (
        <div className="p-4 rounded-2xl border border-amber-500/50 bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-amber-500/20 text-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500 text-slate-900 font-bold shrink-0">
              <Icons.clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold flex items-center gap-2">
                <span>🔔 Action Required: {pendingUsers.length} Roommate Signup Request{pendingUsers.length === 1 ? "" : "s"} Pending!</span>
                <Badge variant="warning" className="text-[10px] font-mono">
                  Needs Approval
                </Badge>
              </h4>
              <p className="caption text-xs text-muted-foreground mt-0.5">
                {pendingUsers.map((u) => u.name).join(", ")} registered and is waiting for your Room Admin approval to join.
              </p>
            </div>
          </div>

          <Link href="/approvals" className="shrink-0">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md border-0 gap-1.5 w-full sm:w-auto">
              <Icons.checkCircle className="h-4 w-4" />
              <span>Review Approvals Now</span>
            </Button>
          </Link>
        </div>
      )}

      {/* Easy Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex items-center">
              <span>Room 14 Expense Dashboard</span>
              <InfoPopover
                title="Room 14 Dashboard"
                explanation="Room 14 live personal balance analytics, spending breakdown, and roommate expense tracking."
              />
            </h1>
            <Badge variant="success" className="font-mono text-xs gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Al Syed Hostel</span>
            </Badge>
          </div>
          <p className="caption text-xs sm:text-sm text-muted-foreground mt-0.5">
            Personal debt analytics & roommate split tracker.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Link href="/guide">
            <Button variant="secondary" size="sm" className="gap-1.5 font-semibold text-xs border border-border/60">
              <Icons.help className="h-3.5 w-3.5 text-amber-500" />
              <span>Guide</span>
            </Button>
          </Link>
          <Link href="/expenses/new">
            <Button size="sm" className="gap-1.5 shadow-subtle font-semibold bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
              <Icons.plus className="h-4 w-4" />
              <span>Add Expense</span>
            </Button>
          </Link>
          <Link href="/settlements/new">
            <Button variant="outline" size="sm" className="gap-1.5 font-semibold text-xs border-emerald-500/40 text-emerald-600 dark:text-emerald-400">
              <Icons.checkCircle className="h-3.5 w-3.5 text-emerald-600" />
              <span>Settle Up</span>
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
