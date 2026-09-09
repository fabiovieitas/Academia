import React, { useState } from 'react';
import { calculate1RM } from '../utils/overloadAdvisor';

const PERCENTAGES = [
    { percent: 100, reps: '1 rep', purpose: 'Força Máxima (1RM)', color: '#ef4444' },
    { percent: 90, reps: '3-4 reps', purpose: 'Força e Tensão Mecânica', color: '#f97316' },
    { percent: 85, reps: '5-6 reps', purpose: 'Força & Hipertrofia', color: '#f59e0b' },
    { percent: 80, reps: '7-8 reps', purpose: 'Hipertrofia Pesada', color: '#10b981' },
    { percent: 75, reps: '9-10 reps', purpose: 'Hipertrofia Clássica', color: 'var(--accent)' },
    { percent: 70, reps: '11-12 reps', purpose: 'Hipertrofia & Pump', color: '#3b82f6' },
    { percent: 65, reps: '14-15 reps', purpose: 'Resistência Muscular', color: '#8b5cf6' },
    { percent: 60, reps: '18-20+ reps', purpose: 'Capilarização & Metabólico', color: '#ec4899' }
];

export default function OneRMTableModal({ exerciseName, initialWeight = 60, initialReps = 10, onClose, onApplyWeight }) {
    const estimatedInitial = calculate1RM(initialWeight, initialReps) || initialWeight || 60;
    const [oneRM, setOneRM] = useState(estimatedInitial);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div 
                className="modal-sheet onerm-table-sheet" 
                onClick={e => e.stopPropagation()}
                style={{ maxHeight: '90vh', overflowY: 'auto' }}
            >
                <div className="modal-header-sheet">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '20px' }}>📈</span>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800' }}>Tabela de Intensidade (1RM)</h3>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{exerciseName}</span>
                        </div>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>

                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Painel de ajuste da 1RM */}
                    <div style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '14px',
                        padding: '16px',
                        textAlign: 'center',
                        border: '1px solid rgba(var(--accent-rgb), 0.2)'
                    }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            1RM Estimada (1 Repetição Máxima)
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', margin: '8px 0' }}>
                            <input
                                type="number"
                                value={oneRM}
                                onChange={(e) => setOneRM(parseFloat(e.target.value) || 0)}
                                style={{
                                    fontSize: '32px',
                                    fontWeight: '900',
                                    width: '120px',
                                    textAlign: 'center',
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(var(--accent-rgb), 0.4)',
                                    borderRadius: '10px',
                                    color: 'var(--accent)',
                                    padding: '4px'
                                }}
                            />
                            <span style={{ fontSize: '20px', fontWeight: '800', color: '#fff' }}>kg</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>
                            Baseado em {initialWeight}kg x {initialReps} repetições (Fórmula de Epley)
                        </p>
                    </div>

                    {/* Tabela de Porcentagens */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {PERCENTAGES.map(item => {
                            const calculatedWeight = Math.round((oneRM * (item.percent / 100)) * 10) / 10;
                            return (
                                <div
                                    key={item.percent}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        borderRadius: '10px',
                                        padding: '10px 14px',
                                        transition: 'var(--transition)'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '42px',
                                            height: '42px',
                                            borderRadius: '8px',
                                            background: `${item.color}20`,
                                            border: `1px solid ${item.color}50`,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <span style={{ fontSize: '13px', fontWeight: '900', color: item.color }}>{item.percent}%</span>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>
                                                {item.purpose}
                                            </div>
                                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                                Alvo: <strong style={{ color: 'rgba(255,255,255,0.85)' }}>{item.reps}</strong>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '17px', fontWeight: '900', color: '#fff' }}>
                                                {calculatedWeight}
                                            </span>
                                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '2px' }}>kg</span>
                                        </div>
                                        {onApplyWeight && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    onApplyWeight(calculatedWeight);
                                                    onClose();
                                                }}
                                                className="btn-secondary"
                                                style={{
                                                    padding: '6px 10px',
                                                    fontSize: '11px',
                                                    fontWeight: '700',
                                                    background: 'rgba(var(--accent-rgb), 0.15)',
                                                    color: 'var(--accent)',
                                                    border: '1px solid rgba(var(--accent-rgb), 0.3)'
                                                }}
                                            >
                                                Aplicar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="btn-secondary" 
                        style={{ padding: '12px', marginTop: '6px' }}
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}
