"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateSettlementSchema, CreateSettlementInput } from "@/lib/validations/expense";
import { UserRow } from "@/types/database";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/lib/icons";
import { formatCurrency } from "@/utils/formatters";
import { useExpenses } from "@/features/expenses/hooks/use-expenses";
import { useAuth } from "@/hooks/use-auth";

export interface SettlementFormProps {
  roommates: UserRow[];
  initialFromId?: string;
  initialToId?: string;
  initialAmount?: number;
  onSubmit: (data: CreateSettlementInput) => Promise<void>;
  isSubmitting?: boolean;
}

const PAYMENT_METHODS = [
  { id: "Cash", label: "Cash 💵", desc: "Hathon Haath" },
  { id: "JazzCash", label: "JazzCash 📱", desc: "Mobile Account" },
  { id: "EasyPaisa", label: "EasyPaisa 🟢", desc: "Mobile Account" },
  { id: "Bank", label: "Bank Transfer 🏦", desc: "Online App" },
  { id: "Other", label: "Other ⚡", desc: "Direct Settlement" },
];

export function SettlementForm({
  roommates,
  initialFromId,
  initialToId,
  initialAmount,
  onSubmit,
  isSubmitting = false,
}: SettlementFormProps) {
  const { user } = useAuth();
  const { expenses, settlements } = useExpenses();

  // Find default sender: initialFromId or logged in user or first roommate
  const defaultFrom =
    initialFromId ||
    roommates.find(
      (r) =>
        r.id === user?.id ||
        r.name.toLowerCase() === user?.name.toLowerCase() ||
        r.email.toLowerCase() === user?.email.toLowerCase()
    )?.id ||
    roommates[0]?.id ||
    "";

  // Find default recipient: initialToId or different roommate
  const defaultTo =
    initialToId ||
    roommates.find((r) => r.id !== defaultFrom)?.id ||
    roommates[1]?.id ||
    "";

  const [paymentMethod, setPaymentMethod] = React.useState<string>("JazzCash");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CreateSettlementInput>({
    resolver: zodResolver(CreateSettlementSchema),
    defaultValues: {
      fromUser: defaultFrom,
      toUser: defaultTo,
      amount: initialAmount || undefined,
      note: "",
    },
  });

  React.useEffect(() => {
    if (roommates.length > 0) {
      const from = initialFromId || defaultFrom;
      const to =
        initialToId ||
        roommates.find((r) => r.id !== from)?.id ||
        roommates[1]?.id ||
        "";

      reset({
        fromUser: from,
        toUser: to,
        amount: initialAmount || undefined,
        note: "",
      });
    }
  }, [roommates, initialFromId, initialToId, initialAmount, defaultFrom, reset]);

  const watchedFromId = watch("fromUser");
  const watchedToId = watch("toUser");
  const watchedAmount = watch("amount") || 0;

  const senderUser = roommates.find(
    (r) => r.id === watchedFromId || r.name.toLowerCase() === watchedFromId?.toLowerCase()
  ) || roommates[0];

  const receiverUser = roommates.find(
    (r) => r.id === watchedToId || r.name.toLowerCase() === watchedToId?.toLowerCase()
  ) || roommates.find((r) => r.id !== senderUser?.id) || roommates[1];

  // Calculate current 1-on-1 debt between sender and receiver
  const currentPairwiseDebt = React.useMemo(() => {
    if (!senderUser || !receiverUser || senderUser.id === receiverUser.id) return 0;

    const sId = senderUser.id;
    const sName = senderUser.name.toLowerCase();
    const rId = receiverUser.id;
    const rName = receiverUser.name.toLowerCase();

    const isSender = (idOrName: string) => idOrName === sId || idOrName.toLowerCase() === sName;
    const isReceiver = (idOrName: string) => idOrName === rId || idOrName.toLowerCase() === rName;

    let senderOwesReceiver = 0;
    let receiverOwesSender = 0;

    expenses.forEach((exp) => {
      const isPaidByReceiver = isReceiver(exp.paid_by);
      const isPaidBySender = isSender(exp.paid_by);

      exp.splits.forEach((sp) => {
        const isSplitSender = isSender(sp.user_id) || (sp.user?.name && isSender(sp.user.name));
        const isSplitReceiver = isReceiver(sp.user_id) || (sp.user?.name && isReceiver(sp.user.name));

        if (isPaidByReceiver && isSplitSender) {
          senderOwesReceiver += Number(sp.share_amount);
        }
        if (isPaidBySender && isSplitReceiver) {
          receiverOwesSender += Number(sp.share_amount);
        }
      });
    });

    // Settlements
    let senderPaidReceiver = 0;
    let receiverPaidSender = 0;

    settlements.forEach((st) => {
      if (isSender(st.from_user) && isReceiver(st.to_user)) {
        senderPaidReceiver += Number(st.amount);
      }
      if (isReceiver(st.from_user) && isSender(st.to_user)) {
        receiverPaidSender += Number(st.amount);
      }
    });

    const netSenderOwes =
      senderOwesReceiver - receiverOwesSender - senderPaidReceiver + receiverPaidSender;

    return Math.round(netSenderOwes * 100) / 100;
  }, [senderUser, receiverUser, expenses, settlements]);

  // Handle Form Submission
  const handleFormSubmit = async (data: CreateSettlementInput) => {
    // Format note with payment method for transparent record tracking
    const rawNote = data.note?.trim() || "";
    const formattedNote = rawNote
      ? `[${paymentMethod}] ${rawNote}`
      : `[${paymentMethod}] Direct Settlement Payment`;

    await onSubmit({
      ...data,
      note: formattedNote,
    });
  };

  const handleQuickAmount = (amt: number) => {
    if (amt > 0) {
      setValue("amount", amt, { shouldValidate: true });
    }
  };

  const remainingAfterDeduction = Math.max(0, currentPairwiseDebt - watchedAmount);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card className="border border-border/80 bg-card p-5 sm:p-7 space-y-6 shadow-sm">
        {/* Header Title */}
        <div className="border-b border-border/40 pb-3">
          <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
            <span>💸 Record Roommate Payment</span>
            <Badge variant="success" className="text-[10px] font-mono">
              Live Balance Deduction
            </Badge>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Agar kisi roommate ne paise wapis kiye hain to yahan entry karein. Dono ke hisaab se raqam foran minus ho jayegi.
          </p>
        </div>

        {/* Sender & Receiver Dual Selector Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. Who Paid / Kis Ne Wapis Kiye */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-surface/40 border border-border/60">
            <div className="flex items-center justify-between">
              <label htmlFor="fromUser" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span>Kis Ne Wapis Kiye? (Payer) *</span>
              </label>
              <span className="text-[10px] font-mono text-muted-foreground">Sender</span>
            </div>
            <select
              id="fromUser"
              className="w-full h-11 px-3 py-2 text-sm font-semibold rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              {...register("fromUser")}
            >
              {roommates.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} {user?.id === r.id || user?.name?.toLowerCase() === r.name?.toLowerCase() ? "(Aap)" : ""}
                </option>
              ))}
            </select>
            {errors.fromUser && (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errors.fromUser.message}
              </p>
            )}
          </div>

          {/* 2. Who Received / Kis Ko Wapis Mile */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-surface/40 border border-border/60">
            <div className="flex items-center justify-between">
              <label htmlFor="toUser" className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Kis Ko Diye? (Recipient) *</span>
              </label>
              <span className="text-[10px] font-mono text-muted-foreground">Receiver</span>
            </div>
            <select
              id="toUser"
              className="w-full h-11 px-3 py-2 text-sm font-semibold rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              {...register("toUser")}
            >
              {roommates
                .filter((r) => r.id !== watchedFromId)
                .map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
            </select>
            {errors.toUser && (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errors.toUser.message}
              </p>
            )}
          </div>
        </div>

        {/* Current Debt Context Alert Banner */}
        {senderUser && receiverUser && (
          <div className="p-3 rounded-xl border border-indigo-500/30 bg-indigo-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2 min-w-0">
              <Icons.wallet className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="truncate">
                <strong className="text-foreground">{senderUser.name}</strong> aur <strong className="text-foreground">{receiverUser.name}</strong> ka hisaab:
              </span>
            </div>
            <div className="font-mono font-bold shrink-0 self-start sm:self-auto">
              {currentPairwiseDebt > 0 ? (
                <span className="text-rose-600 dark:text-rose-400">
                  {senderUser.name} ne dene hain: {formatCurrency(currentPairwiseDebt)}
                </span>
              ) : currentPairwiseDebt < 0 ? (
                <span className="text-emerald-600 dark:text-emerald-400">
                  {senderUser.name} ne lene hain: {formatCurrency(Math.abs(currentPairwiseDebt))}
                </span>
              ) : (
                <span className="text-muted-foreground">Pura Hisaab Barabar Hai (Rs. 0)</span>
              )}
            </div>
          </div>
        )}

        {/* Amount Field & Quick Settle Buttons */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="amount" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Kitni Raqam Wapis Ki? (Amount Rs.) *
            </label>
            {currentPairwiseDebt > 0 && (
              <span className="text-[11px] font-mono text-muted-foreground">
                Total Udhar: <strong className="text-foreground">{formatCurrency(currentPairwiseDebt)}</strong>
              </span>
            )}
          </div>

          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-lg font-bold text-muted-foreground font-mono">
              Rs.
            </span>
            <input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="w-full h-12 pl-12 pr-4 text-xl font-extrabold font-mono rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              {...register("amount", { valueAsNumber: true })}
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
              {errors.amount.message}
            </p>
          )}

          {/* Quick Pre-fill Shortcut Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[11px] font-mono text-muted-foreground">Quick Fill:</span>
            {currentPairwiseDebt > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => handleQuickAmount(currentPairwiseDebt)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 transition-all font-mono"
                >
                  ⚡ Pura Udhar ({formatCurrency(currentPairwiseDebt)})
                </button>
                {currentPairwiseDebt > 100 && (
                  <button
                    type="button"
                    onClick={() => handleQuickAmount(Math.round(currentPairwiseDebt / 2))}
                    className="px-2.5 py-1 rounded-lg text-xs font-bold border border-border/60 bg-surface/60 hover:bg-surface text-foreground transition-all font-mono"
                  >
                    Aadha ({formatCurrency(Math.round(currentPairwiseDebt / 2))})
                  </button>
                )}
              </>
            )}
            {[500, 1000, 2000].map((quickAmt) => (
              <button
                key={quickAmt}
                type="button"
                onClick={() => handleQuickAmount(quickAmt)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-border/60 bg-surface/40 hover:bg-surface text-foreground transition-all font-mono"
              >
                Rs. {quickAmt}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Payment Method (Kese Ada Kiye?) *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {PAYMENT_METHODS.map((m) => {
              const isSelected = paymentMethod === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-500/15 dark:bg-emerald-500/20 text-foreground shadow-xs ring-1 ring-emerald-500"
                      : "border-border/60 bg-surface/40 hover:bg-surface text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <div className="text-xs font-bold">{m.label}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{m.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Note / Proof / TID Reference */}
        <div className="space-y-1.5">
          <label htmlFor="note" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Proof / Reference / Note (Optional)
          </label>
          <input
            id="note"
            type="text"
            placeholder="e.g. JazzCash TID #9482910, ya Cash room mein diya"
            className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            {...register("note")}
          />
          <p className="text-[11px] text-muted-foreground">
            Yeh note dono roommates ke settlement record ledger mein show hoga taake koi dispute na ho.
          </p>
        </div>

        {/* Live Balance Deduction Preview Box */}
        {watchedAmount > 0 && senderUser && receiverUser && (
          <div className="p-4 rounded-2xl border border-emerald-500/40 bg-emerald-500/5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
              <Icons.checkCircle className="h-4 w-4 text-emerald-600" />
              <span>⚡ Live Balance Deduction Preview</span>
            </h4>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg bg-surface/60 border border-border/40 space-y-0.5">
                <span className="text-[10px] text-muted-foreground block">Pehle Ka Udhar</span>
                <span className="font-mono font-bold text-foreground">
                  {formatCurrency(currentPairwiseDebt)}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 space-y-0.5">
                <span className="text-[10px] text-emerald-700 dark:text-emerald-300 block">Wapis Ada Kiye</span>
                <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                  - {formatCurrency(watchedAmount)}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-surface/60 border border-border/40 space-y-0.5">
                <span className="text-[10px] text-muted-foreground block">Baqaya Udhar</span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                  {formatCurrency(remainingAfterDeduction)}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-emerald-700/90 dark:text-emerald-300/90 font-medium text-center">
              ✅ Submit dabate hi <strong>{senderUser.name}</strong> ke qarzay se <strong>{formatCurrency(watchedAmount)}</strong> minus ho kar dono ka hisaab update ho jayega.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 text-sm font-bold shadow-md bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Deducting & Updating Balances...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Icons.checkCircle className="h-4 w-4" />
              <span>Confirm Payment & Deduct From Balance</span>
            </div>
          )}
        </Button>
      </Card>
    </form>
  );
}
