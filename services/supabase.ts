
import { createClient } from '@supabase/supabase-js';

/**
 * In a static deployment (like GitHub Pages), process.env is usually not available 
 * at runtime unless injected during the build process. 
 * Ensure you have set these up in your build settings or replace them with 
 * hardcoded strings if you are deploying a public-facing non-sensitive demo.
 */

const getEnv = (key: string): string => {
    try {
        // @ts-ignore
        return process.env[key] || '';
    } catch (e) {
        return '';
    }
};

const supabaseUrl = getEnv('SUPABASE_URL') || 'https://your-project-id.supabase.co';
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY') || 'your-anon-key';

if (supabaseUrl.includes('your-project-id')) {
    console.warn("Supabase credentials not found. Please check your environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
