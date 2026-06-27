import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function SettingsView({ isInstallable, onInstall }) {
    const {
        activeProfile,
        selectProfile,
        exportBackupData,
        importBackupData,
        voiceNotifications,
        toggleVoiceNotifications,
        profileDetails,
        saveProfileDetails
    } = useApp();


    const [age, setAge] = useState('');
    const [gender, setGender] = useState('masculino');
    const [objective, setObjective] = useState('hipertrofia');
    const [focusMuscles, setFocusMuscles] = useState([]);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [localIp, setLocalIp] = useState(() => {
        return localStorage.getItem('fitlife_local_ip') || '';
    });

    React.useEffect(() => {
        if (profileDetails) {
            setAge(profileDetails.age || '');
            setGender(profileDetails.gender || 'masculino');
            setObjective(profileDetails.objective || 'hipertrofia');
            setFocusMuscles(profileDetails.focusMuscles || []);
        }
    }, [profileDetails]);

    const handleSaveAnamnese = (e) => {
        e.preventDefault();
        saveProfileDetails({
            age: parseInt(age) || 0,
            gender,
            objective,
            focusMuscles
        });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const handleFocusMuscleChange = (muscle) => {
        if (focusMuscles.includes(muscle)) {
            setFocusMuscles(focusMuscles.filter(m => m !== muscle));
        } else {
            setFocusMuscles([...focusMuscles, muscle]);
        }
    };

    const handleImportFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target.result);
                importBackupData(parsed);
                alert('Backup importado com sucesso!');
            } catch (err) {
                alert(`Erro ao importar backup: ${err.message}`);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="settings-container" style={{ paddingBottom: '40px' }}>
            <h2 style={{ marginBottom: '20px' }}>Configurações ⚙️</h2>

            {/* Profile Info */}
            <div className="card" style={{ marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{
                        fontSize: '40px',
                        background: 'rgba(255,255,255,0.05)',
                        width: '70px',
                        height: '70px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid var(--accent)'
                    }}>
                        {activeProfile?.avatar}
                    </div>
                    <div>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {activeProfile?.name}
                            {activeProfile?.id === 'esposa' && (
                                <span className="heart-pulse" style={{ display: 'inline-block', animation: 'pulse 1.2s infinite' }}>❤️</span>
                            )}
                        </h3>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Perfil Ativo</p>
                    </div>
                </div>
                
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button 
                        className="btn-secondary" 
                        onClick={() => selectProfile(null)}
                        style={{ padding: '8px 12px', fontSize: '13px', width: 'auto', flex: 1 }}
                    >
                        🔄 Alternar Perfil
                    </button>
                </div>
            </div>

            {/* FICHA DE ANAMNESE / TREINADOR */}
            <div className="card" style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📋 Ficha do Aluno (Anamnese)
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '15px', lineHeight: '1.5' }}>
                    Preencha seus dados físicos para que o <strong>Gerador ABC</strong> monte treinos específicos e adaptados para o seu perfil.
                </p>
                <form onSubmit={handleSaveAnamnese} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '5px' }}>Idade</label>
                            <input 
                                type="number" 
                                className="input-field" 
                                placeholder="Ex: 30" 
                                value={age}
                                onChange={e => setAge(e.target.value)}
                                style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff' }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '5px' }}>Gênero Biológico</label>
                            <select 
                                value={gender}
                                onChange={e => setGender(e.target.value)}
                                style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                            >
                                <option value="masculino">Masculino</option>
                                <option value="feminino">Feminino</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '5px' }}>Objetivo Geral</label>
                        <select 
                            value={objective}
                            onChange={e => setObjective(e.target.value)}
                            style={{ width: '100%', padding: '10px', background: 'var(--bg-secondary)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', outline: 'none' }}
                        >
                            <option value="hipertrofia">Ganho de Massa / Hipertrofia 💪</option>
                            <option value="emagrecimento">Redução de Gordura / Definição 🔥</option>
                            <option value="resistencia">Resistência / Condicionamento 📋</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '5px' }}>Músculos de Interesse (Foco Extra)</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '5px' }}>
                            {[
                                { id: 'peito', label: 'Peitoral (Peito)' },
                                { id: 'costas', label: 'Dorsais (Costas)' },
                                { id: 'ombros', label: 'Deltoides (Ombros)' },
                                { id: 'bracos', label: 'Braços (Bíceps/Tríceps)' },
                                { id: 'pernas', label: 'Coxas / Pernas' },
                                { id: 'gluteos', label: 'Glúteos' },
                                { id: 'core', label: 'Core / Abdominais' }
                            ].map(item => {
                                const isChecked = focusMuscles.includes(item.id);
                                return (
                                    <label 
                                        key={item.id} 
                                        style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '8px', 
                                            fontSize: '13px', 
                                            color: isChecked ? 'var(--accent)' : 'var(--text-main)', 
                                            cursor: 'pointer',
                                            padding: '6px 8px',
                                            background: isChecked ? 'rgba(var(--accent-rgb), 0.04)' : 'transparent',
                                            border: '1px solid rgba(255,255,255,0.02)',
                                            borderRadius: '6px'
                                        }}
                                    >
                                        <input 
                                            type="checkbox" 
                                            checked={isChecked}
                                            onChange={() => handleFocusMuscleChange(item.id)}
                                            style={{ accentColor: 'var(--accent)', cursor: 'pointer' }}
                                        />
                                        {item.label}
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className="btn-primary" 
                        style={{ 
                            padding: '12px', 
                            fontSize: '14px', 
                            background: saveSuccess ? '#22c55e' : 'var(--accent)', 
                            color: saveSuccess ? '#fff' : 'var(--text-dark)', 
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {saveSuccess ? '✓ Dados Salvos com Sucesso!' : '💾 Salvar Ficha de Anamnese'}
                    </button>
                </form>
            </div>

            {/* INSTALAR APP NO CELULAR */}
            {(() => {
                const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
                const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
                
                // Definir URL para o QR Code
                const ipToUse = localIp || '192.168.1.15';
                const targetUrl = window.location.hostname === 'localhost' 
                    ? `http://${ipToUse}:5173` 
                    : window.location.origin;
                const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(targetUrl)}`;

                return (
                    <div className="card" style={{ marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            📱 Instalar no Celular
                        </h3>
                        
                        {/* Se não for standalone, oferece instalação neste aparelho */}
                        {!isStandalone && (
                            <div style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '13px', display: 'block', marginBottom: '6px', color: 'var(--accent)' }}>
                                    Opção 1: Instalar neste aparelho
                                </span>
                                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: '1.4' }}>
                                    Adicione o FitLife à tela inicial para treinar em tela cheia com acesso offline.
                                </p>
                                <button 
                                    onClick={onInstall}
                                    className="btn-primary"
                                    style={{ padding: '12px 14px', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', cursor: 'pointer', marginBottom: '15px' }}
                                >
                                    ⚡ Instalar Aplicativo Agora
                                </button>
                                
                                <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '12px' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '12px', display: 'block', marginBottom: '6px', color: 'var(--text-main)' }}>
                                        {isIOS ? '🍎 Como Adicionar no iPhone (Safari):' : '🤖 Como Adicionar no Android (Chrome):'}
                                    </span>
                                    <ol style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, paddingLeft: '16px', lineHeight: '1.5' }}>
                                        {isIOS ? (
                                            <>
                                                <li>Toque no botão de <strong>Compartilhar</strong> (ícone 📤 na barra inferior).</li>
                                                <li>Selecione <strong>Adicionar à Tela de Início</strong> (ícone ➕).</li>
                                                <li>Toque em <strong>Adicionar</strong>.</li>
                                            </>
                                        ) : (
                                            <>
                                                <li>Toque nos <strong>três pontinhos ⋮</strong> no canto superior direito.</li>
                                                <li>Selecione <strong>Instalar aplicativo</strong> ou <strong>Adicionar à tela de início</strong>.</li>
                                                <li>Confirme a instalação.</li>
                                            </>
                                        )}
                                    </ol>
                                    {window.location.hostname !== 'localhost' && window.location.protocol === 'http:' && (
                                        <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px dashed rgba(255,255,255,0.05)', fontSize: '10px', color: 'var(--accent)', lineHeight: '1.4' }}>
                                            ℹ️ <strong>Nota de Rede:</strong> Como você está acessando por IP local, a instalação automática direta pode não aparecer por segurança (falta de HTTPS). Use as instruções acima ou clique no botão acima!
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Compartilhar/Instalar em outro celular (sempre visível) */}
                        <div>
                            <span style={{ fontWeight: 'bold', fontSize: '13px', display: 'block', marginBottom: '6px', color: 'var(--accent)' }}>
                                {isStandalone ? 'Instalar no celular da sua esposa (ou outro aparelho)' : 'Opção 2: Instalar no celular da sua esposa (ou outro aparelho)'}
                            </span>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: '1.4' }}>
                                Conecte o outro celular na **mesma rede Wi-Fi** deste dispositivo para abrir e instalar o FitLife nela.
                            </p>
                            
                            {window.location.hostname === 'localhost' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px', background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
                                        Digite o IP de Rede do seu computador:
                                    </label>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input 
                                            type="text" 
                                            value={localIp}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setLocalIp(val);
                                                localStorage.setItem('fitlife_local_ip', val);
                                            }}
                                            placeholder="Ex: 192.168.1.15"
                                            style={{
                                                flex: 1,
                                                background: 'var(--bg-tertiary)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                color: '#fff',
                                                padding: '6px 10px',
                                                borderRadius: '6px',
                                                fontSize: '12px'
                                            }}
                                        />
                                    </div>
                                    <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                                        *Verifique o endereço "Network" mostrado no terminal do servidor do app.
                                    </span>
                                </div>
                            )}

                            <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                gap: '10px', 
                                background: 'rgba(0,0,0,0.2)', 
                                padding: '15px', 
                                borderRadius: '8px', 
                                border: '1px solid rgba(255,255,255,0.05)' 
                            }}>
                                <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-main)', textAlign: 'center' }}>
                                    Escaneie o QR Code com a câmera do celular dela:
                                </span>
                                
                                <img 
                                    src={qrCodeUrl} 
                                    alt="QR Code de Instalação" 
                                    style={{ 
                                        width: '140px', 
                                        height: '140px', 
                                        borderRadius: '6px', 
                                        border: '4px solid #fff',
                                        background: '#fff'
                                    }} 
                                />

                                <span style={{ fontSize: '10px', color: 'var(--text-muted)', wordBreak: 'break-all', textAlign: 'center' }}>
                                    Ou digite no navegador dela:<br/>
                                    <a 
                                        href={targetUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        style={{ color: 'var(--accent)', textDecoration: 'underline', fontWeight: 'bold' }}
                                    >
                                        {targetUrl}
                                    </a>
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* ÁUDIO & VOZ */}
            <div className="card" style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📢 Áudio & Voz do Treino
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '15px', lineHeight: '1.5' }}>
                    Sintetizador de voz por fone de ouvido para narrar o término do descanso e indicar a próxima série/carga do exercício.
                </p>

                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    background: 'rgba(255,255,255,0.02)', 
                    padding: '12px 15px', 
                    borderRadius: '8px', 
                    border: '1px solid rgba(255,255,255,0.05)' 
                }}>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>Narração por Voz (Text-to-Speech)</span>
                    <label className="switch-voice" style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input 
                            type="checkbox" 
                            checked={voiceNotifications} 
                            onChange={toggleVoiceNotifications}
                            style={{ 
                                cursor: 'pointer',
                                width: '22px',
                                height: '22px',
                                accentColor: 'var(--accent)'
                            }} 
                        />
                    </label>
                </div>
            </div>

            {/* BACKUP E SEGURANÇA */}
            <div className="card">
                <h3 style={{ fontSize: '16px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    💾 Segurança & Backup dos Dados
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '15px', lineHeight: '1.5' }}>
                    Faça download das suas rotinas, histórico e recordes pessoais para manter seus dados seguros em outro dispositivo.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button 
                        onClick={exportBackupData} 
                        className="btn-secondary" 
                        style={{ padding: '12px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                        📤 Exportar Planilha (Baixar JSON)
                    </button>
                    
                    <label 
                        className="btn-secondary" 
                        style={{ 
                            padding: '12px', 
                            fontSize: '13px', 
                            cursor: 'pointer', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: '6px',
                            textAlign: 'center',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-tertiary)'
                        }}
                    >
                        📥 Importar Planilha (Carregar JSON)
                        <input 
                            type="file" 
                            accept=".json" 
                            onChange={handleImportFile} 
                            style={{ display: 'none' }} 
                        />
                    </label>
                </div>
            </div>


        </div>
    );
}
