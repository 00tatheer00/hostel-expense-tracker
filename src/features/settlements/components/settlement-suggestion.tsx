"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { SuggestedSettlement } from "@/types/database";
import { Icons } from "@/lib/icons";

export interface SettlementSuggestionProps {
  suggestion: SuggestedSettlement;
}

export function SettlementSuggestion({ suggestion }: SettlementSuggestionProps) {
  const { fromUser, toUser, amount, formattedAmount } = suggestion;

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className="w-full">
      <Card className="p-3.5 sm:p-5 border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 space-y-3.5 shadow-subtle rounded-2xl w-full overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5 min-w-0">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500 text-white text-xs shrink-0">
              <Icons.sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-900 dark:text-amber-300 truncate">
              Suggested Payment
            </span>
          </div>

          <span className="numeric text-base sm:text-lg font-black text-amber-700 dark:text-amber-400 shrink-0">
            {formattedAmount}
          </span>
        </div>

        {/* Sender -> Receiver flow (Fluid Mobile) */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 bg-background/80 p-2.5 sm:p-3 rounded-xl border border-border/60">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <Avatar name={fromUser.name} size="sm" className="shrink-0 h-7 w-7 sm:h-8 sm:w-8" />
            <div className="min-w-0 flex-1">
              <span className="text-xs sm:text-sm font-bold text-foreground block truncate">
                {fromUser.name}
              </span>
              <span className="caption text-[9px] sm:text-[10px] text-rose-600 dark:text-rose-400 font-mono block truncate">
                Payer
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center px-1 shrink-0 text-muted-foreground">
            <div className="p-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Icons.chevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 min-w-0 flex-1 text-right">
            <div className="min-w-0 flex-1">
              <span className="text-xs sm:text-sm font-bold text-foreground block truncate">
                {toUser.name}
              </span>
              <span className="caption text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-mono block truncate">
                Receiver
              </span>
            </div>
            <Avatar name={toUser.name} size="sm" className="shrink-0 h-7 w-7 sm:h-8 sm:w-8" />
          </div>
        </div>

        {/* Action button */}
        <Link
          href={`/settlements/new?from=${fromUser.id}&to=${toUser.id}&amount=${amount}`}
          className="block"
        >
          <Button
            size="sm"
            className="w-full text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white border-none gap-1.5 shadow-subtle h-9"
          >
            <Icons.checkCircle className="h-3.5 w-3.5" />
            <span>Settle {formattedAmount} Now</span>
          </Button>
        </Link>
      </Card>
    </motion.div>
  );
}
