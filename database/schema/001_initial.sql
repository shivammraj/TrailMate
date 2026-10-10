-- TrailMate AI Database Schema
-- Using session_id pattern (no auth required)

-- Users table (anonymous sessions)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  xp INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  outdoor_minutes INTEGER NOT NULL DEFAULT 0,
  missions_completed INTEGER NOT NULL DEFAULT 0,
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_session_id ON users(session_id);

-- Missions table
CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('nature', 'birds', 'plants', 'photography', 'running', 'custom')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'active', 'completed', 'failed')),
  xp_reward INTEGER NOT NULL DEFAULT 100,
  estimated_duration INTEGER, -- minutes
  estimated_distance DECIMAL(5,2), -- km
  ai_tips JSONB DEFAULT '[]'::jsonb,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_missions_user_id ON missions(user_id);
CREATE INDEX IF NOT EXISTS idx_missions_status ON missions(status);

-- Mission Objectives table
CREATE TABLE IF NOT EXISTS mission_objectives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('find', 'photograph', 'identify', 'walk')),
  target TEXT,
  count INTEGER NOT NULL DEFAULT 1,
  completed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_objectives_mission_id ON mission_objectives(mission_id);

-- Evidence table
CREATE TABLE IF NOT EXISTS evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  objective_id UUID REFERENCES mission_objectives(id),
  type TEXT NOT NULL DEFAULT 'photo' CHECK (type IN ('photo', 'audio', 'text')),
  ai_label TEXT,
  ai_confidence DECIMAL(4,3),
  ai_category TEXT,
  ai_description TEXT,
  ai_model TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evidence_mission_id ON evidence(mission_id);

-- Discoveries table (the fun collection!)
CREATE TABLE IF NOT EXISTS discoveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES missions(id),
  label TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  confidence DECIMAL(4,3),
  coarse_lat DECIMAL(6,2), -- Rounded for privacy
  coarse_lng DECIMAL(6,2), -- Rounded for privacy
  city TEXT,
  discovered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_discoveries_user_id ON discoveries(user_id);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '🏆',
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Outdoor Sessions table
CREATE TABLE IF NOT EXISTS outdoor_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES missions(id),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  distance_km DECIMAL(5,2),
  outdoor_minutes INTEGER
);

-- Helper function: get or create user by session_id
CREATE OR REPLACE FUNCTION get_or_create_user(p_session_id TEXT)
RETURNS UUID AS $$
DECLARE
  v_user_id UUID;
BEGIN
  SELECT id INTO v_user_id FROM users WHERE session_id = p_session_id;
  IF v_user_id IS NULL THEN
    INSERT INTO users (session_id) VALUES (p_session_id) RETURNING id INTO v_user_id;
  END IF;
  RETURN v_user_id;
END;
$$ LANGUAGE plpgsql;
