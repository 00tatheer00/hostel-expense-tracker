"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { ExpenseForm } from "@/features/expenses/components/expense-form";
import { useExpenses } from "@/features/expenses/hooks/use-expenses";
import { CreateExpenseInput } from "@/lib/validations/expense";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";

export default function NewExpensePage() {
  const router = useRouter();
  const { roommates, createExpense } = useExpenses();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: CreateExpenseInput) => {
    setIsSubmitting(true);
    try {
      await createExpense(data);
      router.push("/expenses");
    } catch (error) {
      console.error("Failed to add expense:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <PageHeader
        title="Add New Expense"
        subtitle="Record a room expense and split it across roommates."
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="gap-1.5 text-xs"
          >
            <Icons.chevronRight className="h-3.5 w-3.5 rotate-180" />
            <span>Back</span>
          </Button>
        }
      />

      <div className="max-w-2xl mx-auto">
        <ExpenseForm
          roommates={roommates}
          currentUserId={user?.id}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Save & Split Expense"
        />
      </div>
    </PageWrapper>
  );
}
