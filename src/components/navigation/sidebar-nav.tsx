"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/constants/navigation";
import { siteConfig } from "@/config/site";
import { useAuth } from "@/hooks/use-auth";
import { useExpenses } from "@/features/expenses/hooks/use-expenses";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatters";
import { InfoPopover } from "@/components/common/info-popover";

export function SidebarNav() {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();
  const { roomBalances } = useExpenses();
  const [pendingCount, setPendingCount] = React.useState<number>(0);

  const checkPendingUsers = React.useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("kamrakhata_custom_roommates") || "[]");
        const pending = stored.filter((u: any) => u.status === "pending").length;
        setPendingCount(pending);
      } catch (e) {
        console.error("Failed to parse custom roommates", e);
      }
    }
  }, []);

  React.useEffect(() => {
    checkPendingUsers();
    window.addEventListener("storage", checkPendingUsers);
    window.addEventListener("kamrakhata_data_change", checkPendingUsers);

    return () => {
      window.removeEventListener("storage", checkPendingUsers);
      window.removeEventListener("kamrakhata_data_change", checkPendingUsers);
    };
  }, [checkPendingUsers]);

  if (!user) {
    return null;
  }

  // Find user's balance summary
  const myBalanceSummary = roomBalances.find(
    (b) => b.user.name.toLowerCase() === user.name.toLowerCase() || b.user.email.toLowerCase() === user.email.toLowerCase()
  );
  const netBalance = myBalanceSummary ? myBalanceSummary.netBalance : 0;
  const isPositive = netBalance > 0.01;
  const isNegative = netBalance < -0.01;

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-64 z-40 hidden md:flex flex-col justify-between h-screen border-r border-white/10 bg-slate-900/85 backdrop-blur-2xl p-4 overflow-y-auto selection:bg-muted">
      <div className="space-y-6">
        {/* Header Branding */}
        <div className="space-y-2 pb-4 border-b border-border/40">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg transition-transform group-hover:scale-105">
              <Icons.building className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-extrabold tracking-tight text-foreground">
                {siteConfig.name}
              </span>
              <span className="caption text-[11px] font-mono text-muted-foreground -mt-0.5">
                {siteConfig.roomNumber} • {siteConfig.hostelName}
              </span>
            </div>
          </Link>
          <Badge variant="success" className="text-[10px] font-mono gap-1 w-fit bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Room 14 Live</span>
          </Badge>
        </div>

        {/* User Profile Card */}
        <div className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-gradient-to-r from-surface/60 to-surface/30">
          <div className="flex items-center space-x-2.5 min-w-0">
            <Avatar name={user.name} size="sm" />
            <div className="truncate">
              <h4 className="text-xs font-bold text-foreground truncate">{user.name}</h4>
              <p className="caption text-[10px] text-muted-foreground leading-none">{user.role}</p>
            </div>
          </div>
          <Badge variant="outline" className="text-[9px] font-mono px-1.5 border-emerald-500/40 text-emerald-600 dark:text-emerald-400">
            Active
          </Badge>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          <div className="px-2 pb-1 text-[10px] font-mono font-semibold uppercase text-muted-foreground tracking-wider">
            Navigation
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = Icons[item.icon] || Icons.dashboard;
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            const isApprovalsItem = item.href === "/approvals";

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-150",
                  isActive
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface/80"
                )}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-4 w-4 text-inherit shrink-0" />
                  <span>{item.title}</span>
                </div>

                {isApprovalsItem && pendingCount > 0 && (
                  <span className="h-5 px-1.5 rounded-full bg-amber-500 text-slate-900 text-[10px] font-mono font-bold flex items-center justify-center animate-pulse shadow-sm">
                    {pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Area: Personal Balance & Logout */}
      <div className="space-y-3 pt-4 border-t border-border/40">
        {/* Personal Hisaab Summary Widget */}
        <div className="p-3 rounded-xl border border-border/60 bg-surface/30 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
            <span className="flex items-center">
              <span>Your Net Balance</span>
              <InfoPopover
                title="Your Net Balance"
                explanation="Green = You get money back. Red = You owe money."
              />
            </span>
          </div>
          <div className="text-base font-bold font-mono">
            {isPositive ? (
              <span className="text-emerald-600 dark:text-emerald-400">+ {formatCurrency(netBalance)}</span>
            ) : isNegative ? (
              <span className="text-rose-600 dark:text-rose-400">- {formatCurrency(Math.abs(netBalance))}</span>
            ) : (
              <span className="text-muted-foreground">{formatCurrency(0)}</span>
            )}
          </div>
          <div className="text-[10px] text-muted-foreground">
            {isPositive ? "Receivable from roommates" : isNegative ? "Payable to roommates" : "All settled up"}
          </div>
        </div>

        {/* Log Out Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => logout()}
          disabled={isLoading}
          className="w-full justify-start text-xs font-semibold text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/10 gap-2"
        >
          <Icons.logout className="h-4 w-4 shrink-0" />
          <span>Log Out</span>
        </Button>
      </div>
    </aside>
  );
}
