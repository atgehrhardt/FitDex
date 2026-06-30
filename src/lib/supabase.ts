import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** True when cloud auth is wired up (GitHub Actions secrets or local .env). */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

let client: SupabaseClient | null = null

if (isSupabaseConfigured) {
  client = createClient(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      flowType: 'pkce',
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
}

export const supabase = client

/** Redirect target for email confirmation & password reset links. */
export function getAuthRedirectUrl(): string {
  const base = import.meta.env.BASE_URL ?? '/'
  const path = base.endsWith('/') ? base : `${base}/`
  return `${window.location.origin}${path}`
}
