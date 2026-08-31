"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { SectionCard } from "@/components/common/section-card";
import { SearchBar } from "@/components/common/search-bar";
import { FilterChip } from "@/components/common/filter-chip";
import { SortMenu, SortOption } from "@/features/expenses/components/sort-menu";
import { HistoryGroup } from "@/features/expenses/components/history-group";
import { EmptySearch } from "@/features/expenses/components/empty-search";
import { EmptyState } from "@/components/common/empty-state";
import { useExpenses } from "@/features/expenses/hooks/use-expenses";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";
import { MonthSelector } from "@/components/common/month-selector";
import { MonthLockBanner } from "@/components/common/month-lock-banner";

import { siteConfig } from "@/config/site";

export default function ExpensesPage() {
  const { expenses, allExpenses, isLocked, selectedMonth, setSelectedMonth } = useExpenses();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [activeCategoryFilter, setActiveCategoryFilter] = React.useState<string>("All");
  const [onlyMyExpenses, setOnlyMyExpenses] = React.useState<boolean>(false);
  const [sortBy, setSortBy] = React.useState<SortOption>("newest");

  // Filter & Sort Logic
  const filteredExpenses = React.useMemo(() => {
    let result = [...expenses];

    // 1. Search Query Filter (Description, Category, Payer Name)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.description.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          (e.payer?.name || "").toLowerCase().includes(q)
      );
    }

    // 2. Category Filter
    if (activeCategoryFilter !== "All") {
      result = result.filter((e) => e.category.toLowerCase() === activeCategoryFilter.toLowerCase());
    }

    // 3. My Expenses Filter
    if (onlyMyExpenses && user) {
      result = result.filter(
        (e) =>
          e.paid_by === user.id ||
          e.payer?.name.toLowerCase() === user.name.toLowerCase()
      );
    }

    // 4. Sort Options
    result.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === "highest") return Number(b.amount) - Number(a.amount);
      if (sortBy === "lowest") return Number(a.amount) - Number(b.amount);
      if (sortBy === "alphabetical") return a.description.localeCompare(b.description);
      return 0;
    });

    return result;
  }, [expenses, searchQuery, activeCategoryFilter, onlyMyExpenses, sortBy, user]);

  const clearFilters = () => {
    setSearchQuery("");
    setActiveCategoryFilter("All");
    setOnlyMyExpenses(false);
    setSortBy("newest");
  };

  const hasActiveFilters = searchQuery !== "" || activeCategoryFilter !== "All" || onlyMyExpenses || sortBy !== "newest";

  return (
    <PageWrapper>
      {/* Month Lock Banner when viewing August */}
      <MonthLockBanner />

      <PageHeader
        title="Room Purchases & Ledger"
        subtitle={`${siteConfig.roomNumber}, ${siteConfig.hostelName} - Live milk, roti, grocery & utility bill purchases history.`}
        badge={
          isLocked ? (
            <Badge variant="warning" className="font-mono text-xs bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-500/40">
              🔒 August 2026 Locked ({filteredExpenses.length} Records)
            </Badge>
          ) : (
            <Badge variant="outline" className="font-mono text-xs">
              {filteredExpenses.length} / {expenses.length} Purchases ({selectedMonth === "all" ? "All Time" : "September 2026"})
            </Badge>
          )
        }
        action={
          isLocked ? (
            <Button
              onClick={() => setSelectedMonth("2026-09")}
              className="gap-2 shadow-subtle font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <Icons.plus className="h-4 w-4" />
              <span>Add Expense (in Sep)</span>
            </Button>
          ) : (
            <Link href="/expenses/new">
              <Button className="gap-2 shadow-subtle font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <Icons.plus className="h-4 w-4" />
                <span>Add Naya Kharcha</span>
              </Button>
            </Link>
          )
        }
      />

      {/* Month Switcher Tabs */}
      <div className="mb-2">
        <MonthSelector />
      </div>

      <SectionCard
        title={isLocked ? "🔒 August 2026 Locked Archive Ledger (Read-Only)" : "🛒 Purchases Ledger & Instant Search"}
        description={isLocked ? "August ke records lock hain aur srf parhne ke liye dastiyab hain." : `Filter and search ${siteConfig.roomNumber} room transactions`}
      >
        <div className="space-y-4">
          {/* Search Bar & Sort Menu */}
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <SortMenu value={sortBy} onChange={setSortBy} />
          </div>

          {/* Quick Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/40">
            <span className="caption text-xs font-mono text-muted-foreground mr-1">
              Category Filter:
            </span>

            {["All", "Milk", "Roti", "Grocery", "Electricity", "Internet", "Other"].map((cat) => (
              <FilterChip
                key={cat}
                label={cat}
                isActive={activeCategoryFilter === cat}
                onClick={() => setActiveCategoryFilter(cat)}
              />
            ))}

            <FilterChip
              label="My Purchases Only"
              isActive={onlyMyExpenses}
              onClick={() => setOnlyMyExpenses(!onlyMyExpenses)}
            />

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-rose-600 dark:text-rose-400 underline underline-offset-4 font-mono ml-auto"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Results Render */}
          {expenses.length === 0 ? (
            <EmptyState
              title={isLocked ? "August 2026 mein koi kharcha nahi mila." : "September 2026 mein koi kharcha abhi tak record nahi hua."}
              description={isLocked ? "August ka record khali hai." : "Naya month shuru ho chuka hai! Pehla kharcha add karne ke liye Add Naya Kharcha button dabayein."}
              icon={Icons.expenses}
              action={
                !isLocked ? (
                  <Link href="/expenses/new">
                    <Button className="gap-2 shadow-subtle">
                      <Icons.plus className="h-4 w-4" />
                      <span>Naya Kharcha Jodein</span>
                    </Button>
                  </Link>
                ) : undefined
              }
            />
          ) : filteredExpenses.length === 0 ? (
            <EmptySearch onClear={clearFilters} />
          ) : (
            <div className="pt-2">
              <HistoryGroup expenses={filteredExpenses} />
            </div>
          )}
        </div>
      </SectionCard>
    </PageWrapper>
  );
}
