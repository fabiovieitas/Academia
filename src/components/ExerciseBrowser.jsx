import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';

export default function ExerciseBrowser({ onSelect, onClose, initialCategory = 'all', lockCategory = false }) {
    const { exercises, favorites, toggleFavorite } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [visibleCount, setVisibleCount] = useState(50); // Paginação de 50 em 50 para performance

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

            // Filtro de busca textual (ignora maiúsculas/minúsculas)
            if (searchQuery.trim() !== '') {
                const query = searchQuery.toLowerCase();
                return (
                    ex.name.toLowerCase().includes(query) ||
                    (ex.description && ex.description.toLowerCase().includes(query))
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
                                const thumbUrl = encodeURI(`https://www.gifdotreino.com/${exercise.thumbnail}`);
                                
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
                                        
                                        <div className="thumb">
                                            <img 
                                                src={thumbUrl} 
                                                alt={exercise.name} 
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50"><rect width="50" height="50" fill="%23191c28"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="10" fill="%239ca3af">GIF</text></svg>';
                                                }}
                                            />
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
            </div>
        </div>
    );
}
