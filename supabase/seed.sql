-- KamraKhata Phase 3 Seed SQL Data

-- Insert 6 Fixed Roommates
INSERT INTO public.users (id, name, email, avatar_color, theme) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Waheed', 'waheed@kamrakhata.internal', '#10B981', 'dark'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Usman', 'usman@kamrakhata.internal', '#F59E0B', 'system'),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'Ali', 'ali@kamrakhata.internal', '#3B82F6', 'system'),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'Aman', 'aman@kamrakhata.internal', '#8B5CF6', 'system'),
  ('a1b2c3d4-0005-4000-8000-000000000005', 'Sadam', 'sadam@kamrakhata.internal', '#F43F5E', 'system'),
  ('a1b2c3d4-0006-4000-8000-000000000006', 'Masood', 'masood@kamrakhata.internal', '#6366F1', 'system')
ON CONFLICT (email) DO NOTHING;

-- Sample Development Expense 1: Ali paid Rs. 600 for Grocery split across 3 roommates (Ali, Waheed, Usman)
INSERT INTO public.expenses (id, amount, description, category, paid_by) VALUES
  ('e1b2c3d4-0001-4000-8000-000000000001', 600.00, 'Hostel Grocery & Supplies', 'Food', 'a1b2c3d4-0003-4000-8000-000000000003')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.expense_splits (expense_id, user_id, share_amount) VALUES
  ('e1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0003-4000-8000-000000000003', 200.00), -- Ali's share
  ('e1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0001-4000-8000-000000000001', 200.00), -- Waheed owes Ali 200
  ('e1b2c3d4-0001-4000-8000-000000000001', 'a1b2c3d4-0002-4000-8000-000000000002', 200.00)  -- Usman owes Ali 200
ON CONFLICT (expense_id, user_id) DO NOTHING;
