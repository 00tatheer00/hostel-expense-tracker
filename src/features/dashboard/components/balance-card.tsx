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
  let textClass = "text-slate-600 dark:text-muted-foreground";
  let infoExplanation = "Is roommate ka khaata bilkul clear aur barabar hai.";

  if (isPositive) {
    badgeVariant = "success";
    badgeLabel = "Paise LENE HAIN";
    badgeIcon = Icons.arrowDownLeft;
    textClass = "text-emerald-600 dark:text-emerald-400";
    infoExplanation = `${user.name} ne room ke liye ziada kharcha kiya hai. Usay baqi roommates se paise milne hain.`;
  } else if (isNegative) {
    badgeVariant = "danger";
    badgeLabel = "Paise DENE HAIN";
    badgeIcon = Icons.arrowUpRight;
    textClass = "text-rose-600 dark:text-rose-400";
    infoExplanation = `${user.name} ko room ke kharchon mein se baqi roommates ko paise waapas adaa karne hain.`;
  }

  const BadgeIcon = badgeIcon;

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "p-4 rounded-2xl border transition-all shadow-md flex flex-col justify-between gap-3 h-full",
        isPositive
          ? "border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent hover:border-emerald-500/60"
          : isNegative
          ? "border-rose-500/40 bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-transparent hover:border-rose-500/60"
          : "border-border/80 bg-card hover:bg-surface/60"
      )}
    >
      {/* Top Header Row: User Avatar, Name & Net Amount */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="relative shrink-0">
            <Avatar name={user.name} size="md" />
            <span
              className={cn(
                "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background",
                isPositive ? "bg-emerald-500 animate-pulse" : isNegative ? "bg-rose-500" : "bg-slate-400"
              )}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center">
              <h4 className="text-sm font-extrabold text-foreground truncate">
                {user.name}
              </h4>
              <InfoPopover title={`${user.name} Ka Status`} explanation={infoExplanation} />
            </div>
            <p className="text-[10px] text-muted-foreground font-mono truncate">
              {user.email}
            </p>
          </div>
        </div>

        {/* Right side Net Balance Amount */}
        <div className="text-right shrink-0">
          <div className={cn("text-base sm:text-lg font-black font-mono tracking-tight", textClass)}>
            {isPositive ? `+ ${formatCurrency(netBalance)}` : isNegative ? `- ${formatCurrency(Math.abs(netBalance))}` : formatCurrency(0)}
          </div>
          <div className="text-[9px] text-muted-foreground font-mono uppercase font-bold tracking-wider">
            Net Balance
          </div>
        </div>
      </div>

      {/* Bottom Row: Status Badge */}
      <div className="pt-2 border-t border-border/40 flex items-center justify-between">
        <Badge
          variant={badgeVariant}
          className="gap-1 font-mono text-[10px] py-1 px-3 font-bold shadow-sm"
        >
          <BadgeIcon className="h-3 w-3" />
          <span>{badgeLabel}</span>
        </Badge>
      </div>
    </motion.div>
  );
}
