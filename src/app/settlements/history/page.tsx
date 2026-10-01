"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { SectionCard } from "@/components/common/section-card";
import { SettlementCard } from "@/features/settlements/components/settlement-card";
import { SettlementEmptyState } from "@/features/settlements/components/settlement-empty-state";
import { useSettlements } from "@/features/settlements/hooks/use-settlements";
import { MonthSelector } from "@/components/common/month-selector";
import { MonthLockBanner } from "@/components/common/month-lock-banner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";

import { useMonth } from "@/providers/month-provider";

export default function SettlementHistoryPage() {
  const { settlements, roommates, isLocked, selectedMonth } = useSettlements();
  const { monthLabel } = useMonth();

  return (
    <PageWrapper>
      {/* Month Lock Banner when viewing archive months */}
      <MonthLockBanner />

      <PageHeader
        title="Settlement Payment Records"
        subtitle="Complete chronological record of all roommate payments and debt clearances."
        badge={
          isLocked ? (
            <Badge variant="warning" className="font-mono text-xs bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-500/40">
              🔒 {monthLabel} ({settlements.length} Records)
            </Badge>
          ) : (
            <Badge variant="outline" className="font-mono text-xs">
              {settlements.length} Entry{settlements.length === 1 ? "" : "ies"} ({selectedMonth === "all" ? "All Time" : "October 2026"})
            </Badge>
          )
        }
        action={
          <div className="flex items-center space-x-2">
            <Link href="/settlements">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Icons.arrowLeft className="h-3.5 w-3.5" />
                <span>Back to Settlements</span>
              </Button>
            </Link>
            {!isLocked && (
              <Link href="/settlements/new">
                <Button className="gap-1.5 shadow-subtle bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs">
                  <Icons.checkCircle className="h-3.5 w-3.5" />
                  <span>Record Payment</span>
                </Button>
              </Link>
            )}
          </div>
        }
      />

      {/* Month Switcher Tabs */}
      <div className="mb-4">
        <MonthSelector />
      </div>

      <SectionCard
        title={isLocked ? "🔒 August 2026 Payment Ledger (Read-Only)" : "Payment Ledger & Proof Receipts"}
        description={isLocked ? "August ke settlement transactions (Locked Archive)" : "Verified payment entries deducted from room net balances"}
      >
        {settlements.length === 0 ? (
          <SettlementEmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {settlements.map((st) => (
              <SettlementCard
                key={st.id}
                settlement={st}
                roommates={roommates}
              />
            ))}
          </div>
        )}
      </SectionCard>
    </PageWrapper>
  );
}
