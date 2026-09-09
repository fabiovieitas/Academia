/**
 * Sistema de Conquistas e Metas de Casal (Fábio & Adlai)
 */

export const ACHIEVEMENTS_DEFINITIONS = [
    {
        id: 'first_workout',
        title: 'Primeiro Passo',
        description: 'Conclua seu primeiro treino no FitLife.',
        icon: '🥇',
        category: 'individual',
        check: (userHistory) => (userHistory || []).length >= 1
    },
    {
        id: 'couple_teamwork',
        title: 'Dupla Imbatível',
        description: 'Fábio e Adlai treinaram na mesma semana.',
        icon: '⚔️',
        category: 'casal',
        check: (userHistory, allData) => {
            const fabioHist = allData?.fabioHistory || [];
            const adlaiHist = allData?.esposaHistory || [];
            if (fabioHist.length === 0 || adlaiHist.length === 0) return false;

            const getWeekKey = (d) => {
                const date = new Date(d);
                const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
                const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
                return `${date.getFullYear()}_${Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)}`;
            };

            const fabioWeeks = new Set(fabioHist.map(h => getWeekKey(h.date)));
            return adlaiHist.some(h => fabioWeeks.has(getWeekKey(h.date)));
        }
    },
    {
        id: 'streak_2',
        title: 'Chama Acesa',
        description: 'Mantenha 2 semanas consecutivas de treinos ativos.',
        icon: '🔥',
        category: 'streak',
        check: (userHistory, allData, streak) => (streak || 0) >= 2
    },
    {
        id: 'streak_4',
        title: 'Disciplina de Ferro',
        description: 'Mantenha 4 semanas consecutivas de consistência.',
        icon: '⚡',
        category: 'streak',
        check: (userHistory, allData, streak) => (streak || 0) >= 4
    },
    {
        id: 'century_sets',
        title: 'Clube dos 100',
        description: 'Complete 100 séries de exercícios registradas.',
        icon: '💯',
        category: 'volume',
        check: (userHistory) => {
            let totalSets = 0;
            (userHistory || []).forEach(h => {
                (h.exercises || []).forEach(ex => {
                    totalSets += (ex.series || []).filter(s => s.completed !== false).length;
                });
            });
            return totalSets >= 100;
        }
    },
    {
        id: 'pr_champion',
        title: 'Sobrecarga Titânica',
        description: 'Atinja 5 recordes pessoais (PRs) de carga.',
        icon: '🚀',
        category: 'forca',
        check: (userHistory, allData) => {
            const prs = allData?.personalRecords || {};
            return Object.keys(prs).length >= 5;
        }
    },
    {
        id: 'cardio_explorer',
        title: 'Fôlego de Aço',
        description: 'Acumule mais de 10km em atividades de cardio/pedal.',
        icon: '🚴',
        category: 'cardio',
        check: (userHistory) => {
            let totalKm = 0;
            (userHistory || []).forEach(h => {
                if (h.isCardio && h.distance) {
                    totalKm += parseFloat(h.distance) || 0;
                }
            });
            return totalKm >= 10;
        }
    },
    {
        id: 'calisthenics_master',
        title: 'Gravidade Zero',
        description: 'Domine sua primeira manobra na Skill Tree de Calistenia.',
        icon: '🤸',
        category: 'calistenia',
        check: (userHistory, allData) => {
            const skills = allData?.calisthenicsSkills || {};
            return Object.values(skills).some(s => s.status === 'dominado');
        }
    },
    {
        id: 'night_owl',
        title: 'Guerreiro Noturno',
        description: 'Conclua um treino após as 20h.',
        icon: '🌙',
        category: 'tempo',
        check: (userHistory) => {
            return (userHistory || []).some(h => {
                const hour = new Date(h.date).getHours();
                return hour >= 20;
            });
        }
    },
    {
        id: 'early_bird',
        title: 'Madrugador Focado',
        description: 'Conclua um treino matinal antes das 9h.',
        icon: '☀️',
        category: 'tempo',
        check: (userHistory) => {
            return (userHistory || []).some(h => {
                const hour = new Date(h.date).getHours();
                return hour < 9;
            });
        }
    }
];

// Calcula estatísticas e metas da semana do casal
export const calculateCoupleWeeklyGoal = (fabioHistory = [], esposaHistory = [], targetWeeklyWorkouts = 6) => {
    const now = new Date();
    // Começo da semana atual (domingo ou segunda)
    const currentDay = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - currentDay);
    startOfWeek.setHours(0, 0, 0, 0);

    const isThisWeek = (dateStr) => {
        if (!dateStr) return false;
        const d = new Date(dateStr);
        return d >= startOfWeek;
    };

    const fabioCount = (fabioHistory || []).filter(h => isThisWeek(h.date)).length;
    const esposaCount = (esposaHistory || []).filter(h => isThisWeek(h.date)).length;
    const totalCurrent = fabioCount + esposaCount;
    const percent = Math.min(100, Math.round((totalCurrent / targetWeeklyWorkouts) * 100));
    const isCompleted = totalCurrent >= targetWeeklyWorkouts;

    return {
        fabioCount,
        esposaCount,
        totalCurrent,
        targetWeeklyWorkouts,
        percent,
        isCompleted
    };
};
