import { createClient } from '@libsql/client/web';

const rawUrl = import.meta.env.VITE_TURSO_DATABASE_URL;
const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

let turso = null;

if (rawUrl) {
    try {
        // Converte libsql:// para https:// para compatibilidade com o client Web fetch
        const url = rawUrl.startsWith('libsql://') 
            ? rawUrl.replace('libsql://', 'https://') 
            : rawUrl;

        turso = createClient({
            url,
            authToken: authToken || undefined
        });
        console.log('⚡ Turso Database Client initialized successfully.');
    } catch (err) {
        console.error('❌ Failed to initialize Turso client:', err);
    }
} else {
    console.warn(
        '⚠️ Turso credentials not found (VITE_TURSO_DATABASE_URL). The app will run in Local-Only (localStorage) mode.\n' +
        'To enable cloud sync, set VITE_TURSO_DATABASE_URL and VITE_TURSO_AUTH_TOKEN in Render or .env.'
    );
}

export { turso };
