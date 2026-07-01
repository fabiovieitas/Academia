import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import rawExercises from '../assets/exercises.json';
import { supabase } from '../supabaseClient';
import {
    CALISTENIA_PROJECT,
    CALISTHENICS_MANEUVERS_INITIAL,
    PRESET_WORKOUTS,
    mergeDefaultSkills,
    buildSkillsFromDb
} from './workoutData';


const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp deve ser usado dentro de um AppProvider');
    }
    return context;
};
export const AppProvider = ({ children }) => {
    // 1. Perfis e Perfil Ativo
    const [profiles, setProfiles] = useState([
        { id: 'fabio', name: 'Fábio', avatar: '⚡', theme: 'fabio' },
        { id: 'esposa', name: 'Adlai 💖', avatar: '💖', theme: 'esposa' }
    ]);
    
    const [activeProfileId, setActiveProfileId] = useState(() => {
        return localStorage.getItem('fitlife_v3_active_profile') || null;
    });

    const activeProfile = profiles.find(p => p.id === activeProfileId);

    // 2. Base de Exercícios
    const [exercises] = useState(rawExercises);

    // 3. Treinos Montados (carrega por perfil)
    const [workouts, setWorkouts] = useState([]);

    // 4. Histórico de Treinos
    const [history, setHistory] = useState([]);

    // 4.5 Exercícios Favoritos
    const [favorites, setFavorites] = useState([]);

    // 4.6 Recordes Pessoais (PR)
    const [personalRecords, setPersonalRecords] = useState({});

    // 4.7 Ofensiva de Treino (Streak)
    const [workoutStreak, setWorkoutStreak] = useState(0);

    // 4.8 Detalhes do Perfil / Anamnese (Ficha do Aluno)
    const [profileDetails, setProfileDetails] = useState(null);

    // 4.9 Medidas Corporais e Peso
    const [measurements, setMeasurements] = useState([]);

    // 4.10 Habilidades de Calistenia (Skills)
    const [calisthenicsSkills, setCalisthenicsSkills] = useState(() => {
        return CALISTHENICS_MANEUVERS_INITIAL;
    });

    // 4.10.1 Navegação / Foco da Calistenia
    const [activeEvolutionSubTab, setActiveEvolutionSubTab] = useState('medidas');
    const [expandedCalisthenicsSkillId, setExpandedCalisthenicsSkillId] = useState(null);

    // 4.11 Fotos de Evolução Física
    const [evolutionPhotos, setEvolutionPhotos] = useState([]);

    // 4.12 Estado de Notificação de Validação Cruzada (Toast)
    const [toastMessage, setToastMessage] = useState(null);

    // 4.9 Narração por Voz do Descanso (PWA / Text-to-Speech)
    const [voiceNotifications, setVoiceNotifications] = useState(() => {
        const saved = localStorage.getItem('fitlife_v3_voice_notifications');
        return saved !== null ? JSON.parse(saved) : true;
    });

    const toggleVoiceNotifications = () => {
        setVoiceNotifications(prev => {
            const next = !prev;
            localStorage.setItem('fitlife_v3_voice_notifications', JSON.stringify(next));
            return next;
        });
    };

    // 5. Estado do Treino Ativo (Gym Mode)
    const [activeWorkout, setActiveWorkout] = useState(null); 
    // activeWorkout: { workoutId, workoutName, currentExerciseIndex, startTime, exercises: [ { name, path, series: [ { reps, weight, completed, actualReps, actualWeight } ] } ] }

    // Estados do cronômetro de descanso (Globais para persistência e som em background)
    const [restTime, setRestTime] = useState(60);
    const [timeLeft, setTimeLeft] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const audioContextRef = useRef(null);
    const timerEndTimeRef = useRef(null);

    // --- FUNÇÕES AUXILIARES SUPABASE ---
    const loadDataFromSupabase = async (profileId) => {
        if (!supabase) return;
        try {
            // 1. Carregar treinos
            const { data: workoutsData, error: workoutsError } = await supabase
                .from('fitlife_workouts')
                .select('*')
                .eq('profile_id', profileId);
                
            if (!workoutsError && workoutsData) {
                if (workoutsData.length > 0) {
                    const parsedWorkouts = workoutsData.map(w => ({
                        id: Number(w.id) || w.id,
                        name: w.name,
                        description: w.description,
                        coverStyle: w.cover_style,
                        exercises: w.exercises,
                        createdAt: w.created_at,
                        updatedAt: w.updated_at
                    }));
                    setWorkouts(parsedWorkouts);
                    localStorage.setItem(`fitlife_v3_workouts_${profileId}`, JSON.stringify(parsedWorkouts));
                }
            }

            // 2. Carregar histórico
            const { data: historyData, error: historyError } = await supabase
                .from('fitlife_history')
                .select('*')
                .eq('profile_id', profileId)
                .order('date', { ascending: false });
                
            if (!historyError && historyData) {
                const parsedHistory = historyData.map(h => ({
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
                    exercises: h.exercises,
                    notes: h.notes
                }));
                setHistory(parsedHistory);
                localStorage.setItem(`fitlife_v3_history_${profileId}`, JSON.stringify(parsedHistory));
            }

            // 3. Carregar dados consolidados
            const { data: pdData, error: pdError } = await supabase
                .from('fitlife_profile_data')
                .select('*')
                .eq('profile_id', profileId)
                .maybeSingle();

            if (!pdError && pdData) {
                if (pdData.favorites !== null) {
                    setFavorites(pdData.favorites);
                    localStorage.setItem(`fitlife_v3_favorites_${profileId}`, JSON.stringify(pdData.favorites));
                }
                if (pdData.personal_records !== null) {
                    setPersonalRecords(pdData.personal_records);
                    localStorage.setItem(`fitlife_v3_pr_${profileId}`, JSON.stringify(pdData.personal_records));
                }
                if (pdData.measurements !== null) {
                    setMeasurements(pdData.measurements);
                    localStorage.setItem(`fitlife_v3_measurements_${profileId}`, JSON.stringify(pdData.measurements));
                }
                // 3.5 Carregar progresso de calistenia dedicado
                const { data: calisthenicsData, error: calisthenicsError } = await supabase
                    .from('fitlife_calisthenics_progress')
                    .select('*')
                    .eq('profile_id', profileId);
                    
                if (!calisthenicsError && calisthenicsData && calisthenicsData.length > 0) {
                    const skillsMerged = buildSkillsFromDb(calisthenicsData);
                    const { merged } = mergeDefaultSkills(skillsMerged);
                    setCalisthenicsSkills(merged);
                    localStorage.setItem(`fitlife_v3_skills_${profileId}`, JSON.stringify(merged));
                } else if (pdData.skills !== null) {
                    // Fallback para o JSON legado caso não haja registros na nova tabela
                    const legacySkills = pdData.skills;
                    if (legacySkills && legacySkills.frog_stand) {
                        const { merged } = mergeDefaultSkills(legacySkills);
                        setCalisthenicsSkills(merged);
                        localStorage.setItem(`fitlife_v3_skills_${profileId}`, JSON.stringify(merged));
                    } else {
                        setCalisthenicsSkills(CALISTHENICS_MANEUVERS_INITIAL);
                        localStorage.setItem(`fitlife_v3_skills_${profileId}`, JSON.stringify(CALISTHENICS_MANEUVERS_INITIAL));
                    }
                }
                if (pdData.profile_details !== null) {
                    setProfileDetails(pdData.profile_details);
                    localStorage.setItem(`fitlife_v3_profile_details_${profileId}`, JSON.stringify(pdData.profile_details));
                }
                if (pdData.active_workout !== null) {
                    setActiveWorkout(pdData.active_workout);
                    localStorage.setItem(`fitlife_v3_active_workout_${profileId}`, JSON.stringify(pdData.active_workout));
                } else {
                    setActiveWorkout(null);
                    localStorage.removeItem(`fitlife_v3_active_workout_${profileId}`);
                }
                if (pdData.evolution_photos !== null) {
                    setEvolutionPhotos(pdData.evolution_photos);
                    localStorage.setItem(`fitlife_v3_evolution_photos_${profileId}`, JSON.stringify(pdData.evolution_photos));
                }
            }
        } catch (err) {
            console.error('Erro ao sincronizar do Supabase:', err);
        }
    };

    const syncWorkoutsToSupabase = async (profileId, list) => {
        if (!supabase) return;
        try {
            const currentIds = list.map(w => String(w.id));
            if (currentIds.length > 0) {
                await supabase
                    .from('fitlife_workouts')
                    .delete()
                    .eq('profile_id', profileId)
                    .not('id', 'in', `(${currentIds.join(',')})`);
            } else {
                await supabase
                    .from('fitlife_workouts')
                    .delete()
                    .eq('profile_id', profileId);
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
        } catch (e) {
            console.error('Erro ao sincronizar treinos para o Supabase:', e);
        }
    };

    const syncHistoryToSupabase = async (profileId, list) => {
        if (!supabase) return;
        try {
            const currentIds = list.map(h => String(h.id));
            if (currentIds.length > 0) {
                await supabase
                    .from('fitlife_history')
                    .delete()
                    .eq('profile_id', profileId)
                    .not('id', 'in', `(${currentIds.join(',')})`);
            } else {
                await supabase
                    .from('fitlife_history')
                    .delete()
                    .eq('profile_id', profileId);
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
        } catch (e) {
            console.error('Erro ao sincronizar histórico para o Supabase:', e);
        }
    };

    const updateProfileDataField = async (profileId, field, data) => {
        if (!supabase) return;
        try {
            await supabase
                .from('fitlife_profile_data')
                .upsert({
                    profile_id: profileId,
                    [field]: data,
                    updated_at: new Date().toISOString()
                });
        } catch (e) {
            console.error(`Erro ao sincronizar ${field} para o Supabase:`, e);
        }
    };

    // Sintetizador de som nativo para descanso global
    const playBeepSound = () => {
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            const ctx = audioContextRef.current;
            if (ctx.state === 'suspended') {
                ctx.resume();
            }
            const playSingleBeep = (time, freq, dur) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.setValueAtTime(freq, time);
                gain.gain.setValueAtTime(0, time);
                gain.gain.linearRampToValueAtTime(0.3, time + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
                osc.start(time);
                osc.stop(time + dur);
            };
            const now = ctx.currentTime;
            playSingleBeep(now, 880, 0.2);
            playSingleBeep(now + 0.25, 880, 0.2);
            playSingleBeep(now + 0.5, 1200, 0.4);
        } catch (e) {
            console.error('Falha ao reproduzir áudio do cronômetro:', e);
        }
    };

    // Síntese de voz do fim de descanso global - simplificado curto e direto
    const speakRestEnd = (currentEx, exIdx, allExs) => {
        if (!('speechSynthesis' in window)) return;
        try {
            window.speechSynthesis.cancel();
            const message = "Descanso finalizado. Comece o próximo treino.";
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = 'pt-BR';
            utterance.rate = 1.05;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error('Erro na síntese de voz:', error);
        }
    };

    // Sincroniza a marca temporal final quando o temporizador é ativado ou ajustado manualmente
    useEffect(() => {
        if (timerActive) {
            const calculatedEndTime = Date.now() + timeLeft * 1000;
            if (!timerEndTimeRef.current) {
                // Temporizador foi iniciado
                timerEndTimeRef.current = calculatedEndTime;
            } else {
                // Verifica se houve ajuste manual (botões de +15s, -15s, etc.)
                const diff = Math.abs(timerEndTimeRef.current - calculatedEndTime);
                if (diff > 1500) {
                    timerEndTimeRef.current = calculatedEndTime;
                }
            }
        } else {
            timerEndTimeRef.current = null;
        }
    }, [timerActive, timeLeft]);

    // Countdown effect com marca temporal absoluta para precisão em background
    useEffect(() => {
        let interval = null;
        if (timerActive) {
            interval = setInterval(() => {
                if (timerEndTimeRef.current) {
                    const remaining = Math.max(0, Math.ceil((timerEndTimeRef.current - Date.now()) / 1000));
                    
                    if (remaining > 0) {
                        setTimeLeft(prev => prev !== remaining ? remaining : prev);
                    } else {
                        setTimeLeft(0);
                        setTimerActive(false);
                        timerEndTimeRef.current = null;
                        playBeepSound();
                        if (voiceNotifications && activeWorkout) {
                            const { exercises: allExs, currentExerciseIndex: exIdx } = activeWorkout;
                            const currentEx = allExs[exIdx];
                            speakRestEnd(currentEx, exIdx, allExs);
                        }
                    }
                }
            }, 250);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timerActive, voiceNotifications, activeWorkout]);

    // Sincronização imediata ao retornar do segundo plano (background)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && timerActive && timerEndTimeRef.current) {
                const remaining = Math.max(0, Math.ceil((timerEndTimeRef.current - Date.now()) / 1000));
                if (remaining === 0) {
                    setTimeLeft(0);
                    setTimerActive(false);
                    timerEndTimeRef.current = null;
                    playBeepSound();
                    if (voiceNotifications && activeWorkout) {
                        const { exercises: allExs, currentExerciseIndex: exIdx } = activeWorkout;
                        const currentEx = allExs[exIdx];
                        speakRestEnd(currentEx, exIdx, allExs);
                    }
                } else {
                    setTimeLeft(remaining);
                }
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [timerActive, voiceNotifications, activeWorkout]);

    // Carrega treinos e histórico do localStorage ao alterar o perfil ativo
    useEffect(() => {
        if (activeProfileId) {
            localStorage.setItem('fitlife_v3_active_profile', activeProfileId);
            
            const savedWorkouts = localStorage.getItem(`fitlife_v3_workouts_${activeProfileId}`);
            try { setWorkouts(savedWorkouts ? JSON.parse(savedWorkouts) : getInitialWorkouts(activeProfileId)); } catch(e) { console.error('Erro ao ler treinos:', e); setWorkouts(getInitialWorkouts(activeProfileId)); }

            const savedHistory = localStorage.getItem(`fitlife_v3_history_${activeProfileId}`);
            try { setHistory(savedHistory ? JSON.parse(savedHistory) : []); } catch(e) { console.error('Erro ao ler histórico:', e); setHistory([]); }

            const savedFavorites = localStorage.getItem(`fitlife_v3_favorites_${activeProfileId}`);
            try { setFavorites(savedFavorites ? JSON.parse(savedFavorites) : []); } catch(e) { console.error('Erro ao ler favoritos:', e); setFavorites([]); }

            const savedPRs = localStorage.getItem(`fitlife_v3_pr_${activeProfileId}`);
            try { setPersonalRecords(savedPRs ? JSON.parse(savedPRs) : {}); } catch(e) { console.error('Erro ao ler PRs:', e); setPersonalRecords({}); }

            const savedMeasurements = localStorage.getItem(`fitlife_v3_measurements_${activeProfileId}`);
            try { setMeasurements(savedMeasurements ? JSON.parse(savedMeasurements) : []); } catch(e) { console.error('Erro ao ler medições:', e); setMeasurements([]); }

            const savedSkills = localStorage.getItem(`fitlife_v3_skills_${activeProfileId}`);
            try {
                if (savedSkills) {
                    const parsed = JSON.parse(savedSkills);
                    const { merged, hasChanges } = mergeDefaultSkills(parsed);
                    setCalisthenicsSkills(merged);
                    if (hasChanges) {
                        localStorage.setItem(`fitlife_v3_skills_${activeProfileId}`, JSON.stringify(merged));
                    }
                } else {
                    setCalisthenicsSkills(CALISTHENICS_MANEUVERS_INITIAL);
                }
            } catch(e) { console.error('Erro ao ler skills de calistenia:', e); setCalisthenicsSkills(CALISTHENICS_MANEUVERS_INITIAL); }

            const savedPhotos = localStorage.getItem(`fitlife_v3_evolution_photos_${activeProfileId}`);
            try { setEvolutionPhotos(savedPhotos ? JSON.parse(savedPhotos) : []); } catch(e) { console.error('Erro ao ler fotos:', e); setEvolutionPhotos([]); }

            const savedDetails = localStorage.getItem(`fitlife_v3_profile_details_${activeProfileId}`);
            try {
                if (savedDetails) {
                    setProfileDetails(JSON.parse(savedDetails));
                } else {
                    // Sugere valores padrão baseados no ID do perfil
                    const defaultDetails = activeProfileId === 'fabio' 
                        ? { age: 30, gender: 'masculino', objective: 'hipertrofia', focusMuscles: ['peito', 'costas', 'ombros', 'bracos'] }
                        : { age: 28, gender: 'feminino', objective: 'emagrecimento', focusMuscles: ['gluteos', 'pernas', 'core'] };
                    setProfileDetails(defaultDetails);
                }
            } catch(e) { console.error('Erro ao ler detalhes do perfil:', e); setProfileDetails(null); }
            
            // Tenta restaurar treino em andamento
            const savedActive = localStorage.getItem(`fitlife_v3_active_workout_${activeProfileId}`);
            try {
                setActiveWorkout(savedActive ? JSON.parse(savedActive) : null);
            } catch(e) {
                console.error('Treino em andamento com dados corrompidos, descartando:', e);
                localStorage.removeItem(`fitlife_v3_active_workout_${activeProfileId}`);
                setActiveWorkout(null);
            }

            // Carrega do Supabase em background (Local-first / Stale-While-Revalidate)
            loadDataFromSupabase(activeProfileId);
        } else {
            setWorkouts([]);
            setHistory([]);
            setFavorites([]);
            setPersonalRecords({});
            setMeasurements([]);
            setCalisthenicsSkills(CALISTHENICS_MANEUVERS_INITIAL);
            setEvolutionPhotos([]);
            setProfileDetails(null);
            setActiveWorkout(null);
        }
    }, [activeProfileId]);

    // Alternar favorito
    const toggleFavorite = (exerciseName) => {
        let newFavorites = [...favorites];
        if (newFavorites.includes(exerciseName)) {
            newFavorites = newFavorites.filter(name => name !== exerciseName);
        } else {
            newFavorites.push(exerciseName);
        }
        setFavorites(newFavorites);
        if (activeProfileId) {
            localStorage.setItem(`fitlife_v3_favorites_${activeProfileId}`, JSON.stringify(newFavorites));
            updateProfileDataField(activeProfileId, 'favorites', newFavorites);
        }
    };

    // Salva treinos no localStorage sempre que forem alterados
    const saveWorkoutsList = (newWorkouts) => {
        setWorkouts(newWorkouts);
        if (activeProfileId) {
            localStorage.setItem(`fitlife_v3_workouts_${activeProfileId}`, JSON.stringify(newWorkouts));
            syncWorkoutsToSupabase(activeProfileId, newWorkouts);
        }
    };

    // Salva histórico no localStorage sempre que for alterado
    const saveHistoryList = (newHistory) => {
        setHistory(newHistory);
        if (activeProfileId) {
            localStorage.setItem(`fitlife_v3_history_${activeProfileId}`, JSON.stringify(newHistory));
            syncHistoryToSupabase(activeProfileId, newHistory);
        }
    };

    // Salva estado do treino ativo atual
    const saveActiveWorkoutState = (state) => {
        setActiveWorkout(state);
        if (activeProfileId) {
            if (state) {
                localStorage.setItem(`fitlife_v3_active_workout_${activeProfileId}`, JSON.stringify(state));
            } else {
                localStorage.removeItem(`fitlife_v3_active_workout_${activeProfileId}`);
            }
            updateProfileDataField(activeProfileId, 'active_workout', state);
        }
    };

    // Salva ou atualiza um Recorde Pessoal (PR)
    const savePR = (exerciseName, weight, reps) => {
        const updatedPRs = {
            ...personalRecords,
            [exerciseName]: {
                weight: parseFloat(weight) || 0,
                reps: parseInt(reps) || 0,
                date: new Date().toISOString()
            }
        };
        setPersonalRecords(updatedPRs);
        if (activeProfileId) {
            localStorage.setItem(`fitlife_v3_pr_${activeProfileId}`, JSON.stringify(updatedPRs));
            updateProfileDataField(activeProfileId, 'personal_records', updatedPRs);
        }
    };

    // Substitui um exercício no treino ativo (opcionalmente de forma permanente)
    const swapActiveWorkoutExercise = (exerciseIndex, newExercise, savePermanently) => {
        if (!activeWorkout) return;

        const originalExerciseName = activeWorkout.exercises[exerciseIndex].name;
        
        // 1. Atualiza o treino ativo
        const updatedActiveExercises = activeWorkout.exercises.map((ex, idx) => {
            if (idx === exerciseIndex) {
                return {
                    ...ex,
                    name: newExercise.name,
                    path: newExercise.path,
                    notes: `Substituído de: ${originalExerciseName}`
                };
            }
            return ex;
        });

        const newActiveState = {
            ...activeWorkout,
            exercises: updatedActiveExercises
        };
        saveActiveWorkoutState(newActiveState);

        // 2. Se for para salvar permanentemente, atualiza no treino original
        if (savePermanently) {
            const updatedWorkouts = workouts.map(workout => {
                if (workout.id === activeWorkout.workoutId) {
                    const updatedExercises = workout.exercises.map(ex => {
                        if (ex.name === originalExerciseName) {
                            return {
                                ...ex,
                                name: newExercise.name,
                                path: newExercise.path
                            };
                        }
                        return ex;
                    });
                    return { ...workout, exercises: updatedExercises };
                }
                return workout;
            });
            saveWorkoutsList(updatedWorkouts);
        }
    };

    // Auxiliares para cálculo de Ofensiva (Streak)
    const getMonday = (d) => {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(date.setDate(diff));
        monday.setHours(0, 0, 0, 0);
        return monday.toISOString().split('T')[0];
    };

    const calculateStreak = (historyList) => {
        if (!historyList || historyList.length === 0) return 0;
        
        const mondays = new Set(historyList.map(item => getMonday(item.date)));
        const today = new Date();
        const currentMonday = getMonday(today);
        
        const prevMondayDate = new Date(currentMonday);
        prevMondayDate.setDate(prevMondayDate.getDate() - 7);
        const prevMonday = prevMondayDate.toISOString().split('T')[0];
        
        if (!mondays.has(currentMonday) && !mondays.has(prevMonday)) {
            return 0;
        }
        
        let checkMondayStr = mondays.has(currentMonday) ? currentMonday : prevMonday;
        let streak = 0;
        
        while (mondays.has(checkMondayStr)) {
            streak++;
            const nextCheckDate = new Date(checkMondayStr);
            nextCheckDate.setDate(nextCheckDate.getDate() - 7);
            checkMondayStr = nextCheckDate.toISOString().split('T')[0];
        }
        
        return streak;
    };

    // Atualiza a ofensiva de semanas ativas sempre que o histórico muda
    useEffect(() => {
        setWorkoutStreak(calculateStreak(history));
    }, [history]);

    // Executa a checagem cruzada em segundo plano sempre que o histórico muda
    useEffect(() => {
        if (activeProfileId && history && history.length > 0 && calisthenicsSkills) {
            runCalisthenicsCrossValidation(history, calisthenicsSkills);
        }
    }, [history]);

    // Salva ou atualiza um log de medidas corporais
    const saveMeasurement = (log) => {
        let newMeasurements = [...measurements];
        const existingIdx = newMeasurements.findIndex(m => m.date === log.date);
        
        if (existingIdx !== -1) {
            newMeasurements[existingIdx] = log;
        } else {
            newMeasurements.push(log);
        }
        
        // Ordena por data ascendente para facilitar a plotagem nos gráficos
        newMeasurements.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        setMeasurements(newMeasurements);
        if (activeProfileId) {
            localStorage.setItem(`fitlife_v3_measurements_${activeProfileId}`, JSON.stringify(newMeasurements));
            updateProfileDataField(activeProfileId, 'measurements', newMeasurements);
        }
    };

    // Remove um log de medidas corporais
    const deleteMeasurement = (date) => {
        const newMeasurements = measurements.filter(m => m.date !== date);
        setMeasurements(newMeasurements);
        if (activeProfileId) {
            localStorage.setItem(`fitlife_v3_measurements_${activeProfileId}`, JSON.stringify(newMeasurements));
            updateProfileDataField(activeProfileId, 'measurements', newMeasurements);
        }
    };

    // Salva os detalhes do perfil (Anamnese)
    const saveProfileDetails = (details) => {
        setProfileDetails(details);
        if (activeProfileId) {
            localStorage.setItem(`fitlife_v3_profile_details_${activeProfileId}`, JSON.stringify(details));
            updateProfileDataField(activeProfileId, 'profile_details', details);
        }
    };

    // Salva habilidades de calistenia
    const saveCalisthenicsSkills = async (newSkills) => {
        setCalisthenicsSkills(newSkills);
        if (activeProfileId) {
            localStorage.setItem(`fitlife_v3_skills_${activeProfileId}`, JSON.stringify(newSkills));
            updateProfileDataField(activeProfileId, 'skills', newSkills);

            if (supabase) {
                try {
                    const upserts = Object.keys(newSkills).map(mId => {
                        const m = newSkills[mId];
                        return {
                            profile_id: activeProfileId,
                            maneuver_id: mId,
                            status: m.status,
                            phase1_progress: m.phase1_progress.map(p => ({ exercise: p.exercise, value: p.value })),
                            phase2_progress: m.phase2_progress.map(p => ({ exercise: p.exercise, value: p.value })),
                            phase2_unlocked: m.phase2_unlocked,
                            maneuver_unlocked: m.maneuver_unlocked,
                            updated_at: new Date().toISOString()
                        };
                    });
                    
                    await supabase
                        .from('fitlife_calisthenics_progress')
                        .upsert(upserts);
                } catch (e) {
                    console.error('Erro ao sincronizar progresso de calistenia para o Supabase:', e);
                }
            }
        }
    };

    const updateManeuverProgress = (maneuverId, type, exerciseName, newValue) => {
        const updatedSkills = JSON.parse(JSON.stringify(calisthenicsSkills));
        const maneuver = updatedSkills[maneuverId];
        if (!maneuver) return;

        if (type === 'phase1') {
            const prog = maneuver.phase1_progress.find(p => p.exercise === exerciseName);
            if (prog) {
                prog.value = Number(newValue) || 0;
            }
        } else if (type === 'phase2') {
            if (!maneuver.phase2_unlocked) {
                throw new Error('A Fase 2 está bloqueada. Cumpra todos os pré-requisitos da Fase 1 primeiro.');
            }
            const prog = maneuver.phase2_progress.find(p => p.exercise === exerciseName);
            if (prog) {
                prog.value = Number(newValue) || 0;
            }
        }

        // Verifica se todos os requerimentos da Fase 1 foram atingidos
        const phase1Completed = maneuver.phase1_progress.every(p => p.value >= p.target);
        maneuver.phase2_unlocked = phase1Completed;

        // Se a Fase 1 não foi cumprida, reseta a Fase 2
        if (!phase1Completed) {
            maneuver.phase2_progress.forEach(p => p.value = 0);
        }

        // Verifica se todos os requerimentos da Fase 2 foram atingidos
        const phase2Completed = phase1Completed && maneuver.phase2_progress.every(p => p.value >= p.target);
        maneuver.maneuver_unlocked = phase2Completed;

        // Se a manobra deixou de ser elegível e estava dominada, move para treinando
        if (!maneuver.maneuver_unlocked && maneuver.status === 'dominado') {
            maneuver.status = 'treinando';
        }

        saveCalisthenicsSkills(updatedSkills);
    };

    const updateManeuverStatus = (maneuverId, nextStatus) => {
        const updatedSkills = JSON.parse(JSON.stringify(calisthenicsSkills));
        const maneuver = updatedSkills[maneuverId];
        if (!maneuver) return;

        if (nextStatus === 'dominado') {
            // Regra: Liberação de domínio apenas se Fase 2 finalizada
            if (!maneuver.maneuver_unlocked) {
                throw new Error('A manobra final só é liberada para domínio após a conclusão de todos os exercícios da Fase 2.');
            }
        }

        maneuver.status = nextStatus;
        saveCalisthenicsSkills(updatedSkills);
    };

    // Rotina de Checagem Cruzada Musculação -> Calistenia (24 horas)
    const runCalisthenicsCrossValidation = (historyList = history, skillsState = calisthenicsSkills) => {
        if (!activeProfileId || !historyList || historyList.length === 0 || !skillsState) return;

        const now = new Date();
        const past24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // Filtrar histórico concluído nas últimas 24h
        const recentHistory = historyList.filter(h => {
            const hDate = new Date(h.date);
            return hDate >= past24h;
        });

        if (recentHistory.length === 0) return;

        // Dicionário de mapeamento flexível de nomes de exercícios
        const exerciseMapping = {
            "Prancha Tradicional": ["prancha tradicional", "prancha abdominal", "prancha abdominal isometria", "prancha", "prancha alta"],
            "Prancha Alta": ["prancha alta", "prancha alta de ombros"],
            "Flexoes de Braco Tradicionais": ["flexões de braço", "flexao de braco", "flexoes de braco", "flexão", "flexões", "flexoes de braco tradicionais"],
            "Prancha Lombar (Superman)": ["superman", "prancha lombar", "prancha lombar (superman)", "prancha lombar superman"],
            "Abdominal Canoa (Hollow Body)": ["hollow body", "abdominal canoa", "abdominal canoa (hollow body)", "abdominal canoa hollow body"],
            "Fundos nas Paralelas (Dips)": ["paralela", "dips", "fundos nas paralelas", "fundos nas paralelas (dips)", "dips paralelas"],
            "Flexao Pike": ["flexão pike", "pike push-up", "flexao pike", "pike push-up (flexão pike)", "pike pushup"],
            "Barra Fixa (Pull-ups)": ["barra fixa", "pull-up", "pull-ups", "barra fixa (pull-ups)", "barra fixa com pegada supinada", "pullup", "pullups"],
            "Elevacao de Joelhos na Barra": ["elevação de joelhos na barra", "elevacao de joelhos na barra", "elevação de joelhos", "elevacao de joelhos", "joelhos na barra"]
        };

        const updatedSkills = JSON.parse(JSON.stringify(skillsState));
        let updatedAny = false;
        let notifiedExerciseName = "";

        // Coleta os maiores valores realizados no histórico recente para os mapeados
        const maxGymValues = {};
        recentHistory.forEach(h => {
            if (h.exercises) {
                h.exercises.forEach(ex => {
                    const gymNameClean = ex.name.toLowerCase().trim();
                    Object.keys(exerciseMapping).forEach(caliExName => {
                        const matches = exerciseMapping[caliExName];
                        const isMatch = matches.some(pattern => 
                            gymNameClean.includes(pattern) || pattern.includes(gymNameClean)
                        );
                        
                        if (isMatch) {
                            let maxVal = 0;
                            if (ex.series) {
                                ex.series.forEach(s => {
                                    const val = s.actualReps || s.reps || 0;
                                    if (val > maxVal) maxVal = val;
                                });
                            }
                            if (maxVal > 0) {
                                if (!maxGymValues[caliExName] || maxVal > maxGymValues[caliExName]) {
                                    maxGymValues[caliExName] = maxVal;
                                }
                            }
                        }
                    });
                });
            }
        });

        // Aplica e atualiza no progresso da Calistenia
        Object.keys(updatedSkills).forEach(mId => {
            const maneuver = updatedSkills[mId];
            
            // Fase 1
            maneuver.phase1_progress.forEach(p => {
                const gymVal = maxGymValues[p.exercise];
                if (gymVal && gymVal > p.value) {
                    p.value = gymVal;
                    updatedAny = true;
                    notifiedExerciseName = p.exercise;
                }
            });

            // Recalcula Phase 2 Unlocked
            const phase1Completed = maneuver.phase1_progress.every(p => p.value >= p.target);
            maneuver.phase2_unlocked = phase1Completed;

            // Fase 2 (Apenas se Fase 1 destravada)
            if (maneuver.phase2_unlocked) {
                maneuver.phase2_progress.forEach(p => {
                    const gymVal = maxGymValues[p.exercise];
                    if (gymVal && gymVal > p.value) {
                        p.value = gymVal;
                        updatedAny = true;
                        notifiedExerciseName = p.exercise;
                    }
                });
            } else {
                maneuver.phase2_progress.forEach(p => p.value = 0);
            }

            // Recalcula Maneuver Unlocked
            const phase2Completed = maneuver.phase2_unlocked && maneuver.phase2_progress.every(p => p.value >= p.target);
            maneuver.maneuver_unlocked = phase2Completed;

            if (!maneuver.maneuver_unlocked && maneuver.status === 'dominado') {
                maneuver.status = 'treinando';
            }
        });

        if (updatedAny) {
            saveCalisthenicsSkills(updatedSkills);
            setToastMessage(`Aproveitamos seu exercício "${notifiedExerciseName}" da musculação para computar sua meta de Calistenia de hoje!`);
            
            // Limpa após 8 segundos de forma segura
            setTimeout(() => {
                setToastMessage(prev => {
                    if (prev && prev.includes(notifiedExerciseName)) {
                        return null;
                    }
                    return prev;
                });
            }, 8000);
        }
    };

    // Salva fotos de evolução
    const saveEvolutionPhotos = (newPhotos) => {
        setEvolutionPhotos(newPhotos);
        if (activeProfileId) {
            localStorage.setItem(`fitlife_v3_evolution_photos_${activeProfileId}`, JSON.stringify(newPhotos));
            updateProfileDataField(activeProfileId, 'evolution_photos', newPhotos);
        }
    };

    // Voz de introdução do exercício
    const speakExerciseStart = (exercise) => {
        if (!voiceNotifications || !('speechSynthesis' in window)) return;
        try {
            window.speechSynthesis.cancel();
            let message = `Iniciando exercício: ${exercise.name}. `;
            if (exercise.series && exercise.series.length > 0) {
                const totalSeries = exercise.series.length;
                message += `Você tem ${totalSeries} séries planejadas. `;
                const firstSet = exercise.series[0];
                const weight = firstSet.actualWeight || firstSet.weight || 0;
                if (weight > 0) {
                    message += `Carga recomendada de ${weight} quilos.`;
                }
            }
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = 'pt-BR';
            utterance.rate = 1.05;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error('Erro na síntese de voz de início:', error);
        }
    };

    // Exporta backup de dados para download como arquivo JSON
    const exportBackupData = () => {
        if (!activeProfileId) return;
        const data = {
            profileId: activeProfileId,
            workouts: JSON.parse(localStorage.getItem(`fitlife_v3_workouts_${activeProfileId}`) || '[]'),
            history: JSON.parse(localStorage.getItem(`fitlife_v3_history_${activeProfileId}`) || '[]'),
            favorites: JSON.parse(localStorage.getItem(`fitlife_v3_favorites_${activeProfileId}`) || '[]'),
            pr: JSON.parse(localStorage.getItem(`fitlife_v3_pr_${activeProfileId}`) || '{}'),
            measurements: JSON.parse(localStorage.getItem(`fitlife_v3_measurements_${activeProfileId}`) || '[]'),
            profileDetails: JSON.parse(localStorage.getItem(`fitlife_v3_profile_details_${activeProfileId}`) || 'null'),
            skills: JSON.parse(localStorage.getItem(`fitlife_v3_skills_${activeProfileId}`) || '{}'),
            evolutionPhotos: JSON.parse(localStorage.getItem(`fitlife_v3_evolution_photos_${activeProfileId}`) || '[]')
        };
        
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(data, null, 2)
        )}`;
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', jsonString);
        downloadAnchor.setAttribute('download', `fitlife_backup_${activeProfileId}_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    };

    // Importa backup de dados de um arquivo JSON
    const importBackupData = async (data) => {
        if (!data || data.profileId !== activeProfileId) {
            throw new Error('O backup não pertence ao perfil selecionado atualmente!');
        }
        if (data.workouts) {
            localStorage.setItem(`fitlife_v3_workouts_${activeProfileId}`, JSON.stringify(data.workouts));
            setWorkouts(data.workouts);
            syncWorkoutsToSupabase(activeProfileId, data.workouts);
        }
        if (data.history) {
            localStorage.setItem(`fitlife_v3_history_${activeProfileId}`, JSON.stringify(data.history));
            setHistory(data.history);
            syncHistoryToSupabase(activeProfileId, data.history);
        }
        
        const updatedFields = {};
        if (data.favorites) {
            localStorage.setItem(`fitlife_v3_favorites_${activeProfileId}`, JSON.stringify(data.favorites));
            setFavorites(data.favorites);
            updatedFields.favorites = data.favorites;
        }
        if (data.pr) {
            localStorage.setItem(`fitlife_v3_pr_${activeProfileId}`, JSON.stringify(data.pr));
            setPersonalRecords(data.pr);
            updatedFields.personal_records = data.pr;
        }
        if (data.measurements) {
            localStorage.setItem(`fitlife_v3_measurements_${activeProfileId}`, JSON.stringify(data.measurements));
            setMeasurements(data.measurements);
            updatedFields.measurements = data.measurements;
        }
        if (data.profileDetails) {
            localStorage.setItem(`fitlife_v3_profile_details_${activeProfileId}`, JSON.stringify(data.profileDetails));
            setProfileDetails(data.profileDetails);
            updatedFields.profile_details = data.profileDetails;
        }
        if (data.skills) {
            await saveCalisthenicsSkills(data.skills);
        }
        if (data.evolutionPhotos) {
            localStorage.setItem(`fitlife_v3_evolution_photos_${activeProfileId}`, JSON.stringify(data.evolutionPhotos));
            setEvolutionPhotos(data.evolutionPhotos);
            updatedFields.evolution_photos = data.evolutionPhotos;
        }

        if (supabase && Object.keys(updatedFields).length > 0) {
            try {
                await supabase
                    .from('fitlife_profile_data')
                    .upsert({
                        profile_id: activeProfileId,
                        ...updatedFields,
                        updated_at: new Date().toISOString()
                    });
            } catch (e) {
                console.error('Erro ao salvar backup no Supabase:', e);
            }
        }
    };

    // Carrega treinos predefinidos (Presets)
    const loadPreset = (presetType) => {
        if (!activeProfileId) return;
        
        const preset = PRESET_WORKOUTS[presetType] || (presetType === 'CALISTENIA' ? CALISTENIA_PROJECT : null);
        if (!preset) return;
        
        const baseTime = Date.now();
        const newWorkouts = preset.workouts.map((w, idx) => ({
            ...w,
            id: baseTime + idx,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }));
        
        const updatedWorkouts = [...workouts, ...newWorkouts];
        saveWorkoutsList(updatedWorkouts);
    };

    // Iniciar um Treino Livre (Em Branco)
    const startFreeWorkout = () => {
        const activeState = {
            workoutId: 'free',
            workoutName: "Treino Livre",
            currentExerciseIndex: 0,
            startTime: new Date().toISOString(),
            exercises: []
        };
        saveActiveWorkoutState(activeState);
    };

    // Adiciona exercício ao Treino Livre ativo
    const addFreeWorkoutExercise = (newEx) => {
        if (!activeWorkout) return;
        
        const formattedExercise = {
            name: newEx.name,
            path: newEx.path,
            notes: '',
            targetWeight: 0,
            series: [
                { reps: 10, weight: 0, completed: false, actualReps: 10, actualWeight: 0 }
            ]
        };
        
        const updatedExercises = [...activeWorkout.exercises, formattedExercise];
        
        saveActiveWorkoutState({
            ...activeWorkout,
            exercises: updatedExercises,
            currentExerciseIndex: activeWorkout.exercises.length === 0 ? 0 : activeWorkout.currentExerciseIndex
        });
    };

    // Adicionar um log de cardio (corrida/pedalada) vindo do Zepp ou entrada manual
    const addCardioWorkout = (cardioLog) => {
        if (!activeProfileId) return;
        
        const log = {
            id: Date.now(),
            workoutId: 'cardio',
            workoutName: cardioLog.type === 'running' ? 'Corrida 🏃‍♂️' : 'Pedalada 🚴‍♂️',
            date: cardioLog.date || new Date().toISOString(),
            duration: parseInt(cardioLog.duration) || 0, // minutos
            isCardio: true,
            cardioType: cardioLog.type, // 'running' | 'cycling'
            distance: parseFloat(cardioLog.distance) || 0,
            heartRate: parseFloat(cardioLog.heartRate) || null,
            calories: parseFloat(cardioLog.calories) || null,
            exercises: [] // cardio não tem séries de força
        };
        
        const newHistory = [log, ...history];
        saveHistoryList(newHistory);
    };

    // --- AÇÕES DO SISTEMA ---

    // Alternar Perfil
    const selectProfile = (profileId) => {
        setActiveProfileId(profileId);
    };

    // Adicionar/Editar Treino ou Treinos
    const saveWorkout = (workoutOrWorkouts) => {
        let newWorkouts = [...workouts];
        const workoutsToSave = Array.isArray(workoutOrWorkouts) ? workoutOrWorkouts : [workoutOrWorkouts];
        
        const baseId = Date.now();
        workoutsToSave.forEach((workout, idx) => {
            if (workout.id) {
                const index = newWorkouts.findIndex(w => w.id === workout.id);
                if (index !== -1) {
                    newWorkouts[index] = { ...workout, updatedAt: new Date().toISOString() };
                }
            } else {
                const newWorkout = {
                    ...workout,
                    id: baseId + idx, // Evita colisão de IDs no mesmo milissegundo
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                newWorkouts.push(newWorkout);
            }
        });
        
        saveWorkoutsList(newWorkouts);
    };

    // Excluir Treino
    const deleteWorkout = (workoutId) => {
        const newWorkouts = workouts.filter(w => w.id !== workoutId);
        saveWorkoutsList(newWorkouts);
        // Se o treino excluído era o que estava ativo, cancela
        if (activeWorkout && activeWorkout.workoutId === workoutId) {
            saveActiveWorkoutState(null);
        }
    };

    // Iniciar um Treino (entra no Modo Academia)
    const startWorkout = (workout) => {
        const formattedExercises = workout.exercises.map(exercise => {
            const seriesCount = parseInt(exercise.series) || 3;
            const series = [];
            for (let i = 0; i < seriesCount; i++) {
                series.push({
                    reps: parseInt(exercise.reps) || 10,
                    weight: parseFloat(exercise.weight) || 0,
                    completed: false,
                    actualReps: parseInt(exercise.reps) || 10,
                    actualWeight: parseFloat(exercise.weight) || 0
                });
            }
            return {
                name: exercise.name,
                path: exercise.path,
                notes: exercise.notes || '',
                targetWeight: parseFloat(exercise.targetWeight) || 0,
                series
            };
        });

        const activeState = {
            workoutId: workout.id,
            workoutName: workout.name,
            currentExerciseIndex: 0,
            startTime: new Date().toISOString(),
            exercises: formattedExercises
        };
        saveActiveWorkoutState(activeState);
    };

const CALISTHENICS_PATH_MAP = {
    "mobilidade: aquecimento de punhos": "Exercicios/Calistenia/Aquecimento_de_Punhos.png",
    "aquecimento de punhos": "Exercicios/Calistenia/Aquecimento_de_Punhos.png",
    "técnica: técnica da garra": "Exercicios/Calistenia/Tecnica_da_Garra.png",
    "técnica da garra": "Exercicios/Calistenia/Tecnica_da_Garra.png",
    "isometria de frog stand (corvo)": "Exercicios/Calistenia/Isometria_de_Frog_Stand.png",
    "nível 1: prancha alta": "Exercicios/Calistenia/Prancha_Alta.gif",
    "prancha alta": "Exercicios/Calistenia/Prancha_Alta.gif",
    "nível 2: planche lean": "Exercicios/Calistenia/Lean_Plank.gif",
    "nível 3: encaixe de sapo (1 pé)": "Exercicios/Calistenia/Frog_Stand_Assistido.gif",
    "nível 4: sapo assistido (testa no travesseiro)": "Exercicios/Calistenia/Frog_Stand_Assistido.gif",
    "flexoes de braco tradicionais": "Exercicios/Calistenia/Flexão.gif",
    "prancha lombar (superman)": "Exercicios/Eretor Lombar/Superman.gif",
    "elbow lever com pes no chao": "Exercicios/Calistenia/Elbow_Lever_com_pes_no_chao.gif",
    "elbow lever em straddle": "Exercicios/Calistenia/Elbow_Lever_em_Straddle.gif",
    "abdominal canoa (hollow body)": "Exercicios/Calistenia/Abdominal_Canoa_Hollow_Body.gif",
    "fundos nas paralelas (dips)": "Exercicios/Calistenia/Paralela.gif",
    "support hold nas paralelas": "Exercicios/Calistenia/Support_Hold_nas_Paralelas.gif",
    "tuck l-sit": "Exercicios/Calistenia/Tuck_L_Sit.gif",
    "one-leg l-sit": "Exercicios/Calistenia/One_Leg_L_Sit.gif",
    "flexao pike": "Exercicios/Calistenia/Flexões de apoio de mão na parede.gif",
    "handstand na parede (costas)": "Exercicios/Calistenia/Handstand_na_Parede_Costas.gif",
    "handstand na parede (frente)": "Exercicios/Calistenia/Handstand_na_Parede_Frente.gif",
    "wall scissor": "Exercicios/Calistenia/Wall_Scissor.gif",
    "barra fixa (pull-ups)": "Exercicios/Costas/Pull Up.gif",
    "elevacao de joelhos na barra": "Exercicios/Calistenia/Elevacao_de_Joelhos_na_Barra.gif",
    "toes to bar (pes na barra)": "Exercicios/Calistenia/Toes_to_Bar_Pes_na_Barra.gif",
    "skin the cat assistido": "Exercicios/Calistenia/Skin_the_Cat_Assistido.gif",
    "puxada escapular na barra fixa": "Exercicios/Costas/Pull Up.gif",
    "paralela": "Exercicios/Calistenia/Paralela.gif",
    "elevação lateral com toalha na parede": "Exercicios/Calistenia/Elevao lateral com toalha na parede.gif",
    "bandeira humana": "Exercicios/Calistenia/Bandeira Humana.gif",
    "barra fixa com pegada supinada": "Exercicios/Calistenia/Barra Fixa com Pegada Supinada.gif",
    "muscle up": "Exercicios/Calistenia/Muscle up.gif"
};

    // Iniciar uma sessão de calistenia baseada nos requisitos da manobra e fase
    const startCalisthenicsWorkout = (maneuver, phaseNum) => {
        const progressArray = phaseNum === 2 ? maneuver.phase2_progress : maneuver.phase1_progress;
        
        const formattedExercises = progressArray.map(prog => {
            const exerciseKey = prog.exercise.toLowerCase().trim();
            let path = "";
            
            // 1. Tenta encontrar no mapa manual
            if (CALISTHENICS_PATH_MAP[exerciseKey]) {
                path = CALISTHENICS_PATH_MAP[exerciseKey];
            } else {
                // 2. Tenta fazer um match na base geral, limpando prefixos
                const cleanName = prog.exercise.replace(/^(nível\s+\d+:|mobilidade:|técnica:)\s*/i, "").toLowerCase().trim();
                const catalogMatch = exercises.find(ex => {
                    const nameNorm = ex.name.toLowerCase().trim();
                    return nameNorm === cleanName || nameNorm === prog.exercise.toLowerCase().trim();
                });
                
                if (catalogMatch) {
                    path = catalogMatch.path;
                }
            }
            
            // Cria 3 séries padrão com a meta especificada e peso zero
            const seriesCount = 3;
            const series = [];
            for (let i = 0; i < seriesCount; i++) {
                series.push({
                    reps: parseInt(prog.target) || 10,
                    weight: 0,
                    completed: false,
                    actualReps: parseInt(prog.target) || 10,
                    actualWeight: 0
                });
            }
            
            return {
                name: prog.exercise,
                path: path,
                notes: `Meta de Habilidade: >=${prog.target} ${prog.unit}.`,
                targetWeight: 0,
                series: series
            };
        });

        const activeState = {
            workoutId: `cali_${maneuver.id}_phase${phaseNum}`,
            workoutName: `Calistenia: ${maneuver.name} (Fase ${phaseNum})`,
            currentExerciseIndex: 0,
            startTime: new Date().toISOString(),
            exercises: formattedExercises
        };
        
        // Se a manobra estiver bloqueada, ativa-a automaticamente
        if (maneuver.status === 'bloqueado') {
            try {
                updateManeuverStatus(maneuver.id, 'treinando');
            } catch (e) {
                console.warn("Não foi possível colocar a manobra em treinamento automaticamente:", e.message);
            }
        }
        
        saveActiveWorkoutState(activeState);
    };

    // Finalizar Treino (salva no histórico)
    const finishWorkout = (cardioStats, savePlanPermanently = false) => {
        if (!activeWorkout) return;

        const duration = Math.round((new Date() - new Date(activeWorkout.startTime)) / 60000); // minutos
        const completedExercises = activeWorkout.exercises.filter(ex => 
            ex.series.some(s => s.completed)
        );

        // Se completou pelo menos uma série, salva no histórico
        if (completedExercises.length > 0) {
            const log = {
                id: Date.now(),
                workoutId: activeWorkout.workoutId,
                workoutName: activeWorkout.workoutName,
                date: new Date().toISOString(),
                duration,
                cardio: cardioStats || null,
                exercises: completedExercises.map(ex => ({
                    name: ex.name,
                    series: ex.series.filter(s => s.completed).map(s => ({
                        reps: s.actualReps,
                        weight: s.actualWeight
                    }))
                }))
            };

            const newHistory = [log, ...history];
            saveHistoryList(newHistory);

            if (savePlanPermanently) {
                // Atualizar o plano de treino original permanentemente
                const newWorkouts = workouts.map(workout => {
                    if (workout.id === activeWorkout.workoutId) {
                        const cleanedExercises = activeWorkout.exercises.map(ex => ({
                            name: ex.name,
                            path: ex.path || "",
                            series: ex.series.length,
                            reps: ex.reps || 10,
                            weight: ex.weight || 0,
                            targetWeight: ex.targetWeight || 0,
                            notes: ex.notes || ""
                        }));
                        return {
                            ...workout,
                            exercises: cleanedExercises,
                            updatedAt: new Date().toISOString()
                        };
                    }
                    return workout;
                });
                saveWorkoutsList(newWorkouts);
            } else {
                // Atualiza apenas as cargas padrão nos treinos originais para a próxima vez
                updateOriginalWorkoutWeights(activeWorkout.workoutId, activeWorkout.exercises);
            }
        }

        saveActiveWorkoutState(null);
    };

    // Cancela o treino ativo
    const cancelWorkout = () => {
        saveActiveWorkoutState(null);
    };

    // Atualiza as cargas padrão no treino original baseado no treino recém finalizado
    const updateOriginalWorkoutWeights = (workoutId, finishedExercises) => {
        const newWorkouts = workouts.map(workout => {
            if (workout.id === workoutId) {
                const updatedExercises = workout.exercises.map(origEx => {
                    const finishedEx = finishedExercises.find(fe => fe.name === origEx.name);
                    if (finishedEx) {
                        // Pega o peso do último set completado como referência
                        const lastCompletedSet = [...finishedEx.series].reverse().find(s => s.completed);
                        if (lastCompletedSet) {
                            return {
                                ...origEx,
                                weight: lastCompletedSet.actualWeight
                            };
                        }
                    }
                    return origEx;
                });
                return { ...workout, exercises: updatedExercises };
            }
            return workout;
        });
        saveWorkoutsList(newWorkouts);
    };

    // Treinos iniciais para novos usuários (para não vir totalmente vazio)
    function getInitialWorkouts(profileId) {
        if (profileId === 'fabio') {
            return [
                {
                    id: 1,
                    name: "Treino A - Peito e Tríceps (Aparelhos)",
                    description: "Treino de empurrar para hipertrofia focado em máquinas",
                    exercises: [
                        { name: "Supino Reto na Máquina", path: "Exercicios/Peitoral/Supino Reto na Máquina.gif", series: 4, reps: 10, weight: 30, notes: "Foco no controle da descida" },
                        { name: "Supino inclinado na máquina", path: "Exercicios/Peitoral/Supino inclinado na máquina.gif", series: 3, reps: 10, weight: 20, notes: "" },
                        { name: "Extensão de tríceps no cabo alto", path: "Exercicios/Tríceps/Extensão de tríceps no cabo alto.gif", series: 4, reps: 12, weight: 25, notes: "" },
                        { name: "Extensão de tríceps na máquina", path: "Exercicios/Tríceps/Extensão de tríceps na máquina.gif", series: 3, reps: 10, weight: 20, notes: "" }
                    ]
                },
                {
                    id: 2,
                    name: "Treino B - Costas e Bíceps (Aparelhos)",
                    description: "Treino de puxar focado em cabos e polias",
                    exercises: [
                        { name: "Puxada Alta", path: "Exercicios/Costas/Puxada Alta.gif", series: 4, reps: 10, weight: 55, notes: "" },
                        { name: "Remada Sentada na Máquina", path: "Exercicios/Costas/Remada Sentada na Máquina.gif", series: 4, reps: 10, weight: 40, notes: "" },
                        { name: "Rosca concentrada com cabo", path: "Exercicios/Bíceps/Rosca concentrada com cabo.gif", series: 3, reps: 10, weight: 20, notes: "" },
                        { name: "Rosca Unilateral com Cabo", path: "Exercicios/Bíceps/Rosca Unilateral com Cabo.gif", series: 3, reps: 12, weight: 10, notes: "" }
                    ]
                }
            ];
        } else {
            return [
                {
                    id: 3,
                    name: "Treino Inferior Completo (Aparelhos)",
                    description: "Treino de pernas e glúteos em máquinas",
                    exercises: [
                        { name: "Leg Press", path: "Exercicios/Pernas/Leg Press.gif", series: 4, reps: 10, weight: 80, notes: "Manter boa amplitude" },
                        { name: "Elevação Pélvica na Máquina de Extensão de Pernas", path: "Exercicios/Glúteos/Elevação Pélvica na Máquina de Extensão de Pernas.gif", series: 4, reps: 12, weight: 20, notes: "Pico de contração de 2s" },
                        { name: "Cadeira extensora", path: "Exercicios/Pernas/Cadeira extensora.gif", series: 3, reps: 10, weight: 25, notes: "Extensão controlada" },
                        { name: "Abdução de quadril com cabo", path: "Exercicios/Glúteos/Abdução de quadril com cabo.gif", series: 3, reps: 12, weight: 15, notes: "" }
                    ]
                }
            ];
        }
    }

    return (
        <AppContext.Provider value={{
            profiles,
            activeProfileId,
            activeProfile,
            exercises,
            workouts,
            history,
            favorites,
            activeWorkout,
            personalRecords,
            workoutStreak,
            measurements,
            selectProfile,
            saveWorkout,
            deleteWorkout,
            startWorkout,
            finishWorkout,
            cancelWorkout,
            toggleFavorite,
            saveActiveWorkoutState,
            savePR,
            swapActiveWorkoutExercise,
            saveMeasurement,
            deleteMeasurement,
            exportBackupData,
            importBackupData,
            loadPreset,
            voiceNotifications,
            toggleVoiceNotifications,
            restTime,
            setRestTime,
            timeLeft,
            setTimeLeft,
            timerActive,
            setTimerActive,
            startFreeWorkout,
            addFreeWorkoutExercise,
            addCardioWorkout,
            profileDetails,
            saveProfileDetails,
            calisthenicsSkills,
            saveCalisthenicsSkills,
            updateManeuverProgress,
            updateManeuverStatus,
            activeEvolutionSubTab,
            setActiveEvolutionSubTab,
            expandedCalisthenicsSkillId,
            setExpandedCalisthenicsSkillId,
            toastMessage,
            setToastMessage,
            evolutionPhotos,
            saveEvolutionPhotos,
            speakExerciseStart,
            startCalisthenicsWorkout
        }}>
            {children}
        </AppContext.Provider>
    );
};
