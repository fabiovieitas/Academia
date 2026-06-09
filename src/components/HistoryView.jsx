import React from 'react';
import { useApp } from '../context/AppContext';

export default function HistoryView() {
    const { history } = useApp();

    // Formata data e hora para exibição
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const optionsTime = { hour: '2-digit', minute: '2-digit' };
        const timeStr = date.toLocaleTimeString('pt-BR', optionsTime);

        if (date.toDateString() === today.toDateString()) {
            return `Hoje, às ${timeStr}`;
        } else if (date.toDateString() === yesterday.toDateString()) {
            return `Ontem, às ${timeStr}`;
        } else {
            const optionsDate = { weekday: 'short', day: 'numeric', month: 'short' };
            const dateStr = date.toLocaleDateString('pt-BR', optionsDate);
            // Capitaliza o dia da semana
            return `${dateStr.charAt(0).toUpperCase() + dateStr.slice(1)} às ${timeStr}`;
        }
    };

    // Gera o calendário mensal em formato heatmap
    const renderMonthlyCalendar = () => {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth(); // 0-indexed

        // Nome do mês
        const monthNames = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];
        const monthName = monthNames[currentMonth];

        // Primeiro dia do mês (dia da semana)
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Domingo, 1 = Segunda, ...
        // Total de dias no mês
        const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Criar array para os blocos da grade
        // Para começar na Segunda-feira (ajustando o firstDay):
        // Se firstDay === 0 (Domingo), vira 6. Senão, firstDay - 1.
        const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        const days = [];
        // Células vazias antes do dia 1
        for (let i = 0; i < startOffset; i++) {
            days.push(null);
        }
        // Células dos dias
        for (let d = 1; d <= totalDaysInMonth; d++) {
            days.push(new Date(currentYear, currentMonth, d));
        }

        // Mapear dias concluídos do histórico
        const completedDays = {};
        history.forEach(item => {
            const dString = new Date(item.date).toDateString();
            if (!completedDays[dString]) {
                completedDays[dString] = [];
            }
            completedDays[dString].push(item);
        });

        const weekDays = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

        return (
            <div className="monthly-calendar-card" style={{
                background: 'var(--bg-secondary)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '20px',
                padding: '20px',
                marginBottom: '25px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#fff', margin: 0 }}>
                        Check-in Mensal - {monthName} {currentYear}
                    </h3>
                    <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: '600' }}>
                        {Object.keys(completedDays).filter(dStr => {
                            const d = new Date(dStr);
                            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
                        }).length} treinos
                    </span>
                </div>

                {/* Dias da semana */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    textAlign: 'center',
                    gap: '6px',
                    fontSize: '10px',
                    fontWeight: '600',
                    color: 'var(--text-muted)',
                    marginBottom: '8px'
                }}>
                    {weekDays.map(wd => <div key={wd}>{wd}</div>)}
                </div>

                {/* Grade do Mês */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '6px',
                    textAlign: 'center'
                }}>
                    {days.map((date, idx) => {
                        if (!date) {
                            return <div key={`empty-${idx}`} style={{ height: '32px' }} />;
                        }

                        const dString = date.toDateString();
                        const dayWorkouts = completedDays[dString] || [];
                        const isCompleted = dayWorkouts.length > 0;
                        const isToday = dString === today.toDateString();

                        // Cor de fundo baseada no tipo de treino
                        let cellBg = 'rgba(255, 255, 255, 0.02)';
                        let borderStyle = '1px solid rgba(255, 255, 255, 0.05)';
                        let fontColor = 'var(--text-muted)';
                        
                        if (isCompleted) {
                            const hasCardio = dayWorkouts.some(w => w.isCardio);
                            const hasStrength = dayWorkouts.some(w => !w.isCardio);
                            
                            if (hasCardio && hasStrength) {
                               cellBg = 'linear-gradient(135deg, var(--accent) 0%, #10b981 100%)';
                            } else if (hasCardio) {
                               cellBg = '#10b981'; // Verde para cardio
                            } else {
                               cellBg = 'var(--accent)'; // Ciano ou Rosa do tema
                            }
                            fontColor = 'var(--text-dark)';
                            borderStyle = 'none';
                        } else if (isToday) {
                            borderStyle = '1px dashed var(--accent)';
                            fontColor = 'var(--accent)';
                        }

                        return (
                           <div 
                               key={idx}
                               title={isCompleted ? dayWorkouts.map(w => w.workoutName).join(', ') : date.toLocaleDateString('pt-BR')}
                               style={{
                                   height: '32px',
                                   display: 'flex',
                                   alignItems: 'center',
                                   justifyContent: 'center',
                                   borderRadius: '6px',
                                   fontSize: '12px',
                                   fontWeight: isCompleted || isToday ? '700' : 'normal',
                                   background: cellBg,
                                   border: borderStyle,
                                   color: fontColor,
                                   position: 'relative'
                               }}
                           >
                               {date.getDate()}
                               {isToday && !isCompleted && (
                                   <div style={{
                                       position: 'absolute',
                                       bottom: '2px',
                                       width: '4px',
                                       height: '4px',
                                       borderRadius: '50%',
                                       background: 'var(--accent)'
                                   }}/>
                               )}
                           </div>
                        );
                    })}
                </div>

                {/* Legenda */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '12px',
                    marginTop: '12px',
                    fontSize: '10px',
                    color: 'var(--text-muted)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--accent)' }}/>
                        <span>Musculação</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#10b981' }}/>
                        <span>Cardio</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '2px', border: '1px dashed var(--accent)' }}/>
                        <span>Hoje</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="history-view-container">
            <h2>Evolução e Consistência</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '15px' }}>
                Acompanhe sua regularidade mensal:
            </p>

            {renderMonthlyCalendar()}

            <h2 style={{ marginTop: '30px' }}>Histórico de Atividades</h2>
            
            {history.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '50px 20px',
                    color: 'var(--text-muted)',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid rgba(255,255,255,0.03)'
                }}>
                    🏋️‍♂️ Nenhum treino concluído ainda.<br/>
                    Inicie e finalize um treino para vê-lo aqui!
                </div>
            ) : (
                <div className="history-list">
                    {history.map(item => {
                        // Card customizado para Cardio vindo do Zepp ou manual
                        if (item.isCardio) {
                            const isRunning = item.cardioType === 'running';
                            const cardioIcon = isRunning ? '🏃‍♂️' : '🚴‍♂️';
                            const accentColor = '#10b981'; // Cor verde para cardio

                            return (
                                <div key={item.id} className="history-card" style={{
                                    borderLeft: `4px solid ${accentColor}`
                                }}>
                                    <div className="history-card-header">
                                        <div>
                                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                                                <span style={{ fontSize: '18px' }}>{cardioIcon}</span>
                                                {item.workoutName}
                                            </h4>
                                            <span className="date">{formatDate(item.date)}</span>
                                        </div>
                                        <span className="duration" style={{ background: 'rgba(16, 185, 129, 0.1)', color: accentColor, padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                                            ⏱️ {item.duration} min
                                        </span>
                                    </div>
                                    
                                    <div className="cardio-stats-grid" style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3, 1fr)',
                                        gap: '10px',
                                        marginTop: '12px',
                                        background: 'rgba(255, 255, 255, 0.02)',
                                        padding: '10px',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(255,255,255,0.03)'
                                    }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Distância</span>
                                            <strong style={{ fontSize: '14px', color: '#fff' }}>{item.distance ? `${item.distance.toFixed(2)} km` : '--'}</strong>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fq. Cardíaca</span>
                                            <strong style={{ fontSize: '14px', color: '#fff' }}>
                                                {item.heartRate ? `${Math.round(item.heartRate)} bpm` : '--'}
                                            </strong>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Calorias</span>
                                            <strong style={{ fontSize: '14px', color: '#fff' }}>
                                                {item.calories ? `${Math.round(item.calories)} kcal` : '--'}
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        // Card padrão de Musculação
                        return (
                            <div key={item.id} className="history-card">
                                <div className="history-card-header">
                                    <div>
                                        <h4>{item.workoutName}</h4>
                                        <span className="date">{formatDate(item.date)}</span>
                                    </div>
                                    <span className="duration">⏱️ {item.duration} min</span>
                                </div>

                                {item.cardio && (
                                    <div style={{
                                        display: 'flex',
                                        gap: '15px',
                                        fontSize: '11px',
                                        color: 'var(--accent)',
                                        background: 'rgba(var(--accent-rgb), 0.05)',
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        marginTop: '8px',
                                        width: 'fit-content',
                                        fontWeight: '500'
                                    }}>
                                        <span>❤️ Cardio:</span>
                                        {item.cardio.avgHR && <span>Média: <strong>{item.cardio.avgHR} BPM</strong></span>}
                                        {item.cardio.maxHR && <span>Máxima: <strong>{item.cardio.maxHR} BPM</strong></span>}
                                    </div>
                                )}

                                <div style={{ marginTop: '10px' }}>
                                    {item.exercises.map((ex, exIdx) => (
                                        <div key={exIdx} className="history-exercise-row">
                                            <h5>{ex.name}</h5>
                                            <div className="history-set-tags">
                                                {ex.series.map((set, setIdx) => (
                                                    <span key={setIdx} className="history-set-tag">
                                                        S{setIdx + 1}: {set.reps}x @ {set.weight}kg
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
