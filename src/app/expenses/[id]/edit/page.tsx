"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { SectionCard } from "@/components/common/section-card";
import { ExpenseForm } from "@/features/expenses/components/expense-form";
import { useExpenses } from "@/features/expenses/hooks/use-expenses";
import { CreateExpenseInput } from "@/lib/validations/expense";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";

export default function EditExpensePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { getExpenseById, roommates, updateExpense } = useExpenses();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const expense = getExpenseById(id);

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

  const initialData: Partial<CreateExpenseInput> = {
    amount: Number(expense.amount),
    description: expense.description,
    category: expense.category,
    paidBy: expense.paid_by,
    splitUserIds: expense.splits.map((s) => s.user_id),
  };

  const handleSubmit = async (data: CreateExpenseInput) => {
    setIsSubmitting(true);
    try {
      await updateExpense(expense.id, data);
      router.push(`/expenses/${expense.id}`);
    } catch (error) {
      console.error("Failed to update expense:", error);
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
