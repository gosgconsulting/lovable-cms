import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase-client'

type Params = { params: Promise<{ site: string }> }

export async function GET(_req: NextRequest, ctx: Params) {
  const { site } = await ctx.params

  try {
    const { data: s, error } = await supabase
      .from('sites')
      .select('id, tenant_id, slug')
      .eq('slug', site)
      .maybeSingle()

    if (error) throw error
    if (!s) return NextResponse.json({ ok: false, error: 'Unknown site' }, { status: 404 })

    const { data: settings } = await supabase
      .from('site_settings')
      .select('header, footer, colors, typography, theme_tokens')
      .eq('site_id', s.id)
      .maybeSingle()

    return NextResponse.json({ ok: true, data: settings ?? {} })
  } catch (e) {
    return NextResponse.json({ ok: true, data: {} })
  }
}


