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
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card className="p-4 sm:p-5 border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 space-y-4 shadow-subtle">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500 text-white text-xs">
              <Icons.sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-900 dark:text-amber-300">
              Suggested Payment
            </span>
          </div>

          <span className="numeric text-base font-bold text-amber-700 dark:text-amber-400">
            {formattedAmount}
          </span>
        </div>

        {/* Sender -> Receiver flow */}
        <div className="flex items-center justify-between bg-background/80 p-3 rounded-xl border border-border/60">
          <div className="flex items-center space-x-2 min-w-0">
            <Avatar name={fromUser.name} size="sm" />
            <div className="truncate">
              <span className="text-xs font-bold text-foreground block truncate">
                {fromUser.name}
              </span>
              <span className="caption text-[10px] text-rose-600 dark:text-rose-400 font-mono">
                Payer
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center px-2 text-muted-foreground">
            <Icons.chevronRight className="h-4 w-4" />
          </div>

          <div className="flex items-center space-x-2 min-w-0 text-right">
            <div className="truncate">
              <span className="text-xs font-bold text-foreground block truncate">
                {toUser.name}
              </span>
              <span className="caption text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                Receiver
              </span>
            </div>
            <Avatar name={toUser.name} size="sm" />
          </div>
        </div>

        {/* Action button */}
        <Link
          href={`/settlements/new?from=${fromUser.id}&to=${toUser.id}&amount=${amount}`}
          className="block"
        >
          <Button
            size="sm"
            className="w-full text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white border-none gap-1.5 shadow-subtle"
          >
            <Icons.checkCircle className="h-3.5 w-3.5" />
            <span>Settle {formattedAmount} Now</span>
          </Button>
        </Link>
      </Card>
    </motion.div>
  );
}
