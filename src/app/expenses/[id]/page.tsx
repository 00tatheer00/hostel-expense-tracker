"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/common/page-header";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { SectionCard } from "@/components/common/section-card";
import { CategoryBadge } from "@/features/expenses/components/category-badge";
import { Avatar } from "@/components/ui/avatar";
import { useExpenses } from "@/features/expenses/hooks/use-expenses";
import { DeleteDialog } from "@/features/expenses/components/delete-dialog";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/lib/icons";

export default function ExpenseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { getExpenseById, deleteExpense } = useExpenses();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const expense = getExpenseById(id);

  if (!expense) {
    return (
      <PageWrapper>
        <PageHeader title="Expense Not Found" subtitle="Requested transaction could not be located." />
        <SectionCard title="Not Found">
          <div className="py-12 text-center space-y-4">
            <p className="text-muted-foreground text-sm">Yeh expense delete ho chuka hai ya exist nahi karta.</p>
            <Link href="/expenses">
              <Button variant="outline" size="sm">Back to Expenses</Button>
            </Link>
          </div>
        </SectionCard>
      </PageWrapper>
    );
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteExpense(expense.id);
      setShowDeleteDialog(false);
      router.push("/expenses");
    } catch (e) {
      console.error("Delete failed:", e);
    } finally {
      setIsDeleting(false);
    }
  };

  const payerName = expense.payer?.name || "Roommate";
  const perShareAmount = expense.splits?.length ? Number(expense.amount) / expense.splits.length : 0;

  return (
    <PageWrapper>
      <PageHeader
        title={expense.description}
        subtitle={`Recorded on ${formatDate(expense.created_at)}`}
        badge={<CategoryBadge category={expense.category} />}
        action={
          <div className="flex items-center space-x-2">
            <Link href={`/expenses/${expense.id}/edit`}>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Icons.settings className="h-3.5 w-3.5" />
                <span>Edit</span>
              </Button>
            </Link>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="gap-1.5 text-xs font-semibold"
            >
              <Icons.alertCircle className="h-3.5 w-3.5" />
              <span>Delete</span>
            </Button>
          </div>
        }
      />

      <div className="space-y-6 max-w-2xl mx-auto">
        {/* Main Amount Header Card */}
        <SectionCard title="Transaction Summary">
          <div className="flex items-center justify-between p-2 border-b border-border/40 pb-4">
            <div>
              <span className="caption text-xs uppercase font-mono">Total Expense</span>
              <div className="numeric text-3xl font-bold text-foreground">
                {formatCurrency(Number(expense.amount))}
              </div>
            </div>

            <div className="text-right">
              <span className="caption text-xs uppercase font-mono">Paid By</span>
              <div className="flex items-center space-x-2 mt-1">
                <Avatar name={payerName} size="sm" />
                <span className="text-sm font-semibold">{payerName}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Per Roommate Share:</span>
              <strong className="numeric font-mono text-primary text-sm font-bold">
                {formatCurrency(perShareAmount)}
              </strong>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Total Split Members:</span>
              <Badge variant="secondary" className="font-mono text-xs">
                {expense.splits.length} Members
              </Badge>
            </div>
          </div>
        </SectionCard>

        {/* Itemized Roommate Splits */}
        <SectionCard title="Roommate Split Shares" description="Individual amounts assigned to each roommate">
          <div className="divide-y divide-border/60">
            {expense.splits.map((split) => {
              const memberName = split.user?.name || "Roommate";
              const isPayer = split.user_id === expense.paid_by;

              return (
                <div key={split.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar name={memberName} size="sm" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold">{memberName}</span>
                        {isPayer && (
                          <Badge variant="success" className="text-[10px] py-0 px-1 font-mono">
                            Payer
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="numeric text-sm font-bold text-foreground">
                    {formatCurrency(Number(split.share_amount))}
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      <DeleteDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </PageWrapper>
  );
}
