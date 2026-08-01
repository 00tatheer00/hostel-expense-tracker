"use client";

import * as React from "react";
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
import { formatCurrency } from "@/utils/formatters";

export function AdminApprovalPanel() {
  const { user, approveUser, rejectUser } = useAuth();
  const { roommates, roomBalances, expenses } = useExpenses();
  const [allUsers, setAllUsers] = React.useState<UserProfile[]>([]);

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

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl border border-primary/30 bg-primary/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Badge variant="default" className="text-[10px] font-mono">
              Room Admin Access
            </Badge>
            <h2 className="font-heading text-lg font-bold text-foreground">
              {siteConfig.roomNumber} Room Admin Control Portal
            </h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Pending approvals review karein, live spending details dekhein, aur roommates ke darmian paise adjust karein.
            <InfoPopover
              title="Admin Approval & Control System"
              explanation="Yahan se aap registration requests approve kar sakte hain aur Saddam, Ali waghaira ke hisaab mein real-time paise add/subtract kar sakte hain."
            />
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshUsers}
          className="gap-2 text-xs font-medium self-start sm:self-center"
        >
          <Icons.refresh className="h-3.5 w-3.5" />
          <span>Refresh List</span>
        </Button>
      </div>

      {/* 1. Pending Approvals Section */}
      <Card className="border border-border/80 bg-card shadow-card">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
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

        <CardContent>
          {pendingUsers.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-border/60 rounded-xl space-y-2">
              <Icons.checkCircle className="h-8 w-8 text-emerald-500 mx-auto" />
              <h4 className="text-sm font-bold text-foreground">Koi Pending Request Nahi Hai</h4>
              <p className="text-xs text-muted-foreground">
                Sub registration requests approved hain. Nayi requests aane par yahan show honge.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingUsers.map((pUser) => (
                <div
                  key={pUser.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 gap-3"
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
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold gap-1.5 shadow-subtle"
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

      {/* 2. Admin Money Adjustment & Repayments (Saddam <-> Ali real-time transfer) */}
      <AdminMoneyAdjustmentCard />

      {/* 3. Roommate Spending Breakdown Details ("Kis ne kitny paise lagayae") */}
      <Card className="border border-border/80 bg-card shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center justify-between">
            <span>💰 Roommates Spending Breakdown Details</span>
            <Badge variant="outline" className="text-xs font-mono">
              {roommates.length} Members
            </Badge>
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Kis roommate ne kitny paise lagayae (paid out) aur uska live net balance hisaab.
          </CardDescription>
        </CardHeader>

        <CardContent>
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
                            {userExpensesCount} Kharchay
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Total Spend (Diye): <span className="font-mono font-semibold text-foreground">{formatCurrency(totalPaid)}</span>
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

      {/* 4. Approved Roommates List */}
      <Card className="border border-border/80 bg-card shadow-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center justify-between">
            <span>✅ Approved Room 14 Members</span>
            <Badge variant="success" className="text-xs font-mono">
              {approvedUsers.length} Active
            </Badge>
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Woh roommates jin ke accounts active hain aur jo portal access kar sakte hain
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="divide-y divide-border/60">
            {approvedUsers.length === 0 ? (
              <p className="text-xs text-muted-foreground py-3">Abhi koi approved user nahi hai.</p>
            ) : (
              approvedUsers.map((aUser) => (
                <div key={aUser.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar name={aUser.name} size="sm" />
                    <div>
                      <span className="text-sm font-semibold text-foreground">{aUser.name}</span>
                      <p className="text-xs text-muted-foreground font-mono">{aUser.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono border-emerald-500/40 text-emerald-600 dark:text-emerald-400">
                    {aUser.role || "Approved Member"}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Report Broadcast */}
      <WeeklyReportCard />
    </div>
  );
}
