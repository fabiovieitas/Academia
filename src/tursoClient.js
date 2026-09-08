import { createClient } from '@libsql/client/web';

const DEFAULT_TURSO_URL = 'libsql://academia-fabiovieitas.aws-ap-south-1.turso.io';
const DEFAULT_TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODg4NzM5OTgsImlkIjoiMDFhMDgxMjgtMWQwMS03ZWYxLThiNDgtMTA0MzMzN2Q4NzFmIiwia2lkIjoiekZRMlpBUnYxLVVNR2c1OGNFTWFiWGdkS3J4Y3FoeU9CTUpOVVdHVDBfOCIsInJpZCI6ImI2ODA0MmEwLTc4MzctNGY5MS04MDJlLWI4NjZmMzMwNWRkYyJ9.60uWXwwTuDPCGfNz5KDmw0dMupbRZMLWrdCJA1FULyj8kc1KUu9_kngz1woKCZXMG5vE9WyhV3e_85ebMdfmCQ';

const rawUrl = import.meta.env.VITE_TURSO_DATABASE_URL || DEFAULT_TURSO_URL;
const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN || DEFAULT_TURSO_TOKEN;

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
        console.log('⚡ Turso Database Client initialized successfully (Cloud DB).');
    } catch (err) {
        console.error('❌ Failed to initialize Turso client:', err);
    }
} else {
    console.warn('⚠️ Turso credentials not found. Running in Local-Only mode.');
}

export { turso };
