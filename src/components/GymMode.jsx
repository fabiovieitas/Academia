import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import ExerciseBrowser from './ExerciseBrowser';

const EXERCISE_INSTRUCTIONS = {
    "Supino Reto": "1. Deite-se no banco reto com os olhos sob a barra.\n2. Segure a barra com pegada firme e retraia as escápulas.\n3. Desça a barra de forma controlada até tocar de leve o peito.\n4. Empurre verticalmente até estender os braços, concentrando a força no peitoral.",
    "Supino Inclinado com Halteres": "1. Ajuste o banco em inclinação de 30° a 45°.\n2. Apoie os halteres nas coxas e deite-se empurrando-os para cima.\n3. Desça os halteres alinhados ao peito superior, abrindo os cotovelos a ~45°.\n4. Empurre os halteres para cima e para o centro sem batê-los.",
    "Desenvolvimento com Halteres": "1. Sente-se apoiando a lombar no encosto.\n2. Suba os halteres na altura das orelhas com cotovelos em ~90°.\n3. Empurre os halteres acima da cabeça até esticar quase totalmente os braços.\n4. Retorne controlando o peso até a altura inicial.",
    "Elevação Lateral com Halteres": "1. Em pé, com o tronco ligeiramente inclinado à frente.\n2. Levante os halteres para os lados, mantendo cotovelos levemente flexionados.\n3. Suba até a linha dos ombros (não passe disso).\n4. Desça de forma lenta e evite usar impulsos (roubo).",
    "Extensão de tríceps no cabo alto": "1. Posicione-se à frente do cabo, com cotovelos colados ao corpo.\n2. Empurre a barra/corda para baixo estendendo os braços.\n3. Contraia o tríceps no final do movimento por 1 segundo.\n4. Retorne devagar permitindo o alongamento sem mover os cotovelos.",
    "Extensão de Tríceps deitado com Barra W Pegada Fechada atrás da Cabeça": "1. Deite-se no banco reto segurando a barra com os braços esticados.\n2. Flexione os cotovelos trazendo a barra na direção da testa ou ligeiramente atrás da cabeça.\n3. Mantenha os cotovelos apontados para cima, sem abri-los.\n4. Estenda os braços de volta ao topo.",
    "Puxada Alta": "1. Sente-se ajustando o suporte nos joelhos.\n2. Segure a barra na largura média-larga.\n3. Puxe a barra em direção ao peito superior, inclinando o tronco ligeiramente para trás e retraindo as escápulas.\n4. Controle a subida totalmente.",
    "Remada Curvada com Barra": "1. Fique em pé, afaste os pés na largura dos ombros e incline o tronco a ~45°.\n2. Segure a barra e puxe em direção ao abdômen inferior.\n3. Mantenha os cotovelos próximos ao corpo e contraia as costas.\n4. Estenda os braços de forma controlada.",
    "Rosca Direta com Barra": "1. Fique em pé com a coluna alinhada.\n2. Flexione os cotovelos trazendo a barra até o peito.\n3. Mantenha os cotovelos fixados na lateral do corpo (não os jogue para a frente).\n4. Retorne à posição inicial resistindo à descida.",
    "Rosca martelo": "1. Segure os halteres com pegada neutra (palmas voltadas para dentro).\n2. Flexione o cotovelo trazendo o halter para cima.\n3. Mantenha o punho firme e evite balançar o corpo.\n4. Alongue totalmente o bíceps na descida lenta.",
    "Agachamento Barra": "1. Posicione a barra sobre o trapézio, mantenha os pés na largura dos ombros.\n2. Inicie a descida projetando o quadril para trás, como se fosse sentar.\n3. Desça até as coxas ficarem paralelas ao chão (ou mais).\n4. Empurre o chão com os calcanhares para subir.",
    "Elevação Pélvica Com Barra": "1. Apoie as escápulas no banco e coloque a barra sobre o quadril.\n2. Posicione os pés firmes no chão.\n3. Eleve o quadril contraindo fortemente os glúteos.\n4. Segure 1s no topo e retorne devagar.",
    "Agachamento Búlgaro com Halteres": "1. Apoie um pé atrás em um banco estável e fique em posição de passada.\n2. Flexione o joelho da frente até formar ~90°.\n3. Mantenha o tronco levemente inclinado para frente para focar no glúteo/quadríceps.\n4. Empurre pelo calcanhar da frente para subir.",
    "Abdução de quadril com cabo": "1. Prenda a caneleira do cabo no tornozelo.\n2. Fique de lado para a polia apoiando-se com a mão.\n3. Afaste a perna lateralmente de forma controlada.\n4. Retorne resistindo à tração do cabo.",
    "Abdominal curto": "1. Deite-se de costas com joelhos dobrados e pés apoiados no chão.\n2. Coloque as mãos atrás da cabeça ou cruzadas no peito.\n3. Eleve apenas os ombros e a parte superior das costas do chão contraindo o abdômen.\n4. Expire na subida e desça de forma controlada.",
    "Barra Fixa com Pegada Supinada": "1. Segure a barra com as palmas voltadas para você (largura dos ombros).\n2. Puxe o corpo para cima até o queixo ultrapassar a barra.\n3. Mantenha os ombros baixos e as escápulas retraídas.\n4. Desça estendendo os braços de forma controlada.",
    "Flexão": "1. Posicione as mãos na largura dos ombros, mantenha o corpo reto como uma prancha.\n2. Flexione os cotovelos descendo o peito até quase tocar o chão.\n3. Não deixe o quadril desabar.\n4. Empurre o chão estendendo os braços.",
    "Paralela": "1. Segure nas barras paralelas com os braços esticados.\n2. Incline levemente o tronco à frente e dobre os joelhos se necessário.\n3. Desça flexionando os braços até os cotovelos atingirem 90°.\n4. Empurre firmemente de volta ao topo.",
    "Agachamento Pistol com TRX": "1. Segure as alças do TRX e mantenha uma perna elevada à frente.\n2. Desça empurrando o quadril para trás, usando o TRX para suporte de equilíbrio.\n3. Mantenha o joelho da perna de apoio alinhado com o pé.\n4. Suba empurrando pelo calcanhar."
};

const CATEGORY_INSTRUCTIONS = {
    "Peitoral": "Dica Geral: Mantenha o peito aberto, escápulas retraídas e contraídas contra o banco. Controle bem a descida (fase excêntrica) para maior estímulo mecânico.",
    "Costas": "Dica Geral: Inicie o movimento puxando pelos cotovelos e não apenas pelas mãos. Retraia as escápulas ('feche as costas') no pico de contração.",
    "Bíceps": "Dica Geral: Evite balançar os ombros ou usar o quadril (impulso). Mantenha o cotovelo fixo e faça a extensão completa para alongar a fibra muscular.",
    "Tríceps": "Dica Geral: Mantenha os cotovelos apontados para baixo e travados na mesma posição. Estenda os braços completamente contraindo o tríceps.",
    "Ombros": "Dica Geral: Evite encolher os ombros (usar trapézio excessivamente). Faça o movimento focado na porção do deltoide correspondente de forma controlada.",
    "Pernas": "Dica Geral: Mantenha o peso distribuído nos calcanhares. Alinhe os joelhos com a ponta dos pés (não deixe os joelhos caírem para dentro) e mantenha a lombar firme.",
    "Glúteos": "Dica Geral: Concentre a força nos calcanhares e empurre o quadril para cima. Faça uma contração máxima no pico do movimento por 1-2 segundos.",
    "Abdominais": "Dica Geral: Concentre a força na flexão da coluna e aproximação do esterno ao quadril. Expire todo o ar na subida para máxima contração.",
    "Calistenia": "Dica Geral: Mantenha o core ativado para estabilização do corpo. Realize o movimento de forma lenta e controlada, respeitando a amplitude anatômica."
};

function getExerciseInstruction(exerciseName, category) {
    if (EXERCISE_INSTRUCTIONS[exerciseName]) {
        return EXERCISE_INSTRUCTIONS[exerciseName];
    }
    const cleanCategory = category ? category.trim() : "";
    if (cleanCategory && CATEGORY_INSTRUCTIONS[cleanCategory]) {
        return `${CATEGORY_INSTRUCTIONS[cleanCategory]}\n\n(Dica padrão para exercícios de ${cleanCategory})`;
    }
    return "Mantenha a postura alinhada, execute o movimento de forma controlada nas duas fases (ida e volta) e respire de forma ritmada.";
}

export default function GymMode({ onFinish, onCancel }) {
    const { 
        activeWorkout, 
        saveActiveWorkoutState, 
        finishWorkout, 
        cancelWorkout,
        personalRecords,
        savePR,
        swapActiveWorkoutExercise,
        voiceNotifications,
        timeLeft,
        setTimeLeft,
        timerActive,
        setTimerActive,
        restTime,
        setRestTime,
        addFreeWorkoutExercise,
        history,
        speakExerciseStart
    } = useApp();
    
    const exercises = activeWorkout?.exercises || [];
    const currentExerciseIndex = activeWorkout?.currentExerciseIndex ?? 0;
    const currentExercise = exercises[currentExerciseIndex];
    const series = currentExercise?.series || [];
    const activeSetIdx = series.findIndex(s => !s.completed);
    const displaySetIdx = activeSetIdx !== -1 ? activeSetIdx : (series.length > 0 ? series.length - 1 : 0);
    
    const [durationTimer, setDurationTimer] = useState(0); // cronômetro do treino inteiro
    const [isSwapping, setIsSwapping] = useState(false);
    const [sessionPRs, setSessionPRs] = useState({});
    const [showFinishSummary, setShowFinishSummary] = useState(false);
    const [avgHeartRate, setAvgHeartRate] = useState('');
    const [maxHeartRate, setMaxHeartRate] = useState('');
    const [isFocusMode, setIsFocusMode] = useState(() => {
        return localStorage.getItem('fitlife_focus_mode') === 'true';
    });
    
    // Para adicionar exercícios em Treino Livre
    const [isFreeBrowserOpen, setIsFreeBrowserOpen] = useState(false);
    const [isInstructionsExpanded, setIsInstructionsExpanded] = useState(false);
    const [gifLoadError, setGifLoadError] = useState(false);

    // Estados do cronômetro específico da série
    const [activeSeriesTimer, setActiveSeriesTimer] = useState(0);
    const [isSeriesTimerRunning, setIsSeriesTimerRunning] = useState(false);
    const [timerSetIndex, setTimerSetIndex] = useState(0);

    const toggleFocusMode = () => {
        setIsFocusMode(prev => {
            const next = !prev;
            localStorage.setItem('fitlife_focus_mode', String(next));
            return next;
        });
    };

    // Efeito para contar o tempo total do treino
    useEffect(() => {
        const interval = setInterval(() => {
            if (activeWorkout) {
                const diff = Math.round((new Date() - new Date(activeWorkout.startTime)) / 1000);
                setDurationTimer(diff);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [activeWorkout]);



    // Efeito para contar o tempo da série ativa
    useEffect(() => {
        let interval = null;
        if (isSeriesTimerRunning) {
            interval = setInterval(() => {
                setActiveSeriesTimer(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isSeriesTimerRunning]);

    // Detecção se o exercício é baseado em tempo
    const isTimeBasedExercise = (name, notes = "") => {
        const nameLower = (name || "").toLowerCase();
        const notesLower = (notes || "").toLowerCase();
        return (
            notesLower.includes(" s.") || 
            notesLower.includes("segundos") ||
            notesLower.includes(" s ") ||
            nameLower.includes("prancha") || 
            nameLower.includes("plank") || 
            nameLower.includes("hold") || 
            nameLower.includes("sit") || 
            nameLower.includes("superman") || 
            nameLower.includes("lever") || 
            nameLower.includes("stand") ||
            nameLower.includes("canoa") ||
            nameLower.includes("body")
        );
    };

    const isCurrentTimeBased = false;

    // Sincronizar o índice da série que o cronômetro deve rodar por padrão
    useEffect(() => {
        if (currentExercise?.series) {
            const firstIncomplete = currentExercise.series.findIndex(s => !s.completed);
            setTimerSetIndex(firstIncomplete !== -1 ? firstIncomplete : 0);
            setActiveSeriesTimer(0);
            setIsSeriesTimerRunning(false);
        }
    }, [currentExerciseIndex, currentExercise?.series?.length]);

    const handleAdjustSet = (setIdx, field, amount) => {
        const currentSet = currentExercise.series[setIdx];
        if (!currentSet) return;
        
        let currentValue = parseFloat(currentSet[field]);
        if (isNaN(currentValue)) {
            // Se actual estiver vazio, tenta ler do planejado (reps ou weight)
            currentValue = parseFloat(currentSet[field === 'actualReps' ? 'reps' : 'weight']);
        }
        if (isNaN(currentValue)) {
            currentValue = 0;
        }
        
        let nextValue = currentValue + amount;
        if (field === 'actualReps') {
            nextValue = Math.round(nextValue);
        }
        nextValue = Math.max(0, nextValue);
        handleUpdateSet(setIdx, field, nextValue);
    };

    const handleToggleSeriesTimer = () => {
        setIsSeriesTimerRunning(prev => !prev);
    };

    const handleCompleteSeriesWithTime = (setIdx, timeValue) => {
        setIsSeriesTimerRunning(false);
        setActiveSeriesTimer(0);

        let isPRChecked = false;
        let prWeight = 0;
        let prReps = 0;

        const updatedExercises = exercises.map((ex, exIndex) => {
            if (exIndex === currentExerciseIndex) {
                const updatedSeries = ex.series.map((s, sIndex) => {
                    if (sIndex === setIdx) {
                        const nextCompleted = true; // Sempre marca como concluído
                        
                        // Inicia o timer de descanso!
                        setTimeLeft(restTime);
                        setTimerActive(true);
                        isPRChecked = true;
                        prWeight = parseFloat(s.actualWeight) || 0;
                        prReps = parseInt(timeValue) || 0;
                        
                        return { 
                            ...s, 
                            actualReps: timeValue, 
                            completed: nextCompleted 
                        };
                    }
                    return s;
                });
                return { ...ex, series: updatedSeries };
            }
            return ex;
        });

        saveActiveWorkoutState({
            ...activeWorkout,
            exercises: updatedExercises
        });

        // Verifica se bateu PR
        const exerciseName = currentExercise.name;
        const prevPR = personalRecords[exerciseName];
        const isNewPR = !prevPR || 
                        prWeight > prevPR.weight || 
                        (prWeight === prevPR.weight && prReps > prevPR.reps);

        if (isNewPR) {
            setSessionPRs(prev => ({
                ...prev,
                [exerciseName]: {
                    weight: prWeight,
                    reps: prReps,
                    prevWeight: prevPR ? prevPR.weight : null,
                    prevReps: prevPR ? prevPR.reps : null,
                    isFirst: !prevPR
                }
            }));
            savePR(exerciseName, prWeight, prReps);
        }
    };

    const handleStopSeriesTimer = (setIdx) => {
        handleCompleteSeriesWithTime(setIdx, activeSeriesTimer);
    };

    const handleResetSeriesTimer = () => {
        setIsSeriesTimerRunning(false);
        setActiveSeriesTimer(0);
    };


    const getLastSessionLoad = (exerciseName) => {
        if (!history || history.length === 0) return null;
        for (let i = history.length - 1; i >= 0; i--) {
            const hWorkout = history[i];
            if (hWorkout.exercises) {
                const found = hWorkout.exercises.find(ex => ex.name.toLowerCase() === exerciseName.toLowerCase());
                if (found && found.series && found.series.length > 0) {
                    return found.series;
                }
            }
        }
        return null;
    };

    // Resetar expansão das instruções ao mudar de exercício
    useEffect(() => {
        setIsInstructionsExpanded(false);
    }, [activeWorkout?.currentExerciseIndex]);

    // Resetar erro do gif ao mudar de exercício
    useEffect(() => {
        setGifLoadError(false);
    }, [activeWorkout?.currentExerciseIndex]);



    if (!activeWorkout) return null;

    // Se o treino livre estiver vazio, renderiza tela em branco com botão de adicionar exercício
    if (exercises.length === 0) {
        return (
            <div className="gym-mode-container" style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div className="gym-header">
                    <div>
                        <h3>{activeWorkout.workoutName}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                            Tempo total: {formatDuration(durationTimer)}
                        </p>
                    </div>
                    <div className="gym-timer-header">
                        ⏱️ {formatDuration(durationTimer)}
                    </div>
                </div>

                <div style={{ margin: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '48px' }}>🏋️‍♀️</span>
                    <h3>Seu Treino Livre está vazio</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '300px', margin: '0 auto 20px' }}>
                        Adicione exercícios da nossa biblioteca para montar seu treino na hora e começar a registrar!
                    </p>
                    <button 
                        className="btn-primary" 
                        onClick={() => setIsFreeBrowserOpen(true)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', margin: '0 auto', width: 'auto' }}
                    >
                        ➕ Adicionar Exercício
                    </button>
                </div>

                <button 
                    className="btn-danger" 
                    onClick={handleCancelWorkout}
                    style={{ marginTop: '15px', padding: '10px' }}
                >
                    ✕ Descartar Treino
                </button>

                {isFreeBrowserOpen && (
                    <ExerciseBrowser 
                        onSelect={(newEx) => {
                            addFreeWorkoutExercise(newEx);
                            setIsFreeBrowserOpen(false);
                        }}
                        onClose={() => setIsFreeBrowserOpen(false)}
                    />
                )}
            </div>
        );
    }

    // Avançar / Voltar exercício
    const handleNextExercise = () => {
        if (currentExerciseIndex < exercises.length - 1) {
            saveActiveWorkoutState({
                ...activeWorkout,
                currentExerciseIndex: currentExerciseIndex + 1
            });
            // Ativa o temporizador de descanso na transição para evitar ociosidade
            setTimeLeft(restTime);
            setTimerActive(true);
        }
    };

    const handlePrevExercise = () => {
        if (currentExerciseIndex > 0) {
            saveActiveWorkoutState({
                ...activeWorkout,
                currentExerciseIndex: currentExerciseIndex - 1
            });
        }
    };

    // Atualizar dados de uma série (peso / repetições / tempo) com propagação subsequente
    const handleUpdateSet = (setIndex, field, value) => {
        const updatedExercises = exercises.map((ex, exIndex) => {
            if (exIndex === currentExerciseIndex) {
                const updatedSeries = ex.series.map((s, sIndex) => {
                    // Série atual sendo modificada
                    if (sIndex === setIndex) {
                        return { ...s, [field]: value };
                    }
                    // Propagar para séries subsequentes se NÃO concluídas
                    if (sIndex > setIndex && !s.completed) {
                        return { ...s, [field]: value };
                    }
                    return s;
                });

                return { ...ex, series: updatedSeries };
            }
            return ex;
        });

        saveActiveWorkoutState({
            ...activeWorkout,
            exercises: updatedExercises
        });
    };

    // Toggle de conclusão de série
    const handleToggleSetComplete = (setIndex) => {
        let isPRChecked = false;
        let prWeight = 0;
        let prReps = 0;

        const updatedExercises = exercises.map((ex, exIndex) => {
            if (exIndex === currentExerciseIndex) {
                const updatedSeries = ex.series.map((s, sIndex) => {
                    if (sIndex === setIndex) {
                        const nextCompleted = !s.completed;
                        
                        // Se completou a série, inicia o timer de descanso!
                        if (nextCompleted) {
                            setTimeLeft(restTime);
                            setTimerActive(true);
                            isPRChecked = true;
                            prWeight = parseFloat(s.actualWeight) || 0;
                            prReps = parseInt(s.actualReps) || 0;
                        }
                        
                        return { ...s, completed: nextCompleted };
                    }
                    return s;
                });
                return { ...ex, series: updatedSeries };
            }
            return ex;
        });

        saveActiveWorkoutState({
            ...activeWorkout,
            exercises: updatedExercises
        });

        // Se marcou como concluído, verifica se bateu PR
        if (isPRChecked) {
            const exerciseName = currentExercise.name;
            const prevPR = personalRecords[exerciseName];
            const isNewPR = !prevPR || 
                            prWeight > prevPR.weight || 
                            (prWeight === prevPR.weight && prReps > prevPR.reps);

            if (isNewPR) {
                setSessionPRs(prev => ({
                    ...prev,
                    [exerciseName]: {
                        weight: prWeight,
                        reps: prReps,
                        prevWeight: prevPR ? prevPR.weight : null,
                        prevReps: prevPR ? prevPR.reps : null,
                        isFirst: !prevPR
                    }
                }));
                savePR(exerciseName, prWeight, prReps);
            }
        }
    };

    // Inserção automática de séries de aquecimento (Warm-up Sets)
    const handleAddWarmupSets = () => {
        if (!currentExercise) return;
        const targetW = currentExercise.targetWeight || currentExercise.weight || 0;
        
        const warmup1 = {
            reps: 10,
            weight: Math.round(targetW * 0.5),
            completed: false,
            actualReps: 10,
            actualWeight: Math.round(targetW * 0.5),
            isWarmup: true
        };
        const warmup2 = {
            reps: 5,
            weight: Math.round(targetW * 0.75),
            completed: false,
            actualReps: 5,
            actualWeight: Math.round(targetW * 0.75),
            isWarmup: true
        };
        
        const updatedSeries = [warmup1, warmup2, ...currentExercise.series];
        const updatedExercises = exercises.map((ex, idx) => {
            if (idx === currentExerciseIndex) {
                return { ...ex, series: updatedSeries };
            }
            return ex;
        });
        
        saveActiveWorkoutState({
            ...activeWorkout,
            exercises: updatedExercises
        });
        alert('Duas séries de aquecimento (50% e 75% da carga alvo) foram adicionadas no início deste exercício!');
    };

    // Ajustar tempo do cronômetro (+15s / -15s)
    const handleAdjustTimer = (amount) => {
        setTimeLeft(prev => Math.max(0, prev + amount));
    };

    // Pular cronômetro de descanso (sem auto-avançar)
    const handleSkipRest = () => {
        setTimerActive(false);
        setTimeLeft(0);
    };

    // Finalizar o treino
    const handleFinishWorkout = () => {
        setShowFinishSummary(true);
    };

    // Confirmação final de encerramento do treino
    const handleConfirmFinish = () => {
        const cardioStats = avgHeartRate || maxHeartRate ? {
            avgHR: parseInt(avgHeartRate) || null,
            maxHR: parseInt(maxHeartRate) || null
        } : null;
        finishWorkout(cardioStats);
        onFinish();
    };

    // Cancelar/Descartar o treino
    const handleCancelWorkout = () => {
        if (window.confirm('Tem certeza que deseja cancelar o treino atual? Todo o progresso de hoje será perdido.')) {
            cancelWorkout();
            onCancel();
        }
    };

    // Formata o cronômetro do treino para hh:mm:ss
    const formatDuration = (totalSecs) => {
        const hrs = Math.floor(totalSecs / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;
        
        const pad = (n) => n.toString().padStart(2, '0');
        if (hrs > 0) {
            return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
        }
        return `${pad(mins)}:${pad(secs)}`;
    };

    const gifUrl = currentExercise?.path ? encodeURI(`https://www.gifdotreino.com/${currentExercise.path}`) : '';
    const category = currentExercise?.path && currentExercise.path.includes('/') ? currentExercise.path.split('/')[1] : 'Musculação';

    // Dados para desenhar o timer circular
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    const progress = timeLeft / restTime;
    const strokeDashoffset = circumference - (progress * circumference);

    const pr = currentExercise ? personalRecords[currentExercise.name] : null;
    const maxSessionWeight = currentExercise?.series ? Math.max(...currentExercise.series.map(s => parseFloat(s.actualWeight) || 0), 0) : 0;
    const targetW = currentExercise?.targetWeight || 0;
    const targetPercent = targetW > 0 ? Math.min(100, Math.round((maxSessionWeight / targetW) * 100)) : 0;

    const handleSwapExercise = (newEx) => {
        const savePermanently = window.confirm(
            `Você escolheu substituir este exercício por "${newEx.name}".\n\nDeseja salvar essa substituição permanentemente no seu treino original?`
        );
        swapActiveWorkoutExercise(currentExerciseIndex, newEx, savePermanently);
        setIsSwapping(false);
    };

    if (showFinishSummary) {
        const prCount = Object.keys(sessionPRs).length;
        
        return (
            <div className="gym-mode-container" style={{
                textAlign: 'center',
                padding: '40px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh'
            }}>
                <div style={{
                    fontSize: '60px',
                    marginBottom: '20px',
                    animation: 'pulse 2s infinite'
                }}>
                    🏆
                </div>
                
                <h1 style={{
                    fontSize: '28px',
                    fontWeight: '800',
                    background: 'linear-gradient(to right, #fff, var(--accent))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '10px'
                }}>
                    Treino Concluído!
                </h1>
                
                <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '15px',
                    marginBottom: '30px',
                    maxWidth: '300px'
                }}>
                    Você completou com sucesso a rotina <strong>{activeWorkout.workoutName}</strong>.
                </p>

                {/* Caixa de Estatísticas Rápidas */}
                <div style={{
                    display: 'flex',
                    gap: '15px',
                    width: '100%',
                    maxWidth: '360px',
                    marginBottom: '30px'
                }}>
                    <div style={{
                        flex: 1,
                        background: 'var(--bg-secondary)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '16px',
                        padding: '15px',
                        textAlign: 'center'
                    }}>
                        <span style={{ fontSize: '20px', display: 'block', marginBottom: '5px' }}>⏱️</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>Duração</span>
                        <strong style={{ fontSize: '18px', color: '#fff' }}>{Math.round(durationTimer / 60)} min</strong>
                    </div>
                    <div style={{
                        flex: 1,
                        background: 'var(--bg-secondary)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '16px',
                        padding: '15px',
                        textAlign: 'center'
                    }}>
                        <span style={{ fontSize: '20px', display: 'block', marginBottom: '5px' }}>💪</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block' }}>Exercícios</span>
                        <strong style={{ fontSize: '18px', color: '#fff' }}>
                            {exercises.filter(ex => ex.series.some(s => s.completed)).length} / {exercises.length}
                        </strong>
                    </div>
                </div>

                {/* Recordes Pessoais Superados */}
                <div style={{
                    width: '100%',
                    maxWidth: '360px',
                    background: 'rgba(var(--accent-rgb), 0.03)',
                    border: '1px solid rgba(var(--accent-rgb), 0.1)',
                    borderRadius: '20px',
                    padding: '20px',
                    marginBottom: '35px',
                    textAlign: 'left'
                }}>
                    <h3 style={{
                        fontSize: '15px',
                        color: 'var(--accent)',
                        marginBottom: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: '700'
                    }}>
                        ✨ {prCount > 0 ? `${prCount} Recordes Superados!` : 'Consistência é tudo!'}
                    </h3>
                    
                    {prCount > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {Object.entries(sessionPRs).map(([exName, record]) => (
                                <div key={exName} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: '13px',
                                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                                    paddingBottom: '8px'
                                }}>
                                    <div>
                                        <div style={{ color: '#fff', fontWeight: '600' }}>{exName}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                                            {record.isFirst ? 'Primeiro registro!' : `Anterior: ${record.prevWeight}kg x ${record.prevReps}`}
                                        </div>
                                    </div>
                                    <div style={{
                                        color: '#34d399',
                                        fontWeight: '700',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        🏆 {record.weight}kg x {record.reps}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                            Nenhum recorde de carga superado hoje, mas o treino foi executado com sucesso! Cada repetição conta para o progresso.
                        </p>
                    )}
                </div>

                {/* Cardio Stats Logger */}
                <div style={{
                    width: '100%',
                    maxWidth: '360px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '20px',
                    padding: '20px',
                    marginBottom: '25px',
                    textAlign: 'left'
                }}>
                    <h3 style={{ fontSize: '14px', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        ❤️ Frequência Cardíaca (Cardio)
                    </h3>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '5px' }}>Média (BPM)</label>
                            <input 
                                type="number" 
                                className="input-field" 
                                placeholder="Ex: 135"
                                value={avgHeartRate}
                                onChange={e => setAvgHeartRate(e.target.value)}
                                style={{ padding: '8px 12px', fontSize: '14px' }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '5px' }}>Máxima (BPM)</label>
                            <input 
                                type="number" 
                                className="input-field" 
                                placeholder="Ex: 165"
                                value={maxHeartRate}
                                onChange={e => setMaxHeartRate(e.target.value)}
                                style={{ padding: '8px 12px', fontSize: '14px' }}
                            />
                        </div>
                    </div>
                </div>

                <button className="btn-primary" onClick={handleConfirmFinish} style={{ maxWidth: '360px' }}>
                    Concluir e Salvar
                </button>
            </div>
        );
    }

    const lastLoadSeries = getLastSessionLoad(currentExercise.name);

    if (isFocusMode) {
        const activeSet = series[displaySetIdx] || { reps: 10, weight: 0, completed: false, actualReps: 10, actualWeight: 0 };
        const prevSet = lastLoadSeries && lastLoadSeries[displaySetIdx];

        const handleAdjustActiveSet = (field, amount) => {
            if (!activeSet) return;
            
            let currentValue = parseFloat(activeSet[field]);
            if (isNaN(currentValue)) {
                currentValue = parseFloat(activeSet[field === 'actualReps' ? 'reps' : 'weight']);
            }
            if (isNaN(currentValue)) {
                currentValue = 0;
            }
            
            let nextValue = currentValue + amount;
            if (field === 'actualReps') {
                nextValue = Math.round(nextValue);
            }
            nextValue = Math.max(0, nextValue);
            handleUpdateSet(displaySetIdx, field, nextValue);
        };

        const isAllDone = series.length > 0 && series.every(s => s.completed);

        return (
            <div className="gym-mode-container theme-focus" style={{ background: '#0a0b0e', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#fff', padding: '15px' }}>
                {/* Header Superior do Modo Foco */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                    <button 
                        onClick={toggleFocusMode}
                        style={{
                            background: 'rgba(var(--accent-rgb), 0.15)',
                            border: '1px solid var(--accent)',
                            color: 'var(--accent)',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        🧘 Sair do Foco
                    </button>
                    <div style={{ fontFamily: 'monospace', fontSize: '15px', color: 'var(--accent)', fontWeight: 'bold' }}>
                        ⏱️ {formatDuration(durationTimer)}
                    </div>
                </div>

                {/* Nome do Exercício */}
                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 4px 0', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{currentExercise.name}</h2>
                    <span style={{ fontSize: '12px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px' }}>{category}</span>
                </div>

                {/* GIF Limpo e Compacto */}
                <div style={{ display: 'flex', justifyContent: 'center', background: 'var(--bg-secondary)', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.04)', marginBottom: '15px', position: 'relative', height: '160px' }}>
                    {(!gifUrl || gifLoadError) ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '13px' }}>
                            💪 Guia técnico nas instruções comuns
                        </div>
                    ) : (
                        <img src={gifUrl} alt={currentExercise.name} style={{ height: '100%', width: 'auto', objectFit: 'contain' }} onError={() => setGifLoadError(true)} />
                    )}
                </div>

                {/* Progresso de Séries no Modo Foco */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
                    {currentExercise.series.map((s, idx) => (
                        <div 
                            key={idx}
                            style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: '700',
                                transition: 'var(--transition)',
                                background: idx === displaySetIdx 
                                    ? 'var(--accent)' 
                                    : (s.completed ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255,255,255,0.05)'),
                                color: idx === displaySetIdx 
                                    ? 'var(--text-dark)' 
                                    : (s.completed ? '#34d399' : 'var(--text-muted)'),
                                border: idx === displaySetIdx 
                                    ? '2px solid #fff' 
                                    : (s.completed ? '1px solid rgba(52, 211, 153, 0.4)' : '1px solid rgba(255,255,255,0.08)'),
                                boxShadow: idx === displaySetIdx ? 'var(--shadow-glow)' : 'none'
                            }}
                        >
                            {s.isWarmup ? 'AQ' : idx + 1}
                        </div>
                    ))}
                </div>

                {/* Painel Central: Série Ativa e Inputs Gigantes */}
                <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '20px', gap: '20px', marginBottom: '20px', background: 'rgba(18, 20, 28, 0.95)' }}>
                    <div style={{ textAlign: 'center' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '4px' }}>
                            Série Ativa
                        </span>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#fff' }}>
                            {activeSet.isWarmup ? 'Aquecimento' : `Série ${displaySetIdx + 1}`} {activeSet.completed && '✓ (Concluída)'}
                        </h3>
                    </div>

                    {/* Mostra carga anterior */}
                    {prevSet ? (
                        <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--accent)', background: 'rgba(var(--accent-rgb), 0.05)', padding: '6px 12px', borderRadius: '8px', fontWeight: '600' }}>
                            ⏮️ Anterior: {isCurrentTimeBased ? `${prevSet.actualReps} s` : `${prevSet.actualWeight} kg x ${prevSet.actualReps} reps`}
                        </div>
                    ) : pr ? (
                        <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--accent)', background: 'rgba(var(--accent-rgb), 0.05)', padding: '6px 12px', borderRadius: '8px', fontWeight: '600' }}>
                            🏆 Recorde Pessoal: {isCurrentTimeBased ? `${pr.reps} s` : `${pr.weight} kg x ${pr.reps} reps`}
                        </div>
                    ) : null}

                    {isCurrentTimeBased ? (
                        /* Modo Foco - Seletor / Cronômetro de Exercício Baseado em Tempo */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                            {/* Cronômetro Visual Gigante */}
                            <div style={{
                                fontSize: '42px',
                                fontFamily: 'monospace',
                                fontWeight: '800',
                                color: isSeriesTimerRunning ? 'var(--accent)' : '#fff',
                                textShadow: isSeriesTimerRunning ? '0 0 15px rgba(var(--accent-rgb), 0.4)' : 'none',
                                background: 'var(--bg-tertiary)',
                                padding: '15px 30px',
                                borderRadius: '16px',
                                border: '1px solid rgba(255,255,255,0.06)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                ⏱️ {activeSeriesTimer}s
                            </div>

                            {/* Controles do Cronômetro de Série */}
                            <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '280px' }}>
                                <button
                                    type="button"
                                    onClick={handleToggleSeriesTimer}
                                    style={{
                                        flex: 2,
                                        padding: '12px',
                                        borderRadius: '12px',
                                        background: isSeriesTimerRunning ? '#eab308' : '#34d399',
                                        color: '#000',
                                        fontWeight: '700',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    {isSeriesTimerRunning ? '⏸️ Pausar' : '▶️ Iniciar'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleResetSeriesTimer}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        borderRadius: '12px',
                                        background: 'rgba(255,255,255,0.06)',
                                        color: '#fff',
                                        fontWeight: '600',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        cursor: 'pointer',
                                        fontSize: '14px'
                                    }}
                                >
                                    🔄 Zerar
                                </button>
                            </div>

                            {/* Campo de edição manual do tempo */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center', marginTop: '10px', width: '100%' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tempo Manual (s)</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <button 
                                        type="button"
                                        onClick={() => handleAdjustActiveSet('actualReps', -1)}
                                        style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '16px' }}
                                    >
                                        -
                                    </button>
                                    <input 
                                        type="number" 
                                        value={activeSet.actualReps ?? ''} 
                                        onChange={e => handleUpdateSet(displaySetIdx, 'actualReps', e.target.value)}
                                        disabled={activeSet.completed}
                                        style={{ width: '100px', background: 'var(--bg-tertiary)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '24px', fontWeight: '800', textAlign: 'center', padding: '8px', borderRadius: '12px' }}
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => handleAdjustActiveSet('actualReps', 1)}
                                        style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: '16px' }}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Botão de salvar e concluir */}
                            <button
                                type="button"
                                onClick={() => handleCompleteSeriesWithTime(displaySetIdx, activeSeriesTimer)}
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    borderRadius: '12px',
                                    background: 'var(--accent)',
                                    color: 'var(--text-dark)',
                                    fontWeight: '800',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    marginTop: '10px',
                                    boxShadow: 'var(--shadow-glow)'
                                }}
                            >
                                ⏱️ Parar & Concluir Série
                            </button>
                        </div>
                    ) : (
                        /* Modo Foco - Seletores Tradicionais de Musculação */
                        <>
                            {/* Input Gigante de Peso */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'center' }}>Carga (kg)</label>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                                    <button 
                                        type="button"
                                        onClick={() => handleAdjustActiveSet('actualWeight', -5)}
                                        style={{ width: '55px', height: '55px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '18px', fontWeight: 'bold' }}
                                    >
                                        -5
                                    </button>
                                    <input 
                                        type="number" 
                                        value={activeSet.actualWeight ?? ''} 
                                        onChange={e => handleUpdateSet(displaySetIdx, 'actualWeight', e.target.value)}
                                        disabled={activeSet.completed}
                                        style={{ width: '80px', background: 'var(--bg-tertiary)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '28px', fontWeight: '800', textAlign: 'center', padding: '10px', borderRadius: '12px' }}
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => handleAdjustActiveSet('actualWeight', 5)}
                                        style={{ width: '55px', height: '55px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '18px', fontWeight: 'bold' }}
                                    >
                                        +5
                                    </button>
                                </div>
                            </div>

                            {/* Input Gigante de Repetições (Apenas de 1 em 1 conforme pedido) */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'center' }}>Repetições</label>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                                    <button 
                                        type="button"
                                        onClick={() => handleAdjustActiveSet('actualReps', -1)}
                                        style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '20px' }}
                                    >
                                        -
                                    </button>
                                    <input 
                                        type="number" 
                                        value={activeSet.actualReps ?? ''} 
                                        onChange={e => handleUpdateSet(displaySetIdx, 'actualReps', e.target.value)}
                                        disabled={activeSet.completed}
                                        style={{ width: '80px', background: 'var(--bg-tertiary)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '28px', fontWeight: '800', textAlign: 'center', padding: '10px', borderRadius: '12px' }}
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => handleAdjustActiveSet('actualReps', 1)}
                                        style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '20px' }}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Botão Gigante de Conclusão de Série */}
                            <button 
                                type="button"
                                onClick={() => handleToggleSetComplete(displaySetIdx)}
                                style={{
                                    width: '100%',
                                    padding: '20px',
                                    borderRadius: '16px',
                                    background: activeSet.completed ? 'rgba(239, 68, 68, 0.15)' : 'var(--accent)',
                                    color: activeSet.completed ? '#f87171' : 'var(--text-dark)',
                                    fontSize: '18px',
                                    fontWeight: '800',
                                    border: activeSet.completed ? '1px solid rgba(239, 68, 68, 0.3)' : 'none',
                                    boxShadow: activeSet.completed ? 'none' : 'var(--shadow-glow)',
                                    cursor: 'pointer',
                                    marginTop: '10px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}
                            >
                                {activeSet.completed ? 'Desfazer Série' : 'Concluir Série'}
                            </button>
                        </>
                    )}
                </div>

                {/* Controles Inferiores no Modo Foco */}
                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
                    <button 
                        className="btn-secondary" 
                        onClick={handlePrevExercise}
                        disabled={currentExerciseIndex === 0}
                        style={{ flex: 1, padding: '10px', fontSize: '14px', opacity: currentExerciseIndex === 0 ? 0.3 : 1 }}
                    >
                        ◀ Voltar Exercício
                    </button>
                    
                    {currentExerciseIndex === exercises.length - 1 && isAllDone ? (
                        <button className="btn-primary" onClick={handleFinishWorkout} style={{ flex: 1, padding: '10px', fontSize: '14px' }}>
                            🏁 Finalizar Treino
                        </button>
                    ) : (
                        <button 
                            className="btn-primary" 
                            onClick={handleNextExercise} 
                            style={{ flex: 1, padding: '10px', fontSize: '14px' }}
                        >
                            Próximo Exercício ▶
                        </button>
                    )}
                </div>

                {/* Renderizar Timer de Descanso se estiver ativo */}
                {timerActive && (
                    <div className="timer-overlay" style={{ zIndex: 1100 }}>
                        <h2 style={{ marginBottom: '10px' }}>Descanso</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                            Respire fundo e recupere o fôlego
                        </p>

                        <div className="circular-timer-box">
                            <svg>
                                <circle className="bg" cx="100" cy="100" r={radius} />
                                <circle 
                                    className="fg" 
                                    cx="100" 
                                    cy="100" 
                                    r={radius}
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                />
                            </svg>
                            <div className="timer-number">{timeLeft}s</div>
                        </div>

                        <div className="timer-exercise-next" style={{ textAlign: 'center', marginBottom: '15px' }}>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                {activeSetIdx === -1 || activeSetIdx >= series.length - 1 ? 'Próximo Exercício' : 'Próxima Série'}
                            </p>
                            <h4 style={{ fontSize: '18px', color: '#fff', fontWeight: 'bold', marginBottom: '10px' }}>
                                {activeSetIdx === -1 || activeSetIdx >= series.length - 1
                                    ? (exercises[currentExerciseIndex + 1]?.name || 'Finalizar!') 
                                    : `${currentExercise.name} (Série ${activeSetIdx + 1})`}
                            </h4>
                        </div>

                        {/* Exercícios restantes */}
                        {exercises.slice(currentExerciseIndex + 1).length > 0 ? (
                            <div className="remaining-exercises-list" style={{ marginBottom: '20px', textAlign: 'center', width: '100%', maxWidth: '280px' }}>
                                <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                                    Exercícios Restantes ({exercises.slice(currentExerciseIndex + 1).length}):
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '80px', overflowY: 'auto', padding: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                    {exercises.slice(currentExerciseIndex + 1).map((ex, idx) => (
                                        <div key={idx} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {idx + currentExerciseIndex + 2}. {ex.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div style={{ marginBottom: '20px', fontSize: '12px', color: 'var(--accent)', fontWeight: '600' }}>
                                🎉 Este é o último exercício do treino!
                            </div>
                        )}

                        <div className="timer-adjust-row" style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
                            <button className="timer-adjust-btn" onClick={() => handleAdjustTimer(-15)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>-15s</button>
                            <button className="timer-adjust-btn" onClick={() => handleAdjustTimer(15)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>+15s</button>
                        </div>

                        <button 
                            className="btn-primary" 
                            onClick={handleSkipRest}
                            style={{ maxWidth: '200px' }}
                        >
                            Pular Descanso
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="gym-mode-container">
            <div className="gym-header">
                <div>
                    <h3>{activeWorkout.workoutName}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                        Tempo total: {formatDuration(durationTimer)}
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                        onClick={toggleFocusMode}
                        style={{
                            background: 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'var(--text-muted)',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: '600',
                            transition: 'var(--transition)'
                        }}
                    >
                        🧘 Foco
                    </button>
                    <div className="gym-timer-header">
                        ⏱️ {formatDuration(durationTimer)}
                    </div>
                </div>
            </div>

            {/* Stepper Superior */}
            <div className="gym-step-indicator">
                {exercises.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`step-bar ${idx < currentExerciseIndex ? 'completed' : ''} ${idx === currentExerciseIndex ? 'active' : ''}`}
                    />
                ))}
            </div>

            {/* Visualizador de GIF */}
            <div className="gif-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', background: 'var(--bg-tertiary)', position: 'relative' }}>
                {(!gifUrl || gifLoadError) ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '30px 20px',
                        textAlign: 'center',
                        gap: '12px',
                        width: '100%'
                    }}>
                        <span style={{ fontSize: '40px' }}>🏋️‍♂️</span>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>Demonstração Visual</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '240px', lineHeight: '1.4' }}>
                            Postura e execução detalhadas disponíveis na nota de instrução abaixo.
                        </div>
                    </div>
                ) : (
                    <img 
                        src={gifUrl} 
                        alt={currentExercise.name} 
                        onLoad={() => setGifLoadError(false)}
                        onError={() => setGifLoadError(true)}
                    />
                )}
                <div className="exercise-name-overlay">
                    <h2>{currentExercise.name}</h2>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                        <p>{category}</p>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                                className="btn-warmup"
                                onClick={handleAddWarmupSets}
                                style={{
                                    background: 'rgba(var(--accent-rgb), 0.2)',
                                    border: '1px solid rgba(var(--accent-rgb), 0.3)',
                                    color: 'var(--accent)',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    backdropFilter: 'blur(4px)',
                                    transition: 'var(--transition)'
                                }}
                            >
                                🏋️ Aquecer
                            </button>
                            <button 
                                className="btn-swap-exercise"
                                onClick={() => setIsSwapping(true)}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.15)',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    backdropFilter: 'blur(4px)',
                                    transition: 'var(--transition)'
                                }}
                            >
                                🔄 Substituir
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Como Fazer Card */}
            <div 
                onClick={() => setIsInstructionsExpanded(!isInstructionsExpanded)}
                style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    padding: '12px 15px',
                    marginBottom: '15px',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        💡 Como fazer este exercício
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                        {isInstructionsExpanded ? 'Recolher ▲' : 'Expandir ▼'}
                    </span>
                </div>
                {isInstructionsExpanded && (
                    <div style={{ 
                        marginTop: '10px', 
                        fontSize: '13px', 
                        color: 'var(--text-muted)', 
                        lineHeight: '1.6',
                        borderTop: '1px solid rgba(255,255,255,0.03)',
                        paddingTop: '10px',
                        whiteSpace: 'pre-line'
                    }}>
                        {getExerciseInstruction(currentExercise.name, category)}
                    </div>
                )}
            </div>

            {currentExercise.notes && (
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderLeft: '3px solid var(--accent)',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                    marginBottom: '15px'
                }}>
                    <strong>Nota:</strong> {currentExercise.notes}
                </div>
            )}

            {targetW > 0 && (
                <div style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '12px',
                    padding: '12px',
                    marginBottom: '15px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Meta de Carga:</span>
                        <strong style={{ color: 'var(--accent)' }}>{maxSessionWeight} kg / {targetW} kg ({targetPercent}%)</strong>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${targetPercent}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, rgba(var(--accent-rgb), 0.7) 0%, var(--accent) 100%)',
                            borderRadius: '3px',
                            transition: 'width 0.5s ease-out'
                        }} />
                    </div>
                </div>
            )}

            {/* Cronômetro Compacto para Exercícios de Tempo no Modo Clássico */}
            {isCurrentTimeBased && (
                <div style={{
                    background: 'rgba(18, 20, 28, 0.9)',
                    border: '1px solid rgba(var(--accent-rgb), 0.15)',
                    borderRadius: '16px',
                    padding: '15px',
                    marginBottom: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent)' }}>
                            ⏱️ Cronômetro da Série {timerSetIndex + 1}
                        </span>
                        <span style={{ fontSize: '20px', fontFamily: 'monospace', fontWeight: '800', color: '#fff' }}>
                            {activeSeriesTimer}s
                        </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', width: '100%' }}>
                        <button
                            type="button"
                            onClick={handleToggleSeriesTimer}
                            style={{
                                flex: 2,
                                padding: '8px 12px',
                                borderRadius: '8px',
                                background: isSeriesTimerRunning ? '#eab308' : '#34d399',
                                color: '#000',
                                fontWeight: '700',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            {isSeriesTimerRunning ? '⏸️ Pausar' : '▶️ Iniciar'}
                        </button>
                        <button
                            type="button"
                            onClick={handleResetSeriesTimer}
                            style={{
                                flex: 1,
                                padding: '8px 12px',
                                borderRadius: '8px',
                                background: 'rgba(255,255,255,0.06)',
                                color: '#fff',
                                fontWeight: '600',
                                border: '1px solid rgba(255,255,255,0.1)',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            Zerar
                        </button>
                        <button
                            type="button"
                            onClick={() => handleCompleteSeriesWithTime(timerSetIndex, activeSeriesTimer)}
                            style={{
                                flex: 2,
                                padding: '8px 12px',
                                borderRadius: '8px',
                                background: 'var(--accent)',
                                color: 'var(--text-dark)',
                                fontWeight: '700',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            Salvar & OK
                        </button>
                    </div>
                </div>
            )}

            {/* Lista de Séries */}
            <div className="gym-series-panel">
                {pr ? (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px',
                        color: 'var(--accent)',
                        background: 'rgba(var(--accent-rgb), 0.05)',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        marginBottom: '10px',
                        fontWeight: '600'
                    }}>
                        🏆 Recorde Pessoal: {isCurrentTimeBased ? `${pr.reps} s` : `${pr.weight} kg x ${pr.reps} reps`}
                    </div>
                ) : (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                        padding: '6px 12px',
                        marginBottom: '10px'
                    }}>
                        💪 Nenhum recorde registrado ainda
                    </div>
                )}
                
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isCurrentTimeBased ? '45px 1fr 60px' : '45px 1.4fr 1fr 60px',
                    padding: '0 15px 5px',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    <div>Série</div>
                    {!isCurrentTimeBased && <div style={{ textAlign: 'center' }}>Peso (kg)</div>}
                    <div style={{ textAlign: 'center' }}>{isCurrentTimeBased ? 'Tempo (s)' : 'Reps'}</div>
                    <div style={{ textAlign: 'right' }}>Status</div>
                </div>

                {currentExercise.series.map((set, setIdx) => (
                    <div 
                        key={setIdx} 
                        className={`set-row-item ${set.completed ? 'done' : ''} ${set.isWarmup ? 'warmup-row' : ''}`}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: isCurrentTimeBased ? '45px 1fr 60px' : '45px 1.4fr 1fr 60px',
                            alignItems: 'center'
                        }}
                    >
                        <div className="set-number" style={set.isWarmup ? {
                            background: 'rgba(234, 179, 8, 0.15)',
                            color: '#eab308',
                            border: '1px solid rgba(234, 179, 8, 0.3)'
                        } : {}}>
                            {set.isWarmup ? 'AQ' : setIdx + 1}
                        </div>
                        
                        {/* Peso (Ocultado em exercícios de tempo) */}
                        {!isCurrentTimeBased && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%', justifyContent: 'center' }}>
                                    <button type="button" className="adjust-btn btn-mini" onClick={() => handleAdjustSet(setIdx, 'actualWeight', -5)} disabled={set.completed}>-5</button>
                                    <div className="set-input-wrap" style={{ width: '52px', padding: '4px 6px' }}>
                                        <input 
                                            type="number" 
                                            value={set.actualWeight ?? ''} 
                                            onChange={e => handleUpdateSet(setIdx, 'actualWeight', e.target.value)}
                                            disabled={set.completed}
                                            style={{ fontSize: '13px' }}
                                        />
                                        <span>kg</span>
                                    </div>
                                    <button type="button" className="adjust-btn btn-mini" onClick={() => handleAdjustSet(setIdx, 'actualWeight', 5)} disabled={set.completed}>+5</button>
                                </div>
                                {lastLoadSeries && lastLoadSeries[setIdx] && (
                                    <span style={{ fontSize: '9px', color: 'var(--text-muted)', textAlign: 'center' }}>
                                        Ant: {lastLoadSeries[setIdx].actualWeight}kg
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Repetições ou Tempo */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%', justifyContent: 'center' }}>
                                <button type="button" className="adjust-btn btn-mini" onClick={() => handleAdjustSet(setIdx, 'actualReps', -1)} disabled={set.completed}>-</button>
                                <div className="set-input-wrap" style={{ width: '60px', padding: '4px 6px' }}>
                                    <input 
                                        type="number" 
                                        value={set.actualReps ?? ''} 
                                        onChange={e => handleUpdateSet(setIdx, 'actualReps', e.target.value)}
                                        disabled={set.completed}
                                        style={{ fontSize: '13px' }}
                                    />
                                    <span>{isCurrentTimeBased ? 'seg' : 'reps'}</span>
                                </div>
                                <button type="button" className="adjust-btn btn-mini" onClick={() => handleAdjustSet(setIdx, 'actualReps', 1)} disabled={set.completed}>+</button>
                            </div>
                            {lastLoadSeries && lastLoadSeries[setIdx] && (
                                <span style={{ fontSize: '9px', color: 'var(--text-muted)', textAlign: 'center' }}>
                                    Ant: {lastLoadSeries[setIdx].actualReps}{isCurrentTimeBased ? 's' : ' r'}
                                </span>
                            )}
                        </div>

                        {/* Status Checkmark */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div 
                                className={`checkbox-completed ${set.completed ? 'checked' : ''}`}
                                onClick={() => handleToggleSetComplete(setIdx)}
                            >
                                {set.completed ? '✓' : ''}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ROTEIRO DO TREINO */}
            <div style={{
                background: 'var(--bg-secondary)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '16px',
                padding: '15px',
                marginTop: '25px',
                marginBottom: '15px'
            }}>
                <h3 style={{ fontSize: '15px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📋 Roteiro do Treino <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'normal' }}>- Toque para ir ao exercício</span>
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {exercises.map((ex, idx) => {
                        const isCurrent = idx === currentExerciseIndex;
                        const completedCount = ex.series.filter(s => s.completed).length;
                        const totalCount = ex.series.length;
                        const isAllDone = totalCount > 0 && completedCount === totalCount;
                        const isAnyDone = completedCount > 0 && completedCount < totalCount;
                        
                        let statusColor = 'rgba(255,255,255,0.1)';
                        let statusText = 'Não iniciado';
                        let statusDot = '⚪';
                        
                        if (isAllDone) {
                            statusColor = 'rgba(52, 211, 153, 0.15)';
                            statusText = 'Concluído';
                            statusDot = '🟢';
                        } else if (isAnyDone) {
                            statusColor = 'rgba(234, 179, 8, 0.15)';
                            statusText = `${completedCount}/${totalCount} séries`;
                            statusDot = '🟡';
                        }
                        
                        return (
                            <div 
                                key={idx}
                                onClick={() => {
                                    saveActiveWorkoutState({
                                        ...activeWorkout,
                                        currentExerciseIndex: idx
                                    });
                                }}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'var(--transition)',
                                    background: isCurrent ? 'rgba(var(--accent-rgb), 0.08)' : 'rgba(255, 255, 255, 0.02)',
                                    border: isCurrent ? '1px solid var(--accent)' : '1px solid rgba(255, 255, 255, 0.05)',
                                    boxShadow: isCurrent ? 'var(--shadow-glow)' : 'none'
                                }}
                                className="roadmap-row-item"
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                                    <span style={{ 
                                        fontSize: '11px', 
                                        fontWeight: '700', 
                                        background: isCurrent ? 'var(--accent)' : 'rgba(255,255,255,0.1)', 
                                        color: isCurrent ? 'var(--text-dark)' : '#fff',
                                        width: '20px', 
                                        height: '20px', 
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {idx + 1}
                                    </span>
                                    <span style={{ 
                                        fontSize: '13px', 
                                        fontWeight: isCurrent ? '600' : 'normal',
                                        color: isCurrent ? '#fff' : 'var(--text-main)',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        maxWidth: '180px'
                                    }}>
                                        {ex.name}
                                    </span>
                                </div>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ 
                                        fontSize: '11px', 
                                        padding: '2px 8px', 
                                        borderRadius: '12px', 
                                        background: statusColor,
                                        color: isAllDone ? '#34d399' : (isAnyDone ? '#f59e0b' : 'var(--text-muted)'),
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        {statusDot} {statusText}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Ações Inferiores */}
            {/* Ações Inferiores */}
            {activeWorkout.workoutId === 'free' && (
                <button 
                    className="btn-secondary"
                    onClick={() => setIsFreeBrowserOpen(true)}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '12px',
                        fontWeight: 'bold',
                        border: '1px dashed rgba(var(--accent-rgb), 0.5)',
                        background: 'rgba(var(--accent-rgb), 0.03)',
                        color: 'var(--accent)',
                        marginBottom: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                    }}
                >
                    ➕ Adicionar Exercício ao Treino
                </button>
            )}

            <div className="gym-footer-actions">
                <button 
                    className="btn-secondary" 
                    onClick={handlePrevExercise}
                    disabled={currentExerciseIndex === 0}
                    style={{ flex: 1, opacity: currentExerciseIndex === 0 ? 0.3 : 1 }}
                >
                    ◀ Voltar
                </button>
                
                {currentExerciseIndex === exercises.length - 1 ? (
                    <button className="btn-primary" onClick={handleFinishWorkout} style={{ flex: 2 }}>
                        🏁 Finalizar Treino
                    </button>
                ) : (
                    <button className="btn-primary" onClick={handleNextExercise} style={{ flex: 2 }}>
                        Avançar ▶
                    </button>
                )}
            </div>

            <button 
                className="btn-danger" 
                onClick={handleCancelWorkout}
                style={{ marginTop: '15px', padding: '10px' }}
            >
                ✕ Descartar Treino
            </button>

            {/* TIMER DE DESCANSO OVERLAY */}
            {timerActive && (
                <div className="timer-overlay">
                    <h2 style={{ marginBottom: '10px' }}>Descanso</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
                        Respire fundo e recupere o fôlego
                    </p>

                    <div className="circular-timer-box">
                        <svg>
                            <circle className="bg" cx="100" cy="100" r={radius} />
                            <circle 
                                className="fg" 
                                cx="100" 
                                cy="100" 
                                r={radius}
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                            />
                        </svg>
                        <div className="timer-number">{timeLeft}s</div>
                    </div>

                    <div className="timer-exercise-next" style={{ textAlign: 'center', marginBottom: '15px' }}>
                        <p>{activeSetIdx === -1 || activeSetIdx >= series.length - 1 ? 'Próximo Exercício' : 'Próxima Série'}</p>
                        <h4 style={{ fontSize: '18px', color: '#fff', fontWeight: 'bold', marginBottom: '10px' }}>
                            {activeSetIdx === -1 || activeSetIdx >= series.length - 1
                                ? (exercises[currentExerciseIndex + 1]?.name || 'Finalizar!') 
                                : `${currentExercise.name} (Série ${activeSetIdx + 1})`}
                        </h4>
                    </div>

                    {/* Exercícios restantes */}
                    {exercises.slice(currentExerciseIndex + 1).length > 0 ? (
                        <div className="remaining-exercises-list" style={{ marginBottom: '20px', textAlign: 'center', width: '100%', maxWidth: '280px' }}>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
                                Exercícios Restantes ({exercises.slice(currentExerciseIndex + 1).length}):
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '80px', overflowY: 'auto', padding: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                {exercises.slice(currentExerciseIndex + 1).map((ex, idx) => (
                                    <div key={idx} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {idx + currentExerciseIndex + 2}. {ex.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div style={{ marginBottom: '20px', fontSize: '12px', color: 'var(--accent)', fontWeight: '600' }}>
                            🎉 Este é o último exercício do treino!
                        </div>
                    )}

                    <div className="timer-adjust-row">
                        <button className="timer-adjust-btn" onClick={() => handleAdjustTimer(-15)}>-15s</button>
                        <button className="timer-adjust-btn" onClick={() => handleAdjustTimer(15)}>+15s</button>
                    </div>

                    <button 
                        className="btn-primary" 
                        onClick={handleSkipRest}
                    >
                        Pular Descanso
                    </button>
                </div>
            )}

            {/* MODAL DE SUBSTITUIÇÃO DE EXERCÍCIO */}
            {isSwapping && (
                <ExerciseBrowser 
                    onSelect={handleSwapExercise}
                    onClose={() => setIsSwapping(false)}
                    initialCategory={category}
                    lockCategory={true}
                />
            )}

            {/* MODAL DE ADIÇÃO DE EXERCÍCIO EM TREINO LIVRE */}
            {isFreeBrowserOpen && (
                <ExerciseBrowser 
                    onSelect={(newEx) => {
                        addFreeWorkoutExercise(newEx);
                        setIsFreeBrowserOpen(false);
                    }}
                    onClose={() => setIsFreeBrowserOpen(false)}
                />
            )}
        </div>
    );
}
