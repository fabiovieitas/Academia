import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../supabaseClient';

// Helper to parse notes and reactions
const parseHistoryNotesAndReactions = (notesStr = '') => {
    if (!notesStr) return { notes: '', reactions: {} };
    const parts = notesStr.split('||REACTIONS:');
    const notes = parts[0].trim();
    let reactions = {};
    if (parts[1]) {
        try {
            reactions = JSON.parse(parts[1]);
        } catch (e) {
            console.error('Error parsing reactions:', e);
        }
    }
    return { notes, reactions };
};

const stringifyHistoryNotesAndReactions = (notes = '', reactions = {}) => {
    const cleanNotes = notes.split('||REACTIONS:')[0].trim();
    if (Object.keys(reactions).length === 0) return cleanNotes;
    return `${cleanNotes} ||REACTIONS:${JSON.stringify(reactions)}`;
};

export default function FeedView() {
    const { activeProfile, profiles } = useApp();
    const [feedItems, setFeedItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchFeed = async () => {
        setLoading(true);
        if (supabase) {
            try {
                const { data, error } = await supabase
                    .from('fitlife_history')
                    .select('*')
                    .order('date', { ascending: false })
                    .limit(30);

                if (error) {
                    console.error('Erro ao buscar feed do Supabase:', error);
                    loadLocalFallback();
                } else {
                    setFeedItems(data || []);
                }
            } catch (err) {
                console.error('Erro na requisição do feed:', err);
                loadLocalFallback();
            }
        } else {
            loadLocalFallback();
        }
        setLoading(false);
    };

    const loadLocalFallback = () => {
        // Combina o histórico local dos dois perfis
        const fabioHistory = JSON.parse(localStorage.getItem('fitlife_v3_history_fabio') || '[]');
        const esposaHistory = JSON.parse(localStorage.getItem('fitlife_v3_history_esposa') || '[]');

        const fabioMapped = fabioHistory.map(h => ({ ...h, profile_id: 'fabio' }));
        const esposaMapped = esposaHistory.map(h => ({ ...h, profile_id: 'esposa' }));

        const combined = [...fabioMapped, ...esposaMapped]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 30);

        setFeedItems(combined);
    };

    useEffect(() => {
        fetchFeed();
        const interval = setInterval(() => {
            fetchFeed();
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchFeed();
        setRefreshing(false);
    };

    const handleToggleReaction = async (workoutId, emoji, currentNotes, workoutProfileId) => {
        const { notes: cleanNotes, reactions } = parseHistoryNotesAndReactions(currentNotes);
        const activeId = activeProfile.id;

        if (!reactions[emoji]) {
            reactions[emoji] = [];
        }

        const index = reactions[emoji].indexOf(activeId);
        if (index !== -1) {
            // Remove reação
            reactions[emoji].splice(index, 1);
            if (reactions[emoji].length === 0) {
                delete reactions[emoji];
            }
        } else {
            // Adiciona reação
            reactions[emoji].push(activeId);
        }

        const updatedNotes = stringifyHistoryNotesAndReactions(cleanNotes, reactions);

        // Atualização otimista no estado local
        setFeedItems(prev => prev.map(item => {
            if (item.id === workoutId) {
                return { ...item, notes: updatedNotes };
            }
            return item;
        }));

        if (supabase) {
            try {
                await supabase
                    .from('fitlife_history')
                    .update({ notes: updatedNotes })
                    .eq('id', workoutId);
            } catch (err) {
                console.error('Erro ao salvar reação no Supabase:', err);
            }
        } else {
            // Salva no localStorage correspondente
            const key = `fitlife_v3_history_${workoutProfileId}`;
            const historyList = JSON.parse(localStorage.getItem(key) || '[]');
            const updatedList = historyList.map(h => {
                if (String(h.id) === String(workoutId)) {
                    return { ...h, notes: updatedNotes };
                }
                return h;
            });
            localStorage.setItem(key, JSON.stringify(updatedList));
        }
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '0s';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
    };

    const getRelativeDateLabel = (dateStr) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (date.toDateString() === now.toDateString()) {
            return 'Hoje';
        } else if (diffDays === 1) {
            return 'Ontem';
        } else {
            return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' às ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        }
    };

    const getProfileDetails = (pId) => {
        return profiles.find(p => p.id === pId) || { name: 'Usuário', avatar: '💪', theme: 'fabio' };
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>Canal de Incentivo</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '4px 0 0 0' }}>
                        Acompanhe e apoie as conquistas do casal!
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: '#fff',
                        borderRadius: '12px',
                        padding: '10px 14px',
                        fontSize: '13px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'var(--transition)'
                    }}
                >
                    {refreshing ? '🔄' : '🔄 Recarregar'}
                </button>
            </div>

            {loading && feedItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
                    ⚡ Carregando feed de atividades...
                </div>
            ) : feedItems.length === 0 ? (
                <div style={{
                    background: 'var(--bg-secondary)',
                    border: '1px dashed rgba(255,255,255,0.06)',
                    borderRadius: '20px',
                    padding: '60px 20px',
                    textAlign: 'center',
                    color: 'var(--text-muted)'
                }}>
                    <span style={{ fontSize: '40px', display: 'block', marginBottom: '10px' }}>🔥</span>
                    <strong style={{ display: 'block', color: '#fff', fontSize: '16px', marginBottom: '6px' }}>Nenhum treino concluído ainda!</strong>
                    Quando você ou Adlai terminarem um treino, ele aparecerá aqui para incentivo mútuo.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {feedItems.map((item) => {
                        const creator = getProfileDetails(item.profile_id);
                        const { notes: cleanNotes, reactions } = parseHistoryNotesAndReactions(item.notes);

                        const borderLeftColor = item.profile_id === 'fabio' ? '#3b82f6' : '#ec4899';
                        const backgroundGradient = item.profile_id === 'fabio' 
                            ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(18, 20, 28, 0.4) 100%)'
                            : 'linear-gradient(135deg, rgba(236, 72, 153, 0.03) 0%, rgba(18, 20, 28, 0.4) 100%)';

                        return (
                            <div
                                key={item.id}
                                style={{
                                    background: 'var(--bg-secondary)',
                                    backgroundImage: backgroundGradient,
                                    border: '1px solid rgba(255,255,255,0.04)',
                                    borderLeft: `5px solid ${borderLeftColor}`,
                                    borderRadius: '16px',
                                    padding: '16px',
                                    position: 'relative',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{
                                            width: '28px',
                                            height: '28px',
                                            borderRadius: '50%',
                                            background: item.profile_id === 'fabio' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(236, 72, 153, 0.15)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '14px',
                                            border: item.profile_id === 'fabio' ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(236,72,153,0.3)'
                                        }}>
                                            {creator.avatar}
                                        </span>
                                        <div>
                                            <strong style={{ fontSize: '14px', color: '#fff' }}>{creator.name}</strong>
                                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px' }}>
                                                concluiu um treino!
                                            </span>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500' }}>
                                        {getRelativeDateLabel(item.date)}
                                    </span>
                                </div>

                                <div>
                                    <h4 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 4px 0', color: '#fff' }}>
                                        {item.workout_name}
                                    </h4>
                                    <div style={{ display: 'flex', gap: '10px', fontSize: '12px', color: 'var(--accent)', fontWeight: '600' }}>
                                        <span>⏱️ Duração: {formatDuration(item.duration)}</span>
                                        {item.is_cardio && <span>🏃 Cardio</span>}
                                    </div>
                                </div>

                                {item.exercises && item.exercises.length > 0 && (
                                    <div style={{
                                        background: 'rgba(0,0,0,0.15)',
                                        borderRadius: '10px',
                                        padding: '10px 12px',
                                        fontSize: '11.5px',
                                        color: '#d1d5db',
                                        lineHeight: '1.4'
                                    }}>
                                        <strong style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            📋 Resumo das Séries:
                                        </strong>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                            {item.exercises.slice(0, 5).map((ex, exIdx) => (
                                                <div key={exIdx} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    • {ex.name} ({ex.series?.length || 0} séries)
                                                </div>
                                            ))}
                                            {item.exercises.length > 5 && (
                                                <div style={{ color: 'var(--text-muted)', fontSize: '10px', marginTop: '2px' }}>
                                                    e mais {item.exercises.length - 5} exercícios...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {cleanNotes && (
                                    <div style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--text-muted)', borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: '8px' }}>
                                        "{cleanNotes}"
                                    </div>
                                )}

                                <div style={{
                                    borderTop: '1px solid rgba(255,255,255,0.04)',
                                    paddingTop: '12px',
                                    marginTop: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
                                        Apoiar conquista:
                                    </span>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {['👏', '💪', '🔥', '❤️'].map((emoji) => {
                                            const usersReacted = reactions[emoji] || [];
                                            const hasActiveReacted = usersReacted.includes(activeProfile.id);

                                            return (
                                                <button
                                                    key={emoji}
                                                    onClick={() => handleToggleReaction(item.id, emoji, item.notes, item.profile_id)}
                                                    style={{
                                                        background: hasActiveReacted ? 'rgba(var(--accent-rgb), 0.15)' : 'rgba(255,255,255,0.03)',
                                                        border: hasActiveReacted ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.08)',
                                                        borderRadius: '12px',
                                                        padding: '6px 12px',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        transition: 'all 0.2s ease',
                                                        outline: 'none'
                                                    }}
                                                >
                                                    <span style={{ fontSize: '15px' }}>{emoji}</span>
                                                    {usersReacted.length > 0 && (
                                                        <span style={{
                                                            fontSize: '11px',
                                                            fontWeight: 'bold',
                                                            color: hasActiveReacted ? 'var(--accent)' : '#fff'
                                                        }}>
                                                            {usersReacted.length}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
