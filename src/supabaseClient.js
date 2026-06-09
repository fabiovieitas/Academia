import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
    try {
        supabase = createClient(supabaseUrl, supabaseAnonKey);
        console.log('⚡ Supabase Client initialized successfully.');
    } catch (err) {
        console.error('❌ Failed to initialize Supabase client:', err);
    }
} else {
    console.warn(
        '⚠️ Supabase credentials not found. The app will run in Local-Only (localStorage) mode.\n' +
        'To enable cloud sync, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
    );
}

export { supabase };
