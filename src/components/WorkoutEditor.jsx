import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ExerciseBrowser from './ExerciseBrowser';

export default function WorkoutEditor({ workout, onSave, onCancel }) {
    const [name, setName] = useState(workout ? workout.name : '');
    const [description, setDescription] = useState(workout ? workout.description : '');
    const [coverStyle, setCoverStyle] = useState(workout && workout.coverStyle ? workout.coverStyle : 'geral');
    const [exercises, setExercises] = useState(workout && workout.exercises ? workout.exercises : []);
    const [isBrowserOpen, setIsBrowserOpen] = useState(false);
    const [error, setError] = useState('');

    // Adiciona um exercício selecionado da base
    const handleSelectExercise = (exercise) => {
        const newExercise = {
            name: exercise.name,
            path: exercise.path,
            series: 3,
            reps: 10,
            weight: 0,
            targetWeight: 0,
            notes: ''
        };
        setExercises([...exercises, newExercise]);
        setIsBrowserOpen(false);
    };

    // Remove um exercício do treino
    const handleRemoveExercise = (index) => {
        setExercises(exercises.filter((_, i) => i !== index));
    };

    // Atualiza campos específicos do exercício
    const handleUpdateExercise = (index, field, value) => {
        const updated = exercises.map((ex, i) => {
            if (i === index) {
                return { ...ex, [field]: value };
            }
            return ex;
        });
        setExercises(updated);
    };

    // Move o exercício para cima na lista
    const handleMoveUp = (index) => {
        if (index === 0) return;
        const newExs = [...exercises];
        const temp = newExs[index - 1];
        newExs[index - 1] = newExs[index];
        newExs[index] = temp;
        setExercises(newExs);
    };

    // Move o exercício para baixo na lista
    const handleMoveDown = (index) => {
        if (index === exercises.length - 1) return;
        const newExs = [...exercises];
        const temp = newExs[index + 1];
        newExs[index + 1] = newExs[index];
        newExs[index] = temp;
        setExercises(newExs);
    };

    // Valida e salva o treino
    const handleSave = () => {
        if (!name.trim()) {
            setError('Por favor, informe o nome do treino.');
            return;
        }
        if (exercises.length === 0) {
            setError('Adicione pelo menos um exercício ao treino.');
            return;
        }

        const workoutData = {
            ...workout,
            name: name.trim(),
            description: description.trim(),
            coverStyle,
            exercises
        };

        onSave(workoutData);
    };

    return (
        <div className="workout-editor-container">
            <div className="editor-header">
                <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Nome do Treino (ex: Treino A)" 
                    value={name}
                    onChange={e => {
                        setName(e.target.value);
                        setError('');
                    }}
                />
            </div>
            
            <input 
                type="text" 
                className="input-field" 
                placeholder="Descrição rápida (ex: Foco em Peito e Tríceps)" 
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={{ marginBottom: '15px', fontSize: '14px' }}
            />

            <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '5px', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Imagem de Capa (Categoria)
                </label>
                <select 
                    value={coverStyle} 
                    onChange={e => setCoverStyle(e.target.value)}
                    style={{
                        width: '100%',
                        background: 'var(--bg-secondary)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 'var(--radius-md)',
                        padding: '10px 14px',
                        color: '#fff',
                        fontFamily: 'var(--font-sans)',
                        fontSize: '14px',
                        outline: 'none',
                        cursor: 'pointer'
                    }}
                >
                    <option value="geral">🏋️‍♂️ Geral (Halteres)</option>
                    <option value="peito">🍒 Peito (Supino)</option>
                    <option value="costas">🦅 Costas (Puxada)</option>
                    <option value="pernas">🍗 Pernas (Agachamento)</option>
                    <option value="core">🛡️ Core (Abdominais)</option>
                    <option value="cardio">🏃‍♂️ Cardio (Queima/Corrida)</option>
                </select>
            </div>

            <div className="exercise-list-editor">
                {exercises.map((ex, index) => {
                    const baseMediaUrl = import.meta.env.VITE_MEDIA_URL || 'https://www.gifdotreino.com';
                    const thumbUrl = encodeURI(`${baseMediaUrl}/thumbnails/${ex.name}.png`);
                    return (
                        <div key={index} className="exercise-editor-card">
                            <div className="drag-handle" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <button 
                                    onClick={() => handleMoveUp(index)} 
                                    disabled={index === 0}
                                    style={{ background: 'none', color: index === 0 ? 'rgba(255,255,255,0.1)' : 'var(--text-muted)' }}
                                >
                                    ▲
                                </button>
                                <button 
                                    onClick={() => handleMoveDown(index)} 
                                    disabled={index === exercises.length - 1}
                                    style={{ background: 'none', color: index === exercises.length - 1 ? 'rgba(255,255,255,0.1)' : 'var(--text-muted)' }}
                                >
                                    ▼
                                </button>
                            </div>

                            <div className="preview-thumbnail">
                                <img 
                                    src={thumbUrl} 
                                    alt={ex.name} 
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60"><rect width="60" height="60" fill="%23191c28"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="10" fill="%239ca3af">GIF</text></svg>';
                                    }}
                                />
                            </div>

                            <div className="info">
                                <div className="info-header">
                                    <h4>{ex.name}</h4>
                                    <button 
                                        className="remove-btn"
                                        onClick={() => handleRemoveExercise(index)}
                                    >
                                        &times;
                                    </button>
                                </div>

                                <div className="exercise-inputs-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                                    <div className="editor-input-group">
                                        <label>Séries</label>
                                        <input 
                                            type="number" 
                                            value={ex.series}
                                            onChange={e => handleUpdateExercise(index, 'series', parseInt(e.target.value) || 0)}
                                            min="1"
                                        />
                                    </div>
                                    <div className="editor-input-group">
                                        <label>Reps</label>
                                        <input 
                                            type="number" 
                                            value={ex.reps}
                                            onChange={e => handleUpdateExercise(index, 'reps', parseInt(e.target.value) || 0)}
                                            min="1"
                                        />
                                    </div>
                                    <div className="editor-input-group">
                                        <label>Carga</label>
                                        <input 
                                            type="number" 
                                            value={ex.weight === 0 ? '' : ex.weight}
                                            placeholder="0"
                                            onChange={e => handleUpdateExercise(index, 'weight', parseFloat(e.target.value) || 0)}
                                            min="0"
                                        />
                                    </div>
                                    <div className="editor-input-group">
                                        <label>Meta</label>
                                        <input 
                                            type="number" 
                                            value={ex.targetWeight === 0 || !ex.targetWeight ? '' : ex.targetWeight}
                                            placeholder="kg"
                                            onChange={e => handleUpdateExercise(index, 'targetWeight', parseFloat(e.target.value) || 0)}
                                            min="0"
                                        />
                                    </div>
                                </div>

                                <textarea 
                                    className="notes-textarea" 
                                    placeholder="Observações de execução..."
                                    value={ex.notes}
                                    onChange={e => handleUpdateExercise(index, 'notes', e.target.value)}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {error && (
                <div style={{ color: '#f87171', fontSize: '14px', marginBottom: '15px', fontWeight: '500' }}>
                    ⚠️ {error}
                </div>
            )}

            <button 
                className="btn-secondary" 
                onClick={() => setIsBrowserOpen(true)}
                style={{ marginBottom: '20px', gap: '8px' }}
            >
                + Adicionar Exercício
            </button>

            <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn-primary" onClick={handleSave}>
                    Salvar Treino
                </button>
                <button className="btn-secondary" onClick={onCancel}>
                    Cancelar
                </button>
            </div>

            {isBrowserOpen && (
                <ExerciseBrowser 
                    onSelect={handleSelectExercise} 
                    onClose={() => setIsBrowserOpen(false)}
                />
            )}
        </div>
    );
}
