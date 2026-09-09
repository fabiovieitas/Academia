import React, { useEffect, useRef } from 'react';

// Função para emitir som suave de finalização de descanso
function playTimerDoneSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // Nota Lá (A5)
        osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.15); // A6

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.4);
    } catch (e) {
        console.warn("AudioContext not permitted or supported", e);
    }
}

export default function FloatingRestTimer({ timeLeft, totalTime, onAddTime, onSkip, isActive }) {
    const prevTimeRef = useRef(timeLeft);

    useEffect(() => {
        // Quando o timer zera e estava ativo, toca som e vibra o celular
        if (prevTimeRef.current > 0 && timeLeft === 0 && isActive) {
            playTimerDoneSound();
            if ('vibrate' in navigator) {
                try {
                    navigator.vibrate([200, 100, 200, 100, 400]);
                } catch (e) {}
            }
        }
        prevTimeRef.current = timeLeft;
    }, [timeLeft, isActive]);

    if (!isActive || timeLeft <= 0) return null;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const maxTime = Math.max(totalTime || 60, timeLeft);
    const progress = Math.min(100, Math.round(((maxTime - timeLeft) / maxTime) * 100));

    return (
        <div className="floating-rest-timer-widget">
            <div className="floating-timer-inner">
                {/* Ícone de Ampulheta e Cronômetro */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        position: 'relative',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {/* SVG Progress Ring */}
                        <svg width="40" height="40" viewBox="0 0 40 40" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
                            <circle
                                cx="20"
                                cy="20"
                                r="16"
                                fill="transparent"
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth="3"
                            />
                            <circle
                                cx="20"
                                cy="20"
                                r="16"
                                fill="transparent"
                                stroke="var(--accent)"
                                strokeWidth="3"
                                strokeDasharray={100}
                                strokeDashoffset={100 - progress}
                                strokeLinecap="round"
                                style={{ transition: 'stroke-dashoffset 1s linear' }}
                            />
                        </svg>
                        <span style={{ fontSize: '15px' }}>⏱️</span>
                    </div>

                    <div>
                        <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 'bold', display: 'block', letterSpacing: '0.5px' }}>
                            Descanso Ativo
                        </span>
                        <strong style={{ fontSize: '18px', fontFamily: 'monospace', color: 'var(--accent)', fontWeight: '800' }}>
                            {formatted}
                        </strong>
                    </div>
                </div>

                {/* Botões Rápidos */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                        type="button"
                        onClick={() => onAddTime(-15)}
                        className="btn-timer-quick"
                        title="Reduzir 15 segundos"
                    >
                        -15s
                    </button>
                    <button
                        type="button"
                        onClick={() => onAddTime(30)}
                        className="btn-timer-quick"
                        title="Adicionar 30 segundos"
                    >
                        +30s
                    </button>
                    <button
                        type="button"
                        onClick={onSkip}
                        className="btn-timer-skip"
                        title="Pular descanso"
                    >
                        Pular ⏭
                    </button>
                </div>
            </div>
        </div>
    );
}
