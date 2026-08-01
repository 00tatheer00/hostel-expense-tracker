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

  if (!currentUser) return null;

  return (
    <div className="space-y-6">
      {/* Vibrant Hero Section: Personal Hisaab & Debt Summary */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-6 sm:p-8 text-white shadow-2xl border border-indigo-500/30">
        {/* Decorative Background Glowing Orbs */}
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-rose-500/20 blur-3xl" />

        <div className="relative z-10 space-y-6">
          {/* Header Title & Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-black font-heading tracking-wide">
                  👋 {currentUser.name} Ka Personal Hisaab
                </span>
                <Badge className="bg-indigo-500/30 text-indigo-200 border-indigo-400/40 text-[10px] font-mono">
                  Live Analytics
                </Badge>
              </div>
              <p className="text-xs text-indigo-200/80 mt-1">
                Aap ke upar kitna total qarza hai aur baakiyon par aap ke kitne paise hain.
              </p>
            </div>

            <Link href="/settlements/new">
              <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-lg border-0 gap-1.5 self-start sm:self-center">
                <Icons.checkCircle className="h-4 w-4" />
                <span>Hisab Safaya Karein</span>
              </Button>
            </Link>
          </div>

          {/* 3 Main Vibrant Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Card 1: Total Qarza (You Owe to Roommates) */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-rose-500/20 to-rose-950/40 p-4 border border-rose-500/40 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-200 uppercase tracking-wider">
                  🔴 Aap Par Total Qarza
                </span>
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                  <Icons.arrowUpRight className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black font-mono text-rose-400">
                {formatCurrency(totalYouOwe)}
              </div>
              <p className="text-[10px] text-rose-300/80 mt-1">
                {totalYouOwe > 0 ? "Roommates ko DENE HAIN" : "Aap par koi qarza nahi hai! 🎉"}
              </p>
            </div>

            {/* Card 2: Baakiyon par Aap Ka Qarza (Roommates Owe You) */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-emerald-500/20 to-emerald-950/40 p-4 border border-emerald-500/40 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">
                  🟢 Baakiyon Par Aap Ka Qarza
                </span>
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Icons.arrowDownLeft className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                {formatCurrency(totalTheyOweYou)}
              </div>
              <p className="text-[10px] text-emerald-300/80 mt-1">
                {totalTheyOweYou > 0 ? "Roommates se LENE HAIN" : "Baakiyon par abhi koi len den nahi hai"}
              </p>
            </div>

            {/* Card 3: Net Overall Balance */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-indigo-500/20 to-indigo-950/40 p-4 border border-indigo-500/40 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">
                  ⚡ Aap Ka Net Balance Status
                </span>
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300">
                  <Icons.wallet className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-black font-mono">
                {netTotalBalance > 0 ? (
                  <span className="text-emerald-400">+{formatCurrency(netTotalBalance)}</span>
                ) : netTotalBalance < 0 ? (
                  <span className="text-rose-400">-{formatCurrency(Math.abs(netTotalBalance))}</span>
                ) : (
                  <span className="text-indigo-200">{formatCurrency(0)}</span>
                )}
              </div>
              <p className="text-[10px] text-indigo-200/80 mt-1 font-semibold">
                {netTotalBalance > 0
                  ? "Overall: Aap Profit / Plus mein hain"
                  : netTotalBalance < 0
                  ? "Overall: Aap par net dene waji hain"
                  : "Overall: Hisaab ekdam barabar hai"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 1-on-1 Person-by-Person Debt Breakdown Grid */}
      <Card className="border border-border/80 bg-card shadow-card">
        <CardHeader className="pb-3 border-b border-border/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <span>🤝 Ek Ek Roommate Ka Person-by-Person Hisaab</span>
                <Badge variant="outline" className="text-xs font-mono">
                  {pairwiseData.length} Roommates
                </Badge>
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Konse特定 roommate ka aap par kitna qarza hai aur aap ka us par kitna hai.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {pairwiseData.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">
              Abhi koi doosra roommate registered nahi hai.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pairwiseData.map((item) => {
                const isLene = item.status === "gets_back";
                const isDene = item.status === "owes";
                const isSettled = item.status === "settled";

                return (
                  <div
                    key={item.roommate.id}
                    className={`p-4 rounded-2xl border transition-all duration-200 ${
                      isLene
                        ? "border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10"
                        : isDene
                        ? "border-rose-500/40 bg-rose-500/5 hover:bg-rose-500/10"
                        : "border-border/60 bg-surface/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar name={item.roommate.name} size="md" />
                        <div>
                          <h4 className="text-sm font-bold text-foreground">
                            {item.roommate.name}
                          </h4>
                          <p className="text-[10px] text-muted-foreground font-mono">
                            {item.roommate.email}
                          </p>
                        </div>
                      </div>

                      <Badge
                        variant={isLene ? "success" : isDene ? "danger" : "secondary"}
                        className="text-[10px] font-mono px-2 py-0.5"
                      >
                        {isLene
                          ? "Lene Hain"
                          : isDene
                          ? "Dene Hain"
                          : "Settled"}
                      </Badge>
                    </div>

                    {/* Breakdown Detail Rows */}
                    <div className="mt-4 pt-3 border-t border-border/40 space-y-2 text-xs">
                      {/* Status Message */}
                      <div className="p-2.5 rounded-xl bg-background/60 border border-border/40 flex items-center justify-between">
                        <span className="text-muted-foreground font-medium">Net Position:</span>
                        <span className="font-mono font-bold">
                          {isLene ? (
                            <span className="text-emerald-600 dark:text-emerald-400">
                              Is se +{formatCurrency(item.theyOweYou)} LENE HAIN
                            </span>
                          ) : isDene ? (
                            <span className="text-rose-600 dark:text-rose-400">
                              Is ko -{formatCurrency(item.youOweThem)} DENE HAIN
                            </span>
                          ) : (
                            <span className="text-muted-foreground">
                              Hisaab Barabar (0 PKR)
                            </span>
                          )}
                        </span>
                      </div>

                      {/* Detail Details */}
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">
                          Is bande ka aap par qarza:
                        </span>
                        <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">
                          {item.youOweThem > 0 ? formatCurrency(item.youOweThem) : "Rs. 0"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">
                          Aap ka is bande par qarza:
                        </span>
                        <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                          {item.theyOweYou > 0 ? formatCurrency(item.theyOweYou) : "Rs. 0"}
                        </span>
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
