
/**
 * Dados de treinos predefinidos e dados de calistenia.
 * Arquivo separado do AppContext para manter compatibilidade
 * com o Fast Refresh do Vite (que exige que arquivos de contexto
 * React não misturem exportações de componentes com constantes).
 */

export const CALISTENIA_PROJECT = {
    name: "🤸 Projeto Calistenia",
    difficulty: "Médio / Avançado",
    duration: "45 min/dia",
    description: "Programa focado em progressões e exercícios preparatórios para alcançar as manobras clássicas da calistenia.",
    workouts: [
        {
            name: "Calistenia - Objetivo: Frog Stand",
            description: "Exercícios preparatórios de core, ombros e punhos para o equilíbrio no Frog Stand (Corvo).",
            coverStyle: "core",
            coverUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
            exercises: [
                { name: "Isometria de Frog Stand (Corvo)", path: "", series: 4, reps: 15, weight: 0, targetWeight: 0, notes: "Equilibre o corpo sobre as mãos com os joelhos apoiados nos cotovelos. Sustente por 15 segundos." },
                { name: "Flexão diamante", path: "Exercicios/Calistenia/Flexão diamante.gif", series: 3, reps: 10, weight: 0, targetWeight: 0, notes: "Fortaleça tríceps e estabilizadores mantendo as mãos juntas" },
                { name: "Pike Push-up (Flexão Pike)", path: "Exercicios/Calistenia/Flexões de apoio de mão na parede.gif", series: 3, reps: 8, weight: 0, targetWeight: 0, notes: "Foco no ganho de força vertical dos ombros" },
                { name: "Contração abdominal", path: "Exercicios/Mobilidade/Contração abdominal.gif", series: 3, reps: 15, weight: 0, targetWeight: 0, notes: "Mantenha o core firme e contraído para sustentação" }
            ]
        },
        {
            name: "Calistenia - Objetivo: Human Flag",
            description: "Rotina para o fortalecimento lateral do tronco e ombros preparando para a Bandeira Humana.",
            coverStyle: "costas",
            coverUrl: "https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?q=80&w=600&auto=format&fit=crop",
            exercises: [
                { name: "Bandeira Humana", path: "Exercicios/Calistenia/Bandeira Humana.gif", series: 4, reps: 6, weight: 0, targetWeight: 0, notes: "Progressão de isometria segurando no mastro ou espaldar lateral" },
                { name: "Elevação lateral com toalha na parede", path: "Exercicios/Calistenia/Elevação lateral com toalha na parede.gif", series: 3, reps: 10, weight: 0, targetWeight: 0, notes: "Excelente ativação e força dos deltoides laterais" },
                { name: "Puxada escapular na barra fixa", path: "Exercicios/Calistenia/Puxada escapular na barra fixa.gif", series: 3, reps: 12, weight: 0, targetWeight: 0, notes: "Força de sustentação e retração das escápulas" },
                { name: "Paralela", path: "Exercicios/Calistenia/Paralela.gif", series: 4, reps: 8, weight: 0, targetWeight: 0, notes: "Força de empurrar lateral dos braços" }
            ]
        },
        {
            name: "Calistenia - Objetivo: Muscle Up",
            description: "Exercícios de puxada explosiva e transição de força sobre a barra para o Muscle Up.",
            coverStyle: "peito",
            coverUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=600&auto=format&fit=crop",
            exercises: [
                { name: "Muscle up", path: "Exercicios/Calistenia/Muscle up.gif", series: 4, reps: 4, weight: 0, targetWeight: 0, notes: "Busque a execução explosiva com a puxada alta passando o peito" },
                { name: "Puxada escapular na barra fixa", path: "Exercicios/Calistenia/Puxada escapular na barra fixa.gif", series: 3, reps: 10, weight: 0, targetWeight: 0, notes: "Ativação escapular no início do movimento vertical" },
                { name: "Barra Fixa com Pegada Supinada", path: "Exercicios/Calistenia/Barra Fixa com Pegada Supinada.gif", series: 4, reps: 8, weight: 0, targetWeight: 0, notes: "Puxe o corpo para cima de forma rápida e controlada" },
                { name: "Paralela", path: "Exercicios/Calistenia/Paralela.gif", series: 4, reps: 10, weight: 0, targetWeight: 0, notes: "Força de empurrar essencial para finalizar a subida sobre a barra" }
            ]
        }
    ]
};

export const CALISTHENICS_MANEUVERS_INITIAL = {
    frog_stand: {
        id: "frog_stand",
        name: "Frog Stand",
        level: "Iniciante",
        category: "Empurrar/Equilibrio",
        status: "bloqueado",
        phase1_progress: [
            { exercise: "Mobilidade: Aquecimento de Punhos", value: 0, target: 1, unit: "concluido" },
            { exercise: "Técnica: Técnica da Garra", value: 0, target: 1, unit: "concluido" },
            { exercise: "Nível 1: Prancha Alta", value: 0, target: 60, unit: "segundos" },
            { exercise: "Nível 2: Planche Lean", value: 0, target: 30, unit: "segundos" }
        ],
        phase2_progress: [
            { exercise: "Nível 3: Encaixe de Sapo (1 pé)", value: 0, target: 10, unit: "segundos" },
            { exercise: "Nível 4: Sapo Assistido (Testa no travesseiro)", value: 0, target: 15, unit: "segundos" }
        ],
        phase2_unlocked: false,
        maneuver_unlocked: false
    },
    elbow_lever: {
        id: "elbow_lever",
        name: "Elbow Lever",
        level: "Iniciante",
        category: "Empurrar/Equilibrio",
        status: "bloqueado",
        phase1_progress: [
            { exercise: "Flexoes de Braco Tradicionais", value: 0, target: 15, unit: "repeticoes" },
            { exercise: "Prancha Lombar (Superman)", value: 0, target: 30, unit: "segundos" }
        ],
        phase2_progress: [
            { exercise: "Elbow Lever com pes no chao", value: 0, target: 25, unit: "segundos" },
            { exercise: "Elbow Lever em Straddle", value: 0, target: 8, unit: "segundos" }
        ],
        phase2_unlocked: false,
        maneuver_unlocked: false
    },
    l_sit: {
        id: "l_sit",
        name: "L-Sit",
        level: "Intermediario",
        category: "Core/Empurrar",
        status: "bloqueado",
        phase1_progress: [
            { exercise: "Abdominal Canoa (Hollow Body)", value: 0, target: 30, unit: "segundos" },
            { exercise: "Fundos nas Paralelas (Dips)", value: 0, target: 10, unit: "repeticoes" }
        ],
        phase2_progress: [
            { exercise: "Support Hold nas Paralelas", value: 0, target: 30, unit: "segundos" },
            { exercise: "Tuck L-Sit", value: 0, target: 15, unit: "segundos" },
            { exercise: "One-Leg L-Sit", value: 0, target: 10, unit: "segundos" }
        ],
        phase2_unlocked: false,
        maneuver_unlocked: false
    },
    handstand: {
        id: "handstand",
        name: "Handstand (Parada de Mao)",
        level: "Intermediario",
        category: "Empurrar/Equilibrio",
        status: "bloqueado",
        phase1_progress: [
            { exercise: "Flexao Pike", value: 0, target: 8, unit: "repeticoes" },
            { exercise: "Prancha Alta", value: 0, target: 45, unit: "segundos" }
        ],
        phase2_progress: [
            { exercise: "Handstand na Parede (Costas)", value: 0, target: 30, unit: "segundos" },
            { exercise: "Handstand na Parede (Frente)", value: 0, target: 20, unit: "segundos" },
            { exercise: "Wall Scissor", value: 0, target: 6, unit: "repeticoes" }
        ],
        phase2_unlocked: false,
        maneuver_unlocked: false
    },
    skin_the_cat: {
        id: "skin_the_cat",
        name: "Skin the Cat",
        level: "Intermediario",
        category: "Puxar/Mobilidade",
        status: "bloqueado",
        phase1_progress: [
            { exercise: "Barra Fixa (Pull-ups)", value: 0, target: 8, unit: "repeticoes" },
            { exercise: "Elevacao de Joelhos na Barra", value: 0, target: 12, unit: "repeticoes" }
        ],
        phase2_progress: [
            { exercise: "Toes to Bar (Pes na Barra)", value: 0, target: 5, unit: "repeticoes" },
            { exercise: "Skin the Cat Assistido", value: 0, target: 4, unit: "repeticoes" }
        ],
        phase2_unlocked: false,
        maneuver_unlocked: false
    },
    human_flag: {
        id: "human_flag",
        name: "Bandeira Humana (Human Flag)",
        level: "Avançado",
        category: "Empurrar/Equilibrio",
        status: "bloqueado",
        phase1_progress: [
            { exercise: "Puxada escapular na barra fixa", value: 0, target: 12, unit: "repeticoes" },
            { exercise: "Paralela", value: 0, target: 8, unit: "repeticoes" }
        ],
        phase2_progress: [
            { exercise: "Elevação lateral com toalha na parede", value: 0, target: 10, unit: "repeticoes" },
            { exercise: "Bandeira Humana", value: 0, target: 6, unit: "repeticoes" }
        ],
        phase2_unlocked: false,
        maneuver_unlocked: false
    },
    muscle_up: {
        id: "muscle_up",
        name: "Muscle Up",
        level: "Avançado",
        category: "Puxar/Empurrar",
        status: "bloqueado",
        phase1_progress: [
            { exercise: "Barra Fixa com Pegada Supinada", value: 0, target: 8, unit: "repeticoes" },
            { exercise: "Paralela", value: 0, target: 10, unit: "repeticoes" }
        ],
        phase2_progress: [
            { exercise: "Puxada escapular na barra fixa", value: 0, target: 10, unit: "repeticoes" },
            { exercise: "Muscle up", value: 0, target: 4, unit: "repeticoes" }
        ],
        phase2_unlocked: false,
        maneuver_unlocked: false
    }
};

export const mergeDefaultSkills = (skills) => {
    if (!skills) return { merged: { ...CALISTHENICS_MANEUVERS_INITIAL }, hasChanges: true };
    const merged = JSON.parse(JSON.stringify(skills));
    let hasChanges = false;
    Object.keys(CALISTHENICS_MANEUVERS_INITIAL).forEach(key => {
        if (!merged[key]) {
            merged[key] = JSON.parse(JSON.stringify(CALISTHENICS_MANEUVERS_INITIAL[key]));
            hasChanges = true;
        } else {
            // Se a manobra já existe, valida se a lista de exercícios mudou!
            const initialManeuver = CALISTHENICS_MANEUVERS_INITIAL[key];
            const currentManeuver = merged[key];

            // Compara os nomes dos exercícios da Fase 1 e Fase 2
            const initialP1Names = (initialManeuver.phase1_progress || []).map(p => p.exercise).join(',');
            const currentP1Names = (currentManeuver.phase1_progress || []).map(p => p.exercise).join(',');

            const initialP2Names = (initialManeuver.phase2_progress || []).map(p => p.exercise).join(',');
            const currentP2Names = (currentManeuver.phase2_progress || []).map(p => p.exercise).join(',');

            if (initialP1Names !== currentP1Names || initialP2Names !== currentP2Names) {
                console.log(`[Calistenia migration] Atualizando estrutura da manobra ${key} devido a alterações.`);
                // Preserva o status do usuário, mas atualiza a estrutura de progresso
                const status = currentManeuver.status;
                merged[key] = JSON.parse(JSON.stringify(initialManeuver));
                merged[key].status = status;
                hasChanges = true;
            }
        }
    });
    return { merged, hasChanges };
};

export const buildSkillsFromDb = (dbRows) => {
    const skills = JSON.parse(JSON.stringify(CALISTHENICS_MANEUVERS_INITIAL));
    if (!dbRows || dbRows.length === 0) return skills;
    dbRows.forEach(row => {
        const mId = row.maneuver_id;
        if (skills[mId]) {
            skills[mId].status = row.status;
            skills[mId].phase2_unlocked = row.phase2_unlocked;
            skills[mId].maneuver_unlocked = row.maneuver_unlocked;

            if (Array.isArray(row.phase1_progress)) {
                row.phase1_progress.forEach(p => {
                    const item = skills[mId].phase1_progress.find(req => req.exercise === p.exercise);
                    if (item) item.value = p.value;
                });
            }
            if (Array.isArray(row.phase2_progress)) {
                row.phase2_progress.forEach(p => {
                    const item = skills[mId].phase2_progress.find(req => req.exercise === p.exercise);
                    if (item) item.value = p.value;
                });
            }
        }
    });
    return skills;
};

export const PRESET_WORKOUTS = {
    AUTOR: {
        name: "ABC escolhido por mim",
        difficulty: "Médio",
        duration: "45 min/dia",
        description: "Divisão ABC biomecanicamente estruturada com foco 100% em máquinas e polias para isolamento máximo e segurança articular.",
        workouts: [
            {
                name: "Treino A - Peito, Ombro, Tríceps + Calistenia (Empurrar)",
                description: "Foco no empurrar horizontal/inclinado e progressão inicial de calistenia para paralelas.",
                coverStyle: "peito",
                exercises: [
                    { name: "Supino Inclinado na Máquina", path: "Exercicios/Peitoral/Supino inclinado na máquina.gif", series: 3, reps: 10, weight: 20, targetWeight: 35, notes: "Faixa de 8 a 10 repetições. Supino inclinado com bateria de pesos." },
                    { name: "Crossover (Polia Média)", path: "Exercicios/Peitoral/Crossover Unilateral com Cabo.gif", series: 3, reps: 12, weight: 15, targetWeight: 25, notes: "Faixa de 10 a 12 repetições. Cruze os cabos na altura média do peitoral." },
                    { name: "Elevação Lateral na Máquina", path: "Exercicios/Ombros/Elevação lateral na máquina.gif", series: 3, reps: 12, weight: 10, targetWeight: 15, notes: "Faixa de 10 a 12 repetições. Pode ser feito na polia baixa se preferir." },
                    { name: "Tríceps Pulley (Corda)", path: "Exercicios/Tríceps/Tríceps pulley corda.gif", series: 3, reps: 12, weight: 15, targetWeight: 22, notes: "Faixa de 10 a 12 repetições. Braços travados ao lado do corpo." },
                    { name: "Paralelas no Gráviton (Máquina Assistida)", path: "Exercicios/Tríceps/Mergulhos Assistidos para Tríceps.gif", series: 3, reps: 10, weight: 30, targetWeight: 15, notes: "Foco da Calistenia (Paralelas): O Gráviton usa o peso da máquina para facilitar o movimento. Ele prepara seus tríceps, ombros e peitoral para exercícios de calistenia mais avançados, como o Dips livre e futuras progressões de Muscle-up. Execute até a falha técnica." }
                ]
            },
            {
                name: "Treino B - Costas, Posterior de Ombro, Bíceps + Calistenia (Puxar)",
                description: "Foco na puxada vertical, remada estável para a lombar e pegada na barra fixa.",
                coverStyle: "costas",
                exercises: [
                    { name: "Puxada Frontal Aberta", path: "Exercicios/Costas/Puxada Alta.gif", series: 3, reps: 10, weight: 45, targetWeight: 60, notes: "Faixa de 8 a 10 repetições. Mantenha os cotovelos alinhados." },
                    { name: "Remada Curvada Articulada (Apoio no Peito)", path: "Exercicios/Costas/Remada frontal com alavanca.gif", series: 3, reps: 10, weight: 25, targetWeight: 40, notes: "Faixa de 8 a 10 repetições. Apoio de peito zera a tensão na lombar." },
                    { name: "Crucifixo Inverso na Máquina (Pec Deck Invertido)", path: "Exercicios/Ombros/Voador invertido.gif", series: 3, reps: 15, weight: 20, targetWeight: 30, notes: "Faixa de 12 a 15 repetições. Fortalecimento da parte de trás do ombro e postura." },
                    { name: "Rosca Scott na Máquina", path: "Exercicios/Bíceps/Rosca Scott com Alavanca.gif", series: 3, reps: 10, weight: 15, targetWeight: 22, notes: "Faixa de 8 a 10 repetições. Apoie totalmente os braços no estofado." },
                    { name: "Dead Hang (Sustentação na Barra)", path: "Exercicios/Calistenia/Barra Fixa (Pull-ups).gif", series: 3, reps: 0, weight: 0, targetWeight: 0, notes: "Foco da Calistenia (Dead Hang): Basicamente, segurar-se na barra fixa o máximo de tempo possível. Isso cria uma força de pegada colossal, descomprime a coluna (excelente para a postura) e fortalece os tendões dos braços e ombros, sendo o degrau número um para conseguir fazer barras fixas perfeitas na calistenia. Sustente pelo máximo de tempo possível." }
                ]
            },
            {
                name: "Treino C - Pernas, Core + Calistenia (Sustentação)",
                description: "Trabalho completo de pernas e fortalecimento de core focado em sustentação isométrica.",
                coverStyle: "pernas",
                exercises: [
                    { name: "Leg Press Horizontal", path: "Exercicios/Pernas/Leg Press Horizontal.gif", series: 3, reps: 10, weight: 60, targetWeight: 90, notes: "Faixa de 8 a 10 repetições. Mantenha a lombar bem apoiada." },
                    { name: "Cadeira Extensora", path: "Exercicios/Pernas/Cadeira extensora.gif", series: 3, reps: 12, weight: 25, targetWeight: 40, notes: "Faixa de 10 a 12 repetições. Pico de contração no topo." },
                    { name: "Cadeira Flexora", path: "Exercicios/Pernas/Cadeira flexora.gif", series: 3, reps: 12, weight: 25, targetWeight: 40, notes: "Faixa de 10 a 12 repetições. Controle a subida." },
                    { name: "Panturrilha na Máquina (Em Pé ou Sentado)", path: "Exercicios/Panturrilhas/Elevação de Panturrilha Sentado com Alavanca.gif", series: 4, reps: 15, weight: 20, targetWeight: 35, notes: "Faixa de 12 a 15 repetições. Alongamento máximo no ponto mais baixo." },
                    { name: "Tuck L-Sit (Progressão de L-Sit)", path: "Exercicios/Calistenia/Tuck L-Sit.gif", series: 3, reps: 0, weight: 0, targetWeight: 0, notes: "Progressão de L-Sit nas paralelas ou solo. Sustente o corpo com joelhos encolhidos pelo máximo de tempo possível." }
                ]
            }
        ]
    },
    ESPOSA_VIDA: {
        name: "Treino escolhido pelo vida!",
        difficulty: "Iniciante",
        duration: "50 min/dia",
        description: "Treino personalizado criado pelo Fábio para a sua esposa.",
        workouts: [
            {
                name: "TREINO A",
                description: "Foco principal na parte frontal da coxa e panturrilha.",
                coverStyle: "pernas",
                exercises: [
                    { name: "Cadeira Extensora", path: "Exercicios/Pernas/Cadeira extensora.gif", series: 4, reps: 15, weight: 15, targetWeight: 25, notes: "Faixa de 12 a 15 repetições." },
                    { name: "Leg Press 45° Linear Amarelo", path: "Exercicios/Pernas/Leg Press.gif", series: 4, reps: 12, weight: 30, targetWeight: 50, notes: "Faixa de 10 a 12 repetições." },
                    { name: "Agachamento Articulado / Pendulum Squat", path: "Exercicios/Pernas/Agachamento na Máquina Hack.gif", series: 3, reps: 12, weight: 10, targetWeight: 20, notes: "Foco no controle do movimento." },
                    { name: "Gêmeos Sentado", path: "Exercicios/Panturrilhas/Elevação de Panturrilha Sentado com Alavanca.gif", series: 4, reps: 15, weight: 10, targetWeight: 20, notes: "Movimento completo com alongamento máximo." }
                ]
            },
            {
                name: "TREINO B",
                description: "Treino focado em membros superiores com esteira no final.",
                coverStyle: "costas",
                exercises: [
                    { name: "Puxada Alta Articulada", path: "Exercicios/Costas/Puxada Alta.gif", series: 4, reps: 12, weight: 15, targetWeight: 25, notes: "Faixa de 10 a 12 repetições." },
                    { name: "Supino Vertical na Máquina", path: "Exercicios/Peitoral/Supino na máquina.gif", series: 3, reps: 12, weight: 10, targetWeight: 15, notes: "Mantenha os ombros para trás." },
                    { name: "Remada Baixa Sentada na Polia", path: "Exercicios/Costas/Remada Sentada com Cabo.gif", series: 3, reps: 12, weight: 15, targetWeight: 25, notes: "Foco em contrair as costas." },
                    { name: "Tríceps no Pulley", path: "Exercicios/Tríceps/Tríceps pulley barra.gif", series: 3, reps: 15, weight: 10, targetWeight: 15, notes: "Faixa de 12 a 15 repetições." },
                    { name: "Rosca Bíceps no Pulley Baixo", path: "Exercicios/Bíceps/Rosca Unilateral com Cabo.gif", series: 3, reps: 15, weight: 5, targetWeight: 10, notes: "Faixa de 12 a 15 repetições." },
                    { name: "Esteira", path: "Exercicios/Cardio/Esteira Ergométrica.gif", series: 1, reps: 30, weight: 0, targetWeight: 0, notes: "25min a 30min de caminhada." }
                ]
            },
            {
                name: "TREINO C",
                description: "Foco na parte de trás das pernas.",
                coverStyle: "gluteos",
                exercises: [
                    { name: "Cadeira Flexora Sentada", path: "Exercicios/Pernas/Cadeira flexora.gif", series: 4, reps: 12, weight: 15, targetWeight: 25, notes: "Faixa de 10 a 12 repetições." },
                    { name: "Leg Press 45° Articulado por Tijolos", path: "Exercicios/Pernas/Leg Press Horizontal.gif", series: 4, reps: 12, weight: 20, targetWeight: 40, notes: "Posicione os pés mais no alto para focar no posterior." },
                    { name: "Cadeira Abdutora", path: "Exercicios/Glúteos/Máquina de Abdução de Quadril.gif", series: 4, reps: 15, weight: 20, targetWeight: 35, notes: "Tronco levemente inclinado para a frente." },
                    { name: "Mesa Flexora Deitado", path: "Exercicios/Pernas/Mesa flexora.gif", series: 3, reps: 12, weight: 10, targetWeight: 20, notes: "Não levante o quadril durante a execução." },
                    { name: "Gêmeos Sentado", path: "Exercicios/Panturrilhas/Elevação de Panturrilha Sentado com Alavanca.gif", series: 4, reps: 15, weight: 10, targetWeight: 20, notes: "Movimento completo com alongamento." }
                ]
            }
        ]
    },
    PPL: {
        name: "🏋️‍♂️ Push / Pull / Legs (PPL)",
        difficulty: "Avançado",
        duration: "60 min/dia",
        description: "Dividido em 3 treinos focados na ação muscular: Empurrar (Peito/Ombro/Tríceps), Puxar (Costas/Bíceps) e Pernas completas.",
        workouts: [
            {
                name: "Treino 1 (Empurrar) - Peito/Ombro/Tríceps",
                description: "Foco em peito, ombros e tríceps com aparelhos.",
                coverStyle: "peito",
                exercises: [
                    { name: "Supino Reto na Máquina", path: "Exercicios/Peitoral/Supino Reto na Máquina.gif", series: 4, reps: 10, weight: 30, targetWeight: 45, notes: "Cadência controlada" },
                    { name: "Supino inclinado na máquina", path: "Exercicios/Peitoral/Supino inclinado na máquina.gif", series: 4, reps: 10, weight: 20, targetWeight: 35, notes: "" },
                    { name: "Desenvolvimento de ombro na máquina", path: "Exercicios/Ombros/Desenvolvimento de ombro na máquina.gif", series: 3, reps: 10, weight: 15, targetWeight: 25, notes: "" },
                    { name: "Elevação lateral na máquina", path: "Exercicios/Ombros/Elevação lateral na máquina.gif", series: 4, reps: 12, weight: 10, targetWeight: 15, notes: "Foco na contração lateral" },
                    { name: "Extensão de tríceps no cabo alto", path: "Exercicios/Tríceps/Extensão de tríceps no cabo alto.gif", series: 4, reps: 12, weight: 20, targetWeight: 30, notes: "" }
                ]
            },
            {
                name: "Treino 2 (Puxar) - Costas/Bíceps",
                description: "Foco em costas e bíceps com polias e máquinas.",
                coverStyle: "costas",
                exercises: [
                    { name: "Puxada Alta", path: "Exercicios/Costas/Puxada Alta.gif", series: 4, reps: 10, weight: 45, targetWeight: 60, notes: "" },
                    { name: "Remada Sentada na Máquina", path: "Exercicios/Costas/Remada Sentada na Máquina.gif", series: 4, reps: 10, weight: 30, targetWeight: 45, notes: "" },
                    { name: "Rosca concentrada com cabo", path: "Exercicios/Bíceps/Rosca concentrada com cabo.gif", series: 4, reps: 10, weight: 15, targetWeight: 25, notes: "" },
                    { name: "Rosca Unilateral com Cabo", path: "Exercicios/Bíceps/Rosca Unilateral com Cabo.gif", series: 3, reps: 12, weight: 10, targetWeight: 18, notes: "" }
                ]
            },
            {
                name: "Treino 3 (Pernas) - Coxas/Panturrilhas",
                description: "Foco em membros inferiores utilizando aparelhos.",
                coverStyle: "pernas",
                exercises: [
                    { name: "Leg Press", path: "Exercicios/Pernas/Leg Press.gif", series: 4, reps: 10, weight: 80, targetWeight: 120, notes: "" },
                    { name: "Cadeira extensora", path: "Exercicios/Pernas/Cadeira extensora.gif", series: 4, reps: 12, weight: 30, targetWeight: 50, notes: "" },
                    { name: "Mesa flexora", path: "Exercicios/Pernas/Mesa flexora.gif", series: 3, reps: 10, weight: 25, targetWeight: 40, notes: "" }
                ]
            }
        ]
    },
    UL: {
        name: "💪 Superior / Inferior (Upper/Lower)",
        difficulty: "Médio",
        duration: "50 min/dia",
        description: "Divisão balanceada de 2 treinos para otimizar a frequência semanal de estímulo muscular.",
        workouts: [
            {
                name: "Treino Superior (Upper Body)",
                description: "Foco na parte superior completa do corpo em máquinas.",
                coverStyle: "geral",
                exercises: [
                    { name: "Supino Reto na Máquina", path: "Exercicios/Peitoral/Supino Reto na Máquina.gif", series: 4, reps: 10, weight: 30, targetWeight: 45, notes: "" },
                    { name: "Puxada Alta", path: "Exercicios/Costas/Puxada Alta.gif", series: 4, reps: 10, weight: 45, targetWeight: 60, notes: "" },
                    { name: "Desenvolvimento de ombro na máquina", path: "Exercicios/Ombros/Desenvolvimento de ombro na máquina.gif", series: 3, reps: 10, weight: 15, targetWeight: 25, notes: "" },
                    { name: "Rosca concentrada com cabo", path: "Exercicios/Bíceps/Rosca concentrada com cabo.gif", series: 3, reps: 12, weight: 15, targetWeight: 22, notes: "" },
                    { name: "Extensão de tríceps na máquina", path: "Exercicios/Tríceps/Extensão de tríceps na máquina.gif", series: 3, reps: 12, weight: 20, targetWeight: 30, notes: "" }
                ]
            },
            {
                name: "Treino Inferior (Lower Body)",
                description: "Foco nos membros inferiores em aparelhos.",
                coverStyle: "pernas",
                exercises: [
                    { name: "Leg Press", path: "Exercicios/Pernas/Leg Press.gif", series: 4, reps: 10, weight: 80, targetWeight: 120, notes: "" },
                    { name: "Cadeira extensora", path: "Exercicios/Pernas/Cadeira extensora.gif", series: 4, reps: 12, weight: 30, targetWeight: 50, notes: "" },
                    { name: "Mesa flexora", path: "Exercicios/Pernas/Mesa flexora.gif", series: 3, reps: 10, weight: 25, targetWeight: 40, notes: "" },
                    { name: "Máquina de Adução de Quadril", path: "Exercicios/Pernas/Máquina de Adução de Quadril.gif", series: 3, reps: 12, weight: 30, targetWeight: 45, notes: "" }
                ]
            }
        ]
    },
    FB: {
        name: "⚡ Corpo Inteiro (Full Body)",
        difficulty: "Médio",
        duration: "45 min/dia",
        description: "Treinamento completo englobando os grandes grupos em 1 único dia. Ideal para consistência rápida.",
        workouts: [
            {
                name: "Full Body - Corpo Inteiro",
                description: "Treinamento geral com foco nos grandes grupos em máquinas.",
                coverStyle: "geral",
                exercises: [
                    { name: "Leg Press", path: "Exercicios/Pernas/Leg Press.gif", series: 4, reps: 10, weight: 80, targetWeight: 120, notes: "" },
                    { name: "Supino Reto na Máquina", path: "Exercicios/Peitoral/Supino Reto na Máquina.gif", series: 4, reps: 10, weight: 30, targetWeight: 45, notes: "" },
                    { name: "Puxada Alta", path: "Exercicios/Costas/Puxada Alta.gif", series: 4, reps: 10, weight: 45, targetWeight: 60, notes: "" },
                    { name: "Elevação lateral na máquina", path: "Exercicios/Ombros/Elevação lateral na máquina.gif", series: 3, reps: 12, weight: 10, targetWeight: 15, notes: "" },
                    { name: "Rosca concentrada com cabo", path: "Exercicios/Bíceps/Rosca concentrada com cabo.gif", series: 3, reps: 10, weight: 15, targetWeight: 22, notes: "" }
                ]
            }
        ]
    },
    PEITO: {
        name: "🍒 Hipertrofia de Peito",
        difficulty: "Avançado",
        duration: "40 min/dia",
        description: "Foco absoluto no peitoral maior/menor, supino reto e inclinado em máquinas e cruzamentos de cabos.",
        workouts: [
            {
                name: "Foco Hipertrofia: Peito Gigante",
                description: "Treino especializado para desenvolvimento de peitoral com máquinas e cabos.",
                coverStyle: "peito",
                exercises: [
                    { name: "Supino Reto na Máquina", path: "Exercicios/Peitoral/Supino Reto na Máquina.gif", series: 4, reps: 10, weight: 40, targetWeight: 60, notes: "Cadência controlada na descida" },
                    { name: "Supino inclinado na máquina", path: "Exercicios/Peitoral/Supino inclinado na máquina.gif", series: 4, reps: 10, weight: 20, targetWeight: 35, notes: "Foco em peito superior" },
                    { name: "Voador na Máquina", path: "Exercicios/Peitoral/Voador na Máquina.gif", series: 4, reps: 12, weight: 30, targetWeight: 45, notes: "" },
                    { name: "Extensão de tríceps no cabo alto", path: "Exercicios/Tríceps/Extensão de tríceps no cabo alto.gif", series: 4, reps: 12, weight: 20, targetWeight: 30, notes: "" }
                ]
            }
        ]
    },
    EMAGRECER: {
        name: "🏃‍♂️ Perda de Peso / Cardio",
        difficulty: "Médio",
        duration: "35 min/dia",
        description: "Circuito intenso e dinâmico em aparelhos com menor tempo de descanso para alto gasto calórico.",
        workouts: [
            {
                name: "Circuito Cardio: Emagrecer e Queimar",
                description: "Exercícios em aparelhos com menor tempo de descanso para alto gasto calórico.",
                coverStyle: "cardio",
                exercises: [
                    { name: "Leg Press Horizontal", path: "Exercicios/Pernas/Leg Press Horizontal.gif", series: 4, reps: 12, weight: 60, targetWeight: 90, notes: "Menos de 45s de descanso" },
                    { name: "Puxada Alta", path: "Exercicios/Costas/Puxada Alta.gif", series: 4, reps: 12, weight: 40, targetWeight: 50, notes: "" },
                    { name: "Máquina de Adução de Quadril", path: "Exercicios/Pernas/Máquina de Adução de Quadril.gif", series: 3, reps: 15, weight: 20, targetWeight: 35, notes: "" },
                    { name: "Cadeira extensora", path: "Exercicios/Pernas/Cadeira extensora.gif", series: 3, reps: 12, weight: 25, targetWeight: 40, notes: "" }
                ]
            }
        ]
    },
    CORE: {
        name: "🛡️ Fortalecimento de Core",
        difficulty: "Médio",
        duration: "30 min/dia",
        description: "Estabilidade lombar, oblíquos e fortalecimento abdominal completo.",
        workouts: [
            {
                name: "Fortalecimento de Core: Core Ativo",
                description: "Foco em estabilidade lombar, oblíquos e fortalecimento abdominal completo.",
                coverStyle: "core",
                exercises: [
                    { name: "Contração abdominal", path: "Exercicios/Mobilidade/Contração abdominal.gif", series: 4, reps: 15, weight: 0, targetWeight: 0, notes: "Concentração no abdômen" },
                    { name: "Elevação Pélvica na Máquina de Extensão de Pernas", path: "Exercicios/Glúteos/Elevação Pélvica na Máquina de Extensão de Pernas.gif", series: 4, reps: 12, weight: 20, targetWeight: 35, notes: "Estabilização no topo" }
                ]
            }
        ]
    },
    TAF: {
        name: "📋 Preparação TAF (5 Dias)",
        difficulty: "Avançado",
        duration: "45 min/dia",
        description: "Foco nos exercícios obrigatórios de Testes de Aptidão Física (força de puxada, flexões de braço e resistência abdominal).",
        workouts: [
            {
                name: "Preparação TAF (5 Dias)",
                description: "Treino focado em testes de aptidão física (força de puxada, flexões de braço e resistência abdominal).",
                coverStyle: "geral",
                exercises: [
                    { name: "Barra Fixa com Pegada Supinada", path: "Exercicios/Calistenia/Barra Fixa com Pegada Supinada.gif", series: 4, reps: 6, weight: 0, targetWeight: 0, notes: "Puxe até passar o queixo da barra" },
                    { name: "Flexão", path: "Exercicios/Calistenia/Flexão.gif", series: 4, reps: 15, weight: 0, targetWeight: 0, notes: "Mantenha o tronco reto e estabilizado" },
                    { name: "Contração abdominal", path: "Exercicios/Mobilidade/Contração abdominal.gif", series: 4, reps: 20, weight: 0, targetWeight: 0, notes: "Expulse o ar na contração" }
                ]
            }
        ]
    },
    FEMININO: {
        name: "🌸 Modelador Pernas & Glúteos",
        difficulty: "Médio",
        duration: "50 min/dia",
        description: "Treino completo de pernas, glúteos e definição focado em aparelhos guiados e cabos para o público feminino.",
        workouts: [
            {
                name: "Modelador de Pernas & Glúteos (Foco em Aparelhos)",
                description: "Treino focado no público feminino para desenvolvimento de membros inferiores e glúteos.",
                coverStyle: "pernas",
                exercises: [
                    { name: "Elevação Pélvica na Máquina de Extensão de Pernas", path: "Exercicios/Glúteos/Elevação Pélvica na Máquina de Extensão de Pernas.gif", series: 4, reps: 12, weight: 20, targetWeight: 40, notes: "Pico de contração de 2s no topo" },
                    { name: "Leg Press", path: "Exercicios/Pernas/Leg Press.gif", series: 4, reps: 10, weight: 80, targetWeight: 120, notes: "Manter amplitude segura" },
                    { name: "Cadeira extensora", path: "Exercicios/Pernas/Cadeira extensora.gif", series: 3, reps: 12, weight: 20, targetWeight: 35, notes: "" },
                    { name: "Máquina de Adução de Quadril", path: "Exercicios/Pernas/Máquina de Adução de Quadril.gif", series: 4, reps: 15, weight: 30, targetWeight: 45, notes: "" },
                    { name: "Abdução de quadril com cabo", path: "Exercicios/Glúteos/Abdução de quadril com cabo.gif", series: 4, reps: 12, weight: 10, targetWeight: 15, notes: "Corpo alinhado e movimento controlado" }
                ]
            }
        ]
    },
    SUPERIOR_MAQ: {
        name: "🤖 Superior Máquinas (Upper Machine)",
        difficulty: "Médio",
        duration: "45 min/dia",
        description: "Rotina para membros superiores (peito, costas e ombros) focando inteiramente em aparelhos para segurança articular.",
        workouts: [
            {
                name: "Superior Completo (Foco em Máquinas)",
                description: "Treino abrangente para a parte superior do corpo, focando 100% in máquinas e polias.",
                coverStyle: "geral",
                exercises: [
                    { name: "Supino Reto na Máquina", path: "Exercicios/Peitoral/Supino Reto na Máquina.gif", series: 4, reps: 10, weight: 30, targetWeight: 50, notes: "Cadência lenta na excêntrica" },
                    { name: "Puxada Alta", path: "Exercicios/Costas/Puxada Alta.gif", series: 4, reps: 10, weight: 45, targetWeight: 60, notes: "" },
                    { name: "Desenvolvimento de ombro na máquina", path: "Exercicios/Ombros/Desenvolvimento de ombro na máquina.gif", series: 3, reps: 10, weight: 15, targetWeight: 25, notes: "" },
                    { name: "Remada Sentada na Máquina", path: "Exercicios/Costas/Remada Sentada na Máquina.gif", series: 3, reps: 10, weight: 30, targetWeight: 45, notes: "" },
                    { name: "Elevação lateral na máquina", path: "Exercicios/Ombros/Elevação lateral na máquina.gif", series: 3, reps: 12, weight: 10, targetWeight: 15, notes: "" }
                ]
            }
        ]
    },
    BRACOS_CABO: {
        name: "💪 Braços Gigantes (Cabos & Polias)",
        difficulty: "Médio",
        duration: "40 min/dia",
        description: "Treino de isolamento focado em bíceps e tríceps utilizando polias, garantindo tensão mecânica constante.",
        workouts: [
            {
                name: "Braços Gigantes (Cabos & Polias)",
                description: "Treino de isolamento focado em bíceps e tríceps utilizando polias.",
                coverStyle: "geral",
                exercises: [
                    { name: "Extensão de tríceps no cabo alto", path: "Exercicios/Tríceps/Extensão de tríceps no cabo alto.gif", series: 4, reps: 12, weight: 20, targetWeight: 30, notes: "" },
                    { name: "Rosca concentrada com cabo", path: "Exercicios/Bíceps/Rosca concentrada com cabo.gif", series: 4, reps: 10, weight: 15, targetWeight: 25, notes: "" },
                    { name: "Extensão de tríceps na máquina", path: "Exercicios/Tríceps/Extensão de tríceps na máquina.gif", series: 3, reps: 10, weight: 20, targetWeight: 30, notes: "" },
                    { name: "Rosca Unilateral com Cabo", path: "Exercicios/Bíceps/Rosca Unilateral com Cabo.gif", series: 3, reps: 12, weight: 10, targetWeight: 18, notes: "" }
                ]
            }
        ]
    },
    CARDIO_EXPRESS: {
        name: "⚡ Circuito Queima Rápida",
        difficulty: "Médio",
        duration: "30 min/dia",
        description: "Treino dinâmico em formato de circuito utilizando aparelhos com tempo mínimo de descanso para máxima queima.",
        workouts: [
            {
                name: "Circuito Queima Rápida (Cardio Express)",
                description: "Circuito de alta intensidade e baixo descanso focado em queima calórica.",
                coverStyle: "cardio",
                exercises: [
                    { name: "Leg Press Horizontal", path: "Exercicios/Pernas/Leg Press Horizontal.gif", series: 4, reps: 15, weight: 50, targetWeight: 70, notes: "Descanso de 30s" },
                    { name: "Puxada Alta", path: "Exercicios/Costas/Puxada Alta.gif", series: 4, reps: 12, weight: 35, targetWeight: 45, notes: "" },
                    { name: "Contração abdominal", path: "Exercicios/Mobilidade/Contração abdominal.gif", series: 4, reps: 20, weight: 0, targetWeight: 0, notes: "" },
                    { name: "Extensão de tríceps no cabo alto", path: "Exercicios/Tríceps/Extensão de tríceps no cabo alto.gif", series: 3, reps: 15, weight: 15, targetWeight: 20, notes: "" }
                ]
            }
        ]
    }
};

export const CALISTHENICS_PATH_MAP = {
    "mobilidade: aquecimento de punhos": "Exercicios/Calistenia/Aquecimento de Punhos.gif",
    "aquecimento de punhos": "Exercicios/Calistenia/Aquecimento de Punhos.gif",
    "técnica: técnica da garra": "Exercicios/Calistenia/Tecnica da Garra.gif",
    "técnica da garra": "Exercicios/Calistenia/Tecnica da Garra.gif",
    "isometria de frog stand (corvo)": "Exercicios/Calistenia/Isometria de Frog Stand.gif",
    "nível 1: prancha alta": "Exercicios/Calistenia/Prancha Alta.png",
    "prancha alta": "Exercicios/Calistenia/Prancha Alta.png",
    "nível 2: planche lean": "Exercicios/Calistenia/Lean Plank.png",
    "nível 3: encaixe de sapo (1 pé)": "Exercicios/Calistenia/Frog Stand Assistido.gif",
    "nível 4: sapo assistido (testa no travesseiro)": "Exercicios/Calistenia/Frog Stand Assistido.gif",
    "flexoes de braco tradicionais": "Exercicios/Calistenia/Flexoes de Braco Tradicionais.gif",
    "prancha lombar (superman)": "Exercicios/Eretor Lombar/Superman.gif",
    "elbow lever com pes no chao": "Exercicios/Calistenia/Elbow Lever com pes no chao.gif",
    "elbow lever em straddle": "Exercicios/Calistenia/Elbow Lever em Straddle.gif",
    "abdominal canoa (hollow body)": "Exercicios/Calistenia/Abdominal Canoa (Hollow Body).gif",
    "fundos nas paralelas (dips)": "Exercicios/Calistenia/Support Hold nas Paralelas.gif",
    "support hold nas paralelas": "Exercicios/Calistenia/Support Hold nas Paralelas.gif",
    "tuck l-sit": "Exercicios/Calistenia/Tuck L-Sit.gif",
    "one-leg l-sit": "Exercicios/Calistenia/One-Leg L-Sit.gif",
    "flexao pike": "Exercicios/Calistenia/Flexões de apoio de mão na parede.gif",
    "handstand na parede (costas)": "Exercicios/Calistenia/Handstand na Parede (Costas).gif",
    "handstand na parede (frente)": "Exercicios/Calistenia/Handstand na Parede (Frente).gif",
    "wall scissor": "Exercicios/Calistenia/Wall Scissor.gif",
    "barra fixa (pull-ups)": "Exercicios/Calistenia/Barra Fixa (Pull-ups).gif",
    "elevacao de joelhos na barra": "Exercicios/Calistenia/Elevacao de Joelhos na Barra.gif",
    "toes to bar (pes na barra)": "Exercicios/Calistenia/Toes to Bar.gif",
    "skin the cat assistido": "Exercicios/Calistenia/Skin the Cat.gif",
    "puxada escapular na barra fixa": "Exercicios/Calistenia/Barra Fixa (Pull-ups).gif",
    "paralela": "Exercicios/Calistenia/Support Hold nas Paralelas.gif",
    "elevação lateral com toalha na parede": "Exercicios/Calistenia/Elevao lateral com toalha na parede.gif",
    "bandeira humana": "Exercicios/Calistenia/Bandeira Humana.gif",
    "barra fixa com pegada supinada": "Exercicios/Calistenia/Barra Fixa com Pegada Supinada.gif",
    "muscle up": "Exercicios/Calistenia/Muscle up.gif"
};
