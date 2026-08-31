"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { SectionCard } from "@/components/common/section-card";
import { ExpenseForm } from "@/features/expenses/components/expense-form";
import { useExpenses } from "@/features/expenses/hooks/use-expenses";
import { CreateExpenseInput } from "@/lib/validations/expense";
import { isExpenseLocked } from "@/utils/month-utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/lib/icons";

export default function EditExpensePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { getExpenseById, roommates, updateExpense, isLoading } = useExpenses();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const expense = getExpenseById(id);

  if (isLoading && !expense) {
    return (
      <PageWrapper>
        <PageHeader title="Edit Expense" subtitle="Loading transaction details..." />
        <SectionCard title="Loading">
          <div className="py-12 flex justify-center items-center">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </SectionCard>
      </PageWrapper>
    );
  }

  if (!expense) {
    return (
      <PageWrapper>
        <PageHeader title="Expense Not Found" subtitle="Requested transaction could not be located." />
        <SectionCard title="Not Found">
          <div className="py-12 text-center">
            <Button variant="outline" onClick={() => router.push("/expenses")}>
              Back to Expenses
            </Button>
          </div>
        </SectionCard>
      </PageWrapper>
    );
  }

  const isLocked = isExpenseLocked(expense.created_at);

  if (isLocked) {
    return (
      <PageWrapper>
        <PageHeader
          title="Expense Locked (Read-Only)"
          subtitle={`"${expense.description}" is part of locked August 2026 archive.`}
        />
        <SectionCard title="🔒 Record Locked">
          <div className="p-8 text-center space-y-4 max-w-lg mx-auto">
            <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Icons.alertCircle className="h-8 w-8" />
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground">
              Yeh kharcha August 2026 ka hai aur locked hai!
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              31st August 11:59 PM par August ka hisaab mukammal ho chuka hai. Is month ke kisi kharche ko edit ya delete nahi kiya ja sakta.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <Button variant="outline" onClick={() => router.push(`/expenses/${expense.id}`)}>
                View Details
              </Button>
              <Button onClick={() => router.push("/expenses")}>
                Back to Expenses
              </Button>
            </div>
          </div>
        </SectionCard>
      </PageWrapper>
    );
  }

  const initialData: Partial<CreateExpenseInput> = {
    amount: Number(expense.amount),
    description: expense.description,
    category: expense.category,
    paidBy: expense.paid_by,
    splitUserIds: expense.splits.map((s) => s.user_id),
  };

  const handleSubmit = async (data: CreateExpenseInput) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await updateExpense(expense.id, data);
      router.push(`/expenses/${expense.id}`);
    } catch (error: any) {
      console.error("Failed to update expense:", error);
      setErrorMessage(error?.message || "Failed to update expense");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Edit Expense"
        subtitle={`Updating "${expense.description}"`}
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="gap-1.5 text-xs"
          >
            <Icons.chevronRight className="h-3.5 w-3.5 rotate-180" />
            <span>Cancel</span>
          </Button>
        }
      />

      {errorMessage && (
        <div className="p-3 mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <ExpenseForm
          roommates={roommates}
          initialData={initialData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Update Expense & Recalculate"
        />
      </div>
    </PageWrapper>
  );
}
