import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import rawExercises from '../assets/exercises.json';
import { supabase } from '../supabaseClient';

const AppContext = createContext();

export const CALISTENIA_PROJECT = {
    name: "🤸 Projeto Calistenia",
    difficulty: "Médio / Avançado",
    duration: "45 min/dia",
    description: "Programa focado em progressões e exercícios preparatórios para alcançar as manobras clássicas da calistenia.",
    workouts: [
        {
            name: "Calistenia - Objetivo: Frog Stand",
            description: "Exercícios preparatórios de core, ombros e punhos para o equilíbrio no Frog Stand (Corvo).",
            coverStyle: "core",
            coverUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=600&auto=format&fit=crop",
            exercises: [
                { name: "Isometria de Frog Stand (Corvo)", path: "", series: 4, reps: 15, weight: 0, targetWeight: 0, notes: "Equilibre o corpo sobre as mãos com os joelhos apoiados nos cotovelos. Sustente por 15 segundos." },
                { name: "Flexão diamante", path: "Exercicios/Calistenia/Flexão diamante.gif", series: 3, reps: 10, weight: 0, targetWeight: 0, notes: "Fortaleça tríceps e estabilizadores mantendo as mãos juntas" },
                { name: "Pike Push-up (Flexão Pike)", path: "Exercicios/Calistenia/Flexões de apoio de mão na parede.gif", series: 3, reps: 8, weight: 0, targetWeight: 0, notes: "Foco no ganho de força vertical dos ombros" },
                { name: "Contração abdominal", path: "Exercicios/Mobilidade/Contração abdominal.gif", series: 3, reps: 15, weight: 0, targetWeight: 0, notes: "Mantenha o core firme e contraído para sustentação" }
            ]
        },
        {
            name: "Calistenia - Objetivo: Human Flag",
            description: "Rotina para o fortalecimento lateral do tronco e ombros preparando para a Bandeira Humana.",
            coverStyle: "costas",
            coverUrl: "https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?q=80&w=600&auto=format&fit=crop",
            exercises: [
                { name: "Bandeira Humana", path: "Exercicios/Calistenia/Bandeira Humana.gif", series: 4, reps: 6, weight: 0, targetWeight: 0, notes: "Progressão de isometria segurando no mastro ou espaldar lateral" },
                { name: "Elevação lateral com toalha na parede", path: "Exercicios/Calistenia/Elevação lateral com toalha na parede.gif", series: 3, reps: 10, weight: 0, targetWeight: 0, notes: "Excelente ativação e força dos deltoides laterais" },
                { name: "Puxada escapular na barra fixa", path: "Exercicios/Calistenia/Puxada escapular na barra fixa.gif", series: 3, reps: 12, weight: 0, targetWeight: 0, notes: "Força de sustentação e retração das escápulas" },
                { name: "Paralela", path: "Exercicios/Calistenia/Paralela.gif", series: 4, reps: 8, weight: 0, targetWeight: 0, notes: "Força de empurrar lateral dos braços" }
            ]
        },
        {
            name: "Calistenia - Objetivo: Muscle Up",
            description: "Exercícios de puxada explosiva e transição de força sobre a barra para o Muscle Up.",
            coverStyle: "peito",
            coverUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=600&auto=format&fit=crop",
            exercises: [
                { name: "Muscle up", path: "Exercicios/Calistenia/Muscle up.gif", series: 4, reps: 4, weight: 0, targetWeight: 0, notes: "Busque a execução explosiva com a puxada alta passando o peito" },
                { name: "Puxada escapular na barra fixa", path: "Exercicios/Calistenia/Puxada escapular na barra fixa.gif", series: 3, reps: 10, weight: 0, targetWeight: 0, notes: "Ativação escapular no início do movimento vertical" },
                { name: "Barra Fixa com Pegada Supinada", path: "Exercicios/Calistenia/Barra Fixa com Pegada Supinada.gif", series: 4, reps: 8, weight: 0, targetWeight: 0, notes: "Puxe o corpo para cima de forma rápida e controlada" },
                { name: "Paralela", path: "Exercicios/Calistenia/Paralela.gif", series: 4, reps: 10, weight: 0, targetWeight: 0, notes: "Força de empurrar essencial para finalizar a subida sobre a barra" }
            ]
        }
    ]
};

export const CALISTHENICS_MANEUVERS_INITIAL = {
    frog_stand: {
        id: "frog_stand",
        name: "Frog Stand",
        level: "Iniciante",
        category: "Empurrar/Equilibrio",
        status: "bloqueado",
        phase1_progress: [
            { exercise: "Prancha Tradicional", value: 0, target: 45, unit: "segundos" },
            { exercise: "Prancha Alta", value: 0, target: 35, unit: "segundos" }
        ],
        phase2_progress: [
            { exercise: "Lean Plank", value: 0, target: 15, unit: "segundos" },
            { exercise: "Frog Stand Assistido", value: 0, target: 30, unit: "segundos" }
        ],
        phase2_unlocked: false,
        maneuver_unlocked: false
    },
    elbow_lever: {
        id: "elbow_lever",
        name: "Elbow Lever",
        level: "Iniciante",
        category: "Empurrar/Equilibrio",
        status: "bloqueado",
        phase1_progress: [
            { exercise: "Flexoes de Braco Tradicionais", value: 0, target: 15, unit: "repeticoes" },
            { exercise: "Prancha Lombar (Superman)", value: 0, target: 30, unit: "segundos" }
        ],
        phase2_progress: [
            { exercise: "Elbow Lever com pes no chao", value: 0, target: 25, unit: "segundos" },
            { exercise: "Elbow Lever em Straddle", value: 0, target: 8, unit: "segundos" }
        ],
        phase2_unlocked: false,
        maneuver_unlocked: false
    },
    l_sit: {
        id: "l_sit",
        name: "L-Sit",
        level: "Intermediario",
        category: "Core/Empurrar",
        status: "bloqueado",
        phase1_progress: [
            { exercise: "Abdominal Canoa (Hollow Body)", value: 0, target: 30, unit: "segundos" },
            { exercise: "Fundos nas Paralelas (Dips)", value: 0, target: 10, unit: "repeticoes" }
        ],
        phase2_progress: [
            { exercise: "Support Hold nas Paralelas", value: 0, target: 30, unit: "segundos" },
            { exercise: "Tuck L-Sit", value: 0, target: 15, unit: "segundos" },
            { exercise: "One-Leg L-Sit", value: 0, target: 10, unit: "segundos" }
        ],
        phase2_unlocked: false,
        maneuver_unlocked: false
    },
    handstand: {
        id: "handstand",
        name: "Handstand (Parada de Mao)",
        level: "Intermediario",
        category: "Empurrar/Equilibrio",
        status: "bloqueado",
        phase1_progress: [
            { exercise: "Flexao Pike", value: 0, target: 8, unit: "repeticoes" },
            { exercise: "Prancha Alta", value: 0, target: 45, unit: "segundos" }
        ],
        phase2_progress: [
            { exercise: "Handstand na Parede (Costas)", value: 0, target: 30, unit: "segundos" },
            { exercise: "Handstand na Parede (Frente)", value: 0, target: 20, unit: "segundos" },
            { exercise: "Wall Scissor", value: 0, target: 6, unit: "repeticoes" }
        ],
        phase2_unlocked: false,
        maneuver_unlocked: false
    },
    skin_the_cat: {
        id: "skin_the_cat",
        name: "Skin the Cat",
        level: "Intermediario",
        category: "Puxar/Mobilidade",
        status: "bloqueado",
        phase1_progress: [
            { exercise: "Barra Fixa (Pull-ups)", value: 0, target: 8, unit: "repeticoes" },
            { exercise: "Elevacao de Joelhos na Barra", value: 0, target: 12, unit: "repeticoes" }
        ],
        phase2_progress: [
            { exercise: "Toes to Bar (Pes na Barra)", value: 0, target: 5, unit: "repeticoes" },
            { exercise: "Skin the Cat Assistido", value: 0, target: 4, unit: "repeticoes" }
        ],
        phase2_unlocked: false,
        maneuver_unlocked: false
    },
    human_flag: {
        id: "human_flag",
        name: "Bandeira Humana (Human Flag)",
        level: "Avançado",
        category: "Empurrar/Equilibrio",
        status: "bloqueado",
        phase1_progress: [
            { exercise: "Puxada escapular na barra fixa", value: 0, target: 12, unit: "repeticoes" },
            { exercise: "Paralela", value: 0, target: 8, unit: "repeticoes" }
        ],
        phase2_progress: [
            { exercise: "Elevação lateral com toalha na parede", value: 0, target: 10, unit: "repeticoes" },
            { exercise: "Bandeira Humana", value: 0, target: 6, unit: "repeticoes" }
        ],
        phase2_unlocked: false,
        maneuver_unlocked: false
    },
    muscle_up: {
        id: "muscle_up",
        name: "Muscle Up",
        level: "Avançado",
        category: "Puxar/Empurrar",
        status: "bloqueado",
        phase1_progress: [
            { exercise: "Barra Fixa com Pegada Supinada", value: 0, target: 8, unit: "repeticoes" },
            { exercise: "Paralela", value: 0, target: 10, unit: "repeticoes" }
        ],
        phase2_progress: [
            { exercise: "Puxada escapular na barra fixa", value: 0, target: 10, unit: "repeticoes" },
            { exercise: "Muscle up", value: 0, target: 4, unit: "repeticoes" }
        ],
        phase2_unlocked: false,
        maneuver_unlocked: false
    }
};

export const mergeDefaultSkills = (skills) => {
    if (!skills) return { merged: { ...CALISTHENICS_MANEUVERS_INITIAL }, hasChanges: true };
    const merged = { ...skills };
    let hasChanges = false;
    Object.keys(CALISTHENICS_MANEUVERS_INITIAL).forEach(key => {
        if (!merged[key]) {
            merged[key] = JSON.parse(JSON.stringify(CALISTHENICS_MANEUVERS_INITIAL[key]));
            hasChanges = true;
        }
    });
    return { merged, hasChanges };
};

export const buildSkillsFromDb = (dbRows) => {
    const skills = JSON.parse(JSON.stringify(CALISTHENICS_MANEUVERS_INITIAL));
    if (!dbRows || dbRows.length === 0) return skills;
    dbRows.forEach(row => {
        const mId = row.maneuver_id;
        if (skills[mId]) {
            skills[mId].status = row.status;
            skills[mId].phase2_unlocked = row.phase2_unlocked;
            skills[mId].maneuver_unlocked = row.maneuver_unlocked;
            
            if (Array.isArray(row.phase1_progress)) {
                row.phase1_progress.forEach(p => {
                    const item = skills[mId].phase1_progress.find(req => req.exercise === p.exercise);
                    if (item) item.value = p.value;
                });
            }
            if (Array.isArray(row.phase2_progress)) {
                row.phase2_progress.forEach(p => {
                    const item = skills[mId].phase2_progress.find(req => req.exercise === p.exercise);
                    if (item) item.value = p.value;
                });
            }
        }
    });
    return skills;
};

export const PRESET_WORKOUTS = {
    AUTOR: {
        name: "ABC escolhido por mim",
        difficulty: "Médio",
        duration: "45 min/dia",
        description: "Divisão ABC biomecanicamente estruturada com foco 100% em máquinas e polias para isolamento máximo e segurança articular.",
        workouts: [
            {
                name: "Treino A - Push (Peito, Ombro e Tríceps)",
                description: "Máquinas para eliminar a instabilidade, blindar o manguito e isolar o peitoral.",
                coverStyle: "peito",
                exercises: [
                    { name: "Supino Vertical na Máquina (Chest Press Machine)", path: "Exercicios/Peitoral/Supino na máquina.gif", series: 4, reps: 10, weight: 30, targetWeight: 45, notes: "Faixa de 10 a 12 repetições. Vantagem: Trajetória fixa, permitindo empurrar com força sem precisar equilibrar a carga." },
                    { name: "Crucifixo na Máquina (Pec Deck / Fly)", path: "Exercicios/Peitoral/Voador no pec deck.gif", series: 3, reps: 12, weight: 20, targetWeight: 30, notes: "Regule o banco de forma que as mãos fiquem na linha do meio do peito para poupar o ombro." },
                    { name: "Desenvolvimento de Ombros na Máquina", path: "Exercicios/Ombros/Desenvolvimento de ombros na máquina.gif", series: 3, reps: 10, weight: 15, targetWeight: 25, notes: "Dica: Se a máquina permitir, use a pegada neutra (palmas voltadas uma para a outra), mais anatômica e segura." },
                    { name: "Elevação Lateral na Polia Baixa (Cabo)", path: "Exercicios/Ombros/Elevação lateral unilateral com cabo.gif", series: 4, reps: 12, weight: 10, targetWeight: 15, notes: "Faixa de 12 a 15 repetições. O cabo mantém a tensão constante em todo o movimento, exigindo menos carga bruta." },
                    { name: "Tríceps na Polia Alta (Barra Reta/V)", path: "Exercicios/Tríceps/Tríceps pulley barra.gif", series: 4, reps: 12, weight: 20, targetWeight: 30, notes: "Corpo levemente inclinado para a frente, cotovelos travados ao lado das costelas." },
                    { name: "Tríceps na Polia Alta com Corda", path: "Exercicios/Tríceps/Tríceps pulley corda.gif", series: 3, reps: 10, weight: 15, targetWeight: 22, notes: "Faixa de 10 a 12 repetições. Abra a corda bem embaixo para contrair ao máximo." }
                ]
            },
            {
                name: "Treino B - Pull (Costas, Bíceps e Antebraço)",
                description: "Uso de polias e máquinas com suporte de peito para aliviar completamente a carga na lombar.",
                coverStyle: "costas",
                exercises: [
                    { name: "Puxada Alta no Pulley (Pegada Pronada)", path: "Exercicios/Costas/Puxada Alta.gif", series: 4, reps: 10, weight: 45, targetWeight: 60, notes: "Faixa de 10 a 12 repetições. Dica: Puxe a barra em direção ao topo do peito, inclinando o tronco minimamente." },
                    { name: "Remada Baixa Sentada na Polia (Pegada Triângulo)", path: "Exercicios/Costas/Remada Sentada com Cabo.gif", series: 4, reps: 10, weight: 35, targetWeight: 50, notes: "Mantenha a postura alinhada." },
                    { name: "Remada Máquina Convergente", path: "Exercicios/Costas/Remada frontal com alavanca.gif", series: 3, reps: 12, weight: 25, targetWeight: 40, notes: "Com suporte de peito. Vantagem: Apoio no peito zera a tensão na região lombar, focando 100% nas costas." },
                    { name: "Crucifixo Invertido na Máquina (Pec Deck Invertido)", path: "Exercicios/Ombros/Voador invertido.gif", series: 3, reps: 15, weight: 20, targetWeight: 30, notes: "Excelente para a postura e fortalecimento do deltoide posterior." },
                    { name: "Rosca Bíceps no Pulley Baixo", path: "Exercicios/Bíceps/Rosca Unilateral com Cabo.gif", series: 4, reps: 10, weight: 15, targetWeight: 22, notes: "Com barra W ou reta. Faixa de 10 a 12 repetições. Tense constante do cabo, ideal para bombear sangue." },
                    { name: "Rosca Scott na Máquina", path: "Exercicios/Bíceps/Rosca Scott com Alavanca.gif", series: 3, reps: 10, weight: 15, targetWeight: 22, notes: "Braço totalmente apoiado, isolando o bíceps ao máximo e impedindo o uso do ombro para 'roubar'." },
                    { name: "Rosca Inversa na Polia Baixa", path: "Exercicios/Antebraços/Rosca Inversa com Barra.gif", series: 3, reps: 12, weight: 10, targetWeight: 15, notes: "Para o antebraço. Nota: GIF ilustrativo usando barra livre devido à ausência de GIF específico para polia." }
                ]
            },
            {
                name: "Treino C - Legs & Core (Pernas e Abdômen)",
                description: "Controle total da amplitude em aparelhos para proteção articular e zero foco em glúteos.",
                coverStyle: "pernas",
                exercises: [
                    { name: "Cadeira Extensora", path: "Exercicios/Pernas/Cadeira extensora.gif", series: 4, reps: 12, weight: 25, targetWeight: 40, notes: "Faixa de 12 a 15 repetições. Aquecimento: Primeira série com metade da carga para lubrificar o joelho." },
                    { name: "Leg Press Horizontal (ou Leg 45°)", path: "Exercicios/Pernas/Leg Press Horizontal.gif", series: 4, reps: 10, weight: 60, targetWeight: 90, notes: "Faixa de 10 a 12 repetições. Pés na metade superior. Mantenha os joelhos destravados no topo." },
                    { name: "Cadeira Flexora (Sentado)", path: "Exercicios/Pernas/Cadeira flexora.gif", series: 4, reps: 12, weight: 25, targetWeight: 40, notes: "A versão sentada isola muito bem os posteriores de coxa de forma segura." },
                    { name: "Mesa Flexora (Deitado)", path: "Exercicios/Pernas/Mesa flexora.gif", series: 3, reps: 10, weight: 20, targetWeight: 30, notes: "Mantenha o quadril apoiado no banco." },
                    { name: "Gêmeos Sentado na Máquina (Panturrilha)", path: "Exercicios/Panturrilhas/Elevação de Panturrilha Sentado com Alavanca.gif", series: 4, reps: 15, weight: 20, targetWeight: 35, notes: "Movimento completo com alongamento máximo." },
                    { name: "Abdominal na Máquina (Crunch Machine)", path: "Exercicios/Mobilidade/Contração abdominal.gif", series: 4, reps: 15, weight: 15, targetWeight: 25, notes: "Faixa de 15 a 20 repetições. Nota: GIF ilustrativo de contração abdominal livre devido à ausência de GIF de máquina." }
                ]
            }
        ]
    },
    ESPOSA_VIDA: {
        name: "Treino escolhido pelo vida!",
        difficulty: "Iniciante",
        duration: "50 min/dia",
        description: "Treino personalizado criado pelo Fábio para a sua esposa.",
        workouts: [
            {
                name: "TREINO A",
                description: "Foco principal na parte frontal da coxa e panturrilha.",
                coverStyle: "pernas",
                exercises: [
                    { name: "Cadeira Extensora", path: "Exercicios/Pernas/Cadeira extensora.gif", series: 4, reps: 15, weight: 15, targetWeight: 25, notes: "Faixa de 12 a 15 repetições." },
                    { name: "Leg Press 45° Linear Amarelo", path: "Exercicios/Pernas/Leg Press.gif", series: 4, reps: 12, weight: 30, targetWeight: 50, notes: "Faixa de 10 a 12 repetições." },
                    { name: "Agachamento Articulado / Pendulum Squat", path: "Exercicios/Pernas/Agachamento na Máquina Hack.gif", series: 3, reps: 12, weight: 10, targetWeight: 20, notes: "Foco no controle do movimento." },
                    { name: "Gêmeos Sentado", path: "Exercicios/Panturrilhas/Elevação de Panturrilha Sentado com Alavanca.gif", series: 4, reps: 15, weight: 10, targetWeight: 20, notes: "Movimento completo com alongamento máximo." }
                ]
            },
            {
                name: "TREINO B",
                description: "Treino focado em membros superiores com esteira no final.",
                coverStyle: "costas",
                exercises: [
                    { name: "Puxada Alta Articulada", path: "Exercicios/Costas/Puxada Alta.gif", series: 4, reps: 12, weight: 15, targetWeight: 25, notes: "Faixa de 10 a 12 repetições." },
                    { name: "Supino Vertical na Máquina", path: "Exercicios/Peitoral/Supino na máquina.gif", series: 3, reps: 12, weight: 10, targetWeight: 15, notes: "Mantenha os ombros para trás." },
                    { name: "Remada Baixa Sentada na Polia", path: "Exercicios/Costas/Remada Sentada com Cabo.gif", series: 3, reps: 12, weight: 15, targetWeight: 25, notes: "Foco em contrair as costas." },
                    { name: "Tríceps no Pulley", path: "Exercicios/Tríceps/Tríceps pulley barra.gif", series: 3, reps: 15, weight: 10, targetWeight: 15, notes: "Faixa de 12 a 15 repetições." },
                    { name: "Rosca Bíceps no Pulley Baixo", path: "Exercicios/Bíceps/Rosca Unilateral com Cabo.gif", series: 3, reps: 15, weight: 5, targetWeight: 10, notes: "Faixa de 12 a 15 repetições." },
                    { name: "Esteira", path: "Exercicios/Cardio/Esteira Ergométrica.gif", series: 1, reps: 30, weight: 0, targetWeight: 0, notes: "25min a 30min de caminhada." }
                ]
            },
            {
                name: "TREINO C",
                description: "Foco na parte de trás das pernas.",
                coverStyle: "gluteos",
                exercises: [
                    { name: "Cadeira Flexora Sentada", path: "Exercicios/Pernas/Cadeira flexora.gif", series: 4, reps: 12, weight: 15, targetWeight: 25, notes: "Faixa de 10 a 12 repetições." },
                    { name: "Leg Press 45° Articulado por Tijolos", path: "Exercicios/Pernas/Leg Press Horizontal.gif", series: 4, reps: 12, weight: 20, targetWeight: 40, notes: "Posicione os pés mais no alto para focar no posterior." },
                    { name: "Cadeira Abdutora", path: "Exercicios/Pernas/Cadeira abdutora.gif", series: 4, reps: 15, weight: 20, targetWeight: 35, notes: "Tronco levemente inclinado para a frente." },
                    { name: "Mesa Flexora Deitado", path: "Exercicios/Pernas/Mesa flexora.gif", series: 3, reps: 12, weight: 10, targetWeight: 20, notes: "Não levante o quadril durante a execução." },
                    { name: "Gêmeos Sentado", path: "Exercicios/Panturrilhas/Elevação de Panturrilha Sentado com Alavanca.gif", series: 4, reps: 15, weight: 10, targetWeight: 20, notes: "Movimento completo com alongamento." }
                ]
            }
        ]
    },
    PPL: {
        name: "🏋️‍♂️ Push / Pull / Legs (PPL)",
        difficulty: "Avançado",
        duration: "60 min/dia",
        description: "Dividido em 3 treinos focados na ação muscular: Empurrar (Peito/Ombro/Tríceps), Puxar (Costas/Bíceps) e Pernas completas.",
        workouts: [
            {
                name: "Treino 1 (Empurrar) - Peito/Ombro/Tríceps",
                description: "Foco em peito, ombros e tríceps com aparelhos.",
                coverStyle: "peito",
                exercises: [
                    { name: "Supino Reto na Máquina", path: "Exercicios/Peitoral/Supino Reto na Máquina.gif", series: 4, reps: 10, weight: 30, targetWeight: 45, notes: "Cadência controlada" },
                    { name: "Supino inclinado na máquina", path: "Exercicios/Peitoral/Supino inclinado na máquina.gif", series: 4, reps: 10, weight: 20, targetWeight: 35, notes: "" },
                    { name: "Desenvolvimento de ombro na máquina", path: "Exercicios/Ombros/Desenvolvimento de ombro na máquina.gif", series: 3, reps: 10, weight: 15, targetWeight: 25, notes: "" },
                    { name: "Elevação lateral na máquina", path: "Exercicios/Ombros/Elevação lateral na máquina.gif", series: 4, reps: 12, weight: 10, targetWeight: 15, notes: "Foco na contração lateral" },
                    { name: "Extensão de tríceps no cabo alto", path: "Exercicios/Tríceps/Extensão de tríceps no cabo alto.gif", series: 4, reps: 12, weight: 20, targetWeight: 30, notes: "" }
                ]
            },
            {
                name: "Treino 2 (Puxar) - Costas/Bíceps",
                description: "Foco em costas e bíceps com polias e máquinas.",
                coverStyle: "costas",
                exercises: [
                    { name: "Puxada Alta", path: "Exercicios/Costas/Puxada Alta.gif", series: 4, reps: 10, weight: 45, targetWeight: 60, notes: "" },
                    { name: "Remada Sentada na Máquina", path: "Exercicios/Costas/Remada Sentada na Máquina.gif", series: 4, reps: 10, weight: 30, targetWeight: 45, notes: "" },
                    { name: "Rosca concentrada com cabo", path: "Exercicios/Bíceps/Rosca concentrada com cabo.gif", series: 4, reps: 10, weight: 15, targetWeight: 25, notes: "" },
                    { name: "Rosca Unilateral com Cabo", path: "Exercicios/Bíceps/Rosca Unilateral com Cabo.gif", series: 3, reps: 12, weight: 10, targetWeight: 18, notes: "" }
                ]
            },
            {
                name: "Treino 3 (Pernas) - Coxas/Panturrilhas",
                description: "Foco em membros inferiores utilizando aparelhos.",
                coverStyle: "pernas",
                exercises: [
                    { name: "Leg Press", path: "Exercicios/Pernas/Leg Press.gif", series: 4, reps: 10, weight: 80, targetWeight: 120, notes: "" },
                    { name: "Cadeira extensora", path: "Exercicios/Pernas/Cadeira extensora.gif", series: 4, reps: 12, weight: 30, targetWeight: 50, notes: "" },
                    { name: "Mesa flexora", path: "Exercicios/Pernas/Mesa flexora.gif", series: 3, reps: 10, weight: 25, targetWeight: 40, notes: "" }
                ]
            }
        ]
    },
    UL: {
        name: "💪 Superior / Inferior (Upper/Lower)",
        difficulty: "Médio",
        duration: "50 min/dia",
        description: "Divisão balanceada de 2 treinos para otimizar a frequência semanal de estímulo muscular.",
        workouts: [
            {
                name: "Treino Superior (Upper Body)",
                description: "Foco na parte superior completa do corpo em máquinas.",
                coverStyle: "geral",
                exercises: [
                    { name: "Supino Reto na Máquina", path: "Exercicios/Peitoral/Supino Reto na Máquina.gif", series: 4, reps: 10, weight: 30, targetWeight: 45, notes: "" },
                    { name: "Puxada Alta", path: "Exercicios/Costas/Puxada Alta.gif", series: 4, reps: 10, weight: 45, targetWeight: 60, notes: "" },
                    { name: "Desenvolvimento de ombro na máquina", path: "Exercicios/Ombros/Desenvolvimento de ombro na máquina.gif", series: 3, reps: 10, weight: 15, targetWeight: 25, notes: "" },
                    { name: "Rosca concentrada com cabo", path: "Exercicios/Bíceps/Rosca concentrada com cabo.gif", series: 3, reps: 12, weight: 15, targetWeight: 22, notes: "" },
                    { name: "Extensão de tríceps na máquina", path: "Exercicios/Tríceps/Extensão de tríceps na máquina.gif", series: 3, reps: 12, weight: 20, targetWeight: 30, notes: "" }
                ]
            },
            {
                name: "Treino Inferior (Lower Body)",
                description: "Foco nos membros inferiores em aparelhos.",
                coverStyle: "pernas",
                exercises: [
                    { name: "Leg Press", path: "Exercicios/Pernas/Leg Press.gif", series: 4, reps: 10, weight: 80, targetWeight: 120, notes: "" },
                    { name: "Cadeira extensora", path: "Exercicios/Pernas/Cadeira extensora.gif", series: 4, reps: 12, weight: 30, targetWeight: 50, notes: "" },
                    { name: "Mesa flexora", path: "Exercicios/Pernas/Mesa flexora.gif", series: 3, reps: 10, weight: 25, targetWeight: 40, notes: "" },
                    { name: "Máquina de Adução de Quadril", path: "Exercicios/Pernas/Máquina de Adução de Quadril.gif", series: 3, reps: 12, weight: 30, targetWeight: 45, notes: "" }
                ]
            }
        ]
    },
    FB: {
        name: "⚡ Corpo Inteiro (Full Body)",
        difficulty: "Médio",
        duration: "45 min/dia",
        description: "Treinamento completo englobando os grandes grupos em 1 único dia. Ideal para consistência rápida.",
        workouts: [
            {
                name: "Full Body - Corpo Inteiro",
                description: "Treinamento geral com foco nos grandes grupos em máquinas.",
                coverStyle: "geral",
                exercises: [
                    { name: "Leg Press", path: "Exercicios/Pernas/Leg Press.gif", series: 4, reps: 10, weight: 80, targetWeight: 120, notes: "" },
                    { name: "Supino Reto na Máquina", path: "Exercicios/Peitoral/Supino Reto na Máquina.gif", series: 4, reps: 10, weight: 30, targetWeight: 45, notes: "" },
                    { name: "Puxada Alta", path: "Exercicios/Costas/Puxada Alta.gif", series: 4, reps: 10, weight: 45, targetWeight: 60, notes: "" },
                    { name: "Elevação lateral na máquina", path: "Exercicios/Ombros/Elevação lateral na máquina.gif", series: 3, reps: 12, weight: 10, targetWeight: 15, notes: "" },
                    { name: "Rosca concentrada com cabo", path: "Exercicios/Bíceps/Rosca concentrada com cabo.gif", series: 3, reps: 10, weight: 15, targetWeight: 22, notes: "" }
                ]
            }
        ]
    },
    PEITO: {
        name: "🍒 Hipertrofia de Peito",
        difficulty: "Avançado",
        duration: "40 min/dia",
        description: "Foco absoluto no peitoral maior/menor, supino reto e inclinado em máquinas e cruzamentos de cabos.",
        workouts: [
            {
                name: "Foco Hipertrofia: Peito Gigante",
                description: "Treino especializado para desenvolvimento de peitoral com máquinas e cabos.",
                coverStyle: "peito",
                exercises: [
                    { name: "Supino Reto na Máquina", path: "Exercicios/Peitoral/Supino Reto na Máquina.gif", series: 4, reps: 10, weight: 40, targetWeight: 60, notes: "Cadência controlada na descida" },
                    { name: "Supino inclinado na máquina", path: "Exercicios/Peitoral/Supino inclinado na máquina.gif", series: 4, reps: 10, weight: 20, targetWeight: 35, notes: "Foco em peito superior" },
                    { name: "Voador na Máquina", path: "Exercicios/Peitoral/Voador na Máquina.gif", series: 4, reps: 12, weight: 30, targetWeight: 45, notes: "" },
                    { name: "Extensão de tríceps no cabo alto", path: "Exercicios/Tríceps/Extensão de tríceps no cabo alto.gif", series: 4, reps: 12, weight: 20, targetWeight: 30, notes: "" }
                ]
            }
        ]
    },
    EMAGRECER: {
        name: "🏃‍♂️ Perda de Peso / Cardio",
        difficulty: "Médio",
        duration: "35 min/dia",
        description: "Circuito intenso e dinâmico em aparelhos com menor tempo de descanso para alto gasto calórico.",
        workouts: [
            {
                name: "Circuito Cardio: Emagrecer e Queimar",
                description: "Exercícios em aparelhos com menor tempo de descanso para alto gasto calórico.",
                coverStyle: "cardio",
                exercises: [
                    { name: "Leg Press Horizontal", path: "Exercicios/Pernas/Leg Press Horizontal.gif", series: 4, reps: 12, weight: 60, targetWeight: 90, notes: "Menos de 45s de descanso" },
                    { name: "Puxada Alta", path: "Exercicios/Costas/Puxada Alta.gif", series: 4, reps: 12, weight: 40, targetWeight: 50, notes: "" },
                    { name: "Máquina de Adução de Quadril", path: "Exercicios/Pernas/Máquina de Adução de Quadril.gif", series: 3, reps: 15, weight: 20, targetWeight: 35, notes: "" },
                    { name: "Cadeira extensora", path: "Exercicios/Pernas/Cadeira extensora.gif", series: 3, reps: 12, weight: 25, targetWeight: 40, notes: "" }
                ]
            }
        ]
    },
    CORE: {
        name: "🛡️ Fortalecimento de Core",
        difficulty: "Médio",
        duration: "30 min/dia",
        description: "Estabilidade lombar, oblíquos e fortalecimento abdominal completo.",
        workouts: [
            {
                name: "Fortalecimento de Core: Core Ativo",
                description: "Foco em estabilidade lombar, oblíquos e fortalecimento abdominal completo.",
                coverStyle: "core",
                exercises: [
                    { name: "Contração abdominal", path: "Exercicios/Mobilidade/Contração abdominal.gif", series: 4, reps: 15, weight: 0, targetWeight: 0, notes: "Concentração no abdômen" },
                    { name: "Elevação Pélvica na Máquina de Extensão de Pernas", path: "Exercicios/Glúteos/Elevação Pélvica na Máquina de Extensão de Pernas.gif", series: 4, reps: 12, weight: 20, targetWeight: 35, notes: "Estabilização no topo" }
                ]
            }
        ]
    },
    TAF: {
        name: "📋 Preparação TAF (5 Dias)",
        difficulty: "Avançado",
        duration: "45 min/dia",
        description: "Foco nos exercícios obrigatórios de Testes de Aptidão Física (força de puxada, flexões de braço e resistência abdominal).",
        workouts: [
            {
                name: "Preparação TAF (5 Dias)",
                description: "Treino focado em testes de aptidão física (força de puxada, flexões de braço e resistência abdominal).",
                coverStyle: "geral",
                exercises: [
                    { name: "Barra Fixa com Pegada Supinada", path: "Exercicios/Calistenia/Barra Fixa com Pegada Supinada.gif", series: 4, reps: 6, weight: 0, targetWeight: 0, notes: "Puxe até passar o queixo da barra" },
                    { name: "Flexão", path: "Exercicios/Calistenia/Flexão.gif", series: 4, reps: 15, weight: 0, targetWeight: 0, notes: "Mantenha o tronco reto e estabilizado" },
                    { name: "Contração abdominal", path: "Exercicios/Mobilidade/Contração abdominal.gif", series: 4, reps: 20, weight: 0, targetWeight: 0, notes: "Expulse o ar na contração" }
                ]
            }
        ]
    },
    FEMININO: {
        name: "🌸 Modelador Pernas & Glúteos",
        difficulty: "Médio",
        duration: "50 min/dia",
        description: "Treino completo de pernas, glúteos e definição focado em aparelhos guiados e cabos para o público feminino.",
        workouts: [
            {
                name: "Modelador de Pernas & Glúteos (Foco em Aparelhos)",
                description: "Treino focado no público feminino para desenvolvimento de membros inferiores e glúteos.",
                coverStyle: "pernas",
                exercises: [
                    { name: "Elevação Pélvica na Máquina de Extensão de Pernas", path: "Exercicios/Glúteos/Elevação Pélvica na Máquina de Extensão de Pernas.gif", series: 4, reps: 12, weight: 20, targetWeight: 40, notes: "Pico de contração de 2s no topo" },
                    { name: "Leg Press", path: "Exercicios/Pernas/Leg Press.gif", series: 4, reps: 10, weight: 80, targetWeight: 120, notes: "Manter amplitude segura" },
                    { name: "Cadeira extensora", path: "Exercicios/Pernas/Cadeira extensora.gif", series: 3, reps: 12, weight: 20, targetWeight: 35, notes: "" },
                    { name: "Máquina de Adução de Quadril", path: "Exercicios/Pernas/Máquina de Adução de Quadril.gif", series: 4, reps: 15, weight: 30, targetWeight: 45, notes: "" },
                    { name: "Abdução de quadril com cabo", path: "Exercicios/Glúteos/Abdução de quadril com cabo.gif", series: 4, reps: 12, weight: 10, targetWeight: 15, notes: "Corpo alinhado e movimento controlado" }
                ]
            }
        ]
    },
    SUPERIOR_MAQ: {
        name: "🤖 Superior Máquinas (Upper Machine)",
        difficulty: "Médio",
        duration: "45 min/dia",
        description: "Rotina para membros superiores (peito, costas e ombros) focando inteiramente em aparelhos para segurança articular.",
        workouts: [
            {
                name: "Superior Completo (Foco em Máquinas)",
                description: "Treino abrangente para a parte superior do corpo, focando 100% in máquinas e polias.",
                coverStyle: "geral",
                exercises: [
                    { name: "Supino Reto na Máquina", path: "Exercicios/Peitoral/Supino Reto na Máquina.gif", series: 4, reps: 10, weight: 30, targetWeight: 50, notes: "Cadência lenta na excêntrica" },
                    { name: "Puxada Alta", path: "Exercicios/Costas/Puxada Alta.gif", series: 4, reps: 10, weight: 45, targetWeight: 60, notes: "" },
                    { name: "Desenvolvimento de ombro na máquina", path: "Exercicios/Ombros/Desenvolvimento de ombro na máquina.gif", series: 3, reps: 10, weight: 15, targetWeight: 25, notes: "" },
                    { name: "Remada Sentada na Máquina", path: "Exercicios/Costas/Remada Sentada na Máquina.gif", series: 3, reps: 10, weight: 30, targetWeight: 45, notes: "" },
                    { name: "Elevação lateral na máquina", path: "Exercicios/Ombros/Elevação lateral na máquina.gif", series: 3, reps: 12, weight: 10, targetWeight: 15, notes: "" }
                ]
            }
        ]
    },
    BRACOS_CABO: {
        name: "💪 Braços Gigantes (Cabos & Polias)",
        difficulty: "Médio",
        duration: "40 min/dia",
        description: "Treino de isolamento focado em bíceps e tríceps utilizando polias, garantindo tensão mecânica constante.",
        workouts: [
            {
                name: "Braços Gigantes (Cabos & Polias)",
                description: "Treino de isolamento focado em bíceps e tríceps utilizando polias.",
                coverStyle: "geral",
                exercises: [
                    { name: "Extensão de tríceps no cabo alto", path: "Exercicios/Tríceps/Extensão de tríceps no cabo alto.gif", series: 4, reps: 12, weight: 20, targetWeight: 30, notes: "" },
                    { name: "Rosca concentrada com cabo", path: "Exercicios/Bíceps/Rosca concentrada com cabo.gif", series: 4, reps: 10, weight: 15, targetWeight: 25, notes: "" },
                    { name: "Extensão de tríceps na máquina", path: "Exercicios/Tríceps/Extensão de tríceps na máquina.gif", series: 3, reps: 10, weight: 20, targetWeight: 30, notes: "" },
                    { name: "Rosca Unilateral com Cabo", path: "Exercicios/Bíceps/Rosca Unilateral com Cabo.gif", series: 3, reps: 12, weight: 10, targetWeight: 18, notes: "" }
                ]
            }
        ]
    },
    CARDIO_EXPRESS: {
        name: "⚡ Circuito Queima Rápida",
        difficulty: "Médio",
        duration: "30 min/dia",
        description: "Treino dinâmico em formato de circuito utilizando aparelhos com tempo mínimo de descanso para máxima queima.",
        workouts: [
            {
                name: "Circuito Queima Rápida (Cardio Express)",
                description: "Circuito de alta intensidade e baixo descanso focado em queima calórica.",
                coverStyle: "cardio",
                exercises: [
                    { name: "Leg Press Horizontal", path: "Exercicios/Pernas/Leg Press Horizontal.gif", series: 4, reps: 15, weight: 50, targetWeight: 70, notes: "Descanso de 30s" },
                    { name: "Puxada Alta", path: "Exercicios/Costas/Puxada Alta.gif", series: 4, reps: 12, weight: 35, targetWeight: 45, notes: "" },
                    { name: "Contração abdominal", path: "Exercicios/Mobilidade/Contração abdominal.gif", series: 4, reps: 20, weight: 0, targetWeight: 0, notes: "" },
                    { name: "Extensão de tríceps no cabo alto", path: "Exercicios/Tríceps/Extensão de tríceps no cabo alto.gif", series: 3, reps: 15, weight: 15, targetWeight: 20, notes: "" }
                ]
            }
        ]
    }
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp deve ser usado dentro de um AppProvider');
    }
    return context;
};

export const AppProvider = ({ children }) => {
    // 1. Perfis e Perfil Ativo
    const [profiles, setProfiles] = useState([
        { id: 'fabio', name: 'Fábio', avatar: '⚡', theme: 'fabio' },
        { id: 'esposa', name: 'Adlai 💖', avatar: '💖', theme: 'esposa' }
    ]);
    
    const [activeProfileId, setActiveProfileId] = useState(() => {
        return localStorage.getItem('fitlife_v3_active_profile') || null;
    });

    const activeProfile = profiles.find(p => p.id === activeProfileId);

    // 2. Base de Exercícios
    const [exercises] = useState(rawExercises);

    // 3. Treinos Montados (carrega por perfil)
    const [workouts, setWorkouts] = useState([]);

    // 4. Histórico de Treinos
    const [history, setHistory] = useState([]);

    // 4.5 Exercícios Favoritos
    const [favorites, setFavorites] = useState([]);

    // 4.6 Recordes Pessoais (PR)
    const [personalRecords, setPersonalRecords] = useState({});

    // 4.7 Ofensiva de Treino (Streak)
    const [workoutStreak, setWorkoutStreak] = useState(0);

    // 4.8 Detalhes do Perfil / Anamnese (Ficha do Aluno)
    const [profileDetails, setProfileDetails] = useState(null);

    // 4.9 Medidas Corporais e Peso
    const [measurements, setMeasurements] = useState([]);

    // 4.10 Habilidades de Calistenia (Skills)
    const [calisthenicsSkills, setCalisthenicsSkills] = useState(() => {
        return CALISTHENICS_MANEUVERS_INITIAL;
    });

    // 4.10.1 Navegação / Foco da Calistenia
    const [activeEvolutionSubTab, setActiveEvolutionSubTab] = useState('medidas');
    const [expandedCalisthenicsSkillId, setExpandedCalisthenicsSkillId] = useState(null);

    // 4.11 Fotos de Evolução Física
    const [evolutionPhotos, setEvolutionPhotos] = useState([]);

    // 4.12 Estado de Notificação de Validação Cruzada (Toast)
    const [toastMessage, setToastMessage] = useState(null);

    // 4.9 Narração por Voz do Descanso (PWA / Text-to-Speech)
    const [voiceNotifications, setVoiceNotifications] = useState(() => {
        const saved = localStorage.getItem('fitlife_v3_voice_notifications');
        return saved !== null ? JSON.parse(saved) : true;
    });

    const toggleVoiceNotifications = () => {
        setVoiceNotifications(prev => {
            const next = !prev;
            localStorage.setItem('fitlife_v3_voice_notifications', JSON.stringify(next));
            return next;
        });
    };

    // 5. Estado do Treino Ativo (Gym Mode)
    const [activeWorkout, setActiveWorkout] = useState(null); 
    // activeWorkout: { workoutId, workoutName, currentExerciseIndex, startTime, exercises: [ { name, path, series: [ { reps, weight, completed, actualReps, actualWeight } ] } ] }

    // Estados do cronômetro de descanso (Globais para persistência e som em background)
    const [restTime, setRestTime] = useState(60);
    const [timeLeft, setTimeLeft] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const audioContextRef = useRef(null);

    // --- FUNÇÕES AUXILIARES SUPABASE ---
    const loadDataFromSupabase = async (profileId) => {
        if (!supabase) return;
        try {
            // 1. Carregar treinos
            const { data: workoutsData, error: workoutsError } = await supabase
                .from('fitlife_workouts')
                .select('*')
                .eq('profile_id', profileId);
                
            if (!workoutsError && workoutsData) {
                if (workoutsData.length > 0) {
                    const parsedWorkouts = workoutsData.map(w => ({
                        id: Number(w.id) || w.id,
                        name: w.name,
                        description: w.description,
                        coverStyle: w.cover_style,
                        exercises: w.exercises,
                        createdAt: w.created_at,
                        updatedAt: w.updated_at
                    }));
                    setWorkouts(parsedWorkouts);
                    localStorage.setItem(`fitlife_v3_workouts_${profileId}`, JSON.stringify(parsedWorkouts));
                }
            }

            // 2. Carregar histórico
            const { data: historyData, error: historyError } = await supabase
                .from('fitlife_history')
                .select('*')
                .eq('profile_id', profileId)
                .order('date', { ascending: false });
                
            if (!historyError && historyData) {
                const parsedHistory = historyData.map(h => ({
                    id: Number(h.id) || h.id,
                    workoutId: Number(h.workout_id) || h.workout_id,
                    workoutName: h.workout_name,
                    date: h.date,
                    duration: h.duration,
                    isCardio: h.is_cardio,
                    cardioType: h.cardio_type,
                    distance: h.distance,
                    heartRate: h.heart_rate,
                    calories: h.calories,
                    exercises: h.exercises,
                    notes: h.notes
                }));
                setHistory(parsedHistory);
                localStorage.setItem(`fitlife_v3_history_${profileId}`, JSON.stringify(parsedHistory));
            }

            // 3. Carregar dados consolidados
            const { data: pdData, error: pdError } = await supabase
                .from('fitlife_profile_data')
                .select('*')
                .eq('profile_id', profileId)
                .maybeSingle();

            if (!pdError && pdData) {
                if (pdData.favorites !== null) {
                    setFavorites(pdData.favorites);
                    localStorage.setItem(`fitlife_v3_favorites_${profileId}`, JSON.stringify(pdData.favorites));
                }
                if (pdData.personal_records !== null) {
                    setPersonalRecords(pdData.personal_records);
                    localStorage.setItem(`fitlife_v3_pr_${profileId}`, JSON.stringify(pdData.personal_records));
                }
                if (pdData.measurements !== null) {
                    setMeasurements(pdData.measurements);
                    localStorage.setItem(`fitlife_v3_measurements_${profileId}`, JSON.stringify(pdData.measurements));
                }
                // 3.5 Carregar progresso de calistenia dedicado
                const { data: calisthenicsData, error: calisthenicsError } = await supabase
                    .from('fitlife_calisthenics_progress')
                    .select('*')
                    .eq('profile_id', profileId);
                    
                if (!calisthenicsError && calisthenicsData && calisthenicsData.length > 0) {
                    const skillsMerged = buildSkillsFromDb(calisthenicsData);
                    const { merged } = mergeDefaultSkills(skillsMerged);
                    setCalisthenicsSkills(merged);
                    localStorage.setItem(`fitlife_v3_skills_${profileId}`, JSON.stringify(merged));
                } else if (pdData.skills !== null) {
                    // Fallback para o JSON legado caso não haja registros na nova tabela
                    const legacySkills = pdData.skills;
                    if (legacySkills && legacySkills.frog_stand) {
                        const { merged } = mergeDefaultSkills(legacySkills);
                        setCalisthenicsSkills(merged);
                        localStorage.setItem(`fitlife_v3_skills_${profileId}`, JSON.stringify(merged));
                    } else {
                        setCalisthenicsSkills(CALISTHENICS_MANEUVERS_INITIAL);
                        localStorage.setItem(`fitlife_v3_skills_${profileId}`, JSON.stringify(CALISTHENICS_MANEUVERS_INITIAL));
                    }
                }
                if (pdData.profile_details !== null) {
                    setProfileDetails(pdData.profile_details);
                    localStorage.setItem(`fitlife_v3_profile_details_${profileId}`, JSON.stringify(pdData.profile_details));
                }
                if (pdData.active_workout !== null) {
                    setActiveWorkout(pdData.active_workout);
                    localStorage.setItem(`fitlife_v3_active_workout_${profileId}`, JSON.stringify(pdData.active_workout));
                } else {
                    setActiveWorkout(null);
                    localStorage.removeItem(`fitlife_v3_active_workout_${profileId}`);
                }
                if (pdData.evolution_photos !== null) {
                    setEvolutionPhotos(pdData.evolution_photos);
                    localStorage.setItem(`fitlife_v3_evolution_photos_${profileId}`, JSON.stringify(pdData.evolution_photos));
                }
            }
        } catch (err) {
            console.error('Erro ao sincronizar do Supabase:', err);
        }
    };

    const syncWorkoutsToSupabase = async (profileId, list) => {
        if (!supabase) return;
        try {
            const currentIds = list.map(w => String(w.id));
            if (currentIds.length > 0) {
                await supabase
                    .from('fitlife_workouts')
                    .delete()
                    .eq('profile_id', profileId)
                    .not('id', 'in', `(${currentIds.join(',')})`);
            } else {
                await supabase
                    .from('fitlife_workouts')
                    .delete()
                    .eq('profile_id', profileId);
            }
            if (list.length > 0) {
                const rows = list.map(w => ({
                    id: String(w.id),
                    profile_id: profileId,
                    name: w.name,
                    description: w.description || '',
                    cover_style: w.coverStyle || 'geral',
                    exercises: w.exercises,
                    updated_at: new Date().toISOString()
                }));
                await supabase.from('fitlife_workouts').upsert(rows);
            }
        } catch (e) {
            console.error('Erro ao sincronizar treinos para o Supabase:', e);
        }
    };

    const syncHistoryToSupabase = async (profileId, list) => {
        if (!supabase) return;
        try {
            const currentIds = list.map(h => String(h.id));
            if (currentIds.length > 0) {
                await supabase
                    .from('fitlife_history')
                    .delete()
                    .eq('profile_id', profileId)
                    .not('id', 'in', `(${currentIds.join(',')})`);
            } else {
                await supabase
                    .from('fitlife_history')
                    .delete()
                    .eq('profile_id', profileId);
            }
            if (list.length > 0) {
                const rows = list.map(h => ({
                    id: String(h.id),
                    profile_id: profileId,
                    workout_id: h.workoutId ? String(h.workoutId) : null,
                    workout_name: h.workoutName,
                    date: h.date,
                    duration: h.duration,
                    is_cardio: h.isCardio || false,
                    cardio_type: h.cardioType || null,
                    distance: h.distance || 0,
                    heart_rate: h.heartRate || null,
                    calories: h.calories || null,
                    exercises: h.exercises,
                    notes: h.notes || ''
                }));
                await supabase.from('fitlife_history').upsert(rows);
            }
        } catch (e) {
            console.error('Erro ao sincronizar histórico para o Supabase:', e);
        }
    };

    const updateProfileDataField = async (profileId, field, data) => {
        if (!supabase) return;
        try {
            await supabase
                .from('fitlife_profile_data')
                .upsert({
                    profile_id: profileId,
                    [field]: data,
                    updated_at: new Date().toISOString()
                });
        } catch (e) {
            console.error(`Erro ao sincronizar ${field} para o Supabase:`, e);
        }
    };

    // Sintetizador de som nativo para descanso global
    const playBeepSound = () => {
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            const ctx = audioContextRef.current;
            if (ctx.state === 'suspended') {
                ctx.resume();
            }
            const playSingleBeep = (time, freq, dur) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.setValueAtTime(freq, time);
                gain.gain.setValueAtTime(0, time);
                gain.gain.linearRampToValueAtTime(0.3, time + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
                osc.start(time);
                osc.stop(time + dur);
            };
            const now = ctx.currentTime;
            playSingleBeep(now, 880, 0.2);
            playSingleBeep(now + 0.25, 880, 0.2);
            playSingleBeep(now + 0.5, 1200, 0.4);
        } catch (e) {
            console.error('Falha ao reproduzir áudio do cronômetro:', e);
        }
    };

    // Síntese de voz do fim de descanso global
    const speakRestEnd = (currentEx, exIdx, allExs) => {
        if (!('speechSynthesis' in window)) return;
        try {
            window.speechSynthesis.cancel();
            let message = "Descanso encerrado. ";
            const nextSetIndex = currentEx.series.findIndex(s => !s.completed);
            if (nextSetIndex !== -1) {
                const nextSet = currentEx.series[nextSetIndex];
                const weight = nextSet.actualWeight || nextSet.weight || 0;
                message += `Faça a próxima série de ${currentEx.name}. `;
                if (weight > 0) {
                    message += `Carga recomendada: ${weight} quilos.`;
                } else {
                    message += `Sem peso.`;
                }
            } else {
                if (exIdx < allExs.length - 1) {
                    const nextEx = allExs[exIdx + 1];
                    const firstSet = nextEx.series[0] || {};
                    const weight = firstSet.actualWeight || firstSet.weight || 0;
                    message += `Mude para o próximo exercício: ${nextEx.name}. `;
                    if (weight > 0) {
                        message += `Carga inicial: ${weight} quilos.`;
                    } else {
                        message += `Sem peso.`;
                    }
                } else {
                    message += "Parabéns! Todos os exercícios do seu treino foram concluídos. Finalize a planilha no topo da tela.";
                }
            }
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = 'pt-BR';
            utterance.rate = 1.05;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error('Erro na síntese de voz:', error);
        }
    };

    // Countdown effect global
    useEffect(() => {
        let interval = null;
        if (timerActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && timerActive) {
            playBeepSound();
            if (voiceNotifications && activeWorkout) {
                const { exercises: allExs, currentExerciseIndex: exIdx } = activeWorkout;
                const currentEx = allExs[exIdx];
                if (currentEx) {
                    speakRestEnd(currentEx, exIdx, allExs);
                }
            }
            setTimerActive(false);
        }
        return () => clearInterval(interval);
    }, [timerActive, timeLeft, voiceNotifications, activeWorkout]);

    // Carrega treinos e histórico do localStorage ao alterar o perfil ativo
    useEffect(() => {
        if (activeProfileId) {
            localStorage.setItem('fitlife_v3_active_profile', activeProfileId);
            
            const savedWorkouts = localStorage.getItem(`fitlife_v3_workouts_${activeProfileId}`);
            setWorkouts(savedWorkouts ? JSON.parse(savedWorkouts) : getInitialWorkouts(activeProfileId));

            const savedHistory = localStorage.getItem(`fitlife_v3_history_${activeProfileId}`);
            setHistory(savedHistory ? JSON.parse(savedHistory) : []);

            const savedFavorites = localStorage.getItem(`fitlife_v3_favorites_${activeProfileId}`);
            setFavorites(savedFavorites ? JSON.parse(savedFavorites) : []);

            const savedPRs = localStorage.getItem(`fitlife_v3_pr_${activeProfileId}`);
            setPersonalRecords(savedPRs ? JSON.parse(savedPRs) : {});

            const savedMeasurements = localStorage.getItem(`fitlife_v3_measurements_${activeProfileId}`);
            setMeasurements(savedMeasurements ? JSON.parse(savedMeasurements) : []);

            const savedSkills = localStorage.getItem(`fitlife_v3_skills_${activeProfileId}`);
            if (savedSkills) {
                const parsed = JSON.parse(savedSkills);
                const { merged, hasChanges } = mergeDefaultSkills(parsed);
                setCalisthenicsSkills(merged);
                if (hasChanges) {
                    localStorage.setItem(`fitlife_v3_skills_${activeProfileId}`, JSON.stringify(merged));
                }
            } else {
                setCalisthenicsSkills(CALISTHENICS_MANEUVERS_INITIAL);
            }

            const savedPhotos = localStorage.getItem(`fitlife_v3_evolution_photos_${activeProfileId}`);
            setEvolutionPhotos(savedPhotos ? JSON.parse(savedPhotos) : []);

            const savedDetails = localStorage.getItem(`fitlife_v3_profile_details_${activeProfileId}`);
            if (savedDetails) {
                setProfileDetails(JSON.parse(savedDetails));
            } else {
                // Sugere valores padrão baseados no ID do perfil
                const defaultDetails = activeProfileId === 'fabio' 
                    ? { age: 30, gender: 'masculino', objective: 'hipertrofia', focusMuscles: ['peito', 'costas', 'ombros', 'bracos'] }
                    : { age: 28, gender: 'feminino', objective: 'emagrecimento', focusMuscles: ['gluteos', 'pernas', 'core'] };
                setProfileDetails(defaultDetails);
            }
            
            // Tenta restaurar treino em andamento
            const savedActive = localStorage.getItem(`fitlife_v3_active_workout_${activeProfileId}`);
            if (savedActive) {
                setActiveWorkout(JSON.parse(savedActive));
            } else {
                setActiveWorkout(null);
            }

            // Carrega do Supabase em background (Local-first / Stale-While-Revalidate)
            loadDataFromSupabase(activeProfileId);
        } else {
            setWorkouts([]);
            setHistory([]);
            setFavorites([]);
            setPersonalRecords({});
            setMeasurements([]);
            setCalisthenicsSkills(CALISTHENICS_MANEUVERS_INITIAL);
            setEvolutionPhotos([]);
            setProfileDetails(null);
            setActiveWorkout(null);
        }
    }, [activeProfileId]);

    // Alternar favorito
    const toggleFavorite = (exerciseName) => {
        let newFavorites = [...favorites];
        if (newFavorites.includes(exerciseName)) {
            newFavorites = newFavorites.filter(name => name !== exerciseName);
        } else {
            newFavorites.push(exerciseName);
        }
        setFavorites(newFavorites);
        if (activeProfileId) {
            localStorage.setItem(`fitlife_v3_favorites_${activeProfileId}`, JSON.stringify(newFavorites));
            updateProfileDataField(activeProfileId, 'favorites', newFavorites);
        }
    };

    // Salva treinos no localStorage sempre que forem alterados
    const saveWorkoutsList = (newWorkouts) => {
        setWorkouts(newWorkouts);
        if (activeProfileId) {
            localStorage.setItem(`fitlife_v3_workouts_${activeProfileId}`, JSON.stringify(newWorkouts));
            syncWorkoutsToSupabase(activeProfileId, newWorkouts);
        }
    };

    // Salva histórico no localStorage sempre que for alterado
    const saveHistoryList = (newHistory) => {
        setHistory(newHistory);
        if (activeProfileId) {
            localStorage.setItem(`fitlife_v3_history_${activeProfileId}`, JSON.stringify(newHistory));
            syncHistoryToSupabase(activeProfileId, newHistory);
        }
    };

    // Salva estado do treino ativo atual
    const saveActiveWorkoutState = (state) => {
        setActiveWorkout(state);
        if (activeProfileId) {
            if (state) {
                localStorage.setItem(`fitlife_v3_active_workout_${activeProfileId}`, JSON.stringify(state));
            } else {
                localStorage.removeItem(`fitlife_v3_active_workout_${activeProfileId}`);
            }
            updateProfileDataField(activeProfileId, 'active_workout', state);
        }
    };

    // Salva ou atualiza um Recorde Pessoal (PR)
    const savePR = (exerciseName, weight, reps) => {
        const updatedPRs = {
            ...personalRecords,
            [exerciseName]: {
                weight: parseFloat(weight) || 0,
                reps: parseInt(reps) || 0,
                date: new Date().toISOString()
            }
        };
        setPersonalRecords(updatedPRs);
        if (activeProfileId) {
            localStorage.setItem(`fitlife_v3_pr_${activeProfileId}`, JSON.stringify(updatedPRs));
            updateProfileDataField(activeProfileId, 'personal_records', updatedPRs);
        }
    };

    // Substitui um exercício no treino ativo (opcionalmente de forma permanente)
    const swapActiveWorkoutExercise = (exerciseIndex, newExercise, savePermanently) => {
        if (!activeWorkout) return;

        const originalExerciseName = activeWorkout.exercises[exerciseIndex].name;
        
        // 1. Atualiza o treino ativo
        const updatedActiveExercises = activeWorkout.exercises.map((ex, idx) => {
            if (idx === exerciseIndex) {
                return {
                    ...ex,
                    name: newExercise.name,
                    path: newExercise.path,
                    notes: `Substituído de: ${originalExerciseName}`
                };
            }
            return ex;
        });

        const newActiveState = {
            ...activeWorkout,
            exercises: updatedActiveExercises
        };
        saveActiveWorkoutState(newActiveState);

        // 2. Se for para salvar permanentemente, atualiza no treino original
        if (savePermanently) {
            const updatedWorkouts = workouts.map(workout => {
                if (workout.id === activeWorkout.workoutId) {
                    const updatedExercises = workout.exercises.map(ex => {
                        if (ex.name === originalExerciseName) {
                            return {
                                ...ex,
                                name: newExercise.name,
                                path: newExercise.path
                            };
                        }
                        return ex;
                    });
                    return { ...workout, exercises: updatedExercises };
                }
                return workout;
            });
            saveWorkoutsList(updatedWorkouts);
        }
    };

    // Auxiliares para cálculo de Ofensiva (Streak)
    const getMonday = (d) => {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(date.setDate(diff));
        monday.setHours(0, 0, 0, 0);
        return monday.toISOString().split('T')[0];
    };

    const calculateStreak = (historyList) => {
        if (!historyList || historyList.length === 0) return 0;
        
        const mondays = new Set(historyList.map(item => getMonday(item.date)));
        const today = new Date();
        const currentMonday = getMonday(today);
        
        const prevMondayDate = new Date(currentMonday);
        prevMondayDate.setDate(prevMondayDate.getDate() - 7);
        const prevMonday = prevMondayDate.toISOString().split('T')[0];
        
        if (!mondays.has(currentMonday) && !mondays.has(prevMonday)) {
            return 0;
        }
        
        let checkMondayStr = mondays.has(currentMonday) ? currentMonday : prevMonday;
        let streak = 0;
        
        while (mondays.has(checkMondayStr)) {
            streak++;
            const nextCheckDate = new Date(checkMondayStr);
            nextCheckDate.setDate(nextCheckDate.getDate() - 7);
            checkMondayStr = nextCheckDate.toISOString().split('T')[0];
        }
        
        return streak;
    };

    // Atualiza a ofensiva de semanas ativas sempre que o histórico muda
    useEffect(() => {
        setWorkoutStreak(calculateStreak(history));
    }, [history]);

    // Executa a checagem cruzada em segundo plano sempre que o histórico muda
    useEffect(() => {
        if (activeProfileId && history && history.length > 0 && calisthenicsSkills) {
            runCalisthenicsCrossValidation(history, calisthenicsSkills);
        }
    }, [history]);

    // Salva ou atualiza um log de medidas corporais
    const saveMeasurement = (log) => {
        let newMeasurements = [...measurements];
        const existingIdx = newMeasurements.findIndex(m => m.date === log.date);
        
        if (existingIdx !== -1) {
            newMeasurements[existingIdx] = log;
        } else {
            newMeasurements.push(log);
        }
        
        // Ordena por data ascendente para facilitar a plotagem nos gráficos
        newMeasurements.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        setMeasurements(newMeasurements);
        if (activeProfileId) {
            localStorage.setItem(`fitlife_v3_measurements_${activeProfileId}`, JSON.stringify(newMeasurements));
            updateProfileDataField(activeProfileId, 'measurements', newMeasurements);
        }
    };

    // Remove um log de medidas corporais
    const deleteMeasurement = (date) => {
        const newMeasurements = measurements.filter(m => m.date !== date);
        setMeasurements(newMeasurements);
        if (activeProfileId) {
            localStorage.setItem(`fitlife_v3_measurements_${activeProfileId}`, JSON.stringify(newMeasurements));
            updateProfileDataField(activeProfileId, 'measurements', newMeasurements);
        }
    };

    // Salva os detalhes do perfil (Anamnese)
    const saveProfileDetails = (details) => {
        setProfileDetails(details);
        if (activeProfileId) {
            localStorage.setItem(`fitlife_v3_profile_details_${activeProfileId}`, JSON.stringify(details));
            updateProfileDataField(activeProfileId, 'profile_details', details);
        }
    };

    // Salva habilidades de calistenia
    const saveCalisthenicsSkills = async (newSkills) => {
        setCalisthenicsSkills(newSkills);
        if (activeProfileId) {
            localStorage.setItem(`fitlife_v3_skills_${activeProfileId}`, JSON.stringify(newSkills));
            updateProfileDataField(activeProfileId, 'skills', newSkills);

            if (supabase) {
                try {
                    const upserts = Object.keys(newSkills).map(mId => {
                        const m = newSkills[mId];
                        return {
                            profile_id: activeProfileId,
                            maneuver_id: mId,
                            status: m.status,
                            phase1_progress: m.phase1_progress.map(p => ({ exercise: p.exercise, value: p.value })),
                            phase2_progress: m.phase2_progress.map(p => ({ exercise: p.exercise, value: p.value })),
                            phase2_unlocked: m.phase2_unlocked,
                            maneuver_unlocked: m.maneuver_unlocked,
                            updated_at: new Date().toISOString()
                        };
                    });
                    
                    await supabase
                        .from('fitlife_calisthenics_progress')
                        .upsert(upserts);
                } catch (e) {
                    console.error('Erro ao sincronizar progresso de calistenia para o Supabase:', e);
                }
            }
        }
    };

    const updateManeuverProgress = (maneuverId, type, exerciseName, newValue) => {
        const updatedSkills = JSON.parse(JSON.stringify(calisthenicsSkills));
        const maneuver = updatedSkills[maneuverId];
        if (!maneuver) return;

        if (type === 'phase1') {
            const prog = maneuver.phase1_progress.find(p => p.exercise === exerciseName);
            if (prog) {
                prog.value = Number(newValue) || 0;
            }
        } else if (type === 'phase2') {
            if (!maneuver.phase2_unlocked) {
                throw new Error('A Fase 2 está bloqueada. Cumpra todos os pré-requisitos da Fase 1 primeiro.');
            }
            const prog = maneuver.phase2_progress.find(p => p.exercise === exerciseName);
            if (prog) {
                prog.value = Number(newValue) || 0;
            }
        }

        // Verifica se todos os requerimentos da Fase 1 foram atingidos
        const phase1Completed = maneuver.phase1_progress.every(p => p.value >= p.target);
        maneuver.phase2_unlocked = phase1Completed;

        // Se a Fase 1 não foi cumprida, reseta a Fase 2
        if (!phase1Completed) {
            maneuver.phase2_progress.forEach(p => p.value = 0);
        }

        // Verifica se todos os requerimentos da Fase 2 foram atingidos
        const phase2Completed = phase1Completed && maneuver.phase2_progress.every(p => p.value >= p.target);
        maneuver.maneuver_unlocked = phase2Completed;

        // Se a manobra deixou de ser elegível e estava dominada, move para treinando
        if (!maneuver.maneuver_unlocked && maneuver.status === 'dominado') {
            maneuver.status = 'treinando';
        }

        saveCalisthenicsSkills(updatedSkills);
    };

    const updateManeuverStatus = (maneuverId, nextStatus) => {
        const updatedSkills = JSON.parse(JSON.stringify(calisthenicsSkills));
        const maneuver = updatedSkills[maneuverId];
        if (!maneuver) return;

        if (nextStatus === 'treinando') {
            // Regra 1: Limite de Metas Ativas
            const activeManeuvers = Object.keys(updatedSkills).filter(id => id !== maneuverId && updatedSkills[id].status === 'treinando');
            if (activeManeuvers.length >= 2) {
                throw new Error('Você já possui o limite máximo de 2 metas ativas em treinamento simultaneamente.');
            }

            // Regra 2: Bloqueio por Categoria
            const sameCategoryManeuver = Object.keys(updatedSkills).find(id => {
                return id !== maneuverId && 
                       updatedSkills[id].status === 'treinando' && 
                       updatedSkills[id].category === maneuver.category;
            });
            if (sameCategoryManeuver) {
                const nameConflicting = updatedSkills[sameCategoryManeuver].name;
                throw new Error(`Bloqueio por Categoria: Você já está treinando a manobra "${nameConflicting}", que possui a mesma categoria ("${maneuver.category}").`);
            }
        }

        if (nextStatus === 'dominado') {
            // Regra 3: Liberação de tentativas apenas se Fase 2 finalizada
            if (!maneuver.maneuver_unlocked) {
                throw new Error('A manobra final só é liberada para domínio após a conclusão de todos os exercícios da Fase 2.');
            }
        }

        maneuver.status = nextStatus;
        saveCalisthenicsSkills(updatedSkills);
    };

    // Rotina de Checagem Cruzada Musculação -> Calistenia (24 horas)
    const runCalisthenicsCrossValidation = (historyList = history, skillsState = calisthenicsSkills) => {
        if (!activeProfileId || !historyList || historyList.length === 0 || !skillsState) return;

        const now = new Date();
        const past24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // Filtrar histórico concluído nas últimas 24h
        const recentHistory = historyList.filter(h => {
            const hDate = new Date(h.date);
            return hDate >= past24h;
        });

        if (recentHistory.length === 0) return;

        // Dicionário de mapeamento flexível de nomes de exercícios
        const exerciseMapping = {
            "Prancha Tradicional": ["prancha tradicional", "prancha abdominal", "prancha abdominal isometria", "prancha", "prancha alta"],
            "Prancha Alta": ["prancha alta", "prancha alta de ombros"],
            "Flexoes de Braco Tradicionais": ["flexões de braço", "flexao de braco", "flexoes de braco", "flexão", "flexões", "flexoes de braco tradicionais"],
            "Prancha Lombar (Superman)": ["superman", "prancha lombar", "prancha lombar (superman)", "prancha lombar superman"],
            "Abdominal Canoa (Hollow Body)": ["hollow body", "abdominal canoa", "abdominal canoa (hollow body)", "abdominal canoa hollow body"],
            "Fundos nas Paralelas (Dips)": ["paralela", "dips", "fundos nas paralelas", "fundos nas paralelas (dips)", "dips paralelas"],
            "Flexao Pike": ["flexão pike", "pike push-up", "flexao pike", "pike push-up (flexão pike)", "pike pushup"],
            "Barra Fixa (Pull-ups)": ["barra fixa", "pull-up", "pull-ups", "barra fixa (pull-ups)", "barra fixa com pegada supinada", "pullup", "pullups"],
            "Elevacao de Joelhos na Barra": ["elevação de joelhos na barra", "elevacao de joelhos na barra", "elevação de joelhos", "elevacao de joelhos", "joelhos na barra"]
        };

        const updatedSkills = JSON.parse(JSON.stringify(skillsState));
        let updatedAny = false;
        let notifiedExerciseName = "";

        // Coleta os maiores valores realizados no histórico recente para os mapeados
        const maxGymValues = {};
        recentHistory.forEach(h => {
            if (h.exercises) {
                h.exercises.forEach(ex => {
                    const gymNameClean = ex.name.toLowerCase().trim();
                    Object.keys(exerciseMapping).forEach(caliExName => {
                        const matches = exerciseMapping[caliExName];
                        const isMatch = matches.some(pattern => 
                            gymNameClean.includes(pattern) || pattern.includes(gymNameClean)
                        );
                        
                        if (isMatch) {
                            let maxVal = 0;
                            if (ex.series) {
                                ex.series.forEach(s => {
                                    const val = s.actualReps || s.reps || 0;
                                    if (val > maxVal) maxVal = val;
                                });
                            }
                            if (maxVal > 0) {
                                if (!maxGymValues[caliExName] || maxVal > maxGymValues[caliExName]) {
                                    maxGymValues[caliExName] = maxVal;
                                }
                            }
                        }
                    });
                });
            }
        });

        // Aplica e atualiza no progresso da Calistenia
        Object.keys(updatedSkills).forEach(mId => {
            const maneuver = updatedSkills[mId];
            
            // Fase 1
            maneuver.phase1_progress.forEach(p => {
                const gymVal = maxGymValues[p.exercise];
                if (gymVal && gymVal > p.value) {
                    p.value = gymVal;
                    updatedAny = true;
                    notifiedExerciseName = p.exercise;
                }
            });

            // Recalcula Phase 2 Unlocked
            const phase1Completed = maneuver.phase1_progress.every(p => p.value >= p.target);
            maneuver.phase2_unlocked = phase1Completed;

            // Fase 2 (Apenas se Fase 1 destravada)
            if (maneuver.phase2_unlocked) {
                maneuver.phase2_progress.forEach(p => {
                    const gymVal = maxGymValues[p.exercise];
                    if (gymVal && gymVal > p.value) {
                        p.value = gymVal;
                        updatedAny = true;
                        notifiedExerciseName = p.exercise;
                    }
                });
            } else {
                maneuver.phase2_progress.forEach(p => p.value = 0);
            }

            // Recalcula Maneuver Unlocked
            const phase2Completed = maneuver.phase2_unlocked && maneuver.phase2_progress.every(p => p.value >= p.target);
            maneuver.maneuver_unlocked = phase2Completed;

            if (!maneuver.maneuver_unlocked && maneuver.status === 'dominado') {
                maneuver.status = 'treinando';
            }
        });

        if (updatedAny) {
            saveCalisthenicsSkills(updatedSkills);
            setToastMessage(`Aproveitamos seu exercício "${notifiedExerciseName}" da musculação para computar sua meta de Calistenia de hoje!`);
            
            // Limpa após 8 segundos de forma segura
            setTimeout(() => {
                setToastMessage(prev => {
                    if (prev && prev.includes(notifiedExerciseName)) {
                        return null;
                    }
                    return prev;
                });
            }, 8000);
        }
    };

    // Salva fotos de evolução
    const saveEvolutionPhotos = (newPhotos) => {
        setEvolutionPhotos(newPhotos);
        if (activeProfileId) {
            localStorage.setItem(`fitlife_v3_evolution_photos_${activeProfileId}`, JSON.stringify(newPhotos));
            updateProfileDataField(activeProfileId, 'evolution_photos', newPhotos);
        }
    };

    // Voz de introdução do exercício
    const speakExerciseStart = (exercise) => {
        if (!voiceNotifications || !('speechSynthesis' in window)) return;
        try {
            window.speechSynthesis.cancel();
            let message = `Iniciando exercício: ${exercise.name}. `;
            if (exercise.series && exercise.series.length > 0) {
                const totalSeries = exercise.series.length;
                message += `Você tem ${totalSeries} séries planejadas. `;
                const firstSet = exercise.series[0];
                const weight = firstSet.actualWeight || firstSet.weight || 0;
                if (weight > 0) {
                    message += `Carga recomendada de ${weight} quilos.`;
                }
            }
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.lang = 'pt-BR';
            utterance.rate = 1.05;
            utterance.pitch = 1.0;
            window.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error('Erro na síntese de voz de início:', error);
        }
    };

    // Exporta backup de dados para download como arquivo JSON
    const exportBackupData = () => {
        if (!activeProfileId) return;
        const data = {
            profileId: activeProfileId,
            workouts: JSON.parse(localStorage.getItem(`fitlife_v3_workouts_${activeProfileId}`) || '[]'),
            history: JSON.parse(localStorage.getItem(`fitlife_v3_history_${activeProfileId}`) || '[]'),
            favorites: JSON.parse(localStorage.getItem(`fitlife_v3_favorites_${activeProfileId}`) || '[]'),
            pr: JSON.parse(localStorage.getItem(`fitlife_v3_pr_${activeProfileId}`) || '{}'),
            measurements: JSON.parse(localStorage.getItem(`fitlife_v3_measurements_${activeProfileId}`) || '[]'),
            profileDetails: JSON.parse(localStorage.getItem(`fitlife_v3_profile_details_${activeProfileId}`) || 'null'),
            skills: JSON.parse(localStorage.getItem(`fitlife_v3_skills_${activeProfileId}`) || '{}'),
            evolutionPhotos: JSON.parse(localStorage.getItem(`fitlife_v3_evolution_photos_${activeProfileId}`) || '[]')
        };
        
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(data, null, 2)
        )}`;
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', jsonString);
        downloadAnchor.setAttribute('download', `fitlife_backup_${activeProfileId}_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    };

    // Importa backup de dados de um arquivo JSON
    const importBackupData = async (data) => {
        if (!data || data.profileId !== activeProfileId) {
            throw new Error('O backup não pertence ao perfil selecionado atualmente!');
        }
        if (data.workouts) {
            localStorage.setItem(`fitlife_v3_workouts_${activeProfileId}`, JSON.stringify(data.workouts));
            setWorkouts(data.workouts);
            syncWorkoutsToSupabase(activeProfileId, data.workouts);
        }
        if (data.history) {
            localStorage.setItem(`fitlife_v3_history_${activeProfileId}`, JSON.stringify(data.history));
            setHistory(data.history);
            syncHistoryToSupabase(activeProfileId, data.history);
        }
        
        const updatedFields = {};
        if (data.favorites) {
            localStorage.setItem(`fitlife_v3_favorites_${activeProfileId}`, JSON.stringify(data.favorites));
            setFavorites(data.favorites);
            updatedFields.favorites = data.favorites;
        }
        if (data.pr) {
            localStorage.setItem(`fitlife_v3_pr_${activeProfileId}`, JSON.stringify(data.pr));
            setPersonalRecords(data.pr);
            updatedFields.personal_records = data.pr;
        }
        if (data.measurements) {
            localStorage.setItem(`fitlife_v3_measurements_${activeProfileId}`, JSON.stringify(data.measurements));
            setMeasurements(data.measurements);
            updatedFields.measurements = data.measurements;
        }
        if (data.profileDetails) {
            localStorage.setItem(`fitlife_v3_profile_details_${activeProfileId}`, JSON.stringify(data.profileDetails));
            setProfileDetails(data.profileDetails);
            updatedFields.profile_details = data.profileDetails;
        }
        if (data.skills) {
            await saveCalisthenicsSkills(data.skills);
        }
        if (data.evolutionPhotos) {
            localStorage.setItem(`fitlife_v3_evolution_photos_${activeProfileId}`, JSON.stringify(data.evolutionPhotos));
            setEvolutionPhotos(data.evolutionPhotos);
            updatedFields.evolution_photos = data.evolutionPhotos;
        }

        if (supabase && Object.keys(updatedFields).length > 0) {
            try {
                await supabase
                    .from('fitlife_profile_data')
                    .upsert({
                        profile_id: activeProfileId,
                        ...updatedFields,
                        updated_at: new Date().toISOString()
                    });
            } catch (e) {
                console.error('Erro ao salvar backup no Supabase:', e);
            }
        }
    };

    // Carrega treinos predefinidos (Presets)
    const loadPreset = (presetType) => {
        if (!activeProfileId) return;
        
        const preset = PRESET_WORKOUTS[presetType] || (presetType === 'CALISTENIA' ? CALISTENIA_PROJECT : null);
        if (!preset) return;
        
        const baseTime = Date.now();
        const newWorkouts = preset.workouts.map((w, idx) => ({
            ...w,
            id: baseTime + idx,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }));
        
        const updatedWorkouts = [...workouts, ...newWorkouts];
        saveWorkoutsList(updatedWorkouts);
    };

    // Iniciar um Treino Livre (Em Branco)
    const startFreeWorkout = () => {
        const activeState = {
            workoutId: 'free',
            workoutName: "Treino Livre",
            currentExerciseIndex: 0,
            startTime: new Date().toISOString(),
            exercises: []
        };
        saveActiveWorkoutState(activeState);
    };

    // Adiciona exercício ao Treino Livre ativo
    const addFreeWorkoutExercise = (newEx) => {
        if (!activeWorkout) return;
        
        const formattedExercise = {
            name: newEx.name,
            path: newEx.path,
            notes: '',
            targetWeight: 0,
            series: [
                { reps: 10, weight: 0, completed: false, actualReps: 10, actualWeight: 0 }
            ]
        };
        
        const updatedExercises = [...activeWorkout.exercises, formattedExercise];
        
        saveActiveWorkoutState({
            ...activeWorkout,
            exercises: updatedExercises,
            currentExerciseIndex: activeWorkout.exercises.length === 0 ? 0 : activeWorkout.currentExerciseIndex
        });
    };

    // Adicionar um log de cardio (corrida/pedalada) vindo do Zepp ou entrada manual
    const addCardioWorkout = (cardioLog) => {
        if (!activeProfileId) return;
        
        const log = {
            id: Date.now(),
            workoutId: 'cardio',
            workoutName: cardioLog.type === 'running' ? 'Corrida 🏃‍♂️' : 'Pedalada 🚴‍♂️',
            date: cardioLog.date || new Date().toISOString(),
            duration: parseInt(cardioLog.duration) || 0, // minutos
            isCardio: true,
            cardioType: cardioLog.type, // 'running' | 'cycling'
            distance: parseFloat(cardioLog.distance) || 0,
            heartRate: parseFloat(cardioLog.heartRate) || null,
            calories: parseFloat(cardioLog.calories) || null,
            exercises: [] // cardio não tem séries de força
        };
        
        const newHistory = [log, ...history];
        saveHistoryList(newHistory);
    };

    // --- AÇÕES DO SISTEMA ---

    // Alternar Perfil
    const selectProfile = (profileId) => {
        setActiveProfileId(profileId);
    };

    // Adicionar/Editar Treino ou Treinos
    const saveWorkout = (workoutOrWorkouts) => {
        let newWorkouts = [...workouts];
        const workoutsToSave = Array.isArray(workoutOrWorkouts) ? workoutOrWorkouts : [workoutOrWorkouts];
        
        const baseId = Date.now();
        workoutsToSave.forEach((workout, idx) => {
            if (workout.id) {
                const index = newWorkouts.findIndex(w => w.id === workout.id);
                if (index !== -1) {
                    newWorkouts[index] = { ...workout, updatedAt: new Date().toISOString() };
                }
            } else {
                const newWorkout = {
                    ...workout,
                    id: baseId + idx, // Evita colisão de IDs no mesmo milissegundo
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                newWorkouts.push(newWorkout);
            }
        });
        
        saveWorkoutsList(newWorkouts);
    };

    // Excluir Treino
    const deleteWorkout = (workoutId) => {
        const newWorkouts = workouts.filter(w => w.id !== workoutId);
        saveWorkoutsList(newWorkouts);
        // Se o treino excluído era o que estava ativo, cancela
        if (activeWorkout && activeWorkout.workoutId === workoutId) {
            saveActiveWorkoutState(null);
        }
    };

    // Iniciar um Treino (entra no Modo Academia)
    const startWorkout = (workout) => {
        const formattedExercises = workout.exercises.map(exercise => {
            const seriesCount = parseInt(exercise.series) || 3;
            const series = [];
            for (let i = 0; i < seriesCount; i++) {
                series.push({
                    reps: parseInt(exercise.reps) || 10,
                    weight: parseFloat(exercise.weight) || 0,
                    completed: false,
                    actualReps: parseInt(exercise.reps) || 10,
                    actualWeight: parseFloat(exercise.weight) || 0
                });
            }
            return {
                name: exercise.name,
                path: exercise.path,
                notes: exercise.notes || '',
                targetWeight: parseFloat(exercise.targetWeight) || 0,
                series
            };
        });

        const activeState = {
            workoutId: workout.id,
            workoutName: workout.name,
            currentExerciseIndex: 0,
            startTime: new Date().toISOString(),
            exercises: formattedExercises
        };
        saveActiveWorkoutState(activeState);
    };

    // Iniciar uma sessão de calistenia baseada nos requisitos da manobra e fase
    const startCalisthenicsWorkout = (maneuver, phaseNum) => {
        const progressArray = phaseNum === 2 ? maneuver.phase2_progress : maneuver.phase1_progress;
        
        const formattedExercises = progressArray.map(prog => {
            // Busca o exercício correspondente na base geral para pegar o caminho do GIF
            const catalogMatch = exercises.find(ex => ex.name.toLowerCase() === prog.exercise.toLowerCase());
            const path = catalogMatch ? catalogMatch.path : "";
            
            // Cria 3 séries padrão com a meta especificada e peso zero
            const seriesCount = 3;
            const series = [];
            for (let i = 0; i < seriesCount; i++) {
                series.push({
                    reps: parseInt(prog.target) || 10,
                    weight: 0,
                    completed: false,
                    actualReps: parseInt(prog.target) || 10,
                    actualWeight: 0
                });
            }
            
            return {
                name: prog.exercise,
                path: path,
                notes: `Meta de Habilidade: >=${prog.target} ${prog.unit}.`,
                targetWeight: 0,
                series: series
            };
        });

        const activeState = {
            workoutId: `cali_${maneuver.id}_phase${phaseNum}`,
            workoutName: `Calistenia: ${maneuver.name} (Fase ${phaseNum})`,
            currentExerciseIndex: 0,
            startTime: new Date().toISOString(),
            exercises: formattedExercises
        };
        
        // Se a manobra estiver bloqueada, tenta ativá-la automaticamente
        if (maneuver.status === 'bloqueado') {
            try {
                updateManeuverStatus(maneuver.id, 'treinando');
            } catch (e) {
                console.warn("Não foi possível colocar a manobra em treinamento automaticamente:", e.message);
                alert(`Nota: Não foi possível ativar esta manobra como objetivo de treino automático.\nMotivo: ${e.message}\nVocê pode treinar normalmente, mas para computar o progresso no painel de habilidades, limpe um de seus objetivos atuais.`);
            }
        }
        
        saveActiveWorkoutState(activeState);
    };

    // Finalizar Treino (salva no histórico)
    const finishWorkout = (cardioStats) => {
        if (!activeWorkout) return;

        const duration = Math.round((new Date() - new Date(activeWorkout.startTime)) / 60000); // minutos
        const completedExercises = activeWorkout.exercises.filter(ex => 
            ex.series.some(s => s.completed)
        );

        // Se completou pelo menos uma série, salva no histórico
        if (completedExercises.length > 0) {
            const log = {
                id: Date.now(),
                workoutId: activeWorkout.workoutId,
                workoutName: activeWorkout.workoutName,
                date: new Date().toISOString(),
                duration,
                cardio: cardioStats || null,
                exercises: completedExercises.map(ex => ({
                    name: ex.name,
                    series: ex.series.filter(s => s.completed).map(s => ({
                        reps: s.actualReps,
                        weight: s.actualWeight
                    }))
                }))
            };

            const newHistory = [log, ...history];
            saveHistoryList(newHistory);

            // Atualiza as cargas padrão nos treinos originais para a próxima vez
            updateOriginalWorkoutWeights(activeWorkout.workoutId, activeWorkout.exercises);
        }

        saveActiveWorkoutState(null);
    };

    // Cancela o treino ativo
    const cancelWorkout = () => {
        saveActiveWorkoutState(null);
    };

    // Atualiza as cargas padrão no treino original baseado no treino recém finalizado
    const updateOriginalWorkoutWeights = (workoutId, finishedExercises) => {
        const newWorkouts = workouts.map(workout => {
            if (workout.id === workoutId) {
                const updatedExercises = workout.exercises.map(origEx => {
                    const finishedEx = finishedExercises.find(fe => fe.name === origEx.name);
                    if (finishedEx) {
                        // Pega o peso do último set completado como referência
                        const lastCompletedSet = [...finishedEx.series].reverse().find(s => s.completed);
                        if (lastCompletedSet) {
                            return {
                                ...origEx,
                                weight: lastCompletedSet.actualWeight
                            };
                        }
                    }
                    return origEx;
                });
                return { ...workout, exercises: updatedExercises };
            }
            return workout;
        });
        saveWorkoutsList(newWorkouts);
    };

    // Treinos iniciais para novos usuários (para não vir totalmente vazio)
    function getInitialWorkouts(profileId) {
        if (profileId === 'fabio') {
            return [
                {
                    id: 1,
                    name: "Treino A - Peito e Tríceps (Aparelhos)",
                    description: "Treino de empurrar para hipertrofia focado em máquinas",
                    exercises: [
                        { name: "Supino Reto na Máquina", path: "Exercicios/Peitoral/Supino Reto na Máquina.gif", series: 4, reps: 10, weight: 30, notes: "Foco no controle da descida" },
                        { name: "Supino inclinado na máquina", path: "Exercicios/Peitoral/Supino inclinado na máquina.gif", series: 3, reps: 10, weight: 20, notes: "" },
                        { name: "Extensão de tríceps no cabo alto", path: "Exercicios/Tríceps/Extensão de tríceps no cabo alto.gif", series: 4, reps: 12, weight: 25, notes: "" },
                        { name: "Extensão de tríceps na máquina", path: "Exercicios/Tríceps/Extensão de tríceps na máquina.gif", series: 3, reps: 10, weight: 20, notes: "" }
                    ]
                },
                {
                    id: 2,
                    name: "Treino B - Costas e Bíceps (Aparelhos)",
                    description: "Treino de puxar focado em cabos e polias",
                    exercises: [
                        { name: "Puxada Alta", path: "Exercicios/Costas/Puxada Alta.gif", series: 4, reps: 10, weight: 55, notes: "" },
                        { name: "Remada Sentada na Máquina", path: "Exercicios/Costas/Remada Sentada na Máquina.gif", series: 4, reps: 10, weight: 40, notes: "" },
                        { name: "Rosca concentrada com cabo", path: "Exercicios/Bíceps/Rosca concentrada com cabo.gif", series: 3, reps: 10, weight: 20, notes: "" },
                        { name: "Rosca Unilateral com Cabo", path: "Exercicios/Bíceps/Rosca Unilateral com Cabo.gif", series: 3, reps: 12, weight: 10, notes: "" }
                    ]
                }
            ];
        } else {
            return [
                {
                    id: 3,
                    name: "Treino Inferior Completo (Aparelhos)",
                    description: "Treino de pernas e glúteos em máquinas",
                    exercises: [
                        { name: "Leg Press", path: "Exercicios/Pernas/Leg Press.gif", series: 4, reps: 10, weight: 80, notes: "Manter boa amplitude" },
                        { name: "Elevação Pélvica na Máquina de Extensão de Pernas", path: "Exercicios/Glúteos/Elevação Pélvica na Máquina de Extensão de Pernas.gif", series: 4, reps: 12, weight: 20, notes: "Pico de contração de 2s" },
                        { name: "Cadeira extensora", path: "Exercicios/Pernas/Cadeira extensora.gif", series: 3, reps: 10, weight: 25, notes: "Extensão controlada" },
                        { name: "Abdução de quadril com cabo", path: "Exercicios/Glúteos/Abdução de quadril com cabo.gif", series: 3, reps: 12, weight: 15, notes: "" }
                    ]
                }
            ];
        }
    }

    return (
        <AppContext.Provider value={{
            profiles,
            activeProfileId,
            activeProfile,
            exercises,
            workouts,
            history,
            favorites,
            activeWorkout,
            personalRecords,
            workoutStreak,
            measurements,
            selectProfile,
            saveWorkout,
            deleteWorkout,
            startWorkout,
            finishWorkout,
            cancelWorkout,
            toggleFavorite,
            saveActiveWorkoutState,
            savePR,
            swapActiveWorkoutExercise,
            saveMeasurement,
            deleteMeasurement,
            exportBackupData,
            importBackupData,
            loadPreset,
            voiceNotifications,
            toggleVoiceNotifications,
            restTime,
            setRestTime,
            timeLeft,
            setTimeLeft,
            timerActive,
            setTimerActive,
            startFreeWorkout,
            addFreeWorkoutExercise,
            addCardioWorkout,
            profileDetails,
            saveProfileDetails,
            calisthenicsSkills,
            saveCalisthenicsSkills,
            updateManeuverProgress,
            updateManeuverStatus,
            activeEvolutionSubTab,
            setActiveEvolutionSubTab,
            expandedCalisthenicsSkillId,
            setExpandedCalisthenicsSkillId,
            toastMessage,
            setToastMessage,
            evolutionPhotos,
            saveEvolutionPhotos,
            speakExerciseStart,
            startCalisthenicsWorkout
        }}>
            {children}
        </AppContext.Provider>
    );
};
