"use client";

import * as React from "react";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { ContentWrapper } from "@/components/layout/content-wrapper";
import { AnalyticsHeader } from "@/features/analytics/components/analytics-header";
import { AnalyticsSummaryCards } from "@/features/analytics/components/summary-cards";
import { MonthlyComparison } from "@/features/analytics/components/monthly-comparison";
import { CategoryChart } from "@/features/analytics/components/category-chart";
import { ExpenseTrendChart } from "@/features/analytics/components/expense-trend-chart";
import { TopSpendersCard } from "@/features/analytics/components/top-spenders-card";
import { PersonalInsights } from "@/features/analytics/components/personal-insights";
import { RoomInsights } from "@/features/analytics/components/room-insights";
import { EmptyAnalytics } from "@/features/analytics/components/empty-analytics";
import { LoadingAnalytics } from "@/features/analytics/components/loading-analytics";
import { useAnalytics } from "@/features/analytics/hooks/use-analytics";

export default function AnalyticsPage() {
  const {
    expenses,
    totalRoomSpend,
    currentMonthSpend,
    monthlyDelta,
    categoryBreakdown,
    personalAnalytics,
    roomAnalytics,
    selectedMonth,
    setSelectedMonth,
    isLoading,
  } = useAnalytics();

  if (isLoading) {
    return <LoadingAnalytics />;
  }

  const amounts = expenses.map((e) => Number(e.amount));
  const avgAmt = expenses.length > 0 ? totalRoomSpend / expenses.length : 0;
  const maxAmt = expenses.length > 0 ? Math.max(...amounts) : 0;

  return (
    <PageWrapper>
      {/* Analytics Page Header */}
      <AnalyticsHeader
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
      />

      <ContentWrapper>
        {expenses.length === 0 ? (
          <EmptyAnalytics />
        ) : (
          <>
            {/* Top-Level Summary Cards */}
            <AnalyticsSummaryCards
              totalRoomSpend={totalRoomSpend}
              currentMonthSpend={currentMonthSpend}
              totalExpensesCount={expenses.length}
              averageExpense={avgAmt}
              highestExpense={maxAmt}
            />

            {/* Monthly Comparison */}
            <MonthlyComparison delta={monthlyDelta} />

            {/* Category Breakdown & Distribution Bar Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CategoryChart categories={categoryBreakdown} />
              <ExpenseTrendChart categories={categoryBreakdown} />
            </div>

            {/* Top Spenders & Roommate Rankings */}
            <TopSpendersCard
              highestSpenderName={personalAnalytics.name}
              highestSpenderAmount={personalAnalytics.totalPaid}
              largestExpenseDescription={expenses[0]?.description || "Grocery"}
              largestExpenseAmount={maxAmt}
            />

            {/* Personal Contribution & Room Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PersonalInsights analytics={personalAnalytics} />
              <RoomInsights analytics={roomAnalytics} />
            </div>
          </>
        )}
      </ContentWrapper>
    </PageWrapper>
  );
}
