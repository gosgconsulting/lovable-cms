import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE

if (!url) {
  throw new Error('Missing Supabase env var: NEXT_PUBLIC_SUPABASE_URL')
}

// Service role is optional locally; only required for privileged tasks
export const supabaseServer = serviceKey
  ? createClient(url, serviceKey, { auth: { persistSession: false } })
  : undefined


