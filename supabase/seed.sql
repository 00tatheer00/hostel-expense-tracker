-- KamraKhata Phase 3 Seed SQL Data

-- Insert 8 Static Room 14 Roommates (Amanullah, Aizaz, and Masood added from September 2026)
INSERT INTO public.users (id, name, email, avatar_color, theme, created_at) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Tatheer', 'tatheer@kamrakhata.internal', '#10B981', '{"role":"Room Admin","status":"approved","password":"Tatheer123"}', '2026-08-01T00:00:00.000Z'),
  ('a1b2c3d4-0002-4000-8000-000000000002', 'Sadam', 'sadam@kamrakhata.internal', '#F59E0B', '{"role":"Roommate","status":"approved","password":"Sadam123"}', '2026-08-01T00:00:00.000Z'),
  ('a1b2c3d4-0003-4000-8000-000000000003', 'Ahmed Ali', 'ahmedali@kamrakhata.internal', '#3B82F6', '{"role":"Roommate","status":"approved","password":"Ahmad123"}', '2026-08-01T00:00:00.000Z'),
  ('a1b2c3d4-0004-4000-8000-000000000004', 'Syed ALi Mehdi', 'syedalimehdi@kamrakhata.internal', '#8B5CF6', '{"role":"Roommate","status":"approved","password":"Syed123"}', '2026-08-01T00:00:00.000Z'),
  ('a1b2c3d4-0005-4000-8000-000000000005', 'Muhammad Rohail', 'muhammadrohail@kamrakhata.internal', '#F43F5E', '{"role":"Roommate","status":"approved","password":"Muhammad123"}', '2026-08-01T00:00:00.000Z'),
  ('a1b2c3d4-0006-4000-8000-000000000006', 'Amanullah', 'amankhan707022@gmail.com', '#06B6D4', '{"role":"Roommate","status":"approved","password":"Aman.123"}', '2026-09-01T00:00:00.000Z'),
  ('a1b2c3d4-0007-4000-8000-000000000007', 'Aizaz', 'aizaz@gmail.com', '#EC4899', '{"role":"Roommate","status":"approved","password":"Aizaz.123"}', '2026-09-01T00:00:00.000Z'),
  ('a1b2c3d4-0008-4000-8000-000000000008', 'Masood', 'masood.haider.bangash1@gmail.com', '#8B5CF6', '{"role":"Roommate","status":"approved","password":"Masood.123"}', '2026-09-01T00:00:00.000Z')
ON CONFLICT (email) DO NOTHING;

