-- =======================================================
-- FitLife Database Schema Setup (Prefixado para evitar conflitos)
-- Execute este script no SQL Editor do seu projeto Supabase existente
-- =======================================================

-- 1. Tabela de Perfis
CREATE TABLE IF NOT EXISTS public.fitlife_profiles (
    id TEXT PRIMARY KEY,                       -- 'fabio', 'esposa'
    name TEXT NOT NULL,
    avatar TEXT,
    theme TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Desabilitar RLS para simplificar integração direta no app cliente
ALTER TABLE public.fitlife_profiles DISABLE ROW LEVEL SECURITY;

-- 2. Tabela de Treinos (Planilhas de exercícios)
CREATE TABLE IF NOT EXISTS public.fitlife_workouts (
    id TEXT PRIMARY KEY,                       -- timestamp como string ou uuid
    profile_id TEXT NOT NULL REFERENCES public.fitlife_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    cover_style TEXT,
    exercises JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.fitlife_workouts DISABLE ROW LEVEL SECURITY;

-- 3. Tabela de Histórico (Treinos finalizados)
CREATE TABLE IF NOT EXISTS public.fitlife_history (
    id TEXT PRIMARY KEY,                       -- timestamp como string ou uuid
    profile_id TEXT NOT NULL REFERENCES public.fitlife_profiles(id) ON DELETE CASCADE,
    workout_id TEXT,
    workout_name TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER NOT NULL DEFAULT 0,
    is_cardio BOOLEAN DEFAULT false,
    cardio_type TEXT,
    distance NUMERIC DEFAULT 0,
    heart_rate NUMERIC,
    calories NUMERIC,
    exercises JSONB NOT NULL DEFAULT '[]'::jsonb,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.fitlife_history DISABLE ROW LEVEL SECURITY;

-- 4. Tabela de Dados Consolidados do Perfil
CREATE TABLE IF NOT EXISTS public.fitlife_profile_data (
    profile_id TEXT PRIMARY KEY REFERENCES public.fitlife_profiles(id) ON DELETE CASCADE,
    favorites JSONB DEFAULT '[]'::jsonb,
    personal_records JSONB DEFAULT '{}'::jsonb,
    measurements JSONB DEFAULT '[]'::jsonb,
    skills JSONB DEFAULT '{}'::jsonb,
    profile_details JSONB DEFAULT '{}'::jsonb,
    active_workout JSONB DEFAULT NULL,
    evolution_photos JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.fitlife_profile_data DISABLE ROW LEVEL SECURITY;

-- 5. Inserir os dois perfis padrão
INSERT INTO public.fitlife_profiles (id, name, avatar, theme)
VALUES 
    ('fabio', 'Fábio', '⚡', 'fabio'),
    ('esposa', 'Adlai 💖', '💖', 'esposa')
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name, avatar = EXCLUDED.avatar, theme = EXCLUDED.theme;

-- Inserir dados padrão associados
INSERT INTO public.fitlife_profile_data (profile_id)
VALUES 
    ('fabio'),
    ('esposa')
ON CONFLICT (profile_id) DO NOTHING;
