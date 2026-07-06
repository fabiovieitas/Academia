import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const normalizeString = (str) => {
    return str
        ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
        : "";
};

export default function ExerciseBrowser({ onSelect, onClose, initialCategory = 'all', lockCategory = false }) {
    const { exercises, favorites, toggleFavorite } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [visibleCount, setVisibleCount] = useState(50); // Paginação de 50 em 50 para performance
    const [previewExercise, setPreviewExercise] = useState(null); // Estado para o modal de pré-visualização
    const [previewGifError, setPreviewGifError] = useState(false);
    const [previewGifSrc, setPreviewGifSrc] = useState('');
    const [previewGifStage, setPreviewGifStage] = useState(0); // 0: local, 1: remote gif, 2: remote thumb, 3: error

    useEffect(() => {
        setPreviewGifError(false);
        setPreviewGifStage(0);
        if (previewExercise) {
            const path = previewExercise.path;
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
            if (previewGifStage === 0) {
                setPreviewGifStage(1);
                const path = previewExercise.path;
                const baseMediaUrl = import.meta.env.VITE_MEDIA_URL || 'https://www.gifdotreino.com';
                const remoteSrc = path.startsWith('http') ? path : `${baseMediaUrl}/${path}`;
                setPreviewGifSrc(remoteSrc);
            } else if (previewGifStage === 1) {
                setPreviewGifStage(2);
                const cleanName = previewExercise.name.replace(/^(nível\s+\d+:|mobilidade:|técnica:)\s*/i, "").trim();
                const baseMediaUrl = import.meta.env.VITE_MEDIA_URL || 'https://www.gifdotreino.com';
                const thumbnailSrc = `${baseMediaUrl}/thumbnails/${cleanName}.png`;
                setPreviewGifSrc(thumbnailSrc);
            } else {
                setPreviewGifError(true);
            }
        }
    };

    // 1. Extrai categorias dinâmicas da base de dados de exercícios
    const categories = useMemo(() => {
        if (lockCategory) {
            return [initialCategory];
        }
        const cats = exercises
            .map(ex => {
                const parts = ex.path.split('/');
                return parts.length > 1 ? parts[1] : null;
            })
            .filter(Boolean);
        return ['all', 'favorites', ...Array.from(new Set(cats)).sort()];
    }, [exercises, lockCategory, initialCategory]);

    // 2. Filtra a lista com base no termo de busca e categoria selecionada
    const filteredExercises = useMemo(() => {
        return exercises.filter(ex => {
            const parts = ex.path.split('/');
            const category = parts.length > 1 ? parts[1] : '';
            
            // Filtro de categoria
            if (selectedCategory === 'favorites') {
                if (!favorites.includes(ex.name)) return false;
            } else if (selectedCategory !== 'all' && category !== selectedCategory) {
                return false;
            }

            // Filtro de busca textual (ignora maiúsculas/minúsculas e acentos)
            if (searchQuery.trim() !== '') {
                const query = normalizeString(searchQuery);
                return (
                    normalizeString(ex.name).includes(query) ||
                    (ex.description && normalizeString(ex.description).includes(query))
                );
            }

            return true;
        });
    }, [exercises, searchQuery, selectedCategory, favorites]);

    // Reseta paginação quando os filtros mudam
    React.useEffect(() => {
        setVisibleCount(50);
    }, [searchQuery, selectedCategory]);

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 50);
    };

    const formatCategoryName = (cat) => {
        if (cat === 'all') return 'Todos';
        if (cat === 'favorites') return '★ Favoritos';
        return cat;
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-sheet" onClick={e => e.stopPropagation()}>
                <div className="modal-header-sheet">
                    <h3>Selecionar Exercício</h3>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>
                
                <div className="search-filter-box">
                    <input 
                        type="text" 
                        className="input-field" 
                        placeholder="Pesquisar (dica: digite 'máquina' ou 'cabo' para aparelhos)..." 
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        autoFocus
                    />
                    
                    <div className="filter-chips-wrapper">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {formatCategoryName(cat)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="exercise-search-results">
                    {filteredExercises.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                            Nenhum exercício encontrado.
                        </div>
                    ) : (
                        <>
                            {filteredExercises.slice(0, visibleCount).map((exercise, index) => {
                                const isFav = favorites.includes(exercise.name);
                                const isLocalThumb = exercise.thumbnail && (exercise.thumbnail.startsWith('/') || exercise.thumbnail.startsWith('Exercicios/') || exercise.thumbnail.startsWith('http'));
                                const baseMediaUrl = import.meta.env.VITE_MEDIA_URL || 'https://www.gifdotreino.com';
                                const thumbUrl = isLocalThumb 
                                    ? encodeURI(exercise.thumbnail.startsWith('http') ? exercise.thumbnail : `/${exercise.thumbnail}`)
                                    : encodeURI(`${baseMediaUrl}/${exercise.thumbnail}`);
                                
                                return (
                                    <div 
                                        key={index} 
                                        className="exercise-result-row"
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
                                                color: isFav ? 'var(--accent)' : 'rgba(255,255,255,0.2)',
                                                marginRight: '5px',
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
                                            style={{ position: 'relative', cursor: 'zoom-in' }}
                                        >
                                            <img 
                                                src={thumbUrl} 
                                                alt={exercise.name} 
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><rect width="50" height="50" fill="%23191c28"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="10" fill="%239ca3af">GIF</text></svg>';
                                                }}
                                            />
                                            <div style={{ position: 'absolute', bottom: '2px', right: '2px', background: 'rgba(0,0,0,0.6)', borderRadius: '50%', padding: '2px', fontSize: '10px' }}>🔍</div>
                                        </div>
                                        
                                        <div className="details">
                                            <h4>{exercise.name}</h4>
                                            <p>{exercise.path.split('/')[1]}</p>
                                        </div>
                                        
                                        <div className="add-icon">+</div>
                                    </div>
                                );
                            })}
                            
                            {filteredExercises.length > visibleCount && (
                                <button 
                                    className="btn-secondary" 
                                    onClick={handleLoadMore}
                                    style={{ margin: '20px 0', padding: '10px' }}
                                >
                                    Carregar mais exercícios (+50)
                                </button>
                            )}
                        </>
                    )}
                </div>

                {/* MODAL DE PREVIEW DO GIF (Sobreposto) */}
                {previewExercise && (
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
                            style={{ height: 'auto', maxHeight: '80vh', padding: '20px' }} 
                            onClick={e => e.stopPropagation()}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <h3 style={{ fontSize: '18px', maxWidth: '85%' }}>{previewExercise.name}</h3>
                                <button className="modal-close-btn" onClick={() => setPreviewExercise(null)}>&times;</button>
                            </div>
                            
                            <div style={{ width: '100%', background: 'var(--bg-tertiary)', borderRadius: '12px', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '250px' }}>
                                {previewGifError ? (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '13px' }}>
                                        💪 Guia técnico indisponível em imagem
                                    </div>
                                ) : (
                                    <img 
                                        src={encodeURI(previewGifSrc)} 
                                        alt={previewExercise.name}
                                        style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                                        onError={handlePreviewGifError}
                                    />
                                )}
                            </div>
                            
                            <button 
                                className="btn-primary" 
                                style={{ width: '100%', marginTop: '20px', padding: '15px', fontSize: '16px' }}
                                onClick={() => {
                                    onSelect(previewExercise);
                                    setPreviewExercise(null);
                                }}
                            >
                                ➕ Escolher este Exercício
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
