import { turso } from '../tursoClient';
import { supabase } from '../supabaseClient';
import { buildSkillsFromDb, mergeDefaultSkills } from '../context/workoutData';

/**
 * Universal Database Service for FitLife
 * Supports Turso (LibSQL/SQLite) as primary cloud database, with Supabase fallback.
 */

export const dbService = {
    // 1. Check which backend is active
    isTursoActive() {
        return !!turso;
    },
    isSupabaseActive() {
        return !!supabase;
    },
    isCloudActive() {
        return !!turso || !!supabase;
    },

    // 2. Load all user data for a profile
    async loadProfileData(profileId) {
        if (turso) {
            try {
                // Workouts
                const workoutsRes = await turso.execute({
                    sql: 'SELECT * FROM fitlife_workouts WHERE profile_id = ?',
                    args: [profileId]
                });
                const workouts = (workoutsRes.rows || []).map(w => ({
                    id: Number(w.id) || w.id,
                    name: w.name,
                    description: w.description,
                    coverStyle: w.cover_style,
                    exercises: typeof w.exercises === 'string' ? JSON.parse(w.exercises || '[]') : (w.exercises || []),
                    createdAt: w.created_at,
                    updatedAt: w.updated_at
                }));

                // History
                const historyRes = await turso.execute({
                    sql: 'SELECT * FROM fitlife_history WHERE profile_id = ? ORDER BY date DESC',
                    args: [profileId]
                });
                const history = (historyRes.rows || []).map(h => ({
                    id: Number(h.id) || h.id,
                    workoutId: Number(h.workout_id) || h.workout_id,
                    workoutName: h.workout_name,
                    date: h.date,
                    duration: h.duration,
                    isCardio: Boolean(h.is_cardio),
                    cardioType: h.cardio_type,
                    distance: h.distance,
                    heartRate: h.heart_rate,
                    calories: h.calories,
                    exercises: typeof h.exercises === 'string' ? JSON.parse(h.exercises || '[]') : (h.exercises || []),
                    notes: h.notes
                }));

                // Profile Data
                const pdRes = await turso.execute({
                    sql: 'SELECT * FROM fitlife_profile_data WHERE profile_id = ? LIMIT 1',
                    args: [profileId]
                });
                const pd = pdRes.rows && pdRes.rows[0] ? pdRes.rows[0] : null;

                let parsedPd = null;
                if (pd) {
                    parsedPd = {
                        favorites: typeof pd.favorites === 'string' ? JSON.parse(pd.favorites || '[]') : pd.favorites,
                        personal_records: typeof pd.personal_records === 'string' ? JSON.parse(pd.personal_records || '{}') : pd.personal_records,
                        measurements: typeof pd.measurements === 'string' ? JSON.parse(pd.measurements || '[]') : pd.measurements,
                        skills: typeof pd.skills === 'string' ? JSON.parse(pd.skills || '{}') : pd.skills,
                        profile_details: typeof pd.profile_details === 'string' ? JSON.parse(pd.profile_details || '{}') : pd.profile_details,
                        active_workout: typeof pd.active_workout === 'string' ? JSON.parse(pd.active_workout || 'null') : pd.active_workout,
                        evolution_photos: typeof pd.evolution_photos === 'string' ? JSON.parse(pd.evolution_photos || '[]') : pd.evolution_photos
                    };
                }

                // Calisthenics Progress
                const calisRes = await turso.execute({
                    sql: 'SELECT * FROM fitlife_calisthenics_progress WHERE profile_id = ?',
                    args: [profileId]
                });
                const calisthenicsData = (calisRes.rows || []).map(c => ({
                    profile_id: c.profile_id,
                    maneuver_id: c.maneuver_id,
                    status: c.status,
                    phase1_progress: typeof c.phase1_progress === 'string' ? JSON.parse(c.phase1_progress || '[]') : c.phase1_progress,
                    phase2_progress: typeof c.phase2_progress === 'string' ? JSON.parse(c.phase2_progress || '[]') : c.phase2_progress,
                    phase2_unlocked: Boolean(c.phase2_unlocked),
                    maneuver_unlocked: Boolean(c.maneuver_unlocked),
                    updated_at: c.updated_at
                }));

                return {
                    source: 'turso',
                    workouts,
                    history,
                    profileData: parsedPd,
                    calisthenicsData
                };
            } catch (err) {
                console.error('❌ Erro ao carregar dados do Turso:', err);
            }
        }

        // Supabase Fallback
        if (supabase) {
            try {
                const [workoutsRes, historyRes, pdRes, calisRes] = await Promise.all([
                    supabase.from('fitlife_workouts').select('*').eq('profile_id', profileId),
                    supabase.from('fitlife_history').select('*').eq('profile_id', profileId).order('date', { ascending: false }),
                    supabase.from('fitlife_profile_data').select('*').eq('profile_id', profileId).maybeSingle(),
                    supabase.from('fitlife_calisthenics_progress').select('*').eq('profile_id', profileId)
                ]);

                const workouts = (workoutsRes.data || []).map(w => ({
                    id: Number(w.id) || w.id,
                    name: w.name,
                    description: w.description,
                    coverStyle: w.cover_style,
                    exercises: w.exercises || [],
                    createdAt: w.created_at,
                    updatedAt: w.updated_at
                }));

                const history = (historyRes.data || []).map(h => ({
                    id: Number(h.id) || h.id,
                    workoutId: Number(h.workout_id) || h.workout_id,
                    workoutName: h.workout_name,
                    date: h.date,
                    duration: h.duration,
                    isCardio: h.is_cardio,
                    cardioType: h.cardio_type,
                    distance: h.distance,
                    heartRate: h.heart_rate,
                    calories: h.calories,
                    exercises: h.exercises || [],
                    notes: h.notes
                }));

                return {
                    source: 'supabase',
                    workouts,
                    history,
                    profileData: pdRes.data || null,
                    calisthenicsData: calisRes.data || []
                };
            } catch (err) {
                console.error('❌ Erro ao carregar dados do Supabase:', err);
            }
        }

        return null;
    },

    // 3. Sync Workouts
    async syncWorkouts(profileId, list) {
        if (turso) {
            try {
                const currentIds = list.map(w => String(w.id));
                const stmts = [];

                if (currentIds.length > 0) {
                    const placeholders = currentIds.map(() => '?').join(',');
                    stmts.push({
                        sql: `DELETE FROM fitlife_workouts WHERE profile_id = ? AND id NOT IN (${placeholders})`,
                        args: [profileId, ...currentIds]
                    });
                } else {
                    stmts.push({
                        sql: 'DELETE FROM fitlife_workouts WHERE profile_id = ?',
                        args: [profileId]
                    });
                }

                for (const w of list) {
                    stmts.push({
                        sql: `INSERT OR REPLACE INTO fitlife_workouts (id, profile_id, name, description, cover_style, exercises, created_at, updated_at)
                              VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
                        args: [
                            String(w.id),
                            profileId,
                            w.name,
                            w.description || '',
                            w.coverStyle || 'geral',
                            JSON.stringify(w.exercises || [])
                        ]
                    });
                }

                await turso.batch(stmts);
                return true;
            } catch (err) {
                console.error('❌ Erro ao sincronizar treinos no Turso:', err);
            }
        }

        if (supabase) {
            try {
                const currentIds = list.map(w => String(w.id));
                if (currentIds.length > 0) {
                    await supabase.from('fitlife_workouts').delete().eq('profile_id', profileId).not('id', 'in', `(${currentIds.join(',')})`);
                } else {
                    await supabase.from('fitlife_workouts').delete().eq('profile_id', profileId);
                }
                if (list.length > 0) {
                    const rows = list.map(w => ({
                        id: String(w.id),
                        profile_id: profileId,
                        name: w.name,
                        description: w.description || '',
                        cover_style: w.coverStyle || 'geral',
                        exercises: w.exercises,
                        updated_at: new Date().toISOString()
                    }));
                    await supabase.from('fitlife_workouts').upsert(rows);
                }
                return true;
            } catch (err) {
                console.error('❌ Erro ao sincronizar treinos no Supabase:', err);
            }
        }
        return false;
    },

    // 4. Sync History
    async syncHistory(profileId, list) {
        if (turso) {
            try {
                const currentIds = list.map(h => String(h.id));
                const stmts = [];

                if (currentIds.length > 0) {
                    const placeholders = currentIds.map(() => '?').join(',');
                    stmts.push({
                        sql: `DELETE FROM fitlife_history WHERE profile_id = ? AND id NOT IN (${placeholders})`,
                        args: [profileId, ...currentIds]
                    });
                } else {
                    stmts.push({
                        sql: 'DELETE FROM fitlife_history WHERE profile_id = ?',
                        args: [profileId]
                    });
                }

                for (const h of list) {
                    stmts.push({
                        sql: `INSERT OR REPLACE INTO fitlife_history (id, profile_id, workout_id, workout_name, date, duration, is_cardio, cardio_type, distance, heart_rate, calories, exercises, notes, created_at)
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
                        args: [
                            String(h.id),
                            profileId,
                            h.workoutId ? String(h.workoutId) : null,
                            h.workoutName,
                            h.date,
                            h.duration || 0,
                            h.isCardio ? 1 : 0,
                            h.cardioType || null,
                            h.distance || 0,
                            h.heartRate || null,
                            h.calories || null,
                            JSON.stringify(h.exercises || []),
                            h.notes || ''
                        ]
                    });
                }

                await turso.batch(stmts);
                return true;
            } catch (err) {
                console.error('❌ Erro ao sincronizar histórico no Turso:', err);
            }
        }

        if (supabase) {
            try {
                const currentIds = list.map(h => String(h.id));
                if (currentIds.length > 0) {
                    await supabase.from('fitlife_history').delete().eq('profile_id', profileId).not('id', 'in', `(${currentIds.join(',')})`);
                } else {
                    await supabase.from('fitlife_history').delete().eq('profile_id', profileId);
                }
                if (list.length > 0) {
                    const rows = list.map(h => ({
                        id: String(h.id),
                        profile_id: profileId,
                        workout_id: h.workoutId ? String(h.workoutId) : null,
                        workout_name: h.workoutName,
                        date: h.date,
                        duration: h.duration,
                        is_cardio: h.isCardio || false,
                        cardio_type: h.cardioType || null,
                        distance: h.distance || 0,
                        heart_rate: h.heartRate || null,
                        calories: h.calories || null,
                        exercises: h.exercises,
                        notes: h.notes || ''
                    }));
                    await supabase.from('fitlife_history').upsert(rows);
                }
                return true;
            } catch (err) {
                console.error('❌ Erro ao sincronizar histórico no Supabase:', err);
            }
        }
        return false;
    },

    // 5. Update Profile Data Single Field
    async updateProfileDataField(profileId, field, data) {
        if (turso) {
            try {
                const serialized = typeof data === 'object' ? JSON.stringify(data) : data;
                await turso.execute({
                    sql: `INSERT INTO fitlife_profile_data (profile_id, ${field}, updated_at) 
                          VALUES (?, ?, datetime('now'))
                          ON CONFLICT(profile_id) DO UPDATE SET ${field} = excluded.${field}, updated_at = datetime('now')`,
                    args: [profileId, serialized]
                });
                return true;
            } catch (err) {
                console.error(`❌ Erro ao salvar ${field} no Turso:`, err);
            }
        }

        if (supabase) {
            try {
                await supabase.from('fitlife_profile_data').upsert({
                    profile_id: profileId,
                    [field]: data,
                    updated_at: new Date().toISOString()
                });
                return true;
            } catch (err) {
                console.error(`❌ Erro ao salvar ${field} no Supabase:`, err);
            }
        }
        return false;
    },

    // 6. Update Multiple Profile Data Fields (Backup/Restore)
    async updateProfileDataMultiple(profileId, fieldsObj) {
        if (turso) {
            try {
                const fieldNames = Object.keys(fieldsObj);
                if (fieldNames.length === 0) return true;

                const setClauses = fieldNames.map(f => `${f} = ?`).join(', ');
                const values = fieldNames.map(f => typeof fieldsObj[f] === 'object' ? JSON.stringify(fieldsObj[f]) : fieldsObj[f]);

                // Garante que o profile_data existe
                await turso.execute({
                    sql: `INSERT OR IGNORE INTO fitlife_profile_data (profile_id, updated_at) VALUES (?, datetime('now'))`,
                    args: [profileId]
                });

                await turso.execute({
                    sql: `UPDATE fitlife_profile_data SET ${setClauses}, updated_at = datetime('now') WHERE profile_id = ?`,
                    args: [...values, profileId]
                });
                return true;
            } catch (err) {
                console.error('❌ Erro ao salvar múltiplos campos no Turso:', err);
            }
        }

        if (supabase) {
            try {
                await supabase.from('fitlife_profile_data').upsert({
                    profile_id: profileId,
                    ...fieldsObj,
                    updated_at: new Date().toISOString()
                });
                return true;
            } catch (err) {
                console.error('❌ Erro ao salvar múltiplos campos no Supabase:', err);
            }
        }
        return false;
    },

    // 7. Calisthenics Progress Sync
    async syncCalisthenicsProgress(profileId, maneuverId, progressPayload) {
        if (turso) {
            try {
                await turso.execute({
                    sql: `INSERT INTO fitlife_calisthenics_progress (profile_id, maneuver_id, status, phase1_progress, phase2_progress, phase2_unlocked, maneuver_unlocked, updated_at)
                          VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
                          ON CONFLICT(profile_id, maneuver_id) DO UPDATE SET
                            status = excluded.status,
                            phase1_progress = excluded.phase1_progress,
                            phase2_progress = excluded.phase2_progress,
                            phase2_unlocked = excluded.phase2_unlocked,
                            maneuver_unlocked = excluded.maneuver_unlocked,
                            updated_at = datetime('now')`,
                    args: [
                        profileId,
                        maneuverId,
                        progressPayload.status,
                        JSON.stringify(progressPayload.phase1_progress || []),
                        JSON.stringify(progressPayload.phase2_progress || []),
                        progressPayload.phase2_unlocked ? 1 : 0,
                        progressPayload.maneuver_unlocked ? 1 : 0
                    ]
                });
                return true;
            } catch (err) {
                console.error('❌ Erro ao salvar progresso de calistenia no Turso:', err);
            }
        }

        if (supabase) {
            try {
                await supabase.from('fitlife_calisthenics_progress').upsert({
                    profile_id: profileId,
                    maneuver_id: maneuverId,
                    ...progressPayload,
                    updated_at: new Date().toISOString()
                });
                return true;
            } catch (err) {
                console.error('❌ Erro ao salvar progresso de calistenia no Supabase:', err);
            }
        }
        return false;
    },

    // 8. Feed and Social Reactions
    async fetchFeed(limit = 30) {
        if (turso) {
            try {
                const res = await turso.execute({
                    sql: 'SELECT * FROM fitlife_history ORDER BY date DESC LIMIT ?',
                    args: [limit]
                });
                return (res.rows || []).map(h => ({
                    id: h.id,
                    profile_id: h.profile_id,
                    workout_id: h.workout_id,
                    workout_name: h.workout_name,
                    date: h.date,
                    duration: h.duration,
                    is_cardio: Boolean(h.is_cardio),
                    cardio_type: h.cardio_type,
                    distance: h.distance,
                    heart_rate: h.heart_rate,
                    calories: h.calories,
                    exercises: typeof h.exercises === 'string' ? JSON.parse(h.exercises || '[]') : h.exercises,
                    notes: h.notes
                }));
            } catch (err) {
                console.error('❌ Erro ao buscar feed do Turso:', err);
            }
        }

        if (supabase) {
            try {
                const { data, error } = await supabase
                    .from('fitlife_history')
                    .select('*')
                    .order('date', { ascending: false })
                    .limit(limit);
                if (!error && data) return data;
            } catch (err) {
                console.error('❌ Erro ao buscar feed do Supabase:', err);
            }
        }
        return null;
    },

    async updateWorkoutNotes(workoutId, notes) {
        if (turso) {
            try {
                await turso.execute({
                    sql: 'UPDATE fitlife_history SET notes = ? WHERE id = ?',
                    args: [notes, String(workoutId)]
                });
                return true;
            } catch (err) {
                console.error('❌ Erro ao atualizar notas no Turso:', err);
            }
        }

        if (supabase) {
            try {
                await supabase.from('fitlife_history').update({ notes }).eq('id', workoutId);
                return true;
            } catch (err) {
                console.error('❌ Erro ao atualizar notas no Supabase:', err);
            }
        }
        return false;
    }
};
