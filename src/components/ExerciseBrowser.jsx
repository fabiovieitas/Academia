import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CALISTHENICS_PATH_MAP } from '../context/workoutData';

const normalizeString = (str) => {
    return str
        ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        : "";
};

// Mapeamento de categorias musculares com ícones e cores
const CATEGORY_META = {
    'Peitoral': { icon: '🍒', label: 'Peitoral', color: '#38bdf8' },
    'Costas': { icon: '🦅', label: 'Costas', color: '#818cf8' },
    'Pernas': { icon: '🍗', label: 'Pernas', color: '#fb923c' },
    'Ombros': { icon: '🛡️', label: 'Ombros', color: '#f43f5e' },
    'Bíceps': { icon: '💪', label: 'Bíceps', color: '#a855f7' },
    'Tríceps': { icon: '⚡', label: 'Tríceps', color: '#eab308' },
    'Abdomen': { icon: '🎯', label: 'Abdômen / Core', color: '#10b981' },
    'Glúteos': { icon: '🍑', label: 'Glúteos', color: '#ec4899' },
    'Panturrilhas': { icon: '🦵', label: 'Panturrilhas', color: '#14b8a6' },
    'Calistenia': { icon: '🤸', label: 'Calistenia', color: '#06b6d4' },
    'Cardio': { icon: '🏃', label: 'Cardio', color: '#22c55e' },
    'Antebraço': { icon: '✊', label: 'Antebraço', color: '#94a3b8' },
    'Alongamento': { icon: '🧘', label: 'Alongamento', color: '#c084fc' },
    'Mobilidade': { icon: '🔄', label: 'Mobilidade', color: '#38bdf8' }
};

// Identificador automático de tipo de equipamento
const getEquipmentType = (exercise) => {
    const text = `${exercise.name} ${exercise.path || ''}`.toLowerCase();
    if (text.includes('máquina') || text.includes('maquina') || text.includes('guiado') || 
        text.includes('peck') || text.includes('voador') || text.includes('leg press') || 
        text.includes('extensora') || text.includes('flexora') || text.includes('adutor') || 
        text.includes('abdutor') || text.includes('hack') || text.includes('aparelho')) {
        return { label: 'Máquina', icon: '🤖' };
    }
    if (text.includes('cabo') || text.includes('polia') || text.includes('crossover') || text.includes('pulley') || text.includes('corda')) {
        return { label: 'Cabo / Polia', icon: '🪢' };
    }
    if (text.includes('haltere') || text.includes('halter') || text.includes('kettlebell')) {
        return { label: 'Haltere', icon: '🏋️' };
    }
    if (text.includes('barra') && !text.includes('barra fixa')) {
        return { label: 'Barra Livre', icon: '⚖️' };
    }
    if (text.includes('calistenia') || text.includes('peso corporal') || text.includes('barra fixa') || 
        text.includes('paralela') || text.includes('flexão') || text.includes('abdominal') || 
        text.includes('prancha') || text.includes('isometria')) {
        return { label: 'Peso Corporal', icon: '🤸' };
    }
    return { label: 'Livre / Aparelho', icon: '⚡' };
};

export default function ExerciseBrowser({ onSelect, onClose, initialCategory = 'all', lockCategory = false }) {
    const { exercises, favorites, toggleFavorite } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [selectedEquipment, setSelectedEquipment] = useState('all'); // 'all' | 'machine' | 'cable' | 'free' | 'body'
    const [viewMode, setViewMode] = useState(() => {
        return localStorage.getItem('fitlife_browser_view_mode') || 'grid';
    });
    const [visibleCount, setVisibleCount] = useState(40);
    const [previewExercise, setPreviewExercise] = useState(null);
    const [previewGifError, setPreviewGifError] = useState(false);
    const [previewGifSrc, setPreviewGifSrc] = useState('');
    const [previewGifStage, setPreviewGifStage] = useState(0);

    const toggleViewMode = (mode) => {
        setViewMode(mode);
        localStorage.setItem('fitlife_browser_view_mode', mode);
    };

    useEffect(() => {
        setPreviewGifError(false);
        setPreviewGifStage(0);
        if (previewExercise) {
            let path = previewExercise.path;
            if (!path) {
                const cleanKey = previewExercise.name.toLowerCase().trim();
                const cleanKeyNoPrefix = cleanKey.replace(/^(nível\s+\d+:|mobilidade:|técnica:)\s*/i, "").trim();
                path = CALISTHENICS_PATH_MAP[cleanKey] || CALISTHENICS_PATH_MAP[cleanKeyNoPrefix] || '';
            }
            const initialSrc = path.startsWith('http')
                ? path
                : `/${path}`;
            setPreviewGifSrc(initialSrc);
        } else {
            setPreviewGifSrc('');
        }
    }, [previewExercise]);

    const handlePreviewGifError = () => {
        if (previewExercise) {
            const path = previewExercise.path || '';
            const hasCustomMedia = !!import.meta.env.VITE_MEDIA_URL;

            if (previewGifStage === 0) {
                if (hasCustomMedia) {
                    setPreviewGifStage(1);
                    const customSrc = path.startsWith('http') ? path : `${import.meta.env.VITE_MEDIA_URL}/${path}`;
                    setPreviewGifSrc(customSrc);
                } else {
                    setPreviewGifStage(2);
                    const publicSrc = path.startsWith('http') ? path : `https://www.gifdotreino.com/${path}`;
                    setPreviewGifSrc(publicSrc);
                }
            } else if (previewGifStage === 1) {
                setPreviewGifStage(2);
                const publicSrc = path.startsWith('http') ? path : `https://www.gifdotreino.com/${path}`;
                setPreviewGifSrc(publicSrc);
            } else if (previewGifStage === 2) {
                setPreviewGifStage(3);
                const cleanName = previewExercise.name.replace(/^(nível\s+\d+:|mobilidade:|técnica:)\s*/i, "").trim();
                const thumbnailSrc = `https://www.gifdotreino.com/thumbnails/${cleanName}.png`;
                setPreviewGifSrc(thumbnailSrc);
            } else {
                setPreviewGifError(true);
            }
        }
    };

    // Extrai categorias dinâmicas da base de dados de exercícios
    const categories = useMemo(() => {
        if (lockCategory) {
            return [initialCategory];
        }
        const cats = exercises
            .map(ex => {
                const parts = (ex.path || '').split('/');
                return parts.length > 1 ? parts[1] : null;
            })
            .filter(Boolean);
        return ['all', 'favorites', ...Array.from(new Set(cats)).sort()];
    }, [exercises, lockCategory, initialCategory]);

    // Filtra a lista com base em categoria, equipamento e termo de busca
    const filteredExercises = useMemo(() => {
        return exercises.filter(ex => {
            const parts = (ex.path || '').split('/');
            const category = parts.length > 1 ? parts[1] : '';
            
            // 1. Filtro de categoria
            if (selectedCategory === 'favorites') {
                if (!favorites.includes(ex.name)) return false;
            } else if (selectedCategory !== 'all' && category !== selectedCategory) {
                return false;
            }

            // 2. Filtro de equipamento
            if (selectedEquipment !== 'all') {
                const eq = getEquipmentType(ex);
                if (selectedEquipment === 'machine' && eq.label !== 'Máquina') return false;
                if (selectedEquipment === 'cable' && eq.label !== 'Cabo / Polia') return false;
                if (selectedEquipment === 'free' && eq.label !== 'Haltere' && eq.label !== 'Barra Livre') return false;
                if (selectedEquipment === 'body' && eq.label !== 'Peso Corporal') return false;
            }

            // 3. Filtro de busca textual
            if (searchQuery.trim() !== '') {
                const query = normalizeString(searchQuery);
                return (
                    normalizeString(ex.name).includes(query) ||
                    (ex.description && normalizeString(ex.description).includes(query)) ||
                    normalizeString(category).includes(query)
                );
            }

            return true;
        });
    }, [exercises, searchQuery, selectedCategory, selectedEquipment, favorites]);

    // Reseta paginação quando os filtros mudam
    useEffect(() => {
        setVisibleCount(40);
    }, [searchQuery, selectedCategory, selectedEquipment]);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 40);
    };

    const getCategoryChipInfo = (cat) => {
        if (cat === 'all') return { icon: '🌟', label: 'Todos' };
        if (cat === 'favorites') return { icon: '⭐', label: 'Favoritos' };
        return CATEGORY_META[cat] || { icon: '💪', label: cat };
    };

    const resolveThumbnailUrl = (exercise) => {
        const isLocalThumb = exercise.thumbnail && (
            exercise.thumbnail.startsWith('/') || 
            exercise.thumbnail.startsWith('Exercicios/') || 
            exercise.thumbnail.startsWith('http')
        );
        const baseMediaUrl = import.meta.env.VITE_MEDIA_URL || 'https://www.gifdotreino.com';
        if (isLocalThumb) {
            return encodeURI(exercise.thumbnail.startsWith('http') ? exercise.thumbnail : `/${exercise.thumbnail}`);
        }
        if (exercise.thumbnail) {
            return encodeURI(`${baseMediaUrl}/${exercise.thumbnail}`);
        }
        const cleanName = exercise.name.replace(/^(nível\s+\d+:|mobilidade:|técnica:)\s*/i, "").trim();
        return encodeURI(`${baseMediaUrl}/thumbnails/${cleanName}.png`);
    };

    const fallbackSvg = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><rect width="60" height="60" fill="%23191c28"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="10" fill="%239ca3af">GIF</text></svg>';

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-sheet exercise-browser-sheet" onClick={e => e.stopPropagation()}>
                {/* Header do Modal */}
                <div className="modal-header-sheet">
                    <div>
                        <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 'bold', letterSpacing: '1px' }}>
                            Biblioteca de Exercícios 🏋️‍♂️
                        </span>
                        <h3 style={{ margin: 0, fontSize: '18px' }}>Selecionar Exercício</h3>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>
                
                {/* Painel de Busca e Filtros */}
                <div className="search-filter-box" style={{ padding: '12px 16px', background: 'var(--bg-secondary)' }}>
                    {/* Campo de Busca + Botão Alternar Visualização */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <input 
                                type="text" 
                                className="input-field" 
                                placeholder="Buscar exercício ou músculo..." 
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                style={{ paddingLeft: '34px', paddingRight: searchQuery ? '32px' : '12px', height: '42px', fontSize: '14px' }}
                                autoFocus
                            />
                            <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '14px' }}>
                                🔍
                            </span>
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '16px', cursor: 'pointer', padding: 0 }}
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {/* Switch Grade vs Lista */}
                        <div className="browser-view-toggle">
                            <button 
                                className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => toggleViewMode('grid')}
                                title="Visualização em Grade"
                            >
                                ⊞
                            </button>
                            <button 
                                className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => toggleViewMode('list')}
                                title="Visualização em Lista"
                            >
                                ☰
                            </button>
                        </div>
                    </div>
                    
                    {/* Chips de Categorias Musculares com Ícones */}
                    <div className="filter-chips-wrapper" style={{ marginBottom: '8px' }}>
                        {categories.map(cat => {
                            const info = getCategoryChipInfo(cat);
                            const isActive = selectedCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    className={`filter-chip ${isActive ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(cat)}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        fontSize: '12px',
                                        padding: '6px 12px',
                                        borderColor: isActive && info.color ? info.color : undefined,
                                        background: isActive && info.color ? `${info.color}22` : undefined,
                                        color: isActive && info.color ? info.color : undefined
                                    }}
                                >
                                    <span>{info.icon}</span>
                                    <span>{info.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Filtros Rápidos de Equipamento */}
                    <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                        {[
                            { id: 'all', label: 'Todos' },
                            { id: 'machine', label: '🤖 Máquinas' },
                            { id: 'cable', label: '🪢 Cabos' },
                            { id: 'free', label: '🏋️ Halteres / Barras' },
                            { id: 'body', label: '🤸 Peso Corporal' }
                        ].map(eq => (
                            <button
                                key={eq.id}
                                onClick={() => setSelectedEquipment(eq.id)}
                                style={{
                                    fontSize: '11px',
                                    padding: '3px 9px',
                                    borderRadius: '12px',
                                    background: selectedEquipment === eq.id ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.03)',
                                    color: selectedEquipment === eq.id ? '#fff' : 'var(--text-muted)',
                                    border: selectedEquipment === eq.id ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.05)',
                                    whiteSpace: 'nowrap',
                                    cursor: 'pointer',
                                    fontWeight: selectedEquipment === eq.id ? '600' : 'normal'
                                }}
                            >
                                {eq.label}
                            </button>
                        ))}
                    </div>

                    {/* Contador de resultados */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                        <span>Mostrando <strong>{Math.min(filteredExercises.length, visibleCount)}</strong> de <strong>{filteredExercises.length}</strong> exercícios</span>
                        {selectedCategory !== 'all' && (
                            <button 
                                onClick={() => { setSelectedCategory('all'); setSelectedEquipment('all'); setSearchQuery(''); }}
                                style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '11px', cursor: 'pointer', padding: 0 }}
                            >
                                Limpar filtros
                            </button>
                        )}
                    </div>
                </div>

                {/* Lista / Grade de Exercícios */}
                <div className="exercise-search-results" style={{ padding: '12px 16px' }}>
                    {filteredExercises.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
                            <span style={{ fontSize: '40px', display: 'block', marginBottom: '10px' }}>🔍</span>
                            <strong style={{ fontSize: '15px', color: '#fff', display: 'block', marginBottom: '5px' }}>
                                Nenhum exercício encontrado
                            </strong>
                            <p style={{ fontSize: '13px' }}>Tente pesquisar por outro termo ou alterar os filtros de grupo muscular e aparelho.</p>
                        </div>
                    ) : viewMode === 'grid' ? (
                        /* MODO 1: GRADE VISUAL (CARDS MODERNOS) */
                        <div className="exercise-modern-grid">
                            {filteredExercises.slice(0, visibleCount).map((exercise, index) => {
                                const isFav = favorites.includes(exercise.name);
                                const thumbUrl = resolveThumbnailUrl(exercise);
                                const parts = (exercise.path || '').split('/');
                                const catName = parts.length > 1 ? parts[1] : '';
                                const catMeta = CATEGORY_META[catName] || { icon: '💪', label: catName, color: 'var(--accent)' };
                                const equip = getEquipmentType(exercise);

                                return (
                                    <div 
                                        key={index} 
                                        className="exercise-grid-card"
                                        onClick={() => onSelect(exercise)}
                                    >
                                        {/* Thumbnail / GIF do exercício */}
                                        <div className="exercise-grid-thumb-wrap">
                                            <img 
                                                src={thumbUrl} 
                                                alt={exercise.name} 
                                                loading="lazy"
                                                onError={(e) => {
                                                    if (!e.target.src.includes('gifdotreino.com') && exercise.thumbnail) {
                                                        e.target.src = encodeURI(`https://www.gifdotreino.com/${exercise.thumbnail}`);
                                                    } else {
                                                        e.target.onerror = null;
                                                        e.target.src = fallbackSvg;
                                                    }
                                                }}
                                            />
                                            {/* Botão Favorito no Canto */}
                                            <button 
                                                className="exercise-grid-fav-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFavorite(exercise.name);
                                                }}
                                                style={{ color: isFav ? '#fbbf24' : 'rgba(255,255,255,0.4)' }}
                                                title={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                                            >
                                                ★
                                            </button>

                                            {/* Botão de Zoom / Preview rápido */}
                                            <button 
                                                className="exercise-grid-zoom-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setPreviewExercise(exercise);
                                                }}
                                                title="Ver animação completa"
                                            >
                                                🔍
                                            </button>
                                        </div>

                                        {/* Informações do Card */}
                                        <div className="exercise-grid-body">
                                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '5px' }}>
                                                {catName && (
                                                    <span 
                                                        className="exercise-tag-badge"
                                                        style={{ 
                                                            background: `${catMeta.color}1a`, 
                                                            color: catMeta.color, 
                                                            borderColor: `${catMeta.color}33` 
                                                        }}
                                                    >
                                                        {catMeta.icon} {catName}
                                                    </span>
                                                )}
                                                <span className="exercise-tag-badge" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)' }}>
                                                    {equip.icon} {equip.label}
                                                </span>
                                            </div>

                                            <h4 className="exercise-grid-title" title={exercise.name}>
                                                {exercise.name}
                                            </h4>

                                            <div className="exercise-grid-cta">
                                                <span>➕ Selecionar</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* MODO 2: LISTA DETALHADA */
                        <div className="exercise-detailed-list">
                            {filteredExercises.slice(0, visibleCount).map((exercise, index) => {
                                const isFav = favorites.includes(exercise.name);
                                const thumbUrl = resolveThumbnailUrl(exercise);
                                const parts = (exercise.path || '').split('/');
                                const catName = parts.length > 1 ? parts[1] : '';
                                const catMeta = CATEGORY_META[catName] || { icon: '💪', label: catName, color: 'var(--accent)' };
                                const equip = getEquipmentType(exercise);

                                return (
                                    <div 
                                        key={index} 
                                        className="exercise-result-row modern-list-row"
                                        onClick={() => onSelect(exercise)}
                                    >
                                        <div 
                                            className="favorite-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleFavorite(exercise.name);
                                            }}
                                            style={{
                                                fontSize: '20px',
                                                cursor: 'pointer',
                                                color: isFav ? '#fbbf24' : 'rgba(255,255,255,0.2)',
                                                marginRight: '2px',
                                                transition: 'var(--transition)'
                                            }}
                                        >
                                            ★
                                        </div>
                                        
                                        <div 
                                            className="thumb"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPreviewExercise(exercise);
                                            }}
                                            style={{ position: 'relative', cursor: 'zoom-in', width: '70px', height: '70px' }}
                                        >
                                            <img 
                                                src={thumbUrl} 
                                                alt={exercise.name} 
                                                loading="lazy"
                                                onError={(e) => {
                                                    if (!e.target.src.includes('gifdotreino.com') && exercise.thumbnail) {
                                                        e.target.src = encodeURI(`https://www.gifdotreino.com/${exercise.thumbnail}`);
                                                    } else {
                                                        e.target.onerror = null;
                                                        e.target.src = fallbackSvg;
                                                    }
                                                }}
                                            />
                                            <div style={{ position: 'absolute', bottom: '2px', right: '2px', background: 'rgba(0,0,0,0.7)', borderRadius: '50%', padding: '2px 4px', fontSize: '9px' }}>🔍</div>
                                        </div>
                                        
                                        <div className="details" style={{ flex: 1, minWidth: 0 }}>
                                            <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px', lineHeight: '1.3' }}>
                                                {exercise.name}
                                            </h4>
                                            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                                {catName && (
                                                    <span 
                                                        className="exercise-tag-badge"
                                                        style={{ 
                                                            fontSize: '10px', 
                                                            padding: '2px 6px',
                                                            background: `${catMeta.color}1a`, 
                                                            color: catMeta.color, 
                                                            borderColor: `${catMeta.color}33` 
                                                        }}
                                                    >
                                                        {catMeta.icon} {catName}
                                                    </span>
                                                )}
                                                <span 
                                                    className="exercise-tag-badge" 
                                                    style={{ fontSize: '10px', padding: '2px 6px', background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)' }}
                                                >
                                                    {equip.icon} {equip.label}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <button 
                                            className="add-icon-btn"
                                            style={{
                                                background: 'rgba(var(--accent-rgb), 0.1)',
                                                border: '1px solid rgba(var(--accent-rgb), 0.25)',
                                                color: 'var(--accent)',
                                                width: '32px',
                                                height: '32px',
                                                borderRadius: '50%',
                                                fontSize: '18px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            +
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Botão Carregar Mais */}
                    {filteredExercises.length > visibleCount && (
                        <div style={{ textAlign: 'center', margin: '20px 0 10px' }}>
                            <button 
                                className="btn-secondary" 
                                onClick={handleLoadMore}
                                style={{ padding: '12px 20px', fontSize: '13px', width: 'auto' }}
                            >
                                📥 Carregar mais exercícios (+40)
                            </button>
                        </div>
                    )}
                </div>

                {/* MODAL DE PRÉ-VISUALIZAÇÃO DO GIF / DETALHES TÉCNICOS */}
                {previewExercise && (() => {
                    const parts = (previewExercise.path || '').split('/');
                    const catName = parts.length > 1 ? parts[1] : '';
                    const catMeta = CATEGORY_META[catName] || { icon: '💪', label: catName, color: 'var(--accent)' };
                    const equip = getEquipmentType(previewExercise);

                    return (
                        <div 
                            className="modal-overlay" 
                            style={{ zIndex: 2000 }} 
                            onClick={(e) => {
                                e.stopPropagation();
                                setPreviewExercise(null);
                            }}
                        >
                            <div 
                                className="modal-sheet" 
                                style={{ height: 'auto', maxHeight: '88vh', padding: '20px' }} 
                                onClick={e => e.stopPropagation()}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                    <div>
                                        <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                                            {catName && (
                                                <span 
                                                    className="exercise-tag-badge"
                                                    style={{ 
                                                        background: `${catMeta.color}1a`, 
                                                        color: catMeta.color, 
                                                        borderColor: `${catMeta.color}33` 
                                                    }}
                                                >
                                                    {catMeta.icon} {catName}
                                                </span>
                                            )}
                                            <span className="exercise-tag-badge" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)' }}>
                                                {equip.icon} {equip.label}
                                            </span>
                                        </div>
                                        <h3 style={{ fontSize: '17px', margin: 0, color: '#fff' }}>{previewExercise.name}</h3>
                                    </div>
                                    <button className="modal-close-btn" onClick={() => setPreviewExercise(null)}>&times;</button>
                                </div>
                                
                                <div style={{ 
                                    width: '100%', 
                                    background: 'var(--bg-tertiary)', 
                                    borderRadius: '14px', 
                                    overflow: 'hidden', 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    minHeight: '260px',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
                                }}>
                                    {previewGifError ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center' }}>
                                            <span style={{ fontSize: '32px', marginBottom: '8px' }}>💪</span>
                                            <span>Guia técnico indisponível em imagem</span>
                                        </div>
                                    ) : (
                                        <img 
                                            src={encodeURI(previewGifSrc)} 
                                            alt={previewExercise.name} 
                                            style={{ width: '100%', maxHeight: '55vh', objectFit: 'contain' }}
                                            onError={handlePreviewGifError}
                                        />
                                    )}
                                </div>

                                {previewExercise.description && (
                                    <div style={{ marginTop: '12px', background: 'rgba(255,255,255,0.02)', padding: '10px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', fontSize: '12px', color: 'var(--text-muted)' }}>
                                        💡 <strong>Orientação:</strong> {previewExercise.description}
                                    </div>
                                )}
                                
                                <button 
                                    className="btn-primary" 
                                    style={{ width: '100%', marginTop: '15px', padding: '14px', fontSize: '15px', fontWeight: 'bold' }}
                                    onClick={() => {
                                        onSelect(previewExercise);
                                        setPreviewExercise(null);
                                    }}
                                >
                                    ➕ Escolher este Exercício
                                </button>
                            </div>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}
