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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/lib/icons";

export default function SettlementsPage() {
  const { smartSuggestions, settlements, roommates, deleteSettlement } = useSettlements();

  return (
    <PageWrapper>
      <PageHeader
        title="Room Settlements"
        subtitle="Settle up room balances with optimized minimum transactions."
        badge={
          <Badge variant="outline" className="font-mono text-xs">
            {smartSuggestions.length} Active Suggestion{smartSuggestions.length === 1 ? "" : "s"}
          </Badge>
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

      <div className="space-y-6">
        {/* Smart Settlement Engine Suggestions */}
        <SectionCard
          title="Smart Settlement Engine"
          description="AI-calculated minimum payments required to clear all room debts"
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
                No active debts pending in Room 304. Everyone is completely settled up!
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
          title="Recent Settlement History"
          description="Recorded roommate payment entries"
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
