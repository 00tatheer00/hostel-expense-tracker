"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";
import { calculateSplit } from "@/utils/calc-utils";
import { UserRow } from "@/types/database";
import { Avatar } from "@/components/ui/avatar";
import { Icons } from "@/lib/icons";

export interface SplitPreviewProps {
  amount: number;
  selectedMembers: UserRow[];
}

export function SplitPreview({ amount, selectedMembers }: SplitPreviewProps) {
  const count = selectedMembers.length;
  const validAmount = isNaN(amount) || amount <= 0 ? 0 : amount;
  const shares = calculateSplit(validAmount, count);
  const perPersonShare = shares.length > 0 ? shares[0] : 0;

  return (
    <Card className="p-4 sm:p-5 border border-primary/20 bg-primary/5 dark:bg-primary/10 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Icons.sparkles className="h-4 w-4" />
          </div>
          <span className="font-heading text-xs font-semibold uppercase tracking-wider text-foreground">
            Live Split Calculation
          </span>
        </div>

        <div className="numeric text-lg font-bold text-primary">
          {formatCurrency(perPersonShare)}
          <span className="caption text-xs font-normal text-muted-foreground font-sans ml-1">
            / person
          </span>
        </div>
      </div>

      <div className="text-xs text-muted-foreground leading-relaxed border-t border-border/40 pt-2.5 flex items-center justify-between">
        <span>
          Total <strong className="text-foreground">{formatCurrency(validAmount)}</strong> divided equally among{" "}
          <strong className="text-foreground">{count} roommate{count === 1 ? "" : "s"}</strong>.
        </span>
      </div>

      {/* Member breakdown pills */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        <AnimatePresence>
          {selectedMembers.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center space-x-1.5 px-2 py-1 rounded-full bg-background border border-border/60 text-[11px]"
            >
              <Avatar name={member.name} size="sm" className="h-4 w-4 text-[9px]" />
              <span className="font-medium text-foreground">{member.name}:</span>
              <span className="numeric font-mono text-primary font-semibold">
                {formatCurrency(shares[idx] || 0)}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
}
