import React, { useState, useMemo } from 'react';
import { ACHIEVEMENTS_DEFINITIONS, calculateCoupleWeeklyGoal } from '../utils/achievements';

export default function CoupleGamification({ 
    activeProfile, 
    history = [], 
    profiles = [], 
    workoutStreak = 0, 
    personalRecords = {}, 
    calisthenicsSkills = {},
    allHistories = {} // { fabio: [], esposa: [] }
}) {
    const [filterCategory, setFilterCategory] = useState('all'); // 'all' | 'casal' | 'unlocked'

    // Extrai os históricos de Fábio e Adlai
    const fabioHistory = allHistories.fabio || (activeProfile?.id === 'fabio' ? history : []);
    const esposaHistory = allHistories.esposa || (activeProfile?.id === 'esposa' ? history : []);

    // Calcula a meta semanal do casal
    const weeklyGoal = useMemo(() => {
        return calculateCoupleWeeklyGoal(fabioHistory, esposaHistory, 6);
    }, [fabioHistory, esposaHistory]);

    // Dados para verificação de conquistas
    const evaluationData = useMemo(() => {
        return {
            fabioHistory,
            esposaHistory,
            personalRecords,
            calisthenicsSkills
        };
    }, [fabioHistory, esposaHistory, personalRecords, calisthenicsSkills]);

    // Processa conquistas desbloqueadas
    const achievements = useMemo(() => {
        return ACHIEVEMENTS_DEFINITIONS.map(ach => {
            const isUnlocked = ach.check(history, evaluationData, workoutStreak);
            return {
                ...ach,
                isUnlocked
            };
        });
    }, [history, evaluationData, workoutStreak]);

    const unlockedCount = achievements.filter(a => a.isUnlocked).length;
    const totalAchievements = achievements.length;

    const filteredAchievements = useMemo(() => {
        if (filterCategory === 'unlocked') {
            return achievements.filter(a => a.isUnlocked);
        }
        if (filterCategory === 'casal') {
            return achievements.filter(a => a.category === 'casal');
        }
        return achievements;
    }, [achievements, filterCategory]);

    return (
        <div className="card couple-gamification-card" style={{ padding: '20px' }}>
            {/* Header da Gamificação */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 'bold', letterSpacing: '1px' }}>
                        🏆 Desafios & Metas
                    </span>
                    <h3 style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: '800' }}>Fábio & Adlai 💖</h3>
                </div>
                <div style={{
                    background: 'rgba(var(--accent-rgb), 0.12)',
                    border: '1px solid rgba(var(--accent-rgb), 0.25)',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: 'var(--accent)'
                }}>
                    🏆 {unlockedCount}/{totalAchievements} Conquistas
                </div>
            </div>

            {/* Meta Semanal de Treinos do Casal */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                border: '1px solid rgba(249, 115, 22, 0.25)',
                borderRadius: '14px',
                padding: '14px',
                marginBottom: '18px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>
                        🎯 Meta Semanal do Casal
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: weeklyGoal.isCompleted ? '#34d399' : '#f97316' }}>
                        {weeklyGoal.totalCurrent} de {weeklyGoal.targetWeeklyWorkouts} treinos
                    </span>
                </div>

                {/* Barra de Progresso */}
                <div style={{ height: '8px', background: 'rgba(0,0,0,0.4)', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
                    <div style={{
                        height: '100%',
                        width: `${weeklyGoal.percent}%`,
                        background: weeklyGoal.isCompleted 
                            ? 'linear-gradient(90deg, #10b981, #34d399)'
                            : 'linear-gradient(90deg, #f97316, #ec4899)',
                        borderRadius: '4px',
                        transition: 'width 0.5s ease'
                    }}></div>
                </div>

                {/* Detalhamento por Pessoa */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>⚡ Fábio: <strong style={{ color: '#fff' }}>{weeklyGoal.fabioCount}</strong> treinos</span>
                    <span>💖 Adlai: <strong style={{ color: '#fff' }}>{weeklyGoal.esposaCount}</strong> treinos</span>
                </div>

                {weeklyGoal.isCompleted && (
                    <div style={{
                        marginTop: '10px',
                        padding: '6px 10px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#34d399',
                        fontWeight: '600',
                        textAlign: 'center'
                    }}>
                        🎉 Parabéns casal! Meta da semana batida com sucesso! 🚀
                    </div>
                )}
            </div>

            {/* Filtros de Conquistas */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                <button
                    onClick={() => setFilterCategory('all')}
                    className="btn-secondary"
                    style={{
                        flex: 1,
                        padding: '6px 10px',
                        fontSize: '11px',
                        background: filterCategory === 'all' ? 'var(--accent)' : 'rgba(255,255,255,0.03)',
                        color: filterCategory === 'all' ? 'var(--text-dark)' : 'var(--text-muted)',
                        fontWeight: '700'
                    }}
                >
                    Todas ({achievements.length})
                </button>
                <button
                    onClick={() => setFilterCategory('unlocked')}
                    className="btn-secondary"
                    style={{
                        flex: 1,
                        padding: '6px 10px',
                        fontSize: '11px',
                        background: filterCategory === 'unlocked' ? 'var(--accent)' : 'rgba(255,255,255,0.03)',
                        color: filterCategory === 'unlocked' ? 'var(--text-dark)' : 'var(--text-muted)',
                        fontWeight: '700'
                    }}
                >
                    Desbloqueadas ({unlockedCount})
                </button>
                <button
                    onClick={() => setFilterCategory('casal')}
                    className="btn-secondary"
                    style={{
                        flex: 1,
                        padding: '6px 10px',
                        fontSize: '11px',
                        background: filterCategory === 'casal' ? 'var(--accent)' : 'rgba(255,255,255,0.03)',
                        color: filterCategory === 'casal' ? 'var(--text-dark)' : 'var(--text-muted)',
                        fontWeight: '700'
                    }}
                >
                    Casal ⚔️
                </button>
            </div>

            {/* Grid de Troféus e Conquistas */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                gap: '10px'
            }}>
                {filteredAchievements.map(ach => (
                    <div
                        key={ach.id}
                        style={{
                            background: ach.isUnlocked ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.25)',
                            border: ach.isUnlocked ? '1px solid rgba(var(--accent-rgb), 0.3)' : '1px solid rgba(255, 255, 255, 0.03)',
                            borderRadius: '12px',
                            padding: '12px 10px',
                            textAlign: 'center',
                            opacity: ach.isUnlocked ? 1 : 0.45,
                            transition: 'var(--transition)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '6px'
                        }}
                    >
                        <div style={{
                            fontSize: '28px',
                            filter: ach.isUnlocked ? 'none' : 'grayscale(100%)',
                            marginBottom: '2px'
                        }}>
                            {ach.icon}
                        </div>

                        <div>
                            <strong style={{
                                fontSize: '12px',
                                color: ach.isUnlocked ? '#fff' : 'var(--text-muted)',
                                display: 'block',
                                lineHeight: '1.2'
                            }}>
                                {ach.title}
                            </strong>
                            <p style={{
                                fontSize: '10px',
                                color: 'var(--text-muted)',
                                margin: '4px 0 0',
                                lineHeight: '1.3'
                            }}>
                                {ach.description}
                            </p>
                        </div>

                        <span style={{
                            fontSize: '9px',
                            fontWeight: '700',
                            padding: '2px 6px',
                            borderRadius: '10px',
                            background: ach.isUnlocked ? 'rgba(52, 211, 153, 0.15)' : 'rgba(255,255,255,0.05)',
                            color: ach.isUnlocked ? '#34d399' : 'var(--text-muted)',
                            marginTop: '4px'
                        }}>
                            {ach.isUnlocked ? 'CONQUISTADO 🏆' : 'BLOQUEADO 🔒'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
