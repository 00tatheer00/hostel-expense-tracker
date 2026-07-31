import { UserRow, ExpenseRow, ExpenseSplitRow } from "@/types/database";

export const DEV_SEED_USERS: UserRow[] = [
  {
    id: "a1b2c3d4-0001-4000-8000-000000000001",
    name: "Waheed",
    email: "waheed@kamrakhata.internal",
    avatar_color: "#10B981",
    theme: "dark",
    created_at: new Date().toISOString(),
  },
  {
    id: "a1b2c3d4-0002-4000-8000-000000000002",
    name: "Usman",
    email: "usman@kamrakhata.internal",
    avatar_color: "#F59E0B",
    theme: "system",
    created_at: new Date().toISOString(),
  },
  {
    id: "a1b2c3d4-0003-4000-8000-000000000003",
    name: "Ali",
    email: "ali@kamrakhata.internal",
    avatar_color: "#3B82F6",
    theme: "system",
    created_at: new Date().toISOString(),
  },
  {
    id: "a1b2c3d4-0004-4000-8000-000000000004",
    name: "Aman",
    email: "aman@kamrakhata.internal",
    avatar_color: "#8B5CF6",
    theme: "system",
    created_at: new Date().toISOString(),
  },
  {
    id: "a1b2c3d4-0005-4000-8000-000000000005",
    name: "Sadam",
    email: "sadam@kamrakhata.internal",
    avatar_color: "#F43F5E",
    theme: "system",
    created_at: new Date().toISOString(),
  },
  {
    id: "a1b2c3d4-0006-4000-8000-000000000006",
    name: "Masood",
    email: "masood@kamrakhata.internal",
    avatar_color: "#6366F1",
    theme: "system",
    created_at: new Date().toISOString(),
  },
];

export const DEV_SEED_EXPENSES: ExpenseRow[] = [
  {
    id: "e1b2c3d4-0001-4000-8000-000000000001",
    amount: 600,
    description: "Hostel Grocery & Supplies",
    category: "Food",
    paid_by: "a1b2c3d4-0003-4000-8000-000000000003", // Ali paid 600
    created_at: new Date().toISOString(),
  },
];

export const DEV_SEED_SPLITS: ExpenseSplitRow[] = [
  {
    id: "s1b2c3d4-0001-4000-8000-000000000001",
    expense_id: "e1b2c3d4-0001-4000-8000-000000000001",
    user_id: "a1b2c3d4-0003-4000-8000-000000000003", // Ali's 200 share
    share_amount: 200,
    created_at: new Date().toISOString(),
  },
  {
    id: "s1b2c3d4-0002-4000-8000-000000000002",
    expense_id: "e1b2c3d4-0001-4000-8000-000000000001",
    user_id: "a1b2c3d4-0001-4000-8000-000000000001", // Waheed owes Ali 200
    share_amount: 200,
    created_at: new Date().toISOString(),
  },
  {
    id: "s1b2c3d4-0003-4000-8000-000000000003",
    expense_id: "e1b2c3d4-0001-4000-8000-000000000001",
    user_id: "a1b2c3d4-0002-4000-8000-000000000002", // Usman owes Ali 200
    share_amount: 200,
    created_at: new Date().toISOString(),
  },
];
