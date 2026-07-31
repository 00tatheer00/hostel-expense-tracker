import { createClient } from "@/lib/supabase/client";
import { ExpenseRow, ExpenseSplitRow, ExpenseWithSplits } from "@/types/database";
import { DatabaseError } from "@/lib/errors";

export class ExpenseRepository {
  private supabase = createClient();

  async getExpenses(): Promise<ExpenseWithSplits[]> {
    const { data, error } = await this.supabase
      .from("expenses")
      .select(`
        *,
        payer:paid_by(*),
        splits:expense_splits(*, user:user_id(*))
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw new DatabaseError("Failed to fetch expenses", error);
    }
    return (data as any) || [];
  }

  async getExpenseById(id: string): Promise<ExpenseWithSplits | null> {
    const { data, error } = await this.supabase
      .from("expenses")
      .select(`
        *,
        payer:paid_by(*),
        splits:expense_splits(*, user:user_id(*))
      `)
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new DatabaseError(`Failed to fetch expense ${id}`, error);
    }
    return (data as any) || null;
  }

  async createExpense(
    expense: Omit<ExpenseRow, "id" | "created_at">,
    splits: Omit<ExpenseSplitRow, "id" | "expense_id" | "created_at">[]
  ): Promise<ExpenseWithSplits> {
    // 1. Insert main expense
    const { data: newExpense, error: expError } = await this.supabase
      .from("expenses")
      .insert(expense)
      .select()
      .single();

    if (expError || !newExpense) {
      throw new DatabaseError("Failed to insert expense record", expError);
    }

    // 2. Insert splits associated with expense
    const splitRecords = splits.map((s) => ({
      ...s,
      expense_id: newExpense.id,
    }));

    const { error: splitError } = await this.supabase
      .from("expense_splits")
      .insert(splitRecords);

    if (splitError) {
      throw new DatabaseError("Failed to insert expense split records", splitError);
    }

    return (await this.getExpenseById(newExpense.id))!;
  }

  async deleteExpense(id: string): Promise<boolean> {
    const { error } = await this.supabase.from("expenses").delete().eq("id", id);
    if (error) {
      throw new DatabaseError(`Failed to delete expense ${id}`, error);
    }
    return true;
  }
}
