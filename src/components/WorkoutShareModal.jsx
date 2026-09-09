import React, { useState } from 'react';

export default function WorkoutShareModal({ workoutName, durationMinutes, totalVolume, totalSets, sessionPRs = {}, profileName = 'Fábio', onClose }) {
    const [copied, setCopied] = useState(false);

    const prKeys = Object.keys(sessionPRs);
    const hasPRs = prKeys.length > 0;

    const prText = hasPRs
        ? `\n🏆 *Novos Recordes Pessoais (PRs):*\n${prKeys.map(k => `• ${k}: ${sessionPRs[k].weight} kg x ${sessionPRs[k].reps} reps`).join('\n')}`
        : '';

    const shareText = `🔥 *Treino Concluído no FitLife!* 💪\n\n` +
        `👤 Atleta: *${profileName}*\n` +
        `🏋️ Treino: *${workoutName || 'Musculação'}*\n` +
        `⏱️ Duração: *${durationMinutes} minutos*\n` +
        `📊 Volume Total: *${totalVolume.toLocaleString('pt-BR')} kg movimentados*\n` +
        `🔢 Séries Concluídas: *${totalSets} séries*` +
        prText +
        `\n\n🚀 Rumo à evolução constante! ⚡`;

    const handleCopy = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    const handleWhatsApp = () => {
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
        window.open(url, '_blank');
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div 
                className="modal-sheet workout-share-sheet" 
                onClick={e => e.stopPropagation()}
                style={{ maxHeight: '90vh', overflowY: 'auto' }}
            >
                <div className="modal-header-sheet">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '20px' }}>📲</span>
                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>Compartilhar Conquista</h3>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>

                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Visual Card Preview */}
                    <div style={{
                        background: 'linear-gradient(135deg, #12141c 0%, #1e2230 100%)',
                        border: '1px solid rgba(var(--accent-rgb), 0.3)',
                        borderRadius: '16px',
                        padding: '20px',
                        position: 'relative',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                        overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                            <div>
                                <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent)', fontWeight: 'bold' }}>
                                    FITLIFE PRO • RESUMO OFICIAL
                                </span>
                                <h2 style={{ margin: '2px 0 0', fontSize: '20px', fontWeight: '900', color: '#fff' }}>
                                    {workoutName || 'Treino Concluído'}
                                </h2>
                            </div>
                            <div style={{
                                background: 'rgba(var(--accent-rgb), 0.15)',
                                color: 'var(--accent)',
                                padding: '4px 10px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '800'
                            }}>
                                👤 {profileName}
                            </div>
                        </div>

                        {/* Estatísticas Chave */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>⏱️ Tempo</span>
                                <strong style={{ fontSize: '16px', color: '#fff' }}>{durationMinutes} min</strong>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>📊 Volume</span>
                                <strong style={{ fontSize: '16px', color: 'var(--accent)' }}>{(totalVolume / 1000).toFixed(1)}t</strong>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>🔢 Séries</span>
                                <strong style={{ fontSize: '16px', color: '#34d399' }}>{totalSets}</strong>
                            </div>
                        </div>

                        {/* Recordes Batidos */}
                        {hasPRs && (
                            <div style={{
                                background: 'rgba(251, 191, 36, 0.1)',
                                border: '1px solid rgba(251, 191, 36, 0.25)',
                                borderRadius: '10px',
                                padding: '10px',
                                marginTop: '10px'
                            }}>
                                <div style={{ fontSize: '11px', fontWeight: '800', color: '#fbbf24', textTransform: 'uppercase', marginBottom: '4px' }}>
                                    🏆 {prKeys.length} Novo(s) Recorde(s) de Carga Batido(s)!
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '12px', color: '#fff' }}>
                                    {prKeys.map(k => (
                                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span>• {k}</span>
                                            <strong style={{ color: '#fbbf24' }}>{sessionPRs[k].weight} kg x {sessionPRs[k].reps}</strong>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Botões de Ação */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <button
                            type="button"
                            onClick={handleWhatsApp}
                            style={{
                                background: '#25D366',
                                color: '#fff',
                                border: 'none',
                                padding: '14px',
                                borderRadius: '12px',
                                fontSize: '14px',
                                fontWeight: '800',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)'
                            }}
                        >
                            💬 Enviar para o WhatsApp
                        </button>

                        <button
                            type="button"
                            onClick={handleCopy}
                            className="btn-secondary"
                            style={{ padding: '12px', fontSize: '13px', fontWeight: '700' }}
                        >
                            {copied ? '✅ Resumo Copiado!' : '📋 Copiar Texto do Resumo'}
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary"
                            style={{ padding: '10px', fontSize: '12px' }}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
