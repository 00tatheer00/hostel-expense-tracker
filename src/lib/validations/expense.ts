import { z } from "zod";

export const CategorySchema = z.enum(["Food", "Rent", "Electricity", "Internet", "Other"]);

export const MoneySchema = z
  .number({ invalid_type_error: "Amount integer ya decimal number hona chahiye" })
  .positive({ message: "Amount 0 se bada hona chahiye" })
  .max(100000, { message: "Maximum limit Rs. 100,000" });

export const CreateExpenseSchema = z.object({
  amount: MoneySchema,
  description: z
    .string()
    .min(2, { message: "Description kam se kam 2 characters ka hona chahiye" })
    .max(100, { message: "Description maximum 100 characters ka ho sakta hai" }),
  category: CategorySchema,
  paidBy: z.string().uuid({ message: "Invalid payer user ID" }),
  splitUserIds: z
    .array(z.string().uuid())
    .min(1, { message: "Kam se kam 1 roommate split me shamil hona chahiye" }),
});

export const CreateSettlementSchema = z.object({
  fromUser: z.string().uuid({ message: "Invalid sender user ID" }),
  toUser: z.string().uuid({ message: "Invalid receiver user ID" }),
  amount: MoneySchema,
  note: z.string().max(100).optional(),
}).refine((data) => data.fromUser !== data.toUser, {
  message: "Sender aur receiver roommates alag hone chahiye",
  path: ["toUser"],
});

export type CreateExpenseInput = z.infer<typeof CreateExpenseSchema>;
export type CreateSettlementInput = z.infer<typeof CreateSettlementSchema>;
