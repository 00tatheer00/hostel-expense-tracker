export type ExpenseCategory = "Food" | "Rent" | "Electricity" | "Internet" | "Other";

export interface UserRow {
  id: string;
  name: string;
  email: string;
  avatar_color: string;
  theme: "light" | "dark" | "system";
  created_at: string;
}

export interface ExpenseRow {
  id: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  paid_by: string;
  created_at: string;
}

export interface ExpenseSplitRow {
  id: string;
  expense_id: string;
  user_id: string;
  share_amount: number;
  created_at: string;
}

export interface SettlementRow {
  id: string;
  from_user: string;
  to_user: string;
  amount: number;
  note?: string | null;
  created_at: string;
}

// Joined Data Structures
export interface ExpenseWithSplits extends ExpenseRow {
  payer?: UserRow;
  splits: (ExpenseSplitRow & { user?: UserRow })[];
}

export interface UserBalanceSummary {
  user: UserRow;
  totalPaid: number;
  totalOwed: number;
  totalSettledPaid: number;
  totalSettledReceived: number;
  netBalance: number; // Positive = gets money back, Negative = owes money, 0 = settled
  status: "Gets Back" | "Owes" | "Settled";
}

export interface SuggestedSettlement {
  fromUser: UserRow;
  toUser: UserRow;
  amount: number;
  formattedAmount: string;
}
