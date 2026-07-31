"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { ExpenseCategory } from "@/types/database";
import { Icons } from "@/lib/icons";
import { cn } from "@/lib/utils";

export interface CategoryBadgeProps {
  category: ExpenseCategory;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const config = {
    Food: {
      color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
      icon: Icons.expenses,
    },
    Rent: {
      color: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
      icon: Icons.home,
    },
    Electricity: {
      color: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
      icon: Icons.sparkles,
    },
    Internet: {
      color: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
      icon: Icons.laptop,
    },
    Other: {
      color: "bg-stone-500/10 text-stone-700 dark:text-stone-400 border-stone-500/20",
      icon: Icons.info,
    },
  };

  const current = config[category] || config.Other;
  const Icon = current.icon;

  return (
    <Badge
      variant="outline"
      className={cn("gap-1 px-2 py-0.5 font-mono text-[11px] font-medium border", current.color, className)}
    >
      <Icon className="h-3 w-3" />
      <span>{category}</span>
    </Badge>
  );
}
