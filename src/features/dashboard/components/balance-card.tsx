"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserBalanceSummary } from "@/types/database";
import { formatCurrency } from "@/utils/formatters";
import { Icons } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface BalanceCardProps {
  summary: UserBalanceSummary;
}

export function BalanceCard({ summary }: BalanceCardProps) {
  const { user, netBalance } = summary;
  const isPositive = netBalance > 0.01;
  const isNegative = netBalance < -0.01;

  let badgeVariant: "success" | "danger" | "muted" = "muted";
  let badgeLabel = "Settled";
  let badgeIcon = Icons.checkCircle;
  let textClass = "text-muted-foreground";

  if (isPositive) {
    badgeVariant = "success";
    badgeLabel = "Should Receive";
    badgeIcon = Icons.arrowDownLeft;
    textClass = "text-emerald-700 dark:text-emerald-400";
  } else if (isNegative) {
    badgeVariant = "danger";
    badgeLabel = "Needs to Pay";
    badgeIcon = Icons.arrowUpRight;
    textClass = "text-rose-700 dark:text-rose-400";
  }

  const BadgeIcon = badgeIcon;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="flex items-center justify-between p-4 rounded-xl border border-border/70 bg-card hover:bg-surface/50 transition-all shadow-subtle"
    >
      <div className="flex items-center space-x-3.5 min-w-0">
        <Avatar name={user.name} size="md" />
        <div className="space-y-0.5 truncate">
          <h4 className="text-sm font-semibold text-foreground truncate">
            {user.name}
          </h4>
          <div className="flex items-center space-x-2">
            <Badge
              variant={badgeVariant}
              className="gap-1 font-mono text-[10px] py-0 px-2 font-medium"
            >
              <BadgeIcon className="h-3 w-3" />
              <span>{badgeLabel}</span>
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end shrink-0 pl-2">
        <span className={cn("numeric text-base sm:text-lg font-bold tracking-tight", textClass)}>
          {isPositive ? `+ ${formatCurrency(netBalance)}` : isNegative ? `- ${formatCurrency(Math.abs(netBalance))}` : formatCurrency(0)}
        </span>
        <span className="caption text-[11px] text-muted-foreground font-mono">
          Net Balance
        </span>
      </div>
    </motion.div>
  );
}
