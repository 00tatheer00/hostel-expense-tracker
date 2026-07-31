"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/lib/icons";

export interface FavoriteTemplate {
  id: string;
  name: string;
  category: string;
  defaultAmount?: number;
  iconName: string;
}

export const FAVORITE_TEMPLATES: FavoriteTemplate[] = [
  { id: "fav-1", name: "Milk", category: "Food", defaultAmount: 150, iconName: "food" },
  { id: "fav-2", name: "Water Can", category: "Food", defaultAmount: 60, iconName: "food" },
  { id: "fav-3", name: "Internet Bill", category: "Internet", defaultAmount: 1200, iconName: "internet" },
  { id: "fav-4", name: "Electricity Bill", category: "Electricity", defaultAmount: 2500, iconName: "electricity" },
  { id: "fav-5", name: "Gas Cylinder", category: "Rent", defaultAmount: 3000, iconName: "building" },
  { id: "fav-6", name: "Hostel Rent", category: "Rent", defaultAmount: 18000, iconName: "building" },
];

export function QuickAddBar() {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="caption text-xs font-mono font-semibold uppercase text-muted-foreground flex items-center space-x-1.5">
          <Icons.sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Favorite Expense Templates</span>
        </span>
        <Badge variant="outline" className="text-[10px] font-mono">
          One-Tap Prefill
        </Badge>
      </div>

      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {FAVORITE_TEMPLATES.map((tmpl) => (
          <motion.div key={tmpl.id} whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
            <Link
              href={`/expenses/new?desc=${encodeURIComponent(tmpl.name)}&cat=${tmpl.category}&amt=${tmpl.defaultAmount || ""}`}
              className="inline-flex items-center space-x-2 px-3 py-2 rounded-xl border border-border/70 bg-card hover:bg-surface/80 text-xs font-semibold whitespace-nowrap shadow-subtle transition-all"
            >
              <span>{tmpl.name}</span>
              {tmpl.defaultAmount && (
                <span className="numeric text-[11px] font-mono text-muted-foreground">
                  (Rs. {tmpl.defaultAmount})
                </span>
              )}
              <Icons.plus className="h-3 w-3 text-primary ml-1" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
