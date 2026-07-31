"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SectionCard } from "@/components/common/section-card";
import { BalanceCard } from "./balance-card";
import { UserBalanceSummary } from "@/types/database";
import { staggerContainer, listItemAnimation } from "@/lib/motion";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/lib/icons";

export interface BalanceListProps {
  balances: UserBalanceSummary[];
}

export function BalanceList({ balances }: BalanceListProps) {
  const creditorCount = balances.filter((b) => b.netBalance > 0.01).length;
  const debtorCount = balances.filter((b) => b.netBalance < -0.01).length;

  return (
    <SectionCard
      title="Current Balances"
      description="Live roommate net settlement status • Auto-sorted"
      action={
        <div className="flex items-center space-x-1.5">
          {creditorCount > 0 && (
            <Badge variant="success" className="text-[10px] font-mono">
              {creditorCount} Creditor{creditorCount === 1 ? "" : "s"}
            </Badge>
          )}
          {debtorCount > 0 && (
            <Badge variant="danger" className="text-[10px] font-mono">
              {debtorCount} Debtor{debtorCount === 1 ? "" : "s"}
            </Badge>
          )}
          {creditorCount === 0 && debtorCount === 0 && (
            <Badge variant="outline" className="text-[10px] font-mono">
              All Settled
            </Badge>
          )}
        </div>
      }
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1"
      >
        {balances.map((summary) => (
          <motion.div key={summary.user.id} variants={listItemAnimation}>
            <BalanceCard summary={summary} />
          </motion.div>
        ))}
      </motion.div>
    </SectionCard>
  );
}
