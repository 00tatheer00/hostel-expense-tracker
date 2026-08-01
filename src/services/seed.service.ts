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

export const DEV_SEED_EXPENSES: ExpenseRow[] = [];

export const DEV_SEED_SPLITS: ExpenseSplitRow[] = [];
