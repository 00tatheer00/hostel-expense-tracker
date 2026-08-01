"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SectionCard } from "@/components/common/section-card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useExpenses } from "@/features/expenses/hooks/use-expenses";
import { listItemAnimation, staggerContainer } from "@/lib/motion";
import { Icons } from "@/lib/icons";
import { useAuth } from "@/hooks/use-auth";
import { siteConfig } from "@/config/site";
import { formatCurrency } from "@/utils/formatters";

export function RoommateOverviewCard() {
  const { user } = useAuth();
  const { roommates, roomBalances } = useExpenses();

  return (
    <SectionCard
      title="Roommates Overview"
      description={`${siteConfig.roomNumber} • Active Registered Roommates`}
      action={
        <Badge variant="outline" className="gap-1 text-[11px] font-mono">
          <Icons.users className="h-3 w-3 text-muted-foreground" />
          <span>{roommates.length} Active</span>
        </Badge>
      }
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1"
      >
        {roommates.map((member) => {
          const isCurrentUser =
            user?.name.toLowerCase() === member.name.toLowerCase() ||
            user?.email.toLowerCase() === member.email.toLowerCase();

          const b = roomBalances.find((rb) => rb.user.id === member.id);
          const net = b ? b.netBalance : 0;
          const isPositive = net > 0.01;
          const isNegative = net < -0.01;

          return (
            <motion.div
              key={member.id}
              variants={listItemAnimation}
              className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-surface/40 hover:bg-surface/80 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Avatar name={member.name} size="md" />
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-sm font-semibold text-foreground">
                      {member.name}
                    </span>
                    {isCurrentUser && (
                      <Badge variant="muted" className="text-[10px] py-0 px-1 font-mono">
                        You
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {member.email}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-1">
                <Badge
                  variant={isPositive ? "success" : isNegative ? "danger" : "secondary"}
                  className="text-[9px] font-mono px-1.5"
                >
                  {isPositive ? "Lene Hain" : isNegative ? "Dene Hain" : "Settled"}
                </Badge>
                <span
                  className={`numeric text-xs font-mono font-bold ${
                    isPositive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : isNegative
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {isPositive ? `+${formatCurrency(net)}` : isNegative ? `-${formatCurrency(Math.abs(net))}` : formatCurrency(0)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </SectionCard>
  );
}
