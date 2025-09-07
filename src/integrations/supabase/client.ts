import { createClient } from '@supabase/supabase-js'

// In Lovable projects with Supabase integration, these are automatically provided
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Fail fast in development, log once in production
if (!supabaseUrl || !supabaseAnonKey) {
  if (import.meta.env.DEV) {
    throw new Error('Missing Supabase environment variables. Please connect to Supabase via the integration.')
  } else {
    console.warn('Supabase not configured - features disabled')
  }
}

// Create a client that will work with Lovable's Supabase integration
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder', 
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)