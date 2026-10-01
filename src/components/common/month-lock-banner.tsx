"use client";

import * as React from "react";
import { useMonth } from "@/providers/month-provider";
import { ACTIVE_MONTH_KEY } from "@/utils/month-utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/lib/icons";

export function MonthLockBanner() {
  const { isLocked, selectedMonth, setSelectedMonth, monthLabel } = useMonth();

  if (!isLocked) return null;

  return (
    <div className="p-4 sm:p-4.5 rounded-2xl border border-amber-500/50 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 text-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 shadow-sm">
      <div className="flex items-start sm:items-center space-x-3">
        <div className="p-2.5 rounded-xl bg-amber-500 text-white font-bold shrink-0 mt-0.5 sm:mt-0 shadow-xs">
          <Icons.alertCircle className="h-5 w-5" />
        </div>
        <div className="space-y-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-1.5">
              <span>🔒 {monthLabel} Mahina Complete & Locked Hai</span>
            </h4>
            <Badge variant="warning" className="text-[10px] font-mono py-0 px-2 font-bold uppercase tracking-wider">
              Read-Only Mode
            </Badge>
          </div>
          <p className="caption text-xs text-muted-foreground leading-relaxed">
            Is mahine ka hisaab mukammal ho chuka hai aur lock hai. Koi expense edit ya delete nahi kiya ja sakta. Yeh srf archive hisaab check karne ke liye hai.
          </p>
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-2">
        <Button
          size="sm"
          onClick={() => setSelectedMonth(ACTIVE_MONTH_KEY)}
          className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-xs w-full sm:w-auto"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-200 animate-pulse" />
          <span>Switch to October 2026 (Active)</span>
        </Button>
      </div>
    </div>
  );
}
