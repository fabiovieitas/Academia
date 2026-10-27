
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
                { name: "Isometria de Frog Stand (Corvo)", path: "Exercicios/Calistenia/Isometria_de_Frog_Stand.png", series: 4, reps: 15, weight: 0, targetWeight: 0, notes: "Equilibre o corpo sobre as mãos com os joelhos apoiados nos cotovelos. Sustente por 15 segundos." },
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
    SEMANAL_FORCA: {
        name: "📋 Ficha Semanal de Força (Seg a Sex)",
        difficulty: "Avançado",
        duration: "40-50 min/dia",
        description: "Divisão completa de 5 dias (Empurrar, Pernas A, Puxar, Pernas B e Upper Body), combinando cargas altas, intensidade e hipertrofia com 100% dos GIFs mapeados.",
        workouts: [
            {
                name: "Segunda-feira: Empurrar (Peito, Ombros e Tríceps)",
                description: "Objetivo: Carga alta e estímulo de força na parte superior",
                coverStyle: "peito",
                exercises: [
                    { name: "Supino Reto com Barra", path: "Exercicios/Peitoral/Supino Reto.gif", series: 4, reps: 8, weight: 30, targetWeight: 50, notes: "4 séries x 6 a 8 repetições (60-90s de descanso). Carga alta e estímulo de força na parte superior." },
                    { name: "Supino Inclinado com Halteres", path: "Exercicios/Peitoral/Supino Inclinado com Halteres.gif", series: 3, reps: 10, weight: 14, targetWeight: 22, notes: "3 séries x 8 a 10 repetições. Controle a descida e mantenha boa amplitude." },
                    { name: "Desenvolvimento de Ombros com Halteres", path: "Exercicios/Ombros/Desenvolvimento de Ombro no Banco com Halteres.gif", series: 3, reps: 10, weight: 12, targetWeight: 18, notes: "3 séries x 8 a 10 repetições. Banco inclinado a 75-80° para conforto articular." },
                    { name: "Elevação Lateral de Ombros", path: "Exercicios/Ombros/Elevação lateral de braços com halteres.gif", series: 3, reps: 12, weight: 8, targetWeight: 12, notes: "3 séries x 10 a 12 repetições. Foco no deltoide lateral sem balançar o tronco." },
                    { name: "Tríceps na Polia (Corda ou Barra)", path: "Exercicios/Tríceps/Tríceps pulley corda.gif", series: 3, reps: 12, weight: 20, targetWeight: 30, notes: "3 séries x 10 a 12 repetições. Cotovelos fixos ao lado do tronco." }
                ]
            },
            {
                name: "Terça-feira [40 MIN]: Pernas A (Foco Quadríceps & Panturrilhas)",
                description: "Estratégia: Treino denso e direto ao ponto, priorizando grandes cargas",
                coverStyle: "pernas",
                exercises: [
                    { name: "Agachamento Livre ou Smith", path: "Exercicios/Pernas/Agachamento Barra.gif", series: 4, reps: 8, weight: 40, targetWeight: 70, notes: "4 séries x 6 a 8 repetições. Priorize grandes cargas com profundidade e postura firme." },
                    { name: "Leg Press 45°", path: "Exercicios/Pernas/Leg Press.gif", series: 3, reps: 12, weight: 80, targetWeight: 140, notes: "3 séries x 10 a 12 repetições (descanso de 60s). Foco no quadríceps e controle da fase excêntrica." },
                    { name: "Cadeira Extensora", path: "Exercicios/Pernas/Cadeira extensora.gif", series: 3, reps: 15, weight: 30, targetWeight: 50, notes: "3 séries x 12 a 15 repetições (até a falha na última). Segure 1s no topo da contração." },
                    { name: "Panturrilha em Pé", path: "Exercicios/Panturrilhas/Panturrilha em Pé no Smith.gif", series: 4, reps: 15, weight: 20, targetWeight: 40, notes: "4 séries x 12 a 15 repetições. Alongamento completo no ponto mais baixo e pico no topo." }
                ]
            },
            {
                name: "Quarta-feira: Puxar (Costas, Bíceps e Deltoide Posterior)",
                description: "Objetivo: Largura e espessura de dorsais",
                coverStyle: "costas",
                exercises: [
                    { name: "Puxada Alta na Polia (ou Barra Fixa)", path: "Exercicios/Costas/Puxada Alta.gif", series: 4, reps: 8, weight: 45, targetWeight: 65, notes: "4 séries x 6 a 8 repetições. Puxe direcionando os cotovelos para baixo e retraindo as escápulas." },
                    { name: "Remada Curvada com Barra ou Remada Baixa", path: "Exercicios/Costas/Remada Curvada com Barra.gif", series: 3, reps: 10, weight: 30, targetWeight: 50, notes: "3 séries x 8 a 10 repetições. Tronco inclinado e estável, puxe em direção ao umbigo." },
                    { name: "Remada Unilateral com Halter (Serrote)", path: "Exercicios/Costas/Serrote.gif", series: 3, reps: 12, weight: 16, targetWeight: 24, notes: "3 séries x 10 a 12 repetições. Apoio firme no banco, cotovelos rentes ao tronco." },
                    { name: "Face Pull na Polia (Deltoide Posterior)", path: "Exercicios/Trapézio/Face Pull.gif", series: 3, reps: 15, weight: 15, targetWeight: 25, notes: "3 séries x 12 a 15 repetições. Puxe a corda em direção aos olhos com rotação externa." },
                    { name: "Rosca Direta com Barra", path: "Exercicios/Bíceps/Rosca Direta com Barra.gif", series: 3, reps: 10, weight: 10, targetWeight: 20, notes: "3 séries x 8 a 10 repetições. Cotovelos firmes e estáveis ao lado do tronco." }
                ]
            },
            {
                name: "Quinta-feira [40 MIN]: Pernas B (Foco Posterior, Glúteos & Panturrilhas)",
                description: "Estratégia: Trabalho focado na cadeia posterior para garantir estímulo 2x na semana",
                coverStyle: "gluteos",
                exercises: [
                    { name: "Stiff (Levantamento Terra Romeno)", path: "Exercicios/Costas/Levantamento Terra Romeno.gif", series: 4, reps: 10, weight: 30, targetWeight: 50, notes: "4 séries x 8 a 10 repetições. Projete o quadril para trás sentindo o alongamento da cadeia posterior." },
                    { name: "Mesa Flexora ou Cadeira Flexora", path: "Exercicios/Pernas/Mesa flexora.gif", series: 3, reps: 12, weight: 25, targetWeight: 40, notes: "3 séries x 10 a 12 repetições. Controle completo da descida lenta." },
                    { name: "Elevação Pélvica (Hip Thrust)", path: "Exercicios/Glúteos/Elevação Pélvica Com Barra.gif", series: 3, reps: 12, weight: 30, targetWeight: 60, notes: "3 séries x 10 a 12 repetições. Segure 1 a 2 segundos em contração máxima no topo." },
                    { name: "Panturrilha Sentado ou no Leg Press", path: "Exercicios/Panturrilhas/Elevação de Panturrilha Sentado com Alavanca.gif", series: 4, reps: 20, weight: 20, targetWeight: 35, notes: "4 séries x 15 a 20 repetições. Cadência cadenciada e foco no sóleo." }
                ]
            },
            {
                name: "Sexta-feira: Upper Body (Braços, Detalhes e Ponto Fraco)",
                description: "Objetivo: Volume complementar para braços e ombros antes do fim de semana",
                coverStyle: "geral",
                exercises: [
                    { name: "Supino Inclinado na Máquina ou Crossover", path: "Exercicios/Peitoral/Supino inclinado na máquina.gif", series: 3, reps: 12, weight: 25, targetWeight: 40, notes: "3 séries x 10 a 12 repetições. Contração no peitoral superior." },
                    { name: "Puxada na Polia com Pegada Invertida", path: "Exercicios/Costas/Puxada Alta Invertida.gif", series: 3, reps: 12, weight: 40, targetWeight: 60, notes: "3 séries x 10 a 12 repetições. Pegada supinada para recrutar dorsais inferiores e bíceps." },
                    { name: "Elevação Lateral na Polia", path: "Exercicios/Ombros/Elevação lateral unilateral com cabo.gif", series: 4, reps: 15, weight: 5, targetWeight: 10, notes: "4 séries x 12 a 15 repetições. Tensão mecânica contínua do cabo no deltoide medial." },
                    { name: "Super-Série: Rosca Martelo", path: "Exercicios/Bíceps/Rosca martelo.gif", series: 3, reps: 10, weight: 10, targetWeight: 16, notes: "Super-Série (3x10): Realize 10 reps e vá diretamente para o Tríceps Testa sem descanso." },
                    { name: "Super-Série: Tríceps Testa", path: "Exercicios/Tríceps/Tríceps testa com barra.gif", series: 3, reps: 10, weight: 10, targetWeight: 20, notes: "Super-Série (3x10): Execute logo após a Rosca Martelo. Descanse 60-90s ao terminar os dois." }
                ]
            }
        ]
    },
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
                    { name: "Dead Hang (Sustentação na Barra)", path: "Exercicios/Calistenia/Suspensão Passiva.gif", series: 3, reps: 0, weight: 0, targetWeight: 0, notes: "Foco da Calistenia (Dead Hang): Basicamente, segurar-se na barra fixa o máximo de tempo possível. Isso cria uma força de pegada colossal, descomprime a coluna (excelente para a postura) e fortalece os tendões dos braços e ombros, sendo o degrau número um para conseguir fazer barras fixas perfeitas na calistenia. Sustente pelo máximo de tempo possível." }
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
                    { name: "Tuck L-Sit (Progressão de L-Sit)", path: "Exercicios/Calistenia/Tuck_L_Sit.gif", series: 3, reps: 0, weight: 0, targetWeight: 0, notes: "Progressão de L-Sit nas paralelas ou solo. Sustente o corpo com joelhos encolhidos pelo máximo de tempo possível." }
                ]
            }
        ]
    },
    ESPOSA_VIDA: {
        name: "Treino escolhido pelo vida!",
        difficulty: "Médio",
        duration: "45-60 min/dia",
        description: "Treino personalizado atualizado de segunda a sexta para membros inferiores, superiores e core.",
        workouts: [
            {
                name: "Segunda-Feira - Glúteos",
                description: "Foco absoluto em glúteos e força no quadríceps.",
                coverStyle: "gluteos",
                exercises: [
                    { name: "Agachamento Sumô com Halteres", path: "Exercicios/Pernas/Agachamento Sumô com Halteres.gif", series: 4, reps: 15, weight: 10, targetWeight: 20, notes: "Foco em glúteos." },
                    { name: "Elevação Pélvica Na Máquina", path: "Exercicios/Glúteos/Elevação Pélvica Na Máquina.gif", series: 4, reps: 20, weight: 20, targetWeight: 40, notes: "Pico de contração no topo." },
                    { name: "Afundo com Halteres", path: "Exercicios/Pernas/Afundo com Halteres.gif", series: 3, reps: 12, weight: 5, targetWeight: 10, notes: "Mantenha o tronco firme." },
                    { name: "Máquina de Abdução de Quadril", path: "Exercicios/Glúteos/Máquina de Abdução de Quadril.gif", series: 3, reps: 15, weight: 15, targetWeight: 25, notes: "Tronco inclinado para a frente." },
                    { name: "Glúteo Coice Na Máquina", path: "Exercicios/Glúteos/Glúteo Coice Na Máquina.gif", series: 3, reps: 15, weight: 10, targetWeight: 20, notes: "Estenda controladamente." },
                    { name: "Agachamento", path: "Exercicios/Calistenia/Agachamento.gif", series: 3, reps: 15, weight: 0, targetWeight: 0, notes: "Agachamento livre peso corporal." }
                ]
            },
            {
                name: "Terça-Feira - Ombro, Peito & Tríceps",
                description: "Membros superiores com foco em tônus e postura.",
                coverStyle: "peito",
                exercises: [
                    { name: "Supino Reto", path: "Exercicios/Peitoral/Supino Reto.gif", series: 4, reps: 12, weight: 10, targetWeight: 20, notes: "Controle a descida." },
                    { name: "Desenvolvimento de Ombro no Banco com Halteres", path: "Exercicios/Ombros/Desenvolvimento de Ombro no Banco com Halteres.gif", series: 3, reps: 12, weight: 5, targetWeight: 10, notes: "Mantenha a postura reta." },
                    { name: "Elevação lateral com halteres sentado", path: "Exercicios/Ombros/Elevação lateral com halteres sentado.gif", series: 3, reps: 15, weight: 3, targetWeight: 6, notes: "Movimento controlado." },
                    { name: "Tríceps pulley corda", path: "Exercicios/Tríceps/Tríceps pulley corda.gif", series: 3, reps: 15, weight: 10, targetWeight: 15, notes: "Cotovelos fixos." },
                    { name: "Tríceps testa com barra", path: "Exercicios/Tríceps/Tríceps testa com barra.gif", series: 3, reps: 12, weight: 5, targetWeight: 10, notes: "Mantenha a estabilidade." },
                    { name: "Voador no pec deck", path: "Exercicios/Peitoral/Voador no pec deck.gif", series: 3, reps: 15, weight: 10, targetWeight: 20, notes: "Contraia o peitoral no pico." }
                ]
            },
            {
                name: "Quarta-Feira - Pernas (Foco em Quadríceps)",
                description: "Treino completo de quadríceps para força e definição.",
                coverStyle: "pernas",
                exercises: [
                    { name: "Leg Press", path: "Exercicios/Pernas/Leg Press.gif", series: 4, reps: 15, weight: 40, targetWeight: 70, notes: "Mantenha a lombar apoiada." },
                    { name: "Agachamento na Máquina Hack", path: "Exercicios/Pernas/Agachamento na Máquina Hack.gif", series: 3, reps: 12, weight: 10, targetWeight: 25, notes: "Agachamento Hack controlado." },
                    { name: "Cadeira Extensora", path: "Exercicios/Pernas/Cadeira extensora.gif", series: 3, reps: 15, weight: 15, targetWeight: 25, notes: "Pico de contração no topo." },
                    { name: "Agachamento Búlgaro com Halteres", path: "Exercicios/Pernas/Agachamento Búlgaro com Halteres.gif", series: 3, reps: 12, weight: 5, targetWeight: 10, notes: "Equilíbrio e amplitude." },
                    { name: "Avanço com Halteres", path: "Exercicios/Pernas/Avanço com Halteres.gif", series: 3, reps: 12, weight: 5, targetWeight: 10, notes: "Passada firme para frente." },
                    { name: "Cadeira Flexora", path: "Exercicios/Pernas/Cadeira flexora.gif", series: 3, reps: 15, weight: 15, targetWeight: 25, notes: "Controle a subida." }
                ]
            },
            {
                name: "Quinta-Feira - Costas & Bíceps",
                description: "Fortalecimento das costas e definição dos braços.",
                coverStyle: "costas",
                exercises: [
                    { name: "Pulldown com corda", path: "Exercicios/Costas/Pulldown com corda.gif", series: 4, reps: 12, weight: 15, targetWeight: 25, notes: "Puxe direcionando para a coxa." },
                    { name: "Remada Sentada com Cabo", path: "Exercicios/Costas/Remada Sentada com Cabo.gif", series: 3, reps: 15, weight: 15, targetWeight: 25, notes: "Foco na contração das costas." },
                    { name: "Remada Curvada com Barra", path: "Exercicios/Costas/Remada Curvada com Barra.gif", series: 3, reps: 12, weight: 15, targetWeight: 25, notes: "Mantenha a coluna reta." },
                    { name: "Rosca Direta com Barra", path: "Exercicios/Bíceps/Rosca Direta com Barra.gif", series: 3, reps: 15, weight: 5, targetWeight: 10, notes: "Movimento limpo." },
                    { name: "Rosca alternada com halteres sentado", path: "Exercicios/Bíceps/Rosca alternada com halteres sentado.gif", series: 3, reps: 12, weight: 5, targetWeight: 8, notes: "Gire o punho na subida." },
                    { name: "Rosca martelo", path: "Exercicios/Bíceps/Rosca martelo.gif", series: 3, reps: 12, weight: 5, targetWeight: 8, notes: "Pegada neutra constante." }
                ]
            },
            {
                name: "Sexta-Feira - Pernas (Foco em Posteriores, Glúteos & Panturrilha)",
                description: "Desenvolvimento de posteriores de coxa, glúteos e panturrilhas.",
                coverStyle: "gluteos",
                exercises: [
                    { name: "Stiff com barra", path: "Exercicios/Pernas/Stiff com barra.gif", series: 4, reps: 15, weight: 10, targetWeight: 20, notes: "Sentir alongar bem os posteriores." },
                    { name: "Cadeira Flexora", path: "Exercicios/Pernas/Cadeira flexora.gif", series: 4, reps: 15, weight: 15, targetWeight: 25, notes: "Controle completo do movimento." },
                    { name: "Elevação Pélvica Na Máquina", path: "Exercicios/Glúteos/Elevação Pélvica Na Máquina.gif", series: 3, reps: 20, weight: 20, targetWeight: 40, notes: "Foco no glúteo." },
                    { name: "Agachamento Sumô com Halteres", path: "Exercicios/Pernas/Agachamento Sumô com Halteres.gif", series: 3, reps: 12, weight: 10, targetWeight: 20, notes: "Sustentação na subida." },
                    { name: "Elevação de Panturrilha Sentado com Alavanca", path: "Exercicios/Panturrilhas/Elevação de Panturrilha Sentado com Alavanca.gif", series: 4, reps: 15, weight: 10, targetWeight: 20, notes: "Gêmeos sentado (faixa de 10 a 20 reps)." },
                    { name: "Elevação de panturrilha em pé", path: "Exercicios/Calistenia/Elevação de panturrilha em pé.gif", series: 4, reps: 15, weight: 0, targetWeight: 0, notes: "Gêmeos plantar (faixa de 10 a 20 reps)." }
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
    "mobilidade: aquecimento de punhos": "Exercicios/Calistenia/Aquecimento_de_Punhos.png",
    "aquecimento de punhos": "Exercicios/Calistenia/Aquecimento_de_Punhos.png",
    "técnica: técnica da garra": "Exercicios/Calistenia/Tecnica_da_Garra.png",
    "técnica da garra": "Exercicios/Calistenia/Tecnica_da_Garra.png",
    "isometria de frog stand (corvo)": "Exercicios/Calistenia/Isometria_de_Frog_Stand.png",
    "nível 1: prancha alta": "Exercicios/Calistenia/Prancha_Alta.gif",
    "prancha alta": "Exercicios/Calistenia/Prancha_Alta.gif",
    "nível 2: planche lean": "Exercicios/Calistenia/Lean_Plank.gif",
    "planche lean": "Exercicios/Calistenia/Lean_Plank.gif",
    "lean plank": "Exercicios/Calistenia/Lean_Plank.gif",
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
    "tuck l-sit (progressão de l-sit)": "Exercicios/Calistenia/Tuck_L_Sit.gif",
    "dead hang (sustentação na barra)": "Exercicios/Calistenia/Suspensão Passiva.gif",
    "dead hang": "Exercicios/Calistenia/Suspensão Passiva.gif",
    "one-leg l-sit": "Exercicios/Calistenia/One_Leg_L_Sit.gif",
    "flexao pike": "Exercicios/Calistenia/Flexões de apoio de mão na parede.gif",
    "handstand na parede (costas)": "Exercicios/Calistenia/Handstand_na_Parede_Costas.gif",
    "handstand na parede (frente)": "Exercicios/Calistenia/Handstand_na_Parede_Frente.gif",
    "wall scissor": "Exercicios/Calistenia/Wall_Scissor.gif",
    "barra fixa (pull-ups)": "Exercicios/Calistenia/Barra Fixa (Pull-ups).gif",
    "elevacao de joelhos na barra": "Exercicios/Calistenia/Elevacao_de_Joelhos_na_Barra.gif",
    "toes to bar (pes na barra)": "Exercicios/Calistenia/Toes_to_Bar_Pes_na_Barra.gif",
    "skin the cat assistido": "Exercicios/Calistenia/Skin_the_Cat_Assistido.gif",
    "puxada escapular na barra fixa": "Exercicios/Calistenia/Puxada escapular na barra fixa.gif",
    "paralela": "Exercicios/Calistenia/Paralela.gif",
    "elevação lateral com toalha na parede": "Exercicios/Calistenia/Elevação lateral com toalha na parede.gif",
    "bandeira humana": "Exercicios/Calistenia/Bandeira Humana.gif",
    "barra fixa com pegada supinada": "Exercicios/Calistenia/Barra Fixa com Pegada Supinada.gif",
    "muscle up": "Exercicios/Calistenia/Muscle up.gif",
    "supino vertical na máquina (chest press machine)": "Exercicios/Peitoral/Supino na máquina.gif",
    "supino vertical na máquina": "Exercicios/Peitoral/Supino na máquina.gif",
    "supino reto na máquina": "Exercicios/Peitoral/Supino na máquina.gif",
    "supino inclinado máquina": "Exercicios/Peitoral/Supino inclinado na máquina.gif",
    "leg press horizontal": "Exercicios/Pernas/Leg Press Horizontal.gif",
    "cadeira extensora": "Exercicios/Pernas/Cadeira extensora.gif",
    "elevação pélvica": "Exercicios/Glúteos/Elevação Pélvica Na Máquina.gif",
    "cadeira abdutora": "Exercicios/Glúteos/Máquina de Abdução de Quadril.gif",
    "panturrilha em pé ou sentada": "Exercicios/Panturrilhas/Elevação de Panturrilha Sentado com Alavanca.gif",
    "puxada frontal aberta": "Exercicios/Costas/Puxada Alta.gif",
    "remada baixa (polia / triângulo)": "Exercicios/Costas/Remada Sentada com Cabo.gif",
    "supino sentado": "Exercicios/Peitoral/Supino na máquina.gif",
    "elevação lateral": "Exercicios/Ombros/Elevação lateral na máquina.gif",
    "tríceps pulley (corda)": "Exercicios/Tríceps/Tríceps pulley corda.gif",
    "cadeira flexora": "Exercicios/Pernas/Cadeira flexora.gif",
    "mesa flexora": "Exercicios/Pernas/Mesa flexora.gif",
    "cadeira adutora": "Exercicios/Pernas/Máquina de Adução de Quadril.gif",
    "glúteo máquina (coice)": "Exercicios/Glúteos/Glúteo Coice Na Máquina.gif",
    "abdominal crunch (máquina ou polia alta)": "Exercicios/Mobilidade/Contração abdominal.gif",
    "supino reto com barra": "Exercicios/Peitoral/Supino Reto.gif",
    "supino reto": "Exercicios/Peitoral/Supino Reto.gif",
    "supino inclinado com halteres": "Exercicios/Peitoral/Supino Inclinado com Halteres.gif",
    "desenvolvimento de ombros com halteres": "Exercicios/Ombros/Desenvolvimento de Ombro no Banco com Halteres.gif",
    "elevação lateral de ombros": "Exercicios/Ombros/Elevação lateral de braços com halteres.gif",
    "tríceps na polia (corda ou barra)": "Exercicios/Tríceps/Tríceps pulley corda.gif",
    "agachamento livre ou smith": "Exercicios/Pernas/Agachamento Barra.gif",
    "leg press 45°": "Exercicios/Pernas/Leg Press.gif",
    "leg press 45": "Exercicios/Pernas/Leg Press.gif",
    "panturrilha em pé": "Exercicios/Panturrilhas/Panturrilha em Pé no Smith.gif",
    "puxada alta na polia (ou barra fixa)": "Exercicios/Costas/Puxada Alta.gif",
    "remada curvada com barra ou remada baixa": "Exercicios/Costas/Remada Curvada com Barra.gif",
    "remada unilateral com halter (serrote)": "Exercicios/Costas/Serrote.gif",
    "face pull na polia (deltoide posterior)": "Exercicios/Trapézio/Face Pull.gif",
    "rosca direta com barra": "Exercicios/Bíceps/Rosca Direta com Barra.gif",
    "stiff (levantamento terra romeno)": "Exercicios/Costas/Levantamento Terra Romeno.gif",
    "mesa flexora ou cadeira flexora": "Exercicios/Pernas/Mesa flexora.gif",
    "elevação pélvica (hip thrust)": "Exercicios/Glúteos/Elevação Pélvica Com Barra.gif",
    "panturrilha sentado ou no leg press": "Exercicios/Panturrilhas/Elevação de Panturrilha Sentado com Alavanca.gif",
    "supino inclinado na máquina ou crossover": "Exercicios/Peitoral/Supino inclinado na máquina.gif",
    "puxada na polia com pegada invertida": "Exercicios/Costas/Puxada Alta Invertida.gif",
    "elevação lateral na polia": "Exercicios/Ombros/Elevação lateral unilateral com cabo.gif",
    "super-série: rosca martelo": "Exercicios/Bíceps/Rosca martelo.gif",
    "super-série de braços: rosca martelo": "Exercicios/Bíceps/Rosca martelo.gif",
    "super-série: tríceps testa": "Exercicios/Tríceps/Tríceps testa com barra.gif",
    "super-série de braços: tríceps testa": "Exercicios/Tríceps/Tríceps testa com barra.gif"
};
