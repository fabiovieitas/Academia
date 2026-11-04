import { CALISTHENICS_PATH_MAP } from '../context/workoutData';

// Cores e ícones por grupo muscular (profissional)
const MUSCLE_CONFIG = {
    'Peitoral': { color: '#e74c3c', icon: '◈', label: 'Peitoral' },
    'Costas': { color: '#3498db', icon: '◆', label: 'Costas' },
    'Pernas': { color: '#2ecc71', icon: '▼', label: 'Pernas' },
    'Glúteos': { color: '#e67e22', icon: '◉', label: 'Glúteos' },
    'Ombros': { color: '#9b59b6', icon: '◈', label: 'Ombros' },
    'Bíceps': { color: '#1abc9c', icon: '▲', label: 'Bíceps' },
    'Tríceps': { color: '#f39c12', icon: '◇', label: 'Tríceps' },
    'Abdomen': { color: '#e74c3c', icon: '▣', label: 'Core' },
    'AbdomenCore': { color: '#e74c3c', icon: '▣', label: 'Core' },
    'Calistenia': { color: '#00d4ff', icon: '✦', label: 'Calistenia' },
    'Cardio': { color: '#ff6b6b', icon: '♥', label: 'Cardio' },
    'Funcional e HIT': { color: '#fd9644', icon: '⚡', label: 'Funcional' },
    'Crossfit': { color: '#a29bfe', icon: '✕', label: 'Crossfit' },
    'Mobilidade': { color: '#55efc4', icon: '○', label: 'Mobilidade' },
    'Panturrilhas': { color: '#74b9ff', icon: '▽', label: 'Panturrilhas' },
    'Trapézio': { color: '#fd79a8', icon: '△', label: 'Trapézio' },
    'Antebraços': { color: '#fdcb6e', icon: '▸', label: 'Antebraços' },
    'Eretor Lombar': { color: '#6c5ce7', icon: '‖', label: 'Lombar' },
};

export const getFallbackSvg = (muscle = 'Geral', exerciseName = '') => {
    const cfg = MUSCLE_CONFIG[muscle] || { color: '#6c5ce7', icon: '💪', label: muscle || 'Exercício' };
    const shortName = exerciseName && exerciseName.length > 22
        ? exerciseName.substring(0, 22) + '...'
        : (exerciseName || '');

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0d0f1a"/>
      <stop offset="100%" style="stop-color:#12141c"/>
    </linearGradient>
  </defs>
  <rect width="200" height="200" fill="url(#bg)"/>
  <circle cx="100" cy="80" r="45" fill="none" stroke="${cfg.color}" stroke-width="1.5" stroke-opacity="0.3"/>
  <circle cx="100" cy="80" r="35" fill="${cfg.color}" fill-opacity="0.1"/>
  <text x="100" y="88" text-anchor="middle" font-size="32" fill="${cfg.color}" font-family="system-ui">${cfg.icon}</text>
  <text x="100" y="145" text-anchor="middle" font-size="10" fill="${cfg.color}" font-family="system-ui" font-weight="600" letter-spacing="2">${cfg.label.toUpperCase()}</text>
  ${shortName ? `<text x="100" y="165" text-anchor="middle" font-size="8.5" fill="rgba(255,255,255,0.5)" font-family="system-ui">${shortName}</text>` : ''}
  <rect x="60" y="175" width="80" height="2" rx="1" fill="${cfg.color}" fill-opacity="0.4"/>
</svg>`;

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
};

export const safeMediaUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('data:')) return url;
    try {
        // Decodifica primeiro para evitar double-encoding
        const decoded = decodeURIComponent(url);
        return decoded
            .replace(/ /g, '%20')
            .replace(/ã/g, '%C3%A3').replace(/â/g, '%C3%A2')
            .replace(/á/g, '%C3%A1').replace(/à/g, '%C3%A0').replace(/é/g, '%C3%A9')
            .replace(/ê/g, '%C3%AA').replace(/í/g, '%C3%AD').replace(/ó/g, '%C3%B3')
            .replace(/ô/g, '%C3%B4').replace(/ú/g, '%C3%BA').replace(/ç/g, '%C3%A7')
            .replace(/ñ/g, '%C3%B1').replace(/ü/g, '%C3%BC').replace(/ö/g, '%C3%B6')
            .replace(/Ã/g, '%C3%83').replace(/Â/g, '%C3%82').replace(/Á/g, '%C3%81')
            .replace(/É/g, '%C3%89').replace(/Ê/g, '%C3%8A').replace(/Í/g, '%C3%8D')
            .replace(/Ó/g, '%C3%93').replace(/Ô/g, '%C3%94').replace(/Ú/g, '%C3%9A')
            .replace(/Ç/g, '%C3%87');
    } catch (e) {
        return encodeURI(url);
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
        const cleanKeyNoPrefix = cleanKey.replace(/^(nível\s+\d+:|mobilidade:|técnica:)\s*/i, '').trim();
        path = CALISTHENICS_PATH_MAP[cleanKey] || CALISTHENICS_PATH_MAP[cleanKeyNoPrefix] || '';
    }

    if (!path && exercise.thumbnail) {
        path = exercise.thumbnail;
    }

    if (!path) return [];

    if (path.startsWith('http')) {
        return [safeMediaUrl(path)];
    }

    const cleanName = name.replace(/^(nível\s+\d+:|mobilidade:|técnica:)\s*/i, '').trim();
    const encodedThumb = exercise.thumbnail ? safeMediaUrl(exercise.thumbnail) : '';
    const aliases = PATH_ALIASES[path] || [];
    const primaryPath = aliases.length > 0 ? aliases[0] : path;
    const pathsToTry = aliases.length > 0 ? [path, aliases[0], ...aliases.slice(1)] : [path];

    const list = [];

    // 1. Arquivos locais de Calistenia (já inclusos fisicamente na pasta public)
    if (path.startsWith('Exercicios/Calistenia/')) {
        list.push('/' + safeMediaUrl(path));
    }

    // 2. Servidor Oficial Online de GIFs (gifdotreino - 200 OK comprovado)
    for (const p of pathsToTry) {
        list.push('https://www.gifdotreino.com/' + safeMediaUrl(p));
    }

    // 3. Thumbnail online do gifdotreino
    if (cleanName) {
        list.push('https://www.gifdotreino.com/thumbnails/' + encodeURIComponent(cleanName) + '.png');
    }

    // 4. Se tiver thumbnail configurada no JSON
    if (encodedThumb && !encodedThumb.startsWith('Exercicios/Calistenia/')) {
        list.push('https://www.gifdotreino.com/' + encodedThumb);
    }

    // 5. GitHub Raw fallback (repositório público)
    for (const p of pathsToTry) {
        const enc = safeMediaUrl(p);
        list.push('https://raw.githubusercontent.com/fabiovieitas/Academia/main/public/' + enc);
        list.push('/' + enc);
    }

    // 6. Local fallback final
    list.push('/' + safeMediaUrl(primaryPath));
    list.push('/' + safeMediaUrl(path));

    return Array.from(new Set(list));
};

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
