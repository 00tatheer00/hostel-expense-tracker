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

  const [roommateMembers, setRoommateMembers] = React.useState<any[]>([]);

  const checkRoommateMembers = React.useCallback(async () => {
    try {
      const res = await fetch("/api/profiles");
      const data = await res.json();
      if (data.profiles && Array.isArray(data.profiles)) {
        const roommates = data.profiles.filter((u: any) => !u.name?.toLowerCase().includes("admin") && !u.email?.toLowerCase().includes("admin"));
        setRoommateMembers(roommates);
      }
    } catch (e) {
      console.error("Failed to fetch profiles for roommate notification", e);
    }
  }, []);

  React.useEffect(() => {
    checkRoommateMembers();
    window.addEventListener("storage", checkRoommateMembers);
    window.addEventListener("kamrakhata_data_change", checkRoommateMembers);

    return () => {
      window.removeEventListener("storage", checkRoommateMembers);
      window.removeEventListener("kamrakhata_data_change", checkRoommateMembers);
    };
  }, [checkRoommateMembers]);

  if (isLoading) {
    return <LoadingDashboard />;
  }

  return (
    <PageWrapper>
      {/* Live Admin Member Registered Notification Banner */}
      {user?.role === "Room Admin" && roommateMembers.length > 0 && (
        <div className="p-4 rounded-2xl border border-emerald-500/50 bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 text-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500 text-white font-bold shrink-0">
              <Icons.userPlus className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold flex items-center gap-2">
                <span>🎉 {roommateMembers.length} Registered Roommate{roommateMembers.length === 1 ? "" : "s"} in Room 14</span>
                <Badge variant="success" className="text-[10px] font-mono">
                  Live Members
                </Badge>
              </h4>
              <p className="caption text-xs text-muted-foreground mt-0.5">
                Active Roommates: <strong className="text-foreground">{roommateMembers.map((u) => u.name).join(", ")}</strong>
              </p>
            </div>
          </div>

          <Link href="/approvals" className="shrink-0">
            <Button size="sm" variant="outline" className="text-xs font-bold border-emerald-500/40 text-emerald-600 dark:text-emerald-400 gap-1.5 w-full sm:w-auto">
              <Icons.users className="h-4 w-4" />
              <span>View All Members</span>
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
            Welcome back, <strong className="text-foreground">{user?.name || "Roommate"}</strong>! Live debt analytics & roommate split tracker for Room 14.
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
