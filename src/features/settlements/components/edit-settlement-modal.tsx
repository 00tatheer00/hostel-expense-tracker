"use client";

import * as React from "react";
import { SettlementRow, UserRow } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Icons } from "@/lib/icons";

export interface EditSettlementModalProps {
  isOpen: boolean;
  onClose: () => void;
  settlement: SettlementRow;
  roommates: UserRow[];
  onSave: (
    id: string,
    data: { fromUser: string; toUser: string; amount: number; note?: string }
  ) => Promise<void>;
}

const PAYMENT_METHODS = [
  { id: "Cash", label: "Cash 💵" },
  { id: "JazzCash", label: "JazzCash 📱" },
  { id: "EasyPaisa", label: "EasyPaisa 🟢" },
  { id: "Bank", label: "Bank Transfer 🏦" },
  { id: "Other", label: "Other ⚡" },
];

export function EditSettlementModal({
  isOpen,
  onClose,
  settlement,
  roommates,
  onSave,
}: EditSettlementModalProps) {
  // Parse initial note and payment method
  let initialMethod = "Cash";
  let initialNote = settlement.note || "";
  if (initialNote.startsWith("[")) {
    const endBracket = initialNote.indexOf("]");
    if (endBracket !== -1) {
      initialMethod = initialNote.substring(1, endBracket);
      initialNote = initialNote.substring(endBracket + 1).trim();
    }
  }

  const [fromUser, setFromUser] = React.useState<string>(settlement.from_user);
  const [toUser, setToUser] = React.useState<string>(settlement.to_user);
  const [amount, setAmount] = React.useState<string>(String(settlement.amount));
  const [method, setMethod] = React.useState<string>(initialMethod);
  const [note, setNote] = React.useState<string>(initialNote);
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  // Sync state if settlement changes
  React.useEffect(() => {
    setFromUser(settlement.from_user);
    setToUser(settlement.to_user);
    setAmount(String(settlement.amount));
    let m = "Cash";
    let n = settlement.note || "";
    if (n.startsWith("[")) {
      const idx = n.indexOf("]");
      if (idx !== -1) {
        m = n.substring(1, idx);
        n = n.substring(idx + 1).trim();
      }
    }
    setMethod(m);
    setNote(n);
    setError(null);
  }, [settlement]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    if (fromUser === toUser) {
      setError("Sender and receiver roommates must be different");
      return;
    }

    const formattedNote = note.trim()
      ? `[${method}] ${note.trim()}`
      : `[${method}] Direct Settlement Payment`;

    setIsSubmitting(true);
    try {
      await onSave(settlement.id, {
        fromUser,
        toUser,
        amount: parsedAmount,
        note: formattedNote,
      });
      setIsSubmitting(false);
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err?.message || "Failed to update settlement");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-card text-foreground rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-border/60 flex items-center justify-between bg-surface/50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Icons.edit className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base sm:text-lg">Edit Settlement Entry</h3>
              <p className="caption text-xs text-muted-foreground">Modify amount, sender, or receiver details</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
          >
            <Icons.close className="h-4 w-4" />
          </Button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center space-x-2">
              <Icons.alertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Amount Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Amount (Rs.)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm font-bold text-muted-foreground">
                Rs.
              </span>
              <input
                type="number"
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-surface text-base font-bold font-mono text-foreground focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          {/* Roommate Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Sender (Who Paid) */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                Sender (Wapis Diye)
              </label>
              <select
                value={fromUser}
                onChange={(e) => setFromUser(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-input bg-surface text-xs sm:text-sm font-bold text-foreground focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50"
              >
                {roommates.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Receiver (Who Received) */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                Receiver (Kisko Mile)
              </label>
              <select
                value={toUser}
                onChange={(e) => setToUser(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-input bg-surface text-xs sm:text-sm font-bold text-foreground focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50"
              >
                {roommates.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Payment Method
            </label>
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((m) => {
                const isSelected = method.toLowerCase() === m.id.toLowerCase();
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      isSelected
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-surface border-border/80 text-muted-foreground hover:text-foreground hover:border-border"
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note / Proof Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Note / Reference (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. TID-123456 or Raat ko cash diya"
              className="w-full px-3 py-2 rounded-xl border border-input bg-surface text-xs sm:text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-3 flex items-center justify-end space-x-2 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Icons.check className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
