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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/lib/icons";

import { siteConfig } from "@/config/site";
import { useMonth } from "@/providers/month-provider";

export default function SettlementsPage() {
  const { settlements, roommates, isLocked, selectedMonth } = useSettlements();
  const { monthLabel } = useMonth();

  return (
    <PageWrapper>
      {/* Month Lock Banner when viewing archive months */}
      <MonthLockBanner />

      <PageHeader
        title="Room Settlements"
        subtitle={`Recorded roommate payments, debt clearance receipts, and verified transactions for ${
          selectedMonth === "all" ? "All Time" : isLocked ? monthLabel : "October 2026 (Active)"
        }.`}
        badge={
          isLocked ? (
            <Badge variant="warning" className="font-mono text-xs bg-amber-500/20 text-amber-800 dark:text-amber-200 border-amber-500/40">
              🔒 {monthLabel} ({settlements.length} Records)
            </Badge>
          ) : (
            <Badge variant="outline" className="font-mono text-xs">
              {settlements.length} Payment Record{settlements.length === 1 ? "" : "s"}
            </Badge>
          )
        }
        action={
          <Link href="/settlements/new" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto gap-2 shadow-subtle bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
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
        {/* Settlement Records */}
        <SectionCard
          title={isLocked ? "🔒 August 2026 Settlement History" : "Recent Settlement History"}
          description={isLocked ? "August mein kiye gaye payment records (Read-Only)" : "Recorded roommate payment entries (Edit to adjust amounts or details)"}
          action={
            settlements.length > 0 ? (
              <Link href="/settlements/history">
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                  View Full History
                </Button>
              </Link>
            ) : null
          }
        >
          {settlements.length === 0 ? (
            <SettlementEmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              {settlements.slice(0, 10).map((st) => (
                <SettlementCard
                  key={st.id}
                  settlement={st}
                  roommates={roommates}
                />
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </PageWrapper>
  );
}
