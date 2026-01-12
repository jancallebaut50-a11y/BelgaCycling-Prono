
import { createClient } from '@supabase/supabase-js';

/**
 * In a static deployment (like GitHub Pages), process.env is usually not available 
 * at runtime unless injected during the build process. 
 */

const getEnv = (key: string): string => {
    // Safer check for process to avoid "process is not defined" ReferenceError
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
        return process.env[key];
    }
    return '';
};

// IMPORTANT: Replace these with your actual Supabase Project URL and Anon Key 
// if you are not using an automated build system that injects them.
const supabaseUrl = getEnv('SUPABASE_URL') || 'https://your-project-id.supabase.co';
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY') || 'your-anon-key';

if (supabaseUrl.includes('your-project-id')) {
    console.error("CRITICAL: Supabase credentials are missing! Please update services/supabase.ts with your actual Project URL and Anon Key.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
