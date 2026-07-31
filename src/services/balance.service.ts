import {
  UserRow,
  ExpenseRow,
  ExpenseSplitRow,
  SettlementRow,
  UserBalanceSummary,
} from "@/types/database";

export class BalanceService {
  /**
   * Calculates total gross amount paid out by a user for all expenses
   */
  calculateUserPaid(userId: string, expenses: ExpenseRow[]): number {
    return expenses
      .filter((e) => e.paid_by === userId)
      .reduce((sum, e) => sum + Number(e.amount), 0);
  }

  /**
   * Calculates total share amount a user is assigned to owe across all expense splits
   */
  calculateUserOwes(userId: string, splits: ExpenseSplitRow[]): number {
    return splits
      .filter((s) => s.user_id === userId)
      .reduce((sum, s) => sum + Number(s.share_amount), 0);
  }

  /**
   * Calculates gross amount user is owed back by others (Total Paid minus their own split share)
   */
  calculateUserReceives(
    userId: string,
    expenses: ExpenseRow[],
    splits: ExpenseSplitRow[]
  ): number {
    const paid = this.calculateUserPaid(userId, expenses);
    const ownShare = splits
      .filter((s) => s.user_id === userId && expenses.some((e) => e.id === s.expense_id && e.paid_by === userId))
      .reduce((sum, s) => sum + Number(s.share_amount), 0);

    return Math.max(0, paid - ownShare);
  }

  /**
   * Calculates dynamic net balance for a single user considering expenses, splits, and settlements
   * Formula: (Total Paid Out) - (Total Assigned Splits) + (Settlements Paid) - (Settlements Received)
   */
  calculateUserBalance(
    userId: string,
    expenses: ExpenseRow[],
    splits: ExpenseSplitRow[],
    settlements: SettlementRow[] = []
  ): number {
    const totalPaid = this.calculateUserPaid(userId, expenses);
    const totalOwed = this.calculateUserOwes(userId, splits);

    const totalSettledPaid = settlements
      .filter((s) => s.from_user === userId)
      .reduce((sum, s) => sum + Number(s.amount), 0);

    const totalSettledReceived = settlements
      .filter((s) => s.to_user === userId)
      .reduce((sum, s) => sum + Number(s.amount), 0);

    // Dynamic Net Balance
    const net = totalPaid - totalOwed + totalSettledPaid - totalSettledReceived;
    return Math.round(net * 100) / 100;
  }

  /**
   * Calculates dynamic balance summaries for all room members
   */
  calculateRoomBalances(
    users: UserRow[],
    expenses: ExpenseRow[],
    splits: ExpenseSplitRow[],
    settlements: SettlementRow[] = []
  ): UserBalanceSummary[] {
    return users.map((user) => {
      const totalPaid = this.calculateUserPaid(user.id, expenses);
      const totalOwed = this.calculateUserOwes(user.id, splits);

      const totalSettledPaid = settlements
        .filter((s) => s.from_user === user.id)
        .reduce((sum, s) => sum + Number(s.amount), 0);

      const totalSettledReceived = settlements
        .filter((s) => s.to_user === user.id)
        .reduce((sum, s) => sum + Number(s.amount), 0);

      const netBalance = this.calculateUserBalance(
        user.id,
        expenses,
        splits,
        settlements
      );

      let status: "Gets Back" | "Owes" | "Settled" = "Settled";
      if (netBalance > 0.01) status = "Gets Back";
      else if (netBalance < -0.01) status = "Owes";

      return {
        user,
        totalPaid,
        totalOwed,
        totalSettledPaid,
        totalSettledReceived,
        netBalance,
        status,
      };
    });
  }

  /**
   * Calculates overall room total expenditure
   */
  calculateTotalSpent(expenses: ExpenseRow[]): number {
    const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    return Math.round(total * 100) / 100;
  }

  /**
   * Calculates total spending for a specific month and year
   */
  calculateMonthlySpent(
    expenses: ExpenseRow[],
    year: number = new Date().getFullYear(),
    month: number = new Date().getMonth()
  ): number {
    const filtered = expenses.filter((e) => {
      const d = new Date(e.created_at);
      return d.getFullYear() === year && d.getMonth() === month;
    });

    return this.calculateTotalSpent(filtered);
  }
}
