import React, { useState } from 'react';
import { useApp, PRESET_WORKOUTS, CALISTENIA_PROJECT } from '../context/AppContext';

const estimateWorkoutDuration = (workout) => {
    if (!workout || !workout.exercises || workout.exercises.length === 0) return 0;
    let totalSeries = 0;
    workout.exercises.forEach(ex => {
        totalSeries += parseInt(ex.series) || 3;
    });
    const restTime = 60; // 60 segundos padrão
    const seconds = (totalSeries * 45) + (Math.max(0, totalSeries - 1) * restTime);
    return Math.round(seconds / 60);
};

const COVER_IMAGES = {
    peito: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop',
    costas: 'https://images.unsplash.com/photo-1605296867304-46d5465a25f1?q=80&w=600&auto=format&fit=crop',
    pernas: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=600&auto=format&fit=crop',
    core: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
    cardio: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop',
    geral: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop'
};

export default function Dashboard({ onStartWorkout, onEditWorkout, onCreateWorkout, onLogout }) {
    const { 
        activeProfile, 
        workouts, 
        deleteWorkout, 
        activeWorkout, 
        workoutStreak,
        loadPreset,
        startFreeWorkout,
        addCardioWorkout,
        exercises,
        saveWorkout,
        profileDetails,
        measurements
    } = useApp();

    const [showPresetsModal, setShowPresetsModal] = useState(false);
    const [selectedPresetKey, setSelectedPresetKey] = useState(null);
    const [showCalisteniaModal, setShowCalisteniaModal] = useState(false);
    const [selectedUserWorkout, setSelectedUserWorkout] = useState(null);

    // Estados do Gerador Inteligente de Treinos ABC
    const [showGeneratorModal, setShowGeneratorModal] = useState(false);
    const [generatedWorkoutPlan, setGeneratedWorkoutPlan] = useState(null);
    const [genObjective, setGenObjective] = useState('hipertrofia'); // 'hipertrofia' | 'emagrecimento' | 'resistencia'
    const [genLevel, setGenLevel] = useState('medio'); // 'medio' | 'avancado'
    const [genEquipment, setGenEquipment] = useState('maquinas'); // 'maquinas' | 'calistenia' | 'misto'
    const [genFocusMuscles, setGenFocusMuscles] = useState([]); // Focos selecionados: ['peito', 'gluteos']

    // Sincroniza preferências do Gerador com os dados da Anamnese ao abrir o modal
    React.useEffect(() => {
        if (showGeneratorModal && profileDetails) {
            setGenObjective(profileDetails.objective || 'hipertrofia');
            setGenFocusMuscles(profileDetails.focusMuscles || []);
        }
    }, [showGeneratorModal, profileDetails]);

    // Resgata o último registro de bioimpedância cadastrado
    const lastBioimpedance = React.useMemo(() => {
        if (!measurements || measurements.length === 0) return null;
        const bioLogs = measurements.filter(m => m.bodyFat || m.skeletalMuscle);
        if (bioLogs.length === 0) return null;
        return bioLogs[bioLogs.length - 1];
    }, [measurements]);

    const handleGenFocusMuscleChange = (muscle) => {
        if (genFocusMuscles.includes(muscle)) {
            setGenFocusMuscles(genFocusMuscles.filter(m => m !== muscle));
        } else {
            setGenFocusMuscles([...genFocusMuscles, muscle]);
        }
    };

    // Fecha a lista de presets ao abrir uma pré-visualização
    React.useEffect(() => {
        if (selectedPresetKey) {
            setShowPresetsModal(false);
        }
    }, [selectedPresetKey]);

    const handleClosePresetPreview = () => {
        setSelectedPresetKey(null);
        setShowPresetsModal(true);
    };

    // Algoritmo do Gerador Inteligente de Treinos ABC Customizados Adaptativos
    const handleGenerateWorkout = () => {
        if (!exercises || exercises.length === 0) {
            alert('Erro: Banco de exercícios não carregado.');
            return;
        }

        const gender = profileDetails?.gender || 'masculino';
        const age = profileDetails?.age || 30;
        const lastBF = lastBioimpedance?.bodyFat || 0;
        const restTime = age > 50 ? '90s a 120s' : '60s';

        // 1. Filtro de equipamentos
        const filterByEquipment = (exList) => {
            if (genEquipment === 'maquinas') {
                // Prioriza máquinas e polias, e remove pesos livres pesados
                return exList.filter(e => {
                    const nameLower = e.name.toLowerCase();
                    const pathLower = e.path.toLowerCase();
                    const isMachine = nameLower.includes('máquina') || nameLower.includes('maquina') ||
                                      nameLower.includes('cabo') || nameLower.includes('polia') ||
                                      nameLower.includes('guiado') || nameLower.includes('aparelho') ||
                                      pathLower.includes('cabo') || pathLower.includes('polia') ||
                                      nameLower.includes('peck') || nameLower.includes('voador') ||
                                      nameLower.includes('leg press') || nameLower.includes('extensora') ||
                                      nameLower.includes('flexora') || nameLower.includes('adutor') ||
                                      nameLower.includes('abdutor') || nameLower.includes('pulley');
                    
                    const isFreeWeight = nameLower.includes('haltere') || nameLower.includes('halter') ||
                                         nameLower.includes('kettlebell') || nameLower.includes('barra livre') ||
                                         (nameLower.includes('barra') && !nameLower.includes('barra fixa') && !nameLower.includes('barra reta') && !nameLower.includes('guiada'));
                    return isMachine && !isFreeWeight;
                });
            } else if (genEquipment === 'calistenia') {
                // Peso corporal apenas (Calistenia)
                return exList.filter(e => {
                    const pathLower = e.path.toLowerCase();
                    const nameLower = e.name.toLowerCase();
                    return pathLower.includes('calistenia') || 
                           nameLower.includes('peso corporal') || 
                           nameLower.includes('barra fixa') || 
                           nameLower.includes('paralela') || 
                           nameLower.includes('flexão') || 
                           nameLower.includes('abdominal');
                });
            }
            // Misto - aceita tudo
            return exList;
        };

        // 2. Helper para escolher exercícios aleatórios de um grupo muscular
        const getRandomExercises = (list, count, categoryName) => {
            // Filtra pela pasta correspondente
            let filtered = list.filter(e => {
                const cat = e.path.split('/')[1];
                return cat === categoryName;
            });

            if (filtered.length === 0) {
                // Fallback se o filtro de equipamento for muito estrito e não sobrar nada
                filtered = exercises.filter(e => e.path.split('/')[1] === categoryName);
            }

            const shuffled = [...filtered].sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        };

        // Filtrar a base com base no estilo
        const availableExercises = filterByEquipment(exercises);

        // 3. Montar os Exercícios do Treino A (Empurrar: Peito, Ombro, Tríceps)
        const workoutAEx = [];
        // Peito: 2 ou 3 exercícios
        const peitoCount = genFocusMuscles.includes('peito') ? 3 : 2;
        workoutAEx.push(...getRandomExercises(availableExercises, peitoCount, 'Peitoral'));
        // Ombro: 1 ou 2 exercícios
        const ombroCount = genFocusMuscles.includes('ombros') ? 2 : 1;
        workoutAEx.push(...getRandomExercises(availableExercises, ombroCount, 'Ombros'));
        // Tríceps: 1 ou 2 exercícios
        const tricepsCount = genFocusMuscles.includes('bracos') ? 2 : 1;
        workoutAEx.push(...getRandomExercises(availableExercises, tricepsCount, 'Tríceps'));

        // 4. Montar os Exercícios do Treino B (Puxar: Costas, Bíceps, Core)
        const workoutBEx = [];
        // Costas: 2 ou 3 exercícios
        const costasCount = genFocusMuscles.includes('costas') ? 3 : 2;
        workoutBEx.push(...getRandomExercises(availableExercises, costasCount, 'Costas'));
        // Bíceps: 1 ou 2 exercícios
        const bicepsCount = genFocusMuscles.includes('bracos') ? 2 : 1;
        workoutBEx.push(...getRandomExercises(availableExercises, bicepsCount, 'Bíceps'));
        // Core/Abdômen: 1 exercício (ou 2 se prioridade for Core)
        const coreCount = genFocusMuscles.includes('core') ? 2 : 1;
        let abdominais = availableExercises.filter(e => e.name.toLowerCase().includes('abdominal') || e.name.toLowerCase().includes('infra'));
        if (abdominais.length === 0) {
            abdominais = exercises.filter(e => e.name.toLowerCase().includes('abdominal') || e.name.toLowerCase().includes('infra'));
        }
        const shuffledCore = [...abdominais].sort(() => 0.5 - Math.random());
        workoutBEx.push(...shuffledCore.slice(0, coreCount));

        // 5. Montar os Exercícios do Treino C (Pernas: Coxa, Glúteo, Panturrilha)
        const workoutCEx = [];
        // Coxas: 2 ou 3 exercícios
        const coxasCount = genFocusMuscles.includes('pernas') ? 3 : 2;
        workoutCEx.push(...getRandomExercises(availableExercises, coxasCount, 'Pernas'));
        
        // Glúteos: Fisiologicamente adaptado!
        // Se for Feminino e Glúteos estiver marcado: 3 exercícios (foco de Adlai)
        // Se for Feminino normal ou Masculino c/ Glúteo marcado: 2 exercícios
        // Se for Masculino normal: 1 exercício
        let gluteosCount = 1;
        if (gender === 'feminino' && genFocusMuscles.includes('gluteos')) {
            gluteosCount = 3;
        } else if (gender === 'feminino' || genFocusMuscles.includes('gluteos')) {
            gluteosCount = 2;
        }
        workoutCEx.push(...getRandomExercises(availableExercises, gluteosCount, 'Glúteos'));
        
        // Panturrilha: 1 ou 2 exercícios
        const panturrilhaCount = genFocusMuscles.includes('pernas') ? 2 : 1;
        let panturrilha = getRandomExercises(availableExercises, panturrilhaCount, 'Panturrilhas');
        if (panturrilha.length === 0) {
            panturrilha = exercises.filter(e => e.path.split('/')[1] === 'Panturrilhas').slice(0, panturrilhaCount);
        }
        workoutCEx.push(...panturrilha);

        // 6. Formatar Exercícios para o Banco de Dados do Usuário
        const mapExercisesToWorkoutFormat = (list) => {
            const isAdvanced = genLevel === 'avancado';
            const series = isAdvanced ? 4 : 3;
            let reps = 10;
            if (genObjective === 'emagrecimento') {
                reps = isAdvanced ? 12 : 15;
            } else if (genObjective === 'hipertrofia') {
                reps = isAdvanced ? 8 : 10;
            } else {
                reps = 12; // Resistência
            }

            // Recomendação de aeróbico pós-treino baseada em bioimpedância e objetivo
            let cardioRecom = '';
            if (genObjective === 'emagrecimento' || (gender === 'masculino' && lastBF > 25) || (gender === 'feminino' && lastBF > 32)) {
                cardioRecom = ` | 💡 Recomendação de Cardio: Fazer de 15 a 20 min de cardio de moderada intensidade pós-treino (Foco: Redução de Gordura Corporal, BF atual: ${lastBF > 0 ? lastBF + '%' : 'Alto'}).`;
            }

            return list.filter(Boolean).map(ex => {
                let defaultWeight = 0;
                let targetWeight = 0;
                const nameLower = ex.name.toLowerCase();

                // Sugere cargas realistas se for treino com pesos/máquinas
                if (genEquipment !== 'calistenia') {
                    if (nameLower.includes('leg press')) {
                        defaultWeight = 60;
                        targetWeight = 100;
                    } else if (nameLower.includes('extensora') || nameLower.includes('flexora') || nameLower.includes('adutor') || nameLower.includes('abdutor')) {
                        defaultWeight = 20;
                        targetWeight = 35;
                    } else if (nameLower.includes('supino') || nameLower.includes('voador') || nameLower.includes('peck') || nameLower.includes('puxada') || nameLower.includes('remada')) {
                        defaultWeight = 25;
                        targetWeight = 40;
                    } else {
                        defaultWeight = 10;
                        targetWeight = 20;
                    }
                }

                return {
                    name: ex.name,
                    path: ex.path,
                    series: series,
                    reps: reps,
                    weight: defaultWeight,
                    targetWeight: targetWeight,
                    notes: `Progressão automática baseada no objetivo de ${genObjective === 'hipertrofia' ? 'Hipertrofia' : genObjective === 'emagrecimento' ? 'Definição/Queima' : 'Resistência Muscular'}. Descanso recomendado: ${restTime}.${cardioRecom}`
                };
            });
        };

        // 7. Montar o Plano ABC
        const plan = {
            A: {
                name: `Treino A - Empurrar (${genObjective.toUpperCase()})`,
                description: `Peito, Ombros e Tríceps. Estilo: ${genEquipment === 'maquinas' ? 'Máquinas' : genEquipment === 'calistenia' ? 'Calistenia' : 'Misto'}. Descanso sugerido: ${restTime}.`,
                coverStyle: 'peito',
                exercises: mapExercisesToWorkoutFormat(workoutAEx)
            },
            B: {
                name: `Treino B - Puxar (${genObjective.toUpperCase()})`,
                description: `Costas, Bíceps e Core. Estilo: ${genEquipment === 'maquinas' ? 'Máquinas' : genEquipment === 'calistenia' ? 'Calistenia' : 'Misto'}. Descanso sugerido: ${restTime}.`,
                coverStyle: 'costas',
                exercises: mapExercisesToWorkoutFormat(workoutBEx)
            },
            C: {
                name: `Treino C - Pernas (${genObjective.toUpperCase()})`,
                description: `Coxas, Glúteos e Panturrilhas. Estilo: ${genEquipment === 'maquinas' ? 'Máquinas' : genEquipment === 'calistenia' ? 'Calistenia' : 'Misto'}. Descanso sugerido: ${restTime}.`,
                coverStyle: 'pernas',
                exercises: mapExercisesToWorkoutFormat(workoutCEx)
            }
        };

        setGeneratedWorkoutPlan(plan);
    };

    const handleSaveGeneratedPlan = () => {
        if (!generatedWorkoutPlan) return;

        saveWorkout([
            generatedWorkoutPlan.A,
            generatedWorkoutPlan.B,
            generatedWorkoutPlan.C
        ]);

        alert('As planilhas do Treino ABC inteligente foram salvas nas suas rotinas!');
        setGeneratedWorkoutPlan(null);
        setShowGeneratorModal(false);
    };
    
    // Estados do modal de Cardio / Zepp
    const [showCardioModal, setShowCardioModal] = useState(false);
    const [cardioType, setCardioType] = useState('running');
    const [cardioDate, setCardioDate] = useState(new Date().toISOString().split('T')[0]);
    const [cardioDuration, setCardioDuration] = useState('');
    const [cardioDistance, setCardioDistance] = useState('');
    const [cardioHR, setCardioHR] = useState('');
    const [cardioCal, setCardioCal] = useState('');
    const [gpxError, setGpxError] = useState('');
    const [gpxSuccess, setGpxSuccess] = useState('');

    const handleGPXUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setGpxError('');
        setGpxSuccess('');
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const gpxText = event.target.result;
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(gpxText, "text/xml");
                
                const points = xmlDoc.getElementsByTagName("trkpt");
                if (points.length === 0) {
                    throw new Error("Nenhum ponto de GPS encontrado no arquivo GPX.");
                }
                
                const startNode = points[0].querySelector("time");
                const endNode = points[points.length - 1].querySelector("time");
                let duration = 0;
                let dateStr = new Date().toISOString().split('T')[0];
                
                if (startNode && endNode) {
                    const startVal = new Date(startNode.textContent);
                    const endVal = new Date(endNode.textContent);
                    duration = Math.round((endVal - startVal) / 60000);
                    dateStr = startNode.textContent.split('T')[0];
                }
                
                let distance = 0;
                const getDistanceFromLatLon = (lat1, lon1, lat2, lon2) => {
                    const R = 6371; // km
                    const dLat = (lat2 - lat1) * Math.PI / 180;
                    const dLon = (lon2 - lon1) * Math.PI / 180;
                    const a = 
                        Math.sin(dLat/2) * Math.sin(dLat/2) +
                        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                        Math.sin(dLon/2) * Math.sin(dLon/2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    return R * c;
                };
                
                for (let i = 0; i < points.length - 1; i++) {
                    const lat1 = parseFloat(points[i].getAttribute("lat"));
                    const lon1 = parseFloat(points[i].getAttribute("lon"));
                    const lat2 = parseFloat(points[i + 1].getAttribute("lat"));
                    const lon2 = parseFloat(points[i + 1].getAttribute("lon"));
                    if (lat1 && lon1 && lat2 && lon2) {
                        distance += getDistanceFromLatLon(lat1, lon1, lat2, lon2);
                    }
                }
                
                let hrSum = 0;
                let hrCount = 0;
                for (let i = 0; i < points.length; i++) {
                    const hrNode = points[i].getElementsByTagNameNS("*", "hr")[0] || points[i].querySelector("hr");
                    if (hrNode) {
                        const hrVal = parseInt(hrNode.textContent);
                        if (hrVal > 0) {
                            hrSum += hrVal;
                            hrCount++;
                        }
                    }
                }
                const avgHR = hrCount > 0 ? Math.round(hrSum / hrCount) : '';
                
                let type = 'running';
                const trkName = xmlDoc.querySelector("name")?.textContent || "";
                if (
                    file.name.toLowerCase().includes("bike") || 
                    file.name.toLowerCase().includes("cycle") || 
                    file.name.toLowerCase().includes("pedal") ||
                    file.name.toLowerCase().includes("ciclismo") ||
                    trkName.toLowerCase().includes("pedal") ||
                    trkName.toLowerCase().includes("bike")
                ) {
                    type = 'cycling';
                }
                
                setCardioType(type);
                setCardioDate(dateStr);
                setCardioDuration(duration > 0 ? duration.toString() : '');
                setCardioDistance(distance > 0 ? distance.toFixed(2) : '');
                setCardioHR(avgHR ? avgHR.toString() : '');
                
                setGpxSuccess(`GPX importado: ${distance.toFixed(2)} km em ${duration} min!`);
            } catch (err) {
                setGpxError(`Erro GPX: ${err.message}`);
            }
        };
        reader.readAsText(file);
    };

    const handleSaveCardio = () => {
        if (!cardioDuration || !cardioDistance) {
            alert('Por favor, informe a duração e a distância da atividade.');
            return;
        }
        
        addCardioWorkout({
            type: cardioType,
            date: new Date(cardioDate + "T12:00:00").toISOString(),
            duration: parseInt(cardioDuration),
            distance: parseFloat(cardioDistance),
            heartRate: cardioHR ? parseInt(cardioHR) : null,
            calories: cardioCal ? parseInt(cardioCal) : null
        });
        
        // Limpa form e fecha
        setCardioDuration('');
        setCardioDistance('');
        setCardioHR('');
        setCardioCal('');
        setGpxSuccess('');
        setGpxError('');
        setShowCardioModal(false);
        alert('Atividade de cardio registrada com sucesso!');
    };

    return (
        <div className="dashboard-container">
            {/* Header com Seleção de Perfil */}
            <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="user-badge">
                    <span className="avatar-mini">{activeProfile?.avatar}</span>
                    <span className="name">Olá, {activeProfile?.name}!</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {workoutStreak > 0 ? (
                        <div className="streak-badge" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'rgba(249, 115, 22, 0.12)',
                            border: '1px solid rgba(249, 115, 22, 0.25)',
                            color: '#f97316',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '13px',
                            fontWeight: '700',
                            boxShadow: '0 0 12px rgba(249, 115, 22, 0.15)'
                        }} title="Semanas consecutivas ativo!">
                            🔥 {workoutStreak} {workoutStreak === 1 ? 'semana' : 'semanas'}
                        </div>
                    ) : (
                        <div className="streak-badge" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            color: 'var(--text-muted)',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '500'
                        }}>
                            🔥 0 semanas
                        </div>
                    )}
                    
                    <button 
                        className="btn-icon" 
                        onClick={onLogout} 
                        title="Mudar Perfil"
                        style={{ fontSize: '15px' }}
                    >
                        ➔
                    </button>
                </div>
            </div>

            {/* Treino Ativo em Andamento */}
            {activeWorkout && (
                <div className="card quick-workout-card" style={{ marginBottom: '25px' }}>
                    <h3 style={{ color: 'var(--accent)', marginBottom: '5px' }}>⚡ Treino em Andamento!</h3>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '15px' }}>
                        Você tem um treino de <strong>{activeWorkout.workoutName}</strong> em andamento.
                    </p>
                    <button className="btn-primary" onClick={() => onStartWorkout(null)}>
                        Continuar Treino
                    </button>
                </div>
            )}

            {/* Banner principal quando não há treino ativo */}
            {!activeWorkout && (
                <div className="card quick-workout-card" style={{ marginBottom: '25px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>Bora treinar hoje?</h2>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '15px' }}>
                        Selecione uma rotina abaixo, monte um treino livre ou registre suas pedaladas e corridas.
                    </p>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {workouts.length > 0 && (
                            <button className="btn-primary" style={{ flex: 1, minWidth: '150px' }} onClick={() => onStartWorkout(workouts[0])}>
                                ⚡ Iniciar {workouts[0].name.split(' - ')[0]}
                            </button>
                        )}
                        <button 
                            className="btn-secondary" 
                            style={{ flex: 1, minWidth: '150px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }} 
                            onClick={startFreeWorkout}
                        >
                            ➕ Treino Livre (Em Branco)
                        </button>
                        <button 
                            className="btn-secondary" 
                            style={{ flex: 1, minWidth: '150px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }} 
                            onClick={() => setShowCardioModal(true)}
                        >
                            🚴‍♂️ Logar Cardio (Zepp)
                        </button>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2>Minhas Rotinas</h2>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                        onClick={() => setShowGeneratorModal(true)}
                        style={{ 
                            background: 'none', 
                            color: 'var(--accent)', 
                            fontSize: '14px', 
                            fontWeight: '600' 
                        }}
                    >
                        ✨ Gerador ABC
                    </button>
                    <button 
                        onClick={() => setShowPresetsModal(true)}
                        style={{ 
                            background: 'none', 
                            color: 'var(--accent)', 
                            fontSize: '14px', 
                            fontWeight: '600' 
                        }}
                    >
                        + Modelo Pronto
                    </button>
                    <button 
                        onClick={onCreateWorkout} 
                        style={{ 
                            background: 'none', 
                            color: 'var(--accent)', 
                            fontSize: '14px', 
                            fontWeight: '600' 
                        }}
                    >
                        + Novo Treino
                    </button>
                </div>
            </div>

            {workouts.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '40px 20px',
                    color: 'var(--text-muted)',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid rgba(255,255,255,0.03)'
                }}>
                    📋 Nenhuma rotina criada ainda.<br/>
                    Clique em "+ Novo Treino" para montar sua primeira série!
                    <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Ou comece com um modelo pronto:</p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <button onClick={() => setSelectedPresetKey('TAF')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', width: 'auto' }}>Preparação TAF</button>
                            <button onClick={() => setShowCalisteniaModal(true)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', width: 'auto' }}>Calistenia</button>
                            <button onClick={() => setSelectedPresetKey('FB')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', width: 'auto' }}>Corpo Inteiro</button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="workout-grid">
                    {workouts.map(workout => (
                        <div 
                            key={workout.id} 
                            className="workout-item-card"
                            onClick={() => setSelectedUserWorkout(workout)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div 
                                className="workout-card-cover" 
                                style={{ backgroundImage: `url(${COVER_IMAGES[workout.coverStyle || 'geral']})` }}
                            >
                                <div className="workout-card-cover-overlay"></div>
                            </div>
                            <div className="workout-card-body">
                                <div className="workout-info" style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '4px' }}>{workout.name}</h3>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{workout.description || 'Sem descrição'}</p>
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                                        <span className="badge-gym">{workout.exercises.length} exercícios</span>
                                        <span className="badge-gym">⏱️ {estimateWorkoutDuration(workout)} min</span>
                                        {workout.coverStyle && (
                                            <span className="badge-gym category-badge">{workout.coverStyle.toUpperCase()}</span>
                                        )}
                                    </div>
                                </div>

                                <div className="workout-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <button 
                                        className="btn-icon" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onStartWorkout(workout);
                                        }}
                                        title="Iniciar Treino"
                                        style={{ background: 'rgba(var(--accent-rgb), 0.1)', borderColor: 'rgba(var(--accent-rgb), 0.2)', color: 'var(--accent)' }}
                                    >
                                        ▶
                                    </button>
                                    <button 
                                        className="btn-icon" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEditWorkout(workout);
                                        }}
                                        title="Editar Treino"
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        className="btn-icon" 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm(`Tem certeza que deseja excluir o treino "${workout.name}"?`)) {
                                                deleteWorkout(workout.id);
                                            }
                                        }}
                                        title="Excluir Treino"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* CARD DESTACADO DA CALISTENIA (PESO CORPORAL) */}
            <div className="card" style={{
                marginTop: '30px',
                marginBottom: '20px',
                background: 'linear-gradient(135deg, rgba(18, 20, 28, 0.9) 0%, rgba(var(--accent-rgb), 0.05) 100%)',
                border: '1px solid rgba(var(--accent-rgb), 0.15)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Efeito decorativo no fundo */}
                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: 'rgba(var(--accent-rgb), 0.03)',
                    filter: 'blur(30px)',
                    zIndex: 0
                }}></div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '17px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            🤸 Módulo Calistenia (Peso Corporal)
                        </h3>
                        <span style={{ fontSize: '11px', background: 'rgba(var(--accent-rgb), 0.1)', color: 'var(--accent)', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                            FitLife 🤸
                        </span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '15px', lineHeight: '1.5' }}>
                        Rotinas completas utilizando apenas o peso corporal, barras e paralelas. Dividido em 3 níveis progressivos para construir força real de adaptação ao avançado.
                    </p>
                    <button 
                        className="btn-primary" 
                        onClick={() => setShowCalisteniaModal(true)}
                        style={{
                            width: 'auto',
                            padding: '8px 16px',
                            fontSize: '13px',
                            background: 'rgba(var(--accent-rgb), 0.1)',
                            border: '1px solid rgba(var(--accent-rgb), 0.25)',
                            color: 'var(--accent)',
                            boxShadow: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}
                    >
                        ⚡ Acessar Projeto Calistenia
                    </button>
                </div>
            </div>

            {/* MODAL DE PRESETS */}
            {showPresetsModal && (
                <div className="modal-overlay" onClick={() => setShowPresetsModal(false)}>
                    <div className="modal-sheet" style={{ height: 'auto', maxHeight: '80vh' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header-sheet">
                            <h3>Modelos de Treino (Presets)</h3>
                            <button className="modal-close-btn" onClick={() => setShowPresetsModal(false)}>&times;</button>
                        </div>
                        
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto' }}>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                Selecione um modelo para pré-visualizar a rotina de exercícios e importá-la para os seus treinos:
                            </p>

                            {/* AUTOR (Apenas Fábio) */}
                            {activeProfile?.id === 'fabio' && (
                                <div 
                                    onClick={() => setSelectedPresetKey('AUTOR')}
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(var(--accent-rgb), 0.15) 0%, var(--bg-secondary) 100%)',
                                        border: '1px solid rgba(var(--accent-rgb), 0.3)',
                                        borderRadius: '12px',
                                        padding: '15px',
                                        cursor: 'pointer',
                                        transition: 'var(--transition)'
                                    }}
                                    className="preset-card"
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                        <h4 style={{ color: 'var(--accent)', margin: 0 }}>ABC escolhido por mim</h4>
                                        <span style={{ fontSize: '11px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>Médio</span>
                                    </div>
                                    <p style={{ fontSize: '12px', color: 'var(--text-main)', marginBottom: '8px' }}>
                                        O treino ideal recomendado pelo autor: divisão ABC biomecanicamente otimizada com foco 100% em máquinas e polias para máximo isolamento e segurança articular.
                                    </p>
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>⏱️ Duração: 45 min/dia | Clique para pré-visualizar</span>
                                </div>
                            )}

                            {/* ESPOSA (Apenas Esposa) */}
                            {activeProfile?.id === 'esposa' && (
                                <div 
                                    onClick={() => setSelectedPresetKey('ESPOSA_VIDA')}
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, var(--bg-secondary) 100%)',
                                        border: '1px solid rgba(236, 72, 153, 0.3)',
                                        borderRadius: '12px',
                                        padding: '15px',
                                        cursor: 'pointer',
                                        transition: 'var(--transition)',
                                        marginBottom: '15px'
                                    }}
                                    className="preset-card"
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                        <h4 style={{ color: '#ec4899', margin: 0 }}>Treino escolhido pelo vida!</h4>
                                        <span style={{ fontSize: '11px', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>Iniciante</span>
                                    </div>
                                    <p style={{ fontSize: '12px', color: 'var(--text-main)', marginBottom: '8px' }}>
                                        Treino personalizado criado pelo Fábio para a sua esposa.
                                    </p>
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>⏱️ Duração: 50 min/dia | Clique para pré-visualizar</span>
                                </div>
                            )}

                            {/* PPL */}
                            <div 
                                onClick={() => setSelectedPresetKey('PPL')}
                                style={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    padding: '15px',
                                    cursor: 'pointer',
                                    transition: 'var(--transition)'
                                }}
                                className="preset-card"
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                    <h4 style={{ color: 'var(--accent)', margin: 0 }}>🏋️‍♂️ Push / Pull / Legs (PPL)</h4>
                                    <span style={{ fontSize: '11px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>Avançado</span>
                                </div>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                    Dividido em 3 treinos focados na ação muscular: Empurrar (Peito/Ombro/Tríceps), Puxar (Costas/Bíceps) e Pernas completas.
                                </p>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>⏱️ Duração: 60 min/dia | Clique para pré-visualizar</span>
                            </div>

                            {/* FEMININO */}
                            <div 
                                onClick={() => setSelectedPresetKey('FEMININO')}
                                style={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    padding: '15px',
                                    cursor: 'pointer',
                                    transition: 'var(--transition)'
                                }}
                                className="preset-card"
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                    <h4 style={{ color: 'var(--accent)', margin: 0 }}>🌸 Modelador Pernas & Glúteos</h4>
                                    <span style={{ fontSize: '11px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>Médio</span>
                                </div>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                    Treino completo de pernas, glúteos e definição focado em aparelhos guiados e cabos para o público feminino.
                                </p>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>⏱️ Duração: 50 min/dia | Clique para pré-visualizar</span>
                            </div>

                            {/* SUPERIOR_MAQ */}
                            <div 
                                onClick={() => setSelectedPresetKey('SUPERIOR_MAQ')}
                                style={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    padding: '15px',
                                    cursor: 'pointer',
                                    transition: 'var(--transition)'
                                }}
                                className="preset-card"
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                    <h4 style={{ color: 'var(--accent)', margin: 0 }}>🤖 Superior Máquinas (Upper Machine)</h4>
                                    <span style={{ fontSize: '11px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>Médio</span>
                                </div>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                    Rotina para membros superiores (peito, costas e ombros) focando inteiramente em aparelhos para segurança articular.
                                </p>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>⏱️ Duração: 45 min/dia | Clique para pré-visualizar</span>
                            </div>

                            {/* BRACOS_CABO */}
                            <div 
                                onClick={() => setSelectedPresetKey('BRACOS_CABO')}
                                style={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    padding: '15px',
                                    cursor: 'pointer',
                                    transition: 'var(--transition)'
                                }}
                                className="preset-card"
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                    <h4 style={{ color: 'var(--accent)', margin: 0 }}>💪 Braços Gigantes (Cabos & Polias)</h4>
                                    <span style={{ fontSize: '11px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>Médio</span>
                                </div>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                    Treino de isolamento focado em bíceps e tríceps utilizando polias, garantindo tensão mecânica constante.
                                </p>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>⏱️ Duração: 40 min/dia | Clique para pré-visualizar</span>
                            </div>

                            {/* UL */}
                            <div 
                                onClick={() => setSelectedPresetKey('UL')}
                                style={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    padding: '15px',
                                    cursor: 'pointer',
                                    transition: 'var(--transition)'
                                }}
                                className="preset-card"
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                    <h4 style={{ color: 'var(--accent)', margin: 0 }}>💪 Superior / Inferior (Upper/Lower)</h4>
                                    <span style={{ fontSize: '11px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>Médio</span>
                                </div>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                    Divisão balanceada de 2 treinos para otimizar a frequência semanal de estímulo muscular.
                                </p>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>⏱️ Duração: 50 min/dia | Clique para pré-visualizar</span>
                            </div>

                            {/* FB */}
                            <div 
                                onClick={() => setSelectedPresetKey('FB')}
                                style={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    padding: '15px',
                                    cursor: 'pointer',
                                    transition: 'var(--transition)'
                                }}
                                className="preset-card"
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                    <h4 style={{ color: 'var(--accent)', margin: 0 }}>⚡ Corpo Inteiro (Full Body)</h4>
                                    <span style={{ fontSize: '11px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>Médio</span>
                                </div>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                    Treinamento completo englobando os grandes grupos em 1 único dia. Ideal para consistência rápida.
                                </p>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>⏱️ Duração: 45 min/dia | Clique para pré-visualizar</span>
                            </div>

                            {/* PEITO */}
                            <div 
                                onClick={() => setSelectedPresetKey('PEITO')}
                                style={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    padding: '15px',
                                    cursor: 'pointer',
                                    transition: 'var(--transition)'
                                }}
                                className="preset-card"
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                    <h4 style={{ color: 'var(--accent)', margin: 0 }}>🍒 Hipertrofia de Peito</h4>
                                    <span style={{ fontSize: '11px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>Avançado</span>
                                </div>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                    Foco absoluto no peitoral maior/menor, supino reto e inclinado em máquinas e cruzamentos de cabos.
                                </p>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>⏱️ Duração: 40 min/dia | Clique para pré-visualizar</span>
                            </div>

                            {/* CARDIO_EXPRESS */}
                            <div 
                                onClick={() => setSelectedPresetKey('CARDIO_EXPRESS')}
                                style={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    padding: '15px',
                                    cursor: 'pointer',
                                    transition: 'var(--transition)'
                                }}
                                className="preset-card"
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                    <h4 style={{ color: 'var(--accent)', margin: 0 }}>⚡ Circuito Queima Rápida</h4>
                                    <span style={{ fontSize: '11px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>Médio</span>
                                </div>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                    Treino dinâmico em formato de circuito utilizando aparelhos com tempo mínimo de descanso para máxima queima.
                                </p>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>⏱️ Duração: 30 min/dia | Clique para pré-visualizar</span>
                            </div>

                            {/* CORE */}
                            <div 
                                onClick={() => setSelectedPresetKey('CORE')}
                                style={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    padding: '15px',
                                    cursor: 'pointer',
                                    transition: 'var(--transition)'
                                }}
                                className="preset-card"
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                    <h4 style={{ color: 'var(--accent)', margin: 0 }}>🛡️ Fortalecimento de Core</h4>
                                    <span style={{ fontSize: '11px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>Médio</span>
                                </div>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                    Estabilidade lombar, oblíquos e fortalecimento abdominal completo.
                                </p>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>⏱️ Duração: 30 min/dia | Clique para pré-visualizar</span>
                            </div>

                            {/* TAF */}
                            <div 
                                onClick={() => setSelectedPresetKey('TAF')}
                                style={{
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    borderRadius: '12px',
                                    padding: '15px',
                                    cursor: 'pointer',
                                    transition: 'var(--transition)'
                                }}
                                className="preset-card"
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                    <h4 style={{ color: 'var(--accent)', margin: 0 }}>📋 Preparação TAF (5 Dias)</h4>
                                    <span style={{ fontSize: '11px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>Avançado</span>
                                </div>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                    Foco nos exercícios obrigatórios de Testes de Aptidão Física, incluindo barra fixa supinada, flexões de braço e resistência.
                                </p>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>⏱️ Duração: 45 min/dia | Clique para pré-visualizar</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE CARDIO / ZEPP */}
            {showCardioModal && (
                <div className="modal-overlay" onClick={() => setShowCardioModal(false)}>
                    <div className="modal-sheet" style={{ height: 'auto', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header-sheet">
                            <h3>Registrar Atividade de Cardio</h3>
                            <button className="modal-close-btn" onClick={() => setShowCardioModal(false)}>&times;</button>
                        </div>
                        
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto' }}>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                                Importe o arquivo GPX exportado do aplicativo <strong>Zepp (Amazfit)</strong> ou preencha o registro manual abaixo.
                            </p>

                            {/* Área de GPX Upload */}
                            <div style={{
                                border: '2px dashed rgba(var(--accent-rgb), 0.3)',
                                borderRadius: '10px',
                                padding: '15px',
                                textAlign: 'center',
                                background: 'rgba(var(--accent-rgb), 0.02)',
                                cursor: 'pointer',
                                position: 'relative'
                            }}>
                                <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>📂</span>
                                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--accent)' }}>Importar GPX do Zepp</span>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                                    (Data, distância e batimentos serão preenchidos)
                                </span>
                                <input 
                                    type="file" 
                                    accept=".gpx" 
                                    onChange={handleGPXUpload} 
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        opacity: 0,
                                        cursor: 'pointer'
                                    }}
                                />
                            </div>

                            {/* Feedbacks GPX */}
                            {gpxError && (
                                <div style={{ color: '#f87171', fontSize: '12px', background: 'rgba(239, 68, 68, 0.05)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                                    ⚠️ {gpxError}
                                </div>
                            )}
                            {gpxSuccess && (
                                <div style={{ color: '#10b981', fontSize: '12px', background: 'rgba(16, 185, 129, 0.05)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                                    ✅ {gpxSuccess}
                                </div>
                            )}

                            {/* Formulário de Atividade */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                                <div className="editor-input-group">
                                    <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tipo de Cardio</label>
                                    <select 
                                        value={cardioType} 
                                        onChange={e => setCardioType(e.target.value)}
                                        style={{
                                            width: '100%',
                                            background: 'var(--bg-secondary)',
                                            border: '1px solid rgba(255, 255, 255, 0.08)',
                                            borderRadius: '6px',
                                            padding: '8px 10px',
                                            color: '#fff',
                                            fontFamily: 'var(--font-sans)',
                                            fontSize: '14px',
                                            outline: 'none'
                                        }}
                                    >
                                        <option value="running">🏃‍♂️ Corrida (Pedestre)</option>
                                        <option value="cycling">🚴‍♂️ Ciclismo (Pedalada)</option>
                                    </select>
                                </div>

                                <div className="editor-input-group">
                                    <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Data</label>
                                    <input 
                                        type="date" 
                                        value={cardioDate} 
                                        onChange={e => setCardioDate(e.target.value)}
                                        style={{
                                            width: '100%',
                                            background: 'var(--bg-secondary)',
                                            border: '1px solid rgba(255, 255, 255, 0.08)',
                                            borderRadius: '6px',
                                            padding: '8px 10px',
                                            color: '#fff',
                                            fontFamily: 'var(--font-sans)',
                                            fontSize: '14px'
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <div className="editor-input-group">
                                        <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Duração (minutos)</label>
                                        <input 
                                            type="number" 
                                            value={cardioDuration} 
                                            placeholder="Ex: 45"
                                            onChange={e => setCardioDuration(e.target.value)}
                                            style={{
                                                width: '100%',
                                                background: 'var(--bg-secondary)',
                                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                                borderRadius: '6px',
                                                padding: '8px 10px',
                                                color: '#fff',
                                                fontFamily: 'var(--font-sans)',
                                                fontSize: '14px'
                                            }}
                                        />
                                    </div>
                                    <div className="editor-input-group">
                                        <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Distância (km)</label>
                                        <input 
                                            type="number" 
                                            step="0.01"
                                            value={cardioDistance} 
                                            placeholder="Ex: 5.2"
                                            onChange={e => setCardioDistance(e.target.value)}
                                            style={{
                                                width: '100%',
                                                background: 'var(--bg-secondary)',
                                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                                borderRadius: '6px',
                                                padding: '8px 10px',
                                                color: '#fff',
                                                fontFamily: 'var(--font-sans)',
                                                fontSize: '14px'
                                            }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <div className="editor-input-group">
                                        <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Batimentos Médios (bpm)</label>
                                        <input 
                                            type="number" 
                                            value={cardioHR} 
                                            placeholder="Opcional"
                                            onChange={e => setCardioHR(e.target.value)}
                                            style={{
                                                width: '100%',
                                                background: 'var(--bg-secondary)',
                                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                                borderRadius: '6px',
                                                padding: '8px 10px',
                                                color: '#fff',
                                                fontFamily: 'var(--font-sans)',
                                                fontSize: '14px'
                                            }}
                                        />
                                    </div>
                                    <div className="editor-input-group">
                                        <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Calorias (kcal)</label>
                                        <input 
                                            type="number" 
                                            value={cardioCal} 
                                            placeholder="Opcional"
                                            onChange={e => setCardioCal(e.target.value)}
                                            style={{
                                                width: '100%',
                                                background: 'var(--bg-secondary)',
                                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                                borderRadius: '6px',
                                                padding: '8px 10px',
                                                color: '#fff',
                                                fontFamily: 'var(--font-sans)',
                                                fontSize: '14px'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleSaveCardio}
                                className="btn-primary" 
                                style={{ marginTop: '10px', width: '100%', padding: '12px' }}
                            >
                                Registrar Cardio
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE PRÉ-VISUALIZAÇÃO DE PRESET */}
            {selectedPresetKey && PRESET_WORKOUTS[selectedPresetKey] && (() => {
                const preset = PRESET_WORKOUTS[selectedPresetKey];
                return (
                    <div className="modal-overlay" onClick={handleClosePresetPreview} style={{ zIndex: 110 }}>
                        <div className="modal-sheet" style={{ height: 'auto', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
                            <div className="modal-header-sheet">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 'bold', letterSpacing: '1px' }}>
                                        Pré-visualizar Treino 📋
                                    </span>
                                    <h3 style={{ margin: 0 }}>{preset.name}</h3>
                                </div>
                                <button className="modal-close-btn" onClick={handleClosePresetPreview} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
                            </div>
                            
                            <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '12px', background: preset.difficulty === 'Avançado' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)', color: preset.difficulty === 'Avançado' ? '#ef4444' : '#3b82f6', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                                        {preset.difficulty}
                                    </span>
                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                        ⏱️ {preset.duration}
                                    </span>
                                </div>
                                
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                                    {preset.description}
                                </p>
                                
                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
                                    <h4 style={{ fontSize: '14px', color: '#fff', marginBottom: '10px' }}>Rotinas Inclusas:</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {preset.workouts.map((w, wIdx) => (
                                            <div key={wIdx} style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)' }}>
                                                <h5 style={{ fontSize: '13px', color: 'var(--accent)', fontWeight: '700', marginBottom: '4px' }}>
                                                    {w.name}
                                                </h5>
                                                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>{w.description}</p>
                                                
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                    {w.exercises.map((ex, exIdx) => (
                                                        <div key={exIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-main)' }}>
                                                            <span>• {ex.name}</span>
                                                            <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                                                                {ex.series}x{ex.reps} {ex.weight > 0 ? `(${ex.weight}kg)` : ''}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div style={{ padding: '15px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '10px' }}>
                                <button 
                                    className="btn-secondary" 
                                    onClick={handleClosePresetPreview}
                                    style={{ flex: 1, padding: '12px' }}
                                >
                                    Voltar
                                </button>
                                <button 
                                    className="btn-primary" 
                                    onClick={() => {
                                        loadPreset(selectedPresetKey);
                                        alert(`Modelo "${preset.name}" carregado com sucesso nas suas rotinas!`);
                                        setSelectedPresetKey(null);
                                        setShowPresetsModal(false);
                                    }}
                                    style={{ flex: 1, padding: '12px', background: 'var(--accent)', color: 'var(--text-dark)' }}
                                >
                                    Importar Planilha
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* MODAL DO PROJETO CALISTENIA */}
            {showCalisteniaModal && (
                <div className="modal-overlay" onClick={() => setShowCalisteniaModal(false)} style={{ zIndex: 110 }}>
                    <div className="modal-sheet" style={{ height: 'auto', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header-sheet">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 'bold', letterSpacing: '1px' }}>
                                    Projeto Especial 🤸
                                </span>
                                <h3 style={{ margin: 0 }}>Módulo Calistenia</h3>
                            </div>
                            <button className="modal-close-btn" onClick={() => setShowCalisteniaModal(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
                        </div>
                        
                        <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                                {CALISTENIA_PROJECT.description}
                            </p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {CALISTENIA_PROJECT.workouts.map((w, wIdx) => (
                                    <div key={wIdx} style={{ 
                                        background: 'var(--bg-secondary)', 
                                        borderRadius: '16px', 
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        overflow: 'hidden',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                                    }}>
                                        {/* Imagem de Capa do Treino de Calistenia */}
                                        {w.coverUrl && (
                                            <div style={{
                                                height: '120px',
                                                backgroundImage: `url(${w.coverUrl})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                position: 'relative'
                                            }}>
                                                <div style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    background: 'linear-gradient(to bottom, rgba(10,11,14,0.15) 0%, rgba(10,11,14,0.9) 100%)'
                                                }}></div>
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: '12px',
                                                    left: '15px',
                                                    right: '15px',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'flex-end'
                                                }}>
                                                    <h4 style={{ fontSize: '14px', color: '#fff', fontWeight: '800', margin: 0, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                                                        {w.name}
                                                    </h4>
                                                    <span style={{ 
                                                        fontSize: '9px', 
                                                        background: wIdx === 1 || wIdx === 2 ? 'rgba(239, 68, 68, 0.25)' : 'rgba(59, 130, 246, 0.25)', 
                                                        border: wIdx === 1 || wIdx === 2 ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(59, 130, 246, 0.4)',
                                                        color: wIdx === 1 || wIdx === 2 ? '#f87171' : '#60a5fa', 
                                                        padding: '2px 8px', 
                                                        borderRadius: '12px', 
                                                        fontWeight: 'bold' 
                                                    }}>
                                                        {wIdx === 1 || wIdx === 2 ? 'Avançado' : 'Médio'}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.45' }}>{w.description}</p>
                                            
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderLeft: '2px solid rgba(var(--accent-rgb), 0.3)', paddingLeft: '10px' }}>
                                                {w.exercises.map((ex, exIdx) => (
                                                    <div key={exIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                                        <span style={{ color: '#fff', fontWeight: '500' }}>• {ex.name}</span>
                                                        <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                                                            {ex.series}x{ex.reps}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                                                <button 
                                                    className="btn-secondary"
                                                    onClick={() => {
                                                        loadPreset('CALISTENIA');
                                                        alert('As 3 rotinas de calistenia foram adicionadas às suas rotinas da tela inicial!');
                                                        setShowCalisteniaModal(false);
                                                    }}
                                                    style={{ flex: 1, padding: '10px', fontSize: '12px', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}
                                                >
                                                    📥 Salvar Planilha
                                                </button>
                                                <button 
                                                    className="btn-primary"
                                                    onClick={() => {
                                                        onStartWorkout({
                                                            id: 'calistenia_' + wIdx,
                                                            name: w.name,
                                                            description: w.description,
                                                            exercises: w.exercises,
                                                            coverStyle: w.coverStyle
                                                        });
                                                        setShowCalisteniaModal(false);
                                                    }}
                                                    style={{ flex: 1.2, padding: '10px', fontSize: '12px', background: 'var(--accent)', color: 'var(--text-dark)', fontWeight: 'bold', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: '4px' }}
                                                >
                                                    ▶ Treinar Agora
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div style={{ padding: '15px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <button 
                                className="btn-secondary" 
                                onClick={() => setShowCalisteniaModal(false)}
                                style={{ width: '100%', padding: '12px' }}
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL DE GERADOR INTELIGENTE DE TREINOS ABC */}
            {showGeneratorModal && (
                <div className="modal-overlay" onClick={() => { setShowGeneratorModal(false); setGeneratedWorkoutPlan(null); }} style={{ zIndex: 110 }}>
                    <div className="modal-sheet" style={{ height: 'auto', maxHeight: '85vh', display: 'flex', flexDirection: 'column', width: '92%', maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header-sheet">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 'bold', letterSpacing: '1px' }}>
                                    Super Gerador ⚡
                                </span>
                                <h3 style={{ margin: 0 }}>Gerador ABC Inteligente</h3>
                            </div>
                            <button className="modal-close-btn" onClick={() => { setShowGeneratorModal(false); setGeneratedWorkoutPlan(null); }} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
                        </div>

                        <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            {!generatedWorkoutPlan ? (
                                <>
                                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                                        Responda às suas preferências e o sistema criará uma divisão completa de <strong>Treino ABC</strong> biomecanicamente equilibrada.
                                    </p>

                                    {lastBioimpedance && (
                                        <div style={{ 
                                            background: 'rgba(var(--accent-rgb), 0.05)', 
                                            border: '1px solid rgba(var(--accent-rgb), 0.15)',
                                            borderRadius: '8px', 
                                            padding: '10px 12px',
                                            fontSize: '12px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '4px'
                                        }}>
                                            <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>🤖 Ficha do Aluno Integrada:</span>
                                            <span style={{ color: 'var(--text-main)' }}>
                                                {profileDetails?.age ? `${profileDetails.age} anos` : ''} 
                                                {profileDetails?.gender ? ` | Gênero: ${profileDetails.gender.toUpperCase()}` : ''}
                                            </span>
                                            <span style={{ color: 'var(--text-muted)' }}>
                                                Última Bioimpedância ({new Date(lastBioimpedance.date).toLocaleDateString('pt-BR')}): 
                                                <strong> BF: {lastBioimpedance.bodyFat}%</strong> | 
                                                <strong> Músculo: {lastBioimpedance.skeletalMuscle}kg</strong>
                                            </span>
                                        </div>
                                    )}

                                    {!lastBioimpedance && profileDetails && (
                                        <div style={{ 
                                            background: 'rgba(255, 255, 255, 0.02)', 
                                            border: '1px solid rgba(255, 255, 255, 0.05)',
                                            borderRadius: '8px', 
                                            padding: '8px 12px',
                                            fontSize: '12px',
                                            color: 'var(--text-muted)'
                                        }}>
                                            👤 Ficha do Aluno: <strong>{profileDetails.age ? `${profileDetails.age} anos` : ''}</strong> | Gênero: <strong>{profileDetails.gender ? profileDetails.gender.toUpperCase() : ''}</strong>
                                        </div>
                                    )}

                                    {/* Objetivo */}
                                    <div className="editor-input-group">
                                        <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Objetivo do Treino</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                                            {[
                                                { id: 'hipertrofia', label: 'Hipertrofia 💪', desc: 'Ganho de massa muscular com foco em cadência controlada.' },
                                                { id: 'emagrecimento', label: 'Definição & Emagrecimento 🔥', desc: 'Maior número de repetições e menor tempo de intervalo.' },
                                                { id: 'resistencia', label: 'Resistência & TAF 📋', desc: 'Foco em condicionamento e resistência muscular localizada.' }
                                            ].map(opt => (
                                                <div 
                                                    key={opt.id}
                                                    onClick={() => setGenObjective(opt.id)}
                                                    style={{
                                                        background: genObjective === opt.id ? 'rgba(var(--accent-rgb), 0.08)' : 'rgba(255,255,255,0.02)',
                                                        border: genObjective === opt.id ? '2px solid var(--accent)' : '1px solid rgba(255,255,255,0.05)',
                                                        borderRadius: '10px',
                                                        padding: '10px 14px',
                                                        cursor: 'pointer',
                                                        transition: 'var(--transition)'
                                                    }}
                                                >
                                                    <strong style={{ fontSize: '13px', color: genObjective === opt.id ? 'var(--accent)' : '#fff', display: 'block' }}>{opt.label}</strong>
                                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{opt.desc}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Estilo de Equipamentos */}
                                    <div className="editor-input-group">
                                        <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Preferência de Aparelhos</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                                            {[
                                                { id: 'maquinas', label: 'Apenas Máquinas & Cabos 🤖', desc: 'Força o uso máximo de aparelhos guiados e polias.' },
                                                { id: 'calistenia', label: 'Calistenia (Peso Corporal) 🤸', desc: 'Rotinas usando barras, paralelas e o peso do próprio corpo.' },
                                                { id: 'misto', label: 'Equilibrado / Misto 混合', desc: 'Mistura máquinas com halteres e barras livres.' }
                                            ].map(opt => (
                                                <div 
                                                    key={opt.id}
                                                    onClick={() => setGenEquipment(opt.id)}
                                                    style={{
                                                        background: genEquipment === opt.id ? 'rgba(var(--accent-rgb), 0.08)' : 'rgba(255,255,255,0.02)',
                                                        border: genEquipment === opt.id ? '2px solid var(--accent)' : '1px solid rgba(255,255,255,0.05)',
                                                        borderRadius: '10px',
                                                        padding: '10px 14px',
                                                        cursor: 'pointer',
                                                        transition: 'var(--transition)'
                                                    }}
                                                >
                                                    <strong style={{ fontSize: '13px', color: genEquipment === opt.id ? 'var(--accent)' : '#fff', display: 'block' }}>{opt.label}</strong>
                                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{opt.desc}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Dificuldade */}
                                    <div className="editor-input-group">
                                        <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Dificuldade do Treino</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                            {[
                                                { id: 'medio', label: 'Nível Médio', desc: '3 séries por exercício' },
                                                { id: 'avancado', label: 'Nível Avançado', desc: '4 séries por exercício' }
                                            ].map(opt => (
                                                <div 
                                                    key={opt.id}
                                                    onClick={() => setGenLevel(opt.id)}
                                                    style={{
                                                        background: genLevel === opt.id ? 'rgba(var(--accent-rgb), 0.08)' : 'rgba(255,255,255,0.02)',
                                                        border: genLevel === opt.id ? '2px solid var(--accent)' : '1px solid rgba(255,255,255,0.05)',
                                                        borderRadius: '10px',
                                                        padding: '10px 12px',
                                                        cursor: 'pointer',
                                                        textAlign: 'center',
                                                        transition: 'var(--transition)'
                                                    }}
                                                >
                                                    <strong style={{ fontSize: '13px', color: genLevel === opt.id ? 'var(--accent)' : '#fff', display: 'block' }}>{opt.label}</strong>
                                                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{opt.desc}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Músculos Prioritários - Foco Múltiplo */}
                                    <div className="editor-input-group">
                                        <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Músculos de Interesse (Foco Extra)</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                            {[
                                                { id: 'peito', label: 'Peitoral (Peito)' },
                                                { id: 'costas', label: 'Dorsais (Costas)' },
                                                { id: 'ombros', label: 'Deltoides (Ombros)' },
                                                { id: 'bracos', label: 'Braços (Bíceps/Tríceps)' },
                                                { id: 'pernas', label: 'Coxas / Pernas' },
                                                { id: 'gluteos', label: 'Glúteos' },
                                                { id: 'core', label: 'Core / Abdominais' }
                                            ].map(item => {
                                                const isChecked = genFocusMuscles.includes(item.id);
                                                return (
                                                    <label 
                                                        key={item.id} 
                                                        style={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            gap: '8px', 
                                                            fontSize: '12px', 
                                                            color: isChecked ? 'var(--accent)' : 'var(--text-main)', 
                                                            cursor: 'pointer',
                                                            padding: '6px 8px',
                                                            background: isChecked ? 'rgba(var(--accent-rgb), 0.04)' : 'rgba(255,255,255,0.01)',
                                                            border: isChecked ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.04)',
                                                            borderRadius: '6px',
                                                            transition: 'var(--transition)'
                                                        }}
                                                    >
                                                        <input 
                                                            type="checkbox" 
                                                            checked={isChecked}
                                                            onChange={() => handleGenFocusMuscleChange(item.id)}
                                                            style={{ accentColor: 'var(--accent)', cursor: 'pointer' }}
                                                        />
                                                        {item.label}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <button 
                                        className="btn-primary"
                                        onClick={handleGenerateWorkout}
                                        style={{ marginTop: '10px', padding: '14px', background: 'var(--accent)', color: 'var(--text-dark)', fontWeight: 'bold' }}
                                    >
                                        ✨ Gerar Meu Treino ABC
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div style={{ textAlign: 'center', marginBottom: '5px' }}>
                                        <span style={{ fontSize: '40px' }}>🎉</span>
                                        <h4 style={{ fontSize: '16px', margin: '8px 0 4px', color: '#fff' }}>Treino ABC Gerado com Sucesso!</h4>
                                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                                            Revisar os exercícios selecionados pelo sistema antes de salvar:
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' }}>
                                        {['A', 'B', 'C'].map(letter => {
                                            const w = generatedWorkoutPlan[letter];
                                            return (
                                                <div key={letter} style={{ 
                                                    background: 'rgba(255,255,255,0.02)', 
                                                    border: '1px solid rgba(255,255,255,0.05)', 
                                                    borderRadius: '12px', 
                                                    padding: '14px',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '10px'
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '6px' }}>
                                                        <strong style={{ fontSize: '13px', color: 'var(--accent)' }}>{w.name}</strong>
                                                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{w.exercises.length} exercises</span>
                                                    </div>
                                                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{w.description}</p>
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                        {w.exercises.map((ex, exIdx) => (
                                                            <div key={exIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                                                                <span style={{ color: '#fff' }}>• {ex.name}</span>
                                                                <span style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                                                                    {ex.series}x{ex.reps} {ex.weight > 0 ? `(${ex.weight}kg)` : ''}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                        <button 
                                            className="btn-secondary"
                                            onClick={() => setGeneratedWorkoutPlan(null)}
                                            style={{ flex: 1, padding: '12px' }}
                                        >
                                            Voltar e Ajustar
                                        </button>
                                        <button 
                                            className="btn-primary"
                                            onClick={handleSaveGeneratedPlan}
                                            style={{ flex: 1.5, padding: '12px', background: 'var(--accent)', color: 'var(--text-dark)', fontWeight: 'bold' }}
                                        >
                                            📥 Salvar Planilha ABC
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {!generatedWorkoutPlan && (
                            <div style={{ padding: '15px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <button 
                                    className="btn-secondary" 
                                    onClick={() => { setShowGeneratorModal(false); setGeneratedWorkoutPlan(null); }}
                                    style={{ width: '100%', padding: '12px' }}
                                >
                                    Cancelar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
