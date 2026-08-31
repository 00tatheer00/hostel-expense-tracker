"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { SectionCard } from "@/components/common/section-card";
import { SettlementSuggestion } from "@/features/settlements/components/settlement-suggestion";
import { SettlementCard } from "@/features/settlements/components/settlement-card";
import { SettlementEmptyState } from "@/features/settlements/components/settlement-empty-state";
import { useSettlements } from "@/features/settlements/hooks/use-settlements";
import { MonthSelector } from "@/components/common/month-selector";
import { MonthLockBanner } from "@/components/common/month-lock-banner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/lib/icons";

import { siteConfig } from "@/config/site";

export default function SettlementsPage() {
  const { smartSuggestions, settlements, roommates, deleteSettlement, isLocked, selectedMonth } = useSettlements();

  return (
    <PageWrapper>
      {/* Month Lock Banner when viewing August */}
      <MonthLockBanner />

      <PageHeader
        title="Room Settlements"
        subtitle={`Settle up room debts with optimized minimum transactions for ${selectedMonth === "all" ? "All Time" : isLocked ? "August 2026 (Archive)" : "September 2026 (Active)"}.`}
        badge={
          isLocked ? (
            <Badge variant="warning" className="font-mono text-xs bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-500/40">
              🔒 August 2026 Archive
            </Badge>
          ) : (
            <Badge variant="outline" className="font-mono text-xs">
              {smartSuggestions.length} Active Suggestion{smartSuggestions.length === 1 ? "" : "s"}
            </Badge>
          )
        }
        action={
          <Link href="/settlements/new">
            <Button className="gap-2 shadow-subtle bg-emerald-700 hover:bg-emerald-800 text-white font-semibold">
              <Icons.checkCircle className="h-4 w-4" />
              <span>Record Payment</span>
            </Button>
          </Link>
        }
      />

      {/* Month Switcher Tabs */}
      <div className="mb-4">
        <MonthSelector />
      </div>

      <div className="space-y-6">
        {/* Smart Settlement Engine Suggestions */}
        <SectionCard
          title={isLocked ? "🔒 August 2026 Debt Settle Hisaab" : "Smart Settlement Engine"}
          description={isLocked ? "August ke hisaab ke mutabiq kis ne kis ko kitne dene hain" : "AI-calculated minimum payments required to clear room debts"}
        >
          {smartSuggestions.length === 0 ? (
            <div className="p-6 text-center rounded-xl border border-dashed border-emerald-500/30 bg-emerald-500/5 space-y-2">
              <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Icons.checkCircle className="h-5 w-5" />
              </div>
              <h3 className="font-heading font-semibold text-foreground">
                Sab ka hisaab barabar hai.
              </h3>
              <p className="caption text-xs text-muted-foreground max-w-md mx-auto">
                No active debts pending for {selectedMonth === "2026-08" ? "August 2026" : siteConfig.roomNumber}. Everyone is completely settled up!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {smartSuggestions.map((sug, idx) => (
                <SettlementSuggestion key={idx} suggestion={sug} />
              ))}
            </div>
          )}
        </SectionCard>

        {/* Settlement History */}
        <SectionCard
          title={isLocked ? "🔒 August 2026 Settlement History" : "Recent Settlement History"}
          description={isLocked ? "August mein kiye gaye payment records (Read-Only)" : "Recorded roommate payment entries"}
          action={
            settlements.length > 0 ? (
              <Link href="/settlements/history">
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                  View Full History
                </Button>
              </Link>
            ) : null
          }
        >
          {settlements.length === 0 ? (
            <SettlementEmptyState />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {settlements.slice(0, 6).map((st) => (
                <SettlementCard
                  key={st.id}
                  settlement={st}
                  roommates={roommates}
                  onDelete={deleteSettlement}
                />
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </PageWrapper>
  );
}
