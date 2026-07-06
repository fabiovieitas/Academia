import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import ProfileSelection from './components/ProfileSelection';
import Dashboard from './components/Dashboard';
import WorkoutEditor from './components/WorkoutEditor';
import GymMode from './components/GymMode';
import HistoryView from './components/HistoryView';
import ExerciseBrowser from './components/ExerciseBrowser';
import EvolutionView from './components/EvolutionView';
import SettingsView from './components/SettingsView';
import FeedView from './components/FeedView';
import { CALISTHENICS_PATH_MAP } from './context/workoutData';

function MainAppContent() {
    const { 
        activeProfile, 
        selectProfile, 
        activeWorkout, 
        startWorkout, 
        saveWorkout,
        timerActive,
        timeLeft,
        setTimeLeft,
        toastMessage,
        setToastMessage
    } = useApp();

    const [currentTab, setCurrentTab] = useState('dashboard'); // 'dashboard', 'history', 'exercises'
    const [editingWorkout, setEditingWorkout] = useState(null); // workout object
    const [isCreating, setIsCreating] = useState(false);
    const [selectedDetailExercise, setSelectedDetailExercise] = useState(null); // Para ver detalhes do exercício
    const [detailGifError, setDetailGifError] = useState(false);
    const [detailGifSrc, setDetailGifSrc] = useState('');
    const [detailGifStage, setDetailGifStage] = useState(0); // 0: local, 1: remote gif, 2: remote thumb, 3: error

    useEffect(() => {
        setDetailGifError(false);
        setDetailGifStage(0);
        if (selectedDetailExercise) {
            let path = selectedDetailExercise.path;
            if (!path) {
                const cleanKey = selectedDetailExercise.name.toLowerCase().trim();
                const cleanKeyNoPrefix = cleanKey.replace(/^(nível\s+\d+:|mobilidade:|técnica:)\s*/i, "").trim();
                path = CALISTHENICS_PATH_MAP[cleanKey] || CALISTHENICS_PATH_MAP[cleanKeyNoPrefix] || '';
            }
            const initialSrc = path.startsWith('http')
                ? path
                : `/${path}`;
            setDetailGifSrc(initialSrc);
        } else {
            setDetailGifSrc('');
        }
    }, [selectedDetailExercise]);

    const handleDetailGifError = () => {
        if (selectedDetailExercise) {
            const path = selectedDetailExercise.path;
            const hasCustomMedia = !!import.meta.env.VITE_MEDIA_URL;

            if (detailGifStage === 0) {
                if (hasCustomMedia) {
                    setDetailGifStage(1);
                    const customSrc = path.startsWith('http') ? path : `${import.meta.env.VITE_MEDIA_URL}/${path}`;
                    setDetailGifSrc(customSrc);
                } else {
                    setDetailGifStage(2);
                    const publicSrc = path.startsWith('http') ? path : `https://www.gifdotreino.com/${path}`;
                    setDetailGifSrc(publicSrc);
                }
            } else if (detailGifStage === 1) {
                setDetailGifStage(2);
                const publicSrc = path.startsWith('http') ? path : `https://www.gifdotreino.com/${path}`;
                setDetailGifSrc(publicSrc);
            } else if (detailGifStage === 2) {
                setDetailGifStage(3);
                const cleanName = selectedDetailExercise.name.replace(/^(nível\s+\d+:|mobilidade:|técnica:)\s*/i, "").trim();
                const thumbnailSrc = `https://www.gifdotreino.com/thumbnails/${cleanName}.png`;
                setDetailGifSrc(thumbnailSrc);
            } else {
                setDetailGifError(true);
            }
        }
    };

    // PWA Install prompt state
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [showInstallModal, setShowInstallModal] = useState(false);
    const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        const handleAppInstalled = () => {
            setIsInstallable(false);
            setDeferredPrompt(null);
        };
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    // Efeito para navegar automaticamente para a aba do treino quando um é iniciado
    useEffect(() => {
        if (activeWorkout) {
            setCurrentTab('gym');
        } else {
            if (currentTab === 'gym') {
                setCurrentTab('dashboard');
            }
        }
    }, [activeWorkout]);

    // Se não há perfil selecionado, força a tela de seleção de perfil
    if (!activeProfile) {
        return <ProfileSelection />;
    }



    // Se está editando ou criando um treino
    if (editingWorkout || isCreating) {
        return (
            <div className={`app-container theme-${activeProfile.theme}`}>
                <div className="app-content">
                    <h2 style={{ marginBottom: '20px' }}>
                        {isCreating ? 'Montar Novo Treino' : 'Editar Treino'}
                    </h2>
                    <WorkoutEditor 
                        workout={editingWorkout}
                        onSave={(workoutData) => {
                            saveWorkout(workoutData);
                            setEditingWorkout(null);
                            setIsCreating(false);
                            setCurrentTab('dashboard');
                        }}
                        onCancel={() => {
                            setEditingWorkout(null);
                            setIsCreating(false);
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={`app-container theme-${activeProfile.theme}`}>
            {currentTab !== 'gym' && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 18px',
                    background: 'rgba(10, 11, 14, 0.75)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    zIndex: 95
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '20px' }}>⚡</span>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                            <h1 style={{ fontSize: '18px', fontWeight: '800', margin: 0, background: 'linear-gradient(135deg, var(--accent) 0%, #fff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                FitLife
                            </h1>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 'bold' }}>v0.12</span>
                        </div>
                    </div>
                    {!isStandalone && (
                        <button 
                            onClick={() => {
                                if (isInstallable && deferredPrompt) {
                                    deferredPrompt.prompt();
                                    deferredPrompt.userChoice.then((choiceResult) => {
                                        if (choiceResult.outcome === 'accepted') {
                                            console.log('Usuário aceitou a instalação do PWA');
                                        }
                                        setDeferredPrompt(null);
                                        setIsInstallable(false);
                                    });
                                } else {
                                    setShowInstallModal(true);
                                }
                            }}
                            className="btn-primary"
                            style={{
                                padding: '6px 12px',
                                fontSize: '12px',
                                borderRadius: '20px',
                                width: 'auto',
                                margin: 0,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: 'var(--accent)',
                                color: 'var(--text-dark)',
                                boxShadow: '0 0 10px rgba(var(--accent-rgb), 0.35)'
                            }}
                        >
                            <span>📱 Instalar App</span>
                        </button>
                    )}
                </div>
            )}
            <div className="app-content" style={{ paddingTop: currentTab !== 'gym' ? '10px' : '20px' }}>
                {currentTab === 'dashboard' && (
                    <Dashboard 
                        onStartWorkout={(workout) => {
                            if (workout) {
                                startWorkout(workout);
                            } else {
                                setCurrentTab('gym');
                            }
                        }}
                        onEditWorkout={(workout) => {
                            setEditingWorkout(workout);
                            setIsCreating(false);
                        }}
                        onCreateWorkout={() => {
                            setEditingWorkout(null);
                            setIsCreating(true);
                        }}
                        onLogout={() => selectProfile(null)}
                        onChangeTab={setCurrentTab}
                    />
                )}

                {currentTab === 'gym' && activeWorkout && (
                    <GymMode 
                        onFinish={() => setCurrentTab('history')} 
                        onCancel={() => setCurrentTab('dashboard')} 
                    />
                )}

                {currentTab === 'history' && <HistoryView />}

                {currentTab === 'evolution' && <EvolutionView />}

                {currentTab === 'feed' && <FeedView />}

                {currentTab === 'settings' && (
                    <SettingsView 
                        isInstallable={isInstallable}
                        onInstall={() => {
                            if (deferredPrompt) {
                                deferredPrompt.prompt();
                                deferredPrompt.userChoice.then((choiceResult) => {
                                    if (choiceResult.outcome === 'accepted') {
                                        console.log('Usuário aceitou a instalação do PWA');
                                    }
                                    setDeferredPrompt(null);
                                    setIsInstallable(false);
                                });
                            } else {
                                setShowInstallModal(true);
                            }
                        }}
                    />
                )}

                {currentTab === 'exercises' && (
                    <div style={{ paddingBottom: '20px' }}>
                        <h2 style={{ marginBottom: '15px' }}>Biblioteca de Exercícios</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
                            Explore a base de dados de GIFs e consulte as execuções corretas.
                        </p>
                        <ExerciseBrowser 
                            onSelect={(exercise) => {
                                setSelectedDetailExercise(exercise);
                            }}
                            onClose={() => setCurrentTab('dashboard')}
                        />
                    </div>
                )}
            </div>

            {/* Modal de Detalhes do Exercício em Modo de Navegação */}
            {selectedDetailExercise && (
                <div className="modal-overlay" onClick={() => setSelectedDetailExercise(null)}>
                    <div className="modal-sheet" style={{ height: '70vh' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header-sheet">
                            <h3>{selectedDetailExercise.name}</h3>
                            <button className="modal-close-btn" onClick={() => setSelectedDetailExercise(null)}>&times;</button>
                        </div>
                        <div className="exercise-details-sheet" style={{ overflowY: 'auto', flex: 1, padding: '20px' }}>
                            <div className="details-gif-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px', background: 'var(--bg-tertiary)', borderRadius: '12px', overflow: 'hidden' }}>
                                {detailGifError ? (
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '20px',
                                        textAlign: 'center',
                                        gap: '10px',
                                        width: '100%'
                                    }}>
                                        <span style={{ fontSize: '36px' }}>💪</span>
                                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff' }}>Guia de Movimento</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: '220px', lineHeight: '1.4' }}>
                                            Siga as instruções técnicas abaixo para a correta amplitude e postura.
                                        </div>
                                    </div>
                                ) : (
                                    <img 
                                        src={encodeURI(detailGifSrc)} 
                                        alt={selectedDetailExercise.name} 
                                        onLoad={() => setDetailGifError(false)}
                                        onError={handleDetailGifError}
                                    />
                                )}
                            </div>
                            
                            <div className="details-meta-grid">
                                <div className="details-meta-item">
                                    <span className="label">Grupo Muscular</span>
                                    <span className="val">{selectedDetailExercise.path.split('/')[1]}</span>
                                </div>
                                <div className="details-meta-item">
                                    <span className="label">Fonte</span>
                                    <span className="val">Gif do Treino</span>
                                </div>
                            </div>
                            
                            <div className="details-instructions">
                                <h4>Execução Correta</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.6' }}>
                                    Visualize o movimento contínuo no GIF acima. Mantenha a postura alinhada, execute de forma controlada (cadência) e concentre a força no grupo muscular alvo.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Cronômetro Flutuante de Descanso */}
            {timerActive && timeLeft > 0 && currentTab !== 'gym' && (
                <div className="mini-timer-bar" style={{
                    position: 'fixed',
                    bottom: '80px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '92%',
                    maxWidth: '460px',
                    background: 'rgba(18, 20, 28, 0.94)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(var(--accent-rgb), 0.3)',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    zIndex: 90,
                    boxShadow: '0 8px 30px rgba(0,0,0,0.5), 0 0 15px rgba(var(--accent-rgb), 0.15)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                        <span style={{ fontSize: '18px' }}>⏱️</span>
                        <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                            <span style={{ fontSize: '9px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Descanso Ativo
                            </span>
                            <span style={{ fontSize: '12px', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px', display: 'block' }}>
                                {activeWorkout?.exercises?.[activeWorkout?.currentExerciseIndex]?.name || 'Treino'}
                            </span>
                        </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--accent)', fontFamily: 'monospace' }}>
                            {timeLeft}s
                        </span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <button 
                                onClick={() => setTimeLeft(prev => Math.max(0, prev - 15))}
                                style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#fff', padding: '5px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                            >
                                -15s
                            </button>
                            <button 
                                onClick={() => setTimeLeft(prev => prev + 15)}
                                style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#fff', padding: '5px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                            >
                                +15s
                            </button>
                            <button 
                                onClick={() => setTimeLeft(0)}
                                style={{ background: 'rgba(var(--accent-rgb), 0.15)', border: '1px solid rgba(var(--accent-rgb), 0.25)', color: 'var(--accent)', padding: '5px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                Pular
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Barra de Navegação Inferior */}
            <nav className="bottom-nav">
                <div 
                    className={`nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => {
                        setEditingWorkout(null);
                        setIsCreating(false);
                        setCurrentTab('dashboard');
                    }}
                >
                    <span className="icon">🏠</span>
                    <span>Início</span>
                </div>

                <div 
                    className={`nav-item ${currentTab === 'feed' ? 'active' : ''}`}
                    onClick={() => {
                        setEditingWorkout(null);
                        setIsCreating(false);
                        setCurrentTab('feed');
                    }}
                >
                    <span className="icon">💬</span>
                    <span>Feed</span>
                </div>

                {activeWorkout && (
                    <div 
                        className={`nav-item ${currentTab === 'gym' ? 'active' : ''}`}
                        onClick={() => {
                            setEditingWorkout(null);
                            setIsCreating(false);
                            setCurrentTab('gym');
                        }}
                    >
                        <span className="icon">⚡</span>
                        <span>Treino</span>
                    </div>
                )}

                <div 
                    className={`nav-item ${currentTab === 'exercises' ? 'active' : ''}`}
                    onClick={() => {
                        setEditingWorkout(null);
                        setIsCreating(false);
                        setCurrentTab('exercises');
                    }}
                >
                    <span className="icon">🔍</span>
                    <span>Exercícios</span>
                </div>
                <div 
                    className={`nav-item ${currentTab === 'evolution' ? 'active' : ''}`}
                    onClick={() => {
                        setEditingWorkout(null);
                        setIsCreating(false);
                        setCurrentTab('evolution');
                    }}
                >
                    <span className="icon">📈</span>
                    <span>Evolução</span>
                </div>
                <div 
                    className={`nav-item ${currentTab === 'history' ? 'active' : ''}`}
                    onClick={() => {
                        setEditingWorkout(null);
                        setIsCreating(false);
                        setCurrentTab('history');
                    }}
                >
                    <span className="icon">📊</span>
                    <span>Histórico</span>
                </div>
                <div 
                    className={`nav-item ${currentTab === 'settings' ? 'active' : ''}`}
                    onClick={() => {
                        setEditingWorkout(null);
                        setIsCreating(false);
                        setCurrentTab('settings');
                    }}
                >
                    <span className="icon">⚙️</span>
                    <span>Ajustes</span>
                </div>
            </nav>

            {/* Toast de Validação Cruzada */}
            {toastMessage && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 9999,
                    background: 'rgba(18, 20, 28, 0.96)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid var(--accent)',
                    borderRadius: '12px',
                    padding: '12px 18px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 15px rgba(var(--accent-rgb), 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    maxWidth: '92%',
                    width: '380px',
                    animation: 'slideDown 0.3s ease-out, toastPulse 2s infinite',
                    transition: 'all 0.3s ease'
                }}>
                    <span style={{ fontSize: '20px' }}>⚡</span>
                    <div style={{ flex: 1, textAlign: 'left' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                            Sincronização Cruzada
                        </span>
                        <span style={{ fontSize: '12px', color: '#fff', fontWeight: '500', lineHeight: '1.4', display: 'block', marginTop: '2px' }}>
                            {toastMessage}
                        </span>
                    </div>
                    <button 
                        onClick={() => setToastMessage(null)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '18px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        &times;
                    </button>
                </div>
            )}
            {/* MODAL DE INSTRUÇÕES DE INSTALAÇÃO */}
            {showInstallModal && (() => {
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
                return (
                    <div className="modal-overlay" onClick={() => setShowInstallModal(false)} style={{ zIndex: 120 }}>
                        <div className="modal-sheet" style={{ height: 'auto', maxHeight: '85vh', display: 'flex', flexDirection: 'column', width: '92%', maxWidth: '440px' }} onClick={e => e.stopPropagation()}>
                            <div className="modal-header-sheet">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 'bold', letterSpacing: '1px' }}>
                                        Adicionar à Tela de Início 📱
                                    </span>
                                    <h3 style={{ margin: 0 }}>Como instalar no celular</h3>
                                </div>
                                <button className="modal-close-btn" onClick={() => setShowInstallModal(false)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }}>&times;</button>
                            </div>
                            
                            <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', margin: 0 }}>
                                    Tenha acesso rápido ao <strong>FitLife</strong> direto da sua tela inicial como um aplicativo nativo (tela cheia e carregamento rápido).
                                </p>
                                
                                {isIOS ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ background: 'rgba(var(--accent-rgb), 0.05)', border: '1px solid rgba(var(--accent-rgb), 0.15)', borderRadius: '10px', padding: '12px' }}>
                                            <span style={{ fontWeight: 'bold', color: 'var(--accent)', fontSize: '14px', display: 'block', marginBottom: '8px' }}>🍎 Instruções para iPhone / iPad (Safari)</span>
                                            <ol style={{ fontSize: '13px', color: 'var(--text-main)', margin: 0, paddingLeft: '18px', lineHeight: '1.6' }}>
                                                <li>Toque no botão de <strong>Compartilhar</strong> (ícone <span style={{ fontSize: '15px' }}>📤</span> na barra inferior do Safari).</li>
                                                <li>Role a lista de opções para baixo e selecione <strong>Adicionar à Tela de Início</strong> (ícone <span style={{ fontSize: '15px' }}>➕</span>).</li>
                                                <li>Toque em <strong>Adicionar</strong> no canto superior direito.</li>
                                            </ol>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ background: 'rgba(var(--accent-rgb), 0.05)', border: '1px solid rgba(var(--accent-rgb), 0.15)', borderRadius: '10px', padding: '12px' }}>
                                            <span style={{ fontWeight: 'bold', color: 'var(--accent)', fontSize: '14px', display: 'block', marginBottom: '8px' }}>🤖 Instruções para Android (Chrome)</span>
                                            <ol style={{ fontSize: '13px', color: 'var(--text-main)', margin: 0, paddingLeft: '18px', lineHeight: '1.6' }}>
                                                <li>Toque no ícone de menu (os <strong>três pontinhos ⋮</strong> no canto superior direito).</li>
                                                <li>Selecione a opção <strong>Instalar aplicativo</strong> ou <strong>Adicionar à tela de início</strong>.</li>
                                                <li>Confirme a instalação e o ícone aparecerá na sua tela inicial automaticamente.</li>
                                            </ol>
                                        </div>
                                    </div>
                                )}
                                
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '5px' }}>
                                    💡 Se você já instalou o aplicativo, abra-o a partir do ícone na tela inicial para desfrutar da experiência completa em tela cheia!
                                </div>
                            </div>
                            
                            <div style={{ padding: '15px 20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <button 
                                    className="btn-secondary" 
                                    onClick={() => setShowInstallModal(false)}
                                    style={{ width: '100%', padding: '12px' }}
                                >
                                    Entendi
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
            
            {/* Estilo Dinâmico para Animação do Toast */}
            <style>{`
                @keyframes slideDown {
                    from { transform: translate(-50%, -40px); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }
                @keyframes toastPulse {
                    0% { box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 0 0 rgba(var(--accent-rgb), 0.4); }
                    70% { box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 0 8px rgba(var(--accent-rgb), 0); }
                    100% { box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 0 0 rgba(var(--accent-rgb), 0); }
                }
            `}</style>
        </div>
    );
}

export default function App() {
    return (
        <AppProvider>
            <MainAppContent />
        </AppProvider>
    );
}
