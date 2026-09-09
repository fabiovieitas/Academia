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
        return [path];
    }

    const cleanName = name.replace(/^(nível\s+\d+:|mobilidade:|técnica:)\s*/i, "").trim();
    const encodedPath = encodeURI(path);
    const encodedThumb = exercise.thumbnail ? encodeURI(exercise.thumbnail) : '';

    const list = [];

    // Se for calistenia local, tenta local primeiro
    if (path.startsWith('Exercicios/Calistenia/')) {
        list.push(`/${path}`);
    }

    // 1. Raw GitHub do repositório academia-assets (rápido e direto)
    list.push(`https://raw.githubusercontent.com/fabiovieitas/academia-assets/main/${encodedPath}`);

    // 2. Raw GitHub do repositório Academia (commit com todos os GIFs preservados)
    list.push(`https://raw.githubusercontent.com/fabiovieitas/Academia/4036ec690905864cbbdb2b77862c66c63c5c0a00/public/${encodedPath}`);

    // 3. CDN GitHub Pages do academia-assets
    list.push(`https://fabiovieitas.github.io/academia-assets/${encodedPath}`);

    // 4. Se tiver thumbnail configurada no JSON
    if (encodedThumb) {
        list.push(`https://fabiovieitas.github.io/academia-assets/${encodedThumb}`);
        list.push(`https://raw.githubusercontent.com/fabiovieitas/academia-assets/main/${encodedThumb}`);
        list.push(`https://raw.githubusercontent.com/fabiovieitas/Academia/4036ec690905864cbbdb2b77862c66c63c5c0a00/public/${encodedThumb}`);
    }

    // 5. Servidor gifdotreino
    list.push(`https://www.gifdotreino.com/${encodedPath}`);
    list.push(`https://www.gifdotreino.com/thumbnails/${encodeURIComponent(cleanName)}.png`);

    // 6. Local fallback
    list.push(`/${encodedPath}`);

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
