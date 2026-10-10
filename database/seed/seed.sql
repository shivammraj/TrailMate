-- Seed data for development
INSERT INTO users (id, session_id, xp, streak, outdoor_minutes, missions_completed)
VALUES ('00000000-0000-0000-0000-000000000001', 'test-session-id', 500, 3, 120, 2)
ON CONFLICT DO NOTHING;

INSERT INTO missions (id, user_id, type, title, description, difficulty, status, xp_reward, estimated_duration, estimated_distance)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'nature', 'Morning Forest Walk', 'Explore the nearby forest and find unique plants.', 'easy', 'completed', 100, 30, 2.0),
  ('11111111-1111-1111-1111-111111111112', '00000000-0000-0000-0000-000000000001', 'birds', 'Bird Watcher Pro', 'Spot and identify local bird species.', 'medium', 'active', 200, 45, 3.5),
  ('11111111-1111-1111-1111-111111111113', '00000000-0000-0000-0000-000000000001', 'plants', 'Urban Botanist', 'Discover plants growing in urban environments.', 'easy', 'available', 150, 25, 1.5)
ON CONFLICT DO NOTHING;

INSERT INTO mission_objectives (id, mission_id, description, type, target, count, completed)
VALUES 
  ('22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 'Find a fern', 'find', 'fern', 1, 1),
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111112', 'Photograph a pigeon', 'photograph', 'pigeon', 1, 0),
  ('22222222-2222-2222-2222-222222222223', '11111111-1111-1111-1111-111111111113', 'Identify a dandelion', 'identify', 'dandelion', 1, 0)
ON CONFLICT DO NOTHING;

INSERT INTO discoveries (id, user_id, mission_id, label, category, description, confidence, coarse_lat, coarse_lng, city)
VALUES 
  ('33333333-3333-3333-3333-333333333331', '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Sword Fern', 'Plant', 'A lush green sword fern found near a creek.', 0.95, 47.6, -122.3, 'Seattle'),
  ('33333333-3333-3333-3333-333333333332', '00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Oak Tree', 'Tree', 'A large oak tree with acorn shells scattered around.', 0.88, 47.6, -122.3, 'Seattle')
ON CONFLICT DO NOTHING;

INSERT INTO achievements (id, user_id, type, title, description, icon)
VALUES 
  ('44444444-4444-4444-4444-444444444441', '00000000-0000-0000-0000-000000000001', 'explorer', 'First Steps', 'Completed your first mission.', '🥾'),
  ('44444444-4444-4444-4444-444444444442', '00000000-0000-0000-0000-000000000001', 'botanist', 'Plant Lover', 'Found 5 different plants.', '🌿')
ON CONFLICT DO NOTHING;
