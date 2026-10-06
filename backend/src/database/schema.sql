-- TEVIX Relational Database Schema
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  department TEXT NOT NULL,
  year INTEGER NOT NULL,
  gender TEXT NOT NULL,
  contact_preference TEXT DEFAULT 'Email',
  experience_level TEXT NOT NULL DEFAULT 'Intermediate',
  hackathons_count INTEGER DEFAULT 0,
  github_url TEXT,
  linkedin_url TEXT,
  bio TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS student_skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  proficiency TEXT DEFAULT 'Intermediate',
  UNIQUE(profile_id, skill_id)
);

CREATE TABLE IF NOT EXISTS roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS student_roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  is_primary INTEGER DEFAULT 0,
  UNIQUE(profile_id, role_id)
);

CREATE TABLE IF NOT EXISTS availability (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_id INTEGER UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  days TEXT DEFAULT 'Weekends',
  time_slots TEXT DEFAULT 'Evening, Night',
  hours_per_week INTEGER DEFAULT 15
);

CREATE TABLE IF NOT EXISTS hackathons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  start_date TEXT,
  end_date TEXT,
  team_size_min INTEGER DEFAULT 2,
  team_size_max INTEGER DEFAULT 4
);

CREATE TABLE IF NOT EXISTS teams (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  leader_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  hackathon_id INTEGER REFERENCES hackathons(id),
  name TEXT NOT NULL,
  description TEXT,
  max_size INTEGER DEFAULT 4,
  status TEXT DEFAULT 'forming',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_in_team TEXT,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(team_id, profile_id)
);

CREATE TABLE IF NOT EXISTS team_requirements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id INTEGER UNIQUE NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  department_preference TEXT DEFAULT 'Any',
  gender_requirement TEXT DEFAULT 'Any',
  experience_requirement TEXT DEFAULT 'Any',
  preferred_availability TEXT DEFAULT 'Flexible',
  notes TEXT
);

CREATE TABLE IF NOT EXISTS team_required_skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  UNIQUE(team_id, skill_id)
);

CREATE TABLE IF NOT EXISTS team_required_roles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  UNIQUE(team_id, role_id)
);

CREATE TABLE IF NOT EXISTS requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  sender_profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL, -- 'team_invite' or 'join_request'
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'cancelled'
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_student_skills_profile ON student_skills(profile_id);
CREATE INDEX IF NOT EXISTS idx_student_roles_profile ON student_roles(profile_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_requests_receiver ON requests(receiver_profile_id);
CREATE INDEX IF NOT EXISTS idx_requests_sender ON requests(sender_profile_id);
