"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserProfile } from "@/types/auth";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Icons } from "@/lib/icons";
import { siteConfig } from "@/config/site";
import { InfoPopover } from "@/components/common/info-popover";
import { WeeklyReportCard } from "@/features/admin/components/weekly-report-card";
import { AdminMoneyAdjustmentCard } from "@/features/admin/components/admin-money-adjustment-card";
import { useExpenses } from "@/features/expenses/hooks/use-expenses";
import { useSettlements } from "@/features/settlements/hooks/use-settlements";
import { formatCurrency } from "@/utils/formatters";
import { fadeIn, scaleIn } from "@/lib/motion";

export function AdminApprovalPanel() {
  const { user, approveUser, rejectUser } = useAuth();
  const { roommates, roomBalances, expenses } = useExpenses();
  const { settlements } = useSettlements();
  const [allUsers, setAllUsers] = React.useState<UserProfile[]>([]);
  const [activeTab, setActiveTab] = React.useState<"approvals" | "transfer" | "breakdown" | "reports">("approvals");

  const refreshUsers = React.useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        const stored: UserProfile[] = JSON.parse(localStorage.getItem("kamrakhata_custom_roommates") || "[]");
        setAllUsers(stored);
      } catch (e) {
        console.error("Failed to fetch custom users", e);
      }
    }
  }, []);

  React.useEffect(() => {
    refreshUsers();
  }, [refreshUsers]);

  const handleApprove = async (userId: string) => {
    await approveUser(userId);
    refreshUsers();
  };

  const handleReject = async (userId: string) => {
    await rejectUser(userId);
    refreshUsers();
  };

  const pendingUsers = allUsers.filter((u) => u.status === "pending");
  const approvedUsers = allUsers.filter((u) => u.status === "approved" || !u.status);

  // Aggregate stats
  const totalRoomSpend = React.useMemo(() => {
    return expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  }, [expenses]);

  const totalSettlementsPaid = React.useMemo(() => {
    return settlements.reduce((sum, s) => sum + Number(s.amount), 0);
  }, [settlements]);

  return (
    <div className="space-y-6">
      {/* Hero Header Banner with Stats Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={scaleIn}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 p-6 sm:p-8 text-white shadow-2xl border border-indigo-500/30 space-y-6"
      >
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg font-bold">
                <Icons.shield className="h-5 w-5" />
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-black tracking-wide">
                {siteConfig.roomNumber} Admin Control Hub
              </h2>
              <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] font-mono gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Admin Verified</span>
              </Badge>
            </div>
            <p className="text-xs text-indigo-200/80 max-w-xl">
              Registration approvals, live roommate money transfers, full spending audit, aur weekly khata reports control panel.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={refreshUsers}
            className="gap-2 text-xs font-bold border-indigo-400/40 text-indigo-200 hover:bg-indigo-500/20 self-start sm:self-center"
          >
            <Icons.refresh className="h-3.5 w-3.5" />
            <span>Refresh Portal</span>
          </Button>
        </div>

        {/* 4 Stats Cards Grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {/* Stat 1: Pending Approvals */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-md">
            <div className="flex items-center justify-between text-[11px] font-semibold text-amber-300">
              <span>⏳ Pending Requests</span>
              <Icons.clock className="h-3.5 w-3.5" />
            </div>
            <div className="mt-1 text-xl sm:text-2xl font-black font-mono text-amber-400">
              {pendingUsers.length}
            </div>
            <span className="text-[10px] text-amber-200/70">
              {pendingUsers.length > 0 ? "Action required" : "All approved"}
            </span>
          </div>

          {/* Stat 2: Active Roommates */}
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 backdrop-blur-md">
            <div className="flex items-center justify-between text-[11px] font-semibold text-indigo-300">
              <span>👥 Roommates</span>
              <Icons.users className="h-3.5 w-3.5" />
            </div>
            <div className="mt-1 text-xl sm:text-2xl font-black font-mono text-indigo-300">
              {roommates.length}
            </div>
            <span className="text-[10px] text-indigo-200/70">Active members</span>
          </div>

          {/* Stat 3: Total Room Spend */}
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md">
            <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-300">
              <span>💰 Total Spend</span>
              <Icons.receipt className="h-3.5 w-3.5" />
            </div>
            <div className="mt-1 text-xl sm:text-2xl font-black font-mono text-emerald-400">
              {formatCurrency(totalRoomSpend)}
            </div>
            <span className="text-[10px] text-emerald-200/70">Total purchases</span>
          </div>

          {/* Stat 4: Total Settled Payments */}
          <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-md">
            <div className="flex items-center justify-between text-[11px] font-semibold text-cyan-300">
              <span>💸 Total Settled</span>
              <Icons.checkCircle className="h-3.5 w-3.5" />
            </div>
            <div className="mt-1 text-xl sm:text-2xl font-black font-mono text-cyan-300">
              {formatCurrency(totalSettlementsPaid)}
            </div>
            <span className="text-[10px] text-cyan-200/70">Repayments made</span>
          </div>
        </div>
      </motion.div>

      {/* Segmented Tab Navigation Switcher */}
      <div className="inline-flex rounded-2xl bg-surface/80 p-1 border border-border/80 w-full justify-between shadow-sm overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab("approvals")}
          className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === "approvals"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>⏳ Approvals</span>
          {pendingUsers.length > 0 && (
            <span className="h-4 px-1.5 rounded-full bg-amber-500 text-slate-900 text-[10px] font-mono font-bold flex items-center justify-center">
              {pendingUsers.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("transfer")}
          className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === "transfer"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>💸 Khaata Transfer</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("breakdown")}
          className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === "breakdown"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>📊 Spending Audit</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("reports")}
          className={`flex-1 py-2.5 px-3 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === "reports"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>📢 Email Reports</span>
        </button>
      </div>

      {/* Tab Content Display */}
      <AnimatePresence mode="wait">
        {/* Tab 1: Pending Approvals */}
        {activeTab === "approvals" && (
          <motion.div key="approvals" initial="hidden" animate="visible" variants={fadeIn}>
            <Card className="border border-border/80 bg-card shadow-card">
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/40">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <span>⏳ Pending Registration Requests</span>
                    <Badge variant={pendingUsers.length > 0 ? "warning" : "secondary"} className="text-xs font-mono">
                      {pendingUsers.length} Pending
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-0.5">
                    Naye roommates jinke accounts aap ki approval ke muntazir hain
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="pt-4">
                {pendingUsers.length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-border/60 rounded-2xl space-y-2 bg-surface/20">
                    <div className="h-10 w-10 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <Icons.checkCircle className="h-6 w-6" />
                    </div>
                    <h4 className="text-sm font-bold text-foreground">Sab Registration Requests Approved Hain!</h4>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      Koi new pending roommate request nahi hai. Nayi accounts aane par yahan notification show ho gi.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingUsers.map((pUser) => (
                      <div
                        key={pUser.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 gap-3 shadow-sm"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar name={pUser.name} size="md" />
                          <div>
                            <h4 className="text-sm font-bold text-foreground">{pUser.name}</h4>
                            <p className="text-xs text-muted-foreground font-mono">{pUser.email}</p>
                            <Badge variant="warning" className="text-[9px] font-mono mt-1">
                              Pending Admin Approval
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 self-end sm:self-center">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(pUser.id)}
                            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold gap-1.5 shadow-md border-0"
                          >
                            <Icons.check className="h-4 w-4" />
                            <span>Approve (Allow Entry)</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(pUser.id)}
                            className="text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/10 text-xs font-semibold gap-1"
                          >
                            <Icons.x className="h-4 w-4" />
                            <span>Reject</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tab 2: Khaata Money Transfer & Adjustments */}
        {activeTab === "transfer" && (
          <motion.div key="transfer" initial="hidden" animate="visible" variants={fadeIn}>
            <AdminMoneyAdjustmentCard />
          </motion.div>
        )}

        {/* Tab 3: Roommates Spending Audit */}
        {activeTab === "breakdown" && (
          <motion.div key="breakdown" initial="hidden" animate="visible" variants={fadeIn} className="space-y-6">
            <Card className="border border-border/80 bg-card shadow-card">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-base font-bold flex items-center justify-between">
                  <span>💰 Roommates Spending Audit & Net Balances</span>
                  <Badge variant="outline" className="text-xs font-mono">
                    {roommates.length} Active Members
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Kis roommate ne kitny total paise kharch kiye aur kiska net hisaab plus / minus mein hai.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4">
                <div className="divide-y divide-border/60">
                  {roomBalances.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-3">Abhi koi spending record nahi hai.</p>
                  ) : (
                    roomBalances.map((b) => {
                      const totalPaid = b.totalPaid || 0;
                      const net = b.netBalance || 0;
                      const isPositive = net > 0.01;
                      const isNegative = net < -0.01;

                      const userExpensesCount = expenses.filter((e) => e.paid_by === b.user.id).length;

                      return (
                        <div key={b.user.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center space-x-3">
                            <Avatar name={b.user.name} size="md" />
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-bold text-foreground">{b.user.name}</span>
                                <Badge variant="secondary" className="text-[9px] font-mono px-1.5">
                                  {userExpensesCount} Purchases
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Total Paid Out: <span className="font-mono font-bold text-foreground">{formatCurrency(totalPaid)}</span>
                              </p>
                            </div>
                          </div>

                          <div className="text-right self-end sm:self-center">
                            <div className="text-xs font-bold font-mono">
                              Net:{" "}
                              {isPositive ? (
                                <span className="text-emerald-600 dark:text-emerald-400">+{formatCurrency(net)} (LENE HAIN)</span>
                              ) : isNegative ? (
                                <span className="text-rose-600 dark:text-rose-400">-{formatCurrency(Math.abs(net))} (DENE HAIN)</span>
                              ) : (
                                <span className="text-muted-foreground">{formatCurrency(0)} (BARABAR)</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Approved Members List */}
            <Card className="border border-border/80 bg-card shadow-card">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-base font-bold flex items-center justify-between">
                  <span>✅ Approved Room 14 Members</span>
                  <Badge variant="success" className="text-xs font-mono">
                    {approvedUsers.length} Active
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="divide-y divide-border/60">
                  {approvedUsers.map((aUser) => (
                    <div key={aUser.id} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar name={aUser.name} size="sm" />
                        <div>
                          <span className="text-xs font-bold text-foreground">{aUser.name}</span>
                          <p className="text-[10px] text-muted-foreground font-mono">{aUser.email}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[9px] font-mono border-emerald-500/40 text-emerald-600 dark:text-emerald-400">
                        {aUser.role || "Approved Member"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tab 4: Broadcast Email Reports */}
        {activeTab === "reports" && (
          <motion.div key="reports" initial="hidden" animate="visible" variants={fadeIn}>
            <WeeklyReportCard />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
