"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatCardData } from "@/types";
import { Icons } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface StatCardProps extends StatCardData {
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: iconName,
  badgeText,
  variant = "default",
  className,
}: StatCardProps) {
  const Icon = Icons[iconName] || Icons.info;

  const iconVariants = {
    default: "bg-surface text-muted-foreground",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    danger: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <Card
        className={cn(
          "relative overflow-hidden border border-border/80 bg-card p-5 sm:p-6 transition-all hover:border-border hover:shadow-subtle",
          className
        )}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </span>
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl transition-colors",
              iconVariants[variant]
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <div className="numeric text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {value}
          </div>
          <div className="flex items-center justify-between">
            {subtitle && (
              <p className="caption text-xs text-muted-foreground">{subtitle}</p>
            )}
            {badgeText && (
              <Badge variant="secondary" className="text-[10px] py-0 px-2 font-medium">
                {badgeText}
              </Badge>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
