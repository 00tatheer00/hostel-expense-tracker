"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SectionCard } from "@/components/common/section-card";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/common/status-badge";
import { Badge } from "@/components/ui/badge";
import { MOCK_ROOMMATES } from "@/constants/mock-data";
import { listItemAnimation, staggerContainer } from "@/lib/motion";
import { Icons } from "@/lib/icons";
import { useAuth } from "@/hooks/use-auth";

export function RoommateOverviewCard() {
  const { user } = useAuth();

  return (
    <SectionCard
      title="Roommates Overview"
      description="Room 304 • 6 Fixed Roommates"
      action={
        <Badge variant="outline" className="gap-1 text-[11px] font-mono">
          <Icons.users className="h-3 w-3 text-muted-foreground" />
          <span>6 Active</span>
        </Badge>
      }
    >
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1"
      >
        {MOCK_ROOMMATES.map((member) => {
          const isCurrentUser =
            user?.name.toLowerCase() === member.name.toLowerCase();

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
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">
                      {member.role}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-1">
                <StatusBadge status={member.status} />
                <span className="numeric text-xs text-muted-foreground font-medium">
                  Rs. {member.netBalance}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </SectionCard>
  );
}
