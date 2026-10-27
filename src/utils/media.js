import { CALISTHENICS_PATH_MAP } from '../context/workoutData';

// Placeholder elegante em SVG com ícone temático
export const getFallbackSvg = (muscle = 'Geral') => {
    const iconMap = {
        'Peitoral': '🍒',
        'Costas': '🦅',
        'Pernas': '🍗',
        'Ombros': '🛡️',
        'Bíceps': '💪',
        'Tríceps': '⚡',
        'Abdomen': '🎯',
        'Glúteos': '🍑',
        'Calistenia': '🤸',
        'Cardio': '🏃'
    };
    const icon = iconMap[muscle] || '💪';
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%2312141c"/><circle cx="50" cy="50" r="30" fill="%23191c28"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="28">${icon}</text></svg>`;
};

export const safeMediaUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('data:')) return url;
    try {
        return encodeURI(decodeURI(url));
    } catch (e) {
        return url;
    }
};

const PATH_ALIASES = {
    'Exercicios/Panturrilhas/Elevação de panturrilha em pé.gif': [
        'Exercicios/Calistenia/Elevação de panturrilha em pé.gif',
        'Exercicios/Panturrilhas/Panturrilha em Pé no Smith.gif',
        'Exercicios/Panturrilhas/Elevação de Panturrilha no Leg Press.gif'
    ],
    'Exercicios/Calistenia/Elevação de panturrilha em pé.gif': [
        'Exercicios/Panturrilhas/Panturrilha em Pé no Smith.gif',
        'Exercicios/Panturrilhas/Elevação de Panturrilha no Leg Press.gif'
    ],
    'Exercicios/Calistenia/Isometria_de_Frog_Stand.png': [
        'Exercicios/Calistenia/Frog_Stand_Assistido.gif'
    ],
    'Exercicios/Calistenia/Aquecimento_de_Punhos.png': [
        'Exercicios/Calistenia/Tecnica_da_Garra.png'
    ],
    'Exercicios/Pernas/Stiff com barra.gif': [
        'Exercicios/Costas/Levantamento Terra Romeno.gif',
        'Exercicios/Pernas/Peso muerto piernas rígidas con barra.gif',
        'Exercicios/Funcional e HIT/Stiff com Elástico de Resistência.gif'
    ],
    'Exercicios/Costas/Levantamento Terra Romeno.gif': [
        'Exercicios/Pernas/Stiff com barra.gif'
    ],
    'Exercicios/Peitoral/Supino Reto.gif': [
        'Exercicios/Peitoral/Supino com Halteres.gif',
        'Exercicios/Peitoral/Supino Reto na Máquina.gif'
    ],
    'Exercicios/Peitoral/Supino Inclinado com Halteres.gif': [
        'Exercicios/Peitoral/Supino Inclinado na Alavanca.gif',
        'Exercicios/Peitoral/Supino inclinado na máquina.gif'
    ],
    'Exercicios/Peitoral/Supino inclinado na máquina.gif': [
        'Exercicios/Peitoral/Cross over polia baixa.gif',
        'Exercicios/Peitoral/Supino Inclinado com Halteres.gif'
    ],
    'Exercicios/Pernas/Leg Press.gif': [
        'Exercicios/Pernas/Leg Press Horizontal.gif',
        'Exercicios/Pernas/Leg Press unilateral.gif'
    ],
    'Exercicios/Pernas/Agachamento Barra.gif': [
        'Exercicios/Pernas/Agachamento no Smith.gif',
        'Exercicios/Calistenia/Agachamento.gif'
    ],
    'Exercicios/Panturrilhas/Panturrilha em Pé no Smith.gif': [
        'Exercicios/Calistenia/Elevação de panturrilha em pé.gif',
        'Exercicios/Panturrilhas/Elevação de Panturrilha no Leg Press.gif',
        'Exercicios/Panturrilhas/Elevação de Panturrilha Sentado com Alavanca.gif'
    ],
    'Exercicios/Tríceps/Tríceps pulley corda.gif': [
        'Exercicios/Tríceps/Tríceps pulley barra.gif',
        'Exercicios/Tríceps/Extensão de Tríceps com Cabo em Posição Ajoelhada.gif'
    ],
    'Exercicios/Tríceps/Tríceps testa com barra.gif': [
        'Exercicios/Tríceps/Tríceps testa pegada neutra com halteres.gif'
    ]
};

// Pipeline de URLs ordenado por confiabilidade e velocidade
export const getExerciseMediaUrls = (exercise) => {
    if (!exercise) return [];
    let path = exercise.path || '';
    const name = exercise.name || '';
    
    if (!path && name) {
        const cleanKey = name.toLowerCase().trim();
        const cleanKeyNoPrefix = cleanKey.replace(/^(nível\s+\d+:|mobilidade:|técnica:)\s*/i, "").trim();
        path = CALISTHENICS_PATH_MAP[cleanKey] || CALISTHENICS_PATH_MAP[cleanKeyNoPrefix] || '';
    }

    if (!path && exercise.thumbnail) {
        path = exercise.thumbnail;
    }

    if (!path) return [];

    if (path.startsWith('http')) {
        return [safeMediaUrl(path)];
    }

    const cleanName = name.replace(/^(nível\s+\d+:|mobilidade:|técnica:)\s*/i, "").trim();
    const encodedThumb = exercise.thumbnail ? safeMediaUrl(exercise.thumbnail) : '';
    const aliases = PATH_ALIASES[path] || [];
    const primaryPath = aliases.length > 0 ? aliases[0] : path;
    const pathsToTry = aliases.length > 0 ? [path, aliases[0], ...aliases.slice(1)] : [path];

    const list = [];

    // Se for calistenia ou arquivo local na pasta public, disponibiliza relativo local prioritário
    if (path.startsWith('Exercicios/Calistenia/')) {
        list.push(`/${safeMediaUrl(path)}`);
    }

    // 1. CDNs e Repositórios oficiais do Academia
    for (const p of pathsToTry) {
        const enc = safeMediaUrl(p);
        list.push(`https://fabiovieitas.github.io/academia-assets/${enc}`);
        list.push(`https://raw.githubusercontent.com/fabiovieitas/Academia/main/public/${enc}`);
        list.push(`https://raw.githubusercontent.com/fabiovieitas/Academia/4036ec690905864cbbdb2b77862c66c63c5c0a00/public/${enc}`);
        list.push(`https://raw.githubusercontent.com/fabiovieitas/academia-assets/main/${enc}`);
        list.push(`/${enc}`);
    }

    // 2. Se tiver thumbnail configurada no JSON
    if (encodedThumb) {
        list.push(`https://fabiovieitas.github.io/academia-assets/${encodedThumb}`);
        list.push(`https://raw.githubusercontent.com/fabiovieitas/Academia/main/public/${encodedThumb}`);
        list.push(`https://raw.githubusercontent.com/fabiovieitas/Academia/4036ec690905864cbbdb2b77862c66c63c5c0a00/public/${encodedThumb}`);
        list.push(`https://raw.githubusercontent.com/fabiovieitas/academia-assets/main/${encodedThumb}`);
        list.push(`/${encodedThumb}`);
    }

    // 3. Servidor gifdotreino
    list.push(`https://www.gifdotreino.com/${safeMediaUrl(path)}`);
    list.push(`https://www.gifdotreino.com/thumbnails/${encodeURIComponent(cleanName)}.png`);

    // 4. Local fallback
    list.push(`/${safeMediaUrl(primaryPath)}`);
    list.push(`/${safeMediaUrl(path)}`);

    return Array.from(new Set(list));
};

// Componente inteligente de imagem com fallback automático contínuo
export const handleImageErrorWithFallback = (e, exercise) => {
    const target = e.target;
    const urls = getExerciseMediaUrls(exercise);
    
    // Pega o índice atual
    let nextIndex = parseInt(target.dataset.fallbackIndex || '0') + 1;
    
    if (nextIndex < urls.length) {
        target.dataset.fallbackIndex = nextIndex.toString();
        target.src = urls[nextIndex];
    } else {
        target.onerror = null;
        const parts = (exercise?.path || '').split('/');
        const cat = parts.length > 1 ? parts[1] : 'Geral';
        target.src = getFallbackSvg(cat);
    }
};

export const resolveMediaUrl = (exercise) => {
    const urls = getExerciseMediaUrls(exercise);
    return urls[0] || getFallbackSvg(exercise?.path?.split('/')[1] || 'Geral');
};
