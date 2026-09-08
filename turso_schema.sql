-- =======================================================
-- FitLife Database Schema for Turso / LibSQL (SQLite)
-- Execute este script no Dashboard do Turso ou via script
-- =======================================================

-- 1. Tabela de Perfis
CREATE TABLE IF NOT EXISTS fitlife_profiles (
    id TEXT PRIMARY KEY,                       -- 'fabio', 'esposa'
    name TEXT NOT NULL,
    avatar TEXT,
    theme TEXT,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 2. Tabela de Treinos (Planilhas de exercícios)
CREATE TABLE IF NOT EXISTS fitlife_workouts (
    id TEXT PRIMARY KEY,                       -- timestamp como string ou id
    profile_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    cover_style TEXT,
    exercises TEXT NOT NULL DEFAULT '[]',      -- JSON string
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (profile_id) REFERENCES fitlife_profiles(id) ON DELETE CASCADE
);

-- 3. Tabela de Histórico (Treinos finalizados)
CREATE TABLE IF NOT EXISTS fitlife_history (
    id TEXT PRIMARY KEY,                       -- timestamp como string ou id
    profile_id TEXT NOT NULL,
    workout_id TEXT,
    workout_name TEXT NOT NULL,
    date TEXT NOT NULL,
    duration INTEGER NOT NULL DEFAULT 0,
    is_cardio INTEGER NOT NULL DEFAULT 0,      -- 0 ou 1 (boolean no SQLite)
    cardio_type TEXT,
    distance REAL DEFAULT 0,
    heart_rate REAL,
    calories REAL,
    exercises TEXT NOT NULL DEFAULT '[]',      -- JSON string
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (profile_id) REFERENCES fitlife_profiles(id) ON DELETE CASCADE
);

-- 4. Tabela de Dados Consolidados do Perfil
CREATE TABLE IF NOT EXISTS fitlife_profile_data (
    profile_id TEXT PRIMARY KEY,
    favorites TEXT DEFAULT '[]',               -- JSON string
    personal_records TEXT DEFAULT '{}',        -- JSON string
    measurements TEXT DEFAULT '[]',            -- JSON string
    skills TEXT DEFAULT '{}',                  -- JSON string
    profile_details TEXT DEFAULT '{}',         -- JSON string
    active_workout TEXT DEFAULT NULL,          -- JSON string
    evolution_photos TEXT DEFAULT '[]',        -- JSON string
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (profile_id) REFERENCES fitlife_profiles(id) ON DELETE CASCADE
);

-- 5. Inserir Perfis Padrão
INSERT OR REPLACE INTO fitlife_profiles (id, name, avatar, theme, updated_at)
VALUES 
    ('fabio', 'Fábio', '⚡', 'fabio', datetime('now')),
    ('esposa', 'Adlai 💖', '💖', 'esposa', datetime('now'));

-- Inserir Dados Padrão Associados
INSERT OR IGNORE INTO fitlife_profile_data (profile_id, updated_at)
VALUES 
    ('fabio', datetime('now')),
    ('esposa', datetime('now'));

-- =======================================================
-- Módulo de Calistenia (Manobras Estáticas - Skill Tree)
-- =======================================================

-- 6. Tabela de Manobras de Calistenia
CREATE TABLE IF NOT EXISTS fitlife_calisthenics_maneuvers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    level TEXT NOT NULL,                  -- 'Iniciante', 'Intermediario', 'Avançado'
    category TEXT NOT NULL,               -- ex: 'Empurrar/Equilibrio', 'Core/Empurrar'
    phase1_requirements TEXT NOT NULL,   -- JSON array
    phase2_requirements TEXT NOT NULL,   -- JSON array
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 7. Tabela de Progresso do Usuário na Calistenia
CREATE TABLE IF NOT EXISTS fitlife_calisthenics_progress (
    profile_id TEXT NOT NULL,
    maneuver_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'bloqueado', -- 'bloqueado', 'treinando', 'dominado'
    phase1_progress TEXT NOT NULL DEFAULT '[]', -- JSON array
    phase2_progress TEXT NOT NULL DEFAULT '[]', -- JSON array
    phase2_unlocked INTEGER NOT NULL DEFAULT 0, -- 0 ou 1
    maneuver_unlocked INTEGER NOT NULL DEFAULT 0, -- 0 ou 1
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (profile_id, maneuver_id),
    FOREIGN KEY (profile_id) REFERENCES fitlife_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (maneuver_id) REFERENCES fitlife_calisthenics_maneuvers(id) ON DELETE CASCADE
);

-- 8. Seed Data de Calistenia
INSERT OR REPLACE INTO fitlife_calisthenics_maneuvers (id, name, level, category, phase1_requirements, phase2_requirements)
VALUES
(
  'frog_stand', 
  'Frog Stand', 
  'Iniciante', 
  'Empurrar/Equilibrio',
  '[{"exercise": "Mobilidade: Aquecimento de Punhos", "target": 1, "unit": "concluido"}, {"exercise": "Técnica: Técnica da Garra", "target": 1, "unit": "concluido"}, {"exercise": "Nível 1: Prancha Alta", "target": 60, "unit": "segundos"}, {"exercise": "Nível 2: Planche Lean", "target": 30, "unit": "segundos"}]',
  '[{"exercise": "Nível 3: Encaixe de Sapo (1 pé)", "target": 10, "unit": "segundos"}, {"exercise": "Nível 4: Sapo Assistido (Testa no travesseiro)", "target": 15, "unit": "segundos"}]'
),
(
  'elbow_lever', 
  'Elbow Lever', 
  'Iniciante', 
  'Empurrar/Equilibrio',
  '[{"exercise": "Flexoes de Braco Tradicionais", "target": 15, "unit": "repeticoes"}, {"exercise": "Prancha Lombar (Superman)", "target": 30, "unit": "segundos"}]',
  '[{"exercise": "Elbow Lever com pes no chao", "target": 25, "unit": "segundos"}, {"exercise": "Elbow Lever em Straddle", "target": 8, "unit": "segundos"}]'
),
(
  'l_sit', 
  'L-Sit', 
  'Intermediario', 
  'Core/Empurrar',
  '[{"exercise": "Abdominal Canoa (Hollow Body)", "target": 30, "unit": "segundos"}, {"exercise": "Fundos nas Paralelas (Dips)", "target": 10, "unit": "repeticoes"}]',
  '[{"exercise": "Support Hold nas Paralelas", "target": 30, "unit": "segundos"}, {"exercise": "Tuck L-Sit", "target": 15, "unit": "segundos"}, {"exercise": "One-Leg L-Sit", "target": 10, "unit": "segundos"}]'
),
(
  'handstand', 
  'Handstand (Parada de Mao)', 
  'Intermediario', 
  'Empurrar/Equilibrio',
  '[{"exercise": "Flexao Pike", "target": 8, "unit": "repeticoes"}, {"exercise": "Prancha Alta", "target": 45, "unit": "segundos"}]',
  '[{"exercise": "Handstand na Parede (Costas)", "target": 30, "unit": "segundos"}, {"exercise": "Handstand na Parede (Frente)", "target": 20, "unit": "segundos"}, {"exercise": "Wall Scissor", "target": 6, "unit": "repeticoes"}]'
),
(
  'skin_the_cat', 
  'Skin the Cat', 
  'Intermediario', 
  'Puxar/Mobilidade',
  '[{"exercise": "Barra Fixa (Pull-ups)", "target": 8, "unit": "repeticoes"}, {"exercise": "Elevacao de Joelhos na Barra", "target": 12, "unit": "repeticoes"}]',
  '[{"exercise": "Toes to Bar (Pes na Barra)", "target": 5, "unit": "repeticoes"}, {"exercise": "Skin the Cat Assistido", "target": 4, "unit": "repeticoes"}]'
),
(
  'human_flag', 
  'Bandeira Humana (Human Flag)', 
  'Avançado', 
  'Empurrar/Equilibrio',
  '[{"exercise": "Puxada escapular na barra fixa", "target": 12, "unit": "repeticoes"}, {"exercise": "Paralela", "target": 8, "unit": "repeticoes"}]',
  '[{"exercise": "Elevação lateral com toalha na parede", "target": 10, "unit": "repeticoes"}, {"exercise": "Bandeira Humana", "target": 6, "unit": "repeticoes"}]'
),
(
  'muscle_up', 
  'Muscle Up', 
  'Avançado', 
  'Puxar/Empurrar',
  '[{"exercise": "Barra Fixa com Pegada Supinada", "target": 8, "unit": "repeticoes"}, {"exercise": "Paralela", "target": 10, "unit": "repeticoes"}]',
  '[{"exercise": "Puxada escapular na barra fixa", "target": 10, "unit": "repeticoes"}, {"exercise": "Muscle up", "target": 4, "unit": "repeticoes"}]'
);
