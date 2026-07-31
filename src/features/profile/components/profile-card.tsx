"use client";

import * as React from "react";
import { SectionCard } from "@/components/common/section-card";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/common/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useExpenses } from "@/features/expenses/hooks/use-expenses";
import { formatCurrency } from "@/utils/formatters";
import { siteConfig } from "@/config/site";
import { Icons } from "@/lib/icons";

export function ProfileCard() {
  const { user, logout, isLoading } = useAuth();
  const { expenses, roommates, roomBalances } = useExpenses();

  const activeUserName = user?.name || "Waheed";
  const activeUserObj =
    roommates.find((r) => r.name.toLowerCase() === activeUserName.toLowerCase()) || roommates[0];

  const userSummary = roomBalances.find((b) => b.user.id === activeUserObj?.id);
  const userExpensesAdded = expenses.filter(
    (e) => e.paid_by === activeUserObj?.id || e.payer?.name === activeUserObj?.name
  );

  const totalPaid = userExpensesAdded.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalOwes = userSummary?.totalOwed || 0;
  const totalReceives = userSummary?.totalPaid && userSummary.totalPaid > totalOwes ? userSummary.totalPaid - totalOwes : 0;
  const netBalance = userSummary?.netBalance || 0;

  return (
    <div className="space-y-6">
      {/* Primary Profile Card */}
      <SectionCard
        title="Your Active Session"
        description="Roommate account details & live financial metrics"
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => logout()}
            disabled={isLoading}
            className="gap-2 text-rose-600 dark:text-rose-400 border-rose-500/20 hover:bg-rose-500/10"
          >
            <Icons.logout className="h-4 w-4" />
            <span>Log Out</span>
          </Button>
        }
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2">
          <div className="flex items-center space-x-4">
            <Avatar name={activeUserObj.name} size="lg" />
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-heading text-lg font-bold">{activeUserObj.name}</h3>
                <StatusBadge status={user?.role === "Room Admin" ? "Admin" : "Active"} />
              </div>
              <p className="caption text-xs font-mono text-muted-foreground">
                {user?.email || "waheed@kamrakhata.internal"} • {siteConfig.roomNumber} ({siteConfig.hostelName})
              </p>
            </div>
          </div>
        </div>

        {/* Financial Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 mt-4 border-t border-border/40">
          <div className="p-3 rounded-xl bg-surface/50 border border-border/40 space-y-0.5">
            <span className="caption text-[10px] uppercase font-mono text-muted-foreground">
              Total Paid Out
            </span>
            <div className="numeric text-lg font-bold text-foreground">
              {formatCurrency(totalPaid)}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface/50 border border-border/40 space-y-0.5">
            <span className="caption text-[10px] uppercase font-mono text-muted-foreground">
              Total Dues Owed
            </span>
            <div className="numeric text-lg font-bold text-rose-600 dark:text-rose-400">
              {formatCurrency(totalOwes)}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface/50 border border-border/40 space-y-0.5">
            <span className="caption text-[10px] uppercase font-mono text-muted-foreground">
              Receivables
            </span>
            <div className="numeric text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalReceives)}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface/50 border border-border/40 space-y-0.5">
            <span className="caption text-[10px] uppercase font-mono text-muted-foreground">
              Net Balance
            </span>
            <div className="numeric text-lg font-bold text-foreground">
              {formatCurrency(netBalance)}
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
