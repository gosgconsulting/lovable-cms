import { z } from 'zod'

const schema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
  SUPABASE_SERVICE_ROLE: z.string().min(20).optional(),
  DATABASE_URL: z.string().url().optional(),
})

const parsed = schema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE,
  DATABASE_URL: process.env.DATABASE_URL,
})

if (!parsed.success) {
  const formatted = parsed.error.format()
  throw new Error(`Invalid environment variables: ${JSON.stringify(formatted)}`)
}

export const envPublic = {
  NEXT_PUBLIC_SUPABASE_URL: parsed.data.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: parsed.data.NEXT_PUBLIC_SUPABASE_ANON_KEY,
}

export const envServer = {
  SUPABASE_SERVICE_ROLE: parsed.data.SUPABASE_SERVICE_ROLE,
  DATABASE_URL: parsed.data.DATABASE_URL,
}


