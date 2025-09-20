// Centralized Supabase client
// Uses Vite env vars from peva/.env
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  // Helpful runtime message during dev
  // eslint-disable-next-line no-console
  console.warn('[Supabase] VITE_SUPABASE_URL is not defined. Check peva/.env')
}
if (!supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn('[Supabase] VITE_SUPABASE_ANON_KEY is not defined. Check peva/.env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default supabase
