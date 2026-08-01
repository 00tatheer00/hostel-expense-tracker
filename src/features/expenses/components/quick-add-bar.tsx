"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/lib/icons";
import { InfoPopover } from "@/components/common/info-popover";

export interface FavoriteTemplate {
  id: string;
  name: string;
  category: string;
  defaultAmount?: number;
  iconName: string;
}

export const FAVORITE_TEMPLATES: FavoriteTemplate[] = [
  { id: "fav-1", name: "Doodh (Milk)", category: "Food", defaultAmount: 150, iconName: "food" },
  { id: "fav-2", name: "Pani Bottle (Water)", category: "Food", defaultAmount: 60, iconName: "food" },
  { id: "fav-3", name: "Roti / Naan", category: "Food", defaultAmount: 200, iconName: "food" },
  { id: "fav-4", name: "Sabzi / Salan", category: "Food", defaultAmount: 400, iconName: "food" },
  { id: "fav-5", name: "Internet Bill", category: "Internet", defaultAmount: 1200, iconName: "internet" },
  { id: "fav-6", name: "Bijli Bill", category: "Electricity", defaultAmount: 2500, iconName: "electricity" },
  { id: "fav-7", name: "Gas Cylinder", category: "Rent", defaultAmount: 3000, iconName: "building" },
  { id: "fav-8", name: "Hostel Room Rent", category: "Rent", defaultAmount: 18000, iconName: "building" },
];

export function QuickAddBar() {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="caption text-xs font-mono font-semibold uppercase text-muted-foreground flex items-center space-x-1.5">
          <Icons.sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Quick Expense Shortcuts</span>
          <InfoPopover
            title="1-Tap Shortcuts"
            explanation="Tap any shortcut pill to quickly record recurring purchases like Milk, Bread, Water, Bills, etc."
          />
        </span>
        <Badge variant="outline" className="text-[10px] font-mono font-semibold">
          1-Tap Entry
        </Badge>
      </div>

      <div className="flex items-center space-x-2 overflow-x-auto pb-2 touch-pan-x no-scrollbar scroll-smooth">
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
