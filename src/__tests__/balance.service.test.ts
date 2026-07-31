import { BalanceService } from "../services/balance.service";
import { ExpenseWithSplits } from "../types/database";

describe("BalanceService Unit Tests", () => {
  const balanceService = new BalanceService();

  const mockExpenses: ExpenseWithSplits[] = [
    {
      id: "exp-1",
      description: "Dinner",
      amount: 600,
      category: "Food",
      paid_by: "u-1",
      created_at: "2026-07-31T10:00:00Z",
      splits: [
        { id: "s-1", expense_id: "exp-1", user_id: "u-1", share_amount: 200, created_at: "" },
        { id: "s-2", expense_id: "exp-1", user_id: "u-2", share_amount: 200, created_at: "" },
        { id: "s-3", expense_id: "exp-1", user_id: "u-3", share_amount: 200, created_at: "" },
      ],
      payer: { id: "u-1", name: "Waheed", email: "waheed@kamrakhata.internal", avatar_color: "amber", theme: "light", created_at: "" },
    },
  ];

  test("calculateUserPaid returns exact sum paid by user", () => {
    const paidByU1 = balanceService.calculateUserPaid("u-1", mockExpenses);
    expect(paidByU1).toBe(600);

    const paidByU2 = balanceService.calculateUserPaid("u-2", mockExpenses);
    expect(paidByU2).toBe(0);
  });

  test("calculateUserOwes returns exact split share owed by user", () => {
    const owesU1 = balanceService.calculateUserOwes("u-1", mockExpenses[0].splits);
    expect(owesU1).toBe(200);

    const owesU2 = balanceService.calculateUserOwes("u-2", mockExpenses[0].splits);
    expect(owesU2).toBe(200);
  });

  test("calculateUserBalance computes net balance (Total Paid - Owed)", () => {
    const netU1 = balanceService.calculateUserBalance("u-1", mockExpenses, mockExpenses[0].splits, []);
    expect(netU1).toBe(400);

    const netU2 = balanceService.calculateUserBalance("u-2", mockExpenses, mockExpenses[0].splits, []);
    expect(netU2).toBe(-200);
  });
});
