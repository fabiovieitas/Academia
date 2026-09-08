import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env or args
const url = process.env.VITE_TURSO_DATABASE_URL || process.env.TURSO_DATABASE_URL || process.argv[2];
const authToken = process.env.VITE_TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN || process.argv[3];

if (!url) {
    console.error('❌ Por favor, forneça a URL do Turso.');
    console.error('Uso: node scripts/init_turso.js <TURSO_URL> <TURSO_AUTH_TOKEN>');
    console.error('Ou defina as variáveis de ambiente VITE_TURSO_DATABASE_URL e VITE_TURSO_AUTH_TOKEN');
    process.exit(1);
}

const client = createClient({
    url: url.startsWith('libsql://') ? url.replace('libsql://', 'https://') : url,
    authToken: authToken || undefined
});

async function main() {
    console.log('🚀 Conectando ao Turso em:', url);
    const sqlPath = path.join(__dirname, '..', 'turso_schema.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Split statements by semicolon
    const statements = sqlContent
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📋 Executando ${statements.length} instruções SQL no Turso...`);

    for (let i = 0; i < statements.length; i++) {
        const stmt = statements[i];
        try {
            await client.execute(stmt);
            console.log(`✅ [${i + 1}/${statements.length}] Executado com sucesso`);
        } catch (err) {
            console.warn(`⚠️ [${i + 1}/${statements.length}] Aviso na instrução:`, err.message);
        }
    }

    console.log('🎉 Banco de dados Turso inicializado com sucesso para o FitLife Academia!');
}

main().catch(err => {
    console.error('❌ Erro fatal:', err);
    process.exit(1);
});
