/**
 * Calculadora de Anilhas por Lado da Barra (Plate Calculator)
 */

export const BARS_CONFIG = [
    { id: 'olympic_20', name: 'Barra Olímpica Padrão', weight: 20 },
    { id: 'olympic_15', name: 'Barra Olímpica Leve', weight: 15 },
    { id: 'ez_10', name: 'Barra W / EZ', weight: 10 },
    { id: 'straight_8', name: 'Barra Reta Curta', weight: 8 },
    { id: 'machine_0', name: 'Máquina / Halter / Sem Barra', weight: 0 }
];

export const PLATES_CONFIG = [
    { weight: 25, color: '#ef4444', label: '25kg', textColor: '#ffffff' },
    { weight: 20, color: '#3b82f6', label: '20kg', textColor: '#ffffff' },
    { weight: 15, color: '#f59e0b', label: '15kg', textColor: '#000000' },
    { weight: 10, color: '#10b981', label: '10kg', textColor: '#ffffff' },
    { weight: 5, color: '#ffffff', label: '5kg', textColor: '#000000' },
    { weight: 2.5, color: '#1f2937', label: '2.5kg', textColor: '#ffffff', border: '1px solid #4b5563' },
    { weight: 1.25, color: '#9ca3af', label: '1.25kg', textColor: '#000000' }
];

export function calculatePlates(targetTotalWeight, barWeight = 20) {
    const target = parseFloat(targetTotalWeight) || 0;
    const bar = parseFloat(barWeight) || 0;

    if (target <= bar) {
        return {
            targetTotalWeight: target,
            barWeight: bar,
            weightPerSide: 0,
            platesPerSide: [],
            totalActualWeight: bar,
            remainder: 0
        };
    }

    const weightNeeded = target - bar;
    let weightPerSide = weightNeeded / 2;
    let remainingPerSide = weightPerSide;

    const platesPerSide = [];

    // Algoritmo guloso para escolher as maiores anilhas possíveis
    PLATES_CONFIG.forEach(plate => {
        if (remainingPerSide >= plate.weight) {
            const count = Math.floor(remainingPerSide / plate.weight);
            for (let i = 0; i < count; i++) {
                platesPerSide.push({ ...plate });
            }
            remainingPerSide = Math.round((remainingPerSide - count * plate.weight) * 100) / 100;
        }
    });

    const totalPlatesWeight = platesPerSide.reduce((acc, p) => acc + p.weight, 0) * 2;
    const totalActualWeight = bar + totalPlatesWeight;
    const remainder = Math.round((target - totalActualWeight) * 100) / 100;

    return {
        targetTotalWeight: target,
        barWeight: bar,
        weightPerSide: Math.round(weightPerSide * 10) / 10,
        platesPerSide,
        totalActualWeight: Math.round(totalActualWeight * 10) / 10,
        remainder
    };
}
