import React from 'react';
import { useApp } from '../context/AppContext';

export default function ProfileSelection() {
    const { profiles, selectProfile } = useApp();

    return (
        <div className="profile-selection-container">
            <div className="logo-container">
                <div className="logo-badge">💪</div>
                <h1>FitLife</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '5px' }}>
                    Nosso App de Treino
                </p>
            </div>
            
            <h2 style={{ fontSize: '20px', marginBottom: '25px', fontWeight: '500' }}>
                Quem vai treinar hoje?
            </h2>
            
            <div className="profile-grid">
                {profiles.map(profile => (
                    <div 
                        key={profile.id}
                        className={`profile-card profile-${profile.theme}`}
                        onClick={() => selectProfile(profile.id)}
                    >
                        <div className="avatar">
                            {profile.avatar}
                        </div>
                        <span className="name">{profile.name}</span>
                    </div>
                ))}
            </div>
            
            <p style={{ 
                color: 'var(--text-muted)', 
                fontSize: '12px', 
                position: 'absolute', 
                bottom: '30px', 
                left: '0', 
                right: '0', 
                textAlign: 'center' 
            }}>
                Feito com ❤️ para Fábio & Adlai
            </p>
        </div>
    );
}
