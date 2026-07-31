"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { SettlementRow, UserRow } from "@/types/database";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Icons } from "@/lib/icons";
import { Button } from "@/components/ui/button";

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

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
      <Card className="p-4 sm:p-5 border border-border/80 bg-card hover:bg-surface/50 transition-all shadow-subtle flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="caption text-xs font-mono text-muted-foreground">
              {formatDate(settlement.created_at)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="numeric text-base sm:text-lg font-bold text-emerald-700 dark:text-emerald-400">
              {formatCurrency(Number(settlement.amount))}
            </span>
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(settlement.id)}
                className="h-7 w-7 text-muted-foreground hover:text-rose-600 dark:hover:text-rose-400"
                title="Delete Settlement"
              >
                <Icons.logout className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>

        {/* Sender -> Receiver */}
        <div className="flex items-center space-x-3 pt-1">
          <div className="flex items-center space-x-2 min-w-0">
            <Avatar name={fromUser.name} size="sm" />
            <span className="text-xs font-semibold truncate">{fromUser.name}</span>
          </div>

          <span className="text-xs text-muted-foreground font-mono">paid</span>

          <div className="flex items-center space-x-2 min-w-0">
            <Avatar name={toUser.name} size="sm" />
            <span className="text-xs font-semibold truncate">{toUser.name}</span>
          </div>
        </div>

        {settlement.note && (
          <p className="caption text-xs text-muted-foreground italic border-t border-border/40 pt-2">
            &quot;{settlement.note}&quot;
          </p>
        )}
      </Card>
    </motion.div>
  );
}
