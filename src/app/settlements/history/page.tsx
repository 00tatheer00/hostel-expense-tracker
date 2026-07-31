"use client";

import * as React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/common/page-header";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { SectionCard } from "@/components/common/section-card";
import { SettlementCard } from "@/features/settlements/components/settlement-card";
import { SettlementEmptyState } from "@/features/settlements/components/settlement-empty-state";
import { useSettlements } from "@/features/settlements/hooks/use-settlements";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";

export default function SettlementHistoryPage() {
  const { settlements, roommates, deleteSettlement } = useSettlements();

  return (
    <PageWrapper>
      <PageHeader
        title="Settlement History"
        subtitle="Complete chronological record of all roommate payments."
        badge={
          <Badge variant="outline" className="font-mono text-xs">
            {settlements.length} Entry{settlements.length === 1 ? "" : "ies"}
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

      <SectionCard title="Payment Records" description="Newest transactions first">
        {settlements.length === 0 ? (
          <SettlementEmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {settlements.map((st) => (
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
    </PageWrapper>
  );
}
