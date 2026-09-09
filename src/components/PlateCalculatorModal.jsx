import React, { useState, useMemo } from 'react';
import { BARS_CONFIG, PLATES_CONFIG, calculatePlates } from '../utils/plateCalculator';

export default function PlateCalculatorModal({ initialWeight = 60, onClose, onApplyWeight }) {
    const [targetWeight, setTargetWeight] = useState(parseFloat(initialWeight) || 60);
    const [selectedBar, setSelectedBar] = useState(BARS_CONFIG[0]);

    const result = useMemo(() => {
        return calculatePlates(targetWeight, selectedBar.weight);
    }, [targetWeight, selectedBar]);

    // Agrupa as anilhas para exibição em lista (ex: 2x 20kg)
    const groupedPlates = useMemo(() => {
        const counts = {};
        result.platesPerSide.forEach(p => {
            counts[p.weight] = (counts[p.weight] || 0) + 1;
        });
        return Object.entries(counts).map(([weight, count]) => {
            const plateObj = PLATES_CONFIG.find(p => p.weight === parseFloat(weight)) || { color: '#888', label: `${weight}kg`, textColor: '#fff' };
            return {
                ...plateObj,
                count
            };
        });
    }, [result.platesPerSide]);

    const handleAdjustWeight = (delta) => {
        setTargetWeight(prev => Math.max(0, Math.round((prev + delta) * 10) / 10));
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div 
                className="modal-sheet plate-calculator-sheet" 
                onClick={e => e.stopPropagation()}
                style={{ maxHeight: '90vh', overflowY: 'auto' }}
            >
                <div className="modal-header-sheet">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '20px' }}>🧮</span>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Calculadora de Anilhas</h3>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>

                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {/* Seletor de Tipo de Barra */}
                    <div>
                        <label style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                            Tipo de Barra / Equipamento
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '6px' }}>
                            {BARS_CONFIG.map(bar => {
                                const isSelected = selectedBar.id === bar.id;
                                return (
                                    <button
                                        key={bar.id}
                                        type="button"
                                        onClick={() => setSelectedBar(bar)}
                                        style={{
                                            padding: '8px',
                                            borderRadius: '8px',
                                            border: isSelected ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.06)',
                                            background: isSelected ? 'rgba(var(--accent-rgb), 0.15)' : 'rgba(255,255,255,0.02)',
                                            color: isSelected ? 'var(--accent)' : 'var(--text-muted)',
                                            fontSize: '11px',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            textAlign: 'center',
                                            transition: 'var(--transition)'
                                        }}
                                    >
                                        <div>{bar.name}</div>
                                        <div style={{ fontSize: '10px', opacity: 0.8 }}>({bar.weight} kg)</div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Display de Peso Alvo e Botões de Ajuste */}
                    <div style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '14px',
                        padding: '16px',
                        textAlign: 'center',
                        border: '1px solid rgba(255,255,255,0.04)'
                    }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            Carga Total Alvo (Barra + Anilhas)
                        </span>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', margin: '10px 0' }}>
                            <input
                                type="number"
                                value={targetWeight}
                                onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 0)}
                                style={{
                                    fontSize: '32px',
                                    fontWeight: '900',
                                    width: '130px',
                                    textAlign: 'center',
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(var(--accent-rgb), 0.4)',
                                    borderRadius: '10px',
                                    color: '#fff',
                                    padding: '4px'
                                }}
                            />
                            <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--accent)' }}>kg</span>
                        </div>

                        {/* Botões rápidos de acréscimo / decréscimo */}
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button onClick={() => handleAdjustWeight(-10)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }}>-10</button>
                            <button onClick={() => handleAdjustWeight(-2)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }}>-2</button>
                            <button onClick={() => handleAdjustWeight(-1)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }}>-1</button>
                            <button onClick={() => handleAdjustWeight(1)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }}>+1</button>
                            <button onClick={() => handleAdjustWeight(2)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }}>+2</button>
                            <button onClick={() => handleAdjustWeight(10)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }}>+10</button>
                        </div>
                    </div>

                    {/* Representação Visual da Barra e Anilhas */}
                    <div style={{
                        background: 'linear-gradient(180deg, #11141d 0%, #0a0b0e 100%)',
                        borderRadius: '14px',
                        padding: '20px 10px',
                        border: '1px solid rgba(255,255,255,0.06)',
                        overflowX: 'auto'
                    }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '14px', textAlign: 'center' }}>
                            Montagem da Barra (1 Lado: <strong style={{ color: 'var(--accent)' }}>{result.weightPerSide} kg</strong>)
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '110px', minWidth: '280px', position: 'relative' }}>
                            {/* Barra Centro (Pegada) */}
                            <div style={{
                                width: '50px',
                                height: '14px',
                                background: 'linear-gradient(180deg, #9ca3af 0%, #4b5563 50%, #1f2937 100%)',
                                borderRadius: '4px 0 0 4px',
                                border: '1px solid #6b7280'
                            }}></div>

                            {/* Colar / Limitador da Barra */}
                            <div style={{
                                width: '12px',
                                height: '44px',
                                background: 'linear-gradient(180deg, #d1d5db 0%, #6b7280 50%, #374151 100%)',
                                borderRadius: '3px',
                                border: '1px solid #9ca3af',
                                zIndex: 2
                            }}></div>

                            {/* Anilhas no Sleeve */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', paddingLeft: '2px' }}>
                                {result.platesPerSide.length === 0 ? (
                                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0 10px' }}>
                                        Nenhuma anilha necessária (Apenas a barra)
                                    </div>
                                ) : (
                                    result.platesPerSide.map((plate, idx) => {
                                        // Altura visual proporcional ao tamanho da anilha
                                        const heights = { 25: 90, 20: 84, 15: 72, 10: 60, 5: 46, 2.5: 36, 1.25: 28 };
                                        const h = heights[plate.weight] || 50;

                                        return (
                                            <div
                                                key={idx}
                                                style={{
                                                    width: '18px',
                                                    height: `${h}px`,
                                                    background: plate.color,
                                                    borderRadius: '4px',
                                                    border: plate.border || '1px solid rgba(0,0,0,0.4)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    boxShadow: '0 2px 6px rgba(0,0,0,0.6)',
                                                    position: 'relative',
                                                    cursor: 'pointer'
                                                }}
                                                title={`${plate.label}`}
                                            >
                                                <span style={{
                                                    writingMode: 'vertical-rl',
                                                    transform: 'rotate(180deg)',
                                                    fontSize: '9px',
                                                    fontWeight: '900',
                                                    color: plate.textColor,
                                                    userSelect: 'none'
                                                }}>
                                                    {plate.weight}
                                                </span>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Ponta da Barra (Sleeve) */}
                            <div style={{
                                width: '35px',
                                height: '14px',
                                background: 'linear-gradient(180deg, #9ca3af 0%, #4b5563 50%, #1f2937 100%)',
                                borderRadius: '0 4px 4px 0',
                                border: '1px solid #6b7280'
                            }}></div>
                        </div>
                    </div>

                    {/* Resumo em Lista de Anilhas por Lado */}
                    {groupedPlates.length > 0 && (
                        <div>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'bold', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                                Anilhas a Colocar em CADA Lado:
                            </span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {groupedPlates.map((item, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            background: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.06)',
                                            padding: '6px 12px',
                                            borderRadius: '8px'
                                        }}
                                    >
                                        <div style={{
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '3px',
                                            background: item.color,
                                            border: item.border || 'none'
                                        }}></div>
                                        <span style={{ fontSize: '12px', color: '#fff', fontWeight: '700' }}>
                                            {item.count}x {item.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {result.remainder > 0 && (
                        <div style={{ fontSize: '11px', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                            ⚠️ Sobra de {result.remainder} kg não atingível com as anilhas disponíveis. Carga real montada: {result.totalActualWeight} kg.
                        </div>
                    )}

                    {/* Botão de Ação */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="btn-secondary" 
                            style={{ flex: 1, padding: '12px' }}
                        >
                            Fechar
                        </button>
                        {onApplyWeight && (
                            <button
                                type="button"
                                onClick={() => {
                                    onApplyWeight(targetWeight);
                                    onClose();
                                }}
                                className="btn-primary"
                                style={{ flex: 2, padding: '12px', fontWeight: '800' }}
                            >
                                ✓ Aplicar {targetWeight} kg na Série
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
