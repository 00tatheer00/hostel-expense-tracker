"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserBalanceSummary } from "@/types/database";
import { formatCurrency } from "@/utils/formatters";
import { Icons } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { InfoPopover } from "@/components/common/info-popover";

export interface BalanceCardProps {
  summary: UserBalanceSummary;
}

export function BalanceCard({ summary }: BalanceCardProps) {
  const { user, netBalance } = summary;
  const isPositive = netBalance > 0.01;
  const isNegative = netBalance < -0.01;

  let badgeVariant: "success" | "danger" | "muted" = "muted";
  let badgeLabel = "Hisaab Barabar";
  let badgeIcon = Icons.checkCircle;
  let textClass = "text-muted-foreground";
  let infoExplanation = "Is roommate ka khaata bilkul clear aur barabar hai.";

  if (isPositive) {
    badgeVariant = "success";
    badgeLabel = "Paise LENE HAIN";
    badgeIcon = Icons.arrowDownLeft;
    textClass = "text-emerald-700 dark:text-emerald-400";
    infoExplanation = `${user.name} ne room ke liye ziada kharcha kiya hai. Usay baqi roommates se paise milne hain.`;
  } else if (isNegative) {
    badgeVariant = "danger";
    badgeLabel = "Paise DENE HAIN";
    badgeIcon = Icons.arrowUpRight;
    textClass = "text-rose-700 dark:text-rose-400";
    infoExplanation = `${user.name} ko room ke kharchon mein se baqi roommates ko paise waapas adaa karne hain.`;
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
          <div className="flex items-center">
            <h4 className="text-sm font-semibold text-foreground truncate">
              {user.name}
            </h4>
            <InfoPopover title={`${user.name} Ka Status`} explanation={infoExplanation} />
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant={badgeVariant}
              className="gap-1 font-mono text-[10px] py-0 px-2 font-semibold"
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
          Net Hisaab
        </span>
      </div>
    </motion.div>
  );
}
