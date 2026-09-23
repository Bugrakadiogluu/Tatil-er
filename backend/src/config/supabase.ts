import { createClient, SupabaseClient } from '@supabase/supabase-js';
import ws from 'ws';
import { config } from './index';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  const url = config.database.supabaseUrl || process.env.SUPABASE_URL;
  const key = config.database.supabaseKey || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn('[Supabase] SUPABASE_URL or SUPABASE_ANON_KEY not configured.');
    return null;
  }

  try {
    supabaseClient = createClient(url, key, {
      auth: {
        persistSession: false,
      },
      realtime: {
        transport: ws as any,
      },
    });
    console.log('[Supabase] Connected to live Supabase project:', url);
    return supabaseClient;
  } catch (err: any) {
    console.error('[Supabase] Failed to initialize Supabase client:', err.message);
    return null;
  }
}
