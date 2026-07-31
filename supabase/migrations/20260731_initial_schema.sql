-- KamraKhata Phase 3 Initial Database Schema Migration
-- Enables Postgres Extensions, Category Enums, Tables, Indexes, and RLS Policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Category Enum
CREATE TYPE expense_category_enum AS ENUM (
  'Food',
  'Rent',
  'Electricity',
  'Internet',
  'Other'
);

-- 2. Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_color TEXT DEFAULT '#10B981',
  theme TEXT DEFAULT 'system',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  category expense_category_enum NOT NULL DEFAULT 'Other',
  paid_by UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create expense_splits table
CREATE TABLE IF NOT EXISTS public.expense_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL REFERENCES public.expenses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  share_amount NUMERIC(10, 2) NOT NULL CHECK (share_amount >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_expense_user_split UNIQUE (expense_id, user_id)
);

-- 5. Create settlements table
CREATE TABLE IF NOT EXISTS public.settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  to_user UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_different_users CHECK (from_user <> to_user)
);

-- Create Indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_expenses_paid_by ON public.expenses(paid_by);
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON public.expenses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_expense_splits_expense_id ON public.expense_splits(expense_id);
CREATE INDEX IF NOT EXISTS idx_expense_splits_user_id ON public.expense_splits(user_id);
CREATE INDEX IF NOT EXISTS idx_settlements_from_user ON public.settlements(from_user);
CREATE INDEX IF NOT EXISTS idx_settlements_to_user ON public.settlements(to_user);

-- ==================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;

-- Users policies (Authenticated roommates access only)
CREATE POLICY "Allow authenticated roommates to view users"
  ON public.users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated roommates to update self user"
  ON public.users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Expenses policies
CREATE POLICY "Allow authenticated roommates to view expenses"
  ON public.expenses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated roommates to create expenses"
  ON public.expenses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = paid_by);

CREATE POLICY "Allow payer to update expense"
  ON public.expenses FOR UPDATE
  TO authenticated
  USING (auth.uid() = paid_by);

CREATE POLICY "Allow payer to delete expense"
  ON public.expenses FOR DELETE
  TO authenticated
  USING (auth.uid() = paid_by);

-- Expense splits policies
CREATE POLICY "Allow authenticated roommates to view splits"
  ON public.expense_splits FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated roommates to create splits"
  ON public.expense_splits FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Settlements policies
CREATE POLICY "Allow authenticated roommates to view settlements"
  ON public.settlements FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated roommates to create settlements"
  ON public.settlements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = from_user);
