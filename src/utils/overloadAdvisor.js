/**
 * Assistente Inteligente de Progressão de Cargas (Auto Overload)
 * Analisa o histórico de execuções do usuário e calcula metas de sobrecarga progressiva e 1RM.
 */

// Fórmula de Epley para cálculo de 1RM (Uma Repetição Máxima Estimada)
export const calculate1RM = (weight, reps) => {
    const w = parseFloat(weight) || 0;
    const r = parseInt(reps) || 0;
    if (w <= 0 || r <= 0) return 0;
    if (r === 1) return w;
    return Math.round(w * (1 + r / 30) * 10) / 10;
};

// Analisa o histórico de um exercício e gera recomendações de sobrecarga
export const getExerciseOverloadAdvice = (exerciseName, history = []) => {
    if (!exerciseName || !history || history.length === 0) {
        return {
            hasHistory: false,
            message: "⭐ Primeira sessão registrada! Foque na amplitude e encontre uma carga confortável para 8 a 12 repetições.",
            suggestedWeight: null,
            estimated1RM: 0,
            lastSession: null
        };
    }

    const cleanName = exerciseName.toLowerCase().trim();
    const pastLogs = [];

    // Busca execuções anteriores deste exercício
    history.forEach(item => {
        if (!item.exercises || !item.date) return;
        const match = item.exercises.find(e => e.name && e.name.toLowerCase().trim() === cleanName);
        if (match && match.series && match.series.length > 0) {
            const completedSets = match.series.filter(s => s.completed !== false && (s.weight > 0 || s.reps > 0));
            if (completedSets.length > 0) {
                let maxWeight = 0;
                let totalReps = 0;
                let max1RM = 0;

                completedSets.forEach(s => {
                    const w = parseFloat(s.weight) || 0;
                    const r = parseInt(s.reps) || 0;
                    if (w > maxWeight) maxWeight = w;
                    totalReps += r;
                    const oneRM = calculate1RM(w, r);
                    if (oneRM > max1RM) max1RM = oneRM;
                });

                pastLogs.push({
                    date: item.date,
                    workoutName: item.workoutName || 'Treino',
                    setsCount: completedSets.length,
                    maxWeight,
                    avgReps: Math.round(totalReps / completedSets.length),
                    max1RM,
                    sets: completedSets
                });
            }
        }
    });

    if (pastLogs.length === 0) {
        return {
            hasHistory: false,
            message: "⭐ Primeira sessão registrada! Busque uma carga desafiadora mantendo boa postura.",
            suggestedWeight: null,
            estimated1RM: 0,
            lastSession: null
        };
    }

    // Ordena por data (mais recente primeiro)
    pastLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
    const lastSession = pastLogs[0];
    const daysSince = Math.round((new Date() - new Date(lastSession.date)) / (1000 * 60 * 60 * 24));
    const dateFormatted = new Date(lastSession.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

    let suggestedWeight = lastSession.maxWeight;
    let message = "";
    let increment = 2; // Incremento padrão de 2kg

    if (lastSession.maxWeight > 40) {
        increment = 2.5;
    } else if (lastSession.maxWeight > 80) {
        increment = 5;
    } else if (lastSession.maxWeight <= 10 && lastSession.maxWeight > 0) {
        increment = 1;
    }

    if (lastSession.maxWeight > 0) {
        suggestedWeight = lastSession.maxWeight + increment;
        message = `💡 Último treino (${dateFormatted}): ${lastSession.setsCount} séries com máx. de ${lastSession.maxWeight} kg. Meta para hoje: tentar ${suggestedWeight} kg (+${increment}kg) na última série!`;
    } else if (lastSession.avgReps > 0) {
        message = `💡 Último treino (${dateFormatted}): média de ${lastSession.avgReps} reps por série. Tente aumentar 1 a 2 repetições ou adicionar peso!`;
    }

    return {
        hasHistory: true,
        message,
        suggestedWeight,
        increment,
        estimated1RM: lastSession.max1RM,
        lastSession: {
            ...lastSession,
            daysSince,
            dateFormatted
        },
        totalSessions: pastLogs.length
    };
};
