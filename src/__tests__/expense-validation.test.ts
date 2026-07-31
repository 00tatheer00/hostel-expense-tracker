import { CreateExpenseSchema, CreateSettlementSchema } from "../lib/validations/expense";

describe("Expense Validation Schemas Unit Tests", () => {
  test("CreateExpenseSchema validates valid expense payload", () => {
    const payload = {
      description: "Hostel WiFi Internet",
      amount: 1200,
      category: "Internet",
      paidBy: "u-1",
      splits: ["u-1", "u-2", "u-3"],
    };

    const result = CreateExpenseSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  test("CreateExpenseSchema rejects non-positive amount", () => {
    const payload = {
      description: "Dinner",
      amount: 0,
      category: "Food",
      paidBy: "u-1",
      splits: ["u-1"],
    };

    const result = CreateExpenseSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  test("CreateSettlementSchema rejects self-settlement", () => {
    const payload = {
      fromUser: "u-1",
      toUser: "u-1",
      amount: 500,
    };

    const result = CreateSettlementSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });
});
