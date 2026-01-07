
import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase credentials in your local .env
// For this environment, we assume they are injected or provided via process.env
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project-id.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
