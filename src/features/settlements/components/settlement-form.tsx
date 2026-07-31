"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateSettlementSchema, CreateSettlementInput } from "@/lib/validations/expense";
import { UserRow } from "@/types/database";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";

export interface SettlementFormProps {
  roommates: UserRow[];
  initialFromId?: string;
  initialToId?: string;
  initialAmount?: number;
  onSubmit: (data: CreateSettlementInput) => Promise<void>;
  isSubmitting?: boolean;
}

export function SettlementForm({
  roommates,
  initialFromId,
  initialToId,
  initialAmount,
  onSubmit,
  isSubmitting = false,
}: SettlementFormProps) {
  const defaultFrom = initialFromId || roommates[0]?.id || "";
  const defaultTo = initialToId || roommates[1]?.id || "";

  const {
    register,
    handleSubmit,
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="border border-border/80 bg-card p-5 sm:p-6 space-y-5">
        {/* From User (Who Paid / Sender) */}
        <div className="space-y-1.5">
          <label htmlFor="fromUser" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Who Paid (Sender) *
          </label>
          <select
            id="fromUser"
            className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            {...register("fromUser")}
          >
            {roommates.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          {errors.fromUser && (
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
              {errors.fromUser.message}
            </p>
          )}
        </div>

        {/* To User (Who Received / Recipient) */}
        <div className="space-y-1.5">
          <label htmlFor="toUser" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Who Received (Recipient) *
          </label>
          <select
            id="toUser"
            className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            {...register("toUser")}
          >
            {roommates.map((r) => (
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

        {/* Amount Field */}
        <div className="space-y-1.5">
          <label htmlFor="amount" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Settlement Amount (Rs.) *
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-base font-bold text-muted-foreground font-mono">
              Rs.
            </span>
            <input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="w-full h-12 pl-11 pr-4 text-xl font-bold font-mono rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              {...register("amount", { valueAsNumber: true })}
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
              {errors.amount.message}
            </p>
          )}
        </div>

        {/* Note Field */}
        <div className="space-y-1.5">
          <label htmlFor="note" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Optional Note / UPI Reference
          </label>
          <input
            id="note"
            type="text"
            placeholder="e.g. Paid via Google Pay, Cash settlement"
            className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            {...register("note")}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 text-sm font-semibold shadow-subtle bg-emerald-700 hover:bg-emerald-800 text-white"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Recording...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Icons.checkCircle className="h-4 w-4" />
              <span>Record Settlement & Recalculate</span>
            </div>
          )}
        </Button>
      </Card>
    </form>
  );
}
