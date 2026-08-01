"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SectionCard } from "@/components/common/section-card";
import { BalanceCard } from "./balance-card";
import { UserBalanceSummary } from "@/types/database";
import { staggerContainer, listItemAnimation } from "@/lib/motion";
import { Badge } from "@/components/ui/badge";
import { InfoPopover } from "@/components/common/info-popover";

export interface BalanceListProps {
  balances: UserBalanceSummary[];
}

export function BalanceList({ balances }: BalanceListProps) {
  const creditorCount = balances.filter((b) => b.netBalance > 0.01).length;
  const debtorCount = balances.filter((b) => b.netBalance < -0.01).length;

  return (
    <SectionCard
      title={
        <span className="flex items-center">
          <span>Roommate Live Balances</span>
          <InfoPopover
            title="Live Balances"
            explanation="Final net balance status for each roommate (receivable or payable)."
          />
        </span>
      }
      description="Room 14 roommates balance status • Auto-sorted"
      action={
        <div className="flex items-center space-x-1.5">
          {creditorCount > 0 && (
            <Badge variant="success" className="text-[10px] font-mono font-semibold">
              {creditorCount} Lene Waley
            </Badge>
          )}
          {debtorCount > 0 && (
            <Badge variant="danger" className="text-[10px] font-mono font-semibold">
              {debtorCount} Dene Waley
            </Badge>
          )}
          {creditorCount === 0 && debtorCount === 0 && (
            <Badge variant="outline" className="text-[10px] font-mono font-semibold">
              Sab Safaya (Settled)
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
