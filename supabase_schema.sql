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

    -- =======================================================
    -- Módulo de Calistenia (Manobras Estáticas - Skill Tree)
    -- =======================================================

    -- 1. Tabela de Manobras de Calistenia
    CREATE TABLE IF NOT EXISTS public.fitlife_calisthenics_maneuvers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        level TEXT NOT NULL,                  -- 'Iniciante', 'Intermediario', 'Avançado'
        category TEXT NOT NULL,               -- ex: 'Empurrar/Equilibrio', 'Core/Empurrar'
        phase1_requirements JSONB NOT NULL,   -- array de {exercise, target, unit}
        phase2_requirements JSONB NOT NULL,   -- array de {exercise, target, unit}
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    ALTER TABLE public.fitlife_calisthenics_maneuvers DISABLE ROW LEVEL SECURITY;

    -- 2. Tabela de Progresso do Usuário
    CREATE TABLE IF NOT EXISTS public.fitlife_calisthenics_progress (
        profile_id TEXT NOT NULL REFERENCES public.fitlife_profiles(id) ON DELETE CASCADE,
        maneuver_id TEXT NOT NULL REFERENCES public.fitlife_calisthenics_maneuvers(id) ON DELETE CASCADE,
        status TEXT NOT NULL DEFAULT 'bloqueado', -- 'bloqueado', 'treinando', 'dominado'
        phase1_progress JSONB NOT NULL DEFAULT '[]'::jsonb, -- array de {exercise, value}
        phase2_progress JSONB NOT NULL DEFAULT '[]'::jsonb, -- array de {exercise, value}
        phase2_unlocked BOOLEAN NOT NULL DEFAULT false,
        maneuver_unlocked BOOLEAN NOT NULL DEFAULT false,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
        PRIMARY KEY (profile_id, maneuver_id)
    );

    ALTER TABLE public.fitlife_calisthenics_progress DISABLE ROW LEVEL SECURITY;

    -- 3. Trigger Function: Limites de Treinamento e Segurança
    CREATE OR REPLACE FUNCTION public.fn_check_active_maneuvers()
    RETURNS TRIGGER AS $$
    DECLARE
        v_active_count INTEGER;
        v_category TEXT;
        v_conflicting_name TEXT;
    BEGIN
        -- Verifica apenas quando transiciona status para 'treinando'
        IF NEW.status = 'treinando' AND (OLD.status IS NULL OR OLD.status <> 'treinando') THEN
            -- Obter categoria da manobra que está sendo ativada
            SELECT category INTO v_category 
            FROM public.fitlife_calisthenics_maneuvers 
            WHERE id = NEW.maneuver_id;

            -- 1. Limite de Metas Ativas: Máximo de 2 manobras treinando simultaneamente
            SELECT COUNT(*) INTO v_active_count
            FROM public.fitlife_calisthenics_progress
            WHERE profile_id = NEW.profile_id AND status = 'treinando' AND maneuver_id <> NEW.maneuver_id;

            IF v_active_count >= 2 THEN
                RAISE EXCEPTION 'Você já possui o limite máximo de 2 metas ativas em treinamento simultaneamente.';
            END IF;

            -- 2. Bloqueio por Categoria: Proibir ativação de duas manobras da mesma categoria
            SELECT m.name INTO v_conflicting_name
            FROM public.fitlife_calisthenics_progress p
            JOIN public.fitlife_calisthenics_maneuvers m ON p.maneuver_id = m.id
            WHERE p.profile_id = NEW.profile_id 
              AND p.status = 'treinando' 
              AND m.category = v_category
              AND p.maneuver_id <> NEW.maneuver_id
            LIMIT 1;

            IF v_conflicting_name IS NOT NULL THEN
                RAISE EXCEPTION 'Bloqueio por Categoria: Você já está treinando a manobra "%", que possui a mesma categoria ("%").', v_conflicting_name, v_category;
            END IF;
        END IF;
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- 4. Trigger Function: Validação e Destravamento de Fases
    CREATE OR REPLACE FUNCTION public.fn_validate_calisthenics_progress()
    RETURNS TRIGGER AS $$
    DECLARE
        r_phase1 JSONB;
        r_phase2 JSONB;
        v_phase1_met BOOLEAN := TRUE;
        v_phase2_met BOOLEAN := TRUE;
        req_item RECORD;
        prog_item RECORD;
        v_found BOOLEAN;
        v_val NUMERIC;
    BEGIN
        -- Carrega os requerimentos da manobra
        SELECT phase1_requirements, phase2_requirements 
        INTO r_phase1, r_phase2 
        FROM public.fitlife_calisthenics_maneuvers 
        WHERE id = NEW.maneuver_id;

        -- Valida Fase 1
        FOR req_item IN SELECT * FROM jsonb_to_recordset(r_phase1) AS x(exercise TEXT, target NUMERIC) LOOP
            v_found := FALSE;
            v_val := 0;
            FOR prog_item IN SELECT * FROM jsonb_to_recordset(NEW.phase1_progress) AS y(exercise TEXT, value NUMERIC) LOOP
                IF prog_item.exercise = req_item.exercise THEN
                    v_found := TRUE;
                    v_val := prog_item.value;
                END IF;
            END LOOP;
            IF NOT v_found OR v_val < req_item.target THEN
                v_phase1_met := FALSE;
            END IF;
        END LOOP;

        NEW.phase2_unlocked := v_phase1_met;

        -- Se a Fase 1 não foi cumprida mas há progresso na Fase 2, barra o avanço
        IF NOT v_phase1_met THEN
            FOR prog_item IN SELECT * FROM jsonb_to_recordset(NEW.phase2_progress) AS y(exercise TEXT, value NUMERIC) LOOP
                IF prog_item.value > 0 THEN
                    RAISE EXCEPTION 'A Fase 2 está bloqueada. Cumpra todos os pré-requisitos da Fase 1 primeiro.';
                END IF;
            END LOOP;
            v_phase2_met := FALSE;
        ELSE
            -- Valida Fase 2 se a Fase 1 está OK
            FOR req_item IN SELECT * FROM jsonb_to_recordset(r_phase2) AS x(exercise TEXT, target NUMERIC) LOOP
                v_found := FALSE;
                v_val := 0;
                FOR prog_item IN SELECT * FROM jsonb_to_recordset(NEW.phase2_progress) AS y(exercise TEXT, value NUMERIC) LOOP
                    IF prog_item.exercise = req_item.exercise THEN
                        v_found := TRUE;
                        v_val := prog_item.value;
                    END IF;
                END LOOP;
                IF NOT v_found OR v_val < req_item.target THEN
                    v_phase2_met := FALSE;
                END IF;
            END LOOP;
        END IF;

        NEW.maneuver_unlocked := v_phase2_met;

        -- Se tenta concluir (dominado) sem fechar a Fase 2, barra
        IF NEW.status = 'dominado' AND NOT v_phase2_met THEN
            RAISE EXCEPTION 'A manobra final só é liberada para domínio após a conclusão de todos os exercícios da Fase 2.';
        END IF;

        -- Atualiza timestamp
        NEW.updated_at := timezone('utc'::text, now());

        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    -- Criar Triggers
    DROP TRIGGER IF EXISTS trg_check_active_maneuvers ON public.fitlife_calisthenics_progress;
    CREATE TRIGGER trg_check_active_maneuvers
    BEFORE INSERT OR UPDATE OF status ON public.fitlife_calisthenics_progress
    FOR EACH ROW EXECUTE FUNCTION public.fn_check_active_maneuvers();

    DROP TRIGGER IF EXISTS trg_validate_calisthenics_progress ON public.fitlife_calisthenics_progress;
    CREATE TRIGGER trg_validate_calisthenics_progress
    BEFORE INSERT OR UPDATE OF phase1_progress, phase2_progress, status ON public.fitlife_calisthenics_progress
    FOR EACH ROW EXECUTE FUNCTION public.fn_validate_calisthenics_progress();

    -- 5. Seed Data para as Manobras de Calistenia
    INSERT INTO public.fitlife_calisthenics_maneuvers (id, name, level, category, phase1_requirements, phase2_requirements)
    VALUES
    (
      'frog_stand', 
      'Frog Stand', 
      'Iniciante', 
      'Empurrar/Equilibrio',
      '[{"exercise": "Prancha Tradicional", "target": 45, "unit": "segundos"}, {"exercise": "Prancha Alta", "target": 35, "unit": "segundos"}]'::jsonb,
      '[{"exercise": "Lean Plank", "target": 15, "unit": "segundos"}, {"exercise": "Frog Stand Assistido", "target": 30, "unit": "segundos"}]'::jsonb
    ),
    (
      'elbow_lever', 
      'Elbow Lever', 
      'Iniciante', 
      'Empurrar/Equilibrio',
      '[{"exercise": "Flexoes de Braco Tradicionais", "target": 15, "unit": "repeticoes"}, {"exercise": "Prancha Lombar (Superman)", "target": 30, "unit": "segundos"}]'::jsonb,
      '[{"exercise": "Elbow Lever com pes no chao", "target": 25, "unit": "segundos"}, {"exercise": "Elbow Lever em Straddle", "target": 8, "unit": "segundos"}]'::jsonb
    ),
    (
      'l_sit', 
      'L-Sit', 
      'Intermediario', 
      'Core/Empurrar',
      '[{"exercise": "Abdominal Canoa (Hollow Body)", "target": 30, "unit": "segundos"}, {"exercise": "Fundos nas Paralelas (Dips)", "target": 10, "unit": "repeticoes"}]'::jsonb,
      '[{"exercise": "Support Hold nas Paralelas", "target": 30, "unit": "segundos"}, {"exercise": "Tuck L-Sit", "target": 15, "unit": "segundos"}, {"exercise": "One-Leg L-Sit", "target": 10, "unit": "segundos"}]'::jsonb
    ),
    (
      'handstand', 
      'Handstand (Parada de Mao)', 
      'Intermediario', 
      'Empurrar/Equilibrio',
      '[{"exercise": "Flexao Pike", "target": 8, "unit": "repeticoes"}, {"exercise": "Prancha Alta", "target": 45, "unit": "segundos"}]'::jsonb,
      '[{"exercise": "Handstand na Parede (Costas)", "target": 30, "unit": "segundos"}, {"exercise": "Handstand na Parede (Frente)", "target": 20, "unit": "segundos"}, {"exercise": "Wall Scissor", "target": 6, "unit": "repeticoes"}]'::jsonb
    ),
    (
      'skin_the_cat', 
      'Skin the Cat', 
      'Intermediario', 
      'Puxar/Mobilidade',
      '[{"exercise": "Barra Fixa (Pull-ups)", "target": 8, "unit": "repeticoes"}, {"exercise": "Elevacao de Joelhos na Barra", "target": 12, "unit": "repeticoes"}]'::jsonb,
      '[{"exercise": "Toes to Bar (Pes na Barra)", "target": 5, "unit": "repeticoes"}, {"exercise": "Skin the Cat Assistido", "target": 4, "unit": "repeticoes"}]'::jsonb
    ),
    (
      'human_flag', 
      'Bandeira Humana (Human Flag)', 
      'Avançado', 
      'Empurrar/Equilibrio',
      '[{"exercise": "Puxada escapular na barra fixa", "target": 12, "unit": "repeticoes"}, {"exercise": "Paralela", "target": 8, "unit": "repeticoes"}]'::jsonb,
      '[{"exercise": "Elevação lateral com toalha na parede", "target": 10, "unit": "repeticoes"}, {"exercise": "Bandeira Humana", "target": 6, "unit": "repeticoes"}]'::jsonb
    ),
    (
      'muscle_up', 
      'Muscle Up', 
      'Avançado', 
      'Puxar/Empurrar',
      '[{"exercise": "Barra Fixa com Pegada Supinada", "target": 8, "unit": "repeticoes"}, {"exercise": "Paralela", "target": 10, "unit": "repeticoes"}]'::jsonb,
      '[{"exercise": "Puxada escapular na barra fixa", "target": 10, "unit": "repeticoes"}, {"exercise": "Muscle up", "target": 4, "unit": "repeticoes"}]'::jsonb
    )
    ON CONFLICT (id) DO UPDATE 
    SET name = EXCLUDED.name, 
        level = EXCLUDED.level, 
        category = EXCLUDED.category, 
        phase1_requirements = EXCLUDED.phase1_requirements, 
        phase2_requirements = EXCLUDED.phase2_requirements;


