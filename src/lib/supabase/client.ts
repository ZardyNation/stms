import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'YOUR_SUPABASE_URL') {
    throw new Error('Missing or placeholder Supabase credentials in .env.local. Please update them with your actual credentials.');
  }
  
  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
