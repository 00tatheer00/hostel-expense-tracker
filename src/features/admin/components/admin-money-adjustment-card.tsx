"use client";

import * as React from "react";
import { useExpenses } from "@/features/expenses/hooks/use-expenses";
import { useSettlements } from "@/features/settlements/hooks/use-settlements";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Icons } from "@/lib/icons";
import { formatCurrency, formatDate } from "@/utils/formatters";

export function AdminMoneyAdjustmentCard() {
  const { roommates, roomBalances } = useExpenses();
  const { recordSettlement, settlements, isLoading } = useSettlements();

  const [fromUser, setFromUser] = React.useState<string>("");
  const [toUser, setToUser] = React.useState<string>("");
  const [amount, setAmount] = React.useState<string>("");
  const [note, setNote] = React.useState<string>("");
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Auto-select initial roommates if available
  React.useEffect(() => {
    if (roommates.length >= 2) {
      if (!fromUser) setFromUser(roommates[0].id);
      if (!toUser) setToUser(roommates[1].id);
    }
  }, [roommates, fromUser, toUser]);

  const handleSubmitAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    const numericAmount = parseFloat(amount);
    if (!fromUser || !toUser) {
      setErrorMsg("Dono roommates select karein.");
      return;
    }
    if (fromUser === toUser) {
      setErrorMsg("Sender aur Receiver same roommate nahi ho sakte.");
      return;
    }
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMsg("Baraye meharbani sahi amount darj karein.");
      return;
    }

    const senderName = roommates.find((r) => r.id === fromUser)?.name || "Roommate";
    const receiverName = roommates.find((r) => r.id === toUser)?.name || "Roommate";

    try {
      await recordSettlement({
        fromUser,
        toUser,
        amount: numericAmount,
        note: note.trim() || `Admin Repayment: ${senderName} paid ${receiverName}`,
      });

      setSuccessMsg(`✅ Success! ${senderName} ne ${receiverName} ko ${formatCurrency(numericAmount)} wapis kiye. Real-time dashboards update ho gaye hain.`);
      setAmount("");
      setNote("");
    } catch (err) {
      setErrorMsg("Adjustment save karne mein masla aaya.");
    }
  };

  return (
    <Card className="border border-emerald-500/30 bg-card shadow-card">
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Icons.wallet className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">
                💸 Admin Money Transfer & Balance Adjustment
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Agar Saddam, Ali ko (ya koi roommate dusre ko) paise wapis kare to yahan se add/subtract adjustment karein.
              </CardDescription>
            </div>
          </div>
          <Badge variant="success" className="text-[10px] font-mono self-start sm:self-center">
            Real-Time Sync
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-6">
        {/* Status Alerts */}
        {successMsg && (
          <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
            <span>{successMsg}</span>
            <Button variant="ghost" size="sm" onClick={() => setSuccessMsg(null)} className="h-6 w-6 p-0 text-emerald-700">
              <Icons.x className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center justify-between">
            <span>{errorMsg}</span>
            <Button variant="ghost" size="sm" onClick={() => setErrorMsg(null)} className="h-6 w-6 p-0 text-rose-700">
              <Icons.x className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        {/* Transfer Form */}
        <form onSubmit={handleSubmitAdjustment} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sender / Money Paid By */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span>Kis ne Paise Diye (Sender/Payer):</span>
              </label>
              <select
                value={fromUser}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFromUser(e.target.value)}
                className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {roommates.map((r) => {
                  const b = roomBalances.find((rb) => rb.user.id === r.id);
                  const netStr = b ? (b.netBalance > 0 ? `+${b.netBalance}` : `${b.netBalance}`) : "0";
                  return (
                    <option key={r.id} value={r.id}>
                      {r.name} (Net: {netStr} PKR)
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Recipient / Money Paid To */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Kisko Wapis Mile (Recipient/Receiver):</span>
              </label>
              <select
                value={toUser}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setToUser(e.target.value)}
                className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {roommates.map((r) => {
                  const b = roomBalances.find((rb) => rb.user.id === r.id);
                  const netStr = b ? (b.netBalance > 0 ? `+${b.netBalance}` : `${b.netBalance}`) : "0";
                  return (
                    <option key={r.id} value={r.id}>
                      {r.name} (Net: {netStr} PKR)
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Amount & Note */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Kitne Paise Wapis Kiye (PKR):</label>
              <input
                type="number"
                placeholder="e.g. 1000"
                value={amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value)}
                className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex gap-1.5 pt-1">
                {[200, 500, 1000, 2000].map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(preset.toString())}
                    className="h-6 text-[10px] font-mono px-2 py-0"
                  >
                    +{preset}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Wajah / Remarks (Optional):</label>
              <input
                type="text"
                placeholder="e.g. Saddam paid back Ali for mess"
                value={note}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNote(e.target.value)}
                className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs gap-2 px-6 shadow-subtle"
          >
            <Icons.checkCircle className="h-4 w-4" />
            <span>Paise Adjust & Save Karein (Real-time Sync)</span>
          </Button>
        </form>

        {/* History of Recent Admin Adjustments */}
        {settlements.length > 0 && (
          <div className="pt-4 border-t border-border/40 space-y-3">
            <h4 className="text-xs font-bold text-foreground flex items-center justify-between">
              <span>📋 Recent Money Adjustments & Repayments ({settlements.length})</span>
            </h4>
            <div className="divide-y divide-border/60 max-h-48 overflow-y-auto pr-1">
              {settlements.map((st) => {
                const sender = roommates.find((r) => r.id === st.from_user)?.name || st.from_user;
                const receiver = roommates.find((r) => r.id === st.to_user)?.name || st.to_user;
                return (
                  <div key={st.id} className="py-2 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Avatar name={sender} size="sm" />
                      <div>
                        <span className="font-semibold text-foreground">{sender}</span>
                        <span className="text-muted-foreground px-1 font-mono">➜</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">{receiver}</span>
                        {st.note && <p className="text-[10px] text-muted-foreground italic">{st.note}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-foreground">{formatCurrency(st.amount)}</span>
                      <p className="text-[9px] text-muted-foreground font-mono">{formatDate(st.created_at)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
