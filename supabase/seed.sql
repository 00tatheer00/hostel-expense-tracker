-- KamraKhata Phase 3 Seed SQL Data

-- Insert 5 Static Room 14 Roommates
INSERT INTO public.users (id, name, email, avatar_color, theme) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Tatheer', 'tatheer@kamrakhata.internal', '#10B981', '{"role":"Room Admin","status":"approved"}'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Sadam', 'sadam@kamrakhata.internal', '#F59E0B', '{"role":"Roommate","status":"approved"}'),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'Ahmed Ali', 'ahmedali@kamrakhata.internal', '#3B82F6', '{"role":"Roommate","status":"approved"}'),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'Syed ALi Mehdi', 'syedalimehdi@kamrakhata.internal', '#8B5CF6', '{"role":"Roommate","status":"approved"}'),
  ('a1b2c3d4-0005-4000-8000-000000000005', 'Muhammad Rohail', 'muhammadrohail@kamrakhata.internal', '#F43F5E', '{"role":"Roommate","status":"approved"}')
ON CONFLICT (email) DO NOTHING;
