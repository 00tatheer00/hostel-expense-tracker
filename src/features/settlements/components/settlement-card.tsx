"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { SettlementRow, UserRow } from "@/types/database";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { isExpenseLocked } from "@/utils/month-utils";
import { Icons } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EditSettlementModal } from "./edit-settlement-modal";
import { useSettlements } from "../hooks/use-settlements";

export interface SettlementCardProps {
  settlement: SettlementRow;
  roommates: UserRow[];
  onUpdate?: (
    id: string,
    data: { fromUser: string; toUser: string; amount: number; note?: string }
  ) => Promise<void>;
}

export function SettlementCard({
  settlement,
  roommates,
  onUpdate,
}: SettlementCardProps) {
  const [isEditOpen, setIsEditOpen] = React.useState<boolean>(false);
  const { updateSettlement } = useSettlements();

  const fromUser = roommates.find((r) => r.id === settlement.from_user) || {
    name: "Roommate",
  };
  const toUser = roommates.find((r) => r.id === settlement.to_user) || {
    name: "Roommate",
  };
  const isLocked = isExpenseLocked(settlement.created_at);

  // Extract payment method from note if stored in "[Method] Note" format
  let paymentMethod = "Direct Settlement";
  let cleanNote = settlement.note || "";

  if (cleanNote.startsWith("[")) {
    const endBracket = cleanNote.indexOf("]");
    if (endBracket !== -1) {
      paymentMethod = cleanNote.substring(1, endBracket);
      cleanNote = cleanNote.substring(endBracket + 1).trim();
    }
  }

  const handleSave = async (
    id: string,
    data: { fromUser: string; toUser: string; amount: number; note?: string }
  ) => {
    if (onUpdate) {
      await onUpdate(id, data);
    } else {
      await updateSettlement(id, data);
    }
  };

  return (
    <>
      <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }} className="w-full">
        <Card className="p-3.5 sm:p-5 border border-border/80 bg-card hover:bg-surface/50 transition-all shadow-subtle flex flex-col justify-between space-y-3 rounded-2xl w-full overflow-hidden">
          {/* Top Meta Bar: Responsive Wrapped Header */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5 min-w-0">
              <span className="caption text-[11px] sm:text-xs font-mono text-muted-foreground whitespace-nowrap">
                {formatDate(settlement.created_at)}
              </span>
              <Badge
                variant="outline"
                className="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 whitespace-nowrap"
              >
                {paymentMethod}
              </Badge>
              {isLocked && (
                <Badge
                  variant="outline"
                  className="text-[9px] font-mono border-amber-500/40 text-amber-700 dark:text-amber-300 py-0 px-1 bg-amber-500/10 whitespace-nowrap"
                >
                  🔒 August Locked
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-2 shrink-0 ml-auto">
              <span className="numeric text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                {formatCurrency(Number(settlement.amount))}
              </span>

              {/* Edit button replacing the direct delete button */}
              {!isLocked && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditOpen(true)}
                  className="h-7 px-2 text-xs font-semibold gap-1 text-muted-foreground hover:text-foreground border-border/60 hover:bg-surface/80"
                  title="Edit Settlement Entry"
                >
                  <Icons.edit className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Edit</span>
                </Button>
              )}
            </div>
          </div>

          {/* Sender -> Receiver Visual Transaction Flow (100% Mobile Fluid) */}
          <div className="p-2.5 sm:p-3 rounded-xl bg-surface/60 border border-border/40 space-y-2">
            <div className="flex items-center justify-between gap-1.5 sm:gap-2">
              {/* Sender (Left) */}
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <Avatar name={fromUser.name} size="sm" className="shrink-0 h-7 w-7 sm:h-8 sm:w-8" />
                <div className="min-w-0 flex-1">
                  <span className="text-xs sm:text-sm font-bold text-foreground block truncate">
                    {fromUser.name}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-rose-600 dark:text-rose-400 font-mono font-bold block truncate">
                    Payer (Wapis Diye)
                  </span>
                </div>
              </div>

              {/* Transfer Direction Indicator */}
              <div className="flex items-center justify-center px-1 sm:px-2 shrink-0">
                <div className="p-1 sm:p-1.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Icons.chevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </div>
              </div>

              {/* Receiver (Right) */}
              <div className="flex items-center justify-end space-x-2 min-w-0 flex-1 text-right">
                <div className="min-w-0 flex-1">
                  <span className="text-xs sm:text-sm font-bold text-foreground block truncate">
                    {toUser.name}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold block truncate">
                    Receiver (Mile)
                  </span>
                </div>
                <Avatar name={toUser.name} size="sm" className="shrink-0 h-7 w-7 sm:h-8 sm:w-8" />
              </div>
            </div>
          </div>

          {/* Note / TID Reference Proof (Responsive Wrapping) */}
          {cleanNote && cleanNote !== "Direct Settlement Payment" && (
            <div className="p-2 sm:p-2.5 rounded-xl bg-muted/40 border border-border/30 text-[11px] sm:text-xs text-muted-foreground flex items-start space-x-2 overflow-hidden">
              <Icons.info className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
              <span className="italic break-words break-all line-clamp-3">
                &quot;{cleanNote}&quot;
              </span>
            </div>
          )}

          {/* Audit Status Verification */}
          <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] sm:text-[11px] font-mono text-muted-foreground pt-1 border-t border-border/30">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold truncate">
              <Icons.checkCircle className="h-3 w-3 shrink-0" />
              <span className="truncate">Balance Deducted & Verified</span>
            </span>
            <span className="text-[9px] sm:text-[10px] text-muted-foreground/70 shrink-0">Room 14 Ledger</span>
          </div>
        </Card>
      </motion.div>

      {/* Edit Modal */}
      {!isLocked && (
        <EditSettlementModal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          settlement={settlement}
          roommates={roommates}
          onSave={handleSave}
        />
      )}
    </>
  );
}
