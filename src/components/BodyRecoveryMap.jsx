import React, { useState, useMemo } from 'react';

// Mapeamento de grupos musculares e cálculo de recuperação fisiológica
export const calculateMuscleRecovery = (history = []) => {
    const muscles = {
        peitoral: { name: 'Peitoral', label: 'Peito', lastTrained: null, totalSets: 0 },
        costas: { name: 'Costas', label: 'Dorsais / Costas', lastTrained: null, totalSets: 0 },
        ombros: { name: 'Ombros', label: 'Ombros / Deltoides', lastTrained: null, totalSets: 0 },
        biceps: { name: 'Bíceps', label: 'Bíceps e Antebraço', lastTrained: null, totalSets: 0 },
        triceps: { name: 'Tríceps', label: 'Tríceps', lastTrained: null, totalSets: 0 },
        quadriceps: { name: 'Pernas', label: 'Quadríceps (Coxas)', lastTrained: null, totalSets: 0 },
        gluteos: { name: 'Glúteos', label: 'Glúteos / Posterior', lastTrained: null, totalSets: 0 },
        panturrilhas: { name: 'Panturrilhas', label: 'Panturrilhas', lastTrained: null, totalSets: 0 },
        abdomen: { name: 'Abdomen', label: 'Abdômen / Core', lastTrained: null, totalSets: 0 }
    };

    const now = new Date();

    (history || []).forEach(item => {
        if (!item.date || !item.exercises) return;
        const itemDate = new Date(item.date);
        const daysDiff = (now - itemDate) / (1000 * 60 * 60 * 24);
        if (daysDiff > 7) return; // Considera apenas os últimos 7 dias

        (item.exercises || []).forEach(ex => {
            const pathLower = (ex.path || '').toLowerCase();
            const nameLower = (ex.name || '').toLowerCase();
            const setsCount = (ex.series || []).filter(s => s.completed !== false).length || 3;

            const checkCategory = (targetKey, keywords) => {
                if (keywords.some(k => pathLower.includes(k) || nameLower.includes(k))) {
                    if (!muscles[targetKey].lastTrained || itemDate > new Date(muscles[targetKey].lastTrained)) {
                        muscles[targetKey].lastTrained = itemDate.toISOString();
                    }
                    muscles[targetKey].totalSets += setsCount;
                }
            };

            checkCategory('peitoral', ['peitoral', 'peito', 'supino', 'crucifixo', 'voador', 'flexão', 'flexao']);
            checkCategory('costas', ['costas', 'puxada', 'remada', 'barra fixa', 'pulldown', 'pullover', 'trapézio']);
            checkCategory('ombros', ['ombros', 'ombro', 'elevação lateral', 'desenvolvimento', 'militar', 'arnold']);
            checkCategory('biceps', ['bíceps', 'biceps', 'rosca', 'antebraço', 'braquial']);
            checkCategory('triceps', ['tríceps', 'triceps', 'testa', 'paralela', 'mergulho']);
            checkCategory('quadriceps', ['pernas', 'agachamento', 'leg press', 'extensora', 'afundo', 'búlgaro']);
            checkCategory('gluteos', ['glúteos', 'gluteos', 'glúteo', 'elevação pélvica', 'abdutora', 'flexora', 'stiff', 'terra']);
            checkCategory('panturrilhas', ['panturrilhas', 'panturrilha', 'gêmeos']);
            checkCategory('abdomen', ['abdomen', 'abdominal', 'prancha', 'core', 'infra', 'canoa']);
        });
    });

    const statusMap = {};
    Object.entries(muscles).forEach(([key, data]) => {
        if (!data.lastTrained) {
            statusMap[key] = {
                ...data,
                percent: 100,
                status: 'ready',
                labelStatus: '100% Pronto',
                color: '#10b981', // Verde Neon
                hoursSince: null,
                advice: 'Totalmente descansado e pronto para hipertrofia máxima!'
            };
            return;
        }

        const hoursSince = Math.round((now - new Date(data.lastTrained)) / (1000 * 60 * 60));
        let percent = 100;
        let status = 'ready';
        let color = '#10b981';
        let labelStatus = '100% Pronto';
        let advice = 'Recuperado e pronto para novo treino intenso.';

        if (hoursSince < 24) {
            percent = Math.min(50, Math.round((hoursSince / 24) * 50));
            status = 'fatigued';
            color = '#ef4444'; // Vermelho
            labelStatus = 'Fase de Reparo (Fatigado)';
            advice = 'Em síntese proteica e reconstrução. Dê descanso hoje.';
        } else if (hoursSince < 48) {
            percent = 50 + Math.round(((hoursSince - 24) / 24) * 40);
            status = 'recovering';
            color = '#f59e0b'; // Amarelo/Âmbar
            labelStatus = 'Quase Recuperado';
            advice = 'Recuperação avançada. Treino moderado ou foco em outros grupos.';
        }

        statusMap[key] = {
            ...data,
            percent,
            status,
            labelStatus,
            color,
            hoursSince,
            advice
        };
    });

    return statusMap;
};

export default function BodyRecoveryMap({ history = [], compact = false }) {
    const [view, setView] = useState('front'); // 'front' | 'back'
    const [selectedMuscle, setSelectedMuscle] = useState('peitoral');

    const recoveryData = useMemo(() => {
        return calculateMuscleRecovery(history);
    }, [history]);

    const activeInfo = recoveryData[selectedMuscle] || recoveryData.peitoral;

    const getColor = (muscleKey) => {
        return recoveryData[muscleKey]?.color || '#10b981';
    };

    return (
        <div className="card body-recovery-card" style={{ padding: compact ? '16px' : '20px', position: 'relative' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 'bold', letterSpacing: '1px' }}>
                        🧬 Bio-Recuperação
                    </span>
                    <h3 style={{ margin: '2px 0 0', fontSize: '16px', fontWeight: '700' }}>Mapa Muscular 3D</h3>
                </div>

                {/* Alternador Frente / Costas */}
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '3px', borderRadius: '8px', gap: '3px' }}>
                    <button
                        onClick={() => setView('front')}
                        style={{
                            border: 'none',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '700',
                            background: view === 'front' ? 'var(--accent)' : 'transparent',
                            color: view === 'front' ? 'var(--text-dark)' : 'var(--text-muted)',
                            cursor: 'pointer'
                        }}
                    >
                        Frente
                    </button>
                    <button
                        onClick={() => setView('back')}
                        style={{
                            border: 'none',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '700',
                            background: view === 'back' ? 'var(--accent)' : 'transparent',
                            color: view === 'back' ? 'var(--text-dark)' : 'var(--text-muted)',
                            cursor: 'pointer'
                        }}
                    >
                        Costas
                    </button>
                </div>
            </div>

            {/* Visualizador Anatômico Interativo em SVG */}
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* SVG Silhouette */}
                <div style={{
                    flex: '1',
                    minWidth: '150px',
                    height: '240px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'radial-gradient(circle, rgba(var(--accent-rgb), 0.05) 0%, transparent 70%)',
                    borderRadius: '12px'
                }}>
                    <svg viewBox="0 0 200 320" style={{ height: '100%', filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.5))' }}>
                        {/* Cabeça e Pescoço (Neutro) */}
                        <circle cx="100" cy="30" r="18" fill="#1e2230" stroke="#2d3748" strokeWidth="2" />
                        <rect x="94" y="48" width="12" height="12" rx="3" fill="#1e2230" />

                        {view === 'front' ? (
                            /* VISÃO FRONTAL */
                            <g>
                                {/* Ombros (Deltoides) */}
                                <path
                                    d="M 64 62 C 55 68, 50 82, 54 94 C 62 86, 70 78, 76 68 Z"
                                    fill={getColor('ombros')}
                                    opacity={selectedMuscle === 'ombros' ? 1 : 0.85}
                                    stroke={selectedMuscle === 'ombros' ? '#fff' : '#000'}
                                    strokeWidth={selectedMuscle === 'ombros' ? '2' : '1'}
                                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                    onClick={() => setSelectedMuscle('ombros')}
                                />
                                <path
                                    d="M 136 62 C 145 68, 150 82, 146 94 C 138 86, 130 78, 124 68 Z"
                                    fill={getColor('ombros')}
                                    opacity={selectedMuscle === 'ombros' ? 1 : 0.85}
                                    stroke={selectedMuscle === 'ombros' ? '#fff' : '#000'}
                                    strokeWidth={selectedMuscle === 'ombros' ? '2' : '1'}
                                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                    onClick={() => setSelectedMuscle('ombros')}
                                />

                                {/* Peitoral */}
                                <path
                                    d="M 76 66 C 98 72, 98 94, 76 96 C 72 82, 72 74, 76 66 Z"
                                    fill={getColor('peitoral')}
                                    opacity={selectedMuscle === 'peitoral' ? 1 : 0.85}
                                    stroke={selectedMuscle === 'peitoral' ? '#fff' : '#000'}
                                    strokeWidth={selectedMuscle === 'peitoral' ? '2' : '1'}
                                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                    onClick={() => setSelectedMuscle('peitoral')}
                                />
                                <path
                                    d="M 124 66 C 102 72, 102 94, 124 96 C 128 82, 128 74, 124 66 Z"
                                    fill={getColor('peitoral')}
                                    opacity={selectedMuscle === 'peitoral' ? 1 : 0.85}
                                    stroke={selectedMuscle === 'peitoral' ? '#fff' : '#000'}
                                    strokeWidth={selectedMuscle === 'peitoral' ? '2' : '1'}
                                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                    onClick={() => setSelectedMuscle('peitoral')}
                                />

                                {/* Bíceps / Braços */}
                                <path
                                    d="M 52 96 C 45 110, 42 126, 44 140 C 52 136, 56 120, 58 100 Z"
                                    fill={getColor('biceps')}
                                    opacity={selectedMuscle === 'biceps' ? 1 : 0.85}
                                    stroke={selectedMuscle === 'biceps' ? '#fff' : '#000'}
                                    strokeWidth={selectedMuscle === 'biceps' ? '2' : '1'}
                                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                    onClick={() => setSelectedMuscle('biceps')}
                                />
                                <path
                                    d="M 148 96 C 155 110, 158 126, 156 140 C 148 136, 144 120, 142 100 Z"
                                    fill={getColor('biceps')}
                                    opacity={selectedMuscle === 'biceps' ? 1 : 0.85}
                                    stroke={selectedMuscle === 'biceps' ? '#fff' : '#000'}
                                    strokeWidth={selectedMuscle === 'biceps' ? '2' : '1'}
                                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                    onClick={() => setSelectedMuscle('biceps')}
                                />

                                {/* Abdômen / Core */}
                                <rect
                                    x="82"
                                    y="100"
                                    width="36"
                                    height="48"
                                    rx="6"
                                    fill={getColor('abdomen')}
                                    opacity={selectedMuscle === 'abdomen' ? 1 : 0.85}
                                    stroke={selectedMuscle === 'abdomen' ? '#fff' : '#000'}
                                    strokeWidth={selectedMuscle === 'abdomen' ? '2' : '1'}
                                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                    onClick={() => setSelectedMuscle('abdomen')}
                                />

                                {/* Quadríceps (Pernas) */}
                                <path
                                    d="M 75 154 C 68 180, 68 215, 76 235 C 88 230, 94 195, 96 154 Z"
                                    fill={getColor('quadriceps')}
                                    opacity={selectedMuscle === 'quadriceps' ? 1 : 0.85}
                                    stroke={selectedMuscle === 'quadriceps' ? '#fff' : '#000'}
                                    strokeWidth={selectedMuscle === 'quadriceps' ? '2' : '1'}
                                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                    onClick={() => setSelectedMuscle('quadriceps')}
                                />
                                <path
                                    d="M 125 154 C 132 180, 132 215, 124 235 C 112 230, 106 195, 104 154 Z"
                                    fill={getColor('quadriceps')}
                                    opacity={selectedMuscle === 'quadriceps' ? 1 : 0.85}
                                    stroke={selectedMuscle === 'quadriceps' ? '#fff' : '#000'}
                                    strokeWidth={selectedMuscle === 'quadriceps' ? '2' : '1'}
                                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                    onClick={() => setSelectedMuscle('quadriceps')}
                                />

                                {/* Panturrilhas */}
                                <path
                                    d="M 74 242 C 68 260, 72 290, 76 305 C 84 300, 88 275, 86 242 Z"
                                    fill={getColor('panturrilhas')}
                                    opacity={selectedMuscle === 'panturrilhas' ? 1 : 0.85}
                                    stroke={selectedMuscle === 'panturrilhas' ? '#fff' : '#000'}
                                    strokeWidth={selectedMuscle === 'panturrilhas' ? '2' : '1'}
                                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                    onClick={() => setSelectedMuscle('panturrilhas')}
                                />
                                <path
                                    d="M 126 242 C 132 260, 128 290, 124 305 C 116 300, 112 275, 114 242 Z"
                                    fill={getColor('panturrilhas')}
                                    opacity={selectedMuscle === 'panturrilhas' ? 1 : 0.85}
                                    stroke={selectedMuscle === 'panturrilhas' ? '#fff' : '#000'}
                                    strokeWidth={selectedMuscle === 'panturrilhas' ? '2' : '1'}
                                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                    onClick={() => setSelectedMuscle('panturrilhas')}
                                />
                            </g>
                        ) : (
                            /* VISÃO POSTERIOR (COSTAS) */
                            <g>
                                {/* Costas / Dorsais / Trapézio */}
                                <path
                                    d="M 80 62 C 100 58, 100 58, 120 62 C 140 85, 125 140, 100 148 C 75 140, 60 85, 80 62 Z"
                                    fill={getColor('costas')}
                                    opacity={selectedMuscle === 'costas' ? 1 : 0.85}
                                    stroke={selectedMuscle === 'costas' ? '#fff' : '#000'}
                                    strokeWidth={selectedMuscle === 'costas' ? '2' : '1'}
                                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                    onClick={() => setSelectedMuscle('costas')}
                                />

                                {/* Tríceps */}
                                <path
                                    d="M 54 94 C 48 110, 46 126, 48 138 C 56 134, 60 118, 62 98 Z"
                                    fill={getColor('triceps')}
                                    opacity={selectedMuscle === 'triceps' ? 1 : 0.85}
                                    stroke={selectedMuscle === 'triceps' ? '#fff' : '#000'}
                                    strokeWidth={selectedMuscle === 'triceps' ? '2' : '1'}
                                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                    onClick={() => setSelectedMuscle('triceps')}
                                />
                                <path
                                    d="M 146 94 C 152 110, 154 126, 152 138 C 144 134, 140 118, 138 98 Z"
                                    fill={getColor('triceps')}
                                    opacity={selectedMuscle === 'triceps' ? 1 : 0.85}
                                    stroke={selectedMuscle === 'triceps' ? '#fff' : '#000'}
                                    strokeWidth={selectedMuscle === 'triceps' ? '2' : '1'}
                                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                    onClick={() => setSelectedMuscle('triceps')}
                                />

                                {/* Glúteos */}
                                <path
                                    d="M 74 150 C 98 145, 98 185, 75 188 C 70 170, 70 160, 74 150 Z"
                                    fill={getColor('gluteos')}
                                    opacity={selectedMuscle === 'gluteos' ? 1 : 0.85}
                                    stroke={selectedMuscle === 'gluteos' ? '#fff' : '#000'}
                                    strokeWidth={selectedMuscle === 'gluteos' ? '2' : '1'}
                                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                    onClick={() => setSelectedMuscle('gluteos')}
                                />
                                <path
                                    d="M 126 150 C 102 145, 102 185, 125 188 C 130 170, 130 160, 126 150 Z"
                                    fill={getColor('gluteos')}
                                    opacity={selectedMuscle === 'gluteos' ? 1 : 0.85}
                                    stroke={selectedMuscle === 'gluteos' ? '#fff' : '#000'}
                                    strokeWidth={selectedMuscle === 'gluteos' ? '2' : '1'}
                                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                    onClick={() => setSelectedMuscle('gluteos')}
                                />

                                {/* Posterior de Coxa */}
                                <path
                                    d="M 75 190 C 68 215, 70 230, 76 240 C 88 235, 94 210, 96 190 Z"
                                    fill={getColor('gluteos')}
                                    opacity={selectedMuscle === 'gluteos' ? 1 : 0.85}
                                    stroke={selectedMuscle === 'gluteos' ? '#fff' : '#000'}
                                    strokeWidth={selectedMuscle === 'gluteos' ? '2' : '1'}
                                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                    onClick={() => setSelectedMuscle('gluteos')}
                                />
                                <path
                                    d="M 125 190 C 132 215, 130 230, 124 240 C 112 235, 106 210, 104 190 Z"
                                    fill={getColor('gluteos')}
                                    opacity={selectedMuscle === 'gluteos' ? 1 : 0.85}
                                    stroke={selectedMuscle === 'gluteos' ? '#fff' : '#000'}
                                    strokeWidth={selectedMuscle === 'gluteos' ? '2' : '1'}
                                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                    onClick={() => setSelectedMuscle('gluteos')}
                                />

                                {/* Panturrilhas Posterior */}
                                <path
                                    d="M 74 244 C 66 265, 70 295, 76 305 C 84 300, 88 275, 86 244 Z"
                                    fill={getColor('panturrilhas')}
                                    opacity={selectedMuscle === 'panturrilhas' ? 1 : 0.85}
                                    stroke={selectedMuscle === 'panturrilhas' ? '#fff' : '#000'}
                                    strokeWidth={selectedMuscle === 'panturrilhas' ? '2' : '1'}
                                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                    onClick={() => setSelectedMuscle('panturrilhas')}
                                />
                                <path
                                    d="M 126 244 C 134 265, 130 295, 124 305 C 116 300, 112 275, 114 244 Z"
                                    fill={getColor('panturrilhas')}
                                    opacity={selectedMuscle === 'panturrilhas' ? 1 : 0.85}
                                    stroke={selectedMuscle === 'panturrilhas' ? '#fff' : '#000'}
                                    strokeWidth={selectedMuscle === 'panturrilhas' ? '2' : '1'}
                                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                                    onClick={() => setSelectedMuscle('panturrilhas')}
                                />
                            </g>
                        )}
                    </svg>
                </div>

                {/* Cartão de Detalhes do Músculo Selecionado */}
                <div style={{
                    flex: '1.2',
                    minWidth: '180px',
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${activeInfo.color}33`,
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>
                            {activeInfo.label}
                        </span>
                        <span style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            background: `${activeInfo.color}22`,
                            color: activeInfo.color,
                            border: `1px solid ${activeInfo.color}44`
                        }}>
                            {activeInfo.percent}%
                        </span>
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Status: <strong style={{ color: activeInfo.color }}>{activeInfo.labelStatus}</strong>
                    </div>

                    {activeInfo.hoursSince !== null ? (
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                            ⏱️ Treinado há {activeInfo.hoursSince < 24 ? `${activeInfo.hoursSince}h` : `${Math.round(activeInfo.hoursSince / 24)} dias`} • {activeInfo.totalSets} séries na semana
                        </div>
                    ) : (
                        <div style={{ fontSize: '11.5px', color: '#10b981' }}>
                            ✨ Músculo sem fadiga recente. Pronto para carga!
                        </div>
                    )}

                    <p style={{
                        margin: '4px 0 0',
                        fontSize: '11.5px',
                        color: 'rgba(255,255,255,0.8)',
                        background: 'rgba(0,0,0,0.25)',
                        padding: '8px',
                        borderRadius: '6px',
                        lineHeight: '1.35'
                    }}>
                        💡 {activeInfo.advice}
                    </p>
                </div>
            </div>

            {/* Legenda de Cores */}
            <div style={{
                display: 'flex',
                gap: '12px',
                marginTop: '12px',
                paddingTop: '10px',
                borderTop: '1px solid rgba(255,255,255,0.04)',
                fontSize: '11px',
                color: 'var(--text-muted)',
                justifyContent: 'center',
                flexWrap: 'wrap'
            }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>
                    0-24h (Fatigado)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></span>
                    24-48h (Recuperando)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                    48h+ (Pronto / 100%)
                </span>
            </div>
        </div>
    );
}
