import { ExpenseRepository } from "./repositories/expense.repository";
import { CreateExpenseInput, CreateExpenseSchema } from "@/lib/validations/expense";
import { ExpenseWithSplits } from "@/types/database";
import { calculateSplit } from "@/utils/calc-utils";
import { ValidationError } from "@/lib/errors";

export class ExpenseService {
  private expenseRepo = new ExpenseRepository();

  async getAllExpenses(): Promise<ExpenseWithSplits[]> {
    return await this.expenseRepo.getExpenses();
  }

  async getExpenseById(id: string): Promise<ExpenseWithSplits | null> {
    return await this.expenseRepo.getExpenseById(id);
  }

  async addExpense(input: CreateExpenseInput): Promise<ExpenseWithSplits> {
    // 1. Validate input schema
    const parseResult = CreateExpenseSchema.safeParse(input);
    if (!parseResult.success) {
      throw new ValidationError(
        parseResult.error.errors.map((e) => e.message).join(", ")
      );
    }

    const { amount, description, category, paidBy, splitUserIds } = parseResult.data;

    // 2. Calculate equal split amounts
    const shares = calculateSplit(amount, splitUserIds.length);
    const splitRecords = splitUserIds.map((userId, index) => ({
      user_id: userId,
      share_amount: shares[index],
    }));

    // 3. Persist expense and splits via repository
    return await this.expenseRepo.createExpense(
      {
        amount,
        description,
        category,
        paid_by: paidBy,
      },
      splitRecords
    );
  }

  async deleteExpense(id: string): Promise<boolean> {
    return await this.expenseRepo.deleteExpense(id);
  }
}
