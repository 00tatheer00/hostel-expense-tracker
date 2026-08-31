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
import { Badge } from "@/components/ui/badge";
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
        subtitle="Record a new room expense and split it across roommates for September 2026."
        badge={
          <Badge variant="success" className="font-mono text-xs gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>September 2026 Active</span>
          </Badge>
        }
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

      <div className="max-w-2xl mx-auto space-y-4">
        <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <Icons.info className="h-4 w-4 shrink-0" />
          <span>Yeh kharcha September 2026 ke naye active hisaab mein record hoga.</span>
        </div>

        <ExpenseForm
          roommates={roommates}
          currentUserId={user?.id}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Save & Split Expense in September"
        />
      </div>
    </PageWrapper>
  );
}
