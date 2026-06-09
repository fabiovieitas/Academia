import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';

// Reusable SVG Line Chart Component
const SVGChart = ({ data, labelText }) => {
    if (!data || data.length === 0) {
        return (
            <div style={{
                textAlign: 'center',
                padding: '30px 10px',
                color: 'var(--text-muted)',
                fontSize: '13px',
                background: 'rgba(255,255,255,0.02)',
                borderRadius: '8px',
                border: '1px dashed rgba(255,255,255,0.05)'
            }}>
                Nenhum dado suficiente para gerar o gráfico.
            </div>
        );
    }
    
    const width = 450;
    const height = 200;
    const paddingLeft = 35;
    const paddingRight = 15;
    const paddingTop = 25;
    const paddingBottom = 25;
    
    const vals = data.map(d => d.value);
    const minVal = Math.min(...vals) * 0.95;
    const maxVal = Math.max(...vals) * 1.05;
    const valRange = maxVal - minVal || 1;
    
    const points = data.map((d, index) => {
        const x = paddingLeft + (index / Math.max(1, data.length - 1)) * (width - paddingLeft - paddingRight);
        const y = height - paddingBottom - ((d.value - minVal) / valRange) * (height - paddingTop - paddingBottom);
        return { x, y, val: d.value, label: d.label };
    });
    
    // Construct line path
    let dPath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        dPath += ` L ${points[i].x} ${points[i].y}`;
    }
    
    // Construct area path
    const dArea = `${dPath} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;
    
    return (
        <div className="svg-chart-container" style={{ marginTop: '10px' }}>
            <h4 style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: '500' }}>
                Progresso: {labelText}
            </h4>
            <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
                <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.0" />
                    </linearGradient>
                </defs>
                
                {/* Horizontal Gridlines */}
                <line x1={paddingLeft} y1={paddingTop} x2={width - paddingRight} y2={paddingTop} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1={paddingLeft} y1={(height - paddingBottom - paddingTop) / 2 + paddingTop} x2={width - paddingRight} y2={(height - paddingBottom - paddingTop) / 2 + paddingTop} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                
                {/* Y Axis Labels */}
                <text x={paddingLeft - 8} y={paddingTop + 4} fontSize="9" fill="var(--text-muted)" textAnchor="end">
                    {Math.round(maxVal)}
                </text>
                <text x={paddingLeft - 8} y={(height - paddingBottom - paddingTop) / 2 + paddingTop + 4} fontSize="9" fill="var(--text-muted)" textAnchor="end">
                    {Math.round((maxVal + minVal) / 2)}
                </text>
                <text x={paddingLeft - 8} y={height - paddingBottom + 4} fontSize="9" fill="var(--text-muted)" textAnchor="end">
                    {Math.round(minVal)}
                </text>

                {/* Area Gradient Fill */}
                <path d={dArea} fill="url(#chartGrad)" />
                
                {/* Line Path */}
                <path d={dPath} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                
                {/* Data Points */}
                {points.map((p, i) => (
                    <g key={i}>
                        <circle cx={p.x} cy={p.y} r="4" fill="#fff" stroke="var(--accent)" strokeWidth="2" />
                        {/* Tooltip value */}
                        <text x={p.x} y={p.y - 8} fontSize="9" fill="#fff" fontWeight="700" textAnchor="middle" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                            {p.val}
                        </text>
                        {/* Dates on X Axis */}
                        {(i === 0 || i === points.length - 1 || points.length <= 5) && (
                            <text x={p.x} y={height - 8} fontSize="9" fill="var(--text-muted)" textAnchor="middle">
                                {p.label}
                            </text>
                        )}
                    </g>
                ))}
            </svg>
        </div>
    );
};

// Muscle Heatmap component using dynamic colors
const MuscleHeatmap = ({ workedSets }) => {
    const getColorForSets = (sets) => {
        if (!sets || sets === 0) return 'rgba(255,255,255,0.04)';
        if (sets <= 3) return 'rgba(var(--accent-rgb), 0.25)';
        if (sets <= 8) return 'rgba(var(--accent-rgb), 0.6)';
        return 'var(--accent)';
    };

    return (
        <div className="heatmap-row" style={{
            display: 'flex',
            justifyContent: 'space-around',
            padding: '15px 0',
            background: 'var(--bg-secondary)',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.03)'
        }}>
            {/* Front View */}
            <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Frente</p>
                <svg width="100" height="200" viewBox="0 0 100 200">
                    {/* Head */}
                    <rect x="42" y="5" width="16" height="16" rx="8" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" />
                    {/* Neck */}
                    <rect x="47" y="21" width="6" height="5" fill="rgba(255,255,255,0.08)" />
                    
                    {/* Shoulders */}
                    <circle cx="28" cy="32" r="5" fill={getColorForSets(workedSets.Ombros)} stroke="rgba(255,255,255,0.1)" />
                    <circle cx="72" cy="32" r="5" fill={getColorForSets(workedSets.Ombros)} stroke="rgba(255,255,255,0.1)" />
                    
                    {/* Chest */}
                    <path d="M35,26 L49,26 L49,42 L35,38 Z" fill={getColorForSets(workedSets.Peitoral)} stroke="rgba(255,255,255,0.1)" />
                    <path d="M51,26 L65,26 L65,38 L51,42 Z" fill={getColorForSets(workedSets.Peitoral)} stroke="rgba(255,255,255,0.1)" />
                    
                    {/* Biceps */}
                    <rect x="24" y="38" width="6" height="18" rx="2" fill={getColorForSets(workedSets.Bíceps)} stroke="rgba(255,255,255,0.1)" />
                    <rect x="70" y="38" width="6" height="18" rx="2" fill={getColorForSets(workedSets.Bíceps)} stroke="rgba(255,255,255,0.1)" />
                    
                    {/* Forearms */}
                    <rect x="22" y="57" width="5" height="16" rx="2" fill="rgba(255,255,255,0.06)" />
                    <rect x="73" y="57" width="5" height="16" rx="2" fill="rgba(255,255,255,0.06)" />
                    
                    {/* Abs */}
                    <rect x="40" y="44" width="20" height="24" rx="2" fill={getColorForSets(workedSets.Abdominais)} stroke="rgba(255,255,255,0.1)" />
                    
                    {/* Thighs */}
                    <rect x="38" y="76" width="10" height="35" rx="3" fill={getColorForSets(workedSets.Pernas)} stroke="rgba(255,255,255,0.1)" />
                    <rect x="52" y="76" width="10" height="35" rx="3" fill={getColorForSets(workedSets.Pernas)} stroke="rgba(255,255,255,0.1)" />
                    
                    {/* Calves */}
                    <rect x="40" y="118" width="7" height="26" rx="2" fill={getColorForSets(workedSets.Pernas)} stroke="rgba(255,255,255,0.1)" />
                    <rect x="53" y="118" width="7" height="26" rx="2" fill={getColorForSets(workedSets.Pernas)} stroke="rgba(255,255,255,0.1)" />
                </svg>
            </div>

            {/* Back View */}
            <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Costas</p>
                <svg width="100" height="200" viewBox="0 0 100 200">
                    {/* Head */}
                    <rect x="42" y="5" width="16" height="16" rx="8" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.12)" />
                    {/* Neck */}
                    <rect x="47" y="21" width="6" height="5" fill="rgba(255,255,255,0.08)" />
                    
                    {/* Shoulders */}
                    <circle cx="28" cy="32" r="5" fill={getColorForSets(workedSets.Ombros)} stroke="rgba(255,255,255,0.1)" />
                    <circle cx="72" cy="32" r="5" fill={getColorForSets(workedSets.Ombros)} stroke="rgba(255,255,255,0.1)" />
                    
                    {/* Back Upper */}
                    <path d="M34,26 L66,26 L60,46 L40,46 Z" fill={getColorForSets(workedSets.Costas)} stroke="rgba(255,255,255,0.1)" />
                    
                    {/* Triceps */}
                    <rect x="24" y="38" width="6" height="18" rx="2" fill={getColorForSets(workedSets.Tríceps)} stroke="rgba(255,255,255,0.1)" />
                    <rect x="70" y="38" width="6" height="18" rx="2" fill={getColorForSets(workedSets.Tríceps)} stroke="rgba(255,255,255,0.1)" />
                    
                    {/* Forearms */}
                    <rect x="22" y="57" width="5" height="16" rx="2" fill="rgba(255,255,255,0.06)" />
                    <rect x="73" y="57" width="5" height="16" rx="2" fill="rgba(255,255,255,0.06)" />
                    
                    {/* Lower Back */}
                    <rect x="40" y="48" width="20" height="20" rx="2" fill={getColorForSets(workedSets.Costas)} stroke="rgba(255,255,255,0.1)" />
                    
                    {/* Glutes */}
                    <rect x="38" y="70" width="11" height="12" rx="3" fill={getColorForSets(workedSets.Glúteos)} stroke="rgba(255,255,255,0.1)" />
                    <rect x="51" y="70" width="11" height="12" rx="3" fill={getColorForSets(workedSets.Glúteos)} stroke="rgba(255,255,255,0.1)" />
                    
                    {/* Hamstrings */}
                    <rect x="38" y="84" width="10" height="30" rx="3" fill={getColorForSets(workedSets.Pernas)} stroke="rgba(255,255,255,0.1)" />
                    <rect x="52" y="84" width="10" height="30" rx="3" fill={getColorForSets(workedSets.Pernas)} stroke="rgba(255,255,255,0.1)" />
                    
                    {/* Calves */}
                    <rect x="40" y="118" width="7" height="26" rx="2" fill={getColorForSets(workedSets.Pernas)} stroke="rgba(255,255,255,0.1)" />
                    <rect x="53" y="118" width="7" height="26" rx="2" fill={getColorForSets(workedSets.Pernas)} stroke="rgba(255,255,255,0.1)" />
                </svg>
            </div>
        </div>
    );
};

const IAPredictionWidget = ({ measurements, profileDetails }) => {
    const getIAPrediction = () => {
        if (!measurements || measurements.length < 2) return null;
        
        const validBF = measurements.filter(m => m.bodyFat);
        if (validBF.length < 2) return null;
        
        const first = validBF[0];
        const last = validBF[validBF.length - 1];
        
        const days = Math.round((new Date(last.date) - new Date(first.date)) / (1000 * 60 * 60 * 24));
        if (days <= 0) return null;
        
        const bfDiff = last.bodyFat - first.bodyFat;
        const ratePerDay = bfDiff / days;
        
        const weightValid = measurements.filter(m => m.weight);
        let weightDiff = 0;
        let weightRatePerDay = 0;
        if (weightValid.length >= 2) {
            const wFirst = weightValid[0];
            const wLast = weightValid[weightValid.length - 1];
            weightDiff = wLast.weight - wFirst.weight;
            weightRatePerDay = weightDiff / days;
        }

        const isFeminino = profileDetails?.gender === 'feminino';
        const isLoss = profileDetails?.objective === 'emagrecimento';
        
        const targetBF = isLoss ? (isFeminino ? 22 : 14) : (isFeminino ? 18 : 10);
        const currentBF = last.bodyFat;
        
        if (isLoss && ratePerDay >= 0) {
            return {
                type: 'warning',
                text: "Seu percentual de gordura (BF) subiu ou manteve-se estável nos últimos exames. Dica FitLife: Ajuste seu déficit calórico e aumente os cardios sugeridos nas notas do seu treino!"
            };
        }
        
        if (!isLoss && ratePerDay <= 0 && weightRatePerDay <= 0) {
            return {
                type: 'warning',
                text: "Você está em processo de hipertrofia mas seu peso ou gordura corporal está diminuindo. Dica FitLife: Aumente o consumo de calorias diárias e bata suas metas de proteína para construir massa magra!"
            };
        }
        
        const bfRemaining = targetBF - currentBF;
        if (Math.abs(bfRemaining) < 0.5) {
            return {
                type: 'success',
                text: `Parabéns! Você alcançou uma excelente faixa de gordura corporal (${currentBF}%). Continue mantendo a constância nos treinos ABC para consolidar os resultados!`
            };
        }

        const daysToTarget = Math.round(bfRemaining / ratePerDay);
        if (daysToTarget <= 0 || isNaN(daysToTarget) || !isFinite(daysToTarget)) {
            return null;
        }
        
        const weeksToTarget = (daysToTarget / 7).toFixed(1);
        
        return {
            type: 'info',
            text: `Análise de Evolução: No ritmo atual de ${Math.abs(ratePerDay * 7).toFixed(2)}% de alteração de BF por semana, você levará cerca de ${weeksToTarget} semanas (${daysToTarget} dias) para atingir a meta ideal de ${targetBF}% de BF. 🚀`
        };
    };

    const prediction = getIAPrediction();
    if (!prediction) return null;

    const bgMap = {
        warning: 'rgba(239, 68, 68, 0.08)',
        success: 'rgba(52, 211, 153, 0.08)',
        info: 'rgba(var(--accent-rgb), 0.06)'
    };
    const borderMap = {
        warning: 'rgba(239, 68, 68, 0.2)',
        success: 'rgba(52, 211, 153, 0.2)',
        info: 'rgba(var(--accent-rgb), 0.15)'
    };
    const colorMap = {
        warning: '#f87171',
        success: '#34d399',
        info: 'var(--accent)'
    };
    const emojiMap = {
        warning: '⚠️',
        success: '🏆',
        info: '🤖'
    };

    return (
        <div style={{
            background: bgMap[prediction.type],
            border: `1px solid ${borderMap[prediction.type]}`,
            borderRadius: '16px',
            padding: '15px',
            marginBottom: '20px',
            fontSize: '13px',
            color: prediction.type === 'info' ? '#f3f4f6' : colorMap[prediction.type],
            lineHeight: '1.5',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px'
        }}>
            <span style={{ fontSize: '20px' }}>{emojiMap[prediction.type]}</span>
            <div>
                <strong style={{ display: 'block', color: colorMap[prediction.type], marginBottom: '3px' }}>
                    {prediction.type === 'info' ? 'Previsão de Metas FitLife' : (prediction.type === 'success' ? 'Meta Atingida!' : 'Alerta de Evolução')}
                </strong>
                {prediction.text}
            </div>
        </div>
    );
};

const PersonalRecordsWidget = ({ personalRecords }) => {
    const prEntries = Object.entries(personalRecords);
    if (prEntries.length === 0) return null;

    return (
        <div className="card" style={{ padding: '15px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🏆 Galeria de Recordes Pessoais (PR)
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '15px' }}>
                Suas maiores marcas de carga e repetições registradas durante os treinos.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {prEntries.map(([exercise, data]) => (
                    <div key={exercise} style={{
                        background: 'var(--bg-secondary)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                    }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }} title={exercise}>
                            {exercise}
                        </span>
                        <strong style={{ fontSize: '15px', color: 'var(--accent)', marginTop: '4px' }}>
                            {data.weight} kg <span style={{ fontSize: '11px', color: '#fff', fontWeight: 'normal' }}>x {data.reps} rep</span>
                        </strong>
                        <span style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {new Date(data.date).toLocaleDateString('pt-BR')}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const EvolutionPhotosTab = ({ evolutionPhotos, saveEvolutionPhotos }) => {
    const [category, setCategory] = useState('frente');
    const [sliderVal, setSliderVal] = useState(50);
    const [photoAId, setPhotoAId] = useState('');
    const [photoBId, setPhotoBId] = useState('');

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 450;
                const MAX_HEIGHT = 450;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Comprime como JPEG com qualidade de 65% para economizar armazenamento
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.65);

                const newPhoto = {
                    id: Date.now().toString(),
                    date: new Date().toISOString().split('T')[0],
                    category,
                    image: compressedBase64
                };

                saveEvolutionPhotos([newPhoto, ...evolutionPhotos]);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    const handleDeletePhoto = (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta foto de evolução?')) {
            const updated = evolutionPhotos.filter(p => p.id !== id);
            saveEvolutionPhotos(updated);
            if (photoAId === id) setPhotoAId('');
            if (photoBId === id) setPhotoBId('');
        }
    };

    const filteredPhotos = evolutionPhotos.filter(p => p.category === category);
    
    // Obter as duas fotos para comparação
    const photoA = filteredPhotos.find(p => p.id === photoAId);
    const photoB = filteredPhotos.find(p => p.id === photoBId);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="card" style={{ padding: '15px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>📸 Fotos por Ângulo</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '15px' }}>
                    Selecione a pose corporal e faça o upload da foto correspondente.
                </p>
                
                {/* Seleção de Categoria de Poses */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
                    {['frente', 'lado', 'costas'].map(cat => (
                        <button
                            key={cat}
                            onClick={() => {
                                setCategory(cat);
                                setPhotoAId('');
                                setPhotoBId('');
                            }}
                            style={{
                                flex: 1,
                                padding: '8px 4px',
                                borderRadius: '8px',
                                fontSize: '11px',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                background: category === cat ? 'rgba(var(--accent-rgb), 0.15)' : 'rgba(255,255,255,0.03)',
                                color: category === cat ? 'var(--accent)' : 'var(--text-muted)',
                                border: category === cat ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.05)',
                                cursor: 'pointer'
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Upload Campo */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    border: '1px dashed rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.01)',
                    position: 'relative'
                }}>
                    <span style={{ fontSize: '24px', marginBottom: '8px' }}>📤</span>
                    <span style={{ fontSize: '12px', color: '#fff', fontWeight: 'bold' }}>Clique para enviar foto</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>Pose atual: {category.toUpperCase()}</span>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handlePhotoUpload}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            opacity: 0,
                            cursor: 'pointer'
                        }}
                    />
                </div>
            </div>

            {/* Comparador de Fotos (Slider) */}
            {filteredPhotos.length >= 2 && (
                <div className="card" style={{ padding: '15px' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>↔️ Comparador Deslizante</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '15px' }}>
                        Selecione as fotos (Antiga na Esquerda, Recente na Direita) e arraste o slider.
                    </p>

                    <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '5px' }}>Foto A (Antiga)</label>
                            <select 
                                className="input-field" 
                                value={photoAId} 
                                onChange={e => setPhotoAId(e.target.value)}
                                style={{ padding: '8px 12px', fontSize: '12px' }}
                            >
                                <option value="">Selecione...</option>
                                {filteredPhotos.map(p => (
                                    <option key={p.id} value={p.id}>{new Date(p.date).toLocaleDateString('pt-BR')}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '5px' }}>Foto B (Recente)</label>
                            <select 
                                className="input-field" 
                                value={photoBId} 
                                onChange={e => setPhotoBId(e.target.value)}
                                style={{ padding: '8px 12px', fontSize: '12px' }}
                            >
                                <option value="">Selecione...</option>
                                {filteredPhotos.map(p => (
                                    <option key={p.id} value={p.id}>{new Date(p.date).toLocaleDateString('pt-BR')}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {photoA && photoB ? (
                        <div style={{ position: 'relative', width: '100%', aspectRatio: '0.8', overflow: 'hidden', borderRadius: '12px', background: '#000', border: '1px solid rgba(255,255,255,0.08)' }}>
                            {/* Foto Antiga (A) - Esquerda */}
                            <img src={photoA.image} alt="Foto Antiga" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain' }} />
                            
                            {/* Foto Recente (B) - Direita (Sobreposição com clipPath) */}
                            <img 
                                src={photoB.image} 
                                alt="Foto Recente" 
                                style={{ 
                                    position: 'absolute', 
                                    top: 0, 
                                    left: 0, 
                                    width: '100%', 
                                    height: '100%', 
                                    objectFit: 'contain',
                                    clipPath: `polygon(0 0, ${sliderVal}% 0, ${sliderVal}% 100%, 0 100%)`
                                }} 
                            />
                            
                            {/* Linha divisória no meio */}
                            <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${sliderVal}%`, width: '2px', background: 'var(--accent)', pointerEvents: 'none', zIndex: 5, boxShadow: '0 0 8px var(--accent)' }} />
                            
                            {/* Slider Invisível e Gigante */}
                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={sliderVal} 
                                onChange={e => setSliderVal(parseInt(e.target.value))} 
                                style={{ 
                                    position: 'absolute', 
                                    top: 0, 
                                    left: 0, 
                                    width: '100%', 
                                    height: '100%', 
                                    opacity: 0, 
                                    cursor: 'ew-resize', 
                                    zIndex: 10 
                                }} 
                            />
                        </div>
                    ) : (
                        <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', borderRadius: '12px', color: 'var(--text-muted)', fontSize: '13px', border: '1px dashed rgba(255,255,255,0.05)', textAlign: 'center', padding: '20px' }}>
                            Escolha duas fotos diferentes nos campos acima para comparar o antes e depois com o controle deslizante.
                        </div>
                    )}
                </div>
            )}

            {/* Histórico da Categoria */}
            <div className="card" style={{ padding: '15px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>📋 Fotos Cadastradas</h3>
                {filteredPhotos.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
                        Nenhuma foto registrada para a pose de **{category}**.
                    </p>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        {filteredPhotos.map(p => (
                            <div key={p.id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <img src={p.image} alt={category} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', padding: '4px', fontSize: '9px', textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>
                                    {new Date(p.date).toLocaleDateString('pt-BR')}
                                </div>
                                <button
                                    onClick={() => handleDeletePhoto(p.id)}
                                    style={{
                                        position: 'absolute',
                                        top: '4px',
                                        right: '4px',
                                        background: 'rgba(0,0,0,0.8)',
                                        color: '#f87171',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '18px',
                                        height: '18px',
                                        fontSize: '10px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const CalisthenicsSkillsTab = ({ calisthenicsSkills, saveCalisthenicsSkills }) => {
    const [expandedSkill, setExpandedSkill] = useState(null);

    const skillsData = [
        {
            name: "Frog Stand (Corvo)",
            level: "Iniciante",
            desc: "Equilíbrio de sustentação do peso corporal sobre as mãos com cotovelos servindo de apoio para as coxas/joelhos. Prepara para apoio vertical.",
            requirements: [
                { name: "Pike Push-up (Flexão Pike)", reps: "3x8 reps" },
                { name: "Flexão diamante", reps: "3x12 reps" },
                { name: "Prancha abdominal", reps: "60 segundos" }
            ]
        },
        {
            name: "L-Sit",
            level: "Intermediário",
            desc: "Sustentar o corpo nas barras paralelas ou no chão mantendo os braços esticados e as pernas esticadas paralelas ao chão formando um L.",
            requirements: [
                { name: "Sustentação na paralela com pernas esticadas", reps: "30 segundos" },
                { name: "Abdominais infra na paralela", reps: "3x12 reps" },
                { name: "Contração abdominal isométrica", reps: "45 segundos" }
            ]
        },
        {
            name: "Handstand (Parada de Mão)",
            level: "Intermediário",
            desc: "Equilíbrio vertical completo com sustentação integral do corpo sobre as mãos sem apoios externos.",
            requirements: [
                { name: "Sustentação na parede de cabeça para baixo", reps: "60 segundos" },
                { name: "Pike Push-up (Flexão Pike)", reps: "3x12 reps" },
                { name: "Estabilidade de Punhos e Core", reps: "Nível avançado" }
            ]
        },
        {
            name: "Human Flag (Bandeira Humana)",
            level: "Avançado",
            desc: "Segurar em um mastro vertical ou espaldar lateral e elevar o corpo até que ele fique em linha reta e horizontal, perpendicular ao mastro.",
            requirements: [
                { name: "Elevação lateral na parede", reps: "3x10 reps" },
                { name: "Puxada escapular na barra fixa", reps: "3x15 reps" },
                { name: "Paralela", reps: "3x12 reps" }
            ]
        },
        {
            name: "Muscle Up",
            level: "Avançado",
            desc: "Barra fixa explosiva onde o corpo sobe até que a barra esteja na altura do quadril, terminando na posição de suporte na paralela.",
            requirements: [
                { name: "Barra Fixa com Pegada Supinada (Explosiva)", reps: "15 reps seguidas" },
                { name: "Paralela (Dips) com amplitude máxima", reps: "15 reps" },
                { name: "Barra fixa explosiva até o peito", reps: "5 reps" }
            ]
        }
    ];

    const handleUpdateStatus = (skillName, nextStatus) => {
        const updated = {
            ...calisthenicsSkills,
            [skillName]: nextStatus
        };
        saveCalisthenicsSkills(updated);
    };

    const getStatusStyle = (status) => {
        if (status === 'dominado') return { color: '#34d399', bg: 'rgba(52, 211, 153, 0.15)', border: '1px solid rgba(52, 211, 153, 0.3)', dot: '🏆' };
        if (status === 'treinando') return { color: '#f59e0b', bg: 'rgba(234, 179, 8, 0.15)', border: '1px solid rgba(234, 179, 8, 0.3)', dot: '⏳' };
        return { color: 'var(--text-muted)', bg: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', dot: '🔒' };
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="card" style={{ padding: '15px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '4px' }}>🤸 Árvore de Skills de Calistenia</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '15px' }}>
                    Sua jornada para alcançar movimentos complexos. Monitore pré-requisitos e seu progresso atual.
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {skillsData.map((skill, idx) => {
                        const status = calisthenicsSkills[skill.name] || 'bloqueado';
                        const style = getStatusStyle(status);
                        const isExpanded = expandedSkill === skill.name;

                        return (
                            <div key={idx} style={{
                                background: 'var(--bg-secondary)',
                                border: isExpanded ? '1px solid var(--accent)' : '1px solid rgba(255,255,255,0.05)',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                transition: 'var(--transition)'
                            }}>
                                {/* Cabeçalho da Skill */}
                                <div 
                                    onClick={() => setExpandedSkill(isExpanded ? null : skill.name)}
                                    style={{
                                        padding: '12px 15px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <div>
                                        <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            {skill.name}
                                        </h4>
                                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{skill.level}</span>
                                    </div>
                                    <span style={{
                                        fontSize: '11px',
                                        padding: '4px 8px',
                                        borderRadius: '12px',
                                        background: style.bg,
                                        color: style.color,
                                        border: style.border,
                                        fontWeight: '700',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        {style.dot} {status.toUpperCase()}
                                    </span>
                                </div>

                                {/* Conteúdo Expandido */}
                                {isExpanded && (
                                    <div style={{
                                        padding: '15px',
                                        borderTop: '1px solid rgba(255,255,255,0.04)',
                                        background: 'rgba(255,255,255,0.01)'
                                    }}>
                                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '15px' }}>
                                            {skill.desc}
                                        </p>

                                        {/* Pré-requisitos */}
                                        <div style={{ marginBottom: '15px' }}>
                                            <h5 style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: '700', marginBottom: '8px' }}>
                                                📋 Pré-requisitos Recomendados
                                            </h5>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                {skill.requirements.map((req, rIdx) => (
                                                    <div key={rIdx} style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        fontSize: '11px',
                                                        background: 'var(--bg-tertiary)',
                                                        padding: '6px 10px',
                                                        borderRadius: '6px',
                                                        border: '1px solid rgba(255,255,255,0.03)'
                                                    }}>
                                                        <span style={{ color: '#fff' }}>{req.name}</span>
                                                        <span style={{ color: 'var(--text-muted)' }}>{req.reps}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Seletor de Status */}
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '15px' }}>
                                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Seu Status:</span>
                                            <div style={{ display: 'flex', gap: '5px', flex: 1 }}>
                                                {['bloqueado', 'treinando', 'dominado'].map(st => (
                                                    <button
                                                        key={st}
                                                        type="button"
                                                        onClick={() => handleUpdateStatus(skill.name, st)}
                                                        style={{
                                                            flex: 1,
                                                            padding: '6px 2px',
                                                            borderRadius: '6px',
                                                            fontSize: '10px',
                                                            fontWeight: 'bold',
                                                            background: status === st ? 'var(--accent)' : 'rgba(255,255,255,0.03)',
                                                            color: status === st ? 'var(--text-dark)' : 'var(--text-muted)',
                                                            cursor: 'pointer',
                                                            border: 'none'
                                                        }}
                                                    >
                                                        {st.toUpperCase()}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default function EvolutionView() {
    const { 
        measurements, 
        saveMeasurement, 
        deleteMeasurement, 
        history,
        personalRecords,
        calisthenicsSkills,
        saveCalisthenicsSkills,
        evolutionPhotos,
        saveEvolutionPhotos,
        profileDetails
    } = useApp();
    
    const [activeSubTab, setActiveSubTab] = useState('medidas'); // 'medidas', 'photos', 'skills'
    const [showLogModal, setShowLogModal] = useState(false);
    const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [weight, setWeight] = useState('');
    const [waist, setWaist] = useState('');
    const [chest, setChest] = useState('');
    const [bicepsR, setBicepsR] = useState('');
    const [bicepsL, setBicepsL] = useState('');
    const [thighR, setThighR] = useState('');
    const [thighL, setThighL] = useState('');
    const [bodyFat, setBodyFat] = useState('');
    const [skeletalMuscle, setSkeletalMuscle] = useState('');
    const [visceralFat, setVisceralFat] = useState('');
    const [waterPercentage, setWaterPercentage] = useState('');
    const [bioImage, setBioImage] = useState('');
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [isReadingImage, setIsReadingImage] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Limita a 1.5MB para evitar sobrecarregar o localStorage
        if (file.size > 1.5 * 1024 * 1024) {
            alert('A imagem é muito grande. Escolha uma imagem de até 1.5 MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            setBioImage(event.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleReadBioImage = async () => {
        if (!bioImage) return;
        setIsReadingImage(true);
        try {
            const Tesseract = (await import('tesseract.js')).default;
            const { data: { text } } = await Tesseract.recognize(
                bioImage,
                'por+eng', // Português e Inglês juntos
                { logger: m => console.log(m) }
            );

            console.log("OCR Extracted Text:", text);
            const parsed = parseBioimpedanceText(text);
            
            // Preenche os campos do formulário
            if (parsed.weight !== null) setWeight(parsed.weight.toString());
            if (parsed.bodyFat !== null) setBodyFat(parsed.bodyFat.toString());
            if (parsed.skeletalMuscle !== null) setSkeletalMuscle(parsed.skeletalMuscle.toString());
            if (parsed.visceralFat !== null) setVisceralFat(parsed.visceralFat.toString());
            if (parsed.waterPercentage !== null) setWaterPercentage(parsed.waterPercentage.toString());

            const foundFields = [];
            if (parsed.weight !== null) foundFields.push("Peso");
            if (parsed.bodyFat !== null) foundFields.push("Gordura Corporal (BF)");
            if (parsed.skeletalMuscle !== null) foundFields.push("Massa Muscular");
            if (parsed.visceralFat !== null) foundFields.push("Gordura Visceral");
            if (parsed.waterPercentage !== null) foundFields.push("Água Corporal");

            if (foundFields.length > 0) {
                alert(`🤖 Leitura Inteligente Concluída!\nDados extraídos com sucesso: ${foundFields.join(', ')}.`);
            } else {
                alert('🤖 Leitura Concluída, mas não identificamos termos comuns como "peso", "gordura", "músculo" ou "bf". Preencha manualmente os campos.');
            }
        } finally {
            setIsReadingImage(false);
        }
    };

    // Helper para parsear texto de exames de bioimpedância via Regex
    const parseBioimpedanceText = (text) => {
        const lines = text.toLowerCase().split('\n');
        
        const cleanNumber = (val) => {
            if (!val) return null;
            const normalized = val.replace(',', '.');
            const num = parseFloat(normalized);
            return isNaN(num) ? null : num;
        };

        let weightVal = null;
        let bodyFatVal = null;
        let muscleVal = null;
        let visceralVal = null;
        let waterVal = null;

        lines.forEach(line => {
            const cleanLine = line.trim();

            // 1. PESO
            if (cleanLine.includes('peso') || cleanLine.includes('weight') || cleanLine.includes('kg')) {
                const match = cleanLine.match(/(\d+[\.,]\d+|\d+)\s*kg/i) || cleanLine.match(/(?:peso|weight)\s*[:=-]?\s*(\d+[\.,]\d+|\d+)/i);
                if (match && weightVal === null) {
                    weightVal = cleanNumber(match[1]);
                }
            }

            // 2. GORDURA CORPORAL / BF
            if (cleanLine.includes('gordura') || cleanLine.includes('bf') || cleanLine.includes('fat') || cleanLine.includes('lipíd') || cleanLine.includes('adipo')) {
                const match = cleanLine.match(/(\d+[\.,]\d+|\d+)\s*%/ ) || cleanLine.match(/(?:gordura|bf|fat)\s*(?:corporal)?\s*[:=-]?\s*(\d+[\.,]\d+|\d+)/i);
                if (match && bodyFatVal === null) {
                    bodyFatVal = cleanNumber(match[1]);
                }
            }

            // 3. MASSA MUSCULAR / MÚSCULO
            if (cleanLine.includes('músculo') || cleanLine.includes('musculo') || cleanLine.includes('muscle') || cleanLine.includes('esquelét') || cleanLine.includes('muscular')) {
                const match = cleanLine.match(/(\d+[\.,]\d+|\d+)\s*kg/i) || cleanLine.match(/(?:músculo|musculo|muscle|muscular)\s*(?:esquelética)?\s*[:=-]?\s*(\d+[\.,]\d+|\d+)/i);
                if (match && muscleVal === null) {
                    muscleVal = cleanNumber(match[1]);
                }
            }

            // 4. GORDURA VISCERAL
            if (cleanLine.includes('visceral') || cleanLine.includes('visc')) {
                const match = cleanLine.match(/(?:visceral|visc)\s*[:=-]?\s*(\d+)/i);
                if (match && visceralVal === null) {
                    visceralVal = parseInt(match[1]);
                }
            }

            // 5. ÁGUA CORPORAL
            if (cleanLine.includes('água') || cleanLine.includes('agua') || cleanLine.includes('water') || cleanLine.includes('hidrata')) {
                const match = cleanLine.match(/(\d+[\.,]\d+|\d+)\s*%/ ) || cleanLine.match(/(?:água|agua|water)\s*[:=-]?\s*(\d+[\.,]\d+|\d+)/i);
                if (match && waterVal === null) {
                    waterVal = cleanNumber(match[1]);
                }
            }
        });

        // Fallbacks globais se a varredura por linha falhar
        if (weightVal === null) {
            const globalWeight = text.match(/(?:peso|weight)\s*[:=-]?\s*(\d+[\.,]\d+|\d+)/i);
            if (globalWeight) weightVal = cleanNumber(globalWeight[1]);
        }
        if (bodyFatVal === null) {
            const globalBF = text.match(/(?:gordura|bf|fat|corporal)\s*[:=-]?\s*(\d+[\.,]\d+|\d+)\s*%/i) || text.match(/(\d+[\.,]\d+|\d+)\s*%\s*(?:gordura|bf|fat)/i);
            if (globalBF) bodyFatVal = cleanNumber(globalBF[1]);
        }
        if (muscleVal === null) {
            const globalMuscle = text.match(/(?:músculo|musculo|muscle|muscular|esquelética)\s*[:=-]?\s*(\d+[\.,]\d+|\d+)/i);
            if (globalMuscle) muscleVal = cleanNumber(globalMuscle[1]);
        }
        if (visceralVal === null) {
            const globalVisc = text.match(/(?:visceral|visc)\s*[:=-]?\s*(\d+)/i);
            if (globalVisc) visceralVal = parseInt(globalVisc[1]);
        }
        if (waterVal === null) {
            const globalWater = text.match(/(?:água|agua|water|hidratação)\s*[:=-]?\s*(\d+[\.,]\d+|\d+)/i);
            if (globalWater) waterVal = cleanNumber(globalWater[1]);
        }

        return {
            weight: weightVal,
            bodyFat: bodyFatVal,
            skeletalMuscle: muscleVal,
            visceralFat: visceralVal,
            waterPercentage: waterVal
        };
    };

    // Compute muscle heatmap based on the last 7 days of training
    const workedSets = useMemo(() => {
        const sets = { Peitoral: 0, Costas: 0, Bíceps: 0, Tríceps: 0, Ombros: 0, Pernas: 0, Glúteos: 0, Abdominais: 0 };
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentWorkouts = history.filter(item => new Date(item.date) >= sevenDaysAgo);
        
        recentWorkouts.forEach(workout => {
            if (workout.exercises) {
                workout.exercises.forEach(ex => {
                    const exerciseName = ex.name.toLowerCase();
                    let category = '';
                    if (exerciseName.includes('supino') || exerciseName.includes('peito') || exerciseName.includes('peitoral')) {
                        category = 'Peitoral';
                    } else if (exerciseName.includes('puxada') || exerciseName.includes('remada') || exerciseName.includes('costas') || exerciseName.includes('dorsal')) {
                        category = 'Costas';
                    } else if (exerciseName.includes('rosca') || exerciseName.includes('bíceps') || exerciseName.includes('biceps') || exerciseName.includes('martelo')) {
                        category = 'Bíceps';
                    } else if (exerciseName.includes('tríceps') || exerciseName.includes('triceps') || exerciseName.includes('extensão de tríceps')) {
                        category = 'Tríceps';
                    } else if (exerciseName.includes('desenvolvimento') || exerciseName.includes('ombro') || exerciseName.includes('lateral') || exerciseName.includes('militar')) {
                        category = 'Ombros';
                    } else if (exerciseName.includes('abdominal') || exerciseName.includes('abdominal') || exerciseName.includes('prancha') || exerciseName.includes('infra')) {
                        category = 'Abdominais';
                    } else if (exerciseName.includes('agachamento') || exerciseName.includes('búlgaro') || exerciseName.includes('extensora') || exerciseName.includes('flexora') || exerciseName.includes('leg press') || exerciseName.includes('panturrilha') || exerciseName.includes('gêmeos')) {
                        category = 'Pernas';
                    } else if (exerciseName.includes('pélvica') || exerciseName.includes('glúteo') || exerciseName.includes('gluteo') || exerciseName.includes('abdução')) {
                        category = 'Glúteos';
                    }
                    
                    if (category && ex.series) {
                        sets[category] += ex.series.length;
                    }
                });
            }
        });
        
        return sets;
    }, [history]);

    // Format chart data
    const chartWeightData = useMemo(() => {
        return measurements
            .filter(m => m.weight)
            .map(m => ({
                label: new Date(m.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                value: parseFloat(m.weight)
            }));
    }, [measurements]);

    const chartWaistData = useMemo(() => {
        return measurements
            .filter(m => m.waist)
            .map(m => ({
                label: new Date(m.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                value: parseFloat(m.waist)
            }));
    }, [measurements]);

    const chartBFData = useMemo(() => {
        return measurements
            .filter(m => m.bodyFat)
            .map(m => ({
                label: new Date(m.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                value: parseFloat(m.bodyFat)
            }));
    }, [measurements]);

    const chartMuscleData = useMemo(() => {
        return measurements
            .filter(m => m.skeletalMuscle)
            .map(m => ({
                label: new Date(m.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
                value: parseFloat(m.skeletalMuscle)
            }));
    }, [measurements]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!weight) {
            alert('Por favor, informe pelo menos o peso corporal.');
            return;
        }

        saveMeasurement({
            date,
            weight: parseFloat(weight) || 0,
            waist: parseFloat(waist) || 0,
            chest: parseFloat(chest) || 0,
            bicepsR: parseFloat(bicepsR) || 0,
            bicepsL: parseFloat(bicepsL) || 0,
            thighR: parseFloat(thighR) || 0,
            thighL: parseFloat(thighL) || 0,
            bodyFat: parseFloat(bodyFat) || 0,
            skeletalMuscle: parseFloat(skeletalMuscle) || 0,
            visceralFat: parseInt(visceralFat) || 0,
            waterPercentage: parseFloat(waterPercentage) || 0,
            bioImage: bioImage
        });

        // Reset
        setWeight('');
        setWaist('');
        setChest('');
        setBicepsR('');
        setBicepsL('');
        setThighR('');
        setThighL('');
        setBodyFat('');
        setSkeletalMuscle('');
        setVisceralFat('');
        setWaterPercentage('');
        setBioImage('');
        setShowLogModal(false);
    };

    return (
        <div className="evolution-container" style={{ paddingBottom: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ marginBottom: '4px' }}>Evolução Corporal</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Acompanhe suas medidas e consistência muscular.</p>
                </div>
                <button className="btn-primary" onClick={() => setShowLogModal(true)} style={{ width: 'auto', padding: '10px 16px', fontSize: '14px' }}>
                    + Medidas
                </button>
            </div>

            {/* SELETOR DE SUB-ABAS PREMIUM */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <button 
                    onClick={() => setActiveSubTab('medidas')}
                    style={{
                        flex: 1,
                        padding: '10px 4px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '700',
                        background: activeSubTab === 'medidas' ? 'var(--accent)' : 'transparent',
                        color: activeSubTab === 'medidas' ? 'var(--text-dark)' : 'var(--text-muted)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                    }}
                >
                    📈 Medidas & Gráficos
                </button>
                <button 
                    onClick={() => setActiveSubTab('photos')}
                    style={{
                        flex: 1,
                        padding: '10px 4px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '700',
                        background: activeSubTab === 'photos' ? 'var(--accent)' : 'transparent',
                        color: activeSubTab === 'photos' ? 'var(--text-dark)' : 'var(--text-muted)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                    }}
                >
                    📸 Fotos de Evolução
                </button>
                <button 
                    onClick={() => setActiveSubTab('skills')}
                    style={{
                        flex: 1,
                        padding: '10px 4px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '700',
                        background: activeSubTab === 'skills' ? 'var(--accent)' : 'transparent',
                        color: activeSubTab === 'skills' ? 'var(--text-dark)' : 'var(--text-muted)',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'var(--transition)'
                    }}
                >
                    🤸 Calistenia Skills
                </button>
            </div>

            {/* SUB-ABA 1: MEDIDAS & GRÁFICOS */}
            {activeSubTab === 'medidas' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Widget de IA para previsão de metas */}
                    <IAPredictionWidget measurements={measurements} profileDetails={profileDetails} />

                    {/* MUSCLE HEATMAP SECTION */}
                    <div className="card" style={{ padding: '15px' }}>
                        <h3 style={{ fontSize: '16px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            🔥 Mapa de Calor Muscular
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '15px' }}>
                            Músculos exercitados nos últimos 7 dias baseado em séries concluídas.
                        </p>
                        <MuscleHeatmap workedSets={workedSets} />
                    </div>

                    {/* CHARTS SECTION */}
                    <div className="card" style={{ padding: '15px' }}>
                        <h3 style={{ fontSize: '16px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            📈 Gráficos de Evolução
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <SVGChart data={chartWeightData} labelText="Peso Corporal (kg)" />
                            <SVGChart data={chartWaistData} labelText="Circunferência da Cintura (cm)" />
                            {chartBFData.length > 0 && <SVGChart data={chartBFData} labelText="Gordura Corporal (BF %)" />}
                            {chartMuscleData.length > 0 && <SVGChart data={chartMuscleData} labelText="Massa Muscular (kg)" />}
                        </div>
                    </div>

                    {/* PRs em Destaque */}
                    <PersonalRecordsWidget personalRecords={personalRecords} />

                    {/* MEASUREMENT LOGS LIST */}
                    <div className="card" style={{ padding: '15px' }}>
                        <h3 style={{ fontSize: '16px', marginBottom: '15px' }}>📋 Histórico de Medidas</h3>
                        
                        {measurements.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
                                Nenhum registro de medidas ainda. Clique em "+ Medidas" acima para cadastrar!
                            </p>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
                                            <th style={{ padding: '8px 4px' }}>Data</th>
                                            <th style={{ padding: '8px 4px' }}>Peso</th>
                                            <th style={{ padding: '8px 4px' }}>Cintura</th>
                                            <th style={{ padding: '8px 4px' }}>BF (%)</th>
                                            <th style={{ padding: '8px 4px' }}>Massa (kg)</th>
                                            <th style={{ padding: '8px 4px' }}>Bíceps</th>
                                            <th style={{ padding: '8px 4px' }}>Visc.</th>
                                            <th style={{ padding: '8px 4px' }}>Exame</th>
                                            <th style={{ padding: '8px 4px' }}>Ação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[...measurements].reverse().map((m, idx) => (
                                            <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                <td style={{ padding: '10px 4px', fontWeight: '500' }}>
                                                    {new Date(m.date).toLocaleDateString('pt-BR')}
                                                </td>
                                                <td style={{ padding: '10px 4px' }}>{m.weight ? `${m.weight} kg` : '-'}</td>
                                                <td style={{ padding: '10px 4px' }}>{m.waist ? `${m.waist} cm` : '-'}</td>
                                                <td style={{ padding: '10px 4px' }}>{m.bodyFat ? `${m.bodyFat}%` : '-'}</td>
                                                <td style={{ padding: '10px 4px' }}>{m.skeletalMuscle ? `${m.skeletalMuscle} kg` : '-'}</td>
                                                <td style={{ padding: '10px 4px' }}>
                                                    {m.bicepsR || m.bicepsL ? `${m.bicepsR || 0}/${m.bicepsL || 0}` : '-'}
                                                </td>
                                                <td style={{ padding: '10px 4px' }}>{m.visceralFat || '-'}</td>
                                                <td style={{ padding: '10px 4px' }}>
                                                    {m.bioImage ? (
                                                        <button 
                                                            type="button"
                                                            onClick={() => setSelectedPhoto(m.bioImage)}
                                                            style={{ 
                                                                background: 'none', 
                                                                border: 'none', 
                                                                color: 'var(--accent)', 
                                                                cursor: 'pointer', 
                                                                fontSize: '12px',
                                                                fontWeight: 'bold'
                                                            }}
                                                            title="Ver Foto do Exame"
                                                        >
                                                            📸 Ver
                                                        </button>
                                                    ) : '-'}
                                                </td>
                                                <td style={{ padding: '10px 4px' }}>
                                                    <button 
                                                        onClick={() => {
                                                            if (window.confirm('Excluir este registro de medidas?')) {
                                                                deleteMeasurement(m.date);
                                                            }
                                                        }}
                                                        style={{ background: 'none', color: '#f87171', padding: '2px', cursor: 'pointer', border: 'none' }}
                                                        title="Excluir"
                                                    >
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* SUB-ABA 2: FOTOS DE EVOLUÇÃO */}
            {activeSubTab === 'photos' && (
                <EvolutionPhotosTab evolutionPhotos={evolutionPhotos} saveEvolutionPhotos={saveEvolutionPhotos} />
            )}

            {/* SUB-ABA 3: SKILLS DE CALISTENIA */}
            {activeSubTab === 'skills' && (
                <CalisthenicsSkillsTab calisthenicsSkills={calisthenicsSkills} saveCalisthenicsSkills={saveCalisthenicsSkills} />
            )}

            {/* MODAL FORM SHEET */}
            {showLogModal && (
                <div className="modal-overlay" onClick={() => setShowLogModal(false)}>
                    <div className="modal-sheet" style={{ height: '80vh' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header-sheet">
                            <h3>Registrar Medidas</h3>
                            <button className="modal-close-btn" onClick={() => setShowLogModal(false)}>&times;</button>
                        </div>
                        
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto', padding: '20px', flex: 1 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '5px' }}>Data</label>
                                <input 
                                    type="date" 
                                    className="input-field" 
                                    value={date} 
                                    onChange={e => setDate(e.target.value)} 
                                    required 
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '5px' }}>Peso (kg)</label>
                                    <input 
                                        type="number" 
                                        step="0.1" 
                                        className="input-field" 
                                        placeholder="Ex: 78.5"
                                        value={weight} 
                                        onChange={e => setWeight(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '5px' }}>Cintura (cm)</label>
                                    <input 
                                        type="number" 
                                        step="0.1" 
                                        className="input-field" 
                                        placeholder="Ex: 86"
                                        value={waist} 
                                        onChange={e => setWaist(e.target.value)} 
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '5px' }}>Peitoral (cm)</label>
                                    <input 
                                        type="number" 
                                        step="0.1" 
                                        className="input-field" 
                                        placeholder="Ex: 102"
                                        value={chest} 
                                        onChange={e => setChest(e.target.value)} 
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '5px' }}>Bíceps Dir (cm)</label>
                                    <input 
                                        type="number" 
                                        step="0.1" 
                                        className="input-field" 
                                        placeholder="Ex: 36"
                                        value={bicepsR} 
                                        onChange={e => setBicepsR(e.target.value)} 
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '5px' }}>Bíceps Esq (cm)</label>
                                    <input 
                                        type="number" 
                                        step="0.1" 
                                        className="input-field" 
                                        placeholder="Ex: 36"
                                        value={bicepsL} 
                                        onChange={e => setBicepsL(e.target.value)} 
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '5px' }}>Coxa Dir (cm)</label>
                                    <input 
                                        type="number" 
                                        step="0.1" 
                                        className="input-field" 
                                        placeholder="Ex: 58"
                                        value={thighR} 
                                        onChange={e => setThighR(e.target.value)} 
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '5px' }}>Coxa Esq (cm)</label>
                                    <input 
                                        type="number" 
                                        step="0.1" 
                                        className="input-field" 
                                        placeholder="Ex: 58"
                                        value={thighL} 
                                        onChange={e => setThighL(e.target.value)} 
                                    />
                                </div>
                            </div>

                            {/* DADOS DE BIOIMPEDÂNCIA */}
                            <div style={{ margin: '10px 0', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '15px' }}>
                                <h4 style={{ fontSize: '13px', color: 'var(--accent)', margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    🤖 Aparelho de Bioimpedância
                                </h4>
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '5px' }}>Gordura Corporal (%)</label>
                                    <input 
                                        type="number" 
                                        step="0.1" 
                                        className="input-field" 
                                        placeholder="Ex: 18.5"
                                        value={bodyFat} 
                                        onChange={e => setBodyFat(e.target.value)} 
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '5px' }}>Massa Muscular (kg)</label>
                                    <input 
                                        type="number" 
                                        step="0.1" 
                                        className="input-field" 
                                        placeholder="Ex: 34.2"
                                        value={skeletalMuscle} 
                                        onChange={e => setSkeletalMuscle(e.target.value)} 
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '5px' }}>Gordura Visceral</label>
                                    <input 
                                        type="number" 
                                        step="1" 
                                        className="input-field" 
                                        placeholder="Ex: 5"
                                        value={visceralFat} 
                                        onChange={e => setVisceralFat(e.target.value)} 
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '5px' }}>Água Corporal (%)</label>
                                    <input 
                                        type="number" 
                                        step="0.1" 
                                        className="input-field" 
                                        placeholder="Ex: 58.2"
                                        value={waterPercentage} 
                                        onChange={e => setWaterPercentage(e.target.value)} 
                                    />
                                </div>
                            </div>

                            {/* UPLOAD DA IMAGEM DE BIOIMPEDÂNCIA */}
                            <div style={{ marginTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' }}>
                                <label style={{ display: 'block', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                    📸 Imagem do Exame/App de Bioimpedância (Opcional)
                                </label>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleImageChange}
                                        style={{ fontSize: '12px', color: 'var(--text-muted)', cursor: 'pointer' }}
                                    />
                                    {bioImage && (
                                        <div style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <img src={bioImage} alt="Preview Bioimpedância" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <button 
                                                type="button" 
                                                onClick={() => setBioImage('')}
                                                style={{ 
                                                    position: 'absolute', 
                                                    top: '2px', 
                                                    right: '2px', 
                                                    background: 'rgba(0,0,0,0.7)', 
                                                    color: '#fff', 
                                                    border: 'none', 
                                                    borderRadius: '50%', 
                                                    width: '18px', 
                                                    height: '18px', 
                                                    fontSize: '11px', 
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {bioImage && (
                                    <button 
                                        type="button"
                                        onClick={handleReadBioImage}
                                        disabled={isReadingImage}
                                        style={{ 
                                            marginTop: '10px', 
                                            padding: '10px 14px', 
                                            fontSize: '12px', 
                                            background: 'rgba(var(--accent-rgb), 0.08)', 
                                            border: '1px solid rgba(var(--accent-rgb), 0.2)', 
                                            color: 'var(--accent)',
                                            fontWeight: 'bold',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px',
                                            width: '100%',
                                            cursor: 'pointer',
                                            borderRadius: '8px'
                                        }}
                                    >
                                        {isReadingImage ? (
                                            <>⌛ Analisando Imagem e Extraindo Dados...</>
                                        ) : (
                                            <>🤖 Extrair Dados da Imagem (Smart OCR)</>
                                        )}
                                    </button>
                                )}
                            </div>

                            <button type="submit" className="btn-primary" style={{ marginTop: '20px' }}>
                                Salvar Registro
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* LIGHTBOX MODAL PARA VER A IMAGEM DO EXAME */}
            {selectedPhoto && (
                <div className="modal-overlay" onClick={() => setSelectedPhoto(null)} style={{ zIndex: 120 }}>
                    <div className="modal-sheet" style={{ width: '92%', maxWidth: '460px', height: 'auto', maxHeight: '85vh', background: 'transparent', boxShadow: 'none', border: 'none', padding: 0 }} onClick={e => e.stopPropagation()}>
                        <div style={{ position: 'relative', width: '100%' }}>
                            <button 
                                onClick={() => setSelectedPhoto(null)} 
                                style={{ 
                                    position: 'absolute', 
                                    top: '-45px', 
                                    right: '10px', 
                                    background: 'rgba(0,0,0,0.6)', 
                                    color: '#fff', 
                                    border: 'none', 
                                    borderRadius: '50%', 
                                    width: '32px', 
                                    height: '32px', 
                                    fontSize: '22px', 
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                &times;
                            </button>
                            <img 
                                src={selectedPhoto} 
                                alt="Relatório de Bioimpedância" 
                                style={{ 
                                    width: '100%', 
                                    height: 'auto', 
                                    maxHeight: '75vh', 
                                    borderRadius: '12px', 
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.9)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    objectFit: 'contain'
                                }} 
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
