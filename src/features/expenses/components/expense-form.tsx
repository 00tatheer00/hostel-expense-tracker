"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateExpenseSchema, CreateExpenseInput } from "@/lib/validations/expense";
import { UserRow, ExpenseCategory } from "@/types/database";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MemberSelector } from "./member-selector";
import { SplitPreview } from "./split-preview";
import { Icons } from "@/lib/icons";
import { CategoryBadge } from "./category-badge";

const CATEGORIES: ExpenseCategory[] = ["Food", "Rent", "Electricity", "Internet", "Other"];

export interface ExpenseFormProps {
  roommates: UserRow[];
  currentUserId?: string;
  initialData?: Partial<CreateExpenseInput>;
  onSubmit: (data: CreateExpenseInput) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function ExpenseForm({
  roommates,
  currentUserId,
  initialData,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save Expense",
}: ExpenseFormProps) {
  const defaultPayerId = initialData?.paidBy || currentUserId || (roommates[0]?.id ?? "");
  const defaultSplits = initialData?.splitUserIds || roommates.map((r) => r.id);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CreateExpenseInput>({
    resolver: zodResolver(CreateExpenseSchema),
    defaultValues: {
      amount: initialData?.amount || undefined,
      description: initialData?.description || "",
      category: initialData?.category || "Food",
      paidBy: defaultPayerId,
      splitUserIds: defaultSplits,
    },
  });

  const watchedAmount = watch("amount") || 0;
  const watchedSplitUserIds = watch("splitUserIds") || [];

  const selectedRoommates = roommates.filter((r) =>
    watchedSplitUserIds.includes(r.id)
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="border border-border/80 bg-card p-5 sm:p-6 space-y-6">
        {/* Amount Field */}
        <div className="space-y-1.5">
          <label htmlFor="amount" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Expense Amount (Rs.) *
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

        {/* Description Field */}
        <div className="space-y-1.5">
          <label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Description / Item Name *
          </label>
          <input
            id="description"
            type="text"
            placeholder="e.g. Weekly Grocery, Wifi Bill, Tea & Snacks"
            className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            {...register("description")}
          />
          {errors.description && (
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Category Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Category *
          </label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = field.value === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => field.onChange(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center space-x-1.5 ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground shadow-subtle"
                          : "border-border/60 bg-surface/40 hover:bg-surface text-foreground"
                      }`}
                    >
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>

        {/* Paid By Field */}
        <div className="space-y-1.5">
          <label htmlFor="paidBy" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Paid By *
          </label>
          <select
            id="paidBy"
            className="w-full h-10 px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            {...register("paidBy")}
          >
            {roommates.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          {errors.paidBy && (
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
              {errors.paidBy.message}
            </p>
          )}
        </div>

        {/* Member Multi-Selector */}
        <Controller
          name="splitUserIds"
          control={control}
          render={({ field }) => (
            <MemberSelector
              members={roommates}
              selectedUserIds={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.splitUserIds && (
          <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
            {errors.splitUserIds.message}
          </p>
        )}

        {/* Live Split Preview Widget */}
        <SplitPreview amount={watchedAmount} selectedMembers={selectedRoommates} />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 text-sm font-semibold shadow-subtle"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <span className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Icons.plus className="h-4 w-4" />
              <span>{submitLabel}</span>
            </div>
          )}
        </Button>
      </Card>
    </form>
  );
}
