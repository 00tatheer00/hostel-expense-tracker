"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { QuickActionItem } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface QuickActionCardProps {
  action: QuickActionItem;
  className?: string;
}

export function QuickActionCard({ action, className }: QuickActionCardProps) {
  const { title, description, icon: iconName, href, disabled, badgeText } = action;
  const Icon = Icons[iconName] || Icons.plus;

  const content = (
    <Card
      className={cn(
        "group relative flex flex-col justify-between p-5 transition-all duration-200",
        disabled
          ? "cursor-not-allowed opacity-65 bg-surface/50 border-dashed"
          : "hover:border-primary/30 hover:bg-surface/60 hover:shadow-subtle cursor-pointer",
        className
      )}
    >
      <div className="flex items-start justify-between space-x-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface border border-border/50 text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-5 w-5" />
        </div>
        {badgeText ? (
          <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-mono">
            {badgeText}
          </Badge>
        ) : (
          !disabled && (
            <Icons.chevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
          )
        )}
      </div>

      <div className="mt-4 space-y-1">
        <h4 className="font-heading text-sm font-semibold text-foreground group-hover:text-primary">
          {title}
        </h4>
        <p className="caption text-xs text-muted-foreground">{description}</p>
      </div>
    </Card>
  );

  if (disabled || href === "#") {
    return <motion.div whileTap={{ scale: 0.98 }}>{content}</motion.div>;
  }

  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
      <Link href={href}>{content}</Link>
    </motion.div>
  );
}
