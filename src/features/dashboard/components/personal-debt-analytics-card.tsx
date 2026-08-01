"use client";

import * as React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { useExpenses } from "@/features/expenses/hooks/use-expenses";
import { useSettlements } from "@/features/settlements/hooks/use-settlements";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Icons } from "@/lib/icons";
import { formatCurrency } from "@/utils/formatters";
import { InfoPopover } from "@/components/common/info-popover";

export interface PairwiseDebtItem {
  roommate: {
    id: string;
    name: string;
    email: string;
  };
  youOweThem: number; // Amount you owe to this specific roommate
  theyOweYou: number; // Amount this roommate owes to you
  netBalance: number; // >0 means they owe you, <0 means you owe them
  status: "gets_back" | "owes" | "settled";
}

export function PersonalDebtAnalyticsCard() {
  const { user } = useAuth();
  const { expenses, roommates } = useExpenses();
  const { settlements } = useSettlements();

  const currentUser = React.useMemo(() => {
    if (!user) return null;
    return roommates.find(
      (r) => r.name.toLowerCase() === user.name.toLowerCase() || r.email.toLowerCase() === user.email.toLowerCase()
    ) || { id: user.id, name: user.name, email: user.email };
  }, [user, roommates]);

  // Compute Pairwise Debt for logged in user vs each roommate
  const pairwiseData: PairwiseDebtItem[] = React.useMemo(() => {
    if (!currentUser) return [];

    const currentId = currentUser.id;
    const currentName = currentUser.name.toLowerCase();

    // Helper to match user IDs or names
    const isCurrentUser = (idOrName: string) =>
      idOrName === currentId || idOrName.toLowerCase() === currentName;

    const otherRoommates = roommates.filter(
      (r) => r.id !== currentId && r.name.toLowerCase() !== currentName
    );

    return otherRoommates.map((rm) => {
      const rmId = rm.id;
      const rmName = rm.name.toLowerCase();
      const isOtherUser = (idOrName: string) =>
        idOrName === rmId || idOrName.toLowerCase() === rmName;

      let theyOweYouGross = 0; // Expenses paid by you, split with rm
      let youOweThemGross = 0; // Expenses paid by rm, split with you

      expenses.forEach((exp) => {
        const isPaidByMe = isCurrentUser(exp.paid_by);
        const isPaidByRm = isOtherUser(exp.paid_by);

        exp.splits.forEach((sp) => {
          const isSplitMe = isCurrentUser(sp.user_id) || (sp.user?.name && isCurrentUser(sp.user.name));
          const isSplitRm = isOtherUser(sp.user_id) || (sp.user?.name && isOtherUser(sp.user.name));

          if (isPaidByMe && isSplitRm) {
            theyOweYouGross += Number(sp.share_amount);
          }
          if (isPaidByRm && isSplitMe) {
            youOweThemGross += Number(sp.share_amount);
          }
        });
      });

      // Account for settlements between me and rm
      let settlementsIpaidToRm = 0;
      let settlementsRmPaidToMe = 0;

      settlements.forEach((st) => {
        if (isCurrentUser(st.from_user) && isOtherUser(st.to_user)) {
          settlementsIpaidToRm += Number(st.amount);
        }
        if (isOtherUser(st.from_user) && isCurrentUser(st.to_user)) {
          settlementsRmPaidToMe += Number(st.amount);
        }
      });

      // Net calculation: Positive = they owe you, Negative = you owe them
      const net =
        theyOweYouGross -
        youOweThemGross +
        settlementsIpaidToRm -
        settlementsRmPaidToMe;

      const roundedNet = Math.round(net * 100) / 100;

      let status: "gets_back" | "owes" | "settled" = "settled";
      if (roundedNet > 0.01) status = "gets_back";
      else if (roundedNet < -0.01) status = "owes";

      return {
        roommate: rm,
        theyOweYou: Math.max(0, roundedNet > 0 ? roundedNet : 0),
        youOweThem: Math.max(0, roundedNet < 0 ? Math.abs(roundedNet) : 0),
        netBalance: roundedNet,
        status,
      };
    });
  }, [currentUser, roommates, expenses, settlements]);

  // Aggregate totals
  const totalYouOwe = pairwiseData.reduce((sum, item) => sum + item.youOweThem, 0);
  const totalTheyOweYou = pairwiseData.reduce((sum, item) => sum + item.theyOweYou, 0);
  const netTotalBalance = totalTheyOweYou - totalYouOwe;

  // Hide debt analytics completely when logged in as Room Admin
  if (!currentUser || user?.role === "Room Admin") return null;

  return (
    <div className="space-y-6">
      {/* Premium Minimalist Hero Section: Clean & Harmonious Theme Colors */}
      <div className="rounded-3xl bg-card border border-border/80 p-6 sm:p-7 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/40">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl sm:text-2xl font-extrabold font-heading text-foreground">
                👋 {currentUser.name}&apos;s Debt Analytics
              </span>
              <Badge variant="outline" className="text-[10px] font-mono border-indigo-500/30 text-indigo-600 dark:text-indigo-400">
                Live Analytics
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Your total debt to roommates and amounts owed to you in Room 14.
            </p>
          </div>

          <Link href="/settlements/new">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm gap-1.5 self-start sm:self-center">
              <Icons.checkCircle className="h-4 w-4" />
              <span>Settle Up</span>
            </Button>
          </Link>
        </div>

        {/* 3 Main Sleek Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Total Debt (You Owe to Roommates) */}
          <div className="rounded-2xl bg-rose-500/5 dark:bg-rose-950/20 p-4 border border-rose-500/20 dark:border-rose-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-700 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1">
                <span>🔴 Total You Owe</span>
                <InfoPopover
                  title="Total You Owe (Aap Par Qarza)"
                  explanation="Yeh woh total paise hain jo aap ne room ke baaki roommates ko dene hain. Jab unhone kharcha pay kiya aur usme aap ka share tha."
                />
              </span>
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <Icons.arrowUpRight className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-rose-600 dark:text-rose-400">
              {formatCurrency(totalYouOwe)}
            </div>
            <p className="text-[11px] text-rose-600/80 dark:text-rose-300/80 font-medium">
              {totalYouOwe > 0 ? "Payable to roommates" : "No debt pending! 🎉"}
            </p>
          </div>

          {/* Card 2: Receivables (Roommates Owe You) */}
          <div className="rounded-2xl bg-emerald-500/5 dark:bg-emerald-950/20 p-4 border border-emerald-500/20 dark:border-emerald-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                <span>🟢 Total Owed to You</span>
                <InfoPopover
                  title="Total Owed To You (Aap Ko Lene Hain)"
                  explanation="Yeh woh total paise hain jo baaki roommates ne aap ko dene hain. Jab aap ne milk/grocery bill apni pocket se pay kiya tha."
                />
              </span>
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Icons.arrowDownLeft className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
              {formatCurrency(totalTheyOweYou)}
            </div>
            <p className="text-[11px] text-emerald-600/80 dark:text-emerald-300/80 font-medium">
              {totalTheyOweYou > 0 ? "Receivable from roommates" : "No receivables currently"}
            </p>
          </div>

          {/* Card 3: Net Overall Balance */}
          <div className="rounded-2xl bg-indigo-500/5 dark:bg-indigo-950/20 p-4 border border-indigo-500/20 dark:border-indigo-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1">
                <span>⚡ Net Balance Status</span>
                <InfoPopover
                  title="Net Balance Status (Final Over-all Hisaab)"
                  explanation="Yeh aap ka poore room ke sath overall final balance hai. Green (+) ka matlab aap ne room se paise LENE hain, Red (-) ka matlab aap ne DENE hain."
                />
              </span>
              <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Icons.wallet className="h-4 w-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono">
              {netTotalBalance > 0 ? (
                <span className="text-emerald-600 dark:text-emerald-400">+{formatCurrency(netTotalBalance)}</span>
              ) : netTotalBalance < 0 ? (
                <span className="text-rose-600 dark:text-rose-400">-{formatCurrency(Math.abs(netTotalBalance))}</span>
              ) : (
                <span className="text-foreground">{formatCurrency(0)}</span>
              )}
            </div>
            <p className="text-[11px] text-indigo-600/80 dark:text-indigo-300/80 font-medium">
              {netTotalBalance > 0
                ? "Overall: Net Positive / Receivable"
                : netTotalBalance < 0
                ? "Overall: Net Payable"
                : "Overall: Completely Settled"}
            </p>
          </div>
        </div>
      </div>

      {/* Person-by-Person Pairwise Debt Breakdown */}
      <Card className="border border-border/80 bg-card shadow-sm">
        <CardHeader className="pb-3 border-b border-border/40">
          <CardTitle className="text-base font-bold flex items-center justify-between text-foreground">
            <span className="flex items-center space-x-2">
              <span>🤝 Person-by-Person Debt Breakdown</span>
              <InfoPopover
                title="1-on-1 Roommate Hisaab"
                explanation="Har roommate ke sath aap ka alag alag safi hisaab."
              />
            </span>
            <Badge variant="outline" className="text-xs font-mono">
              {pairwiseData.length} Roommates
            </Badge>
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Exact 1-on-1 debt balance with each roommate.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
          {pairwiseData.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              Room 14 mein abhi aur registered roommates nahi hain.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pairwiseData.map((item) => {
                const rm = item.roommate;
                const isGetsBack = item.status === "gets_back";
                const isOwes = item.status === "owes";

                return (
                  <div
                    key={rm.id}
                    className="p-4 rounded-2xl border border-border/80 bg-card hover:border-border transition-all shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar name={rm.name} size="md" />
                        <div>
                          <h4 className="text-sm font-bold text-foreground">{rm.name}</h4>
                          <p className="text-[11px] text-muted-foreground font-mono truncate max-w-[150px]">
                            {rm.email}
                          </p>
                        </div>
                      </div>

                      <Badge
                        variant={isGetsBack ? "success" : isOwes ? "danger" : "secondary"}
                        className="text-[10px] font-mono px-2.5 py-0.5 font-bold"
                      >
                        {isGetsBack
                          ? "Is Se Lene Hain"
                          : isOwes
                          ? "Is Ko Dene Hain"
                          : "Settled"}
                      </Badge>
                    </div>

                    <div className="space-y-2 pt-2.5 border-t border-border/40 text-xs">
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span className="font-semibold">Net Position:</span>
                        <strong
                          className={
                            isGetsBack
                              ? "text-emerald-600 dark:text-emerald-400 font-extrabold font-mono"
                              : isOwes
                              ? "text-rose-600 dark:text-rose-400 font-extrabold font-mono"
                              : "text-foreground font-bold font-mono"
                          }
                        >
                          {isGetsBack
                            ? `Is Se Lene Hain (${formatCurrency(item.theyOweYou)})`
                            : isOwes
                            ? `Is Ko Dene Hain (${formatCurrency(item.youOweThem)})`
                            : `Hisaab Barabar (${formatCurrency(0)})`}
                        </strong>
                      </div>

                      <div className="p-2.5 rounded-xl bg-surface/50 border border-border/40 space-y-1.5 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground font-medium">Is bande ka aap par qarza:</span>
                          <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                            {formatCurrency(item.youOweThem)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground font-medium">Aap ka is bande par qarza:</span>
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(item.theyOweYou)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
