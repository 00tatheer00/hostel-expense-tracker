"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { SettlementRow, UserRow } from "@/types/database";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { isExpenseLocked } from "@/utils/month-utils";
import { Icons } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface SettlementCardProps {
  settlement: SettlementRow;
  roommates: UserRow[];
  onDelete?: (id: string) => void;
}

export function SettlementCard({
  settlement,
  roommates,
  onDelete,
}: SettlementCardProps) {
  const fromUser = roommates.find((r) => r.id === settlement.from_user) || {
    name: "Roommate",
  };
  const toUser = roommates.find((r) => r.id === settlement.to_user) || {
    name: "Roommate",
  };
  const isLocked = isExpenseLocked(settlement.created_at);

  // Extract payment method from note if stored in "[Method] Note" format
  let paymentMethod = "Direct Settlement";
  let cleanNote = settlement.note || "";

  if (cleanNote.startsWith("[")) {
    const endBracket = cleanNote.indexOf("]");
    if (endBracket !== -1) {
      paymentMethod = cleanNote.substring(1, endBracket);
      cleanNote = cleanNote.substring(endBracket + 1).trim();
    }
  }

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
      <Card className="p-4 sm:p-5 border border-border/80 bg-card hover:bg-surface/50 transition-all shadow-subtle flex flex-col justify-between space-y-3.5 rounded-2xl">
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="caption text-xs font-mono text-muted-foreground">
              {formatDate(settlement.created_at)}
            </span>
            <Badge variant="outline" className="text-[10px] font-mono px-2 py-0 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10">
              {paymentMethod}
            </Badge>
            {isLocked && (
              <Badge variant="outline" className="text-[9px] font-mono border-amber-500/40 text-amber-700 dark:text-amber-300 py-0 px-1 bg-amber-500/10">
                🔒 August Archive
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <span className="numeric text-base sm:text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(Number(settlement.amount))}
            </span>
            {!isLocked && onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(settlement.id)}
                className="h-7 w-7 text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400"
                title="Delete Settlement Entry"
              >
                <Icons.trash className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Sender -> Receiver Visual Transaction Flow */}
        <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-surface/50 border border-border/40">
          {/* Sender */}
          <div className="flex items-center space-x-2.5 min-w-0 flex-1">
            <Avatar name={fromUser.name} size="sm" className="shrink-0" />
            <div className="truncate">
              <span className="text-xs font-bold text-foreground block truncate">{fromUser.name}</span>
              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-mono font-semibold">
                Wapis Diye (Payer)
              </span>
            </div>
          </div>

          {/* Transfer Icon */}
          <div className="flex flex-col items-center px-1 text-muted-foreground shrink-0">
            <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Icons.arrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {/* Receiver */}
          <div className="flex items-center justify-end space-x-2.5 min-w-0 flex-1 text-right">
            <div className="truncate">
              <span className="text-xs font-bold text-foreground block truncate">{toUser.name}</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                Wapis Mile (Receiver)
              </span>
            </div>
            <Avatar name={toUser.name} size="sm" className="shrink-0" />
          </div>
        </div>

        {/* Note / TID Reference Proof */}
        {cleanNote && cleanNote !== "Direct Settlement Payment" && (
          <div className="p-2.5 rounded-xl bg-muted/40 border border-border/30 text-xs text-muted-foreground flex items-start space-x-2">
            <Icons.info className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
            <span className="italic break-words">
              &quot;{cleanNote}&quot;
            </span>
          </div>
        )}

        {/* Audit Status Verification */}
        <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-1 border-t border-border/30">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <Icons.checkCircle className="h-3 w-3" />
            <span>Balance Deducted & Verified</span>
          </span>
          <span className="text-[10px]">Room 14 Ledger</span>
        </div>
      </Card>
    </motion.div>
  );
}
